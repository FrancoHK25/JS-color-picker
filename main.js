//==FUNCTIONS===================================================================

//--Shows or hides the Color Picker component
const toggleColorPicker = () => {
    const { visibility } = colorPicker.style;
    colorPicker.style.visibility = (visibility == "visible" ? "hidden" : "visible");

    //--Save current color to local storage slot
    if (visibility === "visible") {
        addSavedColor();
        //console.log("SAVED", color.value);
    }
}

//--Check for colors stored and set them up;
const setSavedColors = () => {
    for (let i = 0; i < 4; i++) {
        //--transfer what's in the state storage to the local storage
        localStorage.setItem(`color-saved-${i+1}`, savedColorsStorage[i]);
        //--also transfer the state to the saved color component style
        savedColors[i].style.backgroundColor = savedColorsStorage[i];

        localStorage.getItem(`color-saved-${i+1}`)
            ? savedColors[i].classList.remove("empty")
            : savedColors[i].classList.add("empty");
    }
}

//--Add current selected color to saved colors in state
const addSavedColor = () => {
    //--First, check if color is not already saved
    const foundSavedColor = savedColorsStorage.find(savedColor => savedColor == color.value);
    if (foundSavedColor) return;

    //--if there is an empty saved-color components, fill that slot
    for (let i = 0; i < 4; i++) {
        if (savedColorsStorage[i] === "") {
            savedColorsStorage[i] = color.value;
            setSavedColors();
            return;
        }
    }

    //--otherwise, add it at the end and erase the first one
    savedColorsStorage.push(color.value);
    savedColorsStorage.shift();
    setSavedColors();
}

//--Load saved colors to state if exist
const loadSavedColors = () => {
    for (let i = 0; i < 4; i++) {
        const savedColor = localStorage.getItem(`color-saved-${i+1}`);
        if (savedColor) {
            savedColorsStorage[i] = savedColor;
        }
    }
    setSavedColors();
}

//--Applies color state to components
const applyColor = (element) => {
    element.style.backgroundColor = color.value;
}

//--Updates Color state to new value, including hsl and rgb props
//                          type = rgb/hsl
const updateColor = (value, type = "rgb") => {
    let rgbObject = {}, // rgb(0, 0, 0)
        hslObject = {}; // hsl(0, 0, 0)

    //--get rgb and hsl objects
    if (type === "rgb") { //--rgb argument
        rgbObject = colorStringToObject(value, "rgb");
        hslObject = rgbToHsl(rgbObject);
    } else { //--hsl argument
        hslObject = colorStringToObject(value, "hsl");
        rgbObject = hslToRgb(hslObject);
    }

    //--Update State
    color.value = type === "rgb" 
        ? value 
        : `rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`; //rgb format value;

    color.red = rgbObject.r;
    color.green = rgbObject.g;
    color.blue = rgbObject.b;

    color.hue = hslObject.h;
    color.sat = hslObject.s;
    color.lig = hslObject.l;

    //--Update Elements/Components
    applyColor(colorPicked);
    applyColor(currentColor);

    setElementValue(redNumber, color.red);
    setElementValue(greenNumber, color.green);
    setElementValue(blueNumber, color.blue);

    setElementValue(hueSlider, color.hue);
    setElementValue(satSlider, color.sat);
    setElementValue(ligSlider, color.lig);
}

//--Updates element value
const setElementValue = (element, value) => {
    element.value = value;
}

//--Gets rgb object from rgb() function string
const colorStringToObject = (colorString, type = "rgb") => {
    let end = 
    colorString = colorString.slice(4, -1);
    colorString = colorString.split(', ');

    let colorObject;
    if (type === "rgb") {
        colorObject = {
            r: colorString[0],
            g: colorString[1],
            b: colorString[2]  
        } 
    } else {
        colorObject = {
            h: colorString[0],
            s: colorString[1],
            l: colorString[2]  
        } 
    }

    return colorObject;
}

