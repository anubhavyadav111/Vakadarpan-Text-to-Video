"use client";

import React from 'react'
import {Suspense,useEffect,useState} from 'react';
import { Canvas } from "@react-three/fiber";
import {OrbitControls, Preload,useGLTF} from '@react-three/drei';

import CanvasLoader from '../loader';

const Model = () => {

    const news=useGLTF('./newspaper/scene.gltf')
    
    return (
      <mesh>
          <hemisphereLight intensity={1}
           groundColor="black"/>
           <pointLight intensity={12000}
           position={[-51,0,-30]}/>
           <primitive
              object={news.scene}
              scale={5}
              position={[-50,0,15]}
              rotation={[-5,0 ,-15]}
           />
      </mesh>
    )
}

const Model2 = () => {

    const news=useGLTF('./case_boxes/scene.gltf')
    
    return (
      <mesh>
          <hemisphereLight intensity={1}
           groundColor="black"/>
           <pointLight intensity={1500}
           position={[-31,20,0]}/>
           <primitive
              object={news.scene}
              scale={25}
              position={[0,-15,15]}
              rotation={[0,0,0]}
           />
      </mesh>
    )
}

const NewsCanvas=()=>{
    return(
        <Canvas
            frameloop="demand"
            shadows
            camera={{position:[-140,40,15], fov:15}}
            gl={{preserveDrawingBuffer: true}}
        >
            {/* <Suspense fallback={<CanvasLoader/>}>
                <OrbitControls
                autoRotate
                autoRotateSpeed={1} 
                 enableZoom={false}
                 maxPolarAngle={Math.PI/2}
                 minPolarAngle={Math.PI/2}
                />
                <Model2/>
            </Suspense> */}
            <Suspense fallback={<CanvasLoader/>}>
                <OrbitControls
                autoRotate
                autoRotateSpeed={3} 
                 enableZoom={false}
                 maxPolarAngle={Math.PI/2}
                 minPolarAngle={Math.PI/2}
                />
                <Model/>
            </Suspense>

            <Preload all/>
        </Canvas>
    )
}

export default NewsCanvas;