/**
 * Sistema de Abas de Cenários e Modal Centralizado com LocalStorage e Edição
 */
function initNotesSystem() {
  const modal = document.getElementById('scenario-modal-overlay');
  const modalForm = document.getElementById('scenario-custom-form');
  const modalHeaderTitle = modal ? modal.querySelector('.modal-header h3') : null;
  const btnSubmitModal = modal ? modal.querySelector('button[type="submit"]') : null;
  const btnCloseModal = document.getElementById('btn-modal-close');
  const btnCancelModal = document.getElementById('btn-modal-cancel');

  const inputTitle = document.getElementById('modal-input-title');
  const inputOrigin = document.getElementById('modal-input-origin');
  const inputCondition = document.getElementById('modal-input-condition');
  const inputEvacuate = document.getElementById('modal-input-evacuate');
  const inputRemain = document.getElementById('modal-input-remain');
  const inputJustification = document.getElementById('modal-input-justification');
  const inputAlert = document.getElementById('modal-input-alert');

  let activeSection = null;
  let editingScenarioId = null; // null = novo, string = id do cenário sendo editado

  const defaultsByScenario = {
    'cenario-1': {
      title: 'Manobra Bate e Volta (Variação)',
      origin: 'Outro setor para ponto final na Ala Sul.',
      condition: 'Vazia (com ou sem tampa).',
      evacuate: 'Apenas trabalhadores da Frente H3.',
      remain: 'Frentes H1 e H2 continuam liberadas.',
      justification: '• O carro do Bate e Volta corre na lateral contígua a H3.\n• Não há risco térmico de projeção de aço líquido (panela vazia).\n• Risco restrito ao atropelamento e proximidade de carga mecânica na faixa lateral H3.',
      alert: 'Atenção ao Rádio Operacional: Operador do carro emite sinal sonoro antes do deslocamento. H3 deve estar 100% livre.'
    },
    'cenario-2': {
      title: 'Saída Convertedor 2 (Variação)',
      origin: 'Saída do Convertedor 2 (Ala Norte).',
      condition: 'SEMPRE CHEIA (~150 a 300t de metal líquido).',
      evacuate: 'TOTAL DO H0 (H1 + H2 + H3).',
      remain: 'Nenhum trabalhador pode permanecer no perímetro H0.',
      justification: '• Projeção violenta de escória/metal por contato com umidade.\n• Radiação de calor extremo afetando todas as frentes adjacentes.\n• Com tampa ou sem tampa, a regra é evacuação total incondicional.',
      alert: 'Alarme Sonoro Contínuo: Acionamento de sirene da Aciaria antes da abertura das portas do转换ador e movimentação do carro.'
    },
    'cenario-3': {
      title: 'Ponte Rolante Vazia (Variação)',
      origin: 'Ponte vazia em trânsito transversal.',
      condition: 'Ponte rolante PR08/PR09 com gancho recolhido ao limite Norte.',
      evacuate: 'Frentes H1 e H2.',
      remain: 'Frente H3 continua liberada.',
      justification: '• O batente/limite mecânico do trole com gancho posicionado ao extremo Norte fica exatamente sobre o eixo superior de H1.\n• Por proximidade de raio e zona de influência lateral, H2 também evacua preventivamente.\n• A frente H3 fica fora do cone de perigo do gancho recolhido.',
      alert: 'Checklist de Manobra Aérea: Operador da ponte confirma alinhamento do gancho ao extremo Norte antes de liberar o cruzamento sobre H0.'
    },
    'cenario-4': {
      title: 'Carga Suspensa (Variação)',
      origin: 'Voo aéreo cruzando o vão de H0.',
      condition: 'Panela de Aço (Cheia ou Vazia).',
      evacuate: 'TOTAL DO H0 (H1 + H2 + H3).',
      remain: 'Tolerância Zero: Nenhuma pessoa sob o cone de içamento.',
      justification: '• Risco crítico de rompimento mecânico de laço/cabo de aço.\n• Risco de vazamento catastrófico de aço líquido pelo fundo/tampa.\n• Mesmo com panela vazia, a tara do equipamento ultrapassa dezenas de toneladas.',
      alert: 'Intertravamento de Segurança: Bloqueio visual e confirmação de área limpa (Clear Zone) antes da autorização de tráfego de carga suspensa.'
    }
  };

  function getStorageKey(secId) {
    return `aciaria_custom_${secId}`;
  }

  function getStoredScenarios(secId) {
    try {
      const data = localStorage.getItem(getStorageKey(secId));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Erro ao ler localStorage', e);
      return [];
    }
  }

  function saveStoredScenarios(secId, list) {
    try {
      localStorage.setItem(getStorageKey(secId), JSON.stringify(list));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage', e);
    }
  }

  function openModalForNew(sec) {
    activeSection = sec;
    editingScenarioId = null;
    const secId = sec.id;
    const defaults = defaultsByScenario[secId] || defaultsByScenario['cenario-1'];
    const nextIndex = (sec._customList ? sec._customList.length : 0) + 2;

    if (modal) {
      modal.classList.add('active');
      modalForm.reset();

      if (modalHeaderTitle) modalHeaderTitle.textContent = '📝 Adicionar Novo Cenário / Variação';
      if (btnSubmitModal) btnSubmitModal.textContent = '💾 Salvar e Criar Cenário';

      if (inputTitle) inputTitle.value = `Cenário ${nextIndex} - ${defaults.title}`;
      if (inputOrigin) inputOrigin.value = defaults.origin;
      if (inputCondition) inputCondition.value = defaults.condition;
      if (inputEvacuate) inputEvacuate.value = defaults.evacuate;
      if (inputRemain) inputRemain.value = defaults.remain;
      if (inputJustification) inputJustification.value = defaults.justification;
      if (inputAlert) inputAlert.value = defaults.alert;

      if (inputTitle) inputTitle.focus();
    }
  }

  function openModalForEdit(sec, item) {
    activeSection = sec;
    editingScenarioId = item.id;

    if (modal) {
      modal.classList.add('active');
      modalForm.reset();

      if (modalHeaderTitle) modalHeaderTitle.textContent = `✏️ Editar ${item.label} (${item.title})`;
      if (btnSubmitModal) btnSubmitModal.textContent = '💾 Atualizar Cenário';

      if (inputTitle) inputTitle.value = item.title;
      if (inputOrigin) inputOrigin.value = item.origin;
      if (inputCondition) inputCondition.value = item.condition;
      if (inputEvacuate) inputEvacuate.value = item.evacuate;
      if (inputRemain) inputRemain.value = item.remain;
      if (inputJustification) inputJustification.value = item.justification;
      if (inputAlert) inputAlert.value = item.alert;

      if (inputTitle) inputTitle.focus();
    }
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    activeSection = null;
    editingScenarioId = null;
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function buildJustificationHtml(justRaw) {
    if (!justRaw) {
      return `
        <li>Manobra customizada conforme planejamento da equipe de segurança.</li>
        <li>Verificação prévia do trajeto e comunicação direta via rádio operacional.</li>
      `;
    }
    const lines = justRaw.split('\n').filter(l => l.trim().length > 0);
    return lines.map(line => `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`).join('');
  }

  function renderCustomPanel(sec, item) {
    const contentContainer = sec.querySelector('.notes-content-container');
    if (!contentContainer) return null;

    let panel = sec._panels[item.id];
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'panel-view custom-panel';
      panel.id = `panel-${sec.id}-${item.id}`;
      contentContainer.appendChild(panel);
      sec._panels[item.id] = panel;
    }

    panel.innerHTML = `
      <div class="custom-panel-topbar">
        <div class="topbar-info">
          <span class="topbar-title">🏷️ ${item.label}: ${item.title}</span>
        </div>
        <div class="topbar-actions">
          <button class="btn-action-sm btn-edit-sm" title="Editar este cenário">✏️ Editar</button>
          <button class="btn-action-sm btn-delete-sm" title="Excluir este cenário">🗑️</button>
        </div>
      </div>

      <div class="rule-card">
        <div class="rule-title">🛡️ Regra Operacional Aplicada</div>
        <ul>
          <li><strong>Origem do Carro:</strong> ${item.origin}</li>
          <li><strong>Condição da Panela:</strong> ${item.condition}</li>
          <li class="highlight-danger"><strong>Quem Evacua:</strong> ${item.evacuate}</li>
          <li class="highlight-safe"><strong>Quem Permanece:</strong> ${item.remain}</li>
        </ul>
      </div>

      <div class="rule-card">
        <div class="rule-title">📌 Justificativa Técnica</div>
        <ul>
          ${buildJustificationHtml(item.justification)}
        </ul>
      </div>

      <div class="safety-alert-footer">
        <div class="alert-icon">⚠️</div>
        <div class="alert-text">
          <strong>Alerta de Segurança Operacional:</strong>
          ${item.alert || 'Atenção aos sinais sonoros e rádios de segurança.'}
        </div>
      </div>
    `;

    // Conecta botões de editar e excluir deste painel
    const btnEdit = panel.querySelector('.btn-edit-sm');
    const btnDelete = panel.querySelector('.btn-delete-sm');

    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        openModalForEdit(sec, item);
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (confirm(`Deseja realmente excluir o ${item.label} (${item.title})?`)) {
          deleteScenarioItem(sec, item.id);
        }
      });
    }

    return panel;
  }

  function deleteScenarioItem(sec, itemId) {
    // Remove do array e do localStorage
    sec._customList = sec._customList.filter(it => it.id !== itemId);
    saveStoredScenarios(sec.id, sec._customList);

    // Remove elemento do painel
    const panel = sec._panels[itemId];
    if (panel) panel.remove();
    delete sec._panels[itemId];

    // Remove botão da aba
    const tabBtn = sec.querySelector(`.notes-tab-bar .tab-item[data-tab="${itemId}"]`);
    if (tabBtn) tabBtn.remove();

    // Volta a seleção para o default
    switchPanel(sec, 'default');
  }

  function switchPanel(sec, panelId) {
    const tabBar = sec.querySelector('.notes-tab-bar');
    if (!tabBar) return;

    tabBar.querySelectorAll('.tab-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === panelId);
    });

    Object.keys(sec._panels).forEach(id => {
      const p = sec._panels[id];
      if (p) {
        p.style.display = (id === panelId) ? 'flex' : 'none';
      }
    });
  }

  function loadStoredDataForSection(sec) {
    const customTabsContainer = sec.querySelector('.custom-tabs-container');
    const list = getStoredScenarios(sec.id);
    sec._customList = list;

    list.forEach(item => {
      // Cria o botão da aba
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab-item';
      tabBtn.dataset.tab = item.id;
      tabBtn.textContent = item.label;
      tabBtn.title = item.title;

      tabBtn.addEventListener('click', () => {
        switchPanel(sec, item.id);
      });

      customTabsContainer.appendChild(tabBtn);

      // Renderiza o painel
      const panel = renderCustomPanel(sec, item);
      if (panel) panel.style.display = 'none';
    });
  }

  const sections = document.querySelectorAll('.scenario-section');

  sections.forEach((sec) => {
    const tabBar = sec.querySelector('.notes-tab-bar');
    const defaultTab = tabBar ? tabBar.querySelector('[data-tab="default"]') : null;
    const btnAddTab = sec.querySelector('.btn-add-tab');
    const defaultPanel = sec.querySelector('.default-panel');

    if (!tabBar) return;

    sec._panels = {
      'default': defaultPanel
    };
    sec._customList = [];

    // Carrega cenários salvos no LocalStorage desta seção
    loadStoredDataForSection(sec);

    if (btnAddTab) {
      btnAddTab.addEventListener('click', () => {
        openModalForNew(sec);
      });
    }

    if (defaultTab) {
      defaultTab.addEventListener('click', () => {
        switchPanel(sec, 'default');
      });
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeSection) return;

      const sec = activeSection;
      const customTabsContainer = sec.querySelector('.custom-tabs-container');

      const title = inputTitle.value.trim() || 'Variação Operacional';
      const origin = inputOrigin.value.trim() || 'Origem não especificada';
      const condition = inputCondition.value.trim() || 'Condição padrão';
      const evacuate = inputEvacuate.value.trim() || 'A definir';
      const remain = inputRemain.value.trim() || 'A definir';
      const justification = inputJustification.value.trim();
      const alert = inputAlert.value.trim() || 'Atenção aos sinais sonoros e rádios de segurança.';

      if (editingScenarioId) {
        // MODO EDIÇÃO: Atualiza item existente
        const item = sec._customList.find(it => it.id === editingScenarioId);
        if (item) {
          item.title = title;
          item.origin = origin;
          item.condition = condition;
          item.evacuate = evacuate;
          item.remain = remain;
          item.justification = justification;
          item.alert = alert;

          saveStoredScenarios(sec.id, sec._customList);

          // Atualiza tooltip da aba
          const tabBtn = sec.querySelector(`.notes-tab-bar .tab-item[data-tab="${item.id}"]`);
          if (tabBtn) tabBtn.title = title;

          // Re-renderiza o painel
          renderCustomPanel(sec, item);
          switchPanel(sec, item.id);
        }
      } else {
        // MODO CRIAÇÃO: Adiciona novo item
        const nextIndex = (sec._customList.length) + 2;
        const panelId = `c${nextIndex}`;
        const tabLabel = `C${nextIndex}`;

        const newItem = {
          id: panelId,
          label: tabLabel,
          title: title,
          origin: origin,
          condition: condition,
          evacuate: evacuate,
          remain: remain,
          justification: justification,
          alert: alert
        };

        sec._customList.push(newItem);
        saveStoredScenarios(sec.id, sec._customList);

        // Cria o botão de aba na barra
        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'tab-item';
        newTabBtn.dataset.tab = panelId;
        newTabBtn.textContent = tabLabel;
        newTabBtn.title = title;

        newTabBtn.addEventListener('click', () => {
          switchPanel(sec, panelId);
        });

        customTabsContainer.appendChild(newTabBtn);

        // Renderiza o novo painel
        renderCustomPanel(sec, newItem);

        // Alterna automaticamente para o novo painel criado
        switchPanel(sec, panelId);
      }

      closeModal();
    });
  }
}
