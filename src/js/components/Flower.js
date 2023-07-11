import React, { useRef, useMemo, useEffect, useContext } from "react";
import { useFrame, createPortal } from "@react-three/fiber";
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';

import { Context } from "../context/Context";

import VertexShader from '../shaders/VertexShader';
import FragmentShader from '../shaders/FragmentShader';

const pointer = {
    x: .66,
    y: .3,
    clicked: true,
};

// window.setTimeout(() => {
//     pointer.x = .75;
//     pointer.y = .5;
//     pointer.clicked = true;
// }, 700);

// window.setTimeout(() => {
//     pointer.x = .15;
//     pointer.y = .65;
//     pointer.clicked = true;
// }, 1700);

//https://github.com/pmndrs/react-three-fiber/discussions/2494

export default function Flower(props) {
    const { notes } = props;
    const mesh = useRef();
    const mesh2 = useRef();

    let renderTargetA = useFBO(window.innerWidth, window.innerHeight);
    let renderTargetB = useFBO(window.innerWidth, window.innerHeight);

    const magicScene = new THREE.Scene();


    const uniforms = useMemo(
        () => ({
            u_stop_time: {type: "f", value: 0.},
            u_point: {type: "v2", value: new THREE.Vector2(pointer.x, pointer.y)},
            u_moving: {type: "f", value: 0.},
            u_speed: {type: "f", value: 0.},
            u_stop_randomizer: {type: "v2", value: new THREE.Vector2(Math.random(), Math.random())},
            u_clean: {type: "f", value: 1.},
            u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
            u_texture: {type: "t", value: null}
        }), []
    );

    // window.addEventListener("click", e => {
    //     pointer.x = e.pageX / window.innerWidth;
    //     pointer.y = e.pageY / window.innerHeight;
    //     pointer.clicked = true;		
    // });
        
  
    useFrame((state) => {
        const { clock, gl, scene, camera } = state;
        mesh.current.material.uniforms.u_clean.value = 1;
        

        mesh.current.material.uniforms.u_clean.value = 1;
        mesh.current.material.uniforms.u_point.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
        mesh.current.material.uniforms.u_texture.value = renderTargetA.texture;
        mesh.current.material.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
        if (pointer.clicked) {
            mesh.current.material.uniforms.u_moving.value = 1.;
            mesh.current.material.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
            mesh.current.material.uniforms.u_stop_time.value = 0.;
            pointer.clicked = false;
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
            console.log(notes);
        }, 
        [notes]
    );


    return (
        <>
            <mesh ref={mesh}>
                <planeGeometry args={[2, 2]} />
                <shaderMaterial
                    fragmentShader={FragmentShader}
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