// Trabajo Práctico Final - Tecnologias Hipermediales - Lic. Artes Electrónicas - Untref 2022
// Tomás Lilli

let cnv;
let cont = 0;
let logoHibrydos;
let cantBtns = 11;
let selectCanvas = [];
let widthSpectrumCanvas;
let heightSpectrumCanvas;
let yV1 = 0;
let yV2 = 0;
let xH1 = 0;
let xH2 = 0;
let vel = 0;
let velScroll = 1;
let scrollYV1 = 0;
let scrollYV2 = 0;
let scrollXH1 = 0;
let scrollXH2 = 0;
let track = [] 
let spectrum = []
let canvasSpectrums0;
let canvasSpectrums1;
let canvasSpectrums2;
let canvasSpectrums3;
let cantTrack = 4;
let tamSlider;
let fftBands = 8;
let resolucionFrecuencias = 512 // agregar un selector tipo botonera para elegir resolucion en frecuencia (mult en 0.5, 1, 2, 3, 4)
let tamSpectrum = 2.5;
let tamSpectrumPixel = 1;
let tamFuente;
let gui;
let alhphaGUI = 155;
let slider1 = 0.12;
let slider2 = 1.5;
let fuente;
let canvasMap;
let tamCanvasSonidoX;
let tamCanvasSonidoY;
let tamCanvasAncho;
let xSlider;
let ySlider;

function preload(){
    //fuente = loadFont("../fuentes/CWEBL.TTF");

    for(let i = 0; i < cantTrack; i++){
        track[i] = {
                    sonido: loadSound('tracks/tracksEEH2019-00'+(i+1)+'.mp3'),
                    vol: 0,
                    paneo: 0,
                    reverb: new p5.Reverb(),
                    revDryWet: 0,
                    revTime: 8,
                    revDecay: 50,
                    fft: new p5.FFT(),
                    spectrum: [],
                    colorTrack: []
                }
        track[i].fft.setInput(track[i].sonido)
    }
    
    tamFuente = (windowWidth+windowHeight)/50;
    tamSlider = windowWidth/12;
    widthSpectrumCanvas = windowWidth-(tamSlider*2);
    heightSpectrumCanvas = windowHeight;
    canvasMap = loadImage('img/canvasZonas.jpg')
    for(let k = 0 ;k < cantBtns; k++){
        selectCanvas[k] = {
                            state: false,
                        }
    }
    
    tamCanvasSonidoX = int(370*32);
    tamCanvasSonidoY = int(370*16);
    tamCanvasAncho = int(resolucionFrecuencias*fftBands);

    console.log("tamCanvasSonidoX: "+tamCanvasSonidoX+" / tamCanvasSonidoY: "+tamCanvasSonidoY+" / tamCanvasAncho ;"+tamCanvasAncho);

    canvasSpectrums0 = createGraphics(tamCanvasAncho, tamCanvasSonidoY);
    canvasSpectrums1 = createGraphics(tamCanvasSonidoX, tamCanvasAncho);
    canvasSpectrums2 = createGraphics(tamCanvasAncho, tamCanvasSonidoY);
    canvasSpectrums3 = createGraphics(tamCanvasSonidoX, tamCanvasAncho);

}
  
function setup(){
    cnv = createCanvas(windowWidth,windowHeight);
    background(0);
    //frameRate(40);
    //textFont(fuente);
    xSlider = width-(tamSlider*1.75);
    ySlider = tamSlider/2;

    image(canvasMap,0,0,widthSpectrumCanvas,heightSpectrumCanvas)
    console.log("track[0].sonido.duration: "+track[0].sonido.duration())
    console.log("canvasSpectrums0: "+canvasSpectrums0);
    console.log("canvasSpectrums1: "+canvasSpectrums1);
    
}
  
