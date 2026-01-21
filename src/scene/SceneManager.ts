import * as THREE from 'three';
import { ClockModel, ComponentConfig } from './ClockModel';
import { materials, cloneMaterialWithOpacity } from './Materials';
import { easeInOutCubic, lerp } from '../utils/math';

export class SceneManager {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clockModel: ClockModel;
  target = new THREE.Vector3(0, 0.6, 0);
  private canvas: HTMLCanvasElement;
  private shellOpen = 0;
  private materialMap = new Map<THREE.Mesh, THREE.Material>();
  private focusIds: string[] = [];
  private xray = false;
  private exploded = false;
  private orbit = {
    azimuth: 0.5,
    polar: 0.9,
    radius: 12
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene.background = new THREE.Color('#0d111a');
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    this.camera.position.set(8, 6, 12);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;

    this.clockModel = new ClockModel();
    this.scene.add(this.clockModel.group);

    this.addLights();
    this.captureMaterials();
    this.setupEvents();
  }

  private addLights() {
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.2);
    keyLight.position.set(6, 8, 6);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#8fb6ff', 0.6);
    fillLight.position.set(-6, 4, -4);
    this.scene.add(fillLight);

    const ambient = new THREE.AmbientLight('#4a5160', 0.8);
    this.scene.add(ambient);
  }

  private captureMaterials() {
    this.clockModel.components.forEach((component) => {
      component.meshes.forEach((mesh) => {
        this.materialMap.set(mesh, mesh.material as THREE.Material);
      });
    });
  }

  private setupEvents() {
    const onResize = () => {
      const { clientWidth, clientHeight } = this.canvas;
      this.renderer.setSize(clientWidth, clientHeight, false);
      this.camera.aspect = clientWidth / clientHeight;
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
    onResize();

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    this.canvas.addEventListener('pointerdown', (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
    });
    window.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const dx = (event.clientX - lastX) * 0.005;
      const dy = (event.clientY - lastY) * 0.005;
      this.orbit.azimuth += dx;
      this.orbit.polar = THREE.MathUtils.clamp(this.orbit.polar + dy, 0.3, 1.4);
      lastX = event.clientX;
      lastY = event.clientY;
    });
    this.canvas.addEventListener('wheel', (event) => {
      this.orbit.radius = THREE.MathUtils.clamp(this.orbit.radius + event.deltaY * 0.01, 8, 18);
    });
  }

  update(delta: number) {
    const x = this.orbit.radius * Math.sin(this.orbit.polar) * Math.cos(this.orbit.azimuth);
    const z = this.orbit.radius * Math.sin(this.orbit.polar) * Math.sin(this.orbit.azimuth);
    const y = this.orbit.radius * Math.cos(this.orbit.polar) + 3.5;
    this.camera.position.lerp(new THREE.Vector3(x, y, z), 0.1);
    this.camera.lookAt(this.target);

    this.applyShell();
    this.applyExploded();
    this.renderer.render(this.scene, this.camera);
  }

  setFocus(ids: string[]) {
    this.focusIds = ids;
    this.clockModel.components.forEach((component) => {
      const isFocused = ids.includes(component.id);
      component.meshes.forEach((mesh) => {
        if (isFocused) {
          mesh.material = materials.highlight;
        } else if (this.xray) {
          mesh.material = cloneMaterialWithOpacity(this.materialMap.get(mesh) ?? materials.plate, 0.2);
        } else {
          mesh.material = this.materialMap.get(mesh) ?? materials.plate;
        }
      });
    });
  }

  setShellOpen(progress: number) {
    this.shellOpen = THREE.MathUtils.clamp(progress, 0, 1);
  }

  setXRay(enabled: boolean) {
    this.xray = enabled;
    this.setFocus(this.focusIds);
  }

  setExploded(enabled: boolean) {
    this.exploded = enabled;
  }

  private applyShell() {
    const eased = easeInOutCubic(this.shellOpen);
    this.clockModel.shellGroup.position.y = lerp(0, 3.5, eased);
    this.clockModel.shellGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && 'opacity' in child.material) {
        child.material.transparent = true;
        child.material.opacity = lerp(1, 0, eased);
      }
    });
  }

  private applyExploded() {
    if (!this.exploded) {
      this.clockModel.components.forEach((component) => {
        component.meshes.forEach((mesh) => mesh.position.lerp(component.focusTarget.position, 0.2));
      });
      return;
    }
    this.clockModel.components.forEach((component) => {
      const direction = component.focusTarget.position.clone().normalize();
      component.meshes.forEach((mesh) => {
        const target = component.focusTarget.position.clone().add(direction.multiplyScalar(0.6));
        mesh.position.lerp(target, 0.1);
      });
    });
  }

  setCameraTarget(position: THREE.Vector3, lookAt: THREE.Vector3) {
    this.target.copy(lookAt);
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(position.clone().sub(lookAt));
    this.orbit.radius = spherical.radius;
    this.orbit.polar = spherical.phi;
    this.orbit.azimuth = spherical.theta;
  }

  getComponentById(id: string): ComponentConfig | undefined {
    return this.clockModel.components.find((component) => component.id === id);
  }
}
