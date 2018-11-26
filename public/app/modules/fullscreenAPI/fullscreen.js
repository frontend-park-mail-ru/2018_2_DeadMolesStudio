// Find the right method, call on correct element
export default function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

export function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

// function dumpFullscreen() {
//     console.log("document.fullscreenElement is: ", document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
//     console.log("document.fullscreenEnabled is: ", document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled);
// }
//
// // Events
// document.addEventListener("fullscreenchange", function(e) {
//     console.log("fullscreenchange event! ", e);
// });
// document.addEventListener("mozfullscreenchange", function(e) {
//     console.log("mozfullscreenchange event! ", e);
// });
// document.addEventListener("webkitfullscreenchange", function(e) {
//     console.log("webkitfullscreenchange event! ", e);
// });
// document.addEventListener("msfullscreenchange", function(e) {
//     console.log("msfullscreenchange event! ", e);
// });