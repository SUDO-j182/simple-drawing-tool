// Select the grid container
const gridContainer = document.querySelector('.drawing-grid-container');
const gridSizeSelector = document.getElementById("grid-size"); // Grid size selector
const gridDimension = 320; // Fixed size of the grid in pixels
let currentGridSize = 16; // Default grid size
let currentColor = "#000000";
let isMouseDown = false;
let lineMode = false;
let startCell = null;

// Function to create the grid dynamically
function createGrid(size) {
    gridContainer.innerHTML = ""; // Clear existing grid
    const cellSize = gridDimension / size; // Calculate cell size

    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.border = "1px solid black"; // Keep the grid visible

        // Add event listeners for coloring
        cell.addEventListener("click", () => {
            if (lineMode) {
                if (!startCell) {
                    startCell = cell;
                } else {
                    drawLine(startCell, cell, size);
                    startCell = null;
                }
            } else {
                cell.style.backgroundColor = currentColor;
            }
        });

        cell.addEventListener("mouseover", () => {
            if (isMouseDown && currentColor !== null) {
                cell.style.backgroundColor = currentColor;
            }
        });

        gridContainer.appendChild(cell);
    }
}

// Initialize the default grid
createGrid(currentGridSize);

// Event listener for the grid size selector
gridSizeSelector.addEventListener("change", function () {
    currentGridSize = parseInt(gridSizeSelector.value);
    createGrid(currentGridSize);
});

// Mouse events for drag-to-paint
document.addEventListener('mousedown', () => { isMouseDown = true; });
document.addEventListener('mouseup', () => { isMouseDown = false; });

// Toggle line mode
document.getElementById('toggle-line-mode').addEventListener('click', () => {
    lineMode = !lineMode;
    document.getElementById('toggle-line-mode').innerText = lineMode ? "Line Mode: ON" : "Line Mode: OFF";
});

// Color palette setup
const colorPalette = document.querySelector('.color-palette');
const colors = [
    "#000000", "#0000AA", "#00AA00", "#00AAAA",
    "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
    "#555555", "#5555FF", "#55FF55", "#55FFFF",
    "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
];

// Create deselect button
const clearSelection = document.createElement('div');
clearSelection.classList.add('color-option');
clearSelection.style.backgroundColor = "transparent";
clearSelection.style.border = "2px dashed black";
clearSelection.innerText = "X";
clearSelection.style.display = "flex";
clearSelection.style.alignItems = "center";
clearSelection.style.justifyContent = "center";
clearSelection.style.fontSize = "14px";
clearSelection.style.fontWeight = "bold";
clearSelection.style.cursor = "pointer";

clearSelection.addEventListener('click', () => {
    currentColor = null;
});
colorPalette.appendChild(clearSelection);

// Create color options
colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.classList.add('color-option');
    colorOption.style.backgroundColor = color;

    colorOption.addEventListener('click', () => {
        currentColor = color;
    });

    colorPalette.appendChild(colorOption);
});

// Clear grid event listener
document.getElementById('clear-grid').addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = "";
    });
});

// Draw line function (modified to use dynamic grid size)
function drawLine(start, end, gridSize) {
    const gridCells = Array.from(document.querySelectorAll('.grid-cell'));
    const startIndex = gridCells.indexOf(start);
    const endIndex = gridCells.indexOf(end);

    const startRow = Math.floor(startIndex / gridSize);
    const startCol = startIndex % gridSize;
    const endRow = Math.floor(endIndex / gridSize);
    const endCol = endIndex % gridSize;

    if (startRow === endRow) {
        let minCol = Math.min(startCol, endCol);
        let maxCol = Math.max(startCol, endCol);
        for (let col = minCol; col <= maxCol; col++) {
            gridCells[startRow * gridSize + col].style.backgroundColor = currentColor;
        }
    } else if (startCol === endCol) {
        let minRow = Math.min(startRow, endRow);
        let maxRow = Math.max(startRow, endRow);
        for (let row = minRow; row <= maxRow; row++) {
            gridCells[row * gridSize + startCol].style.backgroundColor = currentColor;
        }
    }
}

// Toggle grid visibility
document.getElementById('toggle-grid').addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.border = cell.style.border === "none" || cell.style.border === "" ? "1px solid black" : "none";
    });
});

// Export pixel art as PNG
document.getElementById('export-art').addEventListener('click', () => {
    const grid = document.querySelector('.drawing-grid-container');

    html2canvas(grid).then(canvas => {
        let link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

// Save art to local storage
document.getElementById('save-art').addEventListener('click', () => {
    let savedGrid = [];
    document.querySelectorAll('.grid-cell').forEach(cell => {
        savedGrid.push(cell.style.backgroundColor || "");
    });
    localStorage.setItem("pixelArt", JSON.stringify(savedGrid));
});

// Load art from local storage
document.getElementById('load-art').addEventListener('click', () => {
    let savedGrid = JSON.parse(localStorage.getItem("pixelArt"));
    if (savedGrid) {
        document.querySelectorAll('.grid-cell').forEach((cell, index) => {
            cell.style.backgroundColor = savedGrid[index];
        });
    }
});
