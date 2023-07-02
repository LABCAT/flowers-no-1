import React, { useEffect, useRef, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js';
import { Context } from "../context/Context.js";


export default function String(props) {
    const { pos, colour, addToObjectsArray } = props,
        { coloursOptions } = useContext(Context),
        mesh = useRef(),
        lightning = new LightningStrike();
        
  
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.geometry.update(time);
    });

    useEffect(
        () => {
            mesh.current.glow = coloursOptions[Math.floor(Math.random() * coloursOptions.length)];
            addToObjectsArray(mesh.current);
        }, 
        [addToObjectsArray]
    );

    return (
        <mesh ref={mesh} geometry={lightning} position={pos}>
            <meshBasicMaterial
                color={colour}
                attach="material"
                transparent
                roughness={0.1}
                metalness={0.1}
            />
        </mesh>
    );
};