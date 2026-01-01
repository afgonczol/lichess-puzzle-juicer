# ♟️ Chess Puzzle Trainer (Juice Edition)

A high-performance, browser-native Chess Puzzle Trainer built with **Vite**, **TypeScript**, and **Lichess** open data.

Featured in the "Juicing Chess Puzzles" project, this app takes standard puzzle solving and adds a massive dose of "Juice":
-   **XP & Leveling System**: Earn XP, streak bonuses, and level up with massive fanfare!
-   **Impact Glitch**: Feel the crunch of every capture as the board distorts.
-   **Check Pulse**: The King pulses red when in danger.
-   **Infinite Mode**: Puzzles never end.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🛠️ Scripts

-   `npm run dev`: Start dev server
-   `npm run build`: Build for production
-   `npm run convert:data`: Regenerate `src/data/puzzles.json` from `src/data/raw_puzzles.csv`.

## 🎮 Features

-   **Rating & Theme Filters**: Train specific skills (Mate in 1, Pin, Fork, etc.) at your level.
-   **Alternative Solutions**: Found a different mate than the puzzle intended? It counts! (Checks for immediate checkmate).
-   **Review Mode**: Retry failed puzzles to learn from your mistakes.
-   **PWA Ready**: Fast, responsive, and mobile-friendly.

## 🤝 Attribution

-   **Puzzle Data**: [Lichess Open Database](https://database.lichess.org/#puzzles) (CC0).
-   **Piece Sets**: [Lichess](https://github.com/ornicar/lila) & [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces).
-   **Icons**: [Phosphor Icons](https://phosphoricons.com/).