//--Converts rgb object to hsl object
const rgbToHsl = (rgbObject) => {
    let { r, g, b } = rgbObject;
    let hslObject = {};

    //==Script found at 'css-tricks.com'===============
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
    h = 0;
    // Red is max
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
    h = (b - r) / delta + 2;
    // Blue is max
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    //==End of script==================================

    hslObject = {
        h: h,
        s: s,
        l: l
    }

    return hslObject;
}

//--Converts hsl object to rgb object
const hslToRgb = (hslObject) => {
    let { h, s, l } = hslObject;
    let rgbObject = {};

    //==Script found at 'css-tricks.com'===============
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    //==End of script==================================

    rgbObject = {
        r: r,
        g: g,
        b: b
    }

    return rgbObject;
}

//==STATE=================================================================================
const color = {
    value: "rgb(0, 0, 0)", // value in CSS rgb function format

    hue: 0, // min: 0 - max: 360
    sat: 0, // min: 0 - max: 100
    lig: 0, // min: 0 - max: 100

    red: 0, // min: 0 - max: 255
    green: 0, // min: 0 - max: 255
    blue: 0, // min: 0 - max: 255
}

const savedColorsStorage = ["", "", "", ""];

//==DOM SETUP============================================================================

//--ColorPicked--
const colorPicked = document.querySelector(".color-picked");
colorPicked.addEventListener("click", toggleColorPicker);
applyColor(colorPicked);

//--ColorPicker--
const colorPicker = document.querySelector(".color-picker");
//colorPicker.style.visibility = "visible"; //--temporary for testing purposes

//--HSL Section-------------------------------------------

//--Hue--
const hueSlider = document.querySelector("#hue-slider");
setElementValue(hueSlider, color.hue);
hueSlider.addEventListener("input", () => {
    updateColor(
        `hsl(${hueSlider.value}, ${satSlider.value}, ${ligSlider.value})`,
        "hsl"
    );
});

//--Saturation--
const satSlider = document.querySelector("#sat-slider");
setElementValue(satSlider, color.sat);
satSlider.addEventListener("input", () => {
    updateColor(
        `hsl(${hueSlider.value}, ${satSlider.value}, ${ligSlider.value})`,
        "hsl"
    );
});

//--Lightness--
const ligSlider = document.querySelector("#lig-slider");
setElementValue(ligSlider, color.lig);
ligSlider.addEventListener("input", () => {
    updateColor(
        `hsl(${hueSlider.value}, ${satSlider.value}, ${ligSlider.value})`,
        "hsl"
    );
});

//--RGB Section--------------------------------------------

//--Red--
const redNumber = document.querySelector("#red");
setElementValue(redNumber, color.red);
redNumber.addEventListener("input", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`
    );
});

//--Green--
const greenNumber = document.querySelector("#green");
setElementValue(greenNumber, color.green);
greenNumber.addEventListener("input", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`
    );
});

//--Blue--
const blueNumber = document.querySelector("#blue");
setElementValue(blueNumber, color.blue);
blueNumber.addEventListener("input", () => {
    updateColor(
        `rgb(${redNumber.value}, ${greenNumber.value}, ${blueNumber.value})`
    );
});

//--Color Palette Section-----------------------------------

//--Current Color--
const currentColor = document.querySelector("#current-color");
applyColor(currentColor);
currentColor.addEventListener("click", toggleColorPicker);

//--Sample Colors Palette--
const samples = document.querySelectorAll(".sample");
samples.forEach(sample => {
    sample.addEventListener("click", e => {
        updateColor(getComputedStyle(sample).getPropertyValue("background-color"));
    })
});

//--Saved Colors Palette--
const savedColors = document.querySelectorAll(".color-saved");
savedColors.forEach( saved => {
    saved.addEventListener("click", e => {
        updateColor(getComputedStyle(saved).getPropertyValue("background-color"));
    });
});

//localStorage.setItem("color-saved-1", "rgb(255, 0, 0)");
//localStorage.clear();
loadSavedColors();

