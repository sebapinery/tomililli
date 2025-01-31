let cnv;
const divTxt = document.querySelector('.txtManualInstr');
let cont = 0;
let logoHibrydos;
let cantBtns = 6;
let selectCanvas = [];
let widthSpectrumCanvas;
let heightSpectrumCanvas;
let tamañoClickX;
let tamañoClickY;
let yV = 0;
let xH = 0;
let vel = 0;
let velScroll = 1;
let scrollYV = 0;
let scrollXH = 0;
let track = [] 
let mic
let spectrum = []
let canvasSpectrums = [];
let cantTrack = 4;
let vSlider;
let tSlider;
let tamSlider;
let fftBands;
let resolucionFrecuencias = 512 // agregar un selector tipo botonera para elegir resolucion en frecuencia (mult en 0.5, 1, 2, 3, 4)
let tamSpectrum = 2.5;
let tamSpectrumPixel = 1;
let tamFuente;

function preload(){
    
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
    

    tamañoClickX = windowWidth/cantBtns;
    tamañoClickY = tamañoClickX/1.5;
    for(let k = 0 ;k < cantBtns; k++){
        selectCanvas[k] = {
                            btn: createGraphics(windowWidth, windowHeight),
                            btn_img: loadImage('img/boton_'+k+'.jpg'),
                            x: 0 + (tamañoClickX*k),
                            state: false,
                        }
    }

}
  
function setup(){
    cnv = createCanvas(windowWidth,windowHeight);
    background(0);
    //frameRate(40);

    tamFuente = (width+height)/150;
    tamSlider = width/12;

    for(let j = 0 ;j < 4; j++){
        canvasSpectrums[0] = createGraphics(windowWidth-(tamSlider*2), track[j].sonido.duration()*8);
        canvasSpectrums[1] = createGraphics(track[j].sonido.duration()*16, height-tamañoClickY);
        canvasSpectrums[2] = createGraphics(windowWidth-(tamSlider*2), track[j].sonido.duration()*8);
        canvasSpectrums[3] = createGraphics(track[j].sonido.duration()*16, height-tamañoClickY);
        console.log("track["+j+"].sonido.duration: "+track[j].sonido.duration())
        }
    
    mic = new p5.AudioIn();
    mic.start();

    

    knob1 = new MakeKnobC("img/knob.png", tamSlider, width-tamSlider, tamañoClickY+(tamSlider/2)+(tamFuente*2), 0.05, 0.5, 0.25, 6,"Speed", [255,0,255], tamFuente); //knobColor, diameter, locx, locy, lowNum, hiNum, defaultNum, numPlaces, labelText, textColor, textPt
    knob2 = new MakeKnobC("img/knob.png", tamSlider, width-tamSlider, (tamañoClickY+(tamSlider/4)+(tamFuente*2))*2, 1, 2, 1, 6,"Zoom", [0,255,255], tamFuente);
    knob3 = new MakeKnobC("img/knob.png", tamSlider, width-tamSlider, (tamañoClickY+(tamSlider/6)+(tamFuente*2))*3, 1, 8, 8, 6,"FFT bands", [255,255,0], tamFuente);
    console.log("track[0].sonido.duration: "+track[0].sonido.duration())
}
  
function draw(){
    //console.log('K1: '+knob1.knobValue+' / k2:'+knob2.knobValue+' / k3:'+int(knob3.knobValue))
    //console.log('vel: '+vel+' / tamSpec:'+tamSpectrum+' / fftB:'+fftBands)

    vel = knob1.knobValue;
    velScroll = knob1.knobValue;
    tamSpectrum = knob2.knobValue;
    fftBands = int(knob3.knobValue);
    if(fftBands===3){fftBands=2;}
    widthSpectrumCanvas = width-(tamSlider*2);
    heightSpectrumCanvas = height-tamañoClickY;
    
    
    if(selectCanvas[0].state === true){muestraTxt();}
    if(selectCanvas[1].state === true){sVertical();}
    if(selectCanvas[2].state === true){sHorizontal();}
    if(selectCanvas[3].state === true){sVerticalIND();}
    if(selectCanvas[4].state === true){sHorizontalIND();}

    zonaClicks();
    knob1.update();
    knob2.update();
    knob3.update();
    trackMouse();
       
    //elCursor();
}

