document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.my-toggler');
    const navbarNav = document.querySelector('.navbar-nav');

    navbarToggler.addEventListener('click', function () {
        navbarNav.classList.toggle('show');
        navbarToggler.classList.toggle('show');
    });
});