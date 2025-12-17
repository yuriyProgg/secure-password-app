export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Текст успешно скопирован в буфер обмена');
  } catch (err) {
    console.error('Не удалось скопировать текст: ', err);
    // Фоллбек для старых браузеров
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('Текст скопирован через execCommand');
    } catch (fallbackErr) {
      console.error('Не удалось скопировать текст через фоллбек: ', fallbackErr);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
