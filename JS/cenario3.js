/**
 * CENÁRIO 3: Ponte Rolante PR08/PR09 (Aéreo) - Ponte Vazia
 * Movimentação horizontal no eixo X (Ala Sul [direita] para Ala Norte [esquerda])
 * Regra: Gancho no extremo Norte (sobre H1) -> Evacuam trabalhadores de H1 e H2. H3 permanece liberado.
 */
function initScenario3() {
  const sec = document.getElementById('cenario-3');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const btnFloatingPlay = sec.querySelector('.btn-floating-play');
  const btnFloatingReset = sec.querySelector('.btn-floating-reset');

  const crane = sec.querySelector('#s3-crane');
  
  const w1 = sec.querySelector('#s3-w1');
  const w2 = sec.querySelector('#s3-w2');
  const w3 = sec.querySelector('#s3-w3');
  const w4 = sec.querySelector('#s3-w4');
  const w5 = sec.querySelector('#s3-w5');
  const w6 = sec.querySelector('#s3-w6');

  const zoneH1 = sec.querySelector('#s3-zone-h1');
  const zoneH2 = sec.querySelector('#s3-zone-h2');
  const zoneH3 = sec.querySelector('#s3-zone-h3');
  const statusBadge = sec.querySelector('.live-alert-badge');

  const progress = createProgressController(sec, 3200);

  let isRunning = false;
  let animationTimeouts = [];

  function clearAllTimeouts() {
    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];
  }

  function play() {
    if (isRunning) return;
    isRunning = true;
    clearAllTimeouts();
    btnPlay.classList.add('playing');
    if (btnFloatingPlay) {
      btnFloatingPlay.classList.add('playing');
      btnFloatingPlay.textContent = '⏸ Executando...';
    }
    progress.start();

    // 1. Ponte translada no EIXO X da Ala Sul (direita, X=600px) para a Ala Norte (esquerda, X=320px sobre H1/H2)
    crane.style.transition = 'transform 3.2s cubic-bezier(0.25, 1, 0.5, 1)';
    crane.style.transform = 'translateX(320px)';

    statusBadge.className = 'live-alert-badge warning';
    statusBadge.querySelector('.alert-text-status').textContent = '⚠️ PONTE EM TRÂNSITO (SUL ➔ NORTE)...';

    // 2. Quando o gancho aproxima-se do eixo de H1/H2 (~1.4s)
    animationTimeouts.push(setTimeout(() => {
      // Regra: Apenas H1 e H2 evacuam. H3 é seguro.
      zoneH1.classList.add('danger');
      zoneH2.classList.add('danger');
      zoneH3.classList.add('safe');

      statusBadge.className = 'live-alert-badge warning';
      statusBadge.querySelector('.alert-text-status').textContent = 'ALERTA: GANCHO SOBRE H1 ➔ EVACUAR H1 E H2';

      // Evacuação de H1 e H2 (w1, w2, w3) para o refúgio seguro
      w1.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w1.style.transform = 'translate(100px, 442px)';

      w2.style.transition = 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w2.style.transform = 'translate(135px, 442px)';

      w3.style.transition = 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w3.style.transform = 'translate(170px, 442px)';
    }, 1400));

    // 3. Conclusão (~3.2s)
    animationTimeouts.push(setTimeout(() => {
      statusBadge.className = 'live-alert-badge warning';
      statusBadge.querySelector('.alert-text-status').textContent = '✅ GANCHO NO LIMITE NORTE | H3 SEGURO';
      btnPlay.classList.remove('playing');
      if (btnFloatingPlay) {
        btnFloatingPlay.classList.remove('playing');
        btnFloatingPlay.textContent = '▶ Simular';
      }
    }, 3200));
  }

  function reset() {
    isRunning = false;
    clearAllTimeouts();
    progress.reset();
    btnPlay.classList.remove('playing');
    if (btnFloatingPlay) {
      btnFloatingPlay.classList.remove('playing');
      btnFloatingPlay.textContent = '▶ Simular';
    }

    crane.style.transition = 'none';
    crane.style.transform = 'translateX(600px)';

    [w1, w2, w3, w4, w5, w6].forEach(w => w.style.transition = 'none');
    w1.style.transform = 'translate(110px, 30px)';
    w2.style.transform = 'translate(160px, 30px)';
    w3.style.transform = 'translate(32px, 110px)';
    w4.style.transform = 'translate(235px, 140px)';
    w5.style.transform = 'translate(235px, 210px)';
    w6.style.transform = 'translate(235px, 280px)';

    [zoneH1, zoneH2, zoneH3].forEach(z => z.className = 'zone-rect');

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: PONTE ESTACIONADA';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
  if (btnFloatingPlay) btnFloatingPlay.addEventListener('click', play);
  if (btnFloatingReset) btnFloatingReset.addEventListener('click', reset);
}
