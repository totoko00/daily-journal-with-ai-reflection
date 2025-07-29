const textarea = document.getElementById('entry') as HTMLTextAreaElement;
const saveBtn = document.getElementById('save') as HTMLButtonElement;

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

saveBtn.addEventListener('click', async () => {
  const content = textarea.value;
  await window.api.saveEntry(getToday(), content);
  alert('保存しました');
});
