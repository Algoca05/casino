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
    }

    draw() {
        context.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        // Configurar el estilo del texto
        context.font = `${this.size / 8}px Arial`;
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Dibujar el valor en una posición más arriba de la imagen
        context.fillText(this.value, this.x -3, this.y -25);
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
    { src: '../multimedia/img/color/verde.png', x: 995 + 3 * 92, y: 825, value: 90 }
];

// Array para almacenar objetos CanvasImage
let canvasImages = [];

// Variables para drag & drop
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedImage = null;

// Función para dibujar todas las imágenes
function drawAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvasImages.forEach(img => img.draw());
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar canvas y context
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crear y agregar las imágenes al array canvasImages
    imagesData.forEach(data => {
        let canvasImg = new CanvasImage(data.src, data.x, data.y, IMAGE_SIZE, true, data.value); // Pasar el valor
        canvasImages.push(canvasImg);
    });

    // Dibujar las 9 imágenes en sus coordenadas con tamaño fijo
    drawAll();

    // Manejar eventos de mouse para drag & drop
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Iterar desde arriba hacia abajo para seleccionar la imagen superior
        for (let i = canvasImages.length - 1; i >= 0; i--) {
            if (canvasImages[i].isPointInside(x, y)) {
                // Verificar si la imagen es original
                if (canvasImages[i].isOriginal) {
                    // Crear una copia de la imagen con el mismo valor
                    let copiedImage = new CanvasImage(canvasImages[i].img.src, x, y, IMAGE_SIZE, false, canvasImages[i].value); // isOriginal = false
                    canvasImages.push(copiedImage);
                    console.log(`Imagen copiada: ${canvasImages[i].img.src} en X: ${x}, Y: ${y} con Valor: ${canvasImages[i].value}`);

                    // Iniciar el arrastre de la copia
                    isDragging = true;
                    draggedImage = copiedImage;
                    dragOffsetX = x - copiedImage.x;
                    dragOffsetY = y - copiedImage.y;

                    // Redibujar todas las imágenes
                    drawAll();
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
            drawAll();
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

    // Opcional: Manejar otros eventos si es necesario
});






