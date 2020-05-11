import React, { useRef, FC, Suspense, useState } from "react";
import "./App.css";
import { useSpring, animated } from "@react-spring/three";
import {
  Canvas,
  extend,
  useThree,
  useFrame,
  useLoader,
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

extend({ OrbitControls });
const Controls = (props: any) => {
  const { gl, camera } = useThree();
  const ref = useRef<any>();
  useFrame(() => ref.current.update());
  // @ts-ignore
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Asset: FC<{ url: string }> = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const [hovered, setHover] = useState(false);
  const { scale, rotation } = useSpring({
    from: { scale: [0.03, 0.03, 0.03], rotation: [0, 0, -0.3] },
    to: {
      scale: hovered ? [0.065, 0.065, 0.065] : [0.06, 0.06, 0.06],
      rotation: [0, Math.PI / 2, -0.3],
    },
  });
  return (
    <animated.group
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      >
      <primitive
        castShadow={true}
        receiveShadow={true}
        object={gltf.scene}
        dispose={null}
      />
    </animated.group>
  );
};

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 15] }} shadowMap>
      <ambientLight intensity={0.5} />
      <pointLight intensity={1} position={[-10, -25, -10]} />
      <spotLight
        intensity={0.5}
        angle={Math.PI / 8}
        position={[25, 25, 15]}
        castShadow
      />
      <Suspense fallback={null}>
        <Asset url="/scene.gltf" />
      </Suspense>
      <Controls
        autoRotate
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
