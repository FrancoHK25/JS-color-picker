//--FUNCTIONS----------------------------------------------

//--Shows or hides the Color Picker component
const toggleColorPicker = () => {
    const { visibility } = colorPicker.style;
    colorPicker.style.visibility = (visibility == "visible" ? "hidden" : "visible");
}

//--Applies color state to components
const applyColor = (element) => {
    element.style.backgroundColor = color.value;
}

//--Updates Color state to new value, including hsl and rgb props
//                          type = [hex, hsl, rgb]
const updateColor = (value, type = "hex") => {
    let hexValue = "#000000";
    let rgbObject = {};

    switch (type) {
        case "hsl": {
            break;
        }

        case "rgb": {
            break;
        }

        case "hex":
        default: {
            //hexValue = value;

            //--hex to rgb conversion
            rgbObject = rgbStringToObject(value);
            color.red = rgbObject.r;
            color.green = rgbObject.g;
            color.blue = rgbObject.b;

            //console.log(rgbObject);
        }
    }
    color.value = value;//hexValue;

    applyColor(colorPicked);
    applyColor(currentColor);

    setElementValue(redNumber, color.red);
    setElementValue(greenNumber, color.green);
    setElementValue(blueNumber, color.blue);
}

//--Upadtes element value
const setElementValue = (element, value) => {
    element.value = value;
}

const rgbStringToObject = (rgbString) => {
    const end = rgbString.indexOf(')');
    rgbString = rgbString.slice(4, end);
    
    rgbString = rgbString.split(', ')
    const rgbObject = {
        r: rgbString[0],
        g: rgbString[1],
        b: rgbString[2]
    }

    return rgbObject;
}

//--STATE--------------------------------------------------
const color = {
    value: "#000000", // hex value

    hue: 0, // min: 0 - max: 360
    sat: 0, // min: 0 - max: 100
    lig: 0, // min: 0 - max: 100

    red: 0, // min: 0 - max: 255
    green: 0, // min: 0 - max: 255
    blue: 0, // min: 0 - max: 255
}

//--DOM SETUP-----------------------------------------------

//--ColorPicked--
const colorPicked = document.querySelector(".color-picked");
colorPicked.addEventListener("click", toggleColorPicker);
applyColor(colorPicked);

//--ColorPicker--
const colorPicker = document.querySelector(".color-picker");
colorPicker.style.visibility = "visible"; //--temporary for testing purposes

//--HSL Section-------------------------------------------
const hueSlider = document.querySelector("#hue-slider");
setElementValue(hueSlider, color.hue);
const satSlider = document.querySelector("#sat-slider");
setElementValue(satSlider, color.sat);
const ligSlider = document.querySelector("#lig-slider");
setElementValue(ligSlider, color.lig);

//--RGB Section--------------------------------------------
const redNumber = document.querySelector("#red");
setElementValue(redNumber, color.red);
redNumber.addEventListener("change", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`);
});

const greenNumber = document.querySelector("#green");
setElementValue(greenNumber, color.green);
greenNumber.addEventListener("change", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`);
});

const blueNumber = document.querySelector("#blue");
setElementValue(blueNumber, color.blue);
blueNumber.addEventListener("change", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`);
});

//--Color Palette Section-----------------------------------
//--Current Color--
const currentColor = document.querySelector("#current-color");
applyColor(currentColor);
currentColor.addEventListener("click", toggleColorPicker);

//--Color Samples Palette--

const samples = document.querySelectorAll(".sample");
samples.forEach(sample => {
    sample.addEventListener("click", (e) => {
        updateColor(getComputedStyle(sample).getPropertyValue("background-color"));
    })
    
});