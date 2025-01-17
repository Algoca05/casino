//POSICIONAMIENTO DEL PERSONAJE

//Canvas Images

// Declaración global de canvas y context
let canvas;
let context;

// Definir el tamaño fijo para las imágenes
const IMAGE_SIZE = 125;
console.log(IMAGE_SIZE);

// Clase para representar una imagen en el canvas
class CanvasImage {
    constructor(src, x, y, size, isOriginal = true, value) { // Añadir parámetro value
        this.img = new Image();
        this.img.src = src;
        this.x = x;
        this.y = y;
        this.size = size;
        this.isOriginal = isOriginal; // Añadir propiedad isOriginal
        this.value = value; // Añadir propiedad value
        this.rotation = 0; // Añadir propiedad rotation
    }

    isPointInside(px, py) {
        return px >= this.x - this.size / 2 && px <= this.x + this.size / 2 &&
               py >= this.y - this.size / 2 && py <= this.y + this.size / 2;
    }
}

// Definir las 9 imágenes con sus coordenadas y valores
const imagesData = [
    { src: '../multimedia/img/color/amarillo.png', x: 995 + 4 * 92, y: 825, value: 25, color: 'amarillo' },
    { src: '../multimedia/img/color/azul.png', x: 995 + 1 * 92, y: 825, value: 2, color: 'azul' },
    { src: '../multimedia/img/color/granate.png', x: 995 + 7 * 92, y: 825, value: 500, color: 'granate' },
    { src: '../multimedia/img/color/lila.png', x: 995 + 8 * 92, y: 825, value: 1000, color: 'lila' },
    { src: '../multimedia/img/color/naranja.png', x: 995 + 5 * 92, y: 825, value: 50, color: 'naranja' },
    { src: '../multimedia/img/color/negro.png', x: 995 + 2 * 92, y: 825, value: 5, color: 'negro' },
    { src: '../multimedia/img/color/rojo.png', x: 995 + 0 * 92, y: 825, value: 1, color: 'rojo' },
    { src: '../multimedia/img/color/rosa.png', x: 995 + 6 * 92, y: 825, value: 100, color: 'rosa' },
    { src: '../multimedia/img/color/verde.png', x: 995 + 3 * 92, y: 825, value: 10, color: 'verde' },
    // Add Clear Button Image Data
    { src: '../multimedia/img/X.png', x: 1820, y: 800, value: 'clear' }, 
    { src: '../multimedia/img/ruleta-gira.png', x: 450, y: 470, value: 'ruleta-gira' }
];

// Array para almacenar objetos CanvasImage
let canvasImages = [];

// Variables para drag & drop
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedImage = null;

// Variables para spinning
let isSpinning = false;
let rotationSpeed = 0;
const DECELERATION = 0.995; // Deceleration factor for spinning
const MIN_SPEED = 0.05;

// Add a variable to store the last random number
let lastRandomNumber = null;

// Add a variable to store the user's wallet balance
let wallet = localStorage.getItem('wallet') ? parseInt(localStorage.getItem('wallet')) : 1134; // Initial balance

// Variables para manejar la desactivación de la interacción del usuario
let isInteractionDisabled = false;
let spinStartTime = null; // Variable to store the start time of the spin

// Define the grid numbers with their positions and initial total values
const gridNumbers = [
    { number: 0, x: 930, y: 450, totalValue: 0 },
    { number: 0, x: 940, y: 620, totalValue: 0 },
    { number: 0, x: 940, y: 280, totalValue: 0 },
    { number: 1, x: 1010, y: 620, totalValue: 0 },
    { number: 2, x: 1010, y: 450, totalValue: 0 },
    { number: 3, x: 1010, y: 280, totalValue: 0 },
    { number: 4, x: 1080, y: 620, totalValue: 0 },
    { number: 5, x: 1080, y: 450, totalValue: 0 },
    { number: 6, x: 1080, y: 280, totalValue: 0 },
    { number: 7, x: 1150, y: 620, totalValue: 0 },
    { number: 8, x: 1150, y: 450, totalValue: 0 },
    { number: 9, x: 1150, y: 280, totalValue: 0 },
    { number: 10, x: 1220, y: 620, totalValue: 0 },
    { number: 11, x: 1220, y: 450, totalValue: 0 },
    { number: 12, x: 1220, y: 280, totalValue: 0 },
    { number: 13, x: 1290, y: 620, totalValue: 0 },
    { number: 14, x: 1290, y: 450, totalValue: 0 },
    { number: 15, x: 1290, y: 280, totalValue: 0 },
    { number: 16, x: 1360, y: 620, totalValue: 0 },
    { number: 17, x: 1360, y: 450, totalValue: 0 },
    { number: 18, x: 1360, y: 280, totalValue: 0 },
    { number: 19, x: 1430, y: 620, totalValue: 0 },
    { number: 20, x: 1430, y: 450, totalValue: 0 },
    { number: 21, x: 1430, y: 280, totalValue: 0 },
    { number: 22, x: 1500, y: 620, totalValue: 0 },
    { number: 23, x: 1500, y: 450, totalValue: 0 },
    { number: 24, x: 1500, y: 280, totalValue: 0 },
    { number: 25, x: 1570, y: 620, totalValue: 0 },
    { number: 26, x: 1570, y: 450, totalValue: 0 },
    { number: 27, x: 1570, y: 280, totalValue: 0 },
    { number: 28, x: 1640, y: 620, totalValue: 0 },
    { number: 29, x: 1640, y: 450, totalValue: 0 },
    { number: 30, x: 1640, y: 280, totalValue: 0 },
    { number: 31, x: 1710, y: 620, totalValue: 0 },
    { number: 32, x: 1710, y: 450, totalValue: 0 },
    { number: 33, x: 1710, y: 280, totalValue: 0 },
    { number: 34, x: 1780, y: 620, totalValue: 0 },
    { number: 35, x: 1780, y: 450, totalValue: 0 },
    { number: 36, x: 1780, y: 280, totalValue: 0 }
];

