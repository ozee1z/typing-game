// Our quotes
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

// Store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;

// The starting time and timer status
let startTime;
let timerStarted = false; // Tracks if the timer has started

//Speed in wpm
let speed;

// Page elements
const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const startButton = document.getElementById("start");
const modalElement = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const highScoreTable = document.getElementById("highScoresTable");
const clearHighScore = document.getElementById("clearScore");

//Fucntion to start the typing game

startButton.addEventListener("click", () => {
    // Reset the word index for tracking
    wordIndex = 0;

    // Reset timerStarted
    timerStarted = false;

    // Get a quote
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];

    // Put the quote into an array of words
    words = quote.split(" ");
  
    // UI updates
    // Create an array of span elements so we can set a class
    const spanWords = words.map(function(word) { return `<span>${word}</span>`});

    // Convert into string and set as innerHTML on quote display
    quoteElement.innerHTML = spanWords.join(" ");

    // Highlight the first word
    quoteElement.children[wordIndex].className = "highlight";

    // Clear any prior messages
    messageElement.innerText = "";
  
    // Setup the textbox
    typedValueElement.disabled = false;
    // Clear the textbox
    typedValueElement.value = "";

    // set focus
    typedValueElement.focus();

    // Hide high score table
    highScoreTable.style.display = "none";
  });

// Function when the player starts typing

typedValueElement.addEventListener("input", () => {
    // Get the current word
    const currentWord = words[wordIndex];

    // Get the current value
    const typedValue = typedValueElement.value;

    // Start the timer if it hasn't started yet
    if (!timerStarted) {
      startTime = new Date().getTime(); // Time at which you first started typing
      timerStarted = true; // Set timerStarted to true
  }
  
    // If end of sentence, display success.
    if (typedValue === currentWord && wordIndex === words.length - 1) {
      // Calculate time in seconds
      const elapsedTime = (new Date().getTime() - startTime) / 1000;

      // Calculate the speed in word per minute
      speed = Math.floor((words.length / elapsedTime) * 60);
      const message = `<p>CONGRATULATIONS!</p> <p>You finished in ${elapsedTime} seconds. Your typing speed is ${speed} WPM.</p>`;
      messageElement.innerHTML = message;
      quoteElement.innerHTML = "";
      typedValueElement.value = "";
      typedValueElement.disabled = true;
      modalElement.style.display = "block";
      saveScore(speed);
      getHighScore();
      highScoreLength();
    } 
    else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
      // End of word
      // Clear the typedValueElement for the new word
      typedValueElement.value = "";

      // Highlight previous word light green to indicate that it's correct
      quoteElement.children[wordIndex].className = "highlight-green";

      // Move to the next word
      wordIndex++;

      if (wordIndex < quoteElement.children.length) {
        quoteElement.children[wordIndex].className = "highlight";
      }
    } 
    else if (currentWord.startsWith(typedValue)) {
      // Currently correct, don't apply class name to the input element
      typedValueElement.className = "";
    } 
    else {
      // Make the background color lightcoral to indicate wrong word
      typedValueElement.className = "error";
    }
  });

  //Close the modal when you click outside the modal content
  modalElement.addEventListener("click", (event) => {
  if (event.target === modalElement) {
      modalElement.style.display = "none"; // Hide the modal
    } 
  });

  //Close the modal when you click on the "x" symbol.
  closeModal.addEventListener("click", ()=> {
    modalElement.style.display = "none";
  });

//Local storage to store highscores
function saveScore(wpm) {
  let score = JSON.parse(localStorage.getItem("highScore")) || [];

  // Save the score along with the current timestamp
  let scoreWithTimestamp = {score: wpm, timestamp: new Date().toLocaleString()};

  score.push(scoreWithTimestamp);
  score.sort((a, b) => b.score - a.score); // Sort by score in descending order
  score = score.slice(0, 10); // Keep only the top 10 scores

  localStorage.setItem("highScore", JSON.stringify(score));
}


function getHighScore() {
  let highScore = JSON.parse(localStorage.getItem("highScore")) || [];
  const highScoresBody = document.getElementById("highScoresBody");

  // Render high scores in the table
  highScoresBody.innerHTML = highScore.map(function (entry, index) {
    // Parse the timestamp
    let time = new Date(entry.timestamp); // Use the stored timestamp for each score
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = time.getDay();
    let today = daysOfWeek[day];
    let dateNTime = time.toLocaleString("en-US", {
      month: "short",
      day: "numeric",   
      year: "numeric",  
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    return `<tr>
                <td>${index + 1}</td>
                <td>${entry.score}</td>
                <td>${today} ${dateNTime}</td>
              </tr>`;
  }).join("");

  highScoreTable.style.display = "block";
};

//show clear highScoreButton if high score length === 10
function highScoreLength() {
  let getHighScoreLength = JSON.parse(localStorage.getItem("highScore"));
  if(getHighScoreLength.length === 10){
    clearHighScore.style.display = "inline";
  }
};

//Clear high score
clearHighScore.addEventListener("click", ()=> {
  localStorage.clear();
  highScoreTable.style.display = "none";
  clearHighScore.style.display = "none";
});
