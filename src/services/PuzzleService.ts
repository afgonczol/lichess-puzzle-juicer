import type { Puzzle, FilterSettings } from '../types';
import puzzleData from '../data/puzzles.json';

export class PuzzleService {
    private puzzles: Puzzle[] = puzzleData as Puzzle[];
    private queue: Puzzle[] = [];
    private currentFilters: FilterSettings = {
        minRating: 800,
        maxRating: 2200,
        selectedThemes: []
    };

    constructor() {
        this.shuffleQueue();
    }

    /**
     * Filter puzzles by rating range and themes
     */
    getPuzzles(minRating: number, maxRating: number, themes?: string[]): Puzzle[] {
        return this.puzzles.filter(puzzle => {
            // Rating filter
            if (puzzle.rating < minRating || puzzle.rating > maxRating) {
                return false;
            }

            // Theme filter (if specified, puzzle must have at least one matching theme)
            if (themes && themes.length > 0) {
                const hasMatchingTheme = themes.some(theme =>
                    puzzle.themes.includes(theme)
                );
                if (!hasMatchingTheme) return false;
            }

            return true;
        });
    }

    /**
     * Apply new filters and rebuild the queue
     */
    setFilters(filters: FilterSettings): void {
        this.currentFilters = filters;
        this.shuffleQueue();
    }

    /**
     * Get current filter settings
     */
    getFilters(): FilterSettings {
        return { ...this.currentFilters };
    }

    /**
     * Get the next puzzle from the queue (infinite mode)
     */
    getNextPuzzle(): Puzzle | null {
        if (this.queue.length === 0) {
            this.shuffleQueue();
        }

        if (this.queue.length === 0) {
            return null; // No puzzles match current filters
        }

        return this.queue.shift() || null;
    }

    /**
     * Get a specific puzzle by ID
     */
    getPuzzleById(id: string): Puzzle | null {
        return this.puzzles.find(p => p.id === id) || null;
    }

    /**
     * Shuffle and refill the puzzle queue based on current filters
     * Loads only 10 puzzles at a time for performance
     */
    shuffleQueue(): void {
        const filtered = this.getPuzzles(
            this.currentFilters.minRating,
            this.currentFilters.maxRating,
            this.currentFilters.selectedThemes.length > 0
                ? this.currentFilters.selectedThemes
                : undefined
        );

        // Fisher-Yates shuffle
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Only load 10 puzzles at a time
        this.queue = shuffled.slice(0, 10);
    }

    /**
     * Get queue size for infinite mode status
     */
    getQueueSize(): number {
        return this.queue.length;
    }

    /**
     * Get total number of puzzles matching current filters
     */
    getMatchingPuzzleCount(): number {
        return this.getPuzzles(
            this.currentFilters.minRating,
            this.currentFilters.maxRating,
            this.currentFilters.selectedThemes.length > 0
                ? this.currentFilters.selectedThemes
                : undefined
        ).length;
    }

    /**
     * Get all available themes from the puzzle set
     */
    getAvailableThemes(): string[] {
        const themes = new Set<string>();
        this.puzzles.forEach(puzzle => {
            puzzle.themes.forEach(theme => themes.add(theme));
        });
        return Array.from(themes).sort();
    }

    /**
     * Get rating range from the puzzle set
     */
    getRatingRange(): { min: number; max: number } {
        const ratings = this.puzzles.map(p => p.rating);
        return {
            min: Math.min(...ratings),
            max: Math.max(...ratings)
        };
    }
}

// Singleton instance
export const puzzleService = new PuzzleService();