function draw(){

    tamSpectrum = slider2;//knob2.knobValue;
    fftBands = 8;//int(knob3.knobValue);
    tamSlider = windowWidth/12;
    widthSpectrumCanvas = windowWidth-(tamSlider*2);
    heightSpectrumCanvas = windowHeight;

    if(selectCanvas[6].state === false){vel=0;velScroll=0;}else{vel = slider1;velScroll = slider1;}
    //if(selectCanvas[7].state === true){slider1+=0.01;console.log("Velocidad: "+slider1+" / Tamaño: "+slider2);selectCanvas[7].state = false;}
    if(selectCanvas[5].state === true){background(0);selectCanvas[5].state = false;}
    if(selectCanvas[0].state === true){sVertical();}
    if(selectCanvas[1].state === true){sHorizontal();}
    if(selectCanvas[2].state === true){sVerticalIND();}
    if(selectCanvas[3].state === true){sHorizontalIND();}
    if(selectCanvas[4].state === true){for(let i = 0; i < 4; i++){canvasSpectrums[i].save("canvas"+frameCount+i+".jpg")};selectCanvas[4].state=false;}

    trackMouse();
    console.log("Velocidad: "+slider1+" / Tamaño: "+slider2+" / vel: "+vel+" / velScroll: "+velScroll);
    monitoreoParametros();
}

function monitoreoParametros(){
    textSize(tamFuente/1.5);
    stroke(0);
    fill(255,0,255,alhphaGUI);
    text("velocidad: "+slider1, xSlider, ySlider);
    fill(0,255,0,alhphaGUI);
    text("tamaño: "+slider2, xSlider, ySlider*1.5);
}


function sVertical(){

    noStroke();
    fill(0);
    rect(0,0,tamCanvasAncho,tamCanvasSonidoY);
    
    //canvasSpectrums[0].loadPixels();
    for(let t = 0; t< track.length; t++){
        
        canvasSpectrums[0].noStroke();
        canvasSpectrums[0].fill(255, 0, 255);
        
        yV1+=vel;
        
        if(yV1 >= (heightSpectrumCanvas+scrollYV1)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollYV1+=velScroll;console.log("a");}
        //if(yV1 <= ((heightSpectrumCanvas/2)+scrollYV1)-100  && frameCount > 1062){vel=vel*1.5;velScroll=velScroll*0.5;}

        for(let i = 0; i< spectrum[t].length; i++){  
            let xV = map(i, 0, spectrum[t].length, 0, tamCanvasAncho*tamSpectrum);
            let alphaSVert = map(spectrum[t][i],0,255,1,255);
            //if(xV >= width){alphaSVert = 0;}
            if(t === 0){canvasSpectrums[0].fill(spectrum[t][i], 0, 0, alphaSVert);}
            if(t === 1){canvasSpectrums[0].fill(0, spectrum[t][i], 0, alphaSVert);}
            if(t === 2){canvasSpectrums[0].fill(0, 0, spectrum[t][i], alphaSVert);}
            if(t === 3){canvasSpectrums[0].fill(132, spectrum[t][i], 164, alphaSVert);}
            if(i === 1){tamSpectrumPixel = tamSpectrum+((vel+velScroll)*2)}
            canvasSpectrums[0].rectMode(CENTER);
            canvasSpectrums[0].rect(xV, yV1,(tamCanvasAncho/(resolucionFrecuencias*fftBands))*4,tamSpectrumPixel)
        }
    }
    //canvasSpectrums[0].updatePixels();
    image(canvasSpectrums[0],0,0-scrollYV1,widthSpectrumCanvas,tamCanvasSonidoY);
    image(canvasSpectrums[0],widthSpectrumCanvas, 0, width-widthSpectrumCanvas, heightSpectrumCanvas);
}

