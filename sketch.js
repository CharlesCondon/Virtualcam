const { ipcRenderer } = require("electron");

let mic, r, g, b;
let buffer;
let result;
let angle = 0;
let capture;
let scaler = 14;
let prev;
let particles = [];
let temp = [...Array(255).keys()];
let avg;
const letters = ' Ñ1';
const letters2 = " .100$"; 
let charW = 8;
let charH = 12; 


let activeSketch = ringSketch;

function setActiveSketch(sketchIndex) {
    console.log(`[Renderer] Setting active sketch to index: ${sketchIndex}`);

    const sketchButtons = document.querySelectorAll('#controls button');
    
    // Enable all buttons except the newly active one
    sketchButtons.forEach((button, index) => {
        button.disabled = (index + 1 === sketchIndex);
    });
    
    // Update the local sketch immediately
    switch(sketchIndex) {
        case 1:
            activeSketch = inwardSpiralSketch;
            break;
        case 2:
            activeSketch = wavelengthSketch;
            break;
        case 3:
            activeSketch = crossSketch;
            break;
        case 4:
            activeSketch = horizonSketch;
            break;
        case 5:
            activeSketch = verticalSketch;
            break;
        case 6:
            activeSketch = sunSketch;
            break;
        case 7:
            activeSketch = sunSketch2;
            break;
        case 8:
            activeSketch = shellSketch;
            break;
        case 9:
            activeSketch = ringSketch;
            break;
        default:
            activeSketch = inwardSpiralSketch;
    }

    // Update button states
    updateButtonStates(sketchIndex);

    // Send IPC message for the offscreen window
    ipcRenderer.send("sketch-update", sketchIndex);
}

// Add this near the top of your file
const isOffscreen = window.location.search.includes('offscreen');

if (isOffscreen) {
    // Only add this listener in the offscreen window
    ipcRenderer.on("update-sketch", (event, sketchIndex) => {
        console.log(`[Offscreen] Received update-sketch with index: ${sketchIndex}`);
        
        switch(sketchIndex) {
            case 1:
                activeSketch = inwardSpiralSketch;
                break;
            case 2:
                activeSketch = wavelengthSketch;
                break;
            case 3:
                activeSketch = crossSketch;
                break;
            case 4:
                activeSketch = horizonSketch;
                break;
            case 5:
                activeSketch = verticalSketch;
                break;
            case 6:
                activeSketch = sunSketch;
                break;
            case 7:
                activeSketch = sunSketch2;
                break;
            case 8:
                activeSketch = shellSketch;
                break;
            case 9:
                activeSketch = ringSketch;
                break;
            default:
                activeSketch = inwardSpiralSketch;
        }
    });
}

// Commented out as requires clicking on canvas to activate
// function keyPressed() {
//     if (key === '1') {
//         activeSketch = ringSketch;
//     } else if (key === '2') {
//         activeSketch = wavelengthSketch;
//     } else if (key === '3') {
//         activeSketch = crossSketch;
//     }
// }

function updateButtonStates(activeIndex) {
    const buttons = document.querySelectorAll("#controls button");
    buttons.forEach((button, index) => {
        button.disabled = index + 1 === activeIndex;
    });
}

updateButtonStates(1);

// function togglePlay() {
//     mic.start();
// }

function ringSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255);
        g = Math.floor(Math.random()*255);
        b = Math.floor(Math.random()*255);
    }
    
    noFill();
    beginShape();
    push();
    translate(width / 2, height / 2);
    angle += radians(1);
    strokeWeight(weightSlider.value());
    
    for (let i = 0; i < 256; i++) {
        let y = map(i, 0, 256, 0, height);
        
        if (disco.checked) {
            stroke(r, g, b, spectrum[i]);
        } else {
            stroke(spectrum[i], spectrum[i], spectrum[i], spectrum[i]);
        }
        ellipse(0, 0, y, y)
        //rotate(angle/250);
    }
    pop();
    endShape();
}

