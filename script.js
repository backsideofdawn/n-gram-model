let textData;
const depth = 6;
const model = {};
let words;

const generateText = document.createElement('p');
generateText.style.display = 'none';

const generateBtn = document.createElement('button');
generateBtn.style.display = 'none';
generateBtn.textContent = 'Generate';
generateBtn.onclick = () => {
  const tmp = Math.floor(Math.random() * (words.length - depth));
  const output = words.slice(tmp, tmp + (depth - 1));
  for (let i = 0; i < 1000; i++) {
    const index = output.slice(i, i + (depth - 1)).join(' ');
    const topWords = Object.entries(model[index]).sort((a, b) => b[1] - a[1]);
    output.push(topWords[0][0]);
  }
  generateText.innerText = output.join(' ');
}
document.body.appendChild(generateBtn);
document.body.appendChild(generateText);

const depthInput = document.createElement('input');
depthInput.type = 'number';
depthInput.value = 3;
depthInput.min = 2;
depthInput.max = 15;

const depthLabel = document.createElement('span');
depthLabel.textContent = '#-gram ';

const loadBtn = document.createElement('button');

loadBtn.textContent = 'Load data';
loadBtn.onclick = (event) => {
  loadBtn.remove();
  depthLabel.remove();
  depthInput.remove();
  load().then(() => {
    generateBtn.style.display = 'inline';
    generateText.style.display = 'block';
  });
}

document.body.appendChild(depthLabel);
document.body.appendChild(depthInput);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(loadBtn);

async function loadData() {
  const response = await fetch('text/shakespeare_input.txt');
  textData = await response.text();
}

async function load() {
  setDisplay('Loading data...');
  await loadData();
  await pause(500);
  await processData();
  await pause(1000);
  textDisplay.remove();
}

async function processData() {
  setDisplay("Processing data...");
  // Remove everything except numbers, letters, and periods/commas
  const removePunctuation = /[^0-9a-z.,']/g;
  textData = textData
    .toLowerCase()
    .replaceAll(removePunctuation, ' ')
    .replaceAll('.', ' .')
    .replaceAll(',', ' ,')
    .replaceAll(/\s\s+/g, ' ');
  await pause(100);
  setDisplay("Creating model...");

  words = textData.split(' ');
  for (let i = 0; i < words.length - (depth - 1); i++) {
    const index = words.slice(i, i + (depth - 1)).join(' ');
    if (typeof model[index] === 'undefined') {
      model[index] = {};
    }
    if (typeof model[index][words[i + (depth - 1)]] === 'undefined') {
      model[index][words[i + (depth - 1)]] = 0;
    }
    model[index][words[i + (depth - 1)]]++;
  }
  setDisplay("Done!");

}
