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
            question: "What is the latest released standard for the JavaScript language?",
            answers: ["ES5", "EcmaScript", "JavaScript", "ES6", "ActionScript"],
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

    // Display a question and possible answers on page
    function displayQuestion(question) {
        quizContainer.empty();
        var questionContainer = $( "<div class='card p-3' id='question-card'></div>" );
        quizContainer.append(questionContainer);
        var questionElement = $( "<h3>" + questionSet[question].question + "</h3>" );
        $( "#question-card" ).append(questionElement);
        // Loop through the answers for the question and print them as buttons
        $.each(questionSet[question].answers, function(i, value) {
            var answerElement = $( "<button type='button' class='btn btn-primary my-1 p-3' id=" + i + ">" + value + "</button><br />" );
            $( "#question-card" ).append(answerElement);
            // When the answer button is clicked, check to see if it's correct
            $("#" + i).on("click", function(event) {
                checkCorrect(event, question);
            });
        });
    };

    // Check if the answer given was the correct one, and handle consequences
    function checkCorrect(event, question) {
        if (event.target.id == questionSet[question].correct) {
            var alertCorrect = $( "<div class='alert alert-success m-3'>Correct!</div>" );
            $( "#main" ).append(alertCorrect);
        } else { // incorrect
            var alertIncorrect = $( "<div class='alert alert-danger m-3'>Incorrect!</div>" );
            $( "#main" ).append(alertIncorrect);
            // Timer penalty
            secondsLeft = secondsLeft - 20;
            timerElement.text(secondsLeft);
        };
        // Fade out the correctness alert
        window.setTimeout(function() {
            $(".alert").fadeTo(500, 0).slideUp(500, function(){
                $(this).remove(); 
            });
        }, 1000);
        // Go to next question
        showNextQuestion(question);
    };

    // Calculate next question to show, or show score entry page if no more questions
    function showNextQuestion(question) {
        // Check in case we're out of time
        if (secondsLeft < 1) {
            outOfTime();
        } else {
            var nextQuestion = parseInt(question) + 1;
            // Does the next question exist? Set final score and show high score entry if not
            if (nextQuestion < questionSet.length) {
                displayQuestion(nextQuestion);
            } else {
                finalScore = secondsLeft;
                clearInterval(timerInterval);
                showSaveHighScore();
            };
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
            showHighScoresList();
        });
    };

    function printHighScores() {  
        highScoresList = $( "#high-scores-list" );    
        highScoresList.empty();        
        // Get the high scores from local storage and sort by score
        if (localStorage.getItem("highScores")) {
            var highScores = JSON.parse(localStorage.getItem("highScores"));
            var sortedScores = Object.entries(highScores).sort(function(a, b) {
                return b[1] - a[1];
            });
            
            // Print the scores
            for (score of sortedScores) {
                var scoreElement = $( "<li>" + score[0] + ": " + score[1] + "</li>" );
                highScoresList.append(scoreElement);
            };
        } else {
            var scoreElement = $( "<li>No high scores yet. You could be the first!</li>" );
            highScoresList.append(scoreElement);
        }
    };

    // Show just high scores list (no initials entry)
    function showHighScoresList() {
        quizContainer.empty();
        clearInterval(timerInterval);
        timerElement.text("0");
        var highScoresList = $("<div class='card p-3'><h3>High Scores</h3><ul id='high-scores-list'></ul></div>");
        quizContainer.append(highScoresList);
        // Populate the high scores container
        printHighScores();
        // Show button to return to intro
        showIntroButton();    
    };

    function showIntroButton() {
        // Add a button to return to the introduction screen
        var introButton = $( "<button id='intro-button' class='btn btn-primary m-3'><h3><span class='fa fa-question'>Back</span></h3></button>" );
        quizContainer.append(introButton);
        introButton.on("click", function() {
            showIntro();
        });
    };

    // Show the intro
    function showIntro() {
        quizContainer.empty();
        // Intro text
        var introText = $( "<div id='intro-text' class='text-left card p-3'></div>");
        introText.html("<p>This is a quiz which will test your knowledge of JavaScript.</p><p>When you are ready to begin, click the Start button.</p><p>You will have 75 seconds to complete the quiz. Wrong answers will deduct 20 seconds from the timer.</p>");
        quizContainer.append(introText);
        // Start button
        var startButton = $( "<button id='start-button' class='btn btn-primary btn-lg m-3'><h1><span class='fa fa-question'>Start</span></h1></button>" );
        quizContainer.append(startButton);
        startButton.on("click", function() {
            startQuiz();
        });
    };

    // Run the quiz!
    function startQuiz() {
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
        if (secondsLeft < 1) {
            outOfTime();
        };
    };

    // Show out of time screen if the timer runs out or a question is answered incorrectly with less than 20 seconds remaining
    function outOfTime() {
        clearInterval(timerInterval);
        timerElement.text("0");
        quizContainer.empty();
        var outOfTimeMsg = $( "<p class='card p-3 m-3'>You ran out of time. Try again?</p>" );
        quizContainer.append(outOfTimeMsg);
        showIntroButton();
    };

    // Call showIntro for the first time
    showIntro();
});