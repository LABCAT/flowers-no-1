import React, { useEffect, useRef, useMemo } from "react";
import { Vector2 } from "three"
import { extend, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"

extend({ EffectComposer, RenderPass, OutlinePass })

export default function Effects(props) {
    const { outlines } = props,
        { gl, scene, size, camera } = useThree(),
        composer = useRef(),
        aspect = useMemo(() => new Vector2(window.innerWidth, window.innerHeight), [size]);
  
    useEffect(() => {composer.current.setSize(window.innerWidth, window.innerHeight)}, [size]);

    useFrame(() => {composer.current.render()}, 1);


    return (
        <>
        <effectComposer ref={composer} args={[gl]}>
           <renderPass attachArray="passes" args={[scene, camera]} />
           {
                outlines.map((outline, index) => (
                    <outlinePass
                        key={index}
                        attachArray="passes"
                        args={[aspect, scene, camera]}
                        visibleEdgeColor={outline.glow}
                        selectedObjects={[outline]}
                        edgeStrength={2.5}
                        edgeThickness={2.8}
                        edgeGlow={2.7}
                        hiddenEdgeColor={0}
                    />
                ))
            }
        </effectComposer> 
        </>
    );
};