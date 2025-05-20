let quizData;
let currentIndex = 0;
let currentMode = 'name';
let score = 0;

function startQuiz(mode) {
  currentMode = mode;
  score = 0;
  currentIndex = 0;
  document.getElementById('mode-select').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('feedback').textContent = "";
  fetch('quiz.json')
    .then(res => res.json())
    .then(data => {
      quizData = data;
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
  const allAnswers = quizData.map(q => currentMode === 'name' ? q.name : q.mechanism);
  const options = generateOptions(correctAnswer, allAnswers);

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  document.getElementById('feedback').textContent = '';

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.style.fontSize = "0.95rem";
    btn.onclick = () => {
      if (option === correctAnswer) {
        document.getElementById('feedback').textContent = "正解！";
        score++;
      } else {
        document.getElementById('feedback').textContent = `不正解... 正解は：${correctAnswer}`;
      }
      setTimeout(nextQuestion, 1000);
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
  document.getElementById('result').textContent = `お疲れ様でした！${quizData.length}問中${score}問正解でした。`;
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
