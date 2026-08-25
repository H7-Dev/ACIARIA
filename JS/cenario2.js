/**
 * CENÁRIO 2: Linha Carro 2 / Convertedor 2 (Ala Norte) - Panela Cheia
 * Regra: Carro saindo com panela cheia -> Evacuação total do H0 (H1, H2 e H3).
 */
function initScenario2() {
  const sec = document.getElementById('cenario-2');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const varButtons = sec.querySelectorAll('.btn-var');
  const car = sec.querySelector('#s2-car');
  const lid = sec.querySelector('#s2-ladle-lid');
  
  const w1 = sec.querySelector('#s2-w1');
  const w2 = sec.querySelector('#s2-w2');
  const w3 = sec.querySelector('#s2-w3');
  const w4 = sec.querySelector('#s2-w4');
  const w5 = sec.querySelector('#s2-w5');
  const w6 = sec.querySelector('#s2-w6');

  const zoneH1 = sec.querySelector('#s2-zone-h1');
  const zoneH2 = sec.querySelector('#s2-zone-h2');
  const zoneH3 = sec.querySelector('#s2-zone-h3');
  const statusBadge = sec.querySelector('.live-alert-badge');

  const progress = createProgressController(sec, 3000);

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

  function play() {
    if (isRunning) return;
    isRunning = true;
    btnPlay.classList.add('playing');
    progress.start();

    // Carro sai do Convertedor 2 descendo pelos trilhos da Ala Norte
    car.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.4, 1)';
    car.style.transform = 'translate(105px, 380px)';

    animationTimeouts.push(setTimeout(() => {
      // EVACUAÇÃO TOTAL: H1, H2 e H3 entram em perigo
      [zoneH1, zoneH2, zoneH3].forEach(z => {
        z.classList.remove('safe');
        z.classList.add('danger');
      });

      statusBadge.className = 'live-alert-badge danger';
      statusBadge.querySelector('.alert-text-status').textContent = 'PERIGO: EVACUAÇÃO TOTAL H0';

      // Todos os 6 trabalhadores evacuam e formam fila horizontal organizada no refúgio
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
    }, 350));

    animationTimeouts.push(setTimeout(() => {
      btnPlay.classList.remove('playing');
    }, 3000));
  }

  function reset() {
    isRunning = false;
    animationTimeouts.forEach(t => clearTimeout(t));
    progress.reset();
    btnPlay.classList.remove('playing');

    car.style.transition = 'none';
    car.style.transform = 'translate(105px, 90px)';

    [w1, w2, w3, w4, w5, w6].forEach(w => w.style.transition = 'none');
    w1.style.transform = 'translate(110px, 30px)';
    w2.style.transform = 'translate(160px, 30px)';
    w3.style.transform = 'translate(32px, 110px)';
    w4.style.transform = 'translate(235px, 140px)';
    w5.style.transform = 'translate(235px, 210px)';
    w6.style.transform = 'translate(235px, 280px)';

    [zoneH1, zoneH2, zoneH3].forEach(z => z.className = 'zone-rect');

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: ÁREA EM OBRAS';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}
