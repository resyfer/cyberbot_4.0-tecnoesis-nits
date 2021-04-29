/* DOM */

  //Ball-E
var ballE = document.getElementById("ballE");
var ballEBody = document.getElementById('ballEBody');
var ballEArm = document.getElementById('ballEArm');

  //HTML Body
var body = document.getElementsByTagName("body")[0];

  //Score
var myScore = document.getElementById("myScore");
var highestScoreDiv = document.getElementById('bestScore');

    //Scorecard
var scoreCard = document.getElementById('gameOver');
var scoreCardText= document.getElementById('gameOverText');

  //Music
var musicTrack = document.getElementById('musicTrack');
var muteOff = document.getElementById('muteOff');
var muteOn = document.getElementById('muteOn');

    //Music Credits
var musicCredits = document.getElementById("musicCredits");

/* Local Storage */

  //Best Score
var highestScore = localStorage.getItem('highestScore');

  //Ball-E Color
var ballEColor = localStorage.getItem('color');

  //Mute
var isMute;
if(localStorage.getItem('mute') == null) {
  isMute = 0;
  localStorage.setItem('mute', isMute);
} else {
  isMute = localStorage.getItem('mute');
}

/* Global Variables */

  //setInterval IDs
var spawnIntervalFuncID;
var scoreIntervalFuncID;

  //Score
var score = parseInt(myScore.innerHTML);
var spawnTime = (500/(2.3**(score/40))) + 100;

  // Ball-E Color
var colorIndex;

    //Ball-E Body Color
var bodyColor = 
[
  'linear-gradient(rgba(255, 0, 0, 100), rgba(255, 255, 0, 100))',
  'linear-gradient(rgba(0, 189, 189, 100), rgba(232, 250, 250, 100))',
  'linear-gradient(rgba(128, 0, 128, 100), rgba(175, 168, 175, 100))',
  'linear-gradient(rgba(102, 245, 50, 100), rgba(145, 201, 141, 100))',
  'linear-gradient(rgba(224, 195, 7, 100), rgba(204, 196, 143, 100))'
];
var armColor =
[
  'linear-gradient(to right, rgba(255, 0, 0, 100), rgba(255, 255, 0, 100))',
  'linear-gradient(to right, rgba(0, 189, 189, 100), rgba(232, 250, 250, 100))',
  'linear-gradient(to right, rgba(128, 0, 128, 100), rgba(175, 168, 175, 100)',
  'linear-gradient(to right, rgba(102, 245, 50, 100), rgba(145, 201, 141, 100))',
  'linear-gradient(to right, rgba(224, 195, 7, 100), rgba(204, 196, 143, 100))'
]

var boulderColor =
[
  'rgba(21, 244, 238, 100)',
  'rgba(255, 255, 51, 100)',
  'rgba(0, 255, 102, 100)',
  'rgba(255, 0, 255, 100)',
  'rgba(157, 0, 255, 100)',
  'rgba(113, 34, 250, 100)',
  'rgba(165, 216, 243, 100)',
  'rgba(19, 202, 145, 100)',
  'rgba(248, 81, 37, 100)',
  'rgba(235, 248, 117, 100)',
  'rgba(217, 235, 75, 100)',
  'rgba(242, 26, 29, 100)',
  'rgba(127, 255, 0, 100)',
  'rgba(255, 32, 121, 100)'
];

//Loader Circle Animation
var loaderCircles = document.getElementsByClassName('circle');
var circleAnimationDelay = -3.5;

for(var i = 0; i<loaderCircles.length; i++) {
  loaderCircles[i].style.animationDelay = `${circleAnimationDelay}s`;
  circleAnimationDelay+=0.5;
}

//Body On Load Function
function bodyLoad(){
  document.getElementById('loaderContainer').style.display = "none";
  document.getElementById('title').style.top = "17.5%";
  document.getElementById('music').style.zIndex = "100";
}

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
  musicCredits.style.display = "block";
  document.getElementById("myScoreDiv").style.display = "block";
  game();
};

function game() {

  //Play music if unmute
  if(isMute == false) {
    musicChange();
  }

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
      }
    }  
  }, 50);
}

//Boulder Spawn Function
function spawn() {

  clearInterval(spawnIntervalFuncID);

  var boxDiv = document.createElement("div");
  boxDiv.setAttribute("class", "box");

  var boulderColorIndex = (Math.trunc(Math.random()*1000) % boulderColor.length);
  boxDiv.style.backgroundColor = boulderColor[boulderColorIndex];
  boxDiv.style.boxShadow = `0 0 2vh 0 ${boulderColor[boulderColorIndex]}`;
  
  //Random Top for Boulders
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

  //Remove Ball-E
  ballE.remove();

  //Remove existing Boulders Once Game Over
  var boulderList = document.getElementsByClassName('box');
  while(boulderList.length != 0) {
    boulderList[0].remove();
    boulderList = document.getElementsByClassName('box');
  }

  document.getElementById('score').style.display = "none";
  document.getElementById("bg-pic-shade").style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}

//Retry
function retry() {
  location.reload();
}

/* Music */ 
//Mute
  //Mute Variables
musicTrack.volume = 0.4;
var muteFlag = (isMute)? 0 : 1;

if(isMute == 0) {
  muteOff.style.display = "block";
  muteOn.style.display = "none";
} else {
  muteOff.style.display = "none";
  muteOn.style.display = "block";
}

  //Mute Function
function mute() {
  if(isMute && muteFlag!=0) {
    muteOff.style.display = "block";
    muteOn.style.display = "none";
    isMute = 0;
    musicChange();
  } else {
    muteOff.style.display = "none";
    muteOn.style.display = "block";
    isMute = 1;
    musicTrack.pause();
    muteFlag = 1;
  }
  localStorage.setItem('mute', isMute);
}

// Music Track Change

  //Music Name List
var musicListName = [
  `Invitation to Windblume, Part 2 - Thorny Benevolence, Genshin Impact`,
  `Ocean - Lost Wolves & Glasscat`,
  `Qilin's Prance - Plenilune Gaze`,
  `Dancin - Aaron Smith, KRONO Remix`,
];

  //Music Source List
var musicListSrc = [
  `rosaria.mp3`,
  `ocean.mp3`,
  `ganyu.mp3`,
  `dancin.m4a`
];

  //Music Track Change Variables
var musicCurrentIndex = -1;
var musicNewIndex;
var musicDuration;
var musicIntervalFuncID;
var musicChangeFlag = 0;
var musicName = document.getElementById('musicName');

  //Music Change Function
function musicChange() {
  musicCredits.style.display = "block";
  do {
    musicNewIndex = Math.trunc(Math.random()*10) % musicListSrc.length;  
  } while (musicNewIndex == musicCurrentIndex);

  musicTrack.setAttribute('src', `music/${musicListSrc[musicNewIndex]}`);
  musicTrack.play();
  musicCurrentIndex = musicNewIndex;

  musicTrack.addEventListener('loadedmetadata', function() {
    musicDuration = musicTrack.duration;
  });

  musicName.innerHTML = musicListName[musicNewIndex];

  musicTrack.addEventListener('ended', () => {
    musicChange();
  });
}