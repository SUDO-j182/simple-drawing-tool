const gridContainer = document.querySelector('.drawing-grid-container');


for (let i = 0; i < 256; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    gridContainer.appendChild(cell);
}

const colorPalette = document.querySelector('.color-palette'); 
let currentColor = "#000000";

const colors = [
    "#000000", "#0000AA", "#00AA00", "#00AAAA",
    "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
    "#555555", "#5555FF", "#55FF55", "#55FFFF",
    "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
];

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
        cell.style.backgroundColor = currentColor;
    });
});