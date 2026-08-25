/**
 * ACIARIA - SIMULADOR INTERATIVO DE SEGURANÇA E EVACUAÇÃO
 * Controle das seções, animações SVG, player compacto com timeline e alinhamento dos trabalhadores
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNotesSystem();
  initScenario1();
  initScenario2();
  initScenario3();
  initScenario4();
});

// Sistema de Abas de Notas / Cenários Customizados (Default, C2, C3...)
function initNotesSystem() {
  const sections = document.querySelectorAll('.scenario-section');

  sections.forEach((sec, idx) => {
    const tabBar = sec.querySelector('.notes-tab-bar');
    const defaultTab = tabBar ? tabBar.querySelector('[data-tab="default"]') : null;
    const customTabsContainer = sec.querySelector('.custom-tabs-container');
    const btnAddTab = sec.querySelector('.btn-add-tab');
    const formCard = sec.querySelector('.note-form-card');
    const btnCloseForm = sec.querySelector('.btn-close-form');
    const btnCancelNote = sec.querySelector('.btn-cancel-note');
    const btnSaveNote = sec.querySelector('.btn-save-note');
    const inputTitle = sec.querySelector('.input-note-title');
    const inputDesc = sec.querySelector('.input-note-desc');
    const contentContainer = sec.querySelector('.notes-content-container');
    const defaultContent = sec.querySelector('.default-content');

    if (!tabBar || !customTabsContainer) return;

    let notes = []; // Array de notas criadas: { id: 'c2', label: 'C2', title: '', desc: '' }

    function openForm() {
      if (!formCard) return;
      formCard.classList.add('visible');
      if (inputTitle) inputTitle.value = '';
      if (inputDesc) inputDesc.value = '';
      if (inputTitle) inputTitle.focus();
    }

    function closeForm() {
      if (!formCard) return;
      formCard.classList.remove('visible');
    }

    if (btnAddTab) btnAddTab.addEventListener('click', openForm);
    if (btnCloseForm) btnCloseForm.addEventListener('click', closeForm);
    if (btnCancelNote) btnCancelNote.addEventListener('click', closeForm);

    function renderNoteContent(note) {
      if (!contentContainer) return;
      if (defaultContent) defaultContent.style.display = 'none';

      // Remove view anterior de nota customizada
      const oldCustom = contentContainer.querySelector('.custom-note-view');
      if (oldCustom) oldCustom.remove();

      const noteCard = document.createElement('div');
      noteCard.className = 'custom-note-view';
      noteCard.innerHTML = `
        <div class="rule-card" style="border-color: rgba(6, 182, 212, 0.4); background: rgba(6, 182, 212, 0.05);">
          <div class="rule-title" style="color: var(--accent-cyan);">
            📌 ${note.label}: ${note.title || 'Nota Técnica'}
          </div>
          <div style="font-size: 0.82rem; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; margin-top: 0.4rem;">
            ${note.desc || 'Sem observações adicionais.'}
          </div>
        </div>
      `;
      contentContainer.appendChild(noteCard);
    }

    function showDefaultContent() {
      const oldCustom = contentContainer ? contentContainer.querySelector('.custom-note-view') : null;
      if (oldCustom) oldCustom.remove();
      if (defaultContent) defaultContent.style.display = 'block';

      // Atualiza abas ativas
      tabBar.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      if (defaultTab) defaultTab.classList.add('active');
    }

    if (defaultTab) {
      defaultTab.addEventListener('click', showDefaultContent);
    }

    function addNote() {
      const title = inputTitle ? inputTitle.value.trim() : '';
      const desc = inputDesc ? inputDesc.value.trim() : '';

      if (!title && !desc) {
        if (inputTitle) inputTitle.focus();
        return;
      }

      const noteIndex = notes.length + 2; // C2, C3, C4...
      const noteId = `c${noteIndex}`;
      const noteLabel = `C${noteIndex}`;

      const newNote = {
        id: noteId,
        label: noteLabel,
        title: title || `Cenário ${noteIndex}`,
        desc: desc
      };

      notes.push(newNote);

      // Cria botão de aba
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab-item active';
      tabBtn.dataset.tab = noteId;
      tabBtn.textContent = noteLabel;
      tabBtn.title = newNote.title;

      tabBtn.addEventListener('click', () => {
        tabBar.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        tabBtn.classList.add('active');
        renderNoteContent(newNote);
      });

      // Desativa as outras abas
      tabBar.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      customTabsContainer.appendChild(tabBtn);

      // Renderiza o conteúdo da nota criada
      renderNoteContent(newNote);
      closeForm();
    }

    if (btnSaveNote) btnSaveNote.addEventListener('click', addNote);
  });
}

// Navegação de cabeçalho
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.scenario-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navButtons.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => observer.observe(sec));
}

// Helper para gerenciar a barra de progresso da simulação
function createProgressController(sec, totalDurationMs) {
  const progressBar = sec.querySelector('.sim-progress-bar');
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

// -------------------------------------------------------------
// CENÁRIO 1: Linha Bate e Volta (Ala Sul) - Panela Vazia
// -------------------------------------------------------------
function initScenario1() {
  const sec = document.getElementById('cenario-1');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const varButtons = sec.querySelectorAll('.btn-var');
  const car = sec.querySelector('#s1-car');
  const lid = sec.querySelector('#s1-ladle-lid');
  
  // Trabalhadores individuais
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
  const statusH1 = sec.querySelector('#s1-status-h1');
  const statusH2 = sec.querySelector('#s1-status-h2');
  const statusH3 = sec.querySelector('#s1-status-h3');

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

    // H1 e H2 continuam liberados desde o início
    zoneH1.classList.add('safe');
    zoneH2.classList.add('safe');
    statusH1.className = 'zone-card status-safe';
    statusH1.querySelector('.zc-status').textContent = 'LIBERADO';
    statusH2.className = 'zone-card status-safe';
    statusH2.querySelector('.zc-status').textContent = 'LIBERADO';

    // 2. Quando o carro chega na altura da frente H3 (~1.8s)
    animationTimeouts.push(setTimeout(() => {
      zoneH3.classList.remove('safe');
      zoneH3.classList.add('danger');
      statusH3.className = 'zone-card status-danger';
      statusH3.querySelector('.zc-status').textContent = 'EVACUAR';

      statusBadge.className = 'live-alert-badge danger';
      statusBadge.querySelector('.alert-text-status').textContent = '🚨 CARRO CHEGOU EM H3: EVACUAÇÃO IMEDIATA!';

      // Trabalhadores de H3 evacuam e se alinham horizontalmente lado a lado no refúgio
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

    statusH1.className = 'zone-card';
    statusH1.querySelector('.zc-status').textContent = 'AGUARDANDO';
    statusH2.className = 'zone-card';
    statusH2.querySelector('.zc-status').textContent = 'AGUARDANDO';
    statusH3.className = 'zone-card';
    statusH3.querySelector('.zc-status').textContent = 'AGUARDANDO';

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: ÁREA EM OBRAS';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}

// -------------------------------------------------------------
// CENÁRIO 2: Linha Carro 2 / Convertedor 2 (Ala Norte) - Panela Cheia
// -------------------------------------------------------------
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
  const statusH1 = sec.querySelector('#s2-status-h1');
  const statusH2 = sec.querySelector('#s2-status-h2');
  const statusH3 = sec.querySelector('#s2-status-h3');

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

      [statusH1, statusH2, statusH3].forEach(st => {
        st.className = 'zone-card status-danger';
        st.querySelector('.zc-status').textContent = 'EVACUAR';
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

    [statusH1, statusH2, statusH3].forEach(st => {
      st.className = 'zone-card';
      st.querySelector('.zc-status').textContent = 'AGUARDANDO';
    });

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: ÁREA EM OBRAS';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}

// -------------------------------------------------------------
// CENÁRIO 3: Ponte Rolante PR08/PR09 (Aéreo) - Ponte Vazia
// -------------------------------------------------------------
function initScenario3() {
  const sec = document.getElementById('cenario-3');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const crane = sec.querySelector('#s3-crane');
  const trolley = sec.querySelector('#s3-crane-trolley');
  
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
  const statusH1 = sec.querySelector('#s3-status-h1');
  const statusH2 = sec.querySelector('#s3-status-h2');
  const statusH3 = sec.querySelector('#s3-status-h3');

  const progress = createProgressController(sec, 2800);

  let isRunning = false;
  let animationTimeouts = [];

  function play() {
    if (isRunning) return;
    isRunning = true;
    btnPlay.classList.add('playing');
    progress.start();

    // Movimenta a ponte rolante sobre a área e posiciona o gancho no limite Norte (sobre H1)
    crane.style.transition = 'transform 2.8s cubic-bezier(0.25, 1, 0.5, 1)';
    crane.style.transform = 'translateY(140px)';

    trolley.style.transition = 'transform 2.8s ease-in-out';
    trolley.style.transform = 'translateX(-110px)'; // Jogado ao máximo em direção ao convertedor 2

    animationTimeouts.push(setTimeout(() => {
      // Regra: Apenas H1 e H2 evacuam. H3 é seguro.
      zoneH1.classList.add('danger');
      zoneH2.classList.add('danger');
      zoneH3.classList.add('safe');

      statusH1.className = 'zone-card status-danger';
      statusH1.querySelector('.zc-status').textContent = 'EVACUAR';
      statusH2.className = 'zone-card status-danger';
      statusH2.querySelector('.zc-status').textContent = 'EVACUAR';

      statusH3.className = 'zone-card status-safe';
      statusH3.querySelector('.zc-status').textContent = 'LIBERADO';

      statusBadge.className = 'live-alert-badge warning';
      statusBadge.querySelector('.alert-text-status').textContent = 'ALERTA: EVACUAR H1 E H2';

      // Evacuação de H1 e H2 (w1, w2, w3) para o refúgio seguro
      w1.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w1.style.transform = 'translate(100px, 442px)';

      w2.style.transition = 'transform 1.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w2.style.transform = 'translate(135px, 442px)';

      w3.style.transition = 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      w3.style.transform = 'translate(170px, 442px)';
    }, 500));

    animationTimeouts.push(setTimeout(() => {
      btnPlay.classList.remove('playing');
    }, 2800));
  }

  function reset() {
    isRunning = false;
    animationTimeouts.forEach(t => clearTimeout(t));
    progress.reset();
    btnPlay.classList.remove('playing');

    crane.style.transition = 'none';
    crane.style.transform = 'translateY(0px)';
    trolley.style.transition = 'none';
    trolley.style.transform = 'translateX(0px)';

    [w1, w2, w3, w4, w5, w6].forEach(w => w.style.transition = 'none');
    w1.style.transform = 'translate(110px, 30px)';
    w2.style.transform = 'translate(160px, 30px)';
    w3.style.transform = 'translate(32px, 110px)';
    w4.style.transform = 'translate(235px, 140px)';
    w5.style.transform = 'translate(235px, 210px)';
    w6.style.transform = 'translate(235px, 280px)';

    [zoneH1, zoneH2, zoneH3].forEach(z => z.className = 'zone-rect');

    [statusH1, statusH2, statusH3].forEach(st => {
      st.className = 'zone-card';
      st.querySelector('.zc-status').textContent = 'AGUARDANDO';
    });

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: PONTE ESTACIONADA';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}

// -------------------------------------------------------------
// CENÁRIO 4: Ponte Rolante PR08/PR09 (Aéreo) - Com Panela (Cheia/Vazia)
// -------------------------------------------------------------
function initScenario4() {
  const sec = document.getElementById('cenario-4');
  if (!sec) return;

  const btnPlay = sec.querySelector('.btn-play');
  const btnReset = sec.querySelector('.btn-reset');
  const varButtons = sec.querySelectorAll('.btn-var');
  const crane = sec.querySelector('#s4-crane');
  const suspendedLadle = sec.querySelector('#s4-suspended-ladle');
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
  const statusH1 = sec.querySelector('#s4-status-h1');
  const statusH2 = sec.querySelector('#s4-status-h2');
  const statusH3 = sec.querySelector('#s4-status-h3');

  const progress = createProgressController(sec, 3500);

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

  function play() {
    if (isRunning) return;
    isRunning = true;
    btnPlay.classList.add('playing');
    progress.start();

    // Ponte com panela içada cruza todo o vão aéreo de H0
    crane.style.transition = 'transform 3.5s linear';
    crane.style.transform = 'translateY(340px)';

    animationTimeouts.push(setTimeout(() => {
      // Regra: CARGA SUSPENSA = EVACUAÇÃO TOTAL IMEDIATA
      [zoneH1, zoneH2, zoneH3].forEach(z => {
        z.classList.remove('safe');
        z.classList.add('danger');
      });

      [statusH1, statusH2, statusH3].forEach(st => {
        st.className = 'zone-card status-danger';
        st.querySelector('.zc-status').textContent = 'EVACUAR';
      });

      statusBadge.className = 'live-alert-badge danger';
      statusBadge.querySelector('.alert-text-status').textContent = 'PERIGO: CARGA SUSPENSA - EVACUAÇÃO TOTAL';

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
    }, 300));

    animationTimeouts.push(setTimeout(() => {
      btnPlay.classList.remove('playing');
    }, 3500));
  }

  function reset() {
    isRunning = false;
    animationTimeouts.forEach(t => clearTimeout(t));
    progress.reset();
    btnPlay.classList.remove('playing');

    crane.style.transition = 'none';
    crane.style.transform = 'translateY(0px)';

    [w1, w2, w3, w4, w5, w6].forEach(w => w.style.transition = 'none');
    w1.style.transform = 'translate(110px, 30px)';
    w2.style.transform = 'translate(160px, 30px)';
    w3.style.transform = 'translate(32px, 110px)';
    w4.style.transform = 'translate(235px, 140px)';
    w5.style.transform = 'translate(235px, 210px)';
    w6.style.transform = 'translate(235px, 280px)';

    [zoneH1, zoneH2, zoneH3].forEach(z => z.className = 'zone-rect');

    [statusH1, statusH2, statusH3].forEach(st => {
      st.className = 'zone-card';
      st.querySelector('.zc-status').textContent = 'AGUARDANDO';
    });

    statusBadge.className = 'live-alert-badge';
    statusBadge.querySelector('.alert-text-status').textContent = 'STANDBY: PONTE ESTACIONADA';
  }

  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
}
