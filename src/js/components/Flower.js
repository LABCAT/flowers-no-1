import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, createPortal } from "@react-three/fiber";
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';

import VertexShader from '../shaders/VertexShader';
import FragmentShader from '../shaders/FragmentShader';
import GlitchedFragmentShader from '../shaders/GlitchedFragmentShader';

export default function Flower(props) {
    const { notes, currentNote  } = props;
    const mesh = useRef();
    const mesh2 = useRef();
    const [canvasClear, setCanvasClear] = useState(false);
    const [currentShader, setCurrentShader] = useState(FragmentShader);
    const [glichtedMode, setGlichtedMode] = useState(false);

    let renderTargetA = useFBO(window.innerWidth, window.innerHeight);
    let renderTargetB = useFBO(window.innerWidth, window.innerHeight);

    const magicScene = new THREE.Scene();

    const flowerPointer = {
        x: 0.5,
        y: 0.5,
        grow: false,
    };


    const uniforms = useMemo(
        () => ({
            u_stop_time: {type: "f", value: 0.},
            u_point: {type: "v2", value: new THREE.Vector2(flowerPointer.x, flowerPointer.y)},
            u_moving: {type: "f", value: 0.},
            u_speed: {type: "f", value: 0.},
            u_stop_randomizer: {type: "v2", value: new THREE.Vector2(Math.random(), Math.random())},
            u_clean: {type: "f", value: 1.},
            u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
            u_texture: {type: "t", value: null}
        }), [flowerPointer.x, flowerPointer.y]
    );

    useFrame((state) => {
        const { clock, gl, scene, camera } = state;
        mesh.current.material.uniforms.u_clean.value = canvasClear ? 0 : 1;
        mesh.current.material.uniforms.u_point.value = new THREE.Vector2(flowerPointer.x, 1 - flowerPointer.y);
        mesh.current.material.uniforms.u_texture.value = renderTargetA.texture;
        mesh.current.material.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
        if (flowerPointer.grow) {
            mesh.current.material.uniforms.u_moving.value = 1.;
            mesh.current.material.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
            mesh.current.material.uniforms.u_stop_time.value = 0.;
            flowerPointer.grow = false;
        } else {
            mesh.current.material.uniforms.u_moving.value = 0.;
        }
        mesh.current.material.uniforms.u_stop_time.value += clock.getDelta();

        gl.setRenderTarget(renderTargetB);
        gl.render(scene, camera);
        mesh2.current.material.map = renderTargetB.texture;
        gl.setRenderTarget(null);
        gl.render(magicScene, camera);

        let tmp = renderTargetA;
        renderTargetA = renderTargetB;
        renderTargetB = tmp;
    });

    useEffect(
        () => {
            if(currentNote.clearCanvas) {
                setCanvasClear(true);

                setTimeout(() => {
                    setCanvasClear(false);
                }, 50);
            }

            if(currentNote.canGlitch) {
                setGlichtedMode(!glichtedMode);
                if(glichtedMode) {
                    setCurrentShader(GlitchedFragmentShader);
                }
                else {
                    setCurrentShader(FragmentShader);
                }
            }

            if(notes.length) {
                flowerPointer.x = Math.random();
                flowerPointer.y = Math.random() * (0.9 - 0.25) + 0.25;
                flowerPointer.grow = true;
            }
        }, 
        [notes, currentNote]
    );


    return (
        <>
            <mesh ref={mesh}>
                <planeGeometry args={[2, 2]} />
                <shaderMaterial
                    fragmentShader={currentShader}
                    vertexShader={VertexShader}
                    uniforms={uniforms}
                    wireframe={false}
                />
            </mesh>
            {createPortal(
                <mesh ref={mesh2}>
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial
                    />
                </mesh>,
                magicScene
            )}
        </>
    );
};