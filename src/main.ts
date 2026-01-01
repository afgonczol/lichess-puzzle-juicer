import './style.css';
import { puzzleService } from './services/PuzzleService';
import { gameEngine, GameEngine } from './engine/GameEngine';
import { storageService } from './services/LocalStorageService';
import { soundManager } from './services/SoundManager';
import { particleSystem } from './effects/ParticleSystem';
import type { Puzzle, PuzzleState, UserStats } from './types';
import { THEME_DISPLAY } from './types';


// SVG Piece definitions (Standard Cburnett)
const PIECES: Record<string, string> = {
  wP: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" stroke-width="1.5" fill="#fff" /></svg>',
  wN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke="#000" stroke-width="1.5" fill="#fff" /><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" stroke="#000" stroke-width="1.5" fill="#fff" /><path d="M9.5 25.5A.5.5 0 1 1 8.5 25.5A.5.5 0 1 1 9.5 25.5z" fill="#000" stroke="#000" stroke-width="1.5" /><path d="M15 15.5A.5.5 0 1 1 14 15.5A.5.5 0 1 1 15 15.5z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="#000" stroke="#000" stroke-width="1.5" /></svg>',
  wB: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="#fff" stroke-linecap="butt" /><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#fff" stroke-linecap="butt" /><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#fff" /><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter" /></g></svg>',
  wR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M11 14h23" fill="none" stroke-linejoin="miter" /></g></svg>',
  wQ: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt" /><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt" /><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" /></g></svg>',
  wK: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff" /><path d="M12.5 30c5.5-3 14.5-3 20 0M12.5 33.5c5.5-3 14.5-3 20 0M12.5 37c5.5-3 14.5-3 20 0" /></g></svg>',
  bP: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" stroke-width="1.5" fill="#000" /></svg>',
  bN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke="#000" stroke-width="1.5" fill="#000" /><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" stroke="#000" stroke-width="1.5" fill="#000" /><path d="M9.5 25.5A.5.5 0 1 1 8.5 25.5A.5.5 0 1 1 9.5 25.5z" fill="#fff" stroke="#fff" stroke-width="1.5" /><path d="M15 15.5A.5.5 0 1 1 14 15.5A.5.5 0 1 1 15 15.5z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="#fff" stroke="#fff" stroke-width="1.5" /></svg>',
  bB: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" /><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" /><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" /></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter" /></g></svg>',
  bR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M11 14h23" fill="none" stroke="#fff" stroke-linejoin="miter" /></g></svg>',
  bQ: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt" /><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt" /><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt" /><path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h21m-21 3a35 35 1 0 0 22 0" fill="none" stroke="#fff" /></g></svg>',
  bK: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#000" /><path d="M12.5 30c5.5-3 14.5-3 20 0M12.5 33.5c5.5-3 14.5-3 20 0M12.5 37c5.5-3 14.5-3 20 0" stroke="#fff" /></g></svg>'
};

// Application State
let state: PuzzleState = {
  current: null,
  moveIndex: 0,
  status: 'loading',
  feedback: '',
  playerColor: 'white'
};

let stats: UserStats;
let selectedSquare: string | null = null;
let boardOrientation: 'white' | 'black' = 'white';

// Move history for navigation - stores FEN positions
let moveHistory: string[] = [];
let viewIndex: number = 0; // Current view position in history
let isViewingHistory: boolean = false; // True if viewing past position

// Drag state
let dragState: {
  piece: HTMLElement | null;
  square: string | null;
  startX: number;
  startY: number;
} | null = null;

