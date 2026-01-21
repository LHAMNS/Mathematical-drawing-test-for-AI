import * as THREE from 'three';

interface GearOptions {
  teeth: number;
  innerRadius: number;
  outerRadius: number;
  thickness: number;
  holeRadius?: number;
}

export const createGear = ({ teeth, innerRadius, outerRadius, thickness, holeRadius }: GearOptions) => {
  const shape = new THREE.Shape();
  const toothDepth = (outerRadius - innerRadius) * 0.6;
  const toothAngle = (Math.PI * 2) / teeth;
  for (let i = 0; i <= teeth; i += 1) {
    const angle = i * toothAngle;
    const radius = i % 2 === 0 ? outerRadius : outerRadius - toothDepth;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  if (holeRadius) {
    const hole = new THREE.Path();
    hole.absellipse(0, 0, holeRadius, holeRadius, 0, Math.PI * 2, false, 0);
    shape.holes.push(hole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.1,
    bevelSize: 0.3,
    bevelSegments: 2
  });
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, -thickness / 2);
  geometry.computeVertexNormals();

  return geometry;
};
