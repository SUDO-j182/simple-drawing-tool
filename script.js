

const gridContainer = document.querySelector('.drawing-grid-container');


for (let i = 0; i < 256; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.addEventListener('click', () => {              //ADDED EVENT LISTENER DURING CELL CREATION 
        cell.style.backgroundColor = currentColor;
    });
    gridContainer.appendChild(cell);
}

const colorPalette = document.querySelector('.color-palette'); 
let currentColor = "#000000";
let isMouseDown = false;
let lineMode = false;                        //ADDED TOGGLE FOR LINE MODE
let startCell = null;

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

document.getElementById('toggle-line-mode').addEventListener('click', () => {
    lineMode = !lineMode;
    document.getElementById('toggle-line-mode').innerText = lineMode ? "Line Mode: ON" : "Line Mode: OFF";
});

const colors = [
    "#000000", "#0000AA", "#00AA00", "#00AAAA",
    "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
    "#555555", "#5555FF", "#55FF55", "#55FFFF",
    "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
];

const clearselection = document.createElement('div');   //DESELECT BUTTON ADDED
clearselection.classList.add('color-option');                      
clearselection.style.backgroundColor = "transparent";              
clearselection.style.border = "2px dashed black";                  
clearselection.innerText = "X";
clearselection.style.display = "flex";
clearselection.style.alignItems = "center";
clearselection.style.justifyContent = "center";
clearselection.style.fontSize = "14px";
clearselection.style.fontWeight = "bold";
clearselection.style.cursor = "pointer";

clearselection.addEventListener('click', () => {
    currentColor = null;
    console.log("Deselected colour")
});

colorPalette.appendChild(clearselection);

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

document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (lineMode) {          //ADDED STRAIGHT LINE DRAWING FEATURE
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

  
document.getElementById('clear-grid').addEventListener('click', () => {     //RESETS ALL GRID CELLS WHEN BUTTON IS CLICKED
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = ""
    });
    console.log("Grid cleared");
});

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

document.getElementById('toggle-grid').addEventListener('click', () => {        //LISTENS FOR BUTTON CLICKS, HIDES AND REVEALS GRID
    document.querySelectorAll('.grid-cell').forEach(cell => {
        if (cell.style.border === "none" || cell.style.border === "") {
            cell.style.border = "2px solid black";
        } else {
            cell.style.border = "none";
        }
    });
});

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
