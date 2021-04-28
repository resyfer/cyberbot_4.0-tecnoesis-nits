//Highest Score
var highScore = localStorage.getItem('highScore');
var bestScore = document.getElementById('bestScore');

if(localStorage.getItem('highScore') == null) {
  bestScore.innerHTML = '0';
  localStorage.setItem('highScore', 0);
} else {
  bestScore.innerHTML = highScore;
}

var spawnIntervalFuncID;
var scoreIntervalFuncID;

//Add Boulders
var body = document.getElementsByTagName("body")[0];
var spawnTime = (500/(2.3**(score/40))) + 100;
var rocket = document.getElementById("rocket-container");

//Score
var myScore = document.getElementById("myScore");
var score = parseInt(myScore.innerHTML);

//Start Game
function startGame() {
  document.getElementById("start").remove();
  document.getElementById("title").remove();
  document.getElementById("intro").remove();
  document.getElementById("colorChange").remove();
  game();
};

function game() {

  //Rocket Move

  window.addEventListener('mousemove', e => {
    rocket.style.left = e.pageX + 'px';
    rocket.style.top = e.pageY + 'px';
  });
  
  scoreIntervalFuncID = setInterval(() => {
    score+=1;
    myScore.innerHTML = score;
  }, 500);

  //Boulder Remove After Animation Completion
  setInterval(() => {
    var boxDivList = document.getElementsByClassName('box');
    for(var i = 0; i<boxDivList.length; i++) {
      var left = parseInt(window.getComputedStyle(boxDivList[i]).getPropertyValue('left'));
      if(left<0) {
        boxDivList[i].remove();
        boxDivList = document.getElementsByClassName('box');
      }
    }
  }, 200);

  spawn();

  setInterval(() => {
    var boxList = document.getElementsByClassName('box');
    for(var i = 0; i<boxList.length; i++) {
      if(checkCollision(boxList[i], rocket) == true) {
        // alert("Your Score: " + score);
        clearInterval(spawnIntervalFuncID);
        clearInterval(scoreIntervalFuncID);
        gameOver();
        setHighScore();
        //location.reload();

        var newBoxArray = document.getElementsByClassName('box');
        for(var i = 0; i<newBoxArray.length; i++) {
          newBoxArray[i].remove();
        }
      }
    }  
  }, 50);
}


function spawn() {

  clearInterval(spawnIntervalFuncID);

  var boxDiv = document.createElement("div");
  boxDiv.setAttribute("class", "box");
  
  //Random Height for Boulders
  var viewHeight = window.innerHeight;
  var randHeight = (Math.random()*3000) % (viewHeight);
  body.appendChild(boxDiv); //Adding new boulder
  
  var boulders = document.getElementsByClassName('box');
  var lastBoulder = boulders[boulders.length - 1];
  lastBoulder.style.top = randHeight + "px";
  
  //Reducing transition time as time increases
  var scoreMultiplier = (7/(2.3**(score/100))) + 0.5;
  lastBoulder.style.animationDuration = scoreMultiplier + 's';

  spawnTime = (1500/(2.3**(score/40))) + 100;

  spawnIntervalFuncID = setInterval(spawn, spawnTime);
};

function setHighScore() { 
  if(localStorage.getItem('highScore') == null) {
    localStorage.setItem('highScore', score);
  } else {
    localStorage.setItem('highScore', Math.max(score, highScore));
    highScore = localStorage.getItem('highScore');
  }
  bestScore.innerHTML = highScore;
}

//Collision Check
function checkCollision(e1, e2) {
  if (e1.length && e1.length > 1) {
    e1 = e1[0];
  }
  if (e2.length && e2.length > 1){
    e2 = e2[0];
  }
  const rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false;
  const rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false;
 
  var overlap = false;
 
  if (rect1 && rect2) {
    overlap = !(
      rect1.right < rect2.left || 
      rect1.left > rect2.right || 
      rect1.bottom < rect2.top || 
      rect1.top > rect2.bottom
    );
  }
  return overlap;
};

//Change Color
/*
  0 - Pyro
  1 - Anemo
  2 - Electro
  3 - Dendro
  4 - Mutant Electro
  5 - Geo
*/

var bodyColor = 
[
  'linear-gradient(red, yellow)',
  'linear-gradient(rgb(0, 189, 189), rgb(232, 250, 250))',
  'linear-gradient(purple, rgb(175, 168, 175))',
  'linear-gradient(rgb(102, 245, 50), rgb(145, 201, 141))',
  'linear-gradient(rgb(224, 195, 7), rgb(204, 196, 143))'
];

var armColor =
[
  'linear-gradient(to right, red, yellow)',
  'linear-gradient(to right, rgb(0, 189, 189), rgb(232, 250, 250))',
  'linear-gradient(to right, purple, rgb(175, 168, 175)',
  'linear-gradient(to right, rgb(102, 245, 50), rgb(145, 201, 141))',
  'linear-gradient(to right, rgb(224, 195, 7), rgb(204, 196, 143))'
]

var ballEBody = document.getElementById('rocket-body');
var ballEArm = document.getElementById('arm');

var ballEColor = localStorage.getItem('color');
var colorIndex;

if(localStorage.getItem("color") == null) {
  localStorage.setItem("color", "0");
  colorIndex = 0;
} else {
  colorIndex = parseInt(ballEColor);
  ballEBody.style.backgroundImage = bodyColor[colorIndex];
  ballEArm.style.backgroundImage = armColor[colorIndex];
}

function colorChange() {
  colorIndex++;
  colorIndex%=bodyColor.length;
  localStorage.setItem('color', colorIndex);
  ballEBody.style.backgroundImage = bodyColor[colorIndex];
  ballEArm.style.backgroundImage = armColor[colorIndex];
}

//Game Over
function gameOver() {
  var scoreCard = document.getElementById('gameOver');
  scoreCard.style.display = "block";
  var scoreCardText= document.getElementById('gameOverText');
  var encouragement;
  encouragement = (score>=highScore)? "Yay! You got a new best score!" : "C'mon, beating records is what ";
  document.getElementById("gameOverEncouragement").innerHTML = encouragement;
  scoreCardText.innerHTML = `
Your Score: ${score} <br>
Best Score: ${parseInt(highScore)} <br><br>
  `;
  rocket.remove();
  document.getElementById('score').remove();
  document.getElementById("bg-pic-shade").style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}

//Retry
function retry() {
  location.reload();
}