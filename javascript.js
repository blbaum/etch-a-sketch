const nav = document.querySelector(".nav");
const header = document.querySelector(".nav .header");
const headerText = document.querySelector(".nav .header p");
const sketchContainer = document.querySelector(".sketch-container");
const pixelSliderHeader = document.createElement("p");
const pixelSlider = document.createElement("input");
const colorPickerHeader = document.createElement("p");
const colorPicker = document.createElement("input");
const opacitySliderHeader = document.createElement("p");
const opacitySlider = document.createElement("input");
const instructions = document.createElement("p");
const clearSketchButton = document.createElement("button");

// add elements to classlist
headerText.classList.add("headerText");
pixelSliderHeader.classList.add("pixelSliderHeader");
pixelSlider.classList.add("pixelSlider");
colorPickerHeader.classList.add("colorPickerHeader");
colorPicker.classList.add("colorPicker");
opacitySliderHeader.classList.add("opacitySliderHeader");
opacitySlider.classList.add("opacitySlider");
instructions.classList.add("instructions");
clearSketchButton.classList.add("clearSketchButton");

// add elements to nav
nav.appendChild(pixelSliderHeader);
nav.appendChild(pixelSlider);
nav.appendChild(colorPickerHeader);
nav.appendChild(colorPicker);
nav.appendChild(opacitySliderHeader);
nav.appendChild(opacitySlider);
nav.appendChild(instructions);
nav.appendChild(clearSketchButton);

// set up color picker
colorPicker.type = "color";
colorPicker.value = "#226F54"
colorPickerHeader.textContent = `PIXEL COLOR [${colorPicker.value}]`

// set up pixel slider
pixelSlider.type = "range";
pixelSlider.min = "16";
pixelSlider.max = "100";
pixelSlider.value = pixelSlider.min;
pixelSliderHeader.textContent = `PIXELS [${pixelSlider.value}]`;

// set up opacity slider
opacitySlider.type = "range";
opacitySlider.min = "1";
opacitySlider.max = "15";
opacitySlider.value = opacitySlider.max;
opacitySliderHeader.textContent = `OPACITY [${opacitySlider.value}]`;

// set up refresh button
clearSketchButton.textContent = `CLEAR SKETCH`;

// set up instructions
instructions.textContent = `Experiment with blending colors. Right click to erase.`

headerText.textContent = "ETCH-A-SKETCH";
header.style = "justify-content: center; align-items: center; justify-items: center; color: white; font-size: clamp(8px, 2vw, 24px);";

// Initialize global variables
let size = pixelSlider.value;
let gridData = [];

const debounce = (func, delay=400) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay);
  }
}

const debouncedResize = debounce(resizeGrid);

function windowResize(){
  const windowWidth = window.innerWidth;
  if(windowWidth < 750 && size ){
    pixelSlider.value = 87;
  }
  pixelSliderHeader.textContent = `PIXELS [${pixelSlider.value}]`;
  debouncedResize(gridData, size, pixelSlider.value);
}

function resizeGrid(oldData, oldSize, newSize){
  
  const newData = resizeNearestNeighbor(oldData, oldSize, newSize);

  gridData = newData;
  size = newSize;

  createGrid();
}

function createGrid(){
  sketchContainer.innerHTML = '';
  // Think of it like the kitchen where things are prepped before bringing to table. 
  const fragment = document.createDocumentFragment();

  for(let y = 0; y < size; y++){
    for(let x = 0; x < size; x++){
      const pixel = document.createElement("div");
      pixel.classList.add("pixel");

      pixel.dataset.y = y;
      pixel.dataset.x = x;
      pixel.dataset.z = '00';

      pixel.style = `width: ${(1/size) * 100}%; box-sizing: border-box;`;
      pixel.style.backgroundColor = gridData[y][x];
      fragment.appendChild(pixel);
    }
  }
  sketchContainer.appendChild(fragment); 
}

function createInitialGrid(size){
  gridSize = size;
  gridData = [];

  for(let y = 0; y < gridSize; y++){
    gridData[y] = [];
    for(let x = 0; x < gridSize; x++){
      gridData[y][x] = `#FFFFFF`;
    }
  }
}

function resizeNearestNeighbor(oldGrid, oldSize, newSize){
  console.log(`oldSize: ${oldSize}`);
  console.log(`newSize: ${newSize}`);
  const newGrid = [];
  const ratio = oldSize / newSize;

  for(let newY = 0; newY < newSize; newY++){
    newGrid[newY] = [];
    for(let newX = 0; newX < newSize; newX++){
      const oldX = Math.floor(newX * ratio);
      const oldY = Math.floor(newY * ratio);
      console.log(`oldGrid[oldY][oldX] ${oldGrid[oldY][oldX]}`);

      if(oldGrid[oldY] && oldGrid[oldY][oldX] !== undefined){
        newGrid[newY][newX] = oldGrid[oldY][oldX];
      }
      else{
        newGrid[newY][newX] = `#FFFFFF`;
      }
    }
  }
  return newGrid;
}

