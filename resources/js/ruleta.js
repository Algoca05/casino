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

    isPointInside(px, py) {
        return px >= this.x - this.size / 2 && px <= this.x + this.size / 2 &&
               py >= this.y - this.size / 2 && py <= this.y + this.size / 2;
    }
}

// Definir las 9 imágenes con sus coordenadas y valores
const imagesData = [
    { src: '../multimedia/img/color/amarillo.png', x: 995 + 4 * 92, y: 805, value: 10 },
    { src: '../multimedia/img/color/azul.png', x: 995 + 1 * 92, y: 805, value: 20 },
    { src: '../multimedia/img/color/granate.png', x: 995 + 7 * 92, y: 805, value: 30 },
    { src: '../multimedia/img/color/lila.png', x: 995 + 8 * 92, y: 805, value: 40 },
    { src: '../multimedia/img/color/naranja.png', x: 995 + 5 * 92, y: 805, value: 50 },
    { src: '../multimedia/img/color/negro.png', x: 995 + 2 * 92, y: 805, value: 60 },
    { src: '../multimedia/img/color/rojo.png', x: 995 + 0 * 92, y: 805, value: 70 },
    { src: '../multimedia/img/color/rosa.png', x: 995 + 6 * 92, y: 805, value: 80 },
    { src: '../multimedia/img/color/verde.png', x: 995 + 3 * 92, y: 805, value: 90 },
    // Add Clear Button Image Data
    { src: '../multimedia/img/X.png', x: 900, y: 780, value: 'clear' } // Set desired coordinates
];

// Array para almacenar objetos CanvasImage
let canvasImages = [];

// Variables para drag & drop
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedImage = null;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar canvas y context
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crear y agregar las imágenes al array canvasImages
    imagesData.forEach(data => {
        const size = (data.value === 'clear') ? 60 : IMAGE_SIZE; // Set smaller size for clear button
        let canvasImg = new CanvasImage(data.src, data.x, data.y, size, true, data.value); // Pasar el valor
        canvasImages.push(canvasImg);
    });

    // Función para dibujar en el canvas
    function draw() {
        // Limpiar el canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar cada imagen
        canvasImages.forEach(img => {
            context.drawImage(img.img, img.x - img.size / 2, img.y - img.size / 2, img.size, img.size);
        });

        requestAnimationFrame(draw);
    }

    // Iniciar el ciclo de dibujo
    draw();

    // Manejar eventos de mouse para drag & drop
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Iterar desde arriba hacia abajo para seleccionar la imagen superior
        for (let i = canvasImages.length - 1; i >= 0; i--) {
            if (canvasImages[i].isPointInside(x, y)) {
                const clickedImage = canvasImages[i];
                if (clickedImage.value === 'clear') {
                    // Si se hace clic en el botón de limpiar
                    canvasImages = canvasImages.filter(img => img.isOriginal || img.value === 'clear');
                    console.log('All dragged images have been removed.');
                    break;
                }

                // Verificar si la imagen es original
                if (clickedImage.isOriginal) {
                    // Crear una copia de la imagen con el mismo valor
                    let copiedImage = new CanvasImage(clickedImage.img.src, x, y, IMAGE_SIZE, false, clickedImage.value); // isOriginal = false
                    canvasImages.push(copiedImage);
                    console.log(`Imagen copiada: ${clickedImage.img.src} en X: ${x}, Y: ${y} con Valor: ${clickedImage.value}`);

                    // Iniciar el arrastre de la copia
                    isDragging = true;
                    draggedImage = copiedImage;
                    dragOffsetX = x - copiedImage.x;
                    dragOffsetY = y - copiedImage.y;

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






