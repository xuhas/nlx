let Mic = require('node-microphone');
let pump = require('pump')
let Transform = require("stream").Transform
// Imports the Dialogflow library
const dialogflow = require('dialogflow');
let credentials = require("./implementai_creds.json");


let state = false;
const projectId = "implementai-gyhdvg";
const sessionId = "1234"
// Instantiates a session client
const sessionClient = new dialogflow.v2.SessionsClient({
    credentials: {
        private_key: credentials.private_key,
        client_email: credentials.client_email
    }
});
// The encoding of the audio file, e.g. 'AUDIO_ENCODING_LINEAR_16'
const encoding = 'AUDIO_ENCODING_LINEAR_16';
// The sample rate of the audio file in hertz, e.g. 16000
const sampleRateHertz = 16000;
// The BCP-47 language code to use, e.g. 'en-US'
const languageCode = 'en-US';
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
let mic = new Mic();
let micStream = mic.startRecording();

const initialStreamRequest = {
    session: sessionPath,
    queryParams: {
        session: sessionPath,
    },
    queryInput: {
        audioConfig: {
            audioEncoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        },
        singleUtterance: true,
    },
};

async function GetTextInput(socket) {
    setMicEvents(mic);
    setMicStreamEvents(micStream);

    // Create a stream for the streaming request.
    let detectStream = createSession(sessionClient);
    setDetectStreamEvents(detectStream, socket);

    detectStream.on('end', data => {
        console.log('end event');
    });
    // Write the initial stream request to config for audio input.
    detectStream.write(initialStreamRequest);
    // Stream an audio file from disk to the Conversation API, e.g.
    // "./resources/audio.raw"
    activatePump(micStream, detectStream);
}

function setMicStreamEvents(micStream) {
    micStream.on('data', (info) => {
        // console.log(info);
        // console.log('there is input.');
    });
    micStream.on('end', (info) => {
        // console.log(info);
        console.log('end.');
        // micStream = mic.startRecording();
    });
}

function setMicEvents(mic) {
    mic.on('info', (info) => {
        // console.log("info");
        // console.log(info);
    });

    mic.on('error', (error) => {
        console.log('error');
        console.log(error);
    });
}

function setDetectStreamEvents(detectStream, socket) {
    detectStream.on('error', console.error);
    detectStream.on('data', data => {
        if (data.recognitionResult) {
            if (data.recognitionResult.isFinal) {
                mic.stopRecording();
                micStream = mic.startRecording();
                GetTextInput(socket);
            }
        }
        if (data.queryResult) {
            if (data && data.queryResult && data.queryResult.intent) {
                let intent = data.queryResult.intent.displayName;

                if (intent) {
                    console.log("Detected Intent : ", intent);
                    // emit websocket eventif 
                    socket.emit('transfer', intent);
                }
            }
        }
    });
}

function createSession(sessionClient) {
    return sessionClient
        .streamingDetectIntent();
}

async function activatePump(micStream, ds) {
    await pump(
        micStream,
        // Format the audio stream into the request format.
        new Transform({
            objectMode: true,
            transform: (obj, _, next) => {
                next(null, { inputAudio: obj });
            },
        }),
        ds
    );
}
module.exports.GetTextInput = GetTextInput

