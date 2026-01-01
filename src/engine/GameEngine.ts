import { Chess, Move } from 'chess.js';
import type { MoveResult } from '../types';

export class GameEngine {
    private chess: Chess;

    constructor() {
        this.chess = new Chess();
    }

    /**
     * Load a position from FEN string
     */
    loadPosition(fen: string): boolean {
        try {
            this.chess.load(fen);
            return true;
        } catch (error) {
            console.error('Invalid FEN:', fen, error);
            return false;
        }
    }

    /**
     * Get current FEN
     */
    getFen(): string {
        return this.chess.fen();
    }

    /**
     * Get position-only FEN (for board display)
     */
    getPositionFen(): string {
        // Return only the piece placement part of FEN
        return this.chess.fen().split(' ')[0];
    }

    /**
     * Get whose turn it is
     */
    getTurn(): 'white' | 'black' {
        return this.chess.turn() === 'w' ? 'white' : 'black';
    }

    /**
     * Check if a move is legal
     */
    isLegalMove(from: string, to: string, promotion?: string): boolean {
        const moves = this.chess.moves({ verbose: true });
        return moves.some(move =>
            move.from === from &&
            move.to === to &&
            (!promotion || move.promotion === promotion)
        );
    }

    /**
     * Get all legal moves from a square
     */
    getLegalMovesFrom(square: string): string[] {
        const moves = this.chess.moves({ square: square as any, verbose: true });
        return moves.map(m => m.to);
    }

    /**
     * Make a move on the board
     * Returns the move object if successful, null if illegal
     */
    makeMove(from: string, to: string, promotion?: string): Move | null {
        try {
            const move = this.chess.move({
                from,
                to,
                promotion: promotion || undefined
            });
            return move;
        } catch {
            return null;
        }
    }

    /**
     * Undo the last move
     */
    undoMove(): Move | null {
        return this.chess.undo();
    }

    /**
     * Get the last move played
     */
    getLastMove(): Move | undefined {
        const history = this.chess.history({ verbose: true });
        return history.length > 0 ? history[history.length - 1] : undefined;
    }

    /**
     * Convert UCI move string (e.g., "e2e4") to from/to squares
     */
    static parseUciMove(uci: string): { from: string; to: string; promotion?: string } {
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci.length > 4 ? uci[4] : undefined;
        return { from, to, promotion };
    }

    /**
     * Convert move to UCI format
     */
    static toUci(from: string, to: string, promotion?: string): string {
        return from + to + (promotion || '');
    }

    /**
     * Check user move against expected solution move
     */
    checkSolution(
        userFrom: string,
        userTo: string,
        expectedUci: string,
        userPromotion?: string
    ): MoveResult {
        const userUci = GameEngine.toUci(userFrom, userTo, userPromotion);
        const expected = GameEngine.parseUciMove(expectedUci);
        const expectedUciNormalized = GameEngine.toUci(expected.from, expected.to, expected.promotion);

        // Check if move matches exactly
        if (userUci === expectedUciNormalized) {
            return 'correct';
        }

        // Check for alternative Mate (Any move that causes checkmate is a valid solution)
        const move = this.makeMove(userFrom, userTo, userPromotion);
        if (move) {
            const isMate = this.isCheckmate();
            this.undoMove(); // Revert checking state

            if (isMate) {
                return 'correct';
            }
        }

        // In strict puzzle mode, any other move is incorrect
        return 'incorrect';
    }

    /**
     * Check if it's checkmate
     */
    isCheckmate(): boolean {
        return this.chess.isCheckmate();
    }

    /**
     * Check if it's check
     */
    isCheck(): boolean {
        return this.chess.isCheck();
    }

    /**
     * Check if it's stalemate
     */
    isStalemate(): boolean {
        return this.chess.isStalemate();
    }

    /**
     * Check if game is over
     */
    isGameOver(): boolean {
        return this.chess.isGameOver();
    }

    /**
     * Check if a square is occupied and by which color
     */
    getPieceAt(square: string): { type: string; color: 'white' | 'black' } | null {
        const piece = this.chess.get(square as any);
        if (!piece) return null;
        return {
            type: piece.type,
            color: piece.color === 'w' ? 'white' : 'black'
        };
    }

    /**
     * Check if move requires promotion
     */
    isPromotionMove(from: string, to: string): boolean {
        const piece = this.chess.get(from as any);
        if (!piece || piece.type !== 'p') return false;

        const toRank = to[1];
        return (piece.color === 'w' && toRank === '8') ||
            (piece.color === 'b' && toRank === '1');
    }

    /**
     * Reset the board to starting position
     */
    reset(): void {
        this.chess.reset();
    }
}

// Singleton instance
export const gameEngine = new GameEngine();