// DOM Elements
const elements = {
  board: document.getElementById('board')!,
  feedback: document.getElementById('feedback-text')!,
  streak: document.getElementById('streak')!,
  solved: document.getElementById('solved')!,
  maxStreak: document.getElementById('max-streak')!,
  failed: document.getElementById('failed')!,
  puzzleRating: document.getElementById('puzzle-rating')!,
  turnInstruction: document.getElementById('turn-instruction')!,
  currentMove: document.getElementById('current-move')!,
  totalMoves: document.getElementById('total-moves')!,
  themeReveal: document.getElementById('theme-reveal')!,
  themeTags: document.getElementById('theme-tags')!,
  gameLink: document.getElementById('game-link')! as HTMLAnchorElement,
  ratingDisplay: document.getElementById('rating-display')!,
  minRating: document.getElementById('min-rating')! as HTMLInputElement,
  maxRating: document.getElementById('max-rating')! as HTMLInputElement,
  themeSelect: document.getElementById('theme-select')! as HTMLSelectElement,
  puzzleCount: document.getElementById('puzzle-count')!,
  nextBtn: document.getElementById('next-btn')!,
  skipBtn: document.getElementById('skip-btn')!,
  hintBtn: document.getElementById('hint-btn')!,
  applyFiltersBtn: document.getElementById('apply-filters-btn')!,
  reviewFailedBtn: document.getElementById('review-failed-btn')!,
  backBtn: document.getElementById('back-btn')! as HTMLButtonElement,
  forwardBtn: document.getElementById('forward-btn')! as HTMLButtonElement,
  levelBadge: document.getElementById('level-badge')!,
  xpText: document.getElementById('xp-text')!,
  xpBar: document.getElementById('xp-bar')!
};

// XP Configuration
const XP_BASE = 10;
const XP_STREAK_BONUS = 2; // XP per streak count
const XP_RATING_MULTIPLIER = 0.01; // 1% of rating as bonus

// Initialize the application
function init() {
  // Load stats
  stats = storageService.loadStats();
  updateStatsDisplay();

  // Load saved filters
  const savedFilters = storageService.loadFilters();
  if (savedFilters) {
    elements.minRating.value = savedFilters.minRating.toString();
    elements.maxRating.value = savedFilters.maxRating.toString();
    if (savedFilters.themes.length > 0) {
      elements.themeSelect.value = savedFilters.themes[0];
    }
    puzzleService.setFilters({
      minRating: savedFilters.minRating,
      maxRating: savedFilters.maxRating,
      selectedThemes: savedFilters.themes
    });
  }

  updateRatingDisplay();
  updatePuzzleCount();

  // Set up event listeners
  setupEventListeners();

  // Load first puzzle
  loadNextPuzzle();
}

function renderBoard() {
  const position = gameEngine.getPositionFen();
  const lastMove = gameEngine.getLastMove();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Adjust for orientation
  const displayFiles = boardOrientation === 'white' ? files : [...files].reverse();
  const displayRanks = boardOrientation === 'white' ? ranks : [...ranks].reverse();

  const rows = position.split('/');

  let html = '<div class="chess-board">';

  displayRanks.forEach((rank, rankIdx) => {
    const actualRankIdx = boardOrientation === 'white' ? rankIdx : 7 - rankIdx;
    const row = rows[actualRankIdx];
    let fileIdx = 0;

    for (const char of row) {
      if (/\d/.test(char)) {
        // Empty squares
        const emptyCount = parseInt(char);
        for (let i = 0; i < emptyCount; i++) {
          const file = displayFiles[fileIdx];
          const actualFile = boardOrientation === 'white' ? file : files[7 - files.indexOf(file)];
          const square = actualFile + rank;
          const isLight = (files.indexOf(actualFile) + parseInt(rank)) % 2 === 1;
          const isSelected = selectedSquare === square;
          const isLegalMove = selectedSquare && gameEngine.getLegalMovesFrom(selectedSquare).includes(square);
          const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

          html += `<div class="square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLastMove ? 'last-move' : ''} ${isLegalMove ? 'legal-move' : ''}" data-square="${square}"></div>`;
          fileIdx++;
        }
      } else {
        // Piece
        const file = displayFiles[fileIdx];
        const actualFile = boardOrientation === 'white' ? file : files[7 - files.indexOf(file)];
        const square = actualFile + rank;
        const isLight = (files.indexOf(actualFile) + parseInt(rank)) % 2 === 1;
        const isSelected = selectedSquare === square;
        const isLegalMove = selectedSquare && gameEngine.getLegalMovesFrom(selectedSquare).includes(square);
        const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

        const color = char === char.toUpperCase() ? 'w' : 'b';
        const pieceKey = color + char.toUpperCase();

        let pieceSvg = PIECES[pieceKey] || '';

        // If this piece is being dragged, make it invisible on the board
        if (dragState && dragState.square === square) {
          // We can't just not render it because the ghost clone needs the HTML
          // But wait, the ghost is cloned BEFORE this render
          // So we can make it transparent/hidden here
          // However, if we change the HTML structure, it might affect things?
          // No, we are regenerating the whole board.
          // Let's wrap it in a hidden class or just don't include the SVG
          // But better to include it with opacity 0 so the square size/layout is stable? 
          // Actually squares are div blocks, SVG is inside.
          // Let's just wrap SVG in style opacity 0
          pieceSvg = `<div style="opacity: 0">${pieceSvg}</div>`;
        }

        html += `<div class="square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLastMove ? 'last-move' : ''} ${isLegalMove ? 'legal-move' : ''}" data-square="${square}">${pieceSvg}</div>`;
        fileIdx++;
      }
    }
  });

  html += '</div>';
  elements.board.innerHTML = html;

  html += '</div>';
  elements.board.innerHTML = html;

  // Add click and drag handlers
  elements.board.querySelectorAll('.square').forEach(sq => {
    const square = sq.getAttribute('data-square')!;

    // Click handling
    sq.addEventListener('click', () => {
      // Prevent click if we just finished dragging
      if (dragState) return;
      handleSquareClick(square);
    });

    // Drag handling
    sq.addEventListener('mousedown', (e) => handleDragStart(e as MouseEvent, square));

    // Mobile touch support could be added here similar to mousedown
  });
}

