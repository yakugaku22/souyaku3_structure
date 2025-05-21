let quizData;
let allData; // 元のデータを保存
let currentIndex = 0;
let currentMode = 'name';
let score = 0;
let answered = false;
let wrongAnswers = [];
let isReviewMode = false;

function startQuiz(mode) {
  currentMode = mode;
  score = 0;
  currentIndex = 0;
  answered = false;
  isReviewMode = false;
  wrongAnswers = [];
  document.getElementById('mode-select').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('feedback').textContent = "";

  fetch('quiz.json')
    .then(res => res.json())
    .then(data => {
      allData = data;
      quizData = [...allData];
      shuffleArray(quizData);
      showQuestion();
    });
}

function showQuestion() {
  const quiz = quizData[currentIndex];
  document.getElementById('structure-img').src = quiz.image;
  document.getElementById('question').textContent =
    currentMode === 'name' ? 'この構造式の薬の名前は？' : 'この薬の作用機序は？';

  const correctAnswer = currentMode === 'name' ? quiz.name : quiz.mechanism;
  const allAnswers = allData.map(q => currentMode === 'name' ? q.name : q.mechanism);
  const options = generateOptions(correctAnswer, allAnswers);

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  document.getElementById('feedback').textContent = '';
  answered = false;

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.style.fontSize = "0.95rem";
    btn.onclick = () => {
      if (answered) return;
      answered = true;

      if (option === correctAnswer) {
        document.getElementById('feedback').textContent = "正解！";
        score++;
      } else {
        document.getElementById('feedback').textContent = `不正解... 正解は：${correctAnswer}`;
        wrongAnswers.push(quiz);
      }

      Array.from(optionsDiv.children).forEach(b => b.disabled = true);
    };
    optionsDiv.appendChild(btn);
  });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function endQuiz() {
  showResult();
}

function showResult() {
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('restart-btn').classList.remove('hidden');
  document.getElementById('review-btn').classList.toggle('hidden', wrongAnswers.length === 0);
  document.getElementById('result').textContent = `${quizData.length}問中${score}問正解でした。テスト頑張ろうね☺`;
}

function startReview() {
  if (wrongAnswers.length === 0) return;
  quizData = [...wrongAnswers];
  currentIndex = 0;
  score = 0;
  answered = false;
  isReviewMode = true;
  wrongAnswers = []; // 新しい間違いだけ記録（上書きではなく積み増ししたいならここを消す）
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('feedback').textContent = '';
  showQuestion();
}

function goToStart() {
  // すべて初期状態に戻す
  quizData = [...allData];
  currentIndex = 0;
  score = 0;
  answered = false;
  wrongAnswers = [];
  isReviewMode = false;
  document.getElementById('mode-select').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('feedback').textContent = '';
}

function generateOptions(correct, all) {
  const options = [correct];
  while (options.length < 5) {
    const rand = all[Math.floor(Math.random() * all.length)];
    if (!options.includes(rand)) options.push(rand);
  }
  return shuffleArray(options);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
