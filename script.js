const rangeInput = document.querySelector('input[type="range"]');
const charLenLabel = document.querySelector("#char-len-value");
const passOutput = document.querySelector(".pass-output");
const radioContainer = document.querySelectorAll(".settings")[0];
const checkboxContainer = document.querySelectorAll(".settings")[1];
const radios = document.querySelectorAll('input[type="radio"]');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const generatePassBtn = document.querySelector(".action-btns-container").firstElementChild;
const coppyPassBtn = document.querySelector(".action-btns-container").lastElementChild;
const passField = document.querySelector(".pass-output");
const strengthBar = document.querySelector(".strength-bar");
const bruteBar = document.querySelector(".brute-bar");
const passList = document.querySelector(".pass-list");
const dateList = document.querySelector(".date-list");

let paswordLength = 0;
let charGroupsToUse = [0, 1, 2, 3];
const passHistory = [];
let currentPassword = "";

function updateRangeBackground() {
  const value = ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
  rangeInput.style.background = `linear-gradient(to right, #6e6e6e ${value}%, #17161E ${value}%)`;
}
updateRangeBackground();

function initialise() {
  charLenLabel.textContent = rangeInput.value;
  radios[radios.length - 1].checked = true;
  checkboxes.forEach((el) => (el.checked = true));
  passOutput.value = generatePassword(8, charGroupsToUse);
  updateSecurityColor(8);
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

  passHistory.push(password);
  currentPassword = password;
  return password;
}

//TODO  updateSecurityColor() is called by itslef and also inside updatePassword(). Call it separately each time for better readability
function updateSecurityColor(passLen) {
  const securityLevels = [
    { maxLen: 6, strength: "Very Weak", time: "Seconds to minutes", color: "#F88970" },
    { maxLen: 10, strength: "Weak", time: "Hours to days", color: "#F8B170" },
    { maxLen: 13, strength: "Good", time: "Months to years", color: "#F5F870" },
    { maxLen: 18, strength: "Strong", time: "Centuries", color: "#9CF870" },
    { maxLen: Infinity, strength: "Very Strong", time: "Many centuries", color: "#70F8CF" },
  ];

  const level = securityLevels.find((level) => passLen <= level.maxLen);

  strengthBar.lastElementChild.textContent = level.strength;
  bruteBar.lastElementChild.textContent = level.time;
  strengthBar.style.backgroundColor = level.color;
  bruteBar.style.backgroundColor = level.color;
}

function updatePassword() {
  paswordLength = rangeInput.value;
  charLenLabel.textContent = paswordLength;
  passOutput.value = generatePassword(paswordLength, calcCharGroupsToUse());
  updateSecurityColor(Number(paswordLength));
}

function calcCharGroupsToUse() {
  return Array.from(checkboxes)
    .map((cb, i) => (cb.checked ? i : -1))
    .filter((i) => i != -1);
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
    charGroupsToUse = calcCharGroupsToUse();
    disableCbox(charGroupsToUse);
    updatePassword();
  }
});

checkboxContainer.addEventListener("click", function (e) {
  if (e.target.type === "checkbox") {
    if (e.target.checked) charGroupsToUse.push(Number(e.target.value));
    else charGroupsToUse.splice(charGroupsToUse.indexOf(Number(e.target.value)), 1);

    if (charGroupsToUse.length === 1) Array.from(checkboxes)[charGroupsToUse[0]].disabled = true;
    else Array.from(checkboxes).forEach((cb) => (cb.disabled = false));
    updatePassword();
  }
});

function addToHistoryList() {
  console.log(currentPassword);
  const passLi = document.createElement("li");
  const dateLi = document.createElement("li");
  passLi.textContent = currentPassword;
  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  dateLi.innerHTML = new Intl.DateTimeFormat("en-US", options).format(date);
  dateList.appendChild(dateLi);
  passList.appendChild(passLi);
}

generatePassBtn.addEventListener("click", function () {
  updatePassword();
});

coppyPassBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(passField.value);
  addToHistoryList();
});
