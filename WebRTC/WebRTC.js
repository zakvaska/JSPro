// 1. Create layout with styles - done
// 2. DOM navigation - done
// 3. Access to web camera - done
// 4. Stream data - done
// 5. Record video - done
// 6. Take snapshot - done

let recordedBlobs;
let mediaRecorder;
let buffer;
let recordedVideoURL;

// Get access to button nodes
const startButton = document.getElementById('start');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
const downloadButton = document.getElementById('download');
const snapshotButton = document.getElementById('snapshot');
const startSharingButton = document.getElementById('share');

// Get access to video nodes
const gumVideo = document.getElementById('gum');
const recordedVideo = document.getElementById('recorded');
const sharedVideo = document.getElementById('shared');

// Get access to canvas node
const canvas = document.querySelector('canvas');
const canvasWrapper = document.getElementById('canvas-wrapper');
const filterSelect = document.querySelector('select#filter');

const videoWidth = 1280;
const videoHeight = 720;


// 1. Stream data
const handleSuccess = (stream) => {
    gumVideo.srcObject = stream;
    window.stream = stream;
    recordButton.disabled = false;
    snapshotButton.disabled = false;
}

const handleError = (error) => {
    console.error(`navigator getUserMedia error: ${error}`);
}

const init = (constraints) => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError)
}

startButton.addEventListener('click', () => {
    if(startButton.innerText === 'Start camera') {
        startButton.innerText = 'Stop camera';

        const constraints = {
            audio: true,
            video: {
                width: videoWidth,
                height: videoHeight
            }
        }
        init(constraints);

    } else {
        startButton.innerText = 'Start camera';
        recordButton.disabled = true;
        playButton.disabled = true;
        downloadButton.disabled = true;
        snapshotButton.disabled = true;
        window.stream = null;
        gumVideo.srcObject = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = null;
        recordedVideo.controls = false;
    }
})

// 2. Record video
const handleDataAvailable = (event) => {
    if(event.data && event.data.size > 0) {
       recordedBlobs.push(event.data); 
    }
}

const startRecording = () => {
    recordedBlobs = [];
    const options = { 
        mimeType: 'video/webm;codecs=vp9,opus'
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch(error) {
        handleError(error);
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

const stopRecording = () => {     
    mediaRecorder.stop();
}

recordButton.addEventListener('click', () => {
    if(recordButton.textContent === 'Record') {
        recordButton.textContent = 'Stop recording';
        startRecording();
    } else {
        recordButton.textContent = 'Record';
        playButton.disabled = false;
        downloadButton.disabled = false;
        stopRecording();
    }
})

// 3. Play recorded video
playButton.addEventListener('click', () => {   
    buffer = new Blob(recordedBlobs, {type: 'video/webm'}); 
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideoURL = window.URL.createObjectURL(buffer);
    recordedVideo.src = recordedVideoURL;
    recordedVideo.controls = true;
    recordedVideo.play();
})

// 4. Take snapshot
snapshotButton.addEventListener('click', () => {
    canvas.className = filterSelect.value;        
    const ratio = videoWidth / videoHeight;
    const padding = Number(window.getComputedStyle(gumVideo).paddingTop.replace('px', ''))
    canvas.height = gumVideo.getBoundingClientRect().height - (padding * 2);
    canvas.width = canvas.height * ratio;
    canvas.style.maxWidth = `${canvasWrapper.getBoundingClientRect().width}px`;
    canvas.getContext('2d').drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
})

// 5. Download recorded video
downloadButton.addEventListener('click', () => {    
    const downloadLink = document.createElement('a');    
    document.body.appendChild(downloadLink);
    downloadLink.style.display = 'none';
    downloadLink.href = recordedVideoURL;
    downloadLink.download = 'WebRTCrecordedVideo.webm';
    downloadLink.click();
    window.URL.revokeObjectURL(recordedVideoURL);
})

const handleDisplayMediaError = (error) => {
    console.error(`navigator.mediaDevices.getDisplayMedia error: ${error}`);
}

const handleDisplayMediaSuccess = (stream) => {
    startSharingButton.textContent = 'Stop sharing';
    sharedVideo.srcObject = stream;
    
    stream.getVideoTracks()[0].addEventListener('ended', () => {
        handleDisplayMediaError('The user has ended sharing the screen');
        startSharingButton.textContent = 'Start sharing';
    });
}

if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
    startSharingButton.disabled = false;
} else {
    console.error('getDisplayMedia is not supported');
}
// 6. Share display, window or tab
startSharingButton.addEventListener('click', () => {    
    if (startSharingButton.textContent === 'Start sharing') {
        navigator.mediaDevices.getDisplayMedia({video: true})
            .then(handleDisplayMediaSuccess, handleDisplayMediaError);
    } else {
        startSharingButton.textContent = 'Start sharing';

        const stream = sharedVideo.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(function(track) {
            track.stop();
        });

        sharedVideo.srcObject = null;
    }
})