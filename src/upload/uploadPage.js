const PAGE_STYLE = `
  body { font-family: sans-serif; background: #2B2B2B; color: #FFFFFF; margin: 0; padding: 16px; }
  h1 { font-size: 24px; }
  label { display: block; margin-top: 16px; font-weight: bold; }
  textarea, input { width: 100%; box-sizing: border-box; font-size: 16px; padding: 8px; border-radius: 6px; border: none; }
  textarea { height: 45vh; }
  button { margin-top: 16px; width: 100%; font-size: 20px; padding: 14px; border-radius: 8px; border: none; background: #FFFFFF; color: #111111; }
  #statusMessage { margin-top: 16px; font-size: 18px; min-height: 24px; }
  .hint { opacity: 0.7; font-size: 14px; }
`;

const PAGE_SCRIPT = `
  const pinInput = document.getElementById('pinInput');
  const questionsInput = document.getElementById('questionsInput');
  const fileInput = document.getElementById('fileInput');
  const statusMessage = document.getElementById('statusMessage');
  const sendButton = document.getElementById('sendButton');
  const pinFromLink = new URLSearchParams(location.hash.slice(1)).get('pin');
  if (pinFromLink) { pinInput.value = pinFromLink; }
  function showStatus(message) { statusMessage.textContent = message; }
  fileInput.addEventListener('change', () => {
    const chosenFile = fileInput.files[0];
    if (!chosenFile) { return; }
    const reader = new FileReader();
    reader.onload = () => { questionsInput.value = String(reader.result); };
    reader.readAsText(chosenFile);
  });
  sendButton.addEventListener('click', async () => {
    let parsedQuestions;
    try { parsedQuestions = JSON.parse(questionsInput.value); }
    catch { showStatus('That is not valid JSON'); return; }
    sendButton.disabled = true;
    showStatus('Sending...');
    try {
      const reply = await fetch('/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.value.trim(), questions: parsedQuestions }),
      });
      showStatus(await reply.text());
    } catch {
      showStatus('Could not reach the TV');
    } finally {
      sendButton.disabled = false;
    }
  });
`;

export function buildUploadPageHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>100 Questions upload</title>
<style>${PAGE_STYLE}</style>
</head>
<body>
<h1>100 Questions</h1>
<p class="hint">Paste a JSON list like ["Question one", "Question two"]. This replaces the questions on the TV.</p>
<label for="pinInput">PIN</label>
<input id="pinInput" inputmode="numeric" maxlength="4" autocomplete="off">
<label for="fileInput">JSON file</label>
<input id="fileInput" type="file" accept=".json,application/json">
<label for="questionsInput">Questions</label>
<textarea id="questionsInput" spellcheck="false"></textarea>
<button id="sendButton" type="button">Send to TV</button>
<div id="statusMessage" role="status"></div>
<script>${PAGE_SCRIPT}</script>
</body>
</html>`;
}
