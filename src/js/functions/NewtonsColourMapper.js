import Values from "values.js";
/*
 * http://www.colourmusic.info/intro.htm
 *
 * Newton's original colour wheel
 * D (red):                 #FF0000, (255, 0, 0)
 * E (orange):              #FFA500, (255,165,0)
 * F (yellow):              #FFFF00, (255, 255, 0)
 * G (green):               #008000, (0, 128, 0)
 * A (blue):                #0000FF, (0, 0, 255)
 * B (indigo):              #4B0082, (75, 0, 130)
 * C (violet):              #EE82EE, (238,130,238)
 *
 * Values for sharp notes calculated using lerp color with an amount of 50%
 * D# (red-orange):         #ff5300, (255, 83, 0)
 * F# (yellow-green):       #80c000, (128, 192, 0)
 * G# (green-blue):         #004080, (0, 64, 128)
 * B# (blue-indigo):        #2700c1, (38, 0, 193)
 * C# (violet-red):         #f74177, (247,65,119)
 */

const colourMap = {
  50: "#FF0000",
  51: "#ff5300",
  52: "#FFA500",
  53: "#FFFF00",
  54: "#80c000",
  55: "#008000",
  56: "#004080",
  57: "#0000FF",
  58: "#2700c1",
  59: "#4B0082",
  60: "#f74177",
  61: "#EE82EE",
};

//50 is the midi value for D3
export default function NewtonsColourMapper(midiValue = 50) {
  const originalMidiValue = midiValue;
  let hexColour = "#FFFFFF";


  //find a shade
  if (midiValue < 50) {
    while (midiValue < 50) {
      midiValue = midiValue + 12;
    }
    const baseColour = colourMap[midiValue];
    const color = new Values(baseColour);
    const shadeAmount = Math.ceil((50 - originalMidiValue) / 12) * 20;
    hexColour = "#" + color.shade(shadeAmount).hex;
  }
  //find a tint
  else if (midiValue > 61) {
    while (midiValue > 61) {
      midiValue = midiValue - 12;
    }
    const baseColour = colourMap[midiValue];
    const color = new Values(baseColour);
    const tintAmount = Math.ceil((originalMidiValue - 50) / 12) * 20;
    hexColour = "#" + color.tint(tintAmount).hex;
  } else {
    hexColour = colourMap[midiValue];
  }

  return hexColour;
}

