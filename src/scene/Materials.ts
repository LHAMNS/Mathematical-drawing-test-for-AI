import * as THREE from 'three';

const createMetalTexture = (color: string, highlight: string) => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, highlight);
  gradient.addColorStop(1, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < size; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - size, size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

export const materials = {
  brass: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c9a74e'),
    metalness: 0.9,
    roughness: 0.25,
    map: createMetalTexture('#8a6b24', '#d6bb6e')
  }),
  steel: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b6c0cc'),
    metalness: 0.8,
    roughness: 0.3,
    map: createMetalTexture('#3d4b5c', '#c5ced8')
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#9fd3ff'),
    transparent: true,
    transmission: 0.85,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0,
    clearcoat: 0.2
  }),
  wood: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5c3b2a'),
    metalness: 0.1,
    roughness: 0.8
  }),
  plate: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#202733'),
    metalness: 0.6,
    roughness: 0.4
  }),
  highlight: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#70e0ff'),
    emissive: new THREE.Color('#6cf1ff'),
    emissiveIntensity: 1.2,
    metalness: 0.2,
    roughness: 0.2
  })
};

export const cloneMaterialWithOpacity = (material: THREE.Material, opacity: number) => {
  const cloned = material.clone();
  if ('opacity' in cloned) {
    cloned.transparent = opacity < 1;
    cloned.opacity = opacity;
  }
  return cloned;
};
