/**
 * Navegação de Cabeçalho entre Cenários
 */
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.scenario-section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 100;
      if (window.scrollY >= secTop) {
        current = sec.getAttribute('id');
      }
    });

    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('href') === `#${current}`) {
        btn.classList.add('active');
      }
    });
  });
}
