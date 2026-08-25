/**
 * CENÁRIO 4: Ponte Rolante PR08/PR09 (Aéreo) - Com Panela (Cheia/Vazia)
 * Movimentação horizontal no eixo X cruzando todo o vão livre (Sul ➔ Norte)
 * Regra: Carga suspensa cruzando o vão -> Evacuação TOTAL imediata de todo o H0.
 */
function initScenario4() {
  const sec = document.getElementById('cenario-4');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const varButtons = sec.querySelectorAll('.btn-var');
  const crane = sec.querySelector('#s4-crane');
  const liquidSteel = sec.querySelector('#s4-liquid-steel');
  
  const w1 = sec.querySelector('#s4-w1');
  const w2 = sec.querySelector('#s4-w2');
  const w3 = sec.querySelector('#s4-w3');
  const w4 = sec.querySelector('#s4-w4');
  const w5 = sec.querySelector('#s4-w5');
  const w6 = sec.querySelector('#s4-w6');

  const zoneH1 = sec.querySelector('#s4-zone-h1');
  const zoneH2 = sec.querySelector('#s4-zone-h2');
  const zoneH3 = sec.querySelector('#s4-zone-h3');
  const statusBadge = sec.querySelector('.live-alert-badge');

  const progress = createProgressController(sec, 3800);

  let isFull = true;
  let isRunning = false;
  let animationTimeouts = [];

  varButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      varButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isFull = btn.dataset.var === 'full';
      if (liquidSteel) {
        liquidSteel.style.fill = isFull ? '#f97316' : '#334155';
      }
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

    // 1. Ponte com panela içada translada no EIXO X da Ala Sul (direita, X=620px) até a Ala Norte (esquerda, X=100px)
    crane.style.transition = 'transform 3.8s linear';
    crane.style.transform = 'translateX(100px)';

    statusBadge.className = 'live-alert-badge danger';
    statusBadge.querySelector('.alert-text-status').textContent = '⚠️ CARGA SUSPENSA EM TRÂNSITO (SUL ➔ NORTE)...';

    // 2. Imediatamente ao entrar no cone do vão de H0 (~0.4s)
    animationTimeouts.push(setTimeout(() => {
      // Regra: CARGA SUSPENSA = EVACUAÇÃO TOTAL IMEDIATA
      [zoneH1, zoneH2, zoneH3].forEach(z => {
        z.classList.remove('safe');
        z.classList.add('danger');
      });

      statusBadge.className = 'live-alert-badge danger';
      statusBadge.querySelector('.alert-text-status').textContent = '🚨 PERIGO: CARGA SUSPENSA SOBRE H0 - EVACUAÇÃO TOTAL!';

      // Todos os 6 trabalhadores saem de H0 para dentro do refúgio seguro em formação alinhada
      w1.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w1.style.transform = 'translate(50px, 442px)';

      w2.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w2.style.transform = 'translate(84px, 442px)';

      w3.style.transition = 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w3.style.transform = 'translate(118px, 442px)';

      w4.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w4.style.transform = 'translate(152px, 442px)';

      w5.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w5.style.transform = 'translate(186px, 442px)';

      w6.style.transition = 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w6.style.transform = 'translate(220px, 442px)';
    }, 400));

    // 3. Conclusão (~3.8s)
    animationTimeouts.push(setTimeout(() => {
      statusBadge.className = 'live-alert-badge warning';
      statusBadge.querySelector('.alert-text-status').textContent = '✅ CARGA TRANSITADA PARA ALA NORTE | H0 EM SEGURANÇA';
      btnPlay.classList.remove('playing');
    }, 3800));
  }

  function reset() {
    isRunning = false;
    clearAllTimeouts();
    progress.reset();
    btnPlay.classList.remove('playing');

    crane.style.transition = 'none';
    crane.style.transform = 'translateX(620px)';

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
}
