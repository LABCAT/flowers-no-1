import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

import VertexShader from '../shaders/VertexShader';
import FragmentShader from '../shaders/FragmentShader';

const pointer = {
    x: .66,
    y: .3,
    clicked: true,
};

window.setTimeout(() => {
    pointer.x = .75;
    pointer.y = .5;
    pointer.clicked = true;
}, 700);

window.setTimeout(() => {
    pointer.x = .15;
    pointer.y = .65;
    pointer.clicked = true;
}, 1700);

//https://github.com/pmndrs/react-three-fiber/discussions/2494

export default function Flower(props) {
    const mesh = useRef();
    const mesh2 = useRef();

    let renderTargets = [
        new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
        new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    ];

    const uniforms = useMemo(
        () => ({
            u_stop_time: {type: "f", value: 0.},
            u_stop_randomizer: {type: "v2", value: new THREE.Vector2(Math.random(), Math.random())},
            u_cursor: {type: "v2", value: new THREE.Vector2(pointer.x, pointer.y)},
            u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
            u_texture: {type: "t", value: null},
            u_clean: {type: "f", value: 1.},
        }), []
    );
        
  
    useFrame((state) => {
        const { clock, gl, scene, camera } = state;
        mesh.current.material.uniforms.u_clean.value = 1;
        mesh.current.material.uniforms.u_texture.value = renderTargets[0].texture;

        if (pointer.clicked) {
            mesh.current.material.uniforms.u_cursor.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
            mesh.current.material.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
            mesh.current.material.uniforms.u_stop_time.value = 0.;
            pointer.clicked = false;
        }
        mesh.current.material.uniforms.u_stop_time.value += clock.getDelta();

        gl.setRenderTarget(renderTargets[1]);
        gl.render(scene, camera);
        mesh2.current.material.map = renderTargets[1].texture;
        gl.setRenderTarget(null);
        gl.render(scene, camera);

        let tmp = renderTargets[0];
        renderTargets[0] = renderTargets[1];
        renderTargets[1] = tmp;
    });


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
            <mesh ref={mesh2}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial
                />
            </mesh>
        </>
    );
};