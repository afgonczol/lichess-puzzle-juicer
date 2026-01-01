// Type declarations for cm-chessboard
declare module 'cm-chessboard' {
    export const FEN: {
        start: string;
        empty: string;
    };

    export const COLOR: {
        white: 'w';
        black: 'b';
    };

    export const INPUT_EVENT_TYPE: {
        moveInputStarted: string;
        validateMoveInput: string;
        moveInputCanceled: string;
        moveInputFinished: string;
        movingOverSquare: string;
    };

    export interface ChessboardConfig {
        position?: string;
        assetsUrl?: string;
        orientation?: 'w' | 'b';
        style?: {
            cssClass?: string;
            showCoordinates?: boolean;
            borderType?: string;
        };
        extensions?: Array<{ class: any; props?: any }>;
    }

    export class Chessboard {
        constructor(element: HTMLElement, config?: ChessboardConfig);
        setPosition(fen: string, animated?: boolean): Promise<void>;
        getPosition(): string;
        setOrientation(color: 'w' | 'b'): void;
        getOrientation(): 'w' | 'b';
        setPiece(square: string, piece: string | null, animated?: boolean): Promise<void>;
        getPiece(square: string): string | null;
        movePiece(from: string, to: string, animated?: boolean): Promise<void>;
        enableMoveInput(
            eventHandler: (event: any) => boolean | void,
            color?: 'w' | 'b'
        ): void;
        disableMoveInput(): void;
        getExtension(extensionClass: any): any;
        destroy(): void;
    }
}

declare module 'cm-chessboard/src/extensions/markers/Markers' {
    export const MARKER_TYPE: {
        frame: any;
        square: any;
        dot: any;
        circle: any;
        arrow: any;
    };

    export class Markers {
        addMarker(type: any, square: string, options?: any): void;
        removeMarkers(type?: any, square?: string): void;
    }
}
