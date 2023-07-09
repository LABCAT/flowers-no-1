import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";

import VertexShader from '../shaders/VertexShader';
import FragmentShader from '../shaders/FragmentShader';

export default function Flower(props) {
    const mesh = useRef();

    const uniforms = useMemo(
        () => ({
        u_time: {
            value: 0.0,
        },
        u_colorA: { value: new Color("#FFE486") },
        u_colorB: { value: new Color("#FEB3D9") },
        }), []
    );
        
  
    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    });


    return (
         <mesh ref={mesh} position={[0, 0, 0]} scale={1.5}>
            <planeGeometry args={[1, 1, 16, 16]} />
            <shaderMaterial
                fragmentShader={FragmentShader}
                vertexShader={VertexShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
};