// ____________::: WEBCAM WIZARD :::____________
// 
// Webcam wizard: Make signs with your hands to create elements. Combine elements to create something even cooler!
// ©lacl@itu.dk may/2021
// Prediction & recognizion built upon example from moja@itu.dk: teachablemachines example
//

// __________ :: INITIALIZE ::  _____________

const URL = "https://teachablemachine.withgoogle.com/models/y05iXxPeY/";  //my model

let model, webcam;
var spellTimer;
var isTimerOn = false;
var currentElement;
var img1 
let spellQueue = [];
let hasMadeCombo = false;
let t2Hold = 1300 //time to hold in millisecs

    // index of elements
    // 0: fire
    // 1: water
    // 2: earth
    // 3: none
let elements = [ 
  
    {
        name: "fire",
        image: "./images/fire.gif",
        imageURL: "url('./images/fire.gif')",
        color: "maroon",
        hue: "1"
    },
    {
        name: "water",
        image: "./images/water.gif",
        imageURL: "url('./images/water.gif')",
        color: "navy",
        hue: "210"
    },
    {
        name: "earth",
        image: "./images/earth.gif",
        imageURL: "url('./images/earth.gif')",
        color: "burlywood",
        hue: "82"
    },
    {
        name: "none",
        image: "",
        imageURL: "",
        color: "lightgrey"
    }

]
    //index of combo
    // 0: steam
    // 1: lava
    // 2: wave
    // 3 coffee
let combinations = [
    // for new combinations:
    // colorpicker https://hslpicker.com/#9a0404 
    // find stickers(gifpngs) at giphy.com
    {
        name: "steam",
        combo: "fire,water,fire",
        image: "./images/steam.gif",
        imageURL: "url('./images/steam.gif')",
        color:"white",
        hue: "221", light: "65", sat:"21", 
        text: "./pngNames/steamText.png"
    },
    {
        name: "lava",
        combo: "earth,fire,earth",
        image: "./images/lava.gif",
        imageURL: "url('./images/lava.gif')",
        color: "red",
        hue: "360", light: "31", sat:"95", 
        text: "./pngNames/lavaText.png" 
    },
    {
        name: "snow",
        combo: "earth,water,water",
        image: "./images/snow.gif",
        imageURL: "url('./images/snow.gif')",
        color: "blue",
        hue: "178", light: "68", sat:"25", 
        text: "./pngNames/snowText.png"
    },
    {
        name: "wave",
        combo: "water,water,water",
        image: "./images/wave.gif",
        imageURL: "url('./images/wave.gif')",
        color: "blue",
        hue: "224", light: "31", sat:"95", 
        text: "./pngNames/waveText.png" 
    },
    {
        name: "coffee",
        combo: "water,earth,fire",
        image: "./images/coffee.gif",
        imageURL: "url('./images/coffee.gif')",
        color: "brown",
        hue: "29", light: "28", sat:"71", 
        text: "./pngNames/coffeeText.png" 
    }
]

async function start() {

    // load the model and metadata
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";              
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup a webcam
    webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append video element (remove/comment line if you do not want the video shown)
    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

// ______________ :: MAIN LOOP :: ______________

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    // console.log("in main loop");
    if (spellQueue.length == 3){
        resolveQueue();
    }

    window.requestAnimationFrame(loop);
}

// _______________ :: PREDICTION LOOP :: __________________

// run the webcam image through the ML moodel with
async function predict() {

    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < prediction.length; i++) {  
        
        if(hasMadeCombo){ 
            continue;
        }

        if (prediction[i].probability > 0.95) {

            if(currentElement == elements[i]){
                continue; 
            } else { // When new element is used

                onePixelDo(true,elements[i].hue,50,50);
                document.getElementById("element1").src = elements[i].image;
                document.getElementById("element2").src = elements[i].image;
                document.getElementById("name").src = "";
                
                if(elements[i].name === "none"){ // If new element is none
                    clearTimer()
                    currentElement = elements[i]
                    continue; 
                }
                clearTimer()
                currentElement = elements[i]
                startSpellTimer(i);
            }
        }
    }
}

// ______________ :: FUNCTIONS :: _______________

function resolveQueue(){
    console.log(spellQueue +" is spellqueue");
    for (let i = 0; i < combinations.length; i++) {
        let combo = combinations[i];
        if (spellQueue == combo.combo){
            document.getElementById("element1").src = combo.image;
            document.getElementById("element2").src = combo.image;
            document.getElementById("name").src = combo.text;
            onePixelDo(true, combo.hue, combo.sat, combo.light)
            hasMadeCombo = true;
            setTimeout(() => {hasMadeCombo = false}, 3000);
          //  setTimeout(() => {alert("You have created " + combo.name + "!")}, 600);
        }
    }
    clearCirlces()
}

function clearCirlces(){
    for (let i = 0; i < spellQueue.length; i++) {
        document.getElementById("que"+(i+1)).style.backgroundColor = "grey" //hardcoded color for now
    }
    spellQueue = [] 
}

function startSpellTimer(i) {
    if(!isTimerOn){
        console.log("enteres starttimer for " + elements[i].name);
        isTimerOn = true
        spellTimer = setTimeout(function(){ 
            isHeld(i);
            isTimerOn = false;    
        }, t2Hold);
    } 
}

function clearTimer(){
    if (isTimerOn){
        clearTimeout(spellTimer);
        console.log("cleared timer");
        isTimerOn = false;
    }
}

function isHeld(i){
    console.log(elements[i].name +" is held for "+(t2Hold/1000)+" secs!");
    var queueIndex = spellQueue.push(elements[i].name) //pushes the namestring to array and returns the spot in the array + 1 
    console.log(queueIndex);
    if(queueIndex <= 3){
        setCircleColor(queueIndex,i)
    }
}

function setCircleColor(queIndex, eleIndex){
    document.getElementById("que"+(queIndex)).style.backgroundColor = elements[eleIndex].color;
}




