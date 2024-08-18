const rangeInput = document.querySelector('input[type="range"]');

function updateRangeBackground() {
    const value = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
    rangeInput.style.background = `linear-gradient(to right, #6e6e6e 0%, #6e6e6e ${value}%, #17161E ${value}%, #17161E 100%)`;
}

rangeInput.addEventListener('input', updateRangeBackground);
updateRangeBackground();