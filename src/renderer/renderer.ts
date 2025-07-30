const textarea = document.getElementById('entry') as HTMLTextAreaElement;
const saveBtn = document.getElementById('save') as HTMLButtonElement;
const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
const dataDirInput = document.getElementById('data-dir') as HTMLInputElement;
const browseDirBtn = document.getElementById('browse-dir') as HTMLButtonElement;
const saveSettingsBtn = document.getElementById('save-settings') as HTMLButtonElement;
const historySelect = document.getElementById('history') as HTMLSelectElement;
const loadHistoryBtn = document.getElementById('load-history') as HTMLButtonElement;
const weekBtn = document.getElementById('week') as HTMLButtonElement;
const monthBtn = document.getElementById('month') as HTMLButtonElement;
const yearBtn = document.getElementById('year') as HTMLButtonElement;
const startDateInput = document.getElementById('start-date') as HTMLInputElement;
const endDateInput = document.getElementById('end-date') as HTMLInputElement;
const analyzeBtn = document.getElementById('analyze') as HTMLButtonElement;
const analysisPre = document.getElementById('analysis') as HTMLElement;

browseDirBtn.addEventListener('click', async () => {
  const dir = await window.api.selectDirectory();
  if (dir) {
    dataDirInput.value = dir;
  }
});

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

async function refreshHistory() {
  const dates = await window.api.listEntries();
  historySelect.innerHTML = '';
  for (const d of dates) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    historySelect.appendChild(opt);
  }
}

async function loadSettings() {
  const settings = await window.api.loadSettings();
  if (settings) {
    apiKeyInput.value = settings.openaiApiKey || '';
    dataDirInput.value = settings.dataDirectory || '';
  }
}

saveBtn.addEventListener('click', async () => {
  try {
    const content = textarea.value;
    await window.api.saveEntry(getToday(), content);
    alert('保存しました');
    await refreshHistory();
  } catch (e: any) {
    alert(`保存エラー: ${e.message}`);
  }
});

saveSettingsBtn.addEventListener('click', async () => {
  try {
    await window.api.saveSettings({
      openaiApiKey: apiKeyInput.value,
      dataDirectory: dataDirInput.value,
    });
    alert('設定を保存しました');
  } catch (e: any) {
    alert(`設定保存エラー: ${e.message}`);
  }
});

loadHistoryBtn.addEventListener('click', async () => {
  try {
    const date = historySelect.value;
    const content = await window.api.loadEntry(date);
    if (content !== null) textarea.value = content;
  } catch (e: any) {
    alert(`読み込みエラー: ${e.message}`);
  }
});

weekBtn.addEventListener('click', () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);
  startDateInput.value = start.toISOString().slice(0, 10);
  endDateInput.value = end.toISOString().slice(0, 10);
});

monthBtn.addEventListener('click', () => {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), 1);
  startDateInput.value = start.toISOString().slice(0, 10);
  endDateInput.value = end.toISOString().slice(0, 10);
});

yearBtn.addEventListener('click', () => {
  const end = new Date();
  const start = new Date(end.getFullYear(), 0, 1);
  startDateInput.value = start.toISOString().slice(0, 10);
  endDateInput.value = end.toISOString().slice(0, 10);
});

analyzeBtn.addEventListener('click', async () => {
  try {
    const start = startDateInput.value;
    const end = endDateInput.value || start;
    const entries = await window.api.getRangeEntries(start, end);
    const result = await window.api.analyze(entries, apiKeyInput.value);
    analysisPre.textContent = JSON.stringify(result, null, 2);
  } catch (e: any) {
    analysisPre.textContent = '';
    alert(`分析エラー: ${e.message}`);
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await refreshHistory();
});
