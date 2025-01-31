// KnobMakerC Example
// Miles DeCoster - CodeForArtists.com

// Create a variable for each instance of a knob or make bunch with an array
var colorKnob;

function setup() {
  createCanvas(600, 400); background(100);
  // example values
  colorKnob = new MakeKnobC("red", 100, width/2, height/2, 0, 255, 0, 0,"Background", [0,200,200], 18); //knobColor, diameter, locx, locy, lowNum, hiNum, defaultNum, numPlaces, labelText, textColor, textPt
}

function draw() {
  background(colorKnob.knobValue); // Use the knob to control something
  colorKnob.update();
}

function mousePressed() { colorKnob.active(); }

function mouseReleased() { colorKnob.inactive(); }
