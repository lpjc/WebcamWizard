// the link to your model provided by Teachable Machine export panel
// https://teachablemachine.withgoogle.com/
const URL = "https://teachablemachine.withgoogle.com/models/y05iXxPeY/";  //YOU NEED TO REPLACE THIS LINK

let model, webcam;

// index of elements:
// 0: none
// 1: fire
// 2: water
// 3: earth

let elements = [ 
    {
        name: "fire",
        image: "url('fire.gif')",
        color: "maroon"
    },
    {
        name: "water",
        image: "url('water.gif')",
        color: "navy"
    },
    {
        name: "earth",
        image: "url('earth.gif')",
        color: "burlywood"
    },
    {
        name: "none",
        image: "none",
        color: "grey"
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
/*
let spellQue=[];
let isKept;

function addToQue(inputSpell){
    !isKept;
    spellQue.push(inputSpell);
}
*/

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

var spellTimer;
var isTimerOn = false;
var currentElement;

function startSpellTimer(i) {
    if(!isTimerOn){
        console.log("enteres starttimer for " + elements[i].name);
        isTimerOn = true
        spellTimer = setTimeout(function(){ 
            console.log(elements[i].name +" is held for 3 secs!");
            isTimerOn = false;    
        }, 3000);
    } 
  }

// run the webcam image through the ML model
async function predict() {
    
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    // make sure prediction match elements, as they use same index in the loop
    for (let i = 0; i < prediction.length; i++) {  

        if (prediction[i].probability > 0.95) {

            document.body.style.backgroundImage = elements[i].image;
            document.body.style.backgroundColor = elements[i].color;
            if(elements[i].name === "none"){
                clearTimeout(spellTimer)
                console.log("cleared timer");
                continue; 
            }
            if (currentElement != elements[i]){
                clearTimeout(spellTimer)
                isTimerOn = false; 
                console.log("cleared timer");
            }
            currentElement = elements[i]
            startSpellTimer(i);
        }
    }
}