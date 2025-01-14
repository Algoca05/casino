//POSICIONAMIENTO DEL PERSONAJE
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let size = canvas.height * 0.1; // Set initial size to 10% of canvas height
let personajeX = (canvas.width / 2) - (size / 2);
let personajeY = (canvas.height / 2) - (size / 2);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    size = canvas.height * 0.1; // Update size on resize
    personajeX = (canvas.width / 2) - (size / 2);
    personajeY = (canvas.height / 2) - (size / 2);
    clearCanvas();
    context.drawImage(imgNone, personajeX, personajeY, size, size);
    // hitboxes[0].width = canvas.width; // Remove this line
});

//Canvas Images
let imgNone = new Image();
let imgW = new Image();
let imgA = new Image();
let imgS = new Image();
let imgD = new Image();
imgNone.src = '../multimedia/img/front.png';
imgS.src = '../multimedia/img/front.png';
imgA.src = '../multimedia/img/left.png';
imgW.src = '../multimedia/img/back.png';
imgD.src = '../multimedia/img/right.png';
let speed = 2;

let imagesLoaded = 0;
const totalImages = 5;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        context.drawImage(imgNone, personajeX, personajeY, 200, 200);
    }
}

imgNone.onload = imageLoaded;
imgW.onload = imageLoaded;
imgA.onload = imageLoaded;
imgS.onload = imageLoaded;
imgD.onload = imageLoaded;



//Control del tiempo
let teclaPresionada = false;

let w = false;
let a = false;
let s = false;
let d = false;

document.onkeydown = (e) => {
    if (e.key === "w" || e.key === "ArrowUp" || e.key === "W") {
        w = true;
    }
    if (e.key === "a" || e.key === "ArrowLeft" || e.key === "A") {
        a = true;
    }
    if (e.key === "s" || e.key === "ArrowDown" || e.key === "S") {
        s = true;
    }
    if (e.key === "d" || e.key === "ArrowRight" || e.key === "D") {
        d = true;
    }
};

document.onkeyup = (e) => {
    if (e.key === "w" || e.key === "ArrowUp" || e.key === "W") {
        w = false;
    }
    if (e.key === "a" || e.key === "ArrowLeft" || e.key === "A") {
        a = false;
    }
    if (e.key === "s" || e.key === "ArrowDown" || e.key === "S") {
        s = false;
    }
    if (e.key === "d" || e.key === "ArrowRight" || e.key === "D") {
        d = false;
    }
};

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let coordinatesDisplay = document.getElementById("coordinates");

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    coordinatesDisplay.textContent = `X: ${Math.round(mouseX)}, Y: ${Math.round(mouseY)}`;
});

function canvasMovement(){
    clearCanvas();
    let img = imgNone;
    if (w) img = imgW;
    if (a) img = imgA;
    if (s) img = imgS;
    if (d) img = imgD;
    
    context.drawImage(img, personajeX, personajeY, size, size);
    drawHitboxes();
    // coordinatesDisplay.textContent = `X: ${Math.round(personajeX)}, Y: ${Math.round(personajeY)}`;
}
// Define the hitbox coordinates
const hitbox1 = {
    x1: 0,
    y1: 135,
    x2: 700,
    y2: 150
};
// Add a second hitbox
const hitbox2 = {
    x1: 635,
    y1: 500,
    x2: 0, // Adjust as needed for width
    y2: 535
};
const hitbox3 = {
    x1: 0,
    y1: 0,
    x2: 0, // Adjust as needed for width
    y2: 0
};
const hitbox4 = {
    x1: 0,
    y1: 0,
    x2: 0, // Set x2 greater than x1 to define a width
    y2: 0
};

// Add debug logs for hitbox4
function isColliding(x, y, size, hitboxes) {
    // Calcular la posición de la parte inferior central del personaje
    const bottomX = x + size / 2;
    const bottomY = y + size;

    return hitboxes.some(hitbox => {
        const collision = (
            bottomX >= hitbox.x1 &&
            bottomX <= hitbox.x2 &&
            bottomY >= hitbox.y1 &&
            bottomY <= hitbox.y2
        );
        if (hitbox === hitbox4) {
            console.log(`Hitbox4 collision: ${collision}`);
        }
        return collision;
    });
}

function checkMove(){
    let newX = personajeX;
    let newY = personajeY;

    let lateralSpeed = size * 0.025; // Calculate lateral speed based on size

    if(w){
        newY = Math.max(50, personajeY - speed);
        newX = Math.min(canvas.width - size, personajeX + 0.85);
    }
    if(a){
        newX = Math.max(50, personajeX - lateralSpeed);
    }
    if(s){
        newY = Math.min(canvas.height - size, personajeY + speed);
        newX = Math.min(canvas.width + size, personajeX - 0.85);

    }
    if(d){
        newX = Math.min(canvas.width - size, personajeX + lateralSpeed);
    }
    
    size = personajeY * 1; // Adjust size based on Y position
72
    if ((personajeX < 505 && personajeX > 436) && personajeY === 50) {
        window.location.href = '../html/casino.html';
    }
    
    // Calcular la posición inferior después del movimiento
    const bottomX = newX + size / 2;
    const bottomY = newY + size;

   
    // Verificar colisión solo con la parte inferior
    const collision = isColliding(newX, newY, size, [hitbox1, hitbox2, hitbox3, hitbox4]);

    if (!collision) {
        personajeX = newX;
        personajeY = newY;
    }

    canvasMovement();
}

function drawHitboxes() {
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    // Draw hitbox1
    context.strokeRect(hitbox1.x1, hitbox1.y1, hitbox1.x2 - hitbox1.x1, hitbox1.y2 - hitbox1.y1);
    // Draw hitbox2
    context.strokeRect(hitbox2.x1, hitbox2.y1, hitbox2.x2 - hitbox2.x1, hitbox2.y2 - hitbox2.y1);
    // Draw hitbox3
    context.strokeRect(hitbox3.x1, hitbox3.y1, hitbox3.x2 - hitbox3.x1, hitbox3.y2 - hitbox3.y1);
    // Draw hitbox4
    context.strokeRect(hitbox4.x1, hitbox4.y1, hitbox4.x2 - hitbox4.x1, hitbox4.y2 - hitbox4.y1);
}

setInterval(()=>{checkMove();}, 20);