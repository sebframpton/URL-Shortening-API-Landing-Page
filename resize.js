const menuButton = document.querySelector('.menubutton');
const currentWidth = window.innerWidth;
const menu = document.querySelector('.menu');

window.addEventListener('resize', (e) => {
    menuMobileDesktop(e.target.innerWidth);
});

const menuMobileDesktop = (width) => {
    width > 768 ? menu.classList.replace('mobile', 'desktop') : menu.classList.replace('desktop', 'mobile');
    
    width > 768 ? menu.classList.remove('hidden') : menu.classList.add('hidden');

    if (width < 432) {
        menu.style.width = `${width - 32}px`;
    }
}

menuMobileDesktop(currentWidth);

const toggleMenu = () => {
    menu.classList.toggle('hidden');
}

menuButton.addEventListener('click', toggleMenu);

window.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menu.classList.contains('hidden') && !menuButton.contains(e.target)) {
        menu.classList.add('hidden');
    }
});