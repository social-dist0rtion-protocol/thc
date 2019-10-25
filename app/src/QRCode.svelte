<script>
  import {onMount} from "svelte";
  import Overlay from "./Overlay.svelte";
  import jsQR from "jsqr";
  export let onValue, onClose;

  let canvas;
  let state;
  let canvasElement;

  onMount(() => {
    // Use facingMode: environment to attemt to get the front camera on phones
    canvas = canvasElement && canvasElement.getContext("2d");
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      .then(function(stream) {
        video.srcObject = stream;
        // required to tell iOS safari we don't want fullscreen
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
      });

  });
  let video = document.createElement("video");
  let videoWidth = 100;
  let videoHeight = 100;
  let ratio = 1;
  let closed = false;

  function tick(timestamp) {
    state = "⌛ Loading video...";
    if (closed) {
      return;
    }
    console.log("looping", video.readyState);
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
    console.log("enough data", video.readyState);
      //videoWidth = video.videoWidth;
      //videoHeight = video.videoHeight;
      ratio = video.videoWidth / video.videoHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });
      if (code) {
        close();
        onValue(code.data);
        return;
      }
    }
    requestAnimationFrame(tick);
  }

  function close() {
    closed = true;
    video.srcObject.getVideoTracks()[0].stop();
    onClose();
  }
</script>

<style>
  div {
    width: 100%;
    height: 0;
    position: relative;
  }
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  button {
    position: fixed;
    bottom: var(--size-m);
  }
</style>

<Overlay>
  <div style="padding-top: {100 / ratio}%">
    <canvas bind:this={canvasElement} />
  </div>
  <button on:click={close}>Close</button>
</Overlay>
