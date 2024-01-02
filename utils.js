const textDisplay = document.getElementById('text-display');
function setDisplay(text) {
  textDisplay.textContent = text;
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}