import type { UserStats } from '../types';

const STORAGE_KEYS = {
    STATS: 'chess_puzzle_stats',
    PROGRESS: 'chess_puzzle_progress',
    FILTERS: 'chess_puzzle_filters'
} as const;

const DEFAULT_STATS: UserStats = {
    streak: 0,
    maxStreak: 0,
    totalSolved: 0,
    totalFailed: 0,
    failedPuzzleIds: [],
    lastPlayedDate: '',
    level: 1,
    xp: 0,
    xpToNextLevel: 100
};

export class LocalStorageService {

    /**
     * Save user stats
     */
    saveStats(stats: UserStats): void {
        try {
            localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        } catch (error) {
            console.error('Failed to save stats:', error);
        }
    }

    /**
     * Load user stats
     */
    loadStats(): UserStats {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.STATS);
            if (data) {
                return { ...DEFAULT_STATS, ...JSON.parse(data) };
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
        return { ...DEFAULT_STATS };
    }

    /**
     * Save current puzzle progress (for resuming after refresh)
     */
    saveProgress(puzzleId: string, moveIndex: number): void {
        try {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({
                puzzleId,
                moveIndex,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    /**
     * Load puzzle progress
     */
    loadProgress(): { puzzleId: string; moveIndex: number } | null {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
            if (data) {
                const progress = JSON.parse(data);
                // Only restore if less than 1 hour old
                if (Date.now() - progress.timestamp < 3600000) {
                    return {
                        puzzleId: progress.puzzleId,
                        moveIndex: progress.moveIndex
                    };
                }
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
        return null;
    }

    /**
     * Clear puzzle progress
     */
    clearProgress(): void {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    }

    /**
     * Add a failed puzzle ID
     */
    addFailedPuzzle(puzzleId: string): void {
        const stats = this.loadStats();
        if (!stats.failedPuzzleIds.includes(puzzleId)) {
            stats.failedPuzzleIds.push(puzzleId);
            // Keep only last 100 failed puzzles
            if (stats.failedPuzzleIds.length > 100) {
                stats.failedPuzzleIds = stats.failedPuzzleIds.slice(-100);
            }
            this.saveStats(stats);
        }
    }

    /**
     * Remove a failed puzzle (after re-solving)
     */
    removeFailedPuzzle(puzzleId: string): void {
        const stats = this.loadStats();
        stats.failedPuzzleIds = stats.failedPuzzleIds.filter(id => id !== puzzleId);
        this.saveStats(stats);
    }

    /**
     * Get all failed puzzle IDs
     */
    getFailedPuzzles(): string[] {
        return this.loadStats().failedPuzzleIds;
    }

    /**
     * Update streak (call on solve success/failure)
     */
    updateStreak(solved: boolean): UserStats {
        const stats = this.loadStats();
        const today = new Date().toISOString().split('T')[0];

        if (solved) {
            stats.streak++;
            stats.totalSolved++;
            if (stats.streak > stats.maxStreak) {
                stats.maxStreak = stats.streak;
            }
        } else {
            stats.streak = 0;
            stats.totalFailed++;
        }

        stats.lastPlayedDate = today;
        this.saveStats(stats);
        return stats;
    }

    /**
     * Reset all stats
     */
    resetStats(): void {
        this.saveStats({ ...DEFAULT_STATS });
        this.clearProgress();
    }

    /**
     * Save filter settings
     */
    saveFilters(filters: { minRating: number; maxRating: number; themes: string[] }): void {
        try {
            localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
        } catch (error) {
            console.error('Failed to save filters:', error);
        }
    }

    /**
     * Load filter settings
     */
    loadFilters(): { minRating: number; maxRating: number; themes: string[] } | null {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.FILTERS);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load filters:', error);
        }
        return null;
    }
}

// Singleton instance
export const storageService = new LocalStorageService();
