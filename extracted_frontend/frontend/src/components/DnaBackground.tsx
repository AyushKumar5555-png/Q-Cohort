import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DnaHelix() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create DNA points
  const { points1, points2, connections } = useMemo(() => {
    const numPoints = 60;
    const radius = 2.5;
    const height = 18;
    const turns = 3;
    
    const p1 = [];
    const p2 = [];
    const conns = [];
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      p1.push(new THREE.Vector3(x1, y, z1));
      
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      p2.push(new THREE.Vector3(x2, y, z2));
      
      conns.push([new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2)]);
    }
    
    return { points1: p1, points2: p2, connections: conns };
  }, []);

  // Set up GSAP ScrollTrigger
  useEffect(() => {
    if (!groupRef.current) return;
    
    // We bind the scroll of the document body to the rotation of the group
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        if (groupRef.current) {
          // Scroll animation logic requested:
          // 25% -> 45 deg (PI/4), 50% -> 90 deg (PI/2), 75% -> 180 deg (PI), 100% -> transitioning
          const progress = self.progress;
          // Apply a non-linear rotation based on progress or simple linear scaling
          // We'll rotate around the Y and X axes to simulate flying through or inspecting
          groupRef.current.rotation.y = progress * Math.PI; // Up to 180 degrees
          groupRef.current.position.z = progress * 10; // Moves closer/through the camera as we enter dashboard
          groupRef.current.position.y = progress * 5; 
        }
      }
    });
    
    return () => {
      trigger.kill();
    };
  }, []);

  // Continuous rotation and mouse interaction
  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    // Continuous idle rotation
    groupRef.current.rotation.y += 0.002;
    
    // Mouse subtle parallax
    const targetX = (mouse.x * Math.PI) / 10;
    const targetY = (mouse.y * Math.PI) / 10;
    
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z += (-targetX - groupRef.current.rotation.z) * 0.05;
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  
  const blueMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0F4C81,
    metalness: 0.2,
    roughness: 0.2,
    transmission: 0.8,
    thickness: 0.5,
    envMapIntensity: 1.5,
  });

  const connectionMaterial = new THREE.MeshStandardMaterial({
    color: 0x2563EB,
    transparent: true,
    opacity: 0.3,
    roughness: 0.4,
  });

  return (
    <group ref={groupRef} position={[4, 0, -5]} rotation={[0.2, 0, -0.2]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Strand 1 */}
        {points1.map((pos, i) => (
          <mesh key={`p1-${i}`} position={pos} material={glassMaterial}>
            <sphereGeometry args={[0.3, 32, 32]} />
          </mesh>
        ))}
        
        {/* Strand 2 */}
        {points2.map((pos, i) => (
          <mesh key={`p2-${i}`} position={pos} material={blueMaterial}>
            <sphereGeometry args={[0.3, 32, 32]} />
          </mesh>
        ))}
        
        {/* Connections */}
        {connections.map((conn, i) => {
          const midPoint = new THREE.Vector3().addVectors(conn[0], conn[1]).multiplyScalar(0.5);
          const distance = conn[0].distanceTo(conn[1]);
          return (
            <mesh 
              key={`conn-${i}`} 
              position={midPoint} 
              material={connectionMaterial}
              quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(conn[1], conn[0]).normalize())}
            >
              <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

export default function DnaBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#14B8A6" />
        <Environment preset="city" />
        <DnaHelix />
      </Canvas>
    </div>
  );
}
