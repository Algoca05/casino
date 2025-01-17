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

// Add a variable to store the user's wallet balance
let wallet = localStorage.getItem('wallet') ? parseInt(localStorage.getItem('wallet')) : 1134; // Initial balance

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

function updateWalletDisplay() {
    context.fillStyle = 'yellow';
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText(`Wallet: ${wallet}`, 20, canvas.height - 20); // Bottom-left corner
    localStorage.setItem('wallet', wallet); // Save wallet balance to localStorage
}

function canvasMovement(){
    clearCanvas();
    let img = imgNone;
    if (w) img = imgW;
    if (a) img = imgA;
    if (s) img = imgS;
    if (d) img = imgD;
    
    context.drawImage(img, personajeX, personajeY, size, size);
    //Dibujar las hitboxes
    // drawHitboxes();

    /* ...existing popupText code... */

    if (popupText2) { // New popup for hitbox5
        // Draw semi-transparent background
        context.fillStyle = "black";
        context.fillRect(canvas.width / 2-55, canvas.height / 2-80, 210, 160);
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.fillText("A casa?", canvas.width / 2-50, (canvas.height / 2)-50);
        context.fillStyle = "white";
        context.fillText("Noooooo!!", canvas.width / 2-50, canvas.height / 2);
        context.fillStyle = "white";
        context.fillText("Al CASINOO!!!", canvas.width / 2-50,( canvas.height / 2)+50);

    }

    // Draw the user's wallet balance
    updateWalletDisplay();
}
// Define the hitbox coordinates
const hitbox1 = {
    x1: 1100,
    y1: 170,
    x2: 1900,
    y2: 700
};
// Add a second hitbox
const hitbox2 = {
    x1: 0,
    y1: 170,
    x2: 820, // Adjust as needed for width
    y2: 670
};
const hitbox3 = {
    x1: 0,
    y1: 170,
    x2: 880, // Adjust as needed for width
    y2: 250
};
const hitbox4 = {
    x1: 1050,
    y1: 170,
    x2: 2000, // Set x2 greater than x1 to define a width
    y2: 190
};
// Correct hitbox5 coordinates
const hitbox5 = {
    x1: 696,
    y1: 0,    // Set y1 to a lower value
    x2: 775,
    y2: 100   // Set y2 to a higher value
};

// Add a flag to track if the message has been shown
let hitbox5Collided = false;

// Add a flag to control the popup display for hitbox5
let popupText2 = false; // New flag for hitbox5 popup

function isColliding(x, y, size, hitboxes) {
    // Calcular la posición de la parte inferior central del personaje
    const bottomX = x + size / 2;
    const bottomY = y + size;

    let collidedHitbox = null;

    hitboxes.some(hitbox => {
        const collision = (
            bottomX >= hitbox.x1 &&
            bottomX <= hitbox.x2 &&
            bottomY >= hitbox.y1 &&
            bottomY <= hitbox.y2
        );
        if (collision) {
            collidedHitbox = hitbox;
            if (hitbox === hitbox4) {
                console.log(`Hitbox4 collision: ${collision}`);
            }
            if (hitbox === hitbox5) {
                console.log(`Hitbox5 collision: ${collision}`);
            }
            return true; // Exit the loop once a collision is found
        }
        return false;
    });

    return collidedHitbox;
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

    if ((personajeX < 505 && personajeX > 436) && personajeY === 50) {
        window.location.href = '../html/casino.html';
    }
    
    // Calcular la posición inferior después del movimiento
    const bottomX = newX + size / 2;
    const bottomY = newY + size;

    // Verificar colisión solo con la parte inferior
    const collidedHitbox = isColliding(newX, newY, size, [hitbox1, hitbox2, hitbox3, hitbox4, hitbox5]);

    if (collidedHitbox) {
        if (collidedHitbox === hitbox5 && !hitbox5Collided) {
            // Mostrar popup al colisionar con hitbox5
            popupText2 = true;
            hitbox5Collided = true; // Evita que el popup se muestre repetidamente
        }
    } else {
        // Reset the flag when not colliding
        if (popupText2) {
            popupText2 = false;
        }
        hitbox5Collided = false;
    }

    if (!collidedHitbox) {
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
    // Draw hitbox5
    context.strokeRect(hitbox5.x1, hitbox5.y1, hitbox5.x2 - hitbox5.x1, hitbox5.y2 - hitbox5.y1);
}

setInterval(()=>{checkMove();}, 20);