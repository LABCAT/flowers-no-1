import React, { Suspense, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Context } from "./context/Context";
import CameraControls from './components/CameraControls'
import Effects from './components/Effects'
import String from './components/String'

export default function Scene() {
    const { notes, currentNote, canSetCameraPos, updateCanSetCameraPos, cameraZPos, cameraRotateSpeed  } = useContext(Context),
        { currentCue } = currentNote,
        objectsArray = [],
        addToObjectsArray = (string) => {
          objectsArray.push(string);
        };
    return (
        <Canvas>
            <Suspense fallback='loading...'>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Stars radius={75} saturation={50} fade={true} />
                <>
                    {notes.map((note, index) => (
                        <String key={index} pos={[note.xPos, note.yPos, note.zPos]} colour={note.colour} addToObjectsArray={addToObjectsArray} />
                    ))}
                </>
                <Effects outlines={objectsArray} />
                <CameraControls canSetCameraPos={canSetCameraPos} updateCanSetCameraPos={updateCanSetCameraPos} cameraZPos={cameraZPos} cameraRotateSpeed={cameraRotateSpeed} />
            </Suspense>
        </Canvas>
    );
}