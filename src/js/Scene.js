import React, { Suspense, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Context } from "./context/Context";
import CameraControls from './components/CameraControls'
import Flower from './components/Flower'

/**
 * https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
 * https://blog.maximeheckel.com/posts/beautiful-and-mind-bending-effects-with-webgl-render-targets/
 * https://codepen.io/ksenia-k/pen/RwqrxBG?editors=1010
 * https://codepen.io/ksenia-k/pen/poOMpzx
 * https://codepen.io/mdusmanansari/pen/BamepLe
 * 
 */

export default function Scene() {
        const { notes  } = useContext(Context);

        console.log(notes);
        return (
        <Canvas camera={{ position: [1.0, 1.0, 1.0] }} orthographic={true}>
            <Suspense fallback='loading...'>
                <Flower />
            </Suspense>
        </Canvas>
    );
}