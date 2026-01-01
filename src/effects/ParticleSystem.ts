export class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private animationId: number | null = null;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // Click-through
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d')!;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    private resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnConfetti(x: number, y: number, count: number = 50) {
        const colors = ['#00d4ff', '#9945ff', '#ffffff', '#ffd700', '#ff0055'];

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 1) * 10 - 5, // Upward burst
                gravity: 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 2,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        if (!this.animationId) {
            this.loop();
        }
    }

    spawnShatter(x: number, y: number, color: string) {
        // Shatter effect for piece capture
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                gravity: 0.1,
                color: color === 'white' ? '#ffffff' : '#000000',
                stroke: '#8899aa', // Add stroke for visibility
                size: Math.random() * 4 + 1,
                life: 0.6,
                decay: 0.03,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15
            });
        }

        if (!this.animationId) {
            this.loop();
        }
    }

    spawnLevelUp(x: number, y: number) {
        // Massive explosion for level up
        const colors = ['#00d4ff', '#9945ff', '#00ff88', '#ff4466', '#ffcc00', '#ffffff'];

        for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 15 + 5;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                gravity: 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                life: 2.0,
                decay: Math.random() * 0.01 + 0.005,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20
            });
        }

        if (!this.animationId) {
            this.loop();
        }
    }

    spawnPulse(x: number, y: number, color: string = '#ff4466') {
        // Pulse ring effect for check
        // We'll simulate a ring with particles expanding outward
        const particleCount = 20;
        const radius = 5;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            this.particles.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                gravity: 0,
                color: color,
                size: 3,
                life: 0.8,
                decay: 0.02,
                rotation: 0,
                rotationSpeed: 0
            });
        }

        if (!this.animationId) {
            this.loop();
        }
    }

    private loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= p.decay;
            p.rotation += p.rotationSpeed;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            if (p.stroke) {
                this.ctx.strokeStyle = p.stroke;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.loop());
        } else {
            this.animationId = null;
        }
    }
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravity: number;
    color: string;
    stroke?: string;
    size: number;
    life: number;
    decay: number;
    rotation: number;
    rotationSpeed: number;
}

export const particleSystem = new ParticleSystem();
