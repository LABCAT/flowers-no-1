import React, { useRef, useEffect, useContext } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';

import audio from "../audio/lightning-no-1.ogg";
import midi from "../audio/lightning-no-1.mid";
import { Context } from "./context/Context.js";

const Audio = () => {
    const animation = useRef();
    const sketchRef = useRef();
    const { coloursOptions, updateNotes, resetNotes, updateCurrentNote, updateCameraZPos, updateCameraRotateSpeed } = useContext(Context);

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[8].notes; // Combinator 1 - Touch Orchestra
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 


        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.noLoop()
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){

            }
        }

        p.gridVersion = 1;

        p.executeCueSet1 = (note) => {
            const { currentCue, ticks } = note;
            const colours =coloursOptions,
                colour  = colours[Math.floor(Math.random() * colours.length)],
                dist = currentCue > 15 ? 150 : currentCue;
            
            updateCurrentNote(note);
            updateCameraZPos(note);

            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && currentCue % 2 === 0 && currentCue < 84){
                resetNotes();
            }
            else if (currentCue % 14 < 6 && currentCue < 84 && currentCue % 2 === 0){
                resetNotes();
            }
            else if ([6, 10, 1].includes(currentCue % 14)){
                resetNotes();
            }

            if((currentCue % 14 === 1 || ticks % 61440 === 0) && currentCue > 14) {
                const root = document.documentElement,
                    gridOptions = [1,2,3,4,5];
                gridOptions.splice(p.gridVersion - 1, 1);
                p.gridVersion = p.random(gridOptions);
                root.style.setProperty("--canvas-bg", "var(--bg-gradient-" + p.gridVersion + ')');
            }

            if(currentCue % 14 === 1 && currentCue > 15) {
                updateCameraRotateSpeed();
            }

            updateNotes(
                {
                    colour: colour,
                    xPos: p.random(-dist, dist),
                    yPos: p.random(-dist/2 - 50, dist/2 - 50),
                    zPos: p.random(-50, dist)
                }
            );
        }

        p.mousePressed = () => {
            
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    const playHandler = () => {
        console.log(animation.current);
        if(animation.current) {
            
            if(animation.current.audioLoaded){
                if (animation.current.song.isPlaying()) {
                    animation.current.song.pause();
                    document.getElementById("play-icon").classList.remove("play-icon--playing");
                } else {
                    if (parseInt(animation.current.song.currentTime()) >= parseInt(animation.current.song.buffer.duration)) {
                        animation.current.reset();
                    }
                    document.getElementById("play-icon").classList.add("play-icon--playing");
                    animation.current.canvas.addClass("fade-in");
                    animation.current.song.play();
                }
            }
        }
    }

    useEffect(() => {
        animation.current = new p5(Sketch, sketchRef.current);
    }, []);


    return (
        <div ref={sketchRef}>
            <button onClick={playHandler} id="play-button">
                <PlayIcon  />
            </button>
        </div>
    );
};

export default Audio;
