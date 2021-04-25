var rocket = document.getElementById("rocket-container");

window.addEventListener('mousemove', e => {
  rocket.style.left = e.pageX + 'px';
  rocket.style.top = e.pageY + 'px';
})