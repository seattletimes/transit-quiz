// require("./lib/social");
// require("./lib/ads");
var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var ich = require("icanhaz");

var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

//create new question from template
var showQuestion = function(questionId) {
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

// show submit button when answer is selected
var watchInput = function() {
  $(".quiz-box").on("change", "input", function() {
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  });
};

$(".quiz-container").on("click", ".submit", function() {
  track("interactive", "quiz", "submit-answer-" + id);

  // score answer
  var answerData = {};
  answerData.question = quizData[id].question;
  var correct = $("input:checked").val();
  if (correct) { 
    score += 1;
    answerData.hooray = true;
  }

  // keep track of selected answer
  quizData[id].answers.forEach(function(a) {
    if (a.correct) {
      answerData.correct = a.answer;
      answerData.image = quizData[id].image;
      answerData.description = quizData[id].description;
      answerData.caption = quizData[id].caption;
    }
  });

  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("Finish");
  }
  watchNext();
});

$(".quiz-container").on("click", ".retake", function() {
  id = 1;
  score = 0;
  showQuestion(id);
});


var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
      // display result
      result.score = score;
      if (result.score > 5) { 
        result.color = "#589040";
      } else if (result.score > 2) { 
        result.color = "#F5AE3F";
      } else {
        result.color = "#e12329";
      }
      result.total = Object.keys(quizData).length;

      $(".question-box").html(ich.overviewTemplate(result));
    }
  }
};

showQuestion(id);
watchInput();