let video;
let canvas;
let ctx;
let model;
let faceDetectedSound;
let noFaceDetectedSound;
let previousMessage = '';

async function startWebcam() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Load the BlazeFace model
    model = await blazeface.load();

    // Load sound alerts
    faceDetectedSound = new Audio('https://od.lk/s/NjFfODI2NjgxODdf/Untitled%20video%20-%20Made%20with%20Clipchamp%20%284%29.mp3');
    noFaceDetectedSound = new Audio('https://od.lk/s/NjFfODI2NjgxODRf/Untitled%20video%20-%20Made%20with%20Clipchamp%20%2817%29.mp3');

    // Request access to the webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Display the webcam stream on the video element
    video.srcObject = stream;

    // Wait for the video to start playing to capture frames
    video.onloadedmetadata = () => {
        detectFaces();
    };
}

function stopWebcam() {
    if (video) {
        video.pause();
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

async function detectFaces() {
    // Detect faces
    const predictions = await model.estimateFaces(video);

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display the webcam stream
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Display the detected faces
    if (predictions.length > 0) {
        // Draw red rectangle around the detected face
        const prediction = predictions[0]; // Only consider the first face
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red';
        ctx.rect(prediction.topLeft[0], prediction.topLeft[1], prediction.bottomRight[0] - prediction.topLeft[0], prediction.bottomRight[1] - prediction.topLeft[1]);
        ctx.stroke();

        const message = 'Face detected!';
        if (message !== previousMessage) {
            playSound(faceDetectedSound);
            previousMessage = message;
            document.getElementById('message').innerText = message;
        }
    } else {
        const message = 'No face detected.';
        if (message !== previousMessage) {
            playSound(noFaceDetectedSound);
            previousMessage = message;
            document.getElementById('message').innerText = message;
        }
    }

    // Repeat the process for the next frame
    requestAnimationFrame(detectFaces);
}

function playSound(sound) {
    if (sound) {
        sound.play();
    }
}
