import React, { useRef } from "react";
import { extend, useThree, useFrame  } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CameraControls(props) {
  const { canSetCameraPos, updateCanSetCameraPos, cameraZPos, cameraRotateSpeed } = props;

  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame with useFrame
  const controls = useRef();
  useFrame(() => {
    if(canSetCameraPos) {
      camera.position.set( 0, 0, cameraZPos );
      updateCanSetCameraPos();
    }
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = cameraRotateSpeed;
    controls.current.update()
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
    />
  );
};


extend({ OrbitControls });