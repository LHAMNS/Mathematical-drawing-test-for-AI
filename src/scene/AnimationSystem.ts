import * as THREE from 'three';
import { ClockModel } from './ClockModel';
import { gearConfig } from './gearConfig';

export interface SegmentDefinition {
  id: string;
  titleCN: string;
  titleEN: string;
  bodyCN: string;
  bodyEN: string;
  formula: string;
  formulaCaptionCN: string;
  formulaCaptionEN: string;
  focus: string[];
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  duration: number;
  demo: {
    speedMultiplier: number;
    escapementSteps: number;
  };
}

interface RotationMap {
  [key: string]: THREE.Object3D;
}

export class AnimationSystem {
  private clock: ClockModel;
  private rotationTargets: RotationMap;
  private baseSpeed = 0.4;
  private time = 0;

  constructor(clock: ClockModel) {
    this.clock = clock;
    this.rotationTargets = {
      barrel: clock.components.find((c) => c.id === 'barrel')?.meshes[0] ?? clock.group,
      'center-wheel': clock.components.find((c) => c.id === 'center-wheel')?.meshes[0] ?? clock.group,
      'third-wheel': clock.components.find((c) => c.id === 'third-wheel')?.meshes[0] ?? clock.group,
      'fourth-wheel': clock.components.find((c) => c.id === 'fourth-wheel')?.meshes[0] ?? clock.group,
      'escape-wheel': clock.components.find((c) => c.id === 'escape-wheel')?.meshes[0] ?? clock.group,
      anchor: clock.components.find((c) => c.id === 'anchor')?.meshes[0] ?? clock.group,
      balance: clock.components.find((c) => c.id === 'balance')?.meshes[0] ?? clock.group,
      'motion-works': clock.components.find((c) => c.id === 'motion-works')?.meshes[0] ?? clock.group,
      dial: clock.components.find((c) => c.id === 'dial')?.meshes[0] ?? clock.group
    };
  }

  update(delta: number, segment: SegmentDefinition, speed: number) {
    this.time += delta * speed;
    const multiplier = segment.demo.speedMultiplier;
    const barrelSpeed = this.baseSpeed * multiplier;
    const centerSpeed = -barrelSpeed * (gearConfig.barrelPinion.teeth / gearConfig.center.teeth);
    const thirdSpeed = -centerSpeed * (gearConfig.centerPinion.teeth / gearConfig.third.teeth);
    const fourthSpeed = -thirdSpeed * (gearConfig.thirdPinion.teeth / gearConfig.fourth.teeth);
    const escapeSpeed = -fourthSpeed * (gearConfig.fourthPinion.teeth / gearConfig.escape.teeth);

    this.rotationTargets.barrel.rotation.y += barrelSpeed * delta;
    this.rotationTargets['center-wheel'].rotation.y += centerSpeed * delta;
    this.rotationTargets['third-wheel'].rotation.y += thirdSpeed * delta;
    this.rotationTargets['fourth-wheel'].rotation.y += fourthSpeed * delta;

    const stepRate = segment.demo.escapementSteps;
    const step = Math.floor(this.time * stepRate);
    this.rotationTargets['escape-wheel'].rotation.y = step * (Math.PI / 6) + escapeSpeed * delta * 0.02;
    this.rotationTargets.anchor.rotation.z = Math.sin(this.time * stepRate * 0.5) * 0.4;
    this.rotationTargets.balance.rotation.y = Math.sin(this.time * stepRate * 0.6) * 0.8;

    const motionWorksSpeed = barrelSpeed * 0.18;
    this.rotationTargets['motion-works'].rotation.y += motionWorksSpeed * delta;
  }
}