function handleDragStart(e: MouseEvent, square: string) {
  if (state.status !== 'playing' || isViewingHistory) return;

  const piece = gameEngine.getPieceAt(square);
  if (!piece || piece.color !== state.playerColor) return;

  // Prevent default selection
  e.preventDefault();

  const squareElement = e.currentTarget as HTMLElement;
  const rect = squareElement.getBoundingClientRect();

  // Clone piece for dragging
  const ghost = document.createElement('div');
  ghost.innerHTML = squareElement.innerHTML;
  ghost.style.position = 'absolute';
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.left = `${rect.left}px`; // Start exactly where piece is
  ghost.style.top = `${rect.top}px`;
  ghost.style.pointerEvents = 'none'; // Allow events to pass through to check conversion
  ghost.style.zIndex = '1000';
  ghost.style.opacity = '0.8';
  ghost.classList.add('dragging-piece'); // For potential custom styling

  document.body.appendChild(ghost);

  dragState = {
    piece: ghost,
    square: square,
    startX: e.clientX,
    startY: e.clientY
  };

  // Select square visually
  selectedSquare = square;
  renderBoard(); // Renders original piece still (standard behavior)

  // Add document listeners
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);
}

function handleDragMove(e: MouseEvent) {
  if (!dragState || !dragState.piece) return;

  // Move the ghost piece relative to cursor
  // We want the piece to center on cursor or follow it. 
  // Let's make it follow cursor with offset calculated from start

  // Actually simplest is to just center it on cursor or keep relative offset
  // Let's just center it on cursor for smoother feel
  const w = dragState.piece.offsetWidth;
  const h = dragState.piece.offsetHeight;

  dragState.piece.style.left = `${e.clientX - w / 2}px`;
  dragState.piece.style.top = `${e.clientY - h / 2}px`;
}

function handleDragEnd(e: MouseEvent) {
  if (!dragState) return;

  // Remove ghost
  if (dragState.piece) {
    document.body.removeChild(dragState.piece);
  }

  // Find square under cursor
  // We need to hide the ghost temporarily or rely on pointer-events: none (which we set)
  const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
  const squareElement = elementUnder?.closest('.square');

  if (squareElement) {
    const targetSquare = squareElement.getAttribute('data-square');
    if (targetSquare && dragState.square && targetSquare !== dragState.square) {
      // Attempt move
      const legalMoves = gameEngine.getLegalMovesFrom(dragState.square);
      if (legalMoves.includes(targetSquare)) {
        handlePlayerMove(dragState.square, targetSquare);
        selectedSquare = null; // Unselect after successful drag move
      } else {
        // Invalid move, just unselect? Or keep selected?
        // Usually good to keep selected if dropped on invalid square so they can click valid one
      }
    }
  }

  // Cleanup
  dragState = null;
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', handleDragEnd);

  renderBoard();
}

