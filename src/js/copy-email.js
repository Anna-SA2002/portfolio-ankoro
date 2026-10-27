const emailButton = document.querySelector("#copy-email");
const status = document.querySelector("#copy-email-status");
let resetTimer;

emailButton?.addEventListener("click", async () => {
  clearTimeout(resetTimer);
  status.textContent = "";
  try {
    await navigator.clipboard.writeText(emailButton.textContent.trim());
    status.textContent = "Copied!";
    resetTimer = setTimeout(() => { status.textContent = ""; }, 3000);
  } catch {
    status.textContent = "コピーできませんでした。メールアドレスを選択してコピーしてください。";
  }
});