function wavelengthSketch(spectrum, waveform) {
    beginShape();
    noFill();
    
    strokeWeight(weightSlider.value());
    stroke(255, 255, 255);
    for(let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);
        vertex(x,y);
    }
    endShape();
}

function crossSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    noStroke();
    beginShape();
    push();
    for (let i = 0; i< spectrum.length-350; i++){
        let y = map(i, 0, spectrum.length-350, height/2, 0);
        let y2 = map(i, spectrum.length-350, 0, height, height/2);
        let x = map(i, 0, spectrum.length-350, width/2, 0);
        let x2 = map(i, spectrum.length-350, 0, width, width/2);

        if (disco.checked) {
            fill(r, g, b, (spectrum[i]))
        } else {
            fill(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        rect(0, y, width*2, weightSlider.value() )
        rect(0, y2, width*2, weightSlider.value() )
        rect(x, 0, weightSlider.value(), height*4 )
        rect(x2, 0, weightSlider.value(), height*4 )
    }
    pop();
    endShape();
}

function horizonSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    noStroke();
    push();
    translate(width, height / 2);
    // angle += radians(1);
    // rotate(-angle);
    for (let i = 0; i< spectrum.length-350; i++){
        let y = map(i, 0, spectrum.length-350, 0, -height*1.5);
        let y2 = map(i, spectrum.length-350, 0, height*1.5, 0);

        if (disco.checked) {
            fill(r, g, b, (spectrum[i]))
        } else {
            fill(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        rect(-width, y, width*2, weightSlider.value() )
        rect(-width, y2, width*2, weightSlider.value() )
    }
    pop();
}

function verticalSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    beginShape();
    noStroke();
    push();
    translate(width / 2, height / 2);
    // angle += radians(.25);
    // rotate(angle);
    for (let i = 0; i< spectrum.length-350; i++){
        let x = map(i, 0, spectrum.length-350, 0, -width*1.5);
        let x2 = map(i, spectrum.length-350, 0, width*1.5, 0);

        let h = -height + map(spectrum[i], 0, 255, height, 0);

        if (disco.checked) {
            fill(r, g, b, (spectrum[i]))
        } else {
            fill(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        rect(x, -height*1.5, weightSlider.value(), height*4 )
        rect(x2, -height*1.5, weightSlider.value(), height*4 )
        
    }
    endShape();
    pop();
}

function sunSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*250)
        b = Math.floor(Math.random()*250)
        g = Math.floor(Math.random()*250)
    }
    noFill();
    push();
    translate(width / 2, height / 2);
    angle += radians(1);
    
    strokeWeight(weightSlider.value())
    for (let i = 0; i< spectrum.length-350; i++){
        let y = map(i, 0, spectrum.length-350, 0, -height*1.5);
        let y2 = map(i, spectrum.length-350, 0, height*1.5, 0);

        if (disco.checked) {
            stroke(r, g, b, (spectrum[i]))
        } else {
            stroke(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        triangle(0, -y, -width/2, -height/2, -y, 0)
        triangle(0, y, width/2, height/2, y, 0)
        triangle(0, -y, width/2, -height/2, y, 0)
        triangle(0, y, -width/2, height/2, -y, 0)
        rotate(angle/(speedSlider.value()-750));
    }
    pop();
}

function sunSketch2(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    noFill();
    push();
    translate(width / 2, height / 2);
    angle += radians(1);
    strokeWeight(weightSlider.value())
    for (let i = 0; i< spectrum.length/2-350; i++){
        let y = map(i, 0, spectrum.length-350, 0, -height*1.5);
        let y2 = map(i, spectrum.length-350, 0, height*1.5, 0);

        if (disco.checked) {
            stroke(r, g, b, (spectrum[i]))
        } else {
            stroke(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        triangle(-width, 0, 0, y*2, width, 0)
        triangle(-width, 0, 0, y2*2, width, 0)
        rotate(-angle/(speedSlider.value()-750));
    }
    pop();
}

function shellSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    noFill();
    beginShape();
    push();
    translate(width / 2, height / 2);
    angle += radians(1);
    strokeWeight(weightSlider.value())
    for (let i = 0; i< 256; i++){
        let y = map(i, 0, 256, 0, height);

        if (disco.checked) {
            stroke(r, g, b, (spectrum[i]))
        } else {
            stroke(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        ellipse(0, 0, y, i)
        rotate(angle/(speedSlider.value()-750));
    }
    pop();
    endShape();
}

function inwardSpiralSketch(spectrum, waveform) {
    if (disco.checked) {
        r = Math.floor(Math.random()*255)
        g = Math.floor(Math.random()*255)
        b = Math.floor(Math.random()*255)
    }
    noStroke();
    beginShape();
    push();
    translate(width / 2, height / 2);
    angle += radians(1);
    for (let i = 0; i< spectrum.length-350; i++){
        let y = map(i, 0, spectrum.length-350, height/2, height);
        let y2 = map(i, spectrum.length-350, 0, 0, height/2);
        let x = map(i, 0, spectrum.length-350, width/2, width);
        let x2 = map(i, spectrum.length-350, 0, 0, width/2);

        if (disco.checked) {
            fill(r, g, b, (spectrum[i]))
        } else {
            fill(spectrum[i], spectrum[i], spectrum[i], (spectrum[i]))
        }
        rect(0, y, width, weightSlider.value() )
        rect(0, y2, width, weightSlider.value() )
        rect(x, 0, weightSlider.value(), height )
        rect(x2, 0, weightSlider.value(), height )
        rotate(angle/-(speedSlider.value()-750));
    }
    pop();
    endShape();
}

function dotSketch() {
    prev.loadPixels();
    dotPrev.loadPixels();
    
    // background(255);
    // noFill();
    // stroke(0)
    // let motionDiff;
    // for (let j = 0; j < prev.height-1/scaler; j++) {
    //     for (let i = 0; i < prev.width/scaler; i++) {
    //         const pixelIndex = ((prev.width - i - 1) + (j * prev.width)) * 4;
    //         // const captureIndex = (i*scaler + j*scaler*capture.width) * 4;

    //         // Get current frame colors
    //         const r = prev.pixels[pixelIndex + 0];
    //         const g = prev.pixels[pixelIndex + 1];
    //         const b = prev.pixels[pixelIndex + 2];
    //         let currentBrightness = (r + g + b) / 3;

    //         // Get previous frame colors
    //         let pr = dotPrev.pixels[pixelIndex + 0];
    //         let pg = dotPrev.pixels[pixelIndex + 1];
    //         let pb = dotPrev.pixels[pixelIndex + 2];
    //         let prevBrightness = (pr + pg + pb) / 3;

    //         // Calculate motion by comparing brightness change
    //         let motionDiff = distSqr(r, g, b, pr, pg, pb);
    //         console.log(motionDiff)
	// 		if (motionDiff > 15) {
    //             //fill(currentBrightness)
    //             makeCircles(i*scaler, j*scaler);
    //         } else {
    //             //fill(prevBrightness)
    //         }
    //         // noStroke();
    //         // rect(i * scaler, j * scaler, scaler, scaler);
    //     }
    // }

    // //Update previous frame
    // dotPrev.copy(prev, 0, 0, prev.width, prev.height, 0, 0, dotPrev.width, dotPrev.height);

    // //Draw all particles
    // for (let i = particles.length-1; i > 0; i--) {
    //     let b = particles[i];
    //     drawCircles(b);
    //     moveCircles(b, i);
    // }
}

function noteSketch() {
    capture.loadPixels();
    prev.loadPixels();
    background(0);

    for (let j = 0; j < capture.height/scaler; j++) {
        for (let i = 0; i < capture.width/scaler; i++) {
            const pixelIndex = ((capture.width - i - 1) + (j * capture.width)) * 4;

            let pr = prev.pixels[pixelIndex + 0];
            let pg = prev.pixels[pixelIndex + 1];
            let pb = prev.pixels[pixelIndex + 2];
            let pavg = (pr + pg + pb) / 3;

            const r = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 0];
            const g = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 1];
            const b = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 2];
            avg = (r + g + b) / 3;

            rectMode(CENTER);
            rect((i * scaler), (j * scaler), (avg/scaler));
            fill(255);
            stroke(0);
        }
    }
    prev.copy(capture, 0, 0, capture.width/scaler, capture.height/scaler, 0, 0, prev.width, prev.height);
}

function cubicSketch() {
    capture.loadPixels();
    background(0);

    for (let j = 0; j < capture.height/scaler; j++) {
        for (let i = 0; i < capture.width/scaler; i++) {
            const pixelIndex = ( (capture.width - i - 2) + (j * capture.width)) * 4;

            const r = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 0];
            const g = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 1];
            const b = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 2];
            avg = (r + g + b) / 3;

            rectMode(CENTER);
            circle( (i * scaler), (j * scaler), (avg/scaler));

            stroke(0);
            fill(r, g, b);
        }
    }
}

