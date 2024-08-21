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
const histList = document.querySelector(".pass-hist-list-container");
const observerRoot = document.querySelector(".five-cells-grid");

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
  updateSecurityColor(Number(rangeInput.value));
});

radioContainer.addEventListener("click", function (e) {
  const selectedValues = Array.from({ length: e.target.value }, (_, i) => i);
  if (e.target.type === "radio") {
    checkboxes.forEach((el) => (el.checked = false));
    checkboxes.forEach((el, i) => (el.checked = selectedValues.includes(i)));
    charGroupsToUse = calcCharGroupsToUse();
    disableCbox(charGroupsToUse);
    updatePassword();
    updateSecurityColor(Number(rangeInput.value));
  }
});

checkboxContainer.addEventListener("click", function (e) {
  if (e.target.type === "checkbox") {
    if (e.target.checked) charGroupsToUse.push(Number(e.target.value));
    else charGroupsToUse.splice(charGroupsToUse.indexOf(Number(e.target.value)), 1);

    if (charGroupsToUse.length === 1) Array.from(checkboxes)[charGroupsToUse[0]].disabled = true;
    else Array.from(checkboxes).forEach((cb) => (cb.disabled = false));
    updatePassword();
    updateSecurityColor(Number(rangeInput.value));
  }
});

function addToHistoryList() {
  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  const now = new Intl.DateTimeFormat("en-US", options).format(date);
  const listLitem = `
  <div class="five-cells-grid">
        <svg class="history-coppy-btn" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg> 
        <p class="list-sub-elem pass-sub-elem">${currentPassword}</p>
        <p class="list-sub-elem">${strengthBar.lastElementChild.textContent}</p>
        <p class="list-sub-elem">${now}</p>
        <svg class = "history-delete-btn" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
    </div>
    `;

  histList.insertAdjacentHTML("beforeend", listLitem);
}

generatePassBtn.addEventListener("click", function () {
  updatePassword();
  updateSecurityColor(Number(rangeInput.value));
});

coppyPassBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(passField.value);
  addToHistoryList();
});

histList.addEventListener("click", function (e) {
  if (e.target.classList.contains("history-coppy-btn")) {
    navigator.clipboard.writeText(e.target.nextElementSibling.textContent);
  } else if (e.target.classList.contains("history-delete-btn")) {
    e.target.parentElement.remove();
  }
});