function textoInstructivo(){
    /*
    let txtInst = document.createElement('div');
    txtInst.className = 'txtInst'
    txtInst.textContent = 'uuuuuuuuuuuh';
   // document.prepend(txtInst)
   AGREGAR CREDITOS LIBRERIAS
    */
//    /*
    background(0,10);
    noStroke();
    fill(255,0,0);
    ellipse(20, tamañoClickY+20,20, 20);
    fill(0,255,0);
    ellipse(widthSpectrumCanvas-20, tamañoClickY+20,20, 20);
    fill(255,0,255);
    ellipse(20, height-20,20, 20);
    fill(0,0,255);
    ellipse(widthSpectrumCanvas-20, height-20,20, 20);
    fill(255);
    ellipse(widthSpectrumCanvas/2, ((height-tamañoClickY)/2)+tamañoClickY,20, 20);
    push();
    translate(0,height/10)
    for(let i = 0; i < textComienzo.length; i++){
        fill(255)
        textSize(tamFuente)
        textAlign(LEFT);
        text(textComienzo[i], tamFuente*3, (tamañoClickY/1.5)+(tamFuente*(i+1)), widthSpectrumCanvas, height-tamañoClickY);
    }
    pop();
//    */
}

function sVertical(){

    noStroke();
    fill(0);
    rect(0,tamañoClickY,widthSpectrumCanvas, heightSpectrumCanvas);
    
    for (let t = 0; t< track.length; t++){
        
        canvasSpectrums[0].noStroke();
        canvasSpectrums[0].fill(255, 0, 255);
        
        yV+=vel;
        
        if(yV >= (heightSpectrumCanvas+scrollYV)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollYV+=velScroll;console.log("a");}
        if(yV <= ((heightSpectrumCanvas/2)+scrollYV)-100  && frameCount > 1062){vel=vel*1.5;velScroll=velScroll*0.5;console.log("b")}

        console.log("vel: "+vel+" / velScroll: "+velScroll)

        for (let i = 0; i< spectrum[t].length; i++){
            
            let xV = map(i, 0, spectrum[t].length, 0, widthSpectrumCanvas);
            let alphaSVert = map(spectrum[t][i],0,255,1,255);
            if(xV >= width){alphaSVert = 0;}
            if(t === 0){canvasSpectrums[0].fill(spectrum[t][i], 0, 0, alphaSVert);}
            if(t === 1){canvasSpectrums[0].fill(0, spectrum[t][i], 0, alphaSVert);}
            if(t === 2){canvasSpectrums[0].fill(0, 0, spectrum[t][i], alphaSVert);}
            if(t === 3){canvasSpectrums[0].fill(132, spectrum[t][i], 164, alphaSVert);}
            if(i === 1){tamSpectrumPixel = 1+vel+velScroll}
            canvasSpectrums[0].ellipse(xV, yV, tamSpectrumPixel,tamSpectrumPixel)
            
        }
        
    }
    
    push();
    translate(0,tamañoClickY);
    imageMode(CENTER);
    image(canvasSpectrums[0],widthSpectrumCanvas/2,((track[0].sonido.duration()*8)/2)-scrollYV);
    pop();
    
    /*
    fill(255)
    textSize(tamFuente)
    textAlign(LEFT);
    text("x: "+map(mouseX,0,width,-2000,2000)+" / y: "+map(mouseY,0,height,-2000,2000),0,tamañoClickY*2)
    push();
    //translate(map(mouseX,0,width,-2000,2000),map(mouseY,0,height,-2000,2000))
    translate(1230,1550)
    console.log("x: "+map(mouseX,0,width,-2000,2000)+" / y: "+map(mouseY,0,height,-2000,2000))
    rotate(radians(-90))
    imageMode(CENTER);
    image(canvasSpectrums[0],((track[0].sonido.duration()*8)/2),heightSpectrumCanvas/2-scrollYV);
    pop();
    */

    push();
    image(canvasSpectrums[0], width-(tamSlider*2), tamañoClickY, 200,height);
    pop();

    if (keyIsPressed === true && key == 'g') {canvasSpectrums[0].save("canvas"+frameCount+".jpg")}
}

