// Array of questions to ask in the quiz
questionSet = [
    {
        question: "Why is up?",
        answers: ["Just because", "I don't know"],
        correct: 0
    },
    {
        question: "What is your favorite color?",
        answers: ["Red", "Blue", "Yellow"],
        correct: 1,
    },
];

$(document).ready(function() {
    var timerLabel = $( "<span id='timer-label'>Time:&nbsp;</span>" );
    var timerSeconds = $( "<span id='timer-seconds'>0</span>" );
    $( "#timer-container" ).append(timerLabel);
    $( "#timer-container" ).append(timerSeconds);
    //$( "#timer-container" ).hide();

    var quizContainer = $( "<div id='quiz-container' class='text-center'></div>");
    $( "#main" ).append(quizContainer);

    function displayQuestion(question) {
        $( "#quiz-container" ).empty();
        var questionElement = $( "<p>" + questionSet[question].question + "</p>" );
        $( "#quiz-container" ).append(questionElement);
        $.each(questionSet[question].answers, function(i, value) {
            var answerElement = $( "<button id=" + i + ">" + value + "</button><br />" );
            $( "#quiz-container" ).append(answerElement);
            //console.log(answerElement);

            // When the answer button is clicked, check if it's correct
            $("#" + i).on("click", function(event) {
                checkCorrect(event, question);
            });
    
        });
    };

    // Check if the answer given was the correct one
    function checkCorrect(event, question) {
        //console.log(event.target.id);
        //console.log(questionSet[question].correct);
        if (event.target.id == questionSet[question].correct) {
            console.log("correct");
            console.log(questionSet.length);
            console.log(question);
            nextQuestion = parseInt(question) + 1;
            if (nextQuestion < questionSet.length) {
                displayQuestion(nextQuestion);
            } else {
                showSaveHighScore();
            };
        } else {
            console.log("incorrect");
        };
    }

    // Show page that allows you to Save High Score and Initials
    function showSaveHighScore() {
        $( "#quiz-container" ).empty();
        var showScore = $( "<p>Score: </p>" );
        $( "#quiz-container" ).append(showScore);
    };

    // Show the intro
    function showIntro() {
        // Intro text with start button
        var introText = $( "<div id='intro-text'></div>");
        introText.text("lkajsdf;lkjas;dlfkjds;lakfjsdlkjf;");
        var startButton = $( "<button id='start-button' class='btn btn-primary btn-lg'><h1><span class='fa fa-question'>Start</span></h1></button>" );

        $( "#quiz-container" ).append(introText);
        $( "#quiz-container" ).append(startButton);

        $("#start-button").on("click", function() {
            // Start the quiz
            startQuiz();
        });
    };

    // Run the quiz!
    function startQuiz() {
        console.log("Starting quiz");
        // Empty out the quiz container to prepare to show questions
        $( "#quiz-container" ).empty();
        displayQuestion(0);
    };

    // Call showIntro for the first time
    showIntro();

/*
    var timerElement = $( "#timer" );
    var mainEl = $( "#main" );
    
    var secondsLeft = 10;

    function setTime() {
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timerElement.textContent = secondsLeft + " seconds left till colorsplosion.";

        if(secondsLeft === 0) {
        clearInterval(timerInterval);
        sendMessage();
        }

    }, 2000);
    }

    function sendMessage() {
        timerElement.textContent = " ";

    var imgEl = document.createElement("img");

    imgEl.setAttribute("src", "images/image_1.jpg");
    mainEl.appendChild(imgEl);

    }

    setTime();
*/
});
