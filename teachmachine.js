// 
// ©lacl may/2021
//


// ______ INITIALIZE ___________

// https://teachablemachine.withgoogle.com/
const URL = "https://teachablemachine.withgoogle.com/models/y05iXxPeY/";  //my model

let model, webcam;
var spellTimer;
var isTimerOn = false;
var currentElement;
var img1 
let spellQueue = [];
let hasMadeCombo = false;

// index of elements:
// 
// 0: fire
// 1: water
// 2: earth
// 3: none

let elements = [ 
    {
        name: "fire",
        image: "fire.gif",
        imageURL: "url('fire.gif')",
        color: "maroon"
    },
    {
        name: "water",
        image: "water.gif",
        imageURL: "url('water.gif')",
        color: "navy"
    },
    {
        name: "earth",
        image: "earth.gif",
        imageURL: "url('earth.gif')",
        color: "burlywood"
    },
    {
        name: "none",
        image: "",
        imageURL: "",
        color: "grey"
    }

]

//index of combo

let combinations = [
    {
        name: "steam",
        combo: "fire,water,fire",
        image: "steam.gif",
        imageURL: "url('steam.gif')",
        color:"white"
    },
    {
        name: "lava",
        combo: "earth,fire,earth",
        image: "lava.gif",
        imageURL: "url('lava.gif')",
        color: "red"
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

// __________ :: MAIN LOOP :: ________

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    // console.log("in main loop");
    if (spellQueue.length == 3){
        resolveQueue();
    }

    window.requestAnimationFrame(loop);
}

// ______________ :: FUNCTIONS :: _______________

function resolveQueue(){
    console.log(spellQueue +" is spellqueue");

    for (let i = 0; i < combinations.length; i++) {
        if (spellQueue == combinations[i].combo){
            document.body.style.backgroundImage = combinations[i].imageURL;
            document.body.style.backgroundColor = combinations[i].color;
            hasMadeCombo = true;
        }  else {
            hasMadeCombo = false;
        }
    }
    if(!hasMadeCombo){
        clearCirlces();
    }
    
    spellQueue = []
}

function clearCirlces(){
    for (let i = 0; i < spellQueue.length; i++) {
        setCircleColor(i+1,3)
    }
}

function startSpellTimer(i) {
    if(!isTimerOn){
        console.log("enteres starttimer for " + elements[i].name);
        isTimerOn = true
        spellTimer = setTimeout(function(){ 
            isHeld(i);
            isTimerOn = false;    
        }, 2300);
    } 
}

function isHeld(i){
    console.log(elements[i].name +" is held for 3 secs!");
    var queueIndex = spellQueue.push(elements[i].name) //pushes the namestring to array and returns the spot in the array + 1 
    console.log(queueIndex);
    if(queueIndex <= 3){
        setCircleColor(queueIndex,i)
    }
}

function setCircleColor(queIndex, eleIndex){
    document.getElementById("que"+(queIndex)).style.backgroundColor = elements[eleIndex].color;
}

function clearTimer(){
    if (isTimerOn){
        clearTimeout(spellTimer);
        console.log("cleared timer");
        isTimerOn = false;
    }
}


// run the webcam image through the ML model
async function predict() {
    
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    // make sure prediction match elements, as they use same index in the loop
    for (let i = 0; i < prediction.length; i++) {  
        if(hasMadeCombo){
            continue;
        }

        if (prediction[i].probability > 0.95) {

            document.body.style.backgroundImage = elements[i].imageURL;
            document.body.style.backgroundColor = elements[i].color;
           
            // if element is none, clear timer and skip loop iteration
            if(elements[i].name === "none"){ 
                clearTimer()
                continue; 
            }

            // element changed
            if (currentElement != elements[i]){
                clearTimer()
            }

            currentElement = elements[i]
            startSpellTimer(i);
        }
    }
}