function sHorizontal(){
    
    noStroke();
    fill(0);
    rect(0,tamañoClickY,widthSpectrumCanvas, heightSpectrumCanvas);
    

        for (let t = 0; t< track.length; t++){
            canvasSpectrums[1].noStroke();
            canvasSpectrums[1].fill(255, 0, 255);
            xH+=vel;

            if(xH >= (widthSpectrumCanvas+scrollXH)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollXH+=velScroll;console.log("a");}
            //if(xH <= ((widthSpectrumCanvas/2)+scrollXH)-100  && frameCount > 1062){vel=vel*1.5;velScroll=velScroll*0.5;console.log("b")}

            for (let i = 0; i< spectrum[t].length; i++){
                let yH = map(i, 0, spectrum[t].length, heightSpectrumCanvas, tamañoClickY-(heightSpectrumCanvas*tamSpectrum));
                let alphaSHor = spectrum[t][i];
                if(yH <= 0){alphaSVert = 0;}
                if(t === 0){canvasSpectrums[1].fill(alphaSHor, 0, 0, alphaSHor)}
                if(t === 1){canvasSpectrums[1].fill(0, alphaSHor, 0, alphaSHor)}
                if(t === 2){canvasSpectrums[1].fill(0, 0, alphaSHor, alphaSHor)}
                if(t === 3){canvasSpectrums[1].fill(alphaSHor, 0, alphaSHor, alphaSHor)}
                if(i === 1){tamSpectrumPixel = tamSpectrum}
                canvasSpectrums[1].rect(xH, yH, tamSpectrumPixel,tamSpectrumPixel)
            }
        }
    image(canvasSpectrums[1],0-scrollXH,tamañoClickY);

    push();
    image(canvasSpectrums[1], width-(tamSlider*2), tamañoClickY, 200,height);
    pop();
    if (keyIsPressed === true && key == 'g') {canvasSpectrums[1].save("canvas"+frameCount+".jpg")}

}

function sVerticalIND(){

    noStroke();
    fill(0);
    rect(0,tamañoClickY,widthSpectrumCanvas, heightSpectrumCanvas);

    yV+=vel;
    if(yV >= (heightSpectrumCanvas+scrollYV)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollYV+=velScroll;console.log("a");}
    //if(yV <= ((heightSpectrumCanvas/2)+scrollYV)-100  && frameCount > 1062){vel=vel*1.5;velScroll=velScroll*0.5;console.log("b")}

    console.log("yV: "+yV+" / lim: "+(heightSpectrumCanvas+scrollYV)-25)

    for (let t = 0; t< track.length; t++){
        canvasSpectrums[2].noStroke();
        canvasSpectrums[2].fill(255, 0, 255);

        

        canvasSpectrums[2].push();
        canvasSpectrums[2].translate((widthSpectrumCanvas/cantTrack)*t,0);

        for (let i = 0; i< spectrum[t].length; i++){
            
            let xV = map(i, 0, spectrum[t].length, 0, widthSpectrumCanvas/(cantTrack/tamSpectrum));
            let alphaSVerInd = spectrum[t][i];
            if(xV >= width/cantTrack){alphaSVerInd = 0;}
            if(t === 0){canvasSpectrums[2].fill(alphaSVerInd, 0, 0, alphaSVerInd)}
            if(t === 1){canvasSpectrums[2].fill(0, alphaSVerInd, 0, alphaSVerInd)}
            if(t === 2){canvasSpectrums[2].fill(0, 0, alphaSVerInd, alphaSVerInd)}
            if(t === 3){canvasSpectrums[2].fill(alphaSVerInd, 0, alphaSVerInd, alphaSVerInd)}

            if(i === 1){tamSpectrumPixel = xV}
            canvasSpectrums[2].rect(xV, yV, tamSpectrumPixel,tamSpectrumPixel)
        }
        canvasSpectrums[2].pop();
    }
    image(canvasSpectrums[2],0,tamañoClickY-scrollYV);
    image(canvasSpectrums[2],widthSpectrumCanvas,tamañoClickY,200,heightSpectrumCanvas);
}

