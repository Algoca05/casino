//POSICIONAMIENTO DEL PERSONAJE
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let size = 200; // Set size to 200
let personajeX = 700;
let personajeY = 700;


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
let speed = 10;

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
    // Add navigation on Enter when popup is shown
    if (popupText && e.key === "Enter") {
        window.location.href = '../html/cartas.html';
    }
    // Add navigation on Enter when popupText1 is shown
    if (popupText1 && e.key === "Enter") {
        window.location.href = '../html/ruleta.html';
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

let mouseX = 0;
let mouseY = 0;

// Add mousemove event listener to update mouse coordinates
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    coordinatesDisplay.textContent = `X: ${Math.round(mouseX)}, Y: ${Math.round(mouseY)}`;
});

let popupText = false;
let popupText1 = false;

function canvasMovement(){
    clearCanvas();
    let img = imgNone;
    if (w) img = imgW;
    if (a) img = imgA;
    if (s) img = imgS;
    if (d) img = imgD;
    
    context.drawImage(img, personajeX, personajeY, size, size);
    drawHitboxes();

    if (popupText) {
        context.fillStyle = "black";
        context.fillRect(190, 460, 205, 120);
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.fillText("quieres jugar?", 200, 500);
        context.fillStyle = "white";
        context.fillText("PRESS Enter", 200, 550);
    }
    
    if (popupText1) {
        context.fillStyle = "black";
        context.fillRect(1300, 350, 205, 120);
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.fillText("La tricolor?", 1310, 385);
        context.fillStyle = "white";
        context.fillText("PRESS Enter", 1310, 385+50);
    }
    
}

// Define the hitbox coordinates
const hitbox1 = {
    x1: 1025,
    y1: 200,
    x2: 2000,
    y2: 600
};

// Add a second hitbox
const hitbox2 = {
    x1: 1250,
    y1: 160,
    x2: 1675, // Adjust as needed for width
    y2: 250
};
const hitbox3 = {
    x1: 1770,
    y1: 155,
    x2: 1900, // Adjust as needed for width
    y2: 500
};
const hitbox4 = {
    x1: 0,
    y1: 140,
    x2: 435, // Set x2 greater than x1 to define a width
    y2: 1000
};

let popupShown = false;

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
            if (collision && !popupText) {
                popupText = true;
            } else if (!collision) {
                popupText = false;
            }
        }
        if (hitbox === hitbox1) {
            console.log(`Hitbox1 collision: ${collision}`);
            if (collision && !popupText1) {
                popupText1 = true;
            } else if (!collision) {
                popupText1 = false;
            }
        }
        return collision;
    });
}

function checkMove(){
    let newX = personajeX;
    let newY = personajeY;

    if(w){
        newY = Math.max(10 - size, personajeY - speed);
    }
    if(a){
        newX = Math.max(0, personajeX - speed);
    }
    if(s){
        newY = Math.min(canvas.height - size, personajeY + speed);
    }
    if(d){
        newX = Math.min(canvas.width - size, personajeX + speed);
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