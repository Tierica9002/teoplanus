//GAME - Find & Match

//To be continued: Match the artist with his/her instrument

var msg1 = document.getElementById("msg1");
var msg2 = document.getElementById("msg2");
var msg3 = document.getElementById("msg3");
var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");
var outcome = document.getElementById("outcome");
var p = document.createElement("h5");

startBtn.onclick = startGame;
stopBtn.onclick = stopCounter;

var randomNames = [];
var names = [
  "Hetfield",
  "Malmsteen",
  "Trujillo",
  "Hammet",
  "Lars",
  "Halford",
  "Heafy",
  "Lemmy",
  "Ozzy"
];

var timeLeft = 5;
var timer;
var totalLives = 3;
var remainingLives = 3;
var key;

function startCounter() {
  timer = window.setInterval(counter, 1000);
}

function counter() {
  timeLeft--;
  if (timeLeft < 0) {
    window.clearInterval(timer);
    remainingLives--;
    timeLeft = 5;
    startCounter();
  }
  msg2.innerHTML = timeLeft + " sec remaining";
  msg3.innerHTML =
    "<hr>" +
    remainingLives +
    " / " +
    totalLives +
    " " +
    '<i class="fas fa-heart" style = "color: indianred"></i>';
  if (remainingLives == 0) {
    msg1.innerHTML =
      "GAME OVER!!!" + "<br><br>" + "You did not guess all the artists...";
    msg1.style.cssText = "color: indianred; font-size: 28px;";
    msg2.innerHTML = "";
    msg3.innerHTML = "Please refresh and try again.";
    outcome.style.cssText = "display: none;";
    window.clearInterval(timer);
    startBtn.disabled = true;
    stopBtn.disabled = true;
  }
}

function stopCounter() {
  window.clearInterval(timer);
  startBtn.disabled = false;
}

function startGame() {
  timeLeft = 10;
  remainingLives = 3;
  randomNames = names.slice();
  randomNames.sort(function() {
    return 0.5 - Math.random();
  }); //randomize an array (BEST WAY)
  msg2.innerHTML = timeLeft + " sec remaining";
  msg3.innerHTML +=
    "<hr>" +
    remainingLives +
    " / " +
    totalLives +
    " " +
    '<i class="fas fa-heart" style = "color: indianred"></i>';
  document.getElementById("instructions").style.cssText = "display: none;";
  msg1.style.cssText = "color: black;";
  startBtn.disabled = true;
  findArtist();
  buildBoard();
  startCounter();
}

function findArtist() {
  key = randomNames[Math.floor(Math.random() * (randomNames.length - 1))];
  msg1.innerHTML = "Find " + '<span id = "name">' + key + "</span>";
}

function buildBoard() {
  for (var i = 0; i < randomNames.length; i++) {
    outcome.innerHTML +=
      '<p class = "box" onmouseover = "showName()" onmouseout = "hideName()" onclick = "guessName()">Hidden ' +
      "</p>";
  }
}

function showName() {
  for (var i = 0; i < randomNames.length; i++) {
    outcome.children[i].value = randomNames[i];
  }
  event.target.innerText = event.target.value;
  event.target.style.cssText =
    "background-color: #000000; color: #ffffff; transition: 0.3s ease-in-out;";
}

function hideName() {
  event.target.innerText = "Hidden";
  event.target.style.cssText = "background-color: #ffffff; color: #000000;";
}

function guessName() {
  if (event.target.innerText == key) {
    var count = 0;
    count++;
    var x = randomNames.indexOf(event.target.innerText);
    outcome.removeChild(outcome.childNodes[x + 1]);
    randomNames.splice(x, 1);
    outcome.appendChild(p).innerHTML = "Correct!";
    p.style.cssText = "color: darkseagreen;";
    findArtist();
    if (key == undefined) {
      msg1.innerHTML =
        "CONGRATULATIONS, you won the 1st round!!!" +
        "<br><br>" +
        'You can play again by pressing "Start" or continue to part II, below!' +
        "<br>" +
        "Remeber that part II is based on dragging an artist's portrait to his / her corresponding instrument.";
      msg1.style.cssText = "color: darkseagreen; font-size: 24px;";
      msg2.innerHTML = "";
      startBtn.disabled = false;
      document.body.removeChild(outcome);
      document.body.removeChild(instructions);
      msg3.innerHTML = "";
      artists.style.cssText = "visibility: visible;";
      instruments.style.cssText = "visibility: visible;";
      stopCounter();
      part2();
    }
  } else {
    outcome.appendChild(p).innerHTML = "Incorrect!";
    p.style.cssText = "color: indianred;";
  }
}

/*********************************************************************************
PART II
*********************************************************************************/
var artists = document.getElementById("artists");
var instruments = document.getElementById("instruments");

