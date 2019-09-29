let { coordsToDirection, Points, Direction, HandsPosition } = require("./src/coordsToDirection")
let io = require("socket.io-client")

const socket = io('http://localhost:3000');

socket.on('connect', function() {
  console.log("Socket Connected")
})

const loader = document.getElementById("main-loader");
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {


        if (predictions.length == 2) {
            const leftHand = new Points(predictions[0].bbox[0], predictions[0].bbox[1])
            const rightHand = new Points(predictions[1].bbox[0], predictions[1].bbox[1])
            let handPosition = new HandsPosition(leftHand, rightHand)
            const output = coordsToDirection(handPosition)

            console.log("OUTPUT", output)

            if (output) socket.emit('transfer', output)
        }
    

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    loader.style.display = "none"
    console.info("Model loaded!")
    trackButton.disabled = false
});