function sHorizontalIND(){

    noStroke();
    fill(0);
    rect(0,tamañoClickY,widthSpectrumCanvas, heightSpectrumCanvas);
    
    for (let t = 0; t< track.length; t++){

        
        canvasSpectrums[3].noStroke();
    
        xH+=vel;
        if(xH >= (widthSpectrumCanvas+scrollXH)-25){vel=vel*0.25;velScroll=velScroll*1.5;scrollXH+=velScroll;console.log("a");}
        
            
        //translate(0,tamañoClickY);
        canvasSpectrums[3].push();
        canvasSpectrums[3].translate(0,(heightSpectrumCanvas/cantTrack)*t);

        for (let i = 0; i< spectrum[t].length; i++){

            let yH = map(i, 0, spectrum[t].length, (heightSpectrumCanvas/cantTrack), 0);
            let alphaSHorInd = spectrum[t][i];
            if(yH <= 0){alphaSHorInd = 0;}
            if(t === 0){canvasSpectrums[3].fill(alphaSHorInd, 0, 0, alphaSHorInd)}
            if(t === 1){canvasSpectrums[3].fill(0, alphaSHorInd, 0, alphaSHorInd)}
            if(t === 2){canvasSpectrums[3].fill(0, 0, alphaSHorInd, alphaSHorInd)}
            if(t === 3){canvasSpectrums[3].fill(alphaSHorInd, 0, alphaSHorInd, alphaSHorInd)}
                        
            if(i === 1){tamSpectrumPixel = tamSpectrum/cantTrack}
            canvasSpectrums[3].rect(xH, yH, tamSpectrumPixel,tamSpectrumPixel)
        }
        canvasSpectrums[3].pop();
    }
    image(canvasSpectrums[3],0-scrollXH,tamañoClickY);
}

function togglePlay() {
      for(let i = 0 ;i < track.length; i++){
            if (track[i].sonido.isPlaying()) {track[i].sonido.pause();track[i].fft.setInput(mic)} 
            else {track[i].sonido.loop();track[i].fft.setInput(track[i].sonido)}
      }
}
  
function trackMouse(){
    /*
    strokeWeight(4);
    stroke(255);
    noFill();
    rect(0, tamañoClickY,widthSpectrumCanvas,height-tamañoClickY);
    */
    track[0].vol = map(mouseY,tamañoClickY,height-tamañoClickY,0.5,0)+map(mouseX,0,widthSpectrumCanvas,0.5,0);
    track[1].vol = map(mouseY,tamañoClickY,height-tamañoClickY,0.5,0)+map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[2].vol = map(mouseY,tamañoClickY,height-tamañoClickY,0,0.5)+map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[3].vol = map(mouseY,tamañoClickY,height-tamañoClickY,0,0.5)+map(mouseX,0,widthSpectrumCanvas,0.5,0);
        
    track[0].paneo = map(mouseX,0,widthSpectrumCanvas,-0.5,0);
    track[1].paneo = map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[2].paneo = map(mouseX,0,widthSpectrumCanvas,0,0.5);
    track[3].paneo = map(mouseX,0,widthSpectrumCanvas,-0.5,0);

    track[0].revDryWet = map(mouseY,tamañoClickY,height-tamañoClickY,0.25,0.5)+map(mouseX,0,widthSpectrumCanvas,0.25,0.5);
    track[1].revDryWet = map(mouseY,tamañoClickY,height-tamañoClickY,0.25,0.5)+map(mouseX,0,widthSpectrumCanvas,0.5,0.25);
    track[2].revDryWet = map(mouseY,tamañoClickY,height-tamañoClickY,0.5,0.25)+map(mouseX,0,widthSpectrumCanvas,0.5,0.25);
    track[3].revDryWet = map(mouseY,tamañoClickY,height-tamañoClickY,0.5,0.25)+map(mouseX,0,widthSpectrumCanvas,0.25,0.5);


        for (let t = 0; t< track.length; t++){
            track[t].sonido.setVolume(track[t].vol);
            track[t].sonido.pan(track[t].paneo);
            track[t].reverb.drywet(track[t].revDryWet);
            // print('track['+t+']: vol: '+track[t].vol+' / pan: '+track[t].paneo+' / dryWet: '+track[t].revDryWet)
            spectrum[t] = track[t].fft.analyze(resolucionFrecuencias*int(fftBands));
        }
}

function elCursor(){
    if(mouseY > tamañoClickY-25 || mouseX > widthSpectrumCanvas){ 
        noCursor(); 
        noFill();
        strokeWeight(2);
        stroke(255,10);
        ellipse(mouseX,mouseY,25,25)   
    }else{        
        noFill();
        strokeWeight(2);
        stroke(255,100);
        ellipse(mouseX,mouseY,50,50)
    }
}

