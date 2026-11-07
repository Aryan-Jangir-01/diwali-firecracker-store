import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createRangoliTexture,
  createFireworkStarTexture,
  createSmokeTexture,
  createShockwaveTexture,
} from './three/textures';
import { createCracker3D, createDiyaModel } from './three/CrackerModels';
import { soundEngine } from './audio/soundEngine';

function disposeHierarchy(obj) {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material?.dispose();
      }
    }
  });
}

export default function Fireworks({
  selectedCracker,
  isLit,
  burstTrigger,
  cameraPreset = 'cinematic',
  autoRotate = false,
  atmosphere = 'midnight',
  sparklerWandMode = false,
  onSkyClick,
  onFuseClick,
  onReady,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentCrackerObj: null,
    currentCrackerMesh: null,
    diyas: [],
    bursts: [],
    continuousEmitters: [],
    smokePuffs: [],
    shockwaves: [],
    sparklerRibbon: [],
    fuseParticles: null,
    rocketFlight: null,
    cameraPreset,
    autoRotate,
    atmosphere,
    sparklerWandMode,
    isLit,
    starTexture: null,
    smokeTexture: null,
    shockwaveTexture: null,
    flashLight: null,
    ambientLight: null,
    moonLight: null,
  });

  stateRef.current.cameraPreset = cameraPreset;
  stateRef.current.autoRotate = autoRotate;
  stateRef.current.atmosphere = atmosphere;
  stateRef.current.sparklerWandMode = sparklerWandMode;
  stateRef.current.isLit = isLit;

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060512);
    scene.fog = new THREE.FogExp2(0x060512, 0.018);

    const camera = new THREE.PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 800);
    camera.position.set(0, 3.8, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    host.appendChild(renderer.domElement);

    // 2. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 2.4;
    controls.maxDistance = 35;
    controls.target.set(0, 1.2, 0);

    // Mobile touch controls optimization
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    renderer.domElement.style.touchAction = 'none';

    // 3. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x7c6999, 1.3);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xa5b4fc, 0.9);
    moonLight.position.set(12, 28, 12);
    scene.add(moonLight);

    // High intensity flash light for explosions
    const flashLight = new THREE.PointLight(0xffedd5, 0, 70, 1.4);
    flashLight.position.set(0, 4, 0);
    scene.add(flashLight);

    // 4. Floor & Ceremonial Rangoli
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0817,
      roughness: 0.3,
      metalness: 0.35,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Center Rangoli Disc
    const rangoliTex = createRangoliTexture();
    const rangoliGeo = new THREE.CircleGeometry(3.6, 64);
    const rangoliMat = new THREE.MeshStandardMaterial({
      map: rangoliTex,
      roughness: 0.35,
      metalness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    const rangoli = new THREE.Mesh(rangoliGeo, rangoliMat);
    rangoli.rotation.x = -Math.PI / 2;
    rangoli.position.y = 0.005;
    scene.add(rangoli);

    // Brass Pedestal for the selected cracker
    const pedestalGroup = new THREE.Group();
    const pedestalBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.55, 0.16, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 })
    );
    pedestalBase.position.y = 0.08;
    pedestalGroup.add(pedestalBase);

    const pedestalRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.04, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 })
    );
    pedestalRim.rotation.x = Math.PI / 2;
    pedestalRim.position.y = 0.16;
    pedestalGroup.add(pedestalRim);
    scene.add(pedestalGroup);

    // 5. Surrounding 3D Diyas with flickering oil flames
    const diyas = [];
    const diyaRadius = 3.9;
    const numDiyas = 8;
    for (let i = 0; i < numDiyas; i++) {
      const angle = (i * Math.PI * 2) / numDiyas;
      const dx = Math.cos(angle) * diyaRadius;
      const dz = Math.sin(angle) * diyaRadius;
      const diya = createDiyaModel(dx, 0.01, dz, 0.85);
      diya.mesh.rotation.y = -angle + Math.PI;
      scene.add(diya.mesh);
      diyas.push(diya);
    }

    // 6. Deep Night Sky Stars
    const starCount = 750;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 160;
      starPos[i * 3 + 1] = Math.random() * 75 + 2;
      starPos[i * 3 + 2] = -Math.random() * 110 - 6;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 7. Floating Diwali Akash Kandils (Paper Lanterns)
    const lanterns = [];
    for (let i = 0; i < 14; i++) {
      const lanternGroup = new THREE.Group();
      const lx = (Math.random() - 0.5) * 65;
      const ly = 12 + Math.random() * 26;
      const lz = -14 - Math.random() * 42;
      lanternGroup.position.set(lx, ly, lz);

      const lGeo = new THREE.OctahedronGeometry(0.68, 0);
      const lMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff9900 : 0xff3366,
      });
      const lMesh = new THREE.Mesh(lGeo, lMat);
      lanternGroup.add(lMesh);

      const lLight = new THREE.PointLight(0xffaa33, 1.2, 12);
      lanternGroup.add(lLight);

      scene.add(lanternGroup);
      lanterns.push({
        group: lanternGroup,
        baseY: ly,
        speed: 0.2 + Math.random() * 0.4,
        sway: 0.5 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // 8. Distant Palace Silhouettes
    for (let i = 0; i < 22; i++) {
      const h = 2 + Math.random() * 6;
      const w = 1.2 + Math.random() * 2.4;
      const bGeo = new THREE.BoxGeometry(w, h, 1.2);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x140e29,
        roughness: 0.9,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(-26 + i * 2.5, h / 2 - 0.05, -28);
      scene.add(bMesh);

      if (i % 2 === 0) {
        const domeGeo = new THREE.SphereGeometry(w * 0.4, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, bMat);
        dome.position.set(-26 + i * 2.5, h - 0.05, -28);
        scene.add(dome);
      }
    }

    // High quality procedural particle textures
    const starTexture = createFireworkStarTexture();
    const smokeTexture = createSmokeTexture();
    const shockwaveTexture = createShockwaveTexture();

    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.renderer = renderer;
    stateRef.current.controls = controls;
    stateRef.current.diyas = diyas;
    stateRef.current.starTexture = starTexture;
    stateRef.current.smokeTexture = smokeTexture;
    stateRef.current.shockwaveTexture = shockwaveTexture;
    stateRef.current.flashLight = flashLight;

    // Distinguish click from camera orbit drag
    let downPos = { x: 0, y: 0 };
    const handlePointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerUp = (e) => {
      if (e.target !== renderer.domElement) return;
      const threshold = e.pointerType === 'touch' ? 18 : 8;
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > threshold) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Click in upper sky region
      if (mouse.y > -0.15) {
        raycaster.setFromCamera(mouse, camera);
        const skyPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 6);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(skyPlane, target);

        if (target) {
          const colors = ['#f59e0b', '#ef4444', '#38bdf8', '#10b981', '#ec4899', '#fbbf24', '#f43f5e'];
          const randColor = colors[Math.floor(Math.random() * colors.length)];
          triggerSpectacularSkyBurst(target.x, Math.max(3.8, target.y), target.z, randColor, '#ffffff', 'chrysanthemum');
          soundEngine.playSkyBurst();
          onSkyClick?.({ x: target.x, y: target.y });
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    let rafId = null;

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const timeSec = now * 0.001;

      controls.autoRotate = stateRef.current.autoRotate;
      controls.autoRotateSpeed = 1.2;
      controls.update();

      diyas.forEach((diya) => diya.update(timeSec));

      lanterns.forEach((l) => {
        l.group.position.y = l.baseY + Math.sin(timeSec * l.speed + l.offset) * l.sway;
        l.group.rotation.y += 0.005;
      });

      starField.rotation.y = timeSec * 0.015;

      updateFuseParticles(timeSec, delta);
      updateContinuousEmitters(delta);
      updateActiveBursts(delta);
      updateSmokePuffs(delta);
      updateShockwaves(delta);

      if (flashLight.intensity > 0) {
        flashLight.intensity = Math.max(0, flashLight.intensity - delta * 45);
      }

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    onReady?.({
      triggerSkyBurst: triggerSpectacularSkyBurst,
      cameraPreset: applyCameraPreset,
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  const applyCameraPreset = (preset) => {
    const { camera, controls } = stateRef.current;
    if (!camera || !controls) return;

    if (preset === 'cinematic') {
      camera.position.set(0, 3.8, 8.5);
      controls.target.set(0, 1.2, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 10.5, 0.2);
      controls.target.set(0, 0, 0);
    } else if (preset === 'sky') {
      camera.position.set(0, 2.5, 9.5);
      controls.target.set(0, 8.0, -8);
    } else if (preset === 'closeup') {
      camera.position.set(0, 1.6, 3.8);
      controls.target.set(0, 0.9, 0);
    }
  };

  useEffect(() => {
    applyCameraPreset(cameraPreset);
  }, [cameraPreset]);

  // Update Cracker 3D Model when selection changes
  useEffect(() => {
    const { scene } = stateRef.current;
    if (!scene || !selectedCracker) return;

    if (stateRef.current.currentCrackerMesh) {
      scene.remove(stateRef.current.currentCrackerMesh);
      disposeHierarchy(stateRef.current.currentCrackerMesh);
      stateRef.current.currentCrackerMesh = null;
      stateRef.current.currentCrackerObj = null;
    }

    const crackerObj = createCracker3D(selectedCracker);
    crackerObj.mesh.position.set(0, 0.16, 0);
    scene.add(crackerObj.mesh);

    stateRef.current.currentCrackerObj = crackerObj;
    stateRef.current.currentCrackerMesh = crackerObj.mesh;

    clearFuseParticles();
  }, [selectedCracker]);

  useEffect(() => {
    if (isLit) {
      startFuseSizzle();
    } else {
      clearFuseParticles();
    }
  }, [isLit]);

  useEffect(() => {
    if (!burstTrigger || !burstTrigger.item) return;
    executeBurstAnimation(burstTrigger.item, burstTrigger);
  }, [burstTrigger]);

  function startFuseSizzle() {
    const { scene, currentCrackerObj, starTexture } = stateRef.current;
    if (!scene || !currentCrackerObj) return;

    clearFuseParticles();

    const fuseTip = currentCrackerObj.fuseTipPosition.clone();
    currentCrackerObj.mesh.localToWorld(fuseTip);

    const count = 90;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = fuseTip.x;
      pos[i * 3 + 1] = fuseTip.y;
      pos[i * 3 + 2] = fuseTip.z;
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 2.2,
          Math.random() * 2.6 + 0.6,
          (Math.random() - 0.5) * 2.2
        )
      );
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffaa22,
      map: starTexture,
      size: 0.35,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const fuseLight = new THREE.PointLight(0xff7700, 3.8, 6);
    fuseLight.position.copy(fuseTip);
    scene.add(fuseLight);

    stateRef.current.fuseParticles = {
      pts,
      vel,
      origin: fuseTip,
      light: fuseLight,
      count,
    };
  }

  function clearFuseParticles() {
    const { scene, fuseParticles } = stateRef.current;
    if (fuseParticles && scene) {
      scene.remove(fuseParticles.pts);
      scene.remove(fuseParticles.light);
      fuseParticles.pts.geometry.dispose();
      fuseParticles.pts.material.dispose();
      stateRef.current.fuseParticles = null;
    }
  }

  function updateFuseParticles(timeSec, delta) {
    const fp = stateRef.current.fuseParticles;
    if (!fp) return;

    const arr = fp.pts.geometry.attributes.position.array;
    for (let i = 0; i < fp.count; i++) {
      const v = fp.vel[i];
      v.y -= 4.2 * delta;
      arr[i * 3] += v.x * delta;
      arr[i * 3 + 1] += v.y * delta;
      arr[i * 3 + 2] += v.z * delta;

      if (arr[i * 3 + 1] < fp.origin.y - 0.2 || Math.random() < 0.08) {
        arr[i * 3] = fp.origin.x;
        arr[i * 3 + 1] = fp.origin.y;
        arr[i * 3 + 2] = fp.origin.z;
        v.set(
          (Math.random() - 0.5) * 2.4,
          Math.random() * 2.8 + 0.6,
          (Math.random() - 0.5) * 2.4
        );
      }
    }
    fp.pts.geometry.attributes.position.needsUpdate = true;
    fp.light.intensity = 2.8 + Math.sin(timeSec * 35) * 1.8;
  }

  // Master Burst Animation Dispatcher
  function executeBurstAnimation(cracker, triggerMeta = {}) {
    const { currentCrackerObj, flashLight } = stateRef.current;
    const cat = cracker.category;
    const color = triggerMeta.customColor || cracker.color || '#f59e0b';
    const secColor = triggerMeta.customSecColor || cracker.secondaryColor || '#ffffff';

    if (flashLight) {
      flashLight.color.set(color);
      flashLight.intensity = cat === 'Bombs' ? 65 : 28;
    }

    if (cat === 'Rockets') {
      launchRocketAscent(cracker, color, secColor);
    } else if (cat.includes('Fountain') || cat.includes('Anar')) {
      startContinuousFountain(cracker, color, secColor);
    } else if (cat === 'Chakri' || cat === 'Ground Spinners') {
      startContinuousChakri(cracker, color);
    } else if (cat === 'Phuljhari') {
      startContinuousSparkler(cracker, color);
    } else if (cat === 'Bombs') {
      triggerVisceralBombBlast(cracker, color);
    } else if (cat.includes('Ladi') || cat.includes('Strings')) {
      startLadiChainReaction(cracker, color);
    } else if (cat.includes('UFO') || cat.includes('Aerial Spinners')) {
      launchUfoFlight(cracker, color);
    } else if (cat.includes('Novelty') || cat.includes('Magic')) {
      startNoveltyEffect(cracker, color);
    } else if (cat === 'Sky Shots') {
      triggerSkyShotVolley(cracker, color, secColor);
    } else {
      triggerGrandFinale(cracker, color, secColor);
    }
  }

  // -----------------------------------------------------------
  // LADI CHAIN REACTION (Rapid-fire 1000 Wala popping chain)
  // -----------------------------------------------------------
  function startLadiChainReaction(cracker, colorHex) {
    const { scene, starTexture, flashLight } = stateRef.current;
    const countPops = 28;

    for (let p = 0; p < countPops; p++) {
      setTimeout(() => {
        if (!stateRef.current.scene) return;
        const angle = p * 0.45;
        const r = 0.3 + p * 0.035;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        // Flash Light Pulse
        if (flashLight) {
          flashLight.position.set(x, 0.4, z);
          flashLight.color.set(0xffe066);
          flashLight.intensity = 25;
        }

        // Mini Pop Spark Points
        const sparkCount = 35;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(sparkCount * 3);
        const vel = [];

        for (let i = 0; i < sparkCount; i++) {
          pos[i * 3] = x;
          pos[i * 3 + 1] = 0.25;
          pos[i * 3 + 2] = z;
          vel.push(
            new THREE.Vector3(
              (Math.random() - 0.5) * 4.0,
              Math.random() * 3.5 + 0.5,
              (Math.random() - 0.5) * 4.0
            )
          );
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          color: new THREE.Color(Math.random() > 0.5 ? colorHex : '#ffd700'),
          map: starTexture,
          size: 0.28,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const pts = new THREE.Points(geo, mat);
        scene.add(pts);

        stateRef.current.bursts.push({
          pts,
          vel,
          type: 'ladi_pop',
          age: 0,
          life: 0.65,
          gravity: 4.8,
        });

        // Small smoke puff every 3 pops
        if (p % 3 === 0) {
          spawnSmokePuff(x, 0.35, z, 2);
        }
      }, p * 85);
    }
  }

  // -----------------------------------------------------------
  // UFO / AERIAL SPINNER FLIGHT & SKY BURST
  // -----------------------------------------------------------
  function launchUfoFlight(cracker, colorHex) {
    const { currentCrackerObj, scene } = stateRef.current;
    if (!currentCrackerObj || !currentCrackerObj.projectileMesh) return;

    const ufoMesh = currentCrackerObj.projectileMesh;
    const startY = ufoMesh.position.y;

    stateRef.current.rocketFlight = {
      mesh: ufoMesh,
      startY,
      vy: 5.5,
      color: colorHex,
      secColor: '#ffffff',
    };
  }

  // -----------------------------------------------------------
  // NOVELTY & MAGIC (Dense Color Smoke / Cobra Serpent)
  // -----------------------------------------------------------
  function startNoveltyEffect(cracker, colorHex) {
    const { scene } = stateRef.current;
    const isSmoke = cracker.name.includes('Smoke') || cracker.name.includes('Torch');

    if (isSmoke) {
      // 12 continuous dense smoke puffs rising
      for (let s = 0; s < 14; s++) {
        setTimeout(() => {
          if (!stateRef.current.scene) return;
          spawnSmokePuff(0, 0.8 + s * 0.15, 0, 3);
        }, s * 160);
      }
    } else {
      // Cobra Snake wriggling dark ash rising
      for (let c = 0; c < 16; c++) {
        setTimeout(() => {
          if (!stateRef.current.scene) return;
          spawnSmokePuff((Math.random() - 0.5) * 0.2, 0.3 + c * 0.18, (Math.random() - 0.5) * 0.2, 2);
        }, c * 140);
      }
    }
  }

  // -----------------------------------------------------------
  // 1. ROCKET ASCENT WITH FIRE ENGINE & SMOKE TRAIL
  // -----------------------------------------------------------
  function launchRocketAscent(cracker, color, secColor) {
    const { currentCrackerObj, scene, starTexture } = stateRef.current;
    if (!currentCrackerObj || !currentCrackerObj.projectileMesh) return;

    const projectile = currentCrackerObj.projectileMesh;
    const startY = projectile.position.y;

    // Rocket exhaust tail particle system
    const tailCount = 120;
    const tailGeo = new THREE.BufferGeometry();
    const tailPos = new Float32Array(tailCount * 3);
    const tailVels = [];
    const tailAges = new Float32Array(tailCount);
    for (let i = 0; i < tailCount; i++) {
      tailPos[i * 3] = 0;
      tailPos[i * 3 + 1] = 0.2;
      tailPos[i * 3 + 2] = 0;
      tailVels.push(new THREE.Vector3((Math.random() - 0.5) * 0.8, -4 - Math.random() * 3, (Math.random() - 0.5) * 0.8));
      tailAges[i] = Math.random() * 0.3;
    }
    tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPos, 3));
    const tailMat = new THREE.PointsMaterial({
      color: 0xff8811,
      map: starTexture,
      size: 0.35,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tailPts = new THREE.Points(tailGeo, tailMat);
    scene.add(tailPts);

    stateRef.current.rocketFlight = {
      mesh: projectile,
      tailPts,
      tailVels,
      tailAges,
      startY,
      vy: 8.5,
      color,
      secColor,
    };
  }

  // -----------------------------------------------------------
  // 2. CONTINUOUS FOUNTAIN (Anar - Roars for 2.8s)
  // -----------------------------------------------------------
  function startContinuousFountain(cracker, colorHex, secColorHex) {
    const { scene, starTexture } = stateRef.current;
    const maxParticles = 900;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const vels = [];
    const lives = new Float32Array(maxParticles);
    const ages = new Float32Array(maxParticles);

    const c1 = new THREE.Color(colorHex);
    const c2 = new THREE.Color(secColorHex);

    for (let i = 0; i < maxParticles; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -100; // inactive below floor
      pos[i * 3 + 2] = 0;
      vels.push(new THREE.Vector3());
      lives[i] = 0;
      ages[i] = 1;

      const col = Math.random() > 0.4 ? c1 : c2;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      map: starTexture,
      size: 0.38,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // Eruption flash light on the ground
    const groundLight = new THREE.PointLight(colorHex, 4.5, 8);
    groundLight.position.set(0, 2.2, 0);
    scene.add(groundLight);

    stateRef.current.continuousEmitters.push({
      pts,
      vels,
      lives,
      ages,
      maxParticles,
      nextIdx: 0,
      groundLight,
      color1: c1,
      color2: c2,
      origin: new THREE.Vector3(0, 1.95, 0),
      duration: 2.8,
      elapsed: 0,
      type: 'fountain',
    });
  }

  // -----------------------------------------------------------
  // 3. CONTINUOUS CHAKRI SPINNER (Rotates for 2.6s)
  // -----------------------------------------------------------
  function startContinuousChakri(cracker, colorHex) {
    const { scene, currentCrackerObj, starTexture } = stateRef.current;
    const spinnerMesh = currentCrackerObj?.spinnerMesh;
    const maxParticles = 650;

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(maxParticles * 3);
    const vels = [];
    const lives = new Float32Array(maxParticles);
    const ages = new Float32Array(maxParticles);

    for (let i = 0; i < maxParticles; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -100;
      pos[i * 3 + 2] = 0;
      vels.push(new THREE.Vector3());
      lives[i] = 0;
      ages[i] = 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colorHex),
      map: starTexture,
      size: 0.36,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const groundLight = new THREE.PointLight(colorHex, 3.5, 6);
    groundLight.position.set(0, 0.4, 0);
    scene.add(groundLight);

    stateRef.current.continuousEmitters.push({
      pts,
      vels,
      lives,
      ages,
      maxParticles,
      nextIdx: 0,
      spinnerMesh,
      groundLight,
      duration: 2.6,
      elapsed: 0,
      type: 'chakri',
    });
  }

  // -----------------------------------------------------------
  // 4. CONTINUOUS PHULJHARI (Sparkler - Radiates for 3.0s)
  // -----------------------------------------------------------
  function startContinuousSparkler(cracker, colorHex) {
    const { scene, starTexture } = stateRef.current;
    const maxParticles = 550;

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(maxParticles * 3);
    const vels = [];
    const lives = new Float32Array(maxParticles);
    const ages = new Float32Array(maxParticles);

    for (let i = 0; i < maxParticles; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -100;
      pos[i * 3 + 2] = 0;
      vels.push(new THREE.Vector3());
      lives[i] = 0;
      ages[i] = 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colorHex),
      map: starTexture,
      size: 0.34,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    stateRef.current.continuousEmitters.push({
      pts,
      vels,
      lives,
      ages,
      maxParticles,
      nextIdx: 0,
      origin: new THREE.Vector3(0, 3.0, 0),
      duration: 3.0,
      elapsed: 0,
      type: 'sparkler',
    });
  }

  // -----------------------------------------------------------
  // 5. VISCERAL BOMB BLAST (Shockwave, Flash, Smoke & Debris)
  // -----------------------------------------------------------
  function triggerVisceralBombBlast(cracker, colorHex) {
    const { scene, starTexture, shockwaveTexture, camera, currentCrackerObj, flashLight } = stateRef.current;

    // Blinding Flash
    if (flashLight) {
      flashLight.position.set(0, 1.0, 0);
      flashLight.color.set(0xffeedd);
      flashLight.intensity = 85;
    }

    // 1. Shockwave Ring Expanding on the Floor
    const swGeo = new THREE.PlaneGeometry(1, 1);
    const swMat = new THREE.MeshBasicMaterial({
      map: shockwaveTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(swGeo, swMat);
    shockwaveMesh.rotation.x = -Math.PI / 2;
    shockwaveMesh.position.set(0, 0.04, 0);
    scene.add(shockwaveMesh);

    stateRef.current.shockwaves.push({
      mesh: shockwaveMesh,
      scale: 1,
      maxScale: 15,
      age: 0,
      life: 0.65,
    });

    // 2. High-Velocity Blast Star Sparks
    const count = 650;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0.65;
      pos[i * 3 + 2] = 0;

      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const theta = Math.acos(costheta);
      const speed = 4.5 + Math.random() * 11.0;

      vel.push(
        new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi) * speed,
          Math.abs(Math.cos(theta) * speed) + 2.0,
          Math.sin(theta) * Math.sin(phi) * speed
        )
      );
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colorHex || '#ff4444'),
      map: starTexture,
      size: 0.42,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    stateRef.current.bursts.push({
      pts,
      vel,
      type: 'bomb',
      age: 0,
      life: 1.8,
      gravity: 5.5,
    });

    // 3. Smoke Puffs Rising from Blast Ground
    spawnSmokePuff(0, 0.5, 0, 8);

    // Momentarily hide bomb mesh
    if (currentCrackerObj?.mesh) {
      currentCrackerObj.mesh.visible = false;
      setTimeout(() => {
        if (currentCrackerObj?.mesh) currentCrackerObj.mesh.visible = true;
      }, 1600);
    }

    // Heavy Camera Shake
    const originalPos = camera.position.clone();
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      shakeCount++;
      const mag = (12 - shakeCount) * 0.045;
      camera.position.x = originalPos.x + (Math.random() - 0.5) * mag;
      camera.position.y = originalPos.y + (Math.random() - 0.5) * mag;
      if (shakeCount >= 12) {
        clearInterval(shakeInterval);
        camera.position.copy(originalPos);
      }
    }, 22);
  }

  // -----------------------------------------------------------
  // 6. SPECTACULAR MULTI-LAYER SKY BURSTS
  // -----------------------------------------------------------
  function triggerSpectacularSkyBurst(x, y, z, colorHex = '#f59e0b', secColorHex = '#ffffff', pattern = 'chrysanthemum') {
    const { scene, starTexture, flashLight } = stateRef.current;
    if (!scene) return;

    // Flash light trigger
    if (flashLight) {
      flashLight.position.set(x, y, z);
      flashLight.color.set(colorHex);
      flashLight.intensity = 42;
    }

    // 1. Primary Radiant Stars
    const starCount = pattern === 'willow' ? 480 : 360;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const vel = [];

    const c1 = new THREE.Color(colorHex);
    const c2 = new THREE.Color(secColorHex);

    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      const speed = (pattern === 'willow' ? 3.0 : 4.8) + Math.random() * 4.2;

      vel.push(
        new THREE.Vector3(
          r * Math.cos(phi) * speed,
          u * speed,
          r * Math.sin(phi) * speed
        )
      );

      const col = Math.random() > 0.35 ? c1 : c2;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      map: starTexture,
      size: 0.42,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    stateRef.current.bursts.push({
      pts,
      vel,
      type: 'sky',
      age: 0,
      life: pattern === 'willow' ? 2.8 : 2.0,
      gravity: pattern === 'willow' ? 1.6 : 2.4,
    });

    // 2. Trailing Smoke Cloud Puff at Detonation Point
    spawnSmokePuff(x, y, z, 5);
  }

  // Smoke Puff Generator
  function spawnSmokePuff(x, y, z, count = 4) {
    const { scene, smokeTexture } = stateRef.current;
    if (!scene || !smokeTexture) return;

    for (let i = 0; i < count; i++) {
      const geo = new THREE.PlaneGeometry(2.5, 2.5);
      const mat = new THREE.MeshBasicMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });
      const puff = new THREE.Mesh(geo, mat);
      puff.position.set(
        x + (Math.random() - 0.5) * 1.5,
        y + (Math.random() - 0.5) * 0.8,
        z + (Math.random() - 0.5) * 1.5
      );
      puff.rotation.z = Math.random() * Math.PI * 2;
      scene.add(puff);

      stateRef.current.smokePuffs.push({
        mesh: puff,
        age: 0,
        life: 2.2 + Math.random() * 0.8,
        vy: 0.6 + Math.random() * 0.4,
        scaleSpeed: 0.8 + Math.random() * 0.5,
      });
    }
  }

  function triggerSkyShotVolley(cracker, color, secColor) {
    const count = 4;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = (Math.random() - 0.5) * 6;
        const y = 9.0 + Math.random() * 4;
        const z = -2 - Math.random() * 5;
        triggerSpectacularSkyBurst(x, y, z, color, secColor, 'peony');
      }, i * 380);
    }
  }

  function triggerGrandFinale(cracker, color, secColor) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = (Math.random() - 0.5) * 12;
        const y = 9.5 + Math.random() * 5;
        const z = -3 - Math.random() * 6;
        const colors = [color, secColor, '#fbbf24', '#38bdf8', '#f43f5e'];
        const col = colors[i % colors.length];
        triggerSpectacularSkyBurst(x, y, z, col, '#ffffff', i % 2 === 0 ? 'willow' : 'chrysanthemum');
      }, i * 320);
    }
  }

  // -----------------------------------------------------------
  // UPDATE CONTINUOUS EMITTERS (Anar, Chakri, Phuljhari)
  // -----------------------------------------------------------
  function updateContinuousEmitters(delta) {
    const { continuousEmitters, scene } = stateRef.current;

    for (let eIdx = continuousEmitters.length - 1; eIdx >= 0; eIdx--) {
      const emitter = continuousEmitters[eIdx];
      emitter.elapsed += delta;

      const posArr = emitter.pts.geometry.attributes.position.array;

      if (emitter.type === 'fountain') {
        // Continuous upward spark eruption
        const isEmitting = emitter.elapsed < emitter.duration;
        const emitRate = isEmitting ? 25 : 0;

        for (let k = 0; k < emitRate; k++) {
          const idx = emitter.nextIdx;
          emitter.nextIdx = (emitter.nextIdx + 1) % emitter.maxParticles;

          posArr[idx * 3] = emitter.origin.x;
          posArr[idx * 3 + 1] = emitter.origin.y;
          posArr[idx * 3 + 2] = emitter.origin.z;

          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 0.32;
          const speed = 7.5 + Math.random() * 8.5;

          emitter.vels[idx].set(
            Math.cos(angle) * spread * speed,
            speed,
            Math.sin(angle) * spread * speed
          );
          emitter.lives[idx] = 1.1 + Math.random() * 0.5;
          emitter.ages[idx] = 0;
        }

        // Particle physics & ground bounce
        for (let i = 0; i < emitter.maxParticles; i++) {
          if (emitter.ages[i] < emitter.lives[i]) {
            emitter.ages[i] += delta;
            const v = emitter.vels[i];
            v.y -= 9.5 * delta; // Gravity

            posArr[i * 3] += v.x * delta;
            posArr[i * 3 + 1] += v.y * delta;
            posArr[i * 3 + 2] += v.z * delta;

            // Ground bounce
            if (posArr[i * 3 + 1] < 0.05) {
              posArr[i * 3 + 1] = 0.05;
              v.y = -v.y * 0.38;
              v.x *= 0.8;
              v.z *= 0.8;
            }
          } else {
            posArr[i * 3 + 1] = -100;
          }
        }
        emitter.pts.geometry.attributes.position.needsUpdate = true;

        if (emitter.groundLight) {
          emitter.groundLight.intensity = isEmitting ? 4.5 + Math.random() * 3.0 : 0;
        }

        if (emitter.elapsed > emitter.duration + 1.6) {
          scene.remove(emitter.pts);
          scene.remove(emitter.groundLight);
          emitter.pts.geometry.dispose();
          emitter.pts.material.dispose();
          continuousEmitters.splice(eIdx, 1);
        }
      } else if (emitter.type === 'chakri') {
        const isEmitting = emitter.elapsed < emitter.duration;
        if (emitter.spinnerMesh) {
          emitter.spinnerMesh.rotation.y += 38 * delta;
        }

        const emitRate = isEmitting ? 18 : 0;
        for (let k = 0; k < emitRate; k++) {
          const idx = emitter.nextIdx;
          emitter.nextIdx = (emitter.nextIdx + 1) % emitter.maxParticles;

          const angle = Math.random() * Math.PI * 2;
          const radius = 0.95;
          posArr[idx * 3] = Math.cos(angle) * radius;
          posArr[idx * 3 + 1] = 0.22;
          posArr[idx * 3 + 2] = Math.sin(angle) * radius;

          // Tangential ejection vector
          const tangAngle = angle + Math.PI / 2;
          const speed = 4.2 + Math.random() * 5.0;
          emitter.vels[idx].set(
            Math.cos(tangAngle) * speed,
            Math.random() * 0.4 + 0.1,
            Math.sin(tangAngle) * speed
          );
          emitter.lives[idx] = 0.75 + Math.random() * 0.4;
          emitter.ages[idx] = 0;
        }

        for (let i = 0; i < emitter.maxParticles; i++) {
          if (emitter.ages[i] < emitter.lives[i]) {
            emitter.ages[i] += delta;
            const v = emitter.vels[i];
            v.y -= 2.0 * delta;
            v.x *= 0.96;
            v.z *= 0.96;

            posArr[i * 3] += v.x * delta;
            posArr[i * 3 + 1] += v.y * delta;
            posArr[i * 3 + 2] += v.z * delta;

            if (posArr[i * 3 + 1] < 0.05) posArr[i * 3 + 1] = 0.05;
          } else {
            posArr[i * 3 + 1] = -100;
          }
        }
        emitter.pts.geometry.attributes.position.needsUpdate = true;

        if (emitter.elapsed > emitter.duration + 1.2) {
          scene.remove(emitter.pts);
          scene.remove(emitter.groundLight);
          emitter.pts.geometry.dispose();
          emitter.pts.material.dispose();
          continuousEmitters.splice(eIdx, 1);
        }
      } else if (emitter.type === 'sparkler') {
        const isEmitting = emitter.elapsed < emitter.duration;
        const emitRate = isEmitting ? 16 : 0;

        for (let k = 0; k < emitRate; k++) {
          const idx = emitter.nextIdx;
          emitter.nextIdx = (emitter.nextIdx + 1) % emitter.maxParticles;

          posArr[idx * 3] = emitter.origin.x;
          posArr[idx * 3 + 1] = emitter.origin.y;
          posArr[idx * 3 + 2] = emitter.origin.z;

          emitter.vels[idx].set(
            (Math.random() - 0.5) * 4.8,
            (Math.random() - 0.5) * 4.5,
            (Math.random() - 0.5) * 4.8
          );
          emitter.lives[idx] = 0.5 + Math.random() * 0.35;
          emitter.ages[idx] = 0;
        }

        for (let i = 0; i < emitter.maxParticles; i++) {
          if (emitter.ages[i] < emitter.lives[i]) {
            emitter.ages[i] += delta;
            const v = emitter.vels[i];
            v.y -= 2.5 * delta;

            posArr[i * 3] += v.x * delta;
            posArr[i * 3 + 1] += v.y * delta;
            posArr[i * 3 + 2] += v.z * delta;
          } else {
            posArr[i * 3 + 1] = -100;
          }
        }
        emitter.pts.geometry.attributes.position.needsUpdate = true;

        if (emitter.elapsed > emitter.duration + 0.8) {
          scene.remove(emitter.pts);
          emitter.pts.geometry.dispose();
          emitter.pts.material.dispose();
          continuousEmitters.splice(eIdx, 1);
        }
      }
    }
  }

  // -----------------------------------------------------------
  // UPDATE ACTIVE BURSTS (Rockets & Detonations)
  // -----------------------------------------------------------
  function updateActiveBursts(delta) {
    const { scene, bursts, rocketFlight } = stateRef.current;

    // Rocket Flight Physics
    if (rocketFlight) {
      rocketFlight.mesh.position.y += rocketFlight.vy * delta;
      rocketFlight.vy += 22 * delta; // Accelerating thrust

      // Update rocket exhaust flame trail
      if (rocketFlight.tailPts) {
        const wp = new THREE.Vector3();
        rocketFlight.mesh.getWorldPosition(wp);
        rocketFlight.tailPts.position.set(wp.x, wp.y - 0.2, wp.z);

        const tailArr = rocketFlight.tailPts.geometry.attributes.position.array;
        for (let j = 0; j < rocketFlight.tailAges.length; j++) {
          rocketFlight.tailAges[j] += delta;
          const tv = rocketFlight.tailVels[j];
          tailArr[j * 3] += tv.x * delta;
          tailArr[j * 3 + 1] += tv.y * delta;
          tailArr[j * 3 + 2] += tv.z * delta;

          if (rocketFlight.tailAges[j] > 0.28) {
            tailArr[j * 3] = (Math.random() - 0.5) * 0.15;
            tailArr[j * 3 + 1] = 0;
            tailArr[j * 3 + 2] = (Math.random() - 0.5) * 0.15;
            rocketFlight.tailAges[j] = 0;
          }
        }
        rocketFlight.tailPts.geometry.attributes.position.needsUpdate = true;
      }

      // Detonate at altitude
      if (rocketFlight.mesh.position.y >= 12.8) {
        const wp = new THREE.Vector3();
        rocketFlight.mesh.getWorldPosition(wp);

        // High Altitude Sky Burst
        triggerSpectacularSkyBurst(wp.x, wp.y, wp.z, rocketFlight.color, rocketFlight.secColor, 'chrysanthemum');
        soundEngine.playSkyBurst();

        // Remove tail
        if (rocketFlight.tailPts) {
          scene.remove(rocketFlight.tailPts);
          rocketFlight.tailPts.geometry.dispose();
          rocketFlight.tailPts.material.dispose();
        }

        rocketFlight.mesh.position.set(0, 0, 0);
        stateRef.current.rocketFlight = null;
      }
    }

    // Update Spark Particles
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.age += delta;

      const posArr = b.pts.geometry.attributes.position.array;
      for (let j = 0; j < b.vel.length; j++) {
        const v = b.vel[j];
        v.y -= b.gravity * delta;
        v.x *= 0.978;
        v.z *= 0.978;

        posArr[j * 3] += v.x * delta;
        posArr[j * 3 + 1] += v.y * delta;
        posArr[j * 3 + 2] += v.z * delta;

        if (posArr[j * 3 + 1] < 0.05) {
          posArr[j * 3 + 1] = 0.05;
          v.y = -v.y * 0.35;
        }
      }

      b.pts.geometry.attributes.position.needsUpdate = true;
      b.pts.material.opacity = Math.max(0, 1 - Math.pow(b.age / b.life, 1.4));

      if (b.age >= b.life) {
        scene.remove(b.pts);
        b.pts.geometry.dispose();
        b.pts.material.dispose();
        bursts.splice(i, 1);
      }
    }
  }

  // -----------------------------------------------------------
  // UPDATE SMOKE PUFFS
  // -----------------------------------------------------------
  function updateSmokePuffs(delta) {
    const { scene, smokePuffs, camera } = stateRef.current;
    for (let i = smokePuffs.length - 1; i >= 0; i--) {
      const sp = smokePuffs[i];
      sp.age += delta;
      sp.mesh.position.y += sp.vy * delta;
      sp.mesh.scale.addScalar(sp.scaleSpeed * delta);
      sp.mesh.material.opacity = Math.max(0, 0.45 * (1 - sp.age / sp.life));

      // Billboard facing camera
      if (camera) {
        sp.mesh.quaternion.copy(camera.quaternion);
      }

      if (sp.age >= sp.life) {
        scene.remove(sp.mesh);
        sp.mesh.geometry.dispose();
        sp.mesh.material.dispose();
        smokePuffs.splice(i, 1);
      }
    }
  }

  // -----------------------------------------------------------
  // UPDATE SHOCKWAVE RINGS
  // -----------------------------------------------------------
  function updateShockwaves(delta) {
    const { scene, shockwaves } = stateRef.current;
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.age += delta;
      const progress = sw.age / sw.life;
      const currentScale = 1 + progress * sw.maxScale;
      sw.mesh.scale.set(currentScale, currentScale, 1);
      sw.mesh.material.opacity = Math.max(0, 0.95 * (1 - progress));

      if (sw.age >= sw.life) {
        scene.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        shockwaves.splice(i, 1);
      }
    }
  }

  return (
    <div
      className="three-stage"
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab',
      }}
    />
  );
}
