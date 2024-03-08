// Typed.js initialization
var typed = new Typed("#element", {
  strings: [
    "Let the quest for knowledge begin!",
    "Start your adventure now and see how far you can go.",
  ],
  smartBackspace: true,
  typeSpeed: 30,
});
let st_quiz = document.querySelector("#st_quiz");
let quiz_body = document.querySelector(".quiz_body");
let choice_id;
let question_arr = [];

// Fetch data from JSON and store into categories and questions
let data, categories, questions;
let all_users = [];

async function fetchData() {
  try {
    const response = await fetch("db.json");
    data = await response.json();

    categories = data.categories;
    questions = data.questions;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

fetchData();

// DOM Elements
let entry = document.querySelector(".body");
let options = document.querySelector(".select");
let quiz = document.querySelector(".quiz");
let ledboard = document.querySelector(".score");
let enter_btn = document.querySelector("#start");

// Default user score and name
let user_score = [
  { category_id: 1, score: 0 },
  { category_id: 2, score: 0 },
  { category_id: 3, score: 0 },
  { category_id: 4, score: 0 },
  { category_id: 5, score: 0 },
  { category_id: 6, score: 0 },
  { category_id: 7, score: 0 },
  { category_id: 8, score: 0 },
];
let name_user = "";

// Event listener for start button
enter_btn.addEventListener("click", () => {
  
  ledboard.style.display = "none";
  let name = document.querySelector(".inp_name");
  if (name.value === "") {
    alert("Please Enter Name...");
  } 
  else {
    console.log(name.value);
    options.style.display = "flex";
    entry.style.display = "none";
    quiz.style.display = "none";
    ledboard.style.display = "none";
    name_user = name.value;
    const typed = new Typed(".welcome", {
      strings: ["Welcome, " + name.value],
      typeSpeed: 50,
    });
  }

  // Store user data in localStorage
  all_users = JSON.parse(localStorage.getItem("users")) || [];
  if (name_user !== "" && !all_users.some(user => user.name_user === name_user)) {
    all_users.push({ name_user, user_score });
    localStorage.setItem("users", JSON.stringify(all_users));
  }
});

let s_b=document.querySelector(".l_b")
s_b.addEventListener("click",()=>{
  options.style.display = "none";
  entry.style.display = "none";
  quiz.style.display = "none";
  ledboard.style.display = "flex";
})
// Event listener to start quiz

st_quiz.addEventListener("click", () => {
  let choice = document.querySelector(".options");

  options.style.display = "none";
  entry.style.display = "none";
  quiz.style.display = "flex";
  ledboard.style.display = "none";
  
  let display = document.querySelector(".type");
  display.innerHTML = choice.value + " Quiz";

  choice_id = categories.find(element => element.name === choice.value)?.id;

  question_arr = questions.filter(element => element.category_id === choice_id);

  let q_no = 0;

  let newList = question_arr.map((value) => {
    q_no++;
    return `
      <article class="question_block" id="${value.id}">
        <p class="question">${q_no}. ${value.question}</p>
        <article class="mcq">           
          <div class="choose">
            <input type="radio" name="opt_${value.id}" id="opt_${value.id}_a" value="a" class="opt" />
            <label for="opt_${value.id}_a">a: ${value.options.a}</label>
          </div>
          <div class="choose">
            <input type="radio" name="opt_${value.id}" id="opt_${value.id}_b" value="b" class="opt"/>
            <label for="opt_${value.id}_b">b: ${value.options.b}</label>
          </div>
          <div class="choose">
            <input type="radio" name="opt_${value.id}" id="opt_${value.id}_c" value="c" class="opt" />
            <label for="opt_${value.id}_c">c: ${value.options.c}</label>
          </div>
          <div class="choose">
            <input type="radio" name="opt_${value.id}" id="opt_${value.id}_d" value="d" class="opt"/>
            <label for="opt_${value.id}_d">d: ${value.options.d}</label>
          </div>
        </article>
      </article>
    `;
  });

  quiz_body.innerHTML = newList.join(" ");
});

// Event listener for submitting quiz
let submit = document.querySelector(".submit");

submit.addEventListener("click", () => {
  options.style.display = "none";
  entry.style.display = "none";
  quiz.style.display = "none";
  ledboard.style.display = "flex";

  let selectedAnswers = [];
  let points = 0;
  let allQuestions = document.querySelectorAll(".question_block");

  allQuestions.forEach((question) => {
    let selectedRadioButton = question.querySelector('input[type="radio"]:checked');

    if (selectedRadioButton) {
      let questionId = selectedRadioButton.name.split("_")[1];
      let selectedAnswer = selectedRadioButton.value;

      selectedAnswers.push({ questionId, selectedAnswer });
    }
  });

  selectedAnswers.forEach((element) => {
    question_arr.forEach((correct) => {
      if (element.questionId == correct.id && element.selectedAnswer == correct.answer) {
        points++;
      }
    });
  });

  let detail = JSON.parse(localStorage.getItem("users"));

  detail.forEach(element => {
    if (element.name_user == name_user) {
      element.user_score.forEach(scores => {
        if (scores.category_id == choice_id) {
          scores.score = points;
        }
      });
    }
  });

  localStorage.setItem("users", JSON.stringify(detail));

  let sortedData = detail.sort((a, b) => {
    let scoreA = a.user_score.find(item => item.category_id === choice_id).score;
    let scoreB = b.user_score.find(item => item.category_id === choice_id).score;
    return scoreB - scoreA;
  });


  let leaderboard = document.querySelector('.list');
  let sr = 0;

  let leader_list = sortedData.map((value) => {
    sr++;
    let userScore = value.user_score.find(score => score.category_id === choice_id)?.score || 0;

    return `
    <div class="block">
      <span class="no">${sr}</span>
      <span class="detail">${value.name_user}</span>
      <span class="marks">${userScore}</span>
    </div>
    `;
  });
  leaderboard.innerHTML = leader_list.join("");
});

let h_lead=document.querySelector(".l_b")

h_lead.addEventListener("click",()=>{
  let detail = JSON.parse(localStorage.getItem("users"));
console.log(detail);

let sortedData = detail.sort((a, b) => {
  let scoreA = a.user_score.find(item => item.category_id === choice_id)?.score || 0;
  let scoreB = b.user_score.find(item => item.category_id === choice_id)?.score || 0;
  return scoreB - scoreA;
});

let leaderboard = document.querySelector('.list');
let sr = 0;

let leader_list = sortedData.map((value) => {
  sr++;
  let userScore = value.user_score.find(score => score.category_id === choice_id)?.score || 0;

  return `
  <div class="block">
    <span class="no">${sr}</span>
    <span class="detail">${value.name_user}</span>
    <span class="marks">${userScore}</span>
  </div>
  `;
});

leaderboard.innerHTML = leader_list.join("");

})
function home(){
  options.style.display = "none";
    entry.style.display = "flex";
    quiz.style.display = "none";
    ledboard.style.display = "none";
}