// Clase para representar una ficha (chip) en el canvas
class Chip extends CanvasImage {
    constructor(x, y, size, chipValue) { // Cambiar 'color' por 'chipValue'
        const chipData = imagesData.find(data => data.value === chipValue);
        super(chipData.src, x, y, size, false, chipData.value);
        this.color = chipData.color;
    }
}

// Array para almacenar fichas colocadas
let chips = [];



document.addEventListener('DOMContentLoaded', () => {
    // Inicializar canvas y context
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crear y agregar las imágenes al array canvasImages
    imagesData.forEach(data => {
        const size = (data.value === 'clear') ? 60 : (data.value === 'ruleta-gira' ? 470 : IMAGE_SIZE); // Set smaller size for clear button and specific size for ruleta-gira
        let canvasImg = new CanvasImage(data.src, data.x, data.y, size, true, data.value); // Pasar el valor
        canvasImages.push(canvasImg);
    });

    // Función para dibujar en el canvas
    function draw() {
        // Limpiar el canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar la ruleta
        canvasImages.forEach(img => {
            context.save();
            context.translate(img.x, img.y);
            context.rotate(img.rotation);
            context.drawImage(img.img, -img.size / 2, -img.size / 2, img.size, img.size);
            context.restore();
            
            // Si la imagen es ruleta-gira y está girando, actualizar la rotación
            if (img.value === 'ruleta-gira' && isSpinning) {
                img.rotation += rotationSpeed;
            }
        });

        // Dibujar las fichas
        chips.forEach(chip => {
            context.drawImage(chip.img, chip.x - chip.size / 2, chip.y - chip.size / 2, chip.size, chip.size);
        });

        // Dibujar la cuadrícula de números y sus valores totales
        gridNumbers.forEach(num => {
            // context.fillStyle = 'white';
            // context.font = '16px Arial';
            // context.textAlign = 'center';
            // context.fillText(num.number, num.x, num.y);
            // Dibujar rectángulos alrededor de los números
            context.beginPath();
            context.rect(num.x - 32.5, num.y - 87.5, 65, 170);
            // context.stroke();

            // Dibujar el valor total de las fichas en cada número
            if (num.totalValue > 0) {
                context.fillStyle = 'yellow';
                context.font = '14px Arial';
                context.fillText(`Total: ${num.totalValue}`, num.x-25, num.y + 20);
            }
        });

        // Dibujar el número aleatorio si existe
        if (lastRandomNumber !== null) {
            context.fillStyle = 'red';
            context.font = '100px Arial';
            context.textAlign = 'center';
            context.fillText(lastRandomNumber, 840, 760); // Adjust coordinates as needed
        }

        // Dibujar la cartera del usuario
        updateWalletDisplay();

        // Manejar la desaceleración del giro
        if (isSpinning) {
            rotationSpeed *= DECELERATION;
            const currentTime = Date.now();
            const elapsedTime = (currentTime - spinStartTime) / 1000; // Calculate elapsed time in seconds

            if (rotationSpeed < MIN_SPEED && elapsedTime >= 10) { // Ensure the spin lasts at least 10 seconds
                isSpinning = false;
                rotationSpeed = 0;
                // Generar y asignar número aleatorio
                lastRandomNumber = Math.floor(Math.random() * 37);
                console.log(`Número aleatorio: ${lastRandomNumber}`);
                
                // Calculate winnings based on the random number
                const winningNumber = gridNumbers.find(num => num.number === lastRandomNumber);
                if (winningNumber) {
                    const winnings = winningNumber.totalValue * 36;
                    wallet += winnings;
                    console.log(`Ganancias: ${winnings}. Nuevo saldo: ${wallet}`);
                }

                // Disable user interactions
                isInteractionDisabled = true;

                // Wait for 5 seconds before clearing all placed chips and resetting total values
                setTimeout(() => {
                    chips = [];
                    gridNumbers.forEach(num => num.totalValue = 0);
                    console.log('Todas las fichas han sido eliminadas tras el giro.');

                    // Enable user interactions
                    isInteractionDisabled = false;
                }, 5000);
            }
        } 

        requestAnimationFrame(draw);
    }

    // Iniciar el ciclo de dibujo
    draw();

    // Manejar eventos de mouse para drag & drop y colocación de fichas
    canvas.addEventListener('mousedown', (e) => {
        if (isInteractionDisabled) return; // Prevent interaction if disabled

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        // Iterar desde arriba hacia abajo para seleccionar la imagen superior
        for (let i = canvasImages.length - 1; i >= 0; i--) {
            if (canvasImages[i].isPointInside(x, y)) {
                const clickedImage = canvasImages[i];
                if (clickedImage.value === 'clear') {
                    // Calcular el total de todos los chips
                    let totalReturn = chips.reduce((sum, chip) => sum + chip.value, 0);
                    // Devolver el total al wallet
                    wallet += totalReturn;
                    // Limpiar todos los chips
                    chips = [];
                    // Limpiar imágenes arrastradas si es necesario
                    canvasImages = canvasImages.filter(img => img.isOriginal || img.value === 'clear');
                    lastRandomNumber = null; // Clear the displayed number

                    // Reset total values for all grid numbers
                    gridNumbers.forEach(num => num.totalValue = 0);

                    console.log(`Todas las apuestas han sido eliminadas. Se han devuelto ${totalReturn} al wallet.`);
                    localStorage.setItem('wallet', wallet); // Save wallet balance to localStorage
                    break;
                }

                if (clickedImage.value === 'ruleta-gira') {
                    if (!isSpinning) {
                        isSpinning = true;
                        rotationSpeed = Math.random() * 0.1 + 0.05; // Establecer velocidad de rotación aleatoria
                        lastRandomNumber = null; // Clear previous number
                        spinStartTime = Date.now(); // Record the start time of the spin
                    }
                }

                if (clickedImage.isOriginal && clickedImage.value !== 'ruleta-gira') {
                    // Verificar si el valor de la ficha es numérico
                    if (typeof clickedImage.value !== 'number') {
                        console.log('Esta imagen no es una ficha draggable.');
                        return; // Previene el arrastre
                    }

                    // Verificar si el wallet tiene suficiente saldo
                    if (wallet < clickedImage.value) {
                        console.log('Saldo insuficiente para arrastrar esta ficha.');
                        /* Optional: Display a user-facing message */
                        // alert('No tienes suficiente saldo para arrastrar esta ficha.');
                        return; // Previene el arrastre
                    }

                    // Iniciar el arrastre sin crear la ficha
                    isDragging = true;
                    draggedImage = clickedImage;
                    dragOffsetX = x - clickedImage.x;
                    dragOffsetY = y - clickedImage.y;

                } else if (!clickedImage.isOriginal) {
                    // Verificar si la ficha tiene un valor numérico antes de permitir el arrastre
                    if (typeof clickedImage.value !== 'number') {
                        console.log('Esta imagen no es una ficha draggable.');
                        return; // Previene el arrastre
                    }

                    // Iniciar el arrastre de la imagen ya arrastrada
                    isDragging = true;
                    draggedImage = clickedImage;
                    dragOffsetX = x - draggedImage.x;
                    dragOffsetY = y - draggedImage.y;
                }
                break;
            }
        }

    
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isInteractionDisabled) return; // Prevent interaction if disabled

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isDragging && draggedImage) {
            draggedImage.x = x - dragOffsetX;
            draggedImage.y = y - dragOffsetY;
        }

        // Actualizar coordenadas del ratón
        const coordsDisplay = document.getElementById('coordinates');
        if (coordsDisplay) {
            coordsDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (isInteractionDisabled) return; // Prevent interaction if disabled

        if (isDragging && draggedImage && typeof draggedImage.value === 'number') {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const chipValue = draggedImage.value;
            const chipData = imagesData.find(data => data.value === chipValue);
            const chipColor = chipData.color;

            // Find the grid number based on the coordinates
            const gridNumber = gridNumbers.find(num => {
                return x >= num.x - 25 && x <= num.x + 25 && y >= num.y - 82.5 && y <= num.y + 82.5;
            });

            if (gridNumber) {
                if (wallet >= chipValue) {
                    const newChip = new Chip(gridNumber.x, gridNumber.y, 30, chipValue);
                    chips.push(newChip);
                    wallet -= chipValue;
                    gridNumber.totalValue += chipValue; // Update the total value for the grid number
                    console.log(`Ficha colocada en el número ${gridNumber.number}: ${chipColor} con valor ${chipValue}`);
                    localStorage.setItem('wallet', wallet); // Save wallet balance to localStorage
                } else {
                    console.log('Saldo insuficiente para colocar esta ficha.');
                }
            } else {
                console.log('La ficha no se colocó en un número válido.');
            }

            // Reset the dragged chip's position to its initial coordinates
            draggedImage.x = chipData.x;
            draggedImage.y = chipData.y;

            isDragging = false;
            draggedImage = null;
        }
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        draggedImage = null;
    });

  
});

function updateWalletDisplay() {
    context.fillStyle = 'yellow';
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText(`Wallet: ${wallet}`, 20, canvas.height - 20); // Bottom-left corner
    localStorage.setItem('wallet', wallet); // Save wallet balance to localStorage
}






