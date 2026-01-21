import './styles/main.css';
import * as THREE from 'three';
import { SceneManager } from './scene/SceneManager';
import { AnimationSystem } from './scene/AnimationSystem';
import { UIController } from './ui/UIController';
import { segments } from './ui/segments';
import { clamp, smoothstep } from './utils/math';

const canvas = document.querySelector<HTMLCanvasElement>('#scene');
if (!canvas) {
  throw new Error('Canvas element not found');
}

const sceneManager = new SceneManager(canvas);
const animationSystem = new AnimationSystem(sceneManager.clockModel);

const ui = new UIController(segments, (id) => {
  const index = segments.findIndex((segment) => segment.focus.includes(id));
  if (index >= 0) {
    setSegment(index);
  }
});

ui.bindControls({
  onPlayPause: () => {
    isPlaying = !isPlaying;
    ui.setPlayState(isPlaying);
  },
  onNext: () => setSegment(currentSegment + 1),
  onPrev: () => setSegment(currentSegment - 1),
  onReset: () => {
    currentSegment = 0;
    segmentTime = 0;
    totalElapsed = 0;
    isPlaying = false;
    ui.setPlayState(isPlaying);
    applySegment();
  },
  onSpeedChange: (speed) => {
    playbackSpeed = speed;
  }
});

const componentList = sceneManager.clockModel.components.map((component) => ({
  id: component.id,
  nameCN: component.nameCN,
  nameEN: component.nameEN
}));
ui.setComponentList(componentList);

let currentSegment = 0;
let segmentTime = 0;
let totalElapsed = 0;
let isPlaying = false;
let playbackSpeed = 1;

ui.setPlayState(isPlaying);

const xrayBtn = document.querySelector<HTMLButtonElement>('#xray-btn');
const explodeBtn = document.querySelector<HTMLButtonElement>('#explode-btn');
const labelsBtn = document.querySelector<HTMLButtonElement>('#labels-btn');

let xray = false;
let exploded = false;
let labelsVisible = false;

xrayBtn?.addEventListener('click', () => {
  xray = !xray;
  sceneManager.setXRay(xray);
});

explodeBtn?.addEventListener('click', () => {
  exploded = !exploded;
  sceneManager.setExploded(exploded);
});

labelsBtn?.addEventListener('click', () => {
  labelsVisible = !labelsVisible;
  sceneManager.clockModel.setLabelsVisible(labelsVisible);
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    isPlaying = !isPlaying;
    ui.setPlayState(isPlaying);
  }
  if (event.code === 'ArrowRight') {
    setSegment(currentSegment + 1);
  }
  if (event.code === 'ArrowLeft') {
    setSegment(currentSegment - 1);
  }
});

const setSegment = (index: number) => {
  currentSegment = clamp(index, 0, segments.length - 1);
  segmentTime = 0;
  applySegment();
};

const applySegment = () => {
  const segment = segments[currentSegment];
  ui.updateSegment(segment);
  sceneManager.setCameraTarget(segment.cameraPosition, segment.cameraTarget);
  sceneManager.setFocus(segment.focus);
};

applySegment();

const clock = new THREE.Clock();

const update = () => {
  const delta = clock.getDelta();
  if (isPlaying) {
    segmentTime += delta * playbackSpeed;
    totalElapsed += delta * playbackSpeed;
  }

  const segment = segments[currentSegment];
  if (segmentTime >= segment.duration) {
    if (currentSegment < segments.length - 1) {
      currentSegment += 1;
      segmentTime = 0;
      applySegment();
    } else {
      isPlaying = false;
      ui.setPlayState(isPlaying);
    }
  }

  const segmentProgress = clamp(segmentTime / segment.duration, 0, 1);
  if (segment.id === 'shell') {
    sceneManager.setShellOpen(smoothstep(0, 1, segmentProgress));
  } else if (segment.id === 'intro') {
    sceneManager.setShellOpen(0);
  } else {
    sceneManager.setShellOpen(1);
  }

  animationSystem.update(delta, segment, playbackSpeed);
  sceneManager.update(delta);

  const overall = (segments.slice(0, currentSegment).reduce((sum, s) => sum + s.duration, 0) + segmentTime) /
    segments.reduce((sum, s) => sum + s.duration, 0);
  ui.updateProgress(overall, currentSegment, segments.length);
  requestAnimationFrame(update);
};

update();