function sHorizontal(){
    noStroke();
    fill(0);
    rect(0,0,tamCanvasSonidoX, tamCanvasAncho);

        for (let t = 0; t< track.length; t++){
            canvasSpectrums[1].noStroke();
            canvasSpectrums[1].fill(255, 0, 255);
            xH1+=vel;

            if(xH1 >= (widthSpectrumCanvas+scrollXH1)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollXH1+=velScroll;console.log("a");}
            
            for (let i = 0; i< spectrum[t].length; i++){
                let yH = map(i, 0, spectrum[t].length, tamCanvasAncho, 0-(1*tamSpectrum));
                let alphaSHor = spectrum[t][i];
                //if(yH <= 0){alphaSVert = 0;}
                if(t === 0){canvasSpectrums[1].fill(alphaSHor, 0, 0, alphaSHor)}
                if(t === 1){canvasSpectrums[1].fill(0, alphaSHor, 0, alphaSHor)}
                if(t === 2){canvasSpectrums[1].fill(0, 0, alphaSHor, alphaSHor)}
                if(t === 3){canvasSpectrums[1].fill(alphaSHor, 0, alphaSHor, alphaSHor)}
                if(i === 1){tamSpectrumPixel = tamSpectrum}
                canvasSpectrums[1].rect(xH1, yH, tamSpectrumPixel,(tamCanvasAncho/(resolucionFrecuencias*fftBands))*4)
            }
        }
    image(canvasSpectrums[1],0-scrollXH1,0,tamCanvasSonidoX,heightSpectrumCanvas);
    image(canvasSpectrums[1], widthSpectrumCanvas, 0, width-widthSpectrumCanvas,heightSpectrumCanvas);
}

function sVerticalIND(){

    noStroke();
    fill(0);
    rect(0,0,widthSpectrumCanvas, heightSpectrumCanvas);

    yV2+=vel;
    if(yV2 >= (heightSpectrumCanvas+scrollYV2)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollYV2+=velScroll;console.log("a");}

    for (let t = 0; t< track.length; t++){
        canvasSpectrums[2].noStroke();
        canvasSpectrums[2].push();
        canvasSpectrums[2].translate((tamCanvasAncho/cantTrack)*t,0);

        for (let i = 0; i< spectrum[t].length; i++){
            
            let xV = map(i, 0, spectrum[t].length, 0, tamCanvasAncho/(cantTrack/tamSpectrum));
            let alphaSVerInd = spectrum[t][i];
            if(xV >= tamCanvasAncho/cantTrack){alphaSVerInd = 0;}
            if(t === 0){canvasSpectrums[2].fill(alphaSVerInd, 0, 0, alphaSVerInd)}
            if(t === 1){canvasSpectrums[2].fill(0, alphaSVerInd, 0, alphaSVerInd)}
            if(t === 2){canvasSpectrums[2].fill(0, 0, alphaSVerInd, alphaSVerInd)}
            if(t === 3){canvasSpectrums[2].fill(alphaSVerInd, 0, alphaSVerInd, alphaSVerInd)}

            if(i === 1){tamSpectrumPixel = xV}
            canvasSpectrums[2].rect(xV, yV2, ((tamCanvasAncho/cantTrack)/(resolucionFrecuencias*fftBands))*4, tamSpectrumPixel)
        }
        canvasSpectrums[2].pop();
    }
    image(canvasSpectrums[2],0,0-scrollYV2,widthSpectrumCanvas,tamCanvasSonidoY);
    image(canvasSpectrums[2],widthSpectrumCanvas, 0, width-widthSpectrumCanvas,heightSpectrumCanvas);
}

