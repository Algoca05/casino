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
    { src: '../multimedia/img/color/amarillo.png', x: 995 + 4 * 92, y: 825, value: 10 },
    { src: '../multimedia/img/color/azul.png', x: 995 + 1 * 92, y: 825, value: 20 },
    { src: '../multimedia/img/color/granate.png', x: 995 + 7 * 92, y: 825, value: 30 },
    { src: '../multimedia/img/color/lila.png', x: 995 + 8 * 92, y: 825, value: 40 },
    { src: '../multimedia/img/color/naranja.png', x: 995 + 5 * 92, y: 825, value: 50 },
    { src: '../multimedia/img/color/negro.png', x: 995 + 2 * 92, y: 825, value: 60 },
    { src: '../multimedia/img/color/rojo.png', x: 995 + 0 * 92, y: 825, value: 70 },
    { src: '../multimedia/img/color/rosa.png', x: 995 + 6 * 92, y: 825, value: 80 },
    { src: '../multimedia/img/color/verde.png', x: 995 + 3 * 92, y: 825, value: 90 },
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

// Define the grid numbers with their positions
const gridNumbers = [
    { number: 0, x: 930, y: 450 },
    // Add numbers 1 through 36 with their respective positions
    // Example for demonstration purposes
    { number: 1, x: 1010, y: 620 },
    { number: 2, x: 1010, y: 450 },
    // ...continue for all numbers up to 36
];

// Clase para representar una ficha (chip) en el canvas
class Chip extends CanvasImage {
    constructor(x, y, size, color) {
        super('../multimedia/img/chip.png', x, y, size, false, 'chip');
        this.color = color;
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

        // Dibujar la cuadrícula de números
        gridNumbers.forEach(num => {
            context.fillStyle = 'white';
            context.font = '16px Arial';
            context.textAlign = 'center';
            context.fillText(num.number, num.x, num.y);
            // Dibujar rectángulos alrededor de los números
            context.beginPath();
            context.rect(num.x - 20, num.y - 55, 40, 100);
            context.stroke();
        });

        // Dibujar el número aleatorio si existe
        if (lastRandomNumber !== null) {
            context.fillStyle = 'red';
            context.font = '100px Arial';
            context.textAlign = 'center';
            context.fillText(lastRandomNumber, 840, 760); // Adjust coordinates as needed
        }

        // Manejar la desaceleración del giro
        if (isSpinning) {
            rotationSpeed *= DECELERATION;
            if (rotationSpeed < MIN_SPEED) {
                isSpinning = false;
                rotationSpeed = 0;
                // Generar y asignar número aleatorio
                lastRandomNumber = Math.floor(Math.random() * 37);
                console.log(`Número aleatorio: ${lastRandomNumber}`);
            }
        } else {
            // Opcional: Clear the last number after some time or on next spin
            // For example, clear after 5 seconds
            // setTimeout(() => { lastRandomNumber = null; }, 5000);
        }

        requestAnimationFrame(draw);
    }

    // Iniciar el ciclo de dibujo
    draw();

    // Manejar eventos de mouse para drag & drop y colocación de fichas
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Verificar si se hizo clic en algún número del grid
        const clickedGrid = gridNumbers.find(num => {
            const dx = x - num.x;
            const dy = y - (num.y - 10);
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });

        if (clickedGrid && !isSpinning) {
            // Colocar una ficha en el número clicado
            const newChip = new Chip(clickedGrid.x, clickedGrid.y - 10, 30, 'red'); // Puedes personalizar el tamaño y color
            chips.push(newChip);
            console.log(`Ficha colocada en el número: ${clickedGrid.number}`);
            return;
        }

        // Iterar desde arriba hacia abajo para seleccionar la imagen superior
        for (let i = canvasImages.length - 1; i >= 0; i--) {
            if (canvasImages[i].isPointInside(x, y)) {
                const clickedImage = canvasImages[i];
                if (clickedImage.value === 'clear') {
                    // Si se hace clic en el botón de limpiar
                    canvasImages = canvasImages.filter(img => img.isOriginal || img.value === 'clear');
                    chips = []; // Also clear chips if needed
                    lastRandomNumber = null; // Clear the displayed number
                    console.log('All dragged images have been removed.');
                    break;
                }

                if (clickedImage.value === 'ruleta-gira') {
                    if (!isSpinning) {
                        isSpinning = true;
                        rotationSpeed = Math.random() * 0.1 + 0.05; // Establecer velocidad de rotación aleatoria
                        lastRandomNumber = null; // Clear previous number
                    }
                }

                if (clickedImage.isOriginal && clickedImage.value !== 'ruleta-gira') {
                    // Crear una copia de la imagen con el mismo valor
                    let copiedImage = new CanvasImage(clickedImage.img.src, x, y, IMAGE_SIZE, false, clickedImage.value); // isOriginal = false
                    canvasImages.push(copiedImage);
                    console.log(`Imagen copiada: ${clickedImage.img.src} en X: ${x}, Y: ${y} con Valor: ${clickedImage.value}`);

                    // Iniciar el arrastre de la copia
                    isDragging = true;
                    draggedImage = copiedImage;
                    dragOffsetX = x - copiedImage.x;
                    dragOffsetY = y - copiedImage.y;

                } else if (!clickedImage.isOriginal) {
                    // Iniciar el arrastre de la imagen ya arrastrada
                    isDragging = true;
                    draggedImage = clickedImage;
                    dragOffsetX = x - clickedImage.x;
                    dragOffsetY = y - clickedImage.y;
                }
                break;
            }
        }
    });

    canvas.addEventListener('mousemove', (e) => {
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

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        draggedImage = null;
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        draggedImage = null;
    });

    // Add event listener for the clear button
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Filtrar out dragged images (isOriginal === false)
            canvasImages = canvasImages.filter(img => img.isOriginal);
            console.log('All dragged images have been removed.');
        });
    }

    // Opcional: Manejar otros eventos si es necesario
});






