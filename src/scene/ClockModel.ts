import * as THREE from 'three';
import { createGear } from './GearFactory';
import { materials } from './Materials';
import { gearConfig } from './gearConfig';

export interface ComponentConfig {
  id: string;
  nameCN: string;
  nameEN: string;
  meshes: THREE.Mesh[];
  focusTarget: THREE.Object3D;
  labelAnchor: THREE.Object3D;
}

export class ClockModel {
  group = new THREE.Group();
  shellGroup = new THREE.Group();
  components: ComponentConfig[] = [];
  private labelGroup = new THREE.Group();

  constructor() {
    this.group.add(this.shellGroup);
    this.group.add(this.labelGroup);
    this.buildShell();
    this.buildMovement();
  }

  private buildShell() {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.8, 1.2, 48), materials.wood);
    base.position.y = -2.4;
    this.shellGroup.add(base);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.4, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.3), materials.glass);
    dome.position.y = 1.5;
    this.shellGroup.add(dome);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.18, 16, 60), materials.steel);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.1;
    this.shellGroup.add(ring);
  }

  private buildMovement() {
    const frame = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.4, 0.6, 48), materials.plate);
    frame.position.y = -0.4;
    this.group.add(frame);

    const barrel = this.createComponent({
      id: 'barrel',
      nameCN: '发条盒',
      nameEN: 'Mainspring Barrel',
      geometry: new THREE.CylinderGeometry(1.2, 1.2, 0.7, 32),
      material: materials.brass,
      position: new THREE.Vector3(-3.2, 0.2, 0),
      labelOffset: new THREE.Vector3(-3.2, 1.6, 0)
    });

    const centerWheel = this.createGearComponent({
      id: 'center-wheel',
      nameCN: '中心轮',
      nameEN: 'Center Wheel',
      teeth: gearConfig.center.teeth,
      radius: gearConfig.center.radius,
      position: new THREE.Vector3(-0.8, 0.2, 0),
      labelOffset: new THREE.Vector3(-0.8, 1.6, 0)
    });

    const thirdWheel = this.createGearComponent({
      id: 'third-wheel',
      nameCN: '三轮',
      nameEN: 'Third Wheel',
      teeth: gearConfig.third.teeth,
      radius: gearConfig.third.radius,
      position: new THREE.Vector3(1.5, 0.15, 0.8),
      labelOffset: new THREE.Vector3(1.5, 1.6, 0.8)
    });

    const fourthWheel = this.createGearComponent({
      id: 'fourth-wheel',
      nameCN: '四轮',
      nameEN: 'Fourth Wheel',
      teeth: gearConfig.fourth.teeth,
      radius: gearConfig.fourth.radius,
      position: new THREE.Vector3(2.9, 0.1, -0.4),
      labelOffset: new THREE.Vector3(2.9, 1.4, -0.4)
    });

    const escapeWheel = this.createGearComponent({
      id: 'escape-wheel',
      nameCN: '擒纵轮',
      nameEN: 'Escape Wheel',
      teeth: gearConfig.escape.teeth,
      radius: gearConfig.escape.radius,
      position: new THREE.Vector3(3.8, 0.1, 1.1),
      labelOffset: new THREE.Vector3(3.8, 1.3, 1.1)
    });

    const anchor = this.createComponent({
      id: 'anchor',
      nameCN: '擒纵叉',
      nameEN: 'Pallet Fork',
      geometry: new THREE.BoxGeometry(1.2, 0.2, 0.3),
      material: materials.steel,
      position: new THREE.Vector3(3.2, 0.2, 1.7),
      labelOffset: new THREE.Vector3(3.2, 1.4, 1.7)
    });

    const balanceWheel = this.createComponent({
      id: 'balance',
      nameCN: '摆轮游丝',
      nameEN: 'Balance & Hairspring',
      geometry: new THREE.TorusGeometry(1.1, 0.08, 16, 60),
      material: materials.steel,
      position: new THREE.Vector3(4.1, 0.2, 3.1),
      labelOffset: new THREE.Vector3(4.1, 1.6, 3.1)
    });

    const hairspring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(this.createSpiralPoints(0.1, 0.9, 120)),
      new THREE.LineBasicMaterial({ color: '#8fd4ff' })
    );
    hairspring.position.copy(balanceWheel.meshes[0].position);
    hairspring.rotation.x = Math.PI / 2;
    this.group.add(hairspring);

    const motionWorks = this.createComponent({
      id: 'motion-works',
      nameCN: '走针机构',
      nameEN: 'Motion Works',
      geometry: new THREE.CylinderGeometry(0.8, 0.8, 0.35, 32),
      material: materials.brass,
      position: new THREE.Vector3(-0.6, 0.8, 0),
      labelOffset: new THREE.Vector3(-0.6, 2.0, 0)
    });

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.15, 48), materials.plate);
    dial.position.set(0, 1.4, 0);
    this.group.add(dial);

    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.12), materials.steel);
    hourHand.position.set(0.6, 1.5, 0);
    this.group.add(hourHand);

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 0.1), materials.steel);
    minuteHand.position.set(0.9, 1.55, 0.02);
    this.group.add(minuteHand);

    const secondHand = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 0.08), materials.brass);
    secondHand.position.set(1.1, 1.6, -0.02);
    this.group.add(secondHand);

    const dialComponent: ComponentConfig = {
      id: 'dial',
      nameCN: '表盘与指针',
      nameEN: 'Dial & Hands',
      meshes: [dial, hourHand, minuteHand, secondHand],
      focusTarget: dial,
      labelAnchor: dial
    };
    this.components.push(dialComponent);

    const bridges = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.15, 4.2), materials.plate);
    bridges.position.set(0.4, -0.1, 1.0);
    this.group.add(bridges);

    this.createLabelSprites();

    this.group.add(
      barrel.focusTarget,
      centerWheel.focusTarget,
      thirdWheel.focusTarget,
      fourthWheel.focusTarget,
      escapeWheel.focusTarget,
      anchor.focusTarget,
      balanceWheel.focusTarget,
      motionWorks.focusTarget
    );
  }

  private createComponent(options: {
    id: string;
    nameCN: string;
    nameEN: string;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: THREE.Vector3;
    labelOffset: THREE.Vector3;
  }) {
    const mesh = new THREE.Mesh(options.geometry, options.material);
    mesh.position.copy(options.position);
    this.group.add(mesh);
    const labelAnchor = new THREE.Object3D();
    labelAnchor.position.copy(options.labelOffset);
    this.group.add(labelAnchor);
    const config: ComponentConfig = {
      id: options.id,
      nameCN: options.nameCN,
      nameEN: options.nameEN,
      meshes: [mesh],
      focusTarget: mesh,
      labelAnchor
    };
    this.components.push(config);
    return config;
  }

  private createGearComponent(options: {
    id: string;
    nameCN: string;
    nameEN: string;
    teeth: number;
    radius: number;
    position: THREE.Vector3;
    labelOffset: THREE.Vector3;
  }) {
    const geometry = createGear({
      teeth: options.teeth,
      innerRadius: options.radius * 0.5,
      outerRadius: options.radius,
      thickness: 0.3,
      holeRadius: options.radius * 0.3
    });
    const mesh = new THREE.Mesh(geometry, materials.brass);
    mesh.position.copy(options.position);
    this.group.add(mesh);

    const labelAnchor = new THREE.Object3D();
    labelAnchor.position.copy(options.labelOffset);
    this.group.add(labelAnchor);

    const config: ComponentConfig = {
      id: options.id,
      nameCN: options.nameCN,
      nameEN: options.nameEN,
      meshes: [mesh],
      focusTarget: mesh,
      labelAnchor
    };
    this.components.push(config);
    return config;
  }

  private createSpiralPoints(inner: number, outer: number, points: number) {
    const result: THREE.Vector3[] = [];
    const turns = 5;
    for (let i = 0; i < points; i += 1) {
      const t = i / (points - 1);
      const angle = turns * Math.PI * 2 * t;
      const radius = inner + (outer - inner) * t;
      result.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return result;
  }

  private createLabelSprites() {
    this.labelGroup.clear();
    this.components.forEach((component) => {
      const sprite = this.createLabelSprite(`${component.nameCN}\n${component.nameEN}`);
      sprite.position.copy(component.labelAnchor.position);
      sprite.visible = false;
      this.labelGroup.add(sprite);
      component.labelAnchor.userData.sprite = sprite;
    });
  }

  private createLabelSprite(text: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    canvas.width = 256;
    canvas.height = 128;
    ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e8f4ff';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index - 0.5) * 24);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.6, 0.8, 1);
    return sprite;
  }

  setLabelsVisible(visible: boolean) {
    this.components.forEach((component) => {
      const sprite = component.labelAnchor.userData.sprite as THREE.Sprite | undefined;
      if (sprite) {
        sprite.visible = visible;
      }
    });
  }
}
