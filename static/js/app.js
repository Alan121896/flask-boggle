$(document).ready(function() {
    $('form').on('submit', function(event) {
      event.preventDefault(); // Prevent form submission from refreshing the page
  
      let guess = $('input[name="guess"]').val(); // Get the guess from the input field
  
      // Make an AJAX POST request to check the word validity
      axios
        .post('/check-word', { guess: guess })
        .then(function(response) {
          displayResult(response.data.result); // Call the function to display the result
        })
        .catch(function(error) {
          console.error(error);
        });
    });
  
    function displayResult(result, score) {
      // Display the result message based on the response from the server
      if (result === 'ok') {
        $('#result-message').text('Valid word on the board!');
      } else if (result === 'not-on-board') {
        $('#result-message').text('Word is not on the board!');
      } else if (result === 'not-word') {
        $('#result-message').text('Not a valid word!');
      }

      $('#score').text(score)
    }
  
    // Function to update game statistics
    function updateGameStats(score) {
      // Make an AJAX POST request to update game statistics
      axios
        .post('/game-stats', { score: score })
        .then(function(response) {
          let brokeRecord = response.data.brokeRecord;
          let played = response.data.played;
          let highscore = response.data.highscore;
  
          // Update the displayed statistics
          $('#played-count').text(played);
          $('#highscore').text(highscore);
  
          // Display a message if a new highest score is achieved
          if (brokeRecord) {
            $('#record-message').text('Congratulations! New high score!');
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  
    // Handle game end event
    function endGame(score) {
      // Disable the form input
      $('input[name="guess"]').prop('disabled', true);
      $('#guess-button').prop('disabled', true);
  
      // Update game statistics
      updateGameStats(score);
    }
  
    // Timer implementation
    let timer = $('#timer');
    let duration = 60; // Total duration in seconds
    let interval;
  
    function startTimer() {
      var secondsRemaining = duration;
  
      interval = setInterval(function() {
        secondsRemaining--;
        timer.text(secondsRemaining);
  
        if (secondsRemaining <= 0) {
          clearInterval(interval);
          endGame(/* pass the final score */);
        }
      }, 1000);
    }
  
    // Start the timer when the page loads
    startTimer();
  });
  