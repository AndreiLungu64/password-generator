const rangeInput = document.querySelector('input[type="range"]');
const charLenLabel = document.querySelector("#char-len-value");
const passOutput = document.querySelector(".pass-output");
const radioContainer = document.querySelectorAll(".settings")[0];
const checkboxContainer = document.querySelectorAll(".settings")[1];
const radios = document.querySelectorAll('input[type="radio"]');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let paswordLength = 0;
let passwordCharTpes = 0;

function initialise() {
  charLenLabel.innerText = rangeInput.value;
  radios[radios.length - 1].checked = true;
  checkboxes.forEach((el) => (el.checked = true));
  passOutput.value = generatePassword(8, 3);
}
initialise();

function updateRangeBackground() {
  const value = ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
  rangeInput.style.background = `linear-gradient(to right, #6e6e6e ${value}%, #17161E ${value}%)`;
}
updateRangeBackground();

radioContainer.addEventListener("click", function (e) {
  const selectedValues = Array.from({ length: e.target.value }, (_, i) => i);
  if (e.target.type === "radio") {
    checkboxes.forEach((el) => (el.checked = false));
    checkboxes.forEach((el, i) => (el.checked = selectedValues.includes(i)));
  }
});

function generatePassword(len, charTypes) {
  let password = "";
  const combinations = [
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=", ",", ".", "<", ">", "?", "~"],
  ];

  let groupToUse = [];
  combinations.forEach((group, i) => {
    if (i <= charTypes) groupToUse = groupToUse.concat(group);
  });

  const getRandomInt = (max) => Math.floor(Math.random() * max);
  while (len > 0) {
    password += groupToUse[getRandomInt(groupToUse.length - 1)];
    len--;
  }
  return password;
}

rangeInput.addEventListener("input", function () {
  updateRangeBackground();
  paswordLength = rangeInput.value;
  passwordCharTpes = 3;
  charLenLabel.innerText = paswordLength;
  passOutput.value = generatePassword(paswordLength, passwordCharTpes);
});
