// Criar os elementos do cursor dinamicamente
const dot = document.createElement('div');
const ring = document.createElement('div');
dot.className = 'custom-cursor-dot';
ring.className = 'custom-cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

// Rastreia o movimento do mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
});

// Loop de animação física
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Seleciona todos os elementos interativos
const targets = document.querySelectorAll(
    'a, button, .price-card-floating, .service-card, .logo img, h1, h2, .section-title, p, .subtitle, .subtitle-center, .studio-tag h2, .about-text h2'
);

// Efeito de expansão ao passar o mouse
targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
    });
    target.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
    });
});