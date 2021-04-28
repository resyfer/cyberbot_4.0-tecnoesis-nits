//DOM
var ballE = document.getElementById("ballE");
var ballEBody = document.getElementById('ballEBody');
var ballEArm = document.getElementById('ballEArm');

var body = document.getElementsByTagName("body")[0];

var myScore = document.getElementById("myScore");
var highestScoreDiv = document.getElementById('bestScore');

var scoreCard = document.getElementById('gameOver');
var scoreCardText= document.getElementById('gameOverText');


//Local Storage
var highestScore = localStorage.getItem('highestScore');
var ballEColor = localStorage.getItem('color');

//Global Variables
var spawnIntervalFuncID;
var scoreIntervalFuncID;

var score = parseInt(myScore.innerHTML);
var spawnTime = (500/(2.3**(score/40))) + 100;

var colorIndex;

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




//Highest Score

if(localStorage.getItem('highestScore') == null) {
  highestScoreDiv.innerHTML = '0';
  localStorage.setItem('highestScore', 0);
} else {
  highestScoreDiv.innerHTML = highestScore;
}

//Start Game
function startGame() {
  document.getElementById("start").remove();
  document.getElementById("title").remove();
  document.getElementById("intro").remove();
  document.getElementById("colorChange").remove();
  document.getElementById("myScoreDiv").style.display = "block";
  game();
};

function game() {

  //Ball-E Move With Cursor
  window.addEventListener('mousemove', e => {
    ballE.style.left = e.pageX + 'px';
    ballE.style.top = e.pageY + 'px';
  });
  
  //Increase Score As a Function of Time
  scoreIntervalFuncID = setInterval(() => {
    score+=1;
    myScore.innerHTML = score;
  }, 250);

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

  //Spawn Boulders
  spawn();

  //Check for collision with boulder and Ball-E
  setInterval(() => {
    var boxList = document.getElementsByClassName('box');
    for(var i = 0; i<boxList.length; i++) {
      if(checkCollision(boxList[i], ballE) == true) {
        clearInterval(spawnIntervalFuncID);
        clearInterval(scoreIntervalFuncID);
        setHighestScore();
        gameOver();

        var newBoxArray = document.getElementsByClassName('box');
        for(var i = 0; i<newBoxArray.length; i++) {
          newBoxArray[i].remove();
        }
      }
    }  
  }, 50);
}

//Boulder Spawn Function
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
  var transitionTimeReducer = (7/(2.3**(score/100))) + 0.5; //Reducing transition time of boulders
  lastBoulder.style.animationDuration = transitionTimeReducer + 's';

  spawnTime = (1500/(2.3**(score/60))) + 50;

  spawnIntervalFuncID = setInterval(spawn, spawnTime);
};


//Set the Best Score Function
function setHighestScore() { 
  if(localStorage.getItem('highestScore') == null) {

    localStorage.setItem('highestScore', score);
    
  } else {

    highestScore = Math.max(score, highestScore);
    localStorage.setItem('highestScore', highestScore);
  }
  highestScoreDiv.innerHTML = highestScore;
}

//Collision Check Function
function checkCollision(div1, div2) {

  var rect1 = div1.getBoundingClientRect();
  var rect2 = div2.getBoundingClientRect();

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


/* Change Ball-E Color */

  /*
    Color Codes as per index:
    
    0 - Pyro
    1 - Anemo
    2 - Electro
    3 - Dendro
    4 - Mutant Electro
    5 - Geo
  */

//Initial Ball-E Color (remembers choice)
if(localStorage.getItem("color") == null) {

  colorIndex = 0;
  localStorage.setItem("color", colorIndex);

} else {
  colorIndex = parseInt(ballEColor);
  ballEBody.style.backgroundImage = bodyColor[colorIndex];
  ballEArm.style.backgroundImage = armColor[colorIndex];
}

//Color Change Function
function colorChange() {
  colorIndex++;
  colorIndex%=bodyColor.length;
  localStorage.setItem('color', colorIndex);
  ballEBody.style.backgroundImage = bodyColor[colorIndex];
  ballEArm.style.backgroundImage = armColor[colorIndex];
}

//Game Over
function gameOver() {
  scoreCard.style.display = "block";

  var encouragement;
  encouragement = (score>=highestScore)? "Yay! You got a new best score!" : "C'mon, beating records is what we're here for";
  document.getElementById("gameOverEncouragement").innerHTML = encouragement;


  scoreCardText.innerHTML = `
    Your Score: ${score} <br>
    Best Score: ${parseInt(highestScore)} <br><br>
  `;


  ballE.remove();
  document.getElementById('score').style.display = "none";
  document.getElementById("bg-pic-shade").style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}

//Retry
function retry() {
  location.reload();
}