function handleSquareClick(square: string) {
  if (state.status !== 'playing') return;

  // If viewing history, clicking returns to current position
  if (isViewingHistory) {
    viewIndex = moveHistory.length - 1;
    isViewingHistory = false;
    renderBoard();
    updateNavigationState();
    setFeedback('Your turn - find the best move!', 'hint');
    return;
  }

  const piece = gameEngine.getPieceAt(square);

  if (selectedSquare) {
    // Try to make a move
    if (selectedSquare !== square) {
      const legalMoves = gameEngine.getLegalMovesFrom(selectedSquare);
      if (legalMoves.includes(square)) {
        handlePlayerMove(selectedSquare, square);
      }
    }
    selectedSquare = null;
    renderBoard();
  } else if (piece && piece.color === state.playerColor) {
    // Select piece
    selectedSquare = square;
    renderBoard();
  }
}

function setupEventListeners() {
  // Rating sliders
  elements.minRating.addEventListener('input', updateRatingDisplay);
  elements.maxRating.addEventListener('input', updateRatingDisplay);

  // Apply filters button
  elements.applyFiltersBtn.addEventListener('click', applyFilters);

  // Action buttons
  elements.nextBtn.addEventListener('click', loadNextPuzzle);
  elements.skipBtn.addEventListener('click', skipPuzzle);
  elements.hintBtn.addEventListener('click', showHint);
  elements.reviewFailedBtn.addEventListener('click', reviewFailedPuzzles);

  // Navigation buttons
  elements.backBtn.addEventListener('click', goBack);
  elements.forwardBtn.addEventListener('click', goForward);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

    switch (e.key.toLowerCase()) {
      case 'n':
        if (state.status === 'solved' || state.status === 'failed') {
          loadNextPuzzle();
        }
        break;
      case 'h':
        showHint();
        break;
      case 's':
        skipPuzzle();
        break;
      case 'arrowleft':
        goBack();
        break;
      case 'arrowright':
        goForward();
        break;
    }
  });
}

// Navigate back through move history
function goBack() {
  if (viewIndex > 0) {
    viewIndex--;
    isViewingHistory = true;
    renderBoardFromHistory();
    updateNavigationState();
  }
}

// Navigate forward through move history
function goForward() {
  if (viewIndex < moveHistory.length - 1) {
    viewIndex++;
    renderBoardFromHistory();
    // If we're at the latest move, exit history mode
    if (viewIndex === moveHistory.length - 1) {
      isViewingHistory = false;
    }
    updateNavigationState();
  }
}

// Render board from history position
function renderBoardFromHistory() {
  const fen = moveHistory[viewIndex];
  if (!fen) return;

  const position = fen.split(' ')[0];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = boardOrientation === 'white' ? files : [...files].reverse();
  const displayRanks = boardOrientation === 'white' ? ranks : [...ranks].reverse();

  const rows = position.split('/');

  let html = '<div class="chess-board">';

  displayRanks.forEach((rank, rankIdx) => {
    const actualRankIdx = boardOrientation === 'white' ? rankIdx : 7 - rankIdx;
    const row = rows[actualRankIdx];
    let fileIdx = 0;

    for (const char of row) {
      if (/\d/.test(char)) {
        const emptyCount = parseInt(char);
        for (let i = 0; i < emptyCount; i++) {
          const file = displayFiles[fileIdx];
          const actualFile = boardOrientation === 'white' ? file : files[7 - files.indexOf(file)];
          const square = actualFile + rank;
          const isLight = (files.indexOf(actualFile) + parseInt(rank)) % 2 === 1;
          html += `<div class="square ${isLight ? 'light' : 'dark'} history-view" data-square="${square}"></div>`;
          fileIdx++;
        }
      } else {
        const file = displayFiles[fileIdx];
        const actualFile = boardOrientation === 'white' ? file : files[7 - files.indexOf(file)];
        const square = actualFile + rank;
        const isLight = (files.indexOf(actualFile) + parseInt(rank)) % 2 === 1;

        const color = char === char.toUpperCase() ? 'w' : 'b';
        const pieceKey = color + char.toUpperCase();
        const pieceSvg = PIECES[pieceKey] || '';

        html += `<div class="square ${isLight ? 'light' : 'dark'} history-view" data-square="${square}">${pieceSvg}</div>`;
        fileIdx++;
      }
    }
  });

  html += '</div>';
  elements.board.innerHTML = html;

  // Show viewing indicator
  const moveNum = viewIndex;
  setFeedback(`Viewing move ${moveNum} of ${moveHistory.length - 1} (use → to return)`, 'hint');
}

