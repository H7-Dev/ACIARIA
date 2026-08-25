/**
 * ACIARIA - APLICAÇÃO PRINCIPAL (APP COORDENADOR)
 * Inicialização dos módulos de navegação, notas e simulação dos cenários
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initNavigation === 'function') initNavigation();
  if (typeof initNotesSystem === 'function') initNotesSystem();
  if (typeof initScenario1 === 'function') initScenario1();
  if (typeof initScenario2 === 'function') initScenario2();
  if (typeof initScenario3 === 'function') initScenario3();
  if (typeof initScenario4 === 'function') initScenario4();
});

/**
 * Helper global para gerenciar a barra de progresso da simulação
 */
function createProgressController(sec, totalDurationMs) {
  const progressBar = sec.querySelector('.sim-progress-fill');
  const timeTag = sec.querySelector('.sim-time-tag');
  let startTime = null;
  let rafId = null;

  function start() {
    stop();
    startTime = performance.now();
    function tick(now) {
      const elapsed = Math.min(now - startTime, totalDurationMs);
      const pct = (elapsed / totalDurationMs) * 100;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (timeTag) timeTag.textContent = `${(elapsed / 1000).toFixed(1)}s`;

      if (elapsed < totalDurationMs) {
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function reset() {
    stop();
    if (progressBar) progressBar.style.width = '0%';
    if (timeTag) timeTag.textContent = '0.0s';
  }

  return { start, stop, reset };
}