var guitarists = Array.from(document.getElementsByClassName("guitarist"));
var vocalists = Array.from(document.getElementsByClassName("vocalist"));
var bassists = Array.from(document.getElementsByClassName("bassist"));
var drummers = Array.from(document.getElementsByClassName("drummer"));

function part2() {
  artists.style.cssText = "visibility: visible";
  instruments.style.cssText = "visibility: visible";
  cheatCounter();
}

//Event listeners and draggable assignments
for (var i = 1; i < artists.children.length; i++) {
  artists.children[i].draggable = true;
}

for (var i = 1; i < artists.children.length; i++) {
  artists.children[i].addEventListener("dragstart", startDrag);
}

for (var i = 1; i < instruments.children.length; i++) {
  instruments.children[i].addEventListener("dragover", dragOver);
}

for (var i = 1; i < instruments.children.length; i++) {
  instruments.children[i].addEventListener("drop", dropDrag);
}

//Drag and drop functionality
var holderItem;

function startDrag() {
  holderItem = event.target;
  console.log("Drag started");
}

function dragOver() {
  event.preventDefault();
  console.log("Drag allowed");
}

var artistsArr = Array.from(artists.children);

function dropDrag() {
  event.preventDefault();
  if (
    (holderItem.className === "guitarist" && event.target.id === "guitar") ||
    (holderItem.className === "vocalist" && event.target.id === "mic") ||
    (holderItem.className === "bassist" && event.target.id === "bass") ||
    (holderItem.className === "drummer" && event.target.id === "drums")
  ) {
    artistsArr.splice(artistsArr.indexOf(holderItem.className), 1);
    event.target.appendChild(holderItem);
    instruments.appendChild(p).innerHTML = "Correct";
    p.style.cssText = "color: darkseagreen;";
    if (artists.children.length <= 1) {
      instruments.appendChild(p).innerHTML =
        "CONGRATULATIONS!" +
        "<br>" +
        "Please select your prize from the instruments above";
      clearInterval(timer);
      selectPrize();
      p.style.cssText = "color: darkseagreen; font-size: 26px;";
      cheat.style.cssText = "visiblity: hidden";
    }
  } else {
    instruments.appendChild(p).innerHTML = "Incorrect";
    p.style.cssText = "color: indianred;";
  }
  console.log("Drag dropped");
}

//Cheat / hover hint
var cheat = document.getElementById("cheat");
var titleValues = [];

for (var i = 1; i < artistsArr.length; i++) {
  titleValues.push(artistsArr[i].title);
}

for (var i = 1; i < artistsArr.length; i++) {
  artistsArr[i].title = "";
}

function whatInstr() {
  for (var i = 1; i < artistsArr.length; i++) {
    artistsArr[i].title = titleValues[i - 1];
  }
}

function cheatCounter() {
  timer = setInterval(cheater, 20000);
}

function cheater(a) {
  a = confirm(
    "Feeling unconfident? Well, either read more about these artists or go the easy way and cheat?" +
      "\n \n" +
      "OK = Yes, I wanna cheat >: )" +
      "\n" +
      "Cancel = Imma do this on my own!"
  );
  if (a == true) {
    clearInterval(timer);
    alert("Let the IDDQD begin");
    msg3.innerHTML +=
      '<button id = "hintBtn" class = "btn">HOVER<br><span><img src = "img/devil.svg"></span><br>HINTS</button>';

    for (var i = 1; i < artists.children.length; i++) {
      artists.children[i].addEventListener("mouseover", whatInstr);
    }
  } else {
    clearInterval(timer);
    alert("Right on! Good luck!");
  }
}

var prizeList = [];
var prizeAwarded = [];

function selectPrize() {
  for (var i = 1; i < instruments.children.length; i++) {
    instruments.children[i].addEventListener("click", prizeSelected);
    prizeList.push(instruments.children[i].id);
    instruments.children[i].style.cssText = "cursor: pointer;";
  }
}

function prizeSelected() {
  var x = prizeList.indexOf(event.target.id);
  prizeList.splice(x, 1);
  prizeAwarded.push(event.target.id);
  var y = instruments.children[x + 1];
  instruments.removeChild(y);
  if (prizeList.length <= 4) {
    document.body.innerHTML = "<p>" + "Congrats, enjoy your new:" + "<p>";
    document.body.appendChild(y);
    console.log(event.target);
    setTimeout(function(a) {
      a = confirm(
        "That's it, hope you enjoyed it! :)" +
          "\n" +
          "If you wanna play again, just refresh the page."
      );
      if (a == true) {
        location.reload();
      } else {
        alert("OK, it seems there are better things out there... google them");
        window.location.href = "https://google.com";
      }
    }, 3000);
    console.log(event.target);
    document.body.style.cssText =
      "font-weight: bold; font-size: 36px; letter-spacing: 2px;";
    y.style.cssText = "width: 500px; margin: 50px 0;";
  }
}
