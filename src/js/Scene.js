import React, { Suspense, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Context } from "./context/Context";
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
    const { notes, currentNote } = useContext(Context);

    return (
        <Canvas camera={{ position: [1.0, 1.0, 1.0] }} orthographic={true}>
            <Suspense fallback='loading...'>
                <Flower notes={notes} currentNote={currentNote} />
            </Suspense>
        </Canvas>
    );
}