function makeCircles(x_pos, y_pos){   
    let sz = 3;
    particles.push({
        x: x_pos,
        y: y_pos,
        sz: sz, 
    }) 
}

function moveCircles(b, i) {
    particles.splice(i, 1);
}

function drawCircles(b){
    stroke(255);
    strokeWeight(b.sz);
    point(b.x,b.y);
}

function distSqr(x1, y1, z1, x2, y2, z2) {
    let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
    return d;
}

function spaghettiSketch() {
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!        
        blurSize = blurSlider.value();
        lowThreshold = 0;
        highThreshold = 0;
        
        jsfeat.imgproc.grayscale(capture.pixels, width, height, buffer);
        jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
        jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
        var n = buffer.rows * buffer.cols;
        // uncomment the following lines to invert the image
        // for (var i = 0; i < n; i++) {
        //     buffer.data[i] = 255 - buffer.data[i];
        // }
        result = jsfeatToP5(buffer, result);
        
        image(result, width/2, height/2, capture.width, capture.height);
    }
}

// spaghetti helper function
function jsfeatToP5(src, dst) {
    if (!dst || dst.width != src.cols || dst.height != src.rows) {
        dst = createImage(src.cols, src.rows);
    }
    dst.canvas.willReadFrequently = true;
    var n = src.data.length;
    dst.loadPixels();
    var srcData = src.data;
    var dstData = dst.pixels;
    for (var i = 0, j = 0; i < n; i++) {
        var cur = srcData[i];
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = 255;
    }
    dst.updatePixels();
    return dst;
}

