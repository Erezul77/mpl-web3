// src/ui/components/VoxelLayers3D.tsx
// React + Three.js multi-layer instanced renderer (Stage 1T)

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { layersBridge } from '../../engine/layersBridge';
import { useLayerConfig } from '../state/layerConfig';
import { useVoxelSelection } from '../hooks/useVoxelSelection';
import { colorForChannel } from '../state/visConfig';
import type { LayerSnapshot } from '../../engine/layersBridge';

type Props = { className?: string; voxelSize?: number };

function MultiLayerInstancedVoxels({ voxelSize = 0.9 }: { voxelSize?: number }) {
  const meshRefs = useRef<Map<string, THREE.InstancedMesh>>(new Map());
  const [version, setVersion] = useState<number>(0);
  const [layers, setLayers] = useState<LayerSnapshot[]>([]);
  const [commonSize, setCommonSize] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const { getEffectiveOpacity, getEffectiveVisibility } = useLayerConfig();
  const { setSelection } = useVoxelSelection();

  // Update from layersBridge on every rAF if version changed
  useFrame(() => {
    const { version: v, layers: currentLayers } = layersBridge.getLayers();
    if (v === version && layers.length > 0) return; // no changes

    if (currentLayers.length === 0) return;

    // Validate that all layers have the same dimensions
    if (!layersBridge.validateLayerDimensions()) {
      console.warn('Layers have different dimensions, using first layer size');
    }

    const size = layersBridge.getCommonSize();
    if (!size) return;

    setLayers(currentLayers);
    setCommonSize(size);
    setVersion(v);

    // Update each layer's instanced mesh
    currentLayers.forEach(layer => {
      const meshRef = meshRefs.current.get(layer.id);
      if (!meshRef) return;

      const { size: layerSize, channel } = layer;
      const total = layerSize.x * layerSize.y * layerSize.z;
      
      if (total === 0) return;

      // Prepare instance matrices and colors
      const dummy = new THREE.Object3D();
      const colors = new Float32Array(total * 3);
      let idx = 0;
      
      for (let z = 0; z < layerSize.z; z++) {
        for (let y = 0; y < layerSize.y; y++) {
          for (let x = 0; x < layerSize.x; x++) {
            const i = x + y * layerSize.x + z * layerSize.x * layerSize.y;
            dummy.position.set(x, y, z);
            dummy.scale.setScalar(voxelSize);
            dummy.updateMatrix();
            meshRef.setMatrixAt(i, dummy.matrix);
            
            const c = colorForChannel(channel[i] || 0);
            colors[idx++] = c.r;
            colors[idx++] = c.g;
            colors[idx++] = c.b;
          }
        }
      }
      
      meshRef.instanceMatrix.needsUpdate = true;
      
      // Update colors
      if (!meshRef.instanceColor || meshRef.instanceColor.count !== total) {
        const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
        (meshRef as any).instanceColor = colorAttr;
      } else {
        (meshRef as any).instanceColor.array.set(colors);
        (meshRef as any).instanceColor.needsUpdate = true;
      }
    });
  });

  // Handle raycast selection (click on voxels)
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!e.instanceId) return;
      
      const instId: number = e.instanceId;
      const { layers: currentLayers } = layersBridge.getLayers();
      if (currentLayers.length === 0) return;
      
      const size = layersBridge.getCommonSize();
      if (!size) return;
      
      const { x: sx, y: sy, z: sz } = size;
      const z = Math.floor(instId / (sx * sy));
      const y = Math.floor((instId - z * sx * sy) / sx);
      const x = instId - z * sx * sy - y * sx;
      
      setSelection({ x, y, z });
    };

    // Add click handlers to all meshes
    meshRefs.current.forEach(mesh => {
      (mesh as any).addEventListener?.('click', handleClick);
    });

    return () => {
      meshRefs.current.forEach(mesh => {
        (mesh as any).removeEventListener?.('click', handleClick);
      });
    };
  }, [setSelection]);

  // Create or update instanced meshes for each layer
  useEffect(() => {
    layers.forEach(layer => {
      const { id, size: layerSize } = layer;
      const total = layerSize.x * layerSize.y * layerSize.z;
      
      if (total === 0) return;

      let meshRef = meshRefs.current.get(id);
      
      if (!meshRef) {
        // Create new instanced mesh for this layer
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const newMaterial = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: getEffectiveOpacity(id),
          vertexColors: true,
        });
        
        meshRef = new THREE.InstancedMesh(geometry, newMaterial, total);
        meshRefs.current.set(id, meshRef);
      }
      
      // Update material properties
      const material = meshRef.material as THREE.MeshStandardMaterial;
      material.opacity = getEffectiveOpacity(id);
      material.transparent = getEffectiveOpacity(id) < 1.0;
      material.visible = getEffectiveVisibility(id);
    });
  }, [layers, getEffectiveOpacity, getEffectiveVisibility]);

  if (layers.length === 0) return null;

  const center = new THREE.Vector3(
    (commonSize.x - 1) / 2, 
    (commonSize.y - 1) / 2, 
    (commonSize.z - 1) / 2
  );

  return (
    <group position={center.clone().multiplyScalar(-1)}>
      {Array.from(meshRefs.current.values()).map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))}
    </group>
  );
}

export default function VoxelLayers3D({ className, voxelSize = 0.9 }: Props) {
  const bg = '#0b0b0b';
  
  // Debug: Check what layersBridge has
  useEffect(() => {
    console.log('VoxelLayers3D mounted, layersBridge state:', {
      hasProvider: layersBridge.hasProvider(),
      layers: layersBridge.getLayers()
    });
  }, []);
  
  return (
    <div className={className} style={{ background: bg }}>
      <Canvas camera={{ position: [12, 14, 16], near: 0.1, far: 2000 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <MultiLayerInstancedVoxels voxelSize={voxelSize} />
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

