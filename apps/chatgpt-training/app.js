// Formation ChatGPT pour C2R OS
let currentPage = 1;

function showPage(page) {
    const pages = document.querySelectorAll('.training-page');
    if (page < 1 || page > pages.length) return;
    pages.forEach(p => p.classList.remove('active'));
    pages[page - 1].classList.add('active');
    currentPage = page;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === pages.length;
}

function changePage(delta) {
    showPage(currentPage + delta);
}

function initChatGPTTraining() {
    console.log('🚀 Formation ChatGPT initialisée');
    showPage(1);
}

function submitQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    let score = 0;
    if (q1 && q1.value === 'b') score++;
    if (q2 && q2.value === 'b') score++;
    if (q3 && q3.value === 'b') score++;
    const result = document.getElementById('quiz-result');
    if (result) {
        result.textContent = `Score : ${score}/3`;
    }
}

window.initChatGPTTraining = initChatGPTTraining;
window.submitQuiz = submitQuiz;
window.changePage = changePage;
