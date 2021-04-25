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
var boxDiv = document.getElementsByClassName('box')[0];
boxDiv.addEventListener('animationend', removeBoulder);

function removeBoulder() {
  boxDiv.remove();
  boxDiv = document.getElementsByClassName('box')[0];
  boxDiv.addEventListener('animationend', removeBoulder);
}

//Add Boulders
var body = document.getElementsByTagName("body")[0];

setInterval(() => {
  var boxDiv = document.createElement("div");
  boxDiv.setAttribute("class", "box");
  body.appendChild(boxDiv);
}, 3000)