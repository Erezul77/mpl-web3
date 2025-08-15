// src/ui/components/VoxelGrid3D.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { visBridge } from '../../engine/visBridge';
import { colorForChannel } from '../state/visConfig';
import { useVoxelSelection } from '../hooks/useVoxelSelection';

type Props = { className?: string; voxelSize?: number };

function InstancedVoxels({ voxelSize = 0.9 }: { voxelSize?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const [version, setVersion] = useState<number>(0);
  const [dims, setDims] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [count, setCount] = useState<number>(0);
  const { setSelection } = useVoxelSelection();

  // Update from visBridge on every rAF if version changed.
  useFrame(() => {
    const { version: v, snapshot } = visBridge.getSnapshot();
    if (!snapshot) return;
    if (v === version && count > 0) return; // no changes

    const { size, channel } = snapshot;
    const total = size.x * size.y * size.z;
    if (!meshRef.current || total === 0) return;

    // Prepare instance matrices and colors
    const dummy = new THREE.Object3D();
    const colors = new Float32Array(total * 3);
    let idx = 0;
    for (let z = 0; z < size.z; z++) {
      for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
          const i = x + y * size.x + z * size.x * size.y;
          dummy.position.set(x, y, z);
          dummy.scale.setScalar(voxelSize);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
          const c = colorForChannel(channel[i] || 0);
          colors[idx++] = c.r;
          colors[idx++] = c.g;
          colors[idx++] = c.b;
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    // @ts-ignore - create or update an instance color buffer
    if (!meshRef.current.instanceColor || meshRef.current.instanceColor.count !== total) {
      const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
      // @ts-ignore
      meshRef.current.instanceColor = colorAttr;
    } else {
      // @ts-ignore
      meshRef.current.instanceColor.array.set(colors);
      // @ts-ignore
      meshRef.current.instanceColor.needsUpdate = true;
    }

    setDims(size);
    setCount(total);
    setVersion(v);
  });

  // Raycast selection
  useEffect(() => {
    const handler = (e: any) => {
      if (!meshRef.current || !e.instanceId) return;
      const instId: number = e.instanceId;
      const { snapshot } = visBridge.getSnapshot();
      if (!snapshot) return;
      const { size } = snapshot;
      const sx = size.x, sy = size.y, sz = size.z;
      const z = Math.floor(instId / (sx * sy));
      const y = Math.floor((instId - z * sx * sy) / sx);
      const x = instId - z * sx * sy - y * sx;
      setSelection({ x, y, z });
    };
    // @ts-ignore
    meshRef.current?.addEventListener?.('click', handler);
    return () => {
      // @ts-ignore
      meshRef.current?.removeEventListener?.('click', handler);
    };
  }, [meshRef.current]);

  if (count === 0) {
    // Debug: Show what's happening
    console.log('InstancedVoxels: count is 0, snapshot:', visBridge.getSnapshot());
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>
    );
  }
  const center = new THREE.Vector3((dims.x - 1) / 2, (dims.y - 1) / 2, (dims.z - 1) / 2);

  return (
    <group position={center.clone().multiplyScalar(-1)}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    </group>
  );
}

export default function VoxelGrid3D({ className, voxelSize = 0.9 }: Props) {
  const bg = '#0b0b0b';
  
  // Debug: Check what visBridge has
  useEffect(() => {
    console.log('VoxelGrid3D mounted, visBridge state:', {
      hasProvider: visBridge.hasProvider(),
      snapshot: visBridge.getSnapshot()
    });
  }, []);
  
  return (
    <div className={className} style={{ background: bg }}>
      <Canvas camera={{ position: [12, 14, 16], near: 0.1, far: 2000 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <InstancedVoxels voxelSize={voxelSize} />
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
