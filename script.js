// Efeito de mudar a transparência do Header ao rolar a página
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(10, 17, 40, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.backgroundColor = 'rgba(10, 17, 40, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Suporte para scroll suave para navegadores mais antigos (opcional)
const menuLinks = document.querySelectorAll('.nav-menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 80, // desconta a altura do header fixo
            behavior: 'smooth'
        });
    });
});
function openTab(evt, tabName) {
    // Esconde todo conteúdo
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }
    // Remove classe ativa dos botões
    const buttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }
    // Mostra a aba clicada
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}