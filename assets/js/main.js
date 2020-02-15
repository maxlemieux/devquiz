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
    {
        question: "What is the strict equality operator in Javascript?",
        answers: ["+=", "==", "!==", "==="],
        correct: 3,
    },
    {
        question: "What is the latest released standard for the Javascript language?",
        answers: ["ES5", "EcmaScript", "Javascript", "ES6", "ActionScript"],
        correct: 3,
    },
];

$(document).ready(function() {
    var timerElement = $( "#timer-seconds" );
    var timerInterval = "";
    var secondsLeft = 75;
    var finalScore = 0;

    // Create container to display quiz content
    var quizContainer = $( "<div id='quiz-container' class='text-center'></div>");
    $( "#main" ).append(quizContainer);

    function displayQuestion(question) {
        $( "#quiz-container" ).empty();
        var questionElement = $( "<p>" + questionSet[question].question + "</p>" );
        $( "#quiz-container" ).append(questionElement);
        $.each(questionSet[question].answers, function(i, value) {
            var answerElement = $( "<button type='button' class='btn btn-primary my-1' id=" + i + ">" + value + "</button><br />" );
            $( "#quiz-container" ).append(answerElement);
            
            // When the answer button is clicked, check if it's correct
            $("#" + i).on("click", function(event) {
                checkCorrect(event, question);
            });
    
        });
    };

    // Check if the answer given was the correct one
    function checkCorrect(event, question) {
        if (event.target.id == questionSet[question].correct) {
            console.log("correct");
        } else {
            console.log("incorrect");
            // Timer penalty
            secondsLeft = secondsLeft - 20;
        };
        // Go to next question
        showNextQuestion(question);
    }

    // Go to next question
    function showNextQuestion(question) {
        nextQuestion = parseInt(question) + 1;
        if (nextQuestion < questionSet.length) {
            displayQuestion(nextQuestion);
        } else {
            finalScore = secondsLeft;
            clearInterval(timerInterval);
            showSaveHighScore();
        };
    }

    // Show page that allows you to Save High Score and Initials
    function showSaveHighScore() {
        $( "#quiz-container" ).empty();
        var showScore = $( "<p>Score: " + finalScore + "</p>" );
        $( "#quiz-container" ).append(showScore);
    };

    // Show the intro
    function showIntro() {
        // Intro text with start button
        var introText = $( "<div id='intro-text'></div>");
        introText.text("This is a quiz which will test your knowledge of Javascript. When you are ready to begin, click the Start button. You will have 75 seconds to complete the quiz. Wrong answers will deduct 20 seconds from the timer.");
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
        // Empty out the quiz container to prepare to show questions
        $( "#quiz-container" ).empty();

        // Display the first question
        displayQuestion(0);
        
        // Start the timer
        setTime();
    };

    // Call showIntro for the first time
    showIntro();

    // Operate the timer during the quiz
    function setTime() {
        secondsLeft = 75;
        timerElement.text(secondsLeft);
        console.log("Starting timer - current seconds left is " + secondsLeft);
        timerInterval = setInterval(quizTimer, 1000);
        console.log(timerInterval);
    };

    function quizTimer() {
        secondsLeft--;
        console.log("does this fire? current seconds left: " + secondsLeft);
        timerElement.text(secondsLeft);
        console.log(timerElement);

        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            sendMessage();
        };
    };

    function sendMessage() {
        timerElement.text = "0";
    };


});