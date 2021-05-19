 const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// const amount = document.getElementById('trivia_amount');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

var myurl = window.location.href;

var mysplitUrl = myurl.split('?')

// console.log(myurl);

//console.log(mysplitUrl[1].split('&'))

//  "trivia_amount=25&trivia_category=18&trivia_difficulty=easy"


var myselection = mysplitUrl[1].split('&');

 var amount = myselection[0];
 var category = myselection[1];
 var difficulty = myselection[2];

// console.log(amount);
// console.log(category);
// console.log(difficulty);

// https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple

var fetchUrl;

if(category.includes('any')) {

    if(difficulty.includes('any')){

         fetchUrl = 'https://opentdb.com/api.php?'+amount+'&type=multiple';
          // console.log('myfetch URL 1: ' +fetchUrl);
    }else{

        fetchUrl = 'https://opentdb.com/api.php?'+amount+'&'+difficulty+'&type=multiple';

          // console.log('myfetch URL 2: ' +fetchUrl);
    }

}else {

    if(difficulty.includes('any')){

        fetchUrl = 'https://opentdb.com/api.php?'+amount+'&'+category+'&type=multiple';
        // console.log('myfetch URL 3: ' +fetchUrl);
   }else{

    fetchUrl = 'https://opentdb.com/api.php?'+amount+'&'+category+'&'+difficulty+'&type=multiple';

    // console.log('myfetch URL 4: ' +fetchUrl);
   }

}

// console.log('myfetch URL: ' +fetchUrl);
// https://opentdb.com/api.php?amount=50&category=18&difficulty=medium&type=multiple

fetch(
    fetchUrl
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS

var question_count = amount.split('=');
// console.log(question_count[1]);

const CORRECT_BONUS = 10;
//const MAX_QUESTIONS = 50;

const MAX_QUESTIONS = question_count[1];

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];

    question.innerHTML = currentQuestion.question;

    // console.log('currentQuestion.question: '+currentQuestion.question);


    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];

        // console.log('choice.innerHTML: '+choice.innerHTML)
    });

    // for(x in currentQuestion){
    //
    //   console.log('current question values: '+x);
    // }

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        var classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        // console.log('selectedChoice: '+selectedChoice);

         correct_answer = currentQuestion['choice' + currentQuestion.answer];


        /* code for correct answer show */
        // if (classToApply === 'incorrect') {
        //
        //   console.log('classes to apply incorrect: '+classToApply);
        //
        //       classToApply = 'correct';
        //
        //       choices[currentQuestion.answer].parentElement.classList.add('correct');
        //
        //       console.log('Correct Answer classes: '+ choices[currentQuestion.answer].parentElement.classList);
        //
        //       console.log('parentElement: '+choices[currentQuestion.answer].parentElement.innerHTML);
        //
        //       const mycnodes = choices[currentQuestion.answer].parentElement.childNodes[3].innerHTML;
        //
        //       console.log(mycnodes);
        //
        //       choices[currentQuestion.answer].parentElement.childNodes[3].innerHTML = 'Correct Answer';
        //
        //       // console.log('Child Nodes: '+choices[currentQuestion.answer].parentElement.childNodes[2].innerHTML);
        //
        //   //    console.log('Child Node: '+choices[currentQuestion.answer].parentElement.childNodes[2].innerHTML);
        //
        //
        //       // console.log('child Element: '+choices[currentQuestion.answer].parentElement.childNode.childNode.innerHTML);
        //
        //       // console.log(choices[currentQuestion.answer].parentElement.childNodes[1].childNode.innerHTML);
        //
        //       // console.log(choices[currentQuestion.answer].parentElement.childNodes[1]);
        //
        //       choices[currentQuestion.answer].parentElement.classList.remove(classToApply);
        //
        //       // correct_answer = currentQuestion['choice' + currentQuestion.answer];
        //       // console.log('correct answer: '+ correct_answer);
        //
        //       // console.log('currentQuestion.answer:' +currentQuestion.answer);
        //       // console.log('selected answer: '+selectedAnswer);
        // }


        setTimeout(() => {

            selectedChoice.parentElement.classList.remove(classToApply);

            if(classToApply==='incorrect'){
              alert('correct answer: '+ correct_answer);
            }

            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
