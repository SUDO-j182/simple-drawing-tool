// Select the grid container
const gridContainer = document.querySelector('.drawing-grid-container');

// Create grid cells and add event listeners
for (let i = 0; i < 256; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.addEventListener('click', () => {
        cell.style.backgroundColor = currentColor;
    });
    gridContainer.appendChild(cell);
}

// Select the color palette container
const colorPalette = document.querySelector('.color-palette');
let currentColor = "#000000";
let isMouseDown = false;
let lineMode = false;
let startCell = null;

// Mouse down event listener
document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

// Mouse up event listener
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Toggle line mode
document.getElementById('toggle-line-mode').addEventListener('click', () => {
    lineMode = !lineMode;
    document.getElementById('toggle-line-mode').innerText = lineMode ? "Line Mode: ON" : "Line Mode: OFF";
});

// Define color options
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

// Deselect color event listener
clearSelection.addEventListener('click', () => {
    currentColor = null;
    console.log("Deselected color");
});
colorPalette.appendChild(clearSelection);

// Create color options
colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.classList.add('color-option');
    colorOption.style.backgroundColor = color;

    colorOption.addEventListener('click', () => {
        currentColor = color;
        console.log("Selected Color:", currentColor);
    });

    colorPalette.appendChild(colorOption);
});

// Add event listeners to grid cells
document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (lineMode) {
            if (!startCell) {
                startCell = cell;
            } else {
                drawLine(startCell, cell);
                startCell = null;
            }
        } else {
            cell.style.backgroundColor = currentColor;
        }
    });
});

// Clear grid event listener
document.getElementById('clear-grid').addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = "";
    });
    console.log("Grid cleared");
});

// Draw line function
function drawLine(start, end) {
    const gridCells = Array.from(document.querySelectorAll('.grid-cell'));
    const startIndex = gridCells.indexOf(start);
    const endIndex = gridCells.indexOf(end);

    const gridSize = 16;

    const startRow = Math.floor(startIndex / gridSize);
    const startCol = startIndex % gridSize;
    const endRow = Math.floor(endIndex / gridSize);
    const endCol = endIndex % gridSize;

    console.log(`Start: (Row ${startRow}, Column ${startCol})`);
    console.log(`End: (Row ${endRow}, Column ${endCol})`);

    if (startRow === endRow) {
        console.log("Drawing a horizontal line...");
        let minCol = Math.min(startCol, endCol);
        let maxCol = Math.max(startCol, endCol);
        for (let col = minCol; col <= maxCol; col++) {
            gridCells[startRow * gridSize + col].style.backgroundColor = currentColor;
        }
    } else if (startCol === endCol) {
        console.log("Drawing a vertical line...");
        let minRow = Math.min(startRow, endRow);
        let maxRow = Math.max(startRow, endRow);
        for (let row = minRow; row <= maxRow; row++) {
            gridCells[row * gridSize + startCol].style.backgroundColor = currentColor;
        }
    }
}

// Toggle grid visibility event listener
document.getElementById('toggle-grid').addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.border = cell.style.border === "none" || cell.style.border === "" ? "2px solid black" : "none";
    });
});

// Add hover effect to grid cells
document.querySelectorAll('.grid-cell').forEach(cell => {
    let originalColor = "";
    let isColored = false;

    cell.addEventListener('mouseover', () => {
        if (currentColor !== null && !isColored) {
            originalColor = cell.style.backgroundColor;
            cell.style.backgroundColor = currentColor;
            cell.style.opacity = "0.5";
        }
        if (isMouseDown && currentColor !== null) {
            cell.style.backgroundColor = currentColor;
            cell.style.opacity = "1";
            isColored = true;
        }
    });

    cell.addEventListener('mouseout', () => {
        if (!isColored) {
            cell.style.backgroundColor = originalColor;
            cell.style.opacity = "1";
        }
    });

    cell.addEventListener('mousedown', () => {
        if (currentColor !== null) {
            cell.style.backgroundColor = currentColor;
            cell.style.opacity = "1";
            isColored = true;
        }
    });
});

// Export art as PNG event listener
document.getElementById('export-art').addEventListener('click', () => {
    const grid = document.querySelector('.drawing-grid-container');

    html2canvas(grid).then(canvas => {
        let link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
    console.log("Pixel art exported!");
});

// Save art to local storage event listener
document.getElementById('save-art').addEventListener('click', () => {
    let savedGrid = [];

    document.querySelectorAll('.grid-cell').forEach(cell => {
        savedGrid.push(cell.style.backgroundColor || "");
    });

    localStorage.setItem("pixelArt", JSON.stringify(savedGrid));
    console.log("Pixel art saved!");
});

// Load art from local storage event listener
document.getElementById('load-art').addEventListener('click', () => {
    let savedGrid = JSON.parse(localStorage.getItem("pixelArt"));

    if (savedGrid) {
        document.querySelectorAll('.grid-cell').forEach((cell, index) => {
            cell.style.backgroundColor = savedGrid[index];
        });
        console.log("Pixel art loaded!");
    } else {
        console.log("No saved pixel art found.");
    }
});
