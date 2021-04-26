//Start Game
alert("Dodge the obstacles and help Ball-E! Start Game?");

//Rocket Move
var rocket = document.getElementById("rocket-container");

window.addEventListener('mousemove', e => {
  rocket.style.left = e.pageX + 'px';
  rocket.style.top = e.pageY + 'px';
});

//Score
var myScore = document.getElementById("myScore");
var score = parseInt(myScore.innerHTML);

setInterval(() => {
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
}, 500);

//Add Boulders
var body = document.getElementsByTagName("body")[0];
var spawnTime = (500/(2.3**(score/40))) + 100;
var spawnIntervalFuncID;

spawn();

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

//Highest Score
var highScore = localStorage.getItem('highScore');
var bestScore = document.getElementById('bestScore');
if(highScore == null) {
  bestScore.innerHTML = '0';
} else {
  bestScore.innerHTML = highScore;
}

function setHighScore() { 
  if(highScore == null) {
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
 
  let overlap = false;
 
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
setInterval(() => {
  var boxList = document.getElementsByClassName('box');
  for(var i = 0; i<boxList.length; i++) {
    if(checkCollision(boxList[i], rocket) == true) {
      alert("Your Score: " + score);
      setHighScore();
      location.reload();
    }
  }  
}, 200);