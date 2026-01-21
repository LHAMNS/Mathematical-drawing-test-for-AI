import * as THREE from 'three';
import { SegmentDefinition } from '../scene/AnimationSystem';

export const segments: SegmentDefinition[] = [
  {
    id: 'intro',
    titleCN: '开场：发条驱动机械钟概览',
    titleEN: 'Intro: Spring-Driven Mechanical Clock',
    bodyCN: '这台桌面机械钟以发条储能，通过轮系、擒纵与摆轮游丝释放能量，最终驱动指针走时。',
    bodyEN: 'This desk clock stores energy in a mainspring, sends it through the gear train, regulates it with the escapement and balance, and finally drives the hands.',
    formula: '\\omega_{out} = \\omega_{in} \\prod \\frac{Z_{driver}}{Z_{driven}}',
    formulaCaptionCN: '齿轮链条决定角速度传递。',
    formulaCaptionEN: 'The gear train sets the angular speed ratio.',
    focus: ['barrel', 'center-wheel', 'third-wheel', 'fourth-wheel', 'escape-wheel', 'balance', 'motion-works', 'dial'],
    cameraPosition: new THREE.Vector3(10, 7, 12),
    cameraTarget: new THREE.Vector3(0, 0.8, 0),
    duration: 8,
    demo: {
      speedMultiplier: 0.6,
      escapementSteps: 2
    }
  },
  {
    id: 'shell',
    titleCN: '外壳移除',
    titleEN: 'Case Opening',
    bodyCN: '玻璃罩上升，露出机芯框架，便于观察内部的传动链路。',
    bodyEN: 'The glass cover lifts to reveal the movement frame for inspection.',
    formula: '\\Delta h = h_{open} - h_{close}',
    formulaCaptionCN: '外壳上升距离控制视线。',
    formulaCaptionEN: 'The cover translates upward for a clear view.',
    focus: ['barrel', 'center-wheel', 'third-wheel', 'fourth-wheel'],
    cameraPosition: new THREE.Vector3(7, 6, 9),
    cameraTarget: new THREE.Vector3(0, 0.8, 0),
    duration: 6,
    demo: {
      speedMultiplier: 0.6,
      escapementSteps: 2
    }
  },
  {
    id: 'mainspring',
    titleCN: '发条储能',
    titleEN: 'Mainspring Energy Storage',
    bodyCN: '发条在条盒内卷紧，释放扭矩驱动中心轮。',
    bodyEN: 'The mainspring coils in the barrel and releases torque to the center wheel.',
    formula: '\\tau_{out} = \\tau_{in} \\cdot \\eta',
    formulaCaptionCN: '理想情况下扭矩经效率系数传递。',
    formulaCaptionEN: 'Torque is transferred with efficiency.',
    focus: ['barrel'],
    cameraPosition: new THREE.Vector3(4, 4, 8),
    cameraTarget: new THREE.Vector3(-3.2, 0.2, 0),
    duration: 8,
    demo: {
      speedMultiplier: 1,
      escapementSteps: 2
    }
  },
  {
    id: 'gear-train',
    titleCN: '轮系传动',
    titleEN: 'Gear Train Transmission',
    bodyCN: '中心轮、三轮、四轮交替啮合，方向反转并提升转速，为擒纵轮提供能量。',
    bodyEN: 'The center, third, and fourth wheels mesh alternately, reversing direction and increasing speed to feed the escape wheel.',
    formula: '\\frac{\\omega_2}{\\omega_1} = -\\frac{Z_1}{Z_2}',
    formulaCaptionCN: '齿轮啮合导致方向反转与速比变化。',
    formulaCaptionEN: 'Meshed gears reverse direction and change speed.',
    focus: ['center-wheel', 'third-wheel', 'fourth-wheel'],
    cameraPosition: new THREE.Vector3(6, 4.5, 5.5),
    cameraTarget: new THREE.Vector3(1.2, 0.4, 0.4),
    duration: 10,
    demo: {
      speedMultiplier: 1.3,
      escapementSteps: 3
    }
  },
  {
    id: 'escapement',
    titleCN: '擒纵机构',
    titleEN: 'Escapement',
    bodyCN: '擒纵轮被擒纵叉间歇释放，每一次释放都推动摆轮游丝振荡。',
    bodyEN: 'The escape wheel releases in steps, each tick impulses the balance spring.',
    formula: '\\Delta t = \\frac{1}{f_{esc}}',
    formulaCaptionCN: '擒纵的节拍决定释放间隔。',
    formulaCaptionEN: 'The escapement beat defines the interval.',
    focus: ['escape-wheel', 'anchor'],
    cameraPosition: new THREE.Vector3(5.5, 3.5, 6.5),
    cameraTarget: new THREE.Vector3(3.4, 0.2, 1.3),
    duration: 10,
    demo: {
      speedMultiplier: 1.2,
      escapementSteps: 5
    }
  },
  {
    id: 'balance',
    titleCN: '摆轮游丝振荡',
    titleEN: 'Balance & Hairspring Oscillation',
    bodyCN: '摆轮游丝构成振子，周期决定走时基准，与擒纵节拍锁定。',
    bodyEN: 'The balance and hairspring form an oscillator whose period regulates timekeeping.',
    formula: 'T = 2\\pi\\sqrt{\\frac{I}{k}}',
    formulaCaptionCN: '振荡周期由转动惯量与游丝刚度决定。',
    formulaCaptionEN: 'Period depends on inertia and spring stiffness.',
    focus: ['balance'],
    cameraPosition: new THREE.Vector3(6.2, 4.2, 10.5),
    cameraTarget: new THREE.Vector3(4.1, 0.2, 3.1),
    duration: 10,
    demo: {
      speedMultiplier: 0.9,
      escapementSteps: 6
    }
  },
  {
    id: 'motion-works',
    titleCN: '走针机构',
    titleEN: 'Motion Works',
    bodyCN: '轮系的输出经走针机构减速，确保分针与时针有正确的速比。',
    bodyEN: 'The motion works reduce speed so the minute and hour hands keep correct ratios.',
    formula: '\\omega_{hour} = \\frac{1}{12} \\omega_{minute}',
    formulaCaptionCN: '时针速度为分针的 1/12。',
    formulaCaptionEN: 'Hour hand speed is 1/12 of the minute hand.',
    focus: ['motion-works'],
    cameraPosition: new THREE.Vector3(4.5, 3.8, 7.2),
    cameraTarget: new THREE.Vector3(-0.6, 0.9, 0),
    duration: 8,
    demo: {
      speedMultiplier: 0.8,
      escapementSteps: 3
    }
  },
  {
    id: 'dial',
    titleCN: '表盘呈现',
    titleEN: 'Dial & Hands',
    bodyCN: '最终通过表盘与指针展示时间，秒针（若存在）直接来自四轮输出。',
    bodyEN: 'The dial and hands show the time, with the seconds driven by the fourth wheel.',
    formula: '\\omega_{second} = 60\\,\\omega_{minute}',
    formulaCaptionCN: '秒针与分针的速度关系。',
    formulaCaptionEN: 'Seconds hand moves 60x the minute hand.',
    focus: ['dial'],
    cameraPosition: new THREE.Vector3(3.5, 4.5, 5.5),
    cameraTarget: new THREE.Vector3(0, 1.3, 0),
    duration: 8,
    demo: {
      speedMultiplier: 0.9,
      escapementSteps: 2
    }
  },
  {
    id: 'summary',
    titleCN: '总结链路',
    titleEN: 'Summary',
    bodyCN: '能量储存 → 轮系传递 → 擒纵调速 → 指针显示，形成完整走时链路。',
    bodyEN: 'Energy storage → gear transmission → escapement regulation → hand display completes the chain.',
    formula: '\\text{Chain: } E \\rightarrow \\tau \\rightarrow \\omega \\rightarrow \\theta',
    formulaCaptionCN: '能量、扭矩、角速度与角位移相互关联。',
    formulaCaptionEN: 'Energy, torque, angular speed, and displacement connect.',
    focus: ['barrel', 'center-wheel', 'third-wheel', 'fourth-wheel', 'escape-wheel', 'balance', 'motion-works', 'dial'],
    cameraPosition: new THREE.Vector3(10, 7, 12),
    cameraTarget: new THREE.Vector3(0, 0.8, 0),
    duration: 8,
    demo: {
      speedMultiplier: 0.6,
      escapementSteps: 2
    }
  }
];