function main(){
  createInitialGrid(size);
  createGrid();
}

main();

// window.addEventListener('resize', debounce(resizeGrid));

function increaseOpacity(e){
  const currentOpacity = e.target.dataset.z;
  let intValue = parseInt(currentOpacity, 16);
  intValue = intValue + (opacitySlider.value * 17);
  if(intValue >= 255){
    return 'FF';
  }
  e.target.dataset.z = intValue.toString(16);
  return e.target.dataset.z;
}

function blendColors(e){
  let currentPixelColor = gridData[e.target.dataset.y][e.target.dataset.x].slice(1,7);
  let colorSelected = colorPicker.value.slice(1);

  console.log(`currentPixelColor = ${currentPixelColor}`);
  console.log(`colorSelected = ${colorSelected}`);

  if(currentPixelColor === 'FFFFFF'){
    return colorPicker.value;
  }

  const rInt = Math.floor((parseInt(currentPixelColor.slice(0, 2),16) + parseInt(colorSelected.slice(0,2),16)) / 2);
  const gInt = Math.floor((parseInt(currentPixelColor.slice(2, 4),16) + parseInt(colorSelected.slice(2,4),16)) / 2);
  const bInt = Math.floor((parseInt(currentPixelColor.slice(4),16) + parseInt(colorSelected.slice(4),16)) / 2);

  console.log(`rInt = ${rInt}`);
  console.log(`gInt = ${gInt}`);
  console.log(`bInt = ${bInt}`);

  const rHex = rInt <= 15 ? '0'+rInt.toString(16) : rInt.toString(16);
  const gHex = gInt <= 15 ? '0'+gInt.toString(16) : gInt.toString(16);
  const bHex = bInt <= 15 ? '0'+bInt.toString(16) : bInt.toString(16);


  const blendedColor = `#${rHex+gHex+bHex}`;
  console.log(`blendedColor = ${blendedColor}`);
  return blendedColor;
}

pixelSlider.addEventListener("input", (event) =>{
  pixelSliderHeader.textContent = `PIXELS [${pixelSlider.value}]`;

  debouncedResize(gridData, size, event.target.value);
});

colorPicker.addEventListener('input', () => {
  colorPickerHeader.textContent = `PIXEL COLOR [${colorPicker.value}]`
});

opacitySlider.addEventListener('input', () => {
  opacitySliderHeader.textContent = `OPACITY [${opacitySlider.value}]`;
});

clearSketchButton.addEventListener('click', () =>{
  console.log("clearSketchButton clicked");
  createInitialGrid(size);
  createGrid();
});

window.addEventListener("resize", windowResize);

// --------------
// MOUSE CLICK LOGIC BELOW
// --------------

// Initialize variables for event listener logic
let isMouseDown = false;
let eraserActive = false;
let isMouseDownInContainer = false;

function colorPixel(e) {
  console.log(`z value: ${e.target.dataset.z}`)
  if(e.target.classList.contains('pixel')){
    increasedOpacity = increaseOpacity(e);
    blendedColors = blendColors(e);
    gridData[e.target.dataset.y][e.target.dataset.x] = blendedColors + increasedOpacity;
    e.target.style.backgroundColor = blendedColors + increasedOpacity;
  }
}

function erasePixel(e) {
  if(e.target.classList.contains('pixel')){
    e.target.style.backgroundColor= '#FFFFFF';
  }
}

sketchContainer.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

sketchContainer.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  if(e.button === 2){
    e.preventDefault();
    eraserActive = true;
    erasePixel(e);

    return;
  }

  if(e.button === 0){
    colorPixel(e);
  }
});

sketchContainer.addEventListener("mouseover", (e) => {
  isMouseDownInContainer = true;
  if(isMouseDown && isMouseDownInContainer && eraserActive){
    erasePixel(e);
    return;
  }
  if(isMouseDown && isMouseDownInContainer && !eraserActive){
    colorPixel(e);
  }
});

window.addEventListener("mouseup", () => {
  isMouseDown = false;
  eraserActive = false;
});

// Choosing to use mouseleave instead of mouseout so interaction with child elements is negligible
sketchContainer.addEventListener("mouseleave", () => {
  isMouseDownInContainer = false;
  console.log(`isMouseDown = ${isMouseDown}`);
});