// Update navigation button states
function updateNavigationState() {
  elements.backBtn.disabled = viewIndex <= 0;
  elements.forwardBtn.disabled = viewIndex >= moveHistory.length - 1;

  // Visual feedback
  elements.backBtn.style.opacity = viewIndex <= 0 ? '0.5' : '1';
  elements.forwardBtn.style.opacity = viewIndex >= moveHistory.length - 1 ? '0.5' : '1';
}

// Add current position to history
function addToHistory() {
  const currentFen = gameEngine.getFen();
  moveHistory.push(currentFen);
  viewIndex = moveHistory.length - 1;
  isViewingHistory = false;
  updateNavigationState();
}

// Effect Helpers
function spawnFloatingText(text: string, type: 'correct' | 'incorrect' | 'bonus' | 'rating', square?: string) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = `floating-text ${type}`;

  if (square) {
    const squareEl = elements.board.querySelector(`[data-square="${square}"]`);
    if (squareEl) {
      const rect = squareEl.getBoundingClientRect();
      div.style.left = `${rect.left + rect.width / 2 - 20}px`;
      div.style.top = `${rect.top}px`;
    } else {
      // Fallback center
      div.style.left = '50%';
      div.style.top = '40%';
      div.style.transform = 'translate(-50%, -50%)';
    }
  } else {
    // Center of board
    const boardRect = elements.board.getBoundingClientRect();
    div.style.left = `${boardRect.left + boardRect.width / 2 - 40}px`;
    div.style.top = `${boardRect.top + boardRect.height / 2}px`;
  }

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1000);
}

function triggerShake() {
  elements.board.classList.remove('shake-effect');
  void elements.board.offsetWidth; // Force reflow
  elements.board.classList.add('shake-effect');
}

function updateRatingDisplay() {
  const min = parseInt(elements.minRating.value);
  const max = parseInt(elements.maxRating.value);

  if (min > max) {
    elements.maxRating.value = elements.minRating.value;
  }

  elements.ratingDisplay.textContent = `${elements.minRating.value} - ${elements.maxRating.value}`;
}

function updatePuzzleCount() {
  const count = puzzleService.getMatchingPuzzleCount();
  elements.puzzleCount.textContent = `${count} puzzles available`;
}

function applyFilters() {
  const minRating = parseInt(elements.minRating.value);
  const maxRating = parseInt(elements.maxRating.value);
  const theme = elements.themeSelect.value;
  const themes = theme ? [theme] : [];

  puzzleService.setFilters({
    minRating,
    maxRating,
    selectedThemes: themes
  });

  storageService.saveFilters({ minRating, maxRating, themes });
  updatePuzzleCount();

  setFeedback('Filters applied! Loading new puzzle...', 'hint');
  setTimeout(() => loadNextPuzzle(), 500);
}

function loadNextPuzzle() {
  const puzzle = puzzleService.getNextPuzzle();

  if (!puzzle) {
    setFeedback('No puzzles match your filters. Try adjusting them.', 'incorrect');
    return;
  }

  loadPuzzle(puzzle);
}

function loadPuzzle(puzzle: Puzzle) {
  state = {
    current: puzzle,
    moveIndex: 0,
    status: 'playing',
    feedback: '',
    playerColor: 'white'
  };

  // Load position into engine
  gameEngine.loadPosition(puzzle.fen);

  // In puzzles, the first move is the opponent's move that sets up the tactic
  const opponentColor = gameEngine.getTurn();
  state.playerColor = opponentColor === 'white' ? 'black' : 'white';
  boardOrientation = state.playerColor;

  // Make the opponent's first move
  if (puzzle.moves.length > 0) {
    const firstMove = GameEngine.parseUciMove(puzzle.moves[0]);
    gameEngine.makeMove(firstMove.from, firstMove.to, firstMove.promotion);
    state.moveIndex = 1;
  }

  // Reset and initialize move history
  moveHistory = [];
  addToHistory(); // Add initial position

  // Update board
  selectedSquare = null;
  renderBoard();

  // Update UI
  elements.puzzleRating.textContent = `Puzzle Rating: ${puzzle.rating}`;
  elements.totalMoves.textContent = Math.ceil((puzzle.moves.length - 1) / 2).toString();
  elements.currentMove.textContent = '1';

  const colorToMove = state.playerColor === 'white' ? 'White' : 'Black';
  elements.turnInstruction.textContent = `Find the best move for ${colorToMove}`;

  elements.themeReveal.classList.add('hidden');
  elements.nextBtn.classList.add('hidden');
  elements.skipBtn.classList.remove('hidden');
  elements.hintBtn.classList.remove('hidden');

  setFeedback('Your turn - find the best move!', 'hint');

  storageService.saveProgress(puzzle.id, state.moveIndex);
}

