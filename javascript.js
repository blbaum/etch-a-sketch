const nav = document.querySelector(".nav");
const header = document.querySelector(".nav .header");
const headerText = document.querySelector(".nav .header p");
const sketchContainer = document.querySelector(".sketch-container");
const pixelSliderHeader = document.createElement("p");
const pixelSlider = document.createElement("input");

pixelSlider.type = "range";
pixelSlider.min = "16";
pixelSlider.max = "100";
pixelSlider.value = pixelSlider.min;

headerText.classList.add("headerText");
pixelSliderHeader.classList.add("pixelSliderHeader");
pixelSlider.classList.add("pixelSlider");

nav.appendChild(pixelSliderHeader);
nav.appendChild(pixelSlider);

headerText.textContent = "ETCH-A-SKETCH";
header.style = "justify-content: center; align-items: center; justify-items: center; color: white; font-size: clamp(8px, 2vw, 24px);";

let sliderSize = pixelSlider.value;
pixelSliderHeader.textContent = `PIXELS - ${sliderSize}`;

let size = sliderSize;

const debounce = (func, delay=250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay);
  }
}

function resizeGrid(){
  const windowWidth = window.innerWidth;
  sliderSize = pixelSlider.value;
  pixelSliderHeader.textContent = `PIXELS - ${sliderSize}`;

  if(windowWidth <= 750){
    const reduction = Math.ceil((750-window.innerWidth) / 4);
    const newSize = sliderSize - reduction;

    if(sliderSize < 87){
      size = sliderSize;
    }
    else{
      size = Math.max(85, newSize);
    }
  }
  else{
    size = sliderSize;
  }
  console.log(`size = ${size}`);
  createGrid();
}

function createGrid(){
  sketchContainer.innerHTML = '';

  // Think of it like the kitchen where things are prepped before bringing to table. 
  const fragment = document.createDocumentFragment();

  for(let i = 0; i<(size*size); i++){
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.style = `width: ${(1/size) * 100}%; box-sizing: border-box;`;
    fragment.appendChild(pixel);
  }
  sketchContainer.appendChild(fragment); 
}

resizeGrid();

window.addEventListener('resize', debounce(resizeGrid));
pixelSlider.addEventListener("input", debounce(resizeGrid));

const pixels = [...sketchContainer.children];

function colorPixel(e) {
  if(e.target.classList.contains('pixel')){
    e.target.style.backgroundColor = 'red';
  }
}

function erasePixel(e) {
  if(e.target.classList.contains('pixel')){
    e.target.style.backgroundColor = 'white';
  }
}

let isMouseDown = false;
let isMouseDownInContainer = false;
let eraserActive = false;

sketchContainer.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  colorPixel(e);

  console.log(`isMouseDown = ${isMouseDown}`);
});

sketchContainer.addEventListener("mouseover", (e) => {
  isMouseDownInContainer = true;
  if(isMouseDown && isMouseDownInContainer && eraserActive){
    erasePixel(e);
  }
  if(isMouseDown && isMouseDownInContainer && !eraserActive){
    colorPixel(e);
  }
});

window.addEventListener("mouseup", () => {
  isMouseDown = false;
  if(eraserActive === true){
    eraserActive = false;
  }
  console.log(`isMouseDown = ${isMouseDown}`);
});

// Choosing to use mouseleave instead of mouseout so interaction with child elements is negligible
sketchContainer.addEventListener("mouseleave", () => {
  isMouseDownInContainer = false;

  console.log(`isMouseDown = ${isMouseDown}`);
});

sketchContainer.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  eraserActive = true;
  sole.log(`eraserActive: ${eraserActive}`);
});