function sHorizontalIND(){

    noStroke();
    fill(0);
    rect(0,0,tamCanvasSonidoX, tamCanvasAncho);
    
    for (let t = 0; t< track.length; t++){

        canvasSpectrums[3].noStroke();
    
        xH2+=vel;
        if(xH2 >= (widthSpectrumCanvas+scrollXH2)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollXH2+=velScroll;console.log("a");}

        canvasSpectrums[3].push();
        canvasSpectrums[3].translate(0,(tamCanvasAncho/cantTrack)*t);

        for (let i = 0; i< spectrum[t].length; i++){

            let yH = map(i, 0, spectrum[t].length, (tamCanvasAncho/cantTrack), 0-(tamSpectrum*100));
            let alphaSHorInd = spectrum[t][i];
            if(yH <= 0){alphaSHorInd = 0;}
            if(t === 0){canvasSpectrums[3].fill(alphaSHorInd, 0, 0, alphaSHorInd)}
            if(t === 1){canvasSpectrums[3].fill(0, alphaSHorInd, 0, alphaSHorInd)}
            if(t === 2){canvasSpectrums[3].fill(0, 0, alphaSHorInd, alphaSHorInd)}
            if(t === 3){canvasSpectrums[3].fill(alphaSHorInd, 0, alphaSHorInd, alphaSHorInd)}
                        
            if(i === 1){tamSpectrumPixel = tamSpectrum/cantTrack}
            canvasSpectrums[3].rect(xH2, yH, tamSpectrumPixel,((tamCanvasAncho/cantTrack)/(resolucionFrecuencias*fftBands))*4)
        }
        canvasSpectrums[3].pop();
    }
    image(canvasSpectrums[3],0-scrollXH2,0,tamCanvasSonidoX,heightSpectrumCanvas);
    image(canvasSpectrums[3],widthSpectrumCanvas, 0, width-widthSpectrumCanvas,heightSpectrumCanvas);
}
  
function trackMouse(){
    
    strokeWeight(2);
    stroke(255);
    noFill();
    rect(0, 0,widthSpectrumCanvas,heightSpectrumCanvas);
    rect(widthSpectrumCanvas,0,windowWidth-widthSpectrumCanvas,heightSpectrumCanvas)
    
    track[0].vol = map(mouseY,0,heightSpectrumCanvas,0.5,0)+map(mouseX,0,widthSpectrumCanvas,0.5,0);
    track[1].vol = map(mouseY,0,heightSpectrumCanvas,0.5,0)+map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[2].vol = map(mouseY,0,heightSpectrumCanvas,0,0.5)+map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[3].vol = map(mouseY,0,heightSpectrumCanvas,0,0.5)+map(mouseX,0,widthSpectrumCanvas,0.5,0);
        
    track[0].paneo = map(mouseX,0,widthSpectrumCanvas,-0.5,0);
    track[1].paneo = map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[2].paneo = map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[3].paneo = map(mouseX,0,widthSpectrumCanvas,-0.5,0);

    track[0].revDryWet = map(mouseY,0,heightSpectrumCanvas,0.25,0.5)+map(mouseX,0,widthSpectrumCanvas,0.25,0.5);
    track[1].revDryWet = map(mouseY,0,heightSpectrumCanvas,0.25,0.5)+map(mouseX,0,widthSpectrumCanvas,0.5,0.25);
    track[2].revDryWet = map(mouseY,0,heightSpectrumCanvas,0.5,0.25)+map(mouseX,0,widthSpectrumCanvas,0.5,0.25);
    track[3].revDryWet = map(mouseY,0,heightSpectrumCanvas,0.5,0.25)+map(mouseX,0,widthSpectrumCanvas,0.25,0.5);


        for (let t = 0; t< track.length; t++){
            track[t].sonido.setVolume(track[t].vol);
            track[t].sonido.pan(track[t].paneo);
            track[t].reverb.drywet(track[t].revDryWet);
            spectrum[t] = track[t].fft.analyze(resolucionFrecuencias*int(fftBands));
        }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    tamFuente = (windowWidth+windowHeight)/50;
    tamSlider = windowWidth/12;
    widthSpectrumCanvas = windowWidth-(tamSlider*2);
    heightSpectrumCanvas = windowHeight;
    //background(0);
}

function doubleClicked(){
    let fs = fullscreen();
    fullscreen(!fs);
}
