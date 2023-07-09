import React, { Suspense, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Context } from "./context/Context";
import CameraControls from './components/CameraControls'
import Flower from './components/Flower'

/**
 * https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
 * https://codepen.io/ksenia-k/pen/RwqrxBG?editors=1010
 * https://codepen.io/ksenia-k/pen/poOMpzx
 * https://codepen.io/mdusmanansari/pen/BamepLe
 */

export default function Scene() {
    const { notes, currentNote, canSetCameraPos, updateCanSetCameraPos, cameraZPos, cameraRotateSpeed  } = useContext(Context),
        { currentCue } = currentNote,
        objectsArray = [],
        addToObjectsArray = (string) => {
          objectsArray.push(string);
        };
    return (
        <Canvas camera={{ position: [1.0, 1.0, 1.0] }}>
            <Suspense fallback='loading...'>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Stars radius={75} saturation={50} fade={true} />
                {/* <>
                    {notes.map((note, index) => (
                        <Flower key={index} pos={[note.xPos, note.yPos, note.zPos]} colour={note.colour} addToObjectsArray={addToObjectsArray} />
                    ))}
                </> */}
                <Flower />
                {/* <CameraControls canSetCameraPos={canSetCameraPos} updateCanSetCameraPos={updateCanSetCameraPos} cameraZPos={cameraZPos} cameraRotateSpeed={cameraRotateSpeed} /> */}
            </Suspense>
        </Canvas>
    );
}