// DOM
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const gridDOM = document.getElementById('grid');

// State
const rows = 30;
const cols = 30;
const cellHeight = 20;
const cellWidth = 20;
const grid = [];
let animationRef;
let isAnimating = false;

// creates grid with all 0s
for(let i=0; i<rows; i++) {
    grid.push(Array.from(Array(cols), () => 0));
}

gridDOM.style.display = 'grid';
gridDOM.style.gridTemplateColumns = `repeat(${cols}, ${cellWidth}px)`;

const updateGrid = (i, j) => {
    grid[i][j] = grid[i][j] === 0 ? 1 : 0;
    drawGrid(grid);
}

const drawGrid = (grid) => {
    gridDOM.innerHTML = '';

    grid.map((row, i) => {
        row.map((col, j) => {
            const cell = document.createElement('div');
            cell.style.width = `${cellWidth}px`;
            cell.style.height = `${cellHeight}px`;
            cell.style.backgroundColor = grid[i][j] ? '#000' : '#fff';
            cell.style.border = '1px solid #000';
    
            cell.addEventListener('click', () => updateGrid(i, j));
            
            gridDOM.appendChild(cell);
        })
    })    
}

const simulation = (grid) => {
    if (isAnimating) {
        drawGrid(grid);
    
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        const newGrid = grid.map((arr) => arr.slice());
    
        for(let i=0; i<rows; i++) {
            for(let j=0; j<cols; j++) {
                let neighbors = 0;
                
                for([x, y] of dirs) {
                    const [newI, newJ] = [i+x, j+y];
    
                    if (newI >= 0 && newI < rows && newJ >= 0 && newJ < cols && grid[newI][newJ] === 1) {
                        neighbors++;
                    }
                }
                
                if (neighbors < 2 || neighbors > 3) newGrid[i][j] = 0;
                else if (grid[i][j] === 0 && neighbors === 3) newGrid[i][j] = 1;  
            }
        }
        
        setTimeout(() => {
            animationRef = window.requestAnimationFrame(() => simulation(newGrid));
        }, 500)
    }
}

drawGrid(grid);

startButton.addEventListener('click', () => {
    isAnimating = true;
    window.requestAnimationFrame(() => simulation(grid));
});

stopButton.addEventListener('click', () => {
    isAnimating = false;
    window.cancelAnimationFrame(animationRef);
})