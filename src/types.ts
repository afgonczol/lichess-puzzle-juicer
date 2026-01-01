// Puzzle data types from Lichess database format
export interface Puzzle {
    id: string;
    fen: string;
    moves: string[];      // UCI format: ["e8d7", "a2e6"]
    rating: number;
    ratingDeviation: number;
    popularity: number;
    themes: string[];     // ["mate", "fork", "pin"]
    gameUrl: string;
}

// Game state types
export type MoveResult = 'correct' | 'incorrect' | 'good-but-better' | 'complete';

export type PuzzleStatus = 'loading' | 'playing' | 'solved' | 'failed';

export interface PuzzleState {
    current: Puzzle | null;
    moveIndex: number;
    status: PuzzleStatus;
    feedback: string;
    playerColor: 'white' | 'black';
}

export interface UserStats {
    streak: number;
    maxStreak: number;
    totalSolved: number;
    totalFailed: number;
    failedPuzzleIds: string[];
    lastPlayedDate: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
}

export interface FilterSettings {
    minRating: number;
    maxRating: number;
    selectedThemes: string[];
}

// Event types for state updates
export type GameEvent =
    | { type: 'PUZZLE_LOADED'; puzzle: Puzzle }
    | { type: 'MOVE_MADE'; result: MoveResult }
    | { type: 'PUZZLE_COMPLETE'; success: boolean }
    | { type: 'FILTERS_CHANGED'; filters: FilterSettings }
    | { type: 'STATS_UPDATED'; stats: UserStats };

// Available puzzle themes
export const PUZZLE_THEMES = [
    'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5',
    'fork', 'pin', 'skewer', 'discoveredAttack',
    'sacrifice', 'deflection', 'attraction', 'clearance',
    'backRankMate', 'smotheredMate', 'hookMate', 'anastasiasMate',
    'hangingPiece', 'trappedPiece', 'exposedKing',
    'endgame', 'middlegame', 'opening',
    'short', 'long', 'veryLong',
    'quiet', 'defensive', 'zugzwang'
] as const;

export type PuzzleTheme = typeof PUZZLE_THEMES[number];

// Theme display names with icons
export const THEME_DISPLAY: Record<string, { name: string; icon: string }> = {
    mate: { name: 'Checkmate', icon: '👑' },
    mateIn1: { name: 'Mate in 1', icon: '1️⃣' },
    mateIn2: { name: 'Mate in 2', icon: '2️⃣' },
    fork: { name: 'Fork', icon: '⚔️' },
    pin: { name: 'Pin', icon: '📌' },
    skewer: { name: 'Skewer', icon: '🗡️' },
    discoveredAttack: { name: 'Discovered Attack', icon: '💥' },
    sacrifice: { name: 'Sacrifice', icon: '🎁' },
    backRankMate: { name: 'Back Rank Mate', icon: '🏰' },
    smotheredMate: { name: 'Smothered Mate', icon: '🤐' },
    endgame: { name: 'Endgame', icon: '🏁' },
    middlegame: { name: 'Middlegame', icon: '⚔️' },
    short: { name: 'Short', icon: '⚡' },
    long: { name: 'Long', icon: '📏' },
    quiet: { name: 'Quiet Move', icon: '🤫' },
    defensive: { name: 'Defensive', icon: '🛡️' },
    hangingPiece: { name: 'Hanging Piece', icon: '👋' },
    trappedPiece: { name: 'Trapped Piece', icon: '🪤' },
    zugzwang: { name: 'Zugzwang', icon: '😰' }
};
