const rangeInput = document.querySelector('input[type="range"]');
const charLenLabel = document.querySelector("#char-len-value");
const passOutput = document.querySelector(".pass-output");
const radioContainer = document.querySelectorAll(".settings")[0];
const checkboxContainer = document.querySelectorAll(".settings")[1];
const radios = document.querySelectorAll('input[type="radio"]');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let paswordLength = 0;
let charGroupsToUse = [];

function updateRangeBackground() {
  const value = ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
  rangeInput.style.background = `linear-gradient(to right, #6e6e6e ${value}%, #17161E ${value}%)`;
}
updateRangeBackground();

function initialise() {
  charLenLabel.innerText = rangeInput.value;
  radios[radios.length - 1].checked = true;
  checkboxes.forEach((el) => (el.checked = true));
  passOutput.value = generatePassword(8, [0, 1, 2]);
}
initialise();

function generatePassword(len, charTypes) {
  let password = "";
  const groups = [
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=", ",", ".", "<", ">", "?", "~"],
  ];

  let groupToUse = [];
  groups.forEach((group, i) => {
    if (charTypes.includes(i)) groupToUse = groupToUse.concat(group);
  });

  const getRandomInt = (max) => Math.floor(Math.random() * max);
  while (len--) password += groupToUse[getRandomInt(groupToUse.length - 1)];

  return password;
}

function updatePassword() {
    paswordLength = rangeInput.value;
    charLenLabel.innerText = paswordLength;
    passOutput.value = generatePassword(paswordLength, calcCharGroupsToUse());
  }

function calcCharGroupsToUse(){
    console.log(Array.from(checkboxes).map((cb, i) => cb.checked ? i : -1).filter(i => i != -1));
    return Array.from(checkboxes).map((cb, i) => cb.checked ? i : -1).filter(i => i != -1);
}

function disableCbox(charTypes) {
    checkboxes.forEach((cb) => (cb.disabled = true));
    checkboxes.forEach((cb, i) => {
      if (charTypes.includes(i)) cb.disabled = false;
    });
  }

rangeInput.addEventListener("input", function () {
  updateRangeBackground();
  updatePassword();
});

radioContainer.addEventListener("click", function (e) {
  const selectedValues = Array.from({ length: e.target.value }, (_, i) => i);
  if (e.target.type === "radio") {
    checkboxes.forEach((el) => (el.checked = false));
    checkboxes.forEach((el, i) => (el.checked = selectedValues.includes(i)));
    disableCbox(calcCharGroupsToUse());
  }
});