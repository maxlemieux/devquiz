$(document).ready(function() {
    // Array of questions to ask in the quiz
    var questionSet = [
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
    var timerElement = $( "#timer-seconds" );
    var highScoresLink = $( "#high-scores-link" );
    var timerInterval = "";
    var secondsLeft = 75;
    var finalScore = 0;

    // Create container to display quiz content
    var quizContainer = $( "<div id='quiz-container' class='text-center'></div>");
    $( "#main" ).append(quizContainer);

    // Show high scores list when link at top of page is clicked
    highScoresLink.on("click", function() {
        // Show the high scores list
        showHighScoresList();
    });

    function displayQuestion(question) {
        quizContainer.empty();
        var questionContainer = $( "<div class='card p-3' id='question-card'></div>" );
        quizContainer.append(questionContainer);
        var questionElement = $( "<p>" + questionSet[question].question + "</p>" );
        $( "#question-card" ).append(questionElement);
        $.each(questionSet[question].answers, function(i, value) {
            var answerElement = $( "<button type='button' class='btn btn-primary my-1 p-3' id=" + i + ">" + value + "</button><br />" );
            $( "#question-card" ).append(answerElement);
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
            timerElement.text(secondsLeft);
        };
        // Go to next question
        showNextQuestion(question);
    };

    // Calculate next question to show, or show score entry page if no more questions
    function showNextQuestion(question) {
        var nextQuestion = parseInt(question) + 1;
        if (nextQuestion < questionSet.length) {
            displayQuestion(nextQuestion);
        } else {
            finalScore = secondsLeft;
            clearInterval(timerInterval);
            showSaveHighScore();
        };
    };

    // Show page that allows you to Save High Score and Initials
    function showSaveHighScore() {
        quizContainer.empty();
        // Set up high score entry and displays
        var scoreLayout = $( "<div class='row'><div class='col text-left' id='score-entry'></div><div class='col' id='high-scores'></div></div>" );
        quizContainer.append(scoreLayout);
        scoreEntry = $( "#score-entry" );

        // Show the score for this quiz
        var showScore = $( "<h3>Score: " + finalScore + "</h3>" );
        scoreEntry.append(showScore);
        // Create form to save initials with high score
        var saveScoreForm = $( "<form class='text-left'></form>" );
        scoreEntry.append(saveScoreForm);
        var initialsInput = $( "<div class='form-group'><label>Enter your initials:&nbsp;</label><input id='initials' type='text'></div>" );
        saveScoreForm.append(initialsInput);
        var submitButton = $( "<button type='submit' id='add-score' class='btn btn-primary'></button>" );
        submitButton.text("Submit");
        saveScoreForm.append(submitButton);

        // Create container for high scores list
        var highScoresList = $("<div><h3>High Scores</h3><ul id='high-scores-list'></ul></div>");
        $( "#high-scores" ).append(highScoresList);
        
        // Draw high scores list on page load
        printHighScores();

        // Add high score to local storage
        submitButton.on("click", function(event) {
            event.preventDefault();
            if (JSON.parse(localStorage.getItem("highScores"))) {
                var highScores = JSON.parse(localStorage.getItem("highScores"));
            } else {
                var highScores = {};
            };
            var thisInitials = $( "#initials" ).val();
            highScores[thisInitials] = finalScore;
            localStorage.setItem("highScores", JSON.stringify(highScores));
            // Redraw high score list
            //showHighScores();
        });
    };

    function printHighScores() {      
        $( "#high-scores-list" ).empty();
        // Get the high scores from local storage and sort by score
        var highScores = JSON.parse(localStorage.getItem("highScores"));
        var sortedScores = Object.entries(highScores).sort(function(a, b) {
            return b[1] - a[1];
        });
        // Print the scores
        for (score of sortedScores) {
            //console.log(score);
            scoreElement = $( "<li>" + score[0] + ": " + score[1] + "</li>" );
            $( "#high-scores-list" ).append(scoreElement);
        };
    };

    // Show just high scores list (no initials entry)
    function showHighScoresList() {
        quizContainer.empty();
        var highScoresList = $("<div class='card p-3'><h3>High Scores</h3><ul id='high-scores-list'></ul></div>");
        quizContainer.append(highScoresList);
        // Populate the high scores container
        printHighScores();
        // Add a button to return to the introduction screen
        var introButton = $( "<button id='intro-button' class='btn btn-primary m-3'><h3><span class='fa fa-question'>Back</span></h3></button>" );
        quizContainer.append(introButton);
        introButton.on("click", function() {
            // Show the intro
            showIntro();
        });
    };

    // Show the intro
    function showIntro() {
        quizContainer.empty();
        // Intro text
        var introText = $( "<div id='intro-text'></div>");
        introText.text("This is a quiz which will test your knowledge of Javascript. When you are ready to begin, click the Start button. You will have 75 seconds to complete the quiz. Wrong answers will deduct 20 seconds from the timer.");
        quizContainer.append(introText);
        // Start button
        var startButton = $( "<button id='start-button' class='btn btn-primary btn-lg'><h1><span class='fa fa-question'>Start</span></h1></button>" );
        quizContainer.append(startButton);
        startButton.on("click", function() {
            // Run the quiz!
            startQuiz();
        });
    };

    // Run the quiz!
    function startQuiz() {
        // Empty out the quiz container to prepare to show questions
        quizContainer.empty();
        // Display the first question
        displayQuestion(0);
        // Start the timer
        setTime();
    };

    // Prepare and start the timer
    function setTime() {
        // Initialize timer countdown to 75 seconds and show it on the page
        secondsLeft = 75;
        timerElement.text(secondsLeft);
        // Start the timer
        timerInterval = setInterval(quizTimer, 1000);
    };

    // Operate the timer during the quiz
    function quizTimer() {
        // Subtract 1 from seconds remaining
        secondsLeft--;
        // Update display with new time remaining
        timerElement.text(secondsLeft);
        // Check if the timer has run out
        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            timerElement.text = "0";
        };
    };

    // Call showIntro for the first time
    showIntro();
});