function asciiSketch() {
    capture.loadPixels();
    background(0, 0, 0, -(bgSlider.value()-254));
    //translate(0, 9);
    for (let j = 0; j < capture.height/scaler; j++) {
        for (let i = 0; i < capture.width/scaler; i++) {
            const pixelIndex = ( (capture.width - i - 2) + (j * capture.width)) * 4;

            const r = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 0];
            const g = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 1];
            const b = capture.pixels[(i*scaler + j*scaler*capture.width) * 4 + 2];
            avg = (r + g + b)/3;

            //let lum = col[0] + col[1] + col[2];
            let tone = map(avg, 0, 255, 0, letters2.length-1);
            let letter = letters2.charAt( tone );
            textSize(scaler);
            stroke(0);
            fill(avg*1.5);

            text(letter, i * scaler, j * scaler);
      }
    }
}

// let prevPixels = [];
// function motionSketch() {
//     capture.loadPixels();
//     if (prevPixels.length === 0 && capture.pixels.length > 0) {
//         prevPixels = Array.from(capture.pixels); // Copy initial frame to prevPixels
//     }
//     const currentPixels = capture.pixels;
//     for (let j = 0; j < capture.height/scaler; j++) {
//         for (let i = 0; i < capture.width/scaler; i++) {
//             const pixelIndex = ( (capture.width - i - 2) + (j * capture.width)) * 4;
            
//             const diffR = abs(currentPixels[pixelIndex+0]-prevPixels[pixelIndex+0]);
//             const diffG = abs(currentPixels[pixelIndex+1]-prevPixels[pixelIndex+1]);
//             const diffB = abs(currentPixels[pixelIndex+2]-prevPixels[pixelIndex+2]);
            
//             prevPixels[pixelIndex+0] = currentPixels[pixelIndex+0];
//             prevPixels[pixelIndex+1] = currentPixels[pixelIndex+1];
//             prevPixels[pixelIndex+2] = currentPixels[pixelIndex+2];

//             const avg = (diffR + diffG+ diffB)/3;

//             if (avg < threshSlider.value()) { 
//                 currentPixels[pixelIndex+0] = 255;
//                 currentPixels[pixelIndex+1] = 255;
//                 currentPixels[pixelIndex+2] = 255;
                
//             } else { 
//                 currentPixels[pixelIndex+0] = 0;
//                 currentPixels[pixelIndex+1] = 0;
//                 currentPixels[pixelIndex+2] = 0;
//             }
//         }
//     }
//     capture.updatePixels();
   
//     image(capture, width/2, height/2, capture.width, capture.height);
    
// }

// Add event listeners to your sliders
function setupSliderListeners() {
    const overlay = document.getElementById('overlay');
    const sticky = document.getElementById('sticky');
    const cubic = document.getElementById('cubic');
    const spaghetti = document.getElementById('spaghetti');
    const ascii = document.getElementById('ascii');
    //const motion = document.getElementById('motion');
    const cam = document.getElementById('cam');
    
    const displayModes = [overlay, sticky, cubic, spaghetti, ascii];

    const sketchButtons = document.querySelectorAll('#controls button');

    function updateSliderStates(activeMode) {
        // Get all sliders
        const bgSliderElement = bgSlider.elt;
        const speedSliderElement = speedSlider.elt;
        const weightSliderElement = weightSlider.elt;
        const scalerSliderElement = scalerSlider.elt;
        const blurSliderElement = blurSlider.elt;
        //const threshSliderElement = threshSlider.elt;
        //let toggle;
        // Get all slider containers and their labels
        const bgContainer = document.getElementById('bgCont');
        const speedContainer = document.getElementById('speedCont');
        const weightContainer = document.getElementById('weightCont');
        const scalerContainer = document.getElementById('scalerCont');
        const blurContainer = document.getElementById('blurCont');
        //const threshContainer = document.getElementById('threshCont');

        function updateContainer(container, isEnabled) {
            const label = container.querySelector('p');
            if (label) {
                label.style.opacity = isEnabled ? '1' : '0.15';
            }
            container.querySelector('.styled-slider').disabled = !isEnabled;
        }
        switch(activeMode) {
            case 'overlay':
                updateContainer(bgContainer, true);
                updateContainer(speedContainer, true);
                updateContainer(weightContainer, true);
                updateContainer(scalerContainer, false);
                updateContainer(blurContainer, false);
                //updateContainer(threshContainer, false);
                break;
            case 'sticky':
                updateContainer(bgContainer, false);
                updateContainer(speedContainer, false);
                updateContainer(weightContainer, false);
                updateContainer(scalerContainer, true);
                updateContainer(blurContainer, false);
                //updateContainer(threshContainer, false);
                break;
            case 'cubic':
                updateContainer(bgContainer, false);
                updateContainer(speedContainer, false);
                updateContainer(weightContainer, false);
                updateContainer(scalerContainer, true);
                updateContainer(blurContainer, false);
                //updateContainer(threshContainer, false);
                break;
                
            case 'spaghetti':
                updateContainer(bgContainer, false);
                updateContainer(speedContainer, false);
                updateContainer(weightContainer, false);
                updateContainer(scalerContainer, false);
                updateContainer(blurContainer, true);
                //updateContainer(threshContainer, false);
                break;
            case 'ascii':
                updateContainer(bgContainer, true);
                updateContainer(speedContainer, false);
                updateContainer(weightContainer, false);
                updateContainer(scalerContainer, true);
                updateContainer(blurContainer, false);
                //updateContainer(threshContainer, false);
                break;
            // case 'motion':
            //     updateContainer(bgContainer, false);
            //     updateContainer(speedContainer, false);
            //     updateContainer(weightContainer, false);
            //     updateContainer(scalerContainer, false);
            //     updateContainer(blurContainer, false);
            //     //updateContainer(threshContainer, true);
            //     break;
            default:
                updateContainer(bgContainer, false);
                updateContainer(speedContainer, false);
                updateContainer(weightContainer, false);
                updateContainer(scalerContainer, false);
                updateContainer(blurContainer, false);
                //updateContainer(threshContainer, false);
                break;
        }
        switch(activeMode) {
            case 'overlay':
                // Enable overlay-related sliders
                bgSliderElement.disabled = false;
                speedSliderElement.disabled = false;
                weightSliderElement.disabled = false;
                scalerSliderElement.disabled = true;
                blurSliderElement.disabled = true;
                //threshSliderElement.disabled = true;
                break;
            case 'sticky':
                // Enable only scaler slider for dot mode
                bgSliderElement.disabled = true;
                speedSliderElement.disabled = true;
                weightSliderElement.disabled = true;
                scalerSliderElement.disabled = false;
                blurSliderElement.disabled = true;
                //threshSliderElement.disabled = true;
                break;
            case 'cubic':
                // Enable only scaler slider for sticky/cubic modes
                bgSliderElement.disabled = true;
                speedSliderElement.disabled = true;
                weightSliderElement.disabled = true;
                scalerSliderElement.disabled = false;
                blurSliderElement.disabled = true;
                //threshSliderElement.disabled = true;
                break;
            case 'spaghetti':
                // Enable only blur slider for spaghetti mode
                bgSliderElement.disabled = true;
                speedSliderElement.disabled = true;
                weightSliderElement.disabled = true;
                scalerSliderElement.disabled = true;
                blurSliderElement.disabled = false;
                //threshSliderElement.disabled = true;
                break;
            case 'ascii':
                // Enable only scaler slider for sticky/cubic modes
                bgSliderElement.disabled = false;
                speedSliderElement.disabled = true;
                weightSliderElement.disabled = true;
                scalerSliderElement.disabled = false;
                blurSliderElement.disabled = true;
                //threshSliderElement.disabled = true;
                break;
            // case 'motion':
            //     // Enable only scaler slider for sticky/cubic modes
            //     bgSliderElement.disabled = true;
            //     speedSliderElement.disabled = true;
            //     weightSliderElement.disabled = true;
            //     scalerSliderElement.disabled = true;
            //     blurSliderElement.disabled = true;
            //     //threshSliderElement.disabled = false;
            //     break;
            default:
                // Disable all sliders when no mode is active
                bgSliderElement.disabled = true;
                speedSliderElement.disabled = true;
                weightSliderElement.disabled = true;
                scalerSliderElement.disabled = true;
                blurSliderElement.disabled = true;
                break;
        }
    }

    displayModes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Uncheck all other checkboxes
                displayModes.forEach(otherBox => {
                    if (otherBox !== e.target) {
                        otherBox.checked = false;
                        sendSliderUpdate(otherBox.id, false);
                    }
                });
                // If overlay is being checked, enable buttons except active sketch
                if (e.target.id === 'overlay') {
                    sketchButtons.forEach((button, index) => {
                        button.disabled = (index === 0); // Disable only the first button (Inward Spiral)
                    });
                }
                // If any other mode is being checked, disable all buttons
                if (e.target.id !== 'overlay') {
                    sketchButtons.forEach(button => {
                        button.disabled = true;
                    });
                    cam.checked = false;
                }
                // Send update for the newly checked checkbox
                if (e.target.id === 'ascii') {
                    bgSlider.value(4);
                }
                updateSliderStates(e.target.id);
                sendSliderUpdate(e.target.id, true);
            } else {
                // Don't automatically check overlay when unchecking others
                sendSliderUpdate(e.target.id, false);

                // Check if all toggles are now off
                const anyToggleActive = displayModes.some(toggle => toggle.checked);
                if (!anyToggleActive) {
                    // Disable all buttons and sliders
                    sketchButtons.forEach(button => {
                        button.disabled = true;
                    });
                    updateSliderStates('none');
                }
            }
        });
    });

    bgSlider.input(() => {
        sendSliderUpdate('bg', bgSlider.value());
    });

    weightSlider.input(() => {
        sendSliderUpdate('weight', weightSlider.value());
    });

    speedSlider.input(() => {
        sendSliderUpdate('speed', speedSlider.value());
    });
    
    blurSlider.input(() => {
        sendSliderUpdate('blur', blurSlider.value());
    });

    // threshSlider.input(() => {
    //     sendSliderUpdate('thresh', threshSlider.value());
    // });

    // Add listener for disco checkbox
    disco.addEventListener('change', () => {
        sendSliderUpdate('disco', disco.checked);
    });

    cam.addEventListener('change', () => {
        sendSliderUpdate('cam', cam.checked);
    });


    overlay.addEventListener('change', () => {
        sendSliderUpdate('overlay', overlay.checked);
    });

    scalerSlider.input(() => {
        scaler = scalerSlider.value();  // Update the scaler value        
        // Send update to virtual cam
        sendSliderUpdate('scaler', scaler);
    });
}

// Function to send slider updates
function sendSliderUpdate(type, value) {
    ipcRenderer.send("slider-update", { type, value });
}

// Add this near your other IPC listeners
if (isOffscreen) {
    ipcRenderer.on("update-slider", (event, sliderData) => {
        console.log(`[Offscreen] Received slider update:`, sliderData);
        
        switch(sliderData.type) {
            case 'overlay':
                overlay.checked = sliderData.value;
                break;
            case 'bg':
                bgSlider.value(sliderData.value);
                break;
            case 'weight':
                weightSlider.value(sliderData.value);
                break;
            case 'speed':
                speedSlider.value(sliderData.value);
                break;
            case 'blur':
                blurSlider.value(sliderData.value);
                break;
            case 'disco':
                disco.checked = sliderData.value;
                break;
            case 'cam':
                cam.checked = sliderData.value;
                break;
            case 'sticky':
                sticky.checked = sliderData.value;
                prev = createImage(capture.width/scaler, capture.height/scaler);
                prev.canvas.willReadFrequently = true;
                if (sliderData.value) {
                    overlay.checked = false;
                    cubic.checked = false;
                    spaghetti.checked = false;
                    ascii.checked = false;
                    cam.checked = false;
                    //thresh.checked = false;
                }
                break;
            case 'cubic':
                cubic.checked = sliderData.value;
                prev = createImage(capture.width/scaler, capture.height/scaler);
                prev.canvas.willReadFrequently = true;
                if (sliderData.value) {
                    overlay.checked = false;
                    sticky.checked = false;
                    spaghetti.checked = false;
                    ascii.checked = false;
                    cam.checked = false;
                    //thresh.checked = false;
                }
                break;
            case 'spaghetti':
                spaghetti.checked = sliderData.value;
                if (sliderData.value) {
                    overlay.checked = false;
                    sticky.checked = false;
                    cubic.checked = false;
                    ascii.checked = false;
                    cam.checked = false;
                    //thresh.checked = false;
                }
                break;
            case 'ascii':
                ascii.checked = sliderData.value;
                if (sliderData.value) {
                    overlay.checked = false;
                    sticky.checked = false;
                    cubic.checked = false;
                    spaghetti.checked = false;
                    cam.checked = false;
                    //thresh.checked = false;
                }
                break;
            // case 'thresh':
            //     thresh.checked = sliderData.value;
            //     if (sliderData.value) {
            //         overlay.checked = false;
            //         sticky.checked = false;
            //         cubic.checked = false;
            //         spaghetti.checked = false;
            //         ascii.checked = false;
            //         cam.checked = false;
            //     }
            //     break;
            case 'scaler':
                scaler = sliderData.value;
                // Recreate preview images with new scale
                prev = createImage(capture.width/scaler, capture.height/scaler);
                prev.canvas.willReadFrequently = true;
                break;
        }
    });
}

function setup() {
    // Create canvas with willReadFrequently attribute
    const cnv = createCanvas(1280, 720, {
        willReadFrequently: true
    });
    
    // Set specific dimensions for the capture
    capture = createCapture({
        video: {
            width: 1280,
            height: 720,
            facingMode: "user",
            frameRate: 30,
            advanced: [{
                width: { min: 1280, ideal: 1920, max: 1920 },
                height: { min: 720, ideal: 1080, max: 1080 },
                aspectRatio: 1.777777778,
                resizeMode: 'crop-and-scale'
            }]
        }
    });
    capture.willReadFrequently = true;
    // Create prev image with smaller dimensions
    prev = createImage(capture.width/parseInt(scaler), capture.height/parseInt(scaler));
    prev.canvas.willReadFrequently = true;
    dotPrev = createImage(prev.width, prev.height);
    dotPrev.canvas.willReadFrequently = true;
    
    capture.hide();

    buffer = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
    
    //cnv.parent("visuals");
    //cnv.mousePressed(togglePlay);

    mic = new p5.AudioIn();
    fft = new p5.FFT();
    fft.setInput(mic);

    mic.start();

    bgSlider = createSlider(1, 255, 252, 4);
    bgSlider.parent("bgCont");
    bgSlider.class('styled-slider');

    weightSlider = createSlider(2, 10, 2, 1);
    weightSlider.parent("weightCont");
    weightSlider.class('styled-slider');

    speedSlider = createSlider(50, 700, 700, 50);
    speedSlider.parent("speedCont");
    speedSlider.class('styled-slider');

    scalerSlider = createSlider(5, 20, 14, 1);
    scalerSlider.parent("scalerCont");
    scalerSlider.class('styled-slider');
    scalerSlider.elt.disabled = true;

    blurSlider = createSlider(0, 48, 12, 1);
    blurSlider.parent("blurCont");
    blurSlider.class('styled-slider');
    blurSlider.elt.disabled = true;

    // threshSlider = createSlider(0, 255, 100, 1);
    // threshSlider.parent("threshCont");
    // threshSlider.class('styled-slider');
    // threshSlider.elt.disabled = true;

    let overlay = document.getElementById("overlay");
    let disco = document.getElementById("disco");
    let cam = document.getElementById("cam");
    let sticky = document.getElementById("sticky");
    let cubic = document.getElementById("cubic");
    let spaghetti = document.getElementById("spaghetti");
    let ascii = document.getElementById("ascii");
    // let motion = document.getElementById("motion");

    setActiveSketch(1);

    // Only set up listeners in the visible window
    if (!isOffscreen) {
        setupSliderListeners();
    }

}

function draw() {
    if (cam.checked) {
        // Calculate 20% zoom
        const zoomScale = 1;  // 1.0 is normal, 1.2 is 20% zoom
        const scaledWidth = width * zoomScale;
        const scaledHeight = height * zoomScale;
        
        // Center the zoomed image
        imageMode(CENTER);
        push();
        translate(width/2, height/2);
        
        // Draw the zoomed camera feed
        image(capture, 
            0, 0,                    // x, y position (centered)
            scaledWidth, scaledHeight,  // destination width/height (zoomed)
            0, 0,                    // source x, y
            capture.width, capture.height  // source width/height
        );
        pop();
    }

    // Handle different sketch modes
    if (sticky.checked) {
        noteSketch();
    } else if (cubic.checked) {
        cubicSketch();
    } else if (spaghetti.checked) {
        spaghettiSketch();
    } else if (ascii.checked) {
        asciiSketch();
    // } else if (motion.checked) {
    //     motionSketch();
    } else if (overlay.checked) {
        background(0, 0, 0, -(bgSlider.value()-254));

        let spectrum = fft.analyze();
        let waveform = fft.waveform();

        if (activeSketch) {
            activeSketch(spectrum, waveform);
        }
    }
}