const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const flowerPaths = [
    "images/flower1.png",
    "images/flower2.png",
    "images/flower3.png"
];

const flowerImages = [];

flowerPaths.forEach(path => {
    const img = new Image();
    img.onload = () => {
        console.log("Loaded:", path);
        flowerImages.push(img);
    };
    img.onerror = () => console.error("Failed to load:", path);
    img.src = path;
});

const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;

let particles = [];

class Flower {
    constructor(vortex = false) {
        this.img = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        this.vortex = vortex;

        if (vortex) {
            this.radius = 400 + Math.random() * 700;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = 0.01 + Math.random() * 0.02;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
        }

        this.size = 30 + Math.random() * 90;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.opacity = 1; // force visible for testing
        this.fadeSpeed = 0.005 + Math.random() * 0.01;
    }

    update() {
        if (this.vortex) {
            this.radius *= 0.992;
            this.angle += this.speed;
            this.x = centerX() + Math.cos(this.angle) * this.radius;
            this.y = centerY() + Math.sin(this.angle) * this.radius;

            if (this.radius < 40) {
                this.vortex = false;
                this.vx = (Math.random() - 0.5) * 14;
                this.vy = (Math.random() - 0.5) * 14;
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.995;
            this.vy *= 0.995;
        }

        this.rotation += this.rotationSpeed;
        if (this.opacity < 1) this.opacity += this.fadeSpeed;
    }

    draw() {
        if (!this.img) return;
        ctx.save();
        ctx.globalAlpha = Math.min(this.opacity, 1);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

/* INITIAL FLOWER VORTEX */
for (let i = 0; i < 250; i++) {
    particles.push(new Flower(true));
}

/* FLOATING PETALS */
class Petal {
    constructor() {
        this.img = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        this.x = Math.random() * canvas.width;
        this.y = -100;
        this.size = 20 + Math.random() * 40;
        this.speed = 0.5 + Math.random() * 2;
        this.swing = Math.random() * 100;
        this.rotation = Math.random() * 360;
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y / 50 + this.swing) * 1.5;
        this.rotation += 0.5;
        if (this.y > canvas.height + 100) this.y = -100;
    }

    draw() {
        if (!this.img) return;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

let petals = [];
for (let i = 0; i < 60; i++) petals.push(new Petal());

function drawGlow() {
    const gradient = ctx.createRadialGradient(centerX(), centerY(), 50, centerX(), centerY(), 600);
    gradient.addColorStop(0, "rgba(255,220,235,.4)");
    gradient.addColorStop(1, "rgba(255,220,235,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGlow();
    particles.forEach(p => { p.update(); p.draw(); });
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

animate();

/* TIMELINE */
const intro = document.getElementById("textContainer");
const finalScreen = document.getElementById("finalScreen");

setTimeout(() => intro.classList.add("hideIntro"), 9000);
setTimeout(() => finalScreen.classList.add("showFinal"), 10500);

/* FLOWER BURST */
setTimeout(() => {
    for (let i = 0; i < 200; i++) {
        const burst = new Flower(false);
        burst.x = centerX();
        burst.y = centerY();
        burst.vx = (Math.random() - 0.5) * 20;
        burst.vy = (Math.random() - 0.5) * 20;
        burst.size = 20 + Math.random() * 70;
        particles.push(burst);
    }
}, 8000);