function zonaClicks(){
    image(selectCanvas[0].btn_img,selectCanvas[0].x,0,tamañoClickX,tamañoClickY);
    image(selectCanvas[1].btn_img,selectCanvas[1].x,0,tamañoClickX,tamañoClickY);
    image(selectCanvas[2].btn_img,selectCanvas[2].x,0,tamañoClickX,tamañoClickY);
    image(selectCanvas[3].btn_img,selectCanvas[3].x,0,tamañoClickX,tamañoClickY);
    image(selectCanvas[4].btn_img,selectCanvas[4].x,0,tamañoClickX,tamañoClickY);
    image(selectCanvas[5].btn_img,selectCanvas[5].x,0,tamañoClickX,tamañoClickY);
}

function mouseClicked(){
    if (mouseX < selectCanvas[1].x && mouseY < tamañoClickY){console.log('0');if(selectCanvas[0].state === false){selectCanvas[0].state = true;}else{background(0);selectCanvas[0].state = false;}}
    if (mouseX > selectCanvas[1].x && mouseX < selectCanvas[2].x && mouseY < tamañoClickY){console.log('1');selectCanvas[1].state = true;selectCanvas[2].state=false;selectCanvas[3].state=false;selectCanvas[4].state=false;background(0,255);}
    if (mouseX > selectCanvas[2].x && mouseX < selectCanvas[3].x && mouseY < tamañoClickY){console.log('2');selectCanvas[2].state = true;selectCanvas[1].state=false;selectCanvas[3].state=false;selectCanvas[4].state=false;background(0,255);}
    if (mouseX > selectCanvas[3].x && mouseX < selectCanvas[4].x && mouseY < tamañoClickY){console.log('3');selectCanvas[3].state = true;selectCanvas[2].state=false;selectCanvas[1].state=false;selectCanvas[4].state=false;background(0,255);}
    if (mouseX > selectCanvas[4].x && mouseX < selectCanvas[5].x && mouseY < tamañoClickY){console.log('4');selectCanvas[4].state = true;selectCanvas[2].state=false;selectCanvas[3].state=false;selectCanvas[1].state=false;background(0,255);}
    if (mouseX > selectCanvas[5].x && mouseX < width && mouseY < tamañoClickY){console.log('5');selectCanvas[5].state = true;}
    if (mouseY < tamañoClickY && selectCanvas[5].state ===true){console.log('COMIENZA');togglePlay();selectCanvas[5].state = false;}
}

function mousePressed() { knob1.active();knob2.active();knob3.active(); }

function mouseReleased() { knob1.inactive();knob2.inactive();knob3.inactive(); }
/*
function touchStarted(){}
function touchEnded(){}
*/
function windowResized() {resizeCanvas(windowWidth, windowHeight);}

function doubleClicked(){
    let fs = fullscreen();
    fullscreen(!fs);
}

function muestraTxt(){   
    if(cont == 0){divTxt.style.display = 'block';}
    if(cont == 1){divTxt.style.display = 'none';}
    cont++;
    if(cont > 1){cont = 0;}
}




/*

let contCuad = 0;
let contImg = 0;
let velCuad = 3.5;
let velImg = 1;
let dim = 400;
let cnvs;

function setup() {
  createCanvas(dim, dim);
  cnvs = createGraphics(400,400);
}

function draw() {
  background(255);
  cnvs = createGraphics(dim,dim+contImg);
  cnvs.background(220);
  cnvs.noFill();
  cnvs.rect(10,10,390,390+contImg)
  cnvs.fill(0)
  contCuad+=velCuad;
  contImg+=velImg;
  console.log("contCuad: "+contCuad+"contImg"+contImg)
  if(contCuad >= (390+contImg)-100){velCuad=velCuad/1.25;}
  if(contCuad <= (390+contImg)-dim){velCuad=velCuad*1.25;}
  //if(contImg >= contCuad*2){velCuad = 1.5;}
  cnvs.rect(20,contCuad,100,100)
  
  image(cnvs,0,-contImg)
}

function mousePressed(){
  cnvs.save("img.jpg")
}

*/