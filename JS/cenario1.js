/**
 * CENÁRIO 1: Linha Bate e Volta (Ala Sul) - Panela Vazia
 * Regra: Quando o carro do Bate e Volta se aproxima, apenas trabalhadores de H3 evacuam.
 */
function initScenario1() {
  const sec = document.getElementById('cenario-1');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const varButtons = sec.querySelectorAll('.btn-var');
  const car = sec.querySelector('#s1-car');
  const lid = sec.querySelector('#s1-ladle-lid');
  
  const w1 = sec.querySelector('#s1-w1');
  const w2 = sec.querySelector('#s1-w2');
  const w3 = sec.querySelector('#s1-w3');
  const w4 = sec.querySelector('#s1-w4');
  const w5 = sec.querySelector('#s1-w5');
  const w6 = sec.querySelector('#s1-w6');

  const zoneH1 = sec.querySelector('#s1-zone-h1');
  const zoneH2 = sec.querySelector('#s1-zone-h2');
  const zoneH3 = sec.querySelector('#s1-zone-h3');
  const statusBadge = sec.querySelector('.live-alert-badge');

  const progress = createProgressController(sec, 3500);

  let hasLid = false;
  let isRunning = false;
  let animationTimeouts = [];

  varButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      varButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hasLid = btn.dataset.var === 'lid';
      if (lid) lid.style.display = hasLid ? 'block' : 'none';
    });
  });

  function clearAllTimeouts() {
    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];
  }

  function play() {
    if (isRunning) return;
    isRunning = true;
    clearAllTimeouts();
    btnPlay.classList.add('playing');
    progress.start();

    // 1. Carro inicia movimento suave subindo pelo trilho Sul
    car.style.transition = 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)';
    car.style.transform = 'translate(550px, 240px)';

    // Status inicial de aproximação
    statusBadge.className = 'live-alert-badge warning';
    statusBadge.querySelector('.alert-text-status').textContent = '⚠️ CARRO EM APROXIMAÇÃO (ALA SUL)...';

    // H1 e H2 continuam liberados
    zoneH1.classList.add('safe');
    zoneH2.classList.add('safe');

    // 2. Quando o carro chega na altura da frente H3 (~1.8s)
    animationTimeouts.push(setTimeout(() => {
      zoneH3.classList.remove('safe');
      zoneH3.classList.add('danger');

      statusBadge.className = 'live-alert-badge danger';
      statusBadge.querySelector('.alert-text-status').textContent = '🚨 CARRO CHEGOU EM H3: EVACUAÇÃO IMEDIATA!';

      // Trabalhadores de H3 evacuam e se alinham horizontalmente no refúgio
      w4.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w4.style.transform = 'translate(100px, 442px)';

      w5.style.transition = 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w5.style.transform = 'translate(135px, 442px)';

      w6.style.transition = 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w6.style.transform = 'translate(170px, 442px)';
    }, 1800));

    // 3. Conclusão (~3.5s)
    animationTimeouts.push(setTimeout(() => {
      statusBadge.className = 'live-alert-badge warning';
      statusBadge.querySelector('.alert-text-status').textContent = '✅ H3 EVACUADO NO REFÚGIO | H1 E H2 SEGUROS';
      btnPlay.classList.remove('playing');
    }, 3500));
  }

  function reset() {
    isRunning = false;
    clearAllTimeouts();
    progress.reset();
    btnPlay.classList.remove('playing');

    car.style.transition = 'none';
    car.style.transform = 'translate(550px, 520px)';
    
    // Retorna operários para as posições de trabalho
    w1.style.transition = 'none';
    w1.style.transform = 'translate(110px, 30px)';
    w2.style.transition = 'none';
    w2.style.transform = 'translate(160px, 30px)';
    w3.style.transition = 'none';
    w3.style.transform = 'translate(32px, 110px)';
    w4.style.transition = 'none';
    w4.style.transform = 'translate(235px, 140px)';
    w5.style.transition = 'none';
    w5.style.transform = 'translate(235px, 210px)';
    w6.style.transition = 'none';
    w6.style.transform = 'translate(235px, 280px)';

    zoneH1.className = 'zone-rect';
    zoneH2.className = 'zone-rect';
    zoneH3.className = 'zone-rect';

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: ÁREA EM OBRAS';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}
