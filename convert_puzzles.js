import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'src/data/raw_puzzles.csv');
const jsonPath = path.join(process.cwd(), 'src/data/puzzles.json');

try {
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvData.split('\n');
    const puzzles = [];

    // Skip header if it exists (check first line)
    let startIndex = 0;
    if (lines[0].startsWith('PuzzleId')) {
        startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',');

        // Column mapping based on Lichess DB format:
        // PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
        // Note: FEN might contain commas? No, FEN uses spaces. But be careful.
        // Actually, simple split(',') works for Lichess CSV as fields don't contain commas normally.

        if (cols.length < 9) continue;

        const puzzle = {
            id: cols[0],
            fen: cols[1],
            moves: cols[2].split(' '),
            rating: parseInt(cols[3]),
            themes: cols[7].split(' '),
            gameUrl: cols[8]
        };

        puzzles.push(puzzle);
    }

    fs.writeFileSync(jsonPath, JSON.stringify(puzzles, null, 2));
    console.log(`Converted ${puzzles.length} puzzles.`);

} catch (err) {
    console.error('Error converting puzzles:', err);
}