function handlePlayerMove(from: string, to: string): boolean {
  if (!state.current) return false;

  const expectedMove = state.current.moves[state.moveIndex];

  let promotion: string | undefined;
  if (gameEngine.isPromotionMove(from, to)) {
    promotion = 'q';
  }

  // Check for capture before making move (for effects)
  const isCapture = gameEngine.getPieceAt(to) !== null;
  const result = gameEngine.checkSolution(from, to, expectedMove, promotion);

  if (result === 'correct') {
    gameEngine.makeMove(from, to, promotion);
    state.moveIndex++;
    addToHistory(); // Track move in history

    // Juice: Capture or Move Sound + Effects
    if (isCapture) {
      soundManager.playCapture();
      const rect = elements.board.querySelector(`[data-square="${to}"]`)?.getBoundingClientRect();
      if (rect) particleSystem.spawnShatter(rect.left + rect.width / 2, rect.top + rect.height / 2, 'black');

      // Impact Glitch
      elements.board.classList.remove('glitch-effect');
      void elements.board.offsetWidth; // Force reflow
      elements.board.classList.add('glitch-effect');
      setTimeout(() => elements.board.classList.remove('glitch-effect'), 300);
    } else {
      // For intermediate correct moves, play a nice chime
      if (state.moveIndex < state.current.moves.length) {
        soundManager.playCorrect();
      } else {
        soundManager.playMove();
      }
    }

    // Check Pulse
    if (gameEngine.isCheck()) {
      const kingSq = findKingSquare(state.playerColor === 'white' ? 'black' : 'white'); // Opponent king in check
      if (kingSq) {
        const rect = elements.board.querySelector(`[data-square="${kingSq}"]`)?.getBoundingClientRect();
        if (rect) {
          particleSystem.spawnPulse(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ff4466');
          // Add CSS pulse class to square
          const sqEl = elements.board.querySelector(`[data-square="${kingSq}"]`);
          sqEl?.classList.add('check-pulse');
          setTimeout(() => sqEl?.classList.remove('check-pulse'), 2000);
        }
      }
    }

    spawnFloatingText("Good!", "correct", to);

    if (state.moveIndex >= state.current.moves.length) {
      puzzleComplete(true);
    } else {
      setFeedback('Correct! ✅', 'correct');
      setTimeout(() => makeOpponentMove(), 500);
    }

    renderBoard();
    return true;
  } else if (result === 'good-but-better') {
    setFeedback("Good move, but there's something better! 💡", 'hint');
    return false;
  } else {
    // Incorrect
    soundManager.playIncorrect();
    triggerShake();

    // Reset streak immediately on error
    if (stats.streak > 0) {
      stats = storageService.updateStreak(false);
      updateStatsDisplay();
      spawnFloatingText("Streak Lost!", "incorrect", from);
    }

    spawnFloatingText("Oops!", "incorrect", from);
    setFeedback('Incorrect. Try again! ❌', 'incorrect');
    return false;
  }
}

function makeOpponentMove() {
  if (!state.current || state.moveIndex >= state.current.moves.length) return;

  const opponentMoveUci = state.current.moves[state.moveIndex];
  const move = GameEngine.parseUciMove(opponentMoveUci);

  // Check capture
  const isCapture = gameEngine.getPieceAt(move.to) !== null;

  gameEngine.makeMove(move.from, move.to, move.promotion);
  state.moveIndex++;
  addToHistory(); // Track opponent move in history

  // Juice
  if (isCapture) {
    soundManager.playCapture();
    const rect = elements.board.querySelector(`[data-square="${move.to}"]`)?.getBoundingClientRect();
    if (rect) particleSystem.spawnShatter(rect.left + rect.width / 2, rect.top + rect.height / 2, 'white');

    // Impact Glitch
    elements.board.classList.remove('glitch-effect');
    void elements.board.offsetWidth; // Force reflow
    elements.board.classList.add('glitch-effect');
    setTimeout(() => elements.board.classList.remove('glitch-effect'), 300);
  } else {
    soundManager.playMove();
  }

  // Check Pulse (Player King in check?)
  if (gameEngine.isCheck()) {
    const kingSq = findKingSquare(state.playerColor);
    if (kingSq) {
      const rect = elements.board.querySelector(`[data-square="${kingSq}"]`)?.getBoundingClientRect();
      if (rect) {
        particleSystem.spawnPulse(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ff4466');
        const sqEl = elements.board.querySelector(`[data-square="${kingSq}"]`);
        sqEl?.classList.add('check-pulse');
        setTimeout(() => sqEl?.classList.remove('check-pulse'), 2000);
      }
    }
  }

  renderBoard();

  if (state.moveIndex >= state.current.moves.length) {
    puzzleComplete(true);
  } else {
    const moveNum = Math.ceil(state.moveIndex / 2);
    elements.currentMove.textContent = moveNum.toString();
    setFeedback('Your turn - continue the sequence!', 'hint');
  }

  storageService.saveProgress(state.current.id, state.moveIndex);
}

function puzzleComplete(success: boolean) {
  state.status = success ? 'solved' : 'failed';

  // We need to update stats manually here since storageService logic might be complex
  // Looking at original code, it called storageService.updateStreak(success) which returns stats
  stats = storageService.updateStreak(success);
  updateStatsDisplay();

  if (!success && state.current) {
    storageService.addFailedPuzzle(state.current.id);
  }

  storageService.clearProgress();

  if (success) {
    // JUICE: Confetti & Sound
    soundManager.playSolved();
    particleSystem.spawnConfetti(window.innerWidth / 2, window.innerHeight / 2);
    spawnFloatingText("SOLVED!", "bonus"); // Center text

    // XP Calculation
    if (state.current) {
      const xpGain = calculateXpGain(state.current.rating, stats.streak);
      stats.xp += xpGain;
      spawnFloatingText(`+${xpGain} XP`, "rating");

      const levelCheck = checkLevelUp(stats.xp, stats.level);
      if (levelCheck.leveledUp) {
        stats.level = levelCheck.newLevel;
        stats.xp = levelCheck.remainingXp;
        stats.xpToNextLevel = levelCheck.newTarget;

        // LEVEL UP JUICE
        setTimeout(() => {
          soundManager.playLevelUp();
          particleSystem.spawnLevelUp(window.innerWidth / 2, window.innerHeight / 2);
          setFeedback(`LEVEL UP! Welcome to Level ${stats.level} 🌟`, 'correct');
          elements.levelBadge.classList.add('level-up-anim');
          setTimeout(() => elements.levelBadge.classList.remove('level-up-anim'), 3000);
        }, 1500); // Delayed for dramatic effect
      } else {
        stats.xp = levelCheck.remainingXp; // Should match currentXp if no level up
      }
    }

    setFeedback(`🎉 Puzzle Solved! Streak: ${stats.streak} 🔥`, 'correct');

    // Check for streak fire
    if (stats.streak >= 5) {
      elements.streak.parentElement?.classList.add('streak-fire');
    }
  } else {
    elements.streak.parentElement?.classList.remove('streak-fire');
    setFeedback('Puzzle failed. Review the solution.', 'incorrect');
  }

  // Save updated stats immediately
  storageService.saveStats(stats);
  updateStatsDisplay();

  revealThemes();

  elements.nextBtn.classList.remove('hidden');
  elements.skipBtn.classList.add('hidden');
  elements.hintBtn.classList.add('hidden');
}

function revealThemes() {
  if (!state.current) return;

  elements.themeTags.innerHTML = '';

  state.current.themes.forEach(theme => {
    const display = THEME_DISPLAY[theme] || { name: theme, icon: '🏷️' };
    const tag = document.createElement('span');
    tag.className = 'theme-tag';
    tag.textContent = `${display.icon} ${display.name}`;
    elements.themeTags.appendChild(tag);
  });

  // Handle game URL - fallback to analysis for known dummy URLs or placeholders
  let gameUrl = state.current.gameUrl;
  let linkText = 'View original game on Lichess →';

  // Check for dummy URLs (examples used in json)
  // Or fallback if the URL doesn't look like a real Lichess URL
  if (gameUrl.includes('example') || !gameUrl.startsWith('https://lichess.org/')) {
    // Create analysis link using FEN
    const fen = state.current.fen.replace(/ /g, '_');
    gameUrl = `https://lichess.org/analysis/standard/${fen}`;
    linkText = 'Analyze position on Lichess →';
  }

  elements.gameLink.href = gameUrl;
  elements.gameLink.textContent = linkText;
  elements.themeReveal.classList.remove('hidden');
}

function setFeedback(message: string, type: 'correct' | 'incorrect' | 'hint') {
  elements.feedback.textContent = message;
  elements.feedback.className = 'text-lg font-semibold';

  switch (type) {
    case 'correct':
      elements.feedback.classList.add('feedback-correct');
      break;
    case 'incorrect':
      elements.feedback.classList.add('feedback-incorrect');
      break;
    case 'hint':
      elements.feedback.classList.add('feedback-hint');
      break;
  }
}

function updateStatsDisplay() {
  elements.streak.textContent = stats.streak.toString();
  elements.solved.textContent = stats.totalSolved.toString();
  elements.maxStreak.textContent = stats.maxStreak.toString();
  elements.failed.textContent = stats.totalFailed.toString();

  if (stats.failedPuzzleIds.length > 0) {
    elements.reviewFailedBtn.classList.remove('hidden');
    elements.reviewFailedBtn.textContent = `📝 Review Failed (${stats.failedPuzzleIds.length})`;
  } else {
    elements.reviewFailedBtn.classList.add('hidden');
  }

  // Update Level & XP
  elements.levelBadge.textContent = `Lvl ${stats.level}`;
  elements.xpText.textContent = `${Math.floor(stats.xp)} / ${stats.xpToNextLevel}`;

  const xpPercent = Math.min(100, (stats.xp / stats.xpToNextLevel) * 100);
  elements.xpBar.style.width = `${xpPercent}%`;

  if (stats.streak >= 5) {
    elements.streak.parentElement?.classList.add('streak-fire');
  } else {
    elements.streak.parentElement?.classList.remove('streak-fire');
  }
}

function skipPuzzle() {
  if (state.status !== 'playing') return;

  state.status = 'failed';
  stats.streak = 0;
  storageService.saveStats(stats);
  updateStatsDisplay();

  setFeedback('Puzzle skipped. Loading next...', 'hint');

  setTimeout(() => loadNextPuzzle(), 500);
}

function showHint() {
  if (!state.current || state.status !== 'playing') return;

  const expectedMove = state.current.moves[state.moveIndex];
  const move = GameEngine.parseUciMove(expectedMove);

  // Highlight hint square
  selectedSquare = move.from;
  renderBoard();

  setFeedback(`Hint: Look at the piece on ${move.from.toUpperCase()}`, 'hint');
}

function reviewFailedPuzzles() {
  const failedIds = stats.failedPuzzleIds;
  if (failedIds.length === 0) return;

  const puzzleId = failedIds[0];
  const puzzle = puzzleService.getPuzzleById(puzzleId);

  if (puzzle) {
    loadPuzzle(puzzle);
    setFeedback('Reviewing failed puzzle...', 'hint');
  }
}

// Helper to calculate XP gain
function calculateXpGain(rating: number, streak: number): number {
  const ratingBonus = Math.floor(rating * XP_RATING_MULTIPLIER);
  const streakBonus = streak * XP_STREAK_BONUS;
  return XP_BASE + ratingBonus + streakBonus;
}

// Check for level up
function checkLevelUp(currentXp: number, currentLevel: number): { leveledUp: boolean, newLevel: number, remainingXp: number, newTarget: number } {
  let xp = currentXp;
  let level = currentLevel;
  let leveledUp = false;

  // Linear increase + 100 per level: 100, 200, 300...
  let target = level * 100;

  while (xp >= target) {
    xp -= target;
    level++;
    leveledUp = true;
    target = level * 100;
  }

  return { leveledUp, newLevel: level, remainingXp: xp, newTarget: target };
}

// Find King square
function findKingSquare(color: 'white' | 'black'): string | null {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  for (const f of files) {
    for (const r of ranks) {
      const sq = f + r;
      const piece = gameEngine.getPieceAt(sq);
      if (piece && piece.type === 'k' && piece.color === color) {
        return sq;
      }
    }
  }
  return null;
}

// Start the app
init();
