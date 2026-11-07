import * as THREE from 'three';
import { createJuteTexture, createFestiveWrapperTexture } from './textures';

function createGoldMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  });
}

function createTerracottaMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    roughness: 0.8,
    metalness: 0.1,
  });
}

// -------------------------------------------------------------
// 1. 3D ROCKET MODEL (Stand stays on ground, projectile flies!)
// -------------------------------------------------------------
export function createRocketModel(cracker) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'RocketRoot';

  const baseColor = cracker.color || '#ff4757';
  const wrapperTex = createFestiveWrapperTexture(baseColor);

  // Stand Group (remains grounded)
  const standGroup = new THREE.Group();
  standGroup.name = 'LaunchStand';

  const baseRingGeo = new THREE.TorusGeometry(0.7, 0.05, 12, 32);
  baseRingGeo.rotateX(Math.PI / 2);
  const baseRing = new THREE.Mesh(baseRingGeo, createGoldMaterial());
  baseRing.position.y = -0.05;
  standGroup.add(baseRing);

  const guideTubeGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.4, 16, 1, true);
  const guideTube = new THREE.Mesh(guideTubeGeo, new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.85,
    roughness: 0.35,
  }));
  guideTube.position.set(0.32, 0.65, 0);
  standGroup.add(guideTube);
  rootGroup.add(standGroup);

  // Flying Projectile Group
  const rocketProjectile = new THREE.Group();
  rocketProjectile.name = 'RocketProjectile';

  // 1. Cylindrical Body
  const bodyGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.0, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: wrapperTex,
    roughness: 0.35,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.35;
  rocketProjectile.add(body);

  // 2. Conical Nose Cone (Metallic)
  const coneGeo = new THREE.ConeGeometry(0.38, 0.8, 32);
  const coneMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.75,
    roughness: 0.2,
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 2.35 + 0.4;
  rocketProjectile.add(cone);

  // 3. Wooden Guiding Stick
  const stickGeo = new THREE.CylinderGeometry(0.035, 0.035, 3.4, 12);
  const stickMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.9,
  });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(0.32, 0.6, 0);
  rocketProjectile.add(stick);

  // 4. Brass Collar & Nozzle
  const collarGeo = new THREE.CylinderGeometry(0.3, 0.26, 0.2, 24);
  const collar = new THREE.Mesh(collarGeo, createGoldMaterial());
  collar.position.y = 0.25;
  rocketProjectile.add(collar);

  // 5. Curved Fuse Cord
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.15, 0),
    new THREE.Vector3(0.08, 0.0, 0.05),
    new THREE.Vector3(0.18, -0.15, 0.12),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 16, 0.025, 8, false);
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9 });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  rocketProjectile.add(fuse);

  rootGroup.add(rocketProjectile);

  return {
    mesh: rootGroup,
    projectileMesh: rocketProjectile,
    fuseTipPosition: new THREE.Vector3(0.18, -0.15, 0.12),
    category: 'Rockets',
  };
}

// -------------------------------------------------------------
// 2. 3D ANAR / FOUNTAIN MODEL (Flowerpot)
// -------------------------------------------------------------
export function createAnarModel(cracker) {
  const group = new THREE.Group();
  group.name = 'AnarModel';

  const color = cracker.color || '#ff805e';

  // 1. Terracotta conical body
  const potGeo = new THREE.CylinderGeometry(0.3, 0.85, 1.8, 32);
  const potMat = createTerracottaMaterial();
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.9;
  group.add(pot);

  // 2. Golden decorative rings & wrap
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 32), createGoldMaterial());
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0.7;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.04, 16, 32), createGoldMaterial());
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = 0.3;
  group.add(ring2);

  // 3. Middle Festive Color Band
  const bandGeo = new THREE.CylinderGeometry(0.53, 0.7, 0.5, 32);
  const bandMat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.5,
    roughness: 0.3,
  });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.y = 0.5;
  group.add(band);

  // 4. Golden Metallic Foil Cap
  const capGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.18, 32);
  const cap = new THREE.Mesh(capGeo, createGoldMaterial());
  cap.position.y = 1.8;
  group.add(cap);

  // 5. Heavy Ornamental Brass Base Plate
  const baseGeo = new THREE.CylinderGeometry(0.95, 1.05, 0.15, 32);
  const baseMat = createGoldMaterial();
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.07;
  group.add(base);

  // 6. Top Fuse Wick
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.88, 0),
    new THREE.Vector3(0.04, 2.05, 0.02),
    new THREE.Vector3(0.1, 2.2, 0.06),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 12, 0.03, 8, false);
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9 });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0.1, 2.2, 0.06),
    category: 'Anar & Fountains',
  };
}

// -------------------------------------------------------------
// 3. 3D CHAKRI (Ground Spinning Wheel)
// -------------------------------------------------------------
export function createChakriModel(cracker) {
  const group = new THREE.Group();
  group.name = 'ChakriModel';

  const spinnerGroup = new THREE.Group();
  spinnerGroup.name = 'SpinnerRotator';

  const color = cracker.color || '#61d7ff';

  // 1. Concentric Spiral Coils Disc
  const outerDiscGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.12, 32);
  const outerDiscMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
  });
  const outerDisc = new THREE.Mesh(outerDiscGeo, outerDiscMat);
  outerDisc.position.y = 0.1;
  spinnerGroup.add(outerDisc);

  // 2. Colorful Coils
  const coil1Geo = new THREE.TorusGeometry(0.85, 0.08, 12, 32);
  coil1Geo.rotateX(Math.PI / 2);
  const coil1 = new THREE.Mesh(coil1Geo, new THREE.MeshStandardMaterial({ color, roughness: 0.3 }));
  coil1.position.y = 0.16;
  spinnerGroup.add(coil1);

  const coil2Geo = new THREE.TorusGeometry(0.6, 0.07, 12, 32);
  coil2Geo.rotateX(Math.PI / 2);
  const coil2 = new THREE.Mesh(coil2Geo, createGoldMaterial());
  coil2.position.y = 0.16;
  spinnerGroup.add(coil2);

  const coil3Geo = new THREE.TorusGeometry(0.35, 0.06, 12, 32);
  coil3Geo.rotateX(Math.PI / 2);
  const coil3 = new THREE.Mesh(coil3Geo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  coil3.position.y = 0.16;
  spinnerGroup.add(coil3);

  // 3. Center Brass Pin & Washer
  const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 24);
  const pin = new THREE.Mesh(pinGeo, createGoldMaterial());
  pin.position.y = 0.2;
  spinnerGroup.add(pin);

  // 4. Tangential Ignition Nozzle / Fuse
  const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12);
  nozzleGeo.rotateZ(Math.PI / 2);
  const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzle.position.set(0.95, 0.12, 0);
  spinnerGroup.add(nozzle);

  // Fuse at nozzle tip
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.12, 0.12, 0),
    new THREE.Vector3(1.22, 0.18, 0.05),
    new THREE.Vector3(1.3, 0.25, 0.08),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.02, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  spinnerGroup.add(fuse);

  group.add(spinnerGroup);

  // 5. Decorative Ground Rangoli Plate Underneath
  const plateGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.04, 32);
  const plate = new THREE.Mesh(plateGeo, createGoldMaterial());
  plate.position.y = 0.02;
  group.add(plate);

  return {
    mesh: group,
    spinnerMesh: spinnerGroup,
    fuseTipPosition: new THREE.Vector3(1.3, 0.25, 0.08),
    category: 'Chakri',
  };
}

// -------------------------------------------------------------
// 4. 3D PHULJHARI (Sparkler)
// -------------------------------------------------------------
export function createPhuljhariModel(cracker) {
  const group = new THREE.Group();
  group.name = 'PhuljhariModel';

  const color = cracker.color || '#ffe66d';

  // 1. Metal Wire Rod
  const wireGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.2, 12);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.15,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.y = 1.6;
  group.add(wire);

  // 2. Coated Sparkler Chemical Layer
  const coatGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.8, 20);
  const coatMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
  });
  const coat = new THREE.Mesh(coatGeo, coatMat);
  coat.position.y = 2.1;
  group.add(coat);

  // 3. Ignition Tip
  const tipGeo = new THREE.SphereGeometry(0.11, 16, 16);
  const tipMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 3.02;
  group.add(tip);

  // 4. Brass Presentation Base Stand
  const standGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.35, 24);
  const stand = new THREE.Mesh(standGeo, createGoldMaterial());
  stand.position.y = 0.17;
  group.add(stand);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0, 3.05, 0),
    category: 'Phuljhari',
  };
}

// -------------------------------------------------------------
// 5. 3D BOMB / SUTLI BOMB (Green Twine Block)
// -------------------------------------------------------------
export function createBombModel(cracker) {
  const group = new THREE.Group();
  group.name = 'BombModel';

  const juteTex = createJuteTexture();

  // 1. Main Twine-Wrapped Box
  const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const boxMat = new THREE.MeshStandardMaterial({
    map: juteTex,
    roughness: 0.9,
    metalness: 0.05,
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = 0.65;
  group.add(box);

  // 2. Festive Red/Gold Paper Label Band
  const bandGeo = new THREE.BoxGeometry(1.24, 0.45, 1.24);
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0xd92626,
    metalness: 0.3,
    roughness: 0.4,
  });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.y = 0.65;
  group.add(band);

  // 3. Golden Label Accent Ribbons
  const ribbonGeo = new THREE.BoxGeometry(1.25, 0.06, 1.25);
  const ribbonTop = new THREE.Mesh(ribbonGeo, createGoldMaterial());
  ribbonTop.position.y = 0.88;
  group.add(ribbonTop);

  const ribbonBottom = new THREE.Mesh(ribbonGeo, createGoldMaterial());
  ribbonBottom.position.y = 0.42;
  group.add(ribbonBottom);

  // 4. Braided Twisted Rope Fuse
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.25, 0),
    new THREE.Vector3(0.1, 1.45, 0.05),
    new THREE.Vector3(0.25, 1.62, 0.15),
    new THREE.Vector3(0.35, 1.75, 0.1),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 20, 0.04, 8, false);
  const fuseMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.9,
  });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0.35, 1.75, 0.1),
    category: 'Bombs',
  };
}

// -------------------------------------------------------------
// 6. 3D GROUND SPINNER
// -------------------------------------------------------------
export function createGroundSpinnerModel(cracker) {
  const group = new THREE.Group();
  group.name = 'GroundSpinnerModel';

  const spinnerGroup = new THREE.Group();
  spinnerGroup.name = 'SpinnerRotator';

  const color = cracker.color || '#a78bfa';

  // Center Hub
  const hubGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.2, 24);
  const hub = new THREE.Mesh(hubGeo, createGoldMaterial());
  hub.position.y = 0.12;
  spinnerGroup.add(hub);

  // 3 Aerodynamic Fins
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const wingGeo = new THREE.BoxGeometry(0.7, 0.1, 0.35);
    const wingMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.6,
    });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.set(Math.cos(angle) * 0.55, 0.12, Math.sin(angle) * 0.55);
    wing.rotation.y = -angle + 0.3;
    spinnerGroup.add(wing);

    const nozzleGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(Math.cos(angle) * 0.92, 0.12, Math.sin(angle) * 0.92);
    spinnerGroup.add(nozzle);
  }

  // Fuse at one wing tip
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.92, 0.12, 0),
    new THREE.Vector3(1.1, 0.22, 0.05),
    new THREE.Vector3(1.2, 0.32, 0.1),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.02, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  spinnerGroup.add(fuse);

  group.add(spinnerGroup);

  return {
    mesh: group,
    spinnerMesh: spinnerGroup,
    fuseTipPosition: new THREE.Vector3(1.2, 0.32, 0.1),
    category: 'Ground Spinners',
  };
}

// -------------------------------------------------------------
// 7. 3D SKY SHOT (Multi-Tube Battery / Mortar)
// -------------------------------------------------------------
export function createSkyShotModel(cracker) {
  const group = new THREE.Group();
  group.name = 'SkyShotModel';

  const color = cracker.color || '#ff5d8f';
  const wrapperTex = createFestiveWrapperTexture(color);

  // Main Outer Casing Box
  const casingGeo = new THREE.BoxGeometry(1.6, 1.8, 1.6);
  const casingMat = new THREE.MeshStandardMaterial({
    map: wrapperTex,
    roughness: 0.4,
  });
  const casing = new THREE.Mesh(casingGeo, casingMat);
  casing.position.y = 0.9;
  group.add(casing);

  // Golden Rim Top & Bottom
  const rimTop = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.1, 1.68), createGoldMaterial());
  rimTop.position.y = 1.8;
  group.add(rimTop);

  const rimBottom = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.15, 1.68), createGoldMaterial());
  rimBottom.position.y = 0.08;
  group.add(rimBottom);

  // 9 Mortar Tubes (3x3 grid)
  const tubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16, 1, true);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
  });

  const offsets = [-0.45, 0, 0.45];
  offsets.forEach((x) => {
    offsets.forEach((z) => {
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.position.set(x, 1.75, z);
      group.add(tube);
    });
  });

  // Main Lead Fuse Wick
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 1.8, 0.45),
    new THREE.Vector3(0.65, 1.95, 0.55),
    new THREE.Vector3(0.8, 2.1, 0.65),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 12, 0.03, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0.8, 2.1, 0.65),
    category: 'Sky Shots',
  };
}

// -------------------------------------------------------------
// 8. 3D SPECIAL (Grand Finale / Multi-Tiered Diwali Pyramid)
// -------------------------------------------------------------
export function createSpecialModel(cracker) {
  const group = new THREE.Group();
  group.name = 'SpecialModel';

  const color = cracker.color || '#f4f0ff';

  // Tier 1 Base Cylinder
  const t1Geo = new THREE.CylinderGeometry(1.2, 1.3, 0.6, 32);
  const t1 = new THREE.Mesh(t1Geo, createGoldMaterial());
  t1.position.y = 0.3;
  group.add(t1);

  // Tier 2 Middle Octagon
  const t2Geo = new THREE.CylinderGeometry(0.85, 0.95, 0.7, 8);
  const t2Mat = new THREE.MeshStandardMaterial({
    color: 0x831843,
    roughness: 0.3,
    metalness: 0.5,
  });
  const t2 = new THREE.Mesh(t2Geo, t2Mat);
  t2.position.y = 0.95;
  group.add(t2);

  // Tier 3 Crown / Top Star
  const t3Geo = new THREE.CylinderGeometry(0.5, 0.6, 0.5, 16);
  const t3 = new THREE.Mesh(t3Geo, createGoldMaterial());
  t3.position.y = 1.55;
  group.add(t3);

  // Golden Spire Pinnacle
  const spireGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
  const spireMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.1,
  });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.y = 2.2;
  group.add(spire);

  // Surrounding Mini Rocket Tubes
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const miniGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12);
    const mini = new THREE.Mesh(miniGeo, new THREE.MeshStandardMaterial({ color }));
    mini.position.set(Math.cos(angle) * 1.05, 0.8, Math.sin(angle) * 1.05);
    group.add(mini);
  }

  // Master Fuse
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.6, 0),
    new THREE.Vector3(0.08, 2.75, 0.05),
    new THREE.Vector3(0.18, 2.9, 0.12),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 12, 0.03, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0.18, 2.9, 0.12),
    category: 'Special',
  };
}

// -------------------------------------------------------------
// ANIMATED 3D DIYA (Earthen Oil Lamp with Flickering Flame)
// -------------------------------------------------------------
export function createDiyaModel(x = 0, y = 0, z = 0, scale = 1.0) {
  const diyaGroup = new THREE.Group();
  diyaGroup.position.set(x, y, z);
  diyaGroup.scale.setScalar(scale);

  // Earthen Clay Bowl
  const bowlGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bowlMat = createTerracottaMaterial();
  const bowl = new THREE.Mesh(bowlGeo, bowlMat);
  bowl.rotation.x = Math.PI;
  bowl.position.y = 0.2;
  diyaGroup.add(bowl);

  // Diya Spout
  const spoutGeo = new THREE.ConeGeometry(0.12, 0.25, 8);
  spoutGeo.rotateZ(-Math.PI / 3);
  const spout = new THREE.Mesh(spoutGeo, bowlMat);
  spout.position.set(0.3, 0.16, 0);
  diyaGroup.add(spout);

  // Flame Geometry
  const flameGeo = new THREE.ConeGeometry(0.08, 0.25, 12);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffe066,
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0.32, 0.32, 0);
  diyaGroup.add(flame);

  // Soft Point Light
  const light = new THREE.PointLight(0xff9900, 1.8, 6, 2);
  light.position.set(0.32, 0.38, 0);
  diyaGroup.add(light);

  let isLit = true;

  function update(time) {
    if (!isLit) {
      flame.visible = false;
      light.intensity = 0;
      return;
    }
    flame.visible = true;
    const flicker = Math.sin(time * 12 + x) * 0.15 + Math.cos(time * 24 + z) * 0.1;
    flame.scale.set(1 + flicker * 0.5, 1 + flicker, 1 + flicker * 0.5);
    light.intensity = 1.8 + flicker * 0.8;
  }

  function toggle() {
    isLit = !isLit;
    if (!isLit) {
      flame.visible = false;
      light.intensity = 0;
    }
    return isLit;
  }

  function setLit(val) {
    isLit = !!val;
    if (!isLit) {
      flame.visible = false;
      light.intensity = 0;
    }
  }

  const diyaObj = {
    mesh: diyaGroup,
    flame,
    light,
    update,
    toggle,
    setLit,
    get isLit() {
      return isLit;
    },
    position: new THREE.Vector3(x, y + 0.32, z),
  };

  diyaGroup.userData = { isDiya: true, diyaObj };
  bowl.userData = { isDiya: true, diyaObj };
  spout.userData = { isDiya: true, diyaObj };
  flame.userData = { isDiya: true, diyaObj };

  return diyaObj;
}

// -------------------------------------------------------------
// 9. 3D LADI & FIRECRACKER STRING (1000 Wala / Red Garland)
// -------------------------------------------------------------
export function createLadiModel(cracker) {
  const group = new THREE.Group();
  group.name = 'LadiModel';

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.6,
  });

  const goldMat = createGoldMaterial();

  // Spiral / serpentine string of red cracker rolls
  const rollGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12);
  const ringGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.06, 12);

  const numRolls = 18;
  for (let i = 0; i < numRolls; i++) {
    const angle = i * 0.45;
    const r = 0.25 + i * 0.045;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    const roll = new THREE.Mesh(rollGeo, redMat);
    roll.position.set(x, 0.22, z);
    roll.rotation.z = Math.PI / 2;
    roll.rotation.y = angle;
    group.add(roll);

    // Gold label band
    const band = new THREE.Mesh(ringGeo, goldMat);
    band.position.set(x, 0.22, z);
    band.rotation.z = Math.PI / 2;
    band.rotation.y = angle;
    group.add(band);
  }

  // Intertwined green string
  const stringCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.22, 0),
    new THREE.Vector3(0.5, 0.22, 0.4),
    new THREE.Vector3(0.8, 0.22, 0.2),
    new THREE.Vector3(1.0, 0.24, -0.2),
  ]);
  const strGeo = new THREE.TubeGeometry(stringCurve, 20, 0.02, 6, false);
  const strMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
  const str = new THREE.Mesh(strGeo, strMat);
  group.add(str);

  // Lead Fuse
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.0, 0.24, -0.2),
    new THREE.Vector3(1.15, 0.35, -0.15),
    new THREE.Vector3(1.25, 0.45, -0.1),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.02, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(1.25, 0.45, -0.1),
    category: 'Ladi & Strings',
  };
}

// -------------------------------------------------------------
// 10. 3D AERIAL SPINNERS & UFOs (Flying Saucer / Helicopter)
// -------------------------------------------------------------
export function createUfoModel(cracker) {
  const group = new THREE.Group();
  group.name = 'UfoModel';

  const spinnerMesh = new THREE.Group();
  const color = cracker.color || '#10b981';

  // Aerodynamic Saucer Outer Disc
  const discGeo = new THREE.CylinderGeometry(1.1, 0.9, 0.12, 32);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.7,
    roughness: 0.3,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.y = 0.15;
  spinnerMesh.add(disc);

  // Center Cockpit Dome (Glowing Neon)
  const domeGeo = new THREE.SphereGeometry(0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.2,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 0.2;
  spinnerMesh.add(dome);

  // 3 Curved Rotor Airfoil Blades
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const bladeGeo = new THREE.BoxGeometry(0.85, 0.04, 0.22);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(Math.cos(angle) * 0.9, 0.16, Math.sin(angle) * 0.9);
    blade.rotation.y = -angle + 0.4;
    spinnerMesh.add(blade);
  }

  // Ignition Fuse at Dome Apex
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.65, 0),
    new THREE.Vector3(0.08, 0.8, 0.04),
    new THREE.Vector3(0.15, 0.92, 0.08),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.02, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  spinnerMesh.add(fuse);

  group.add(spinnerMesh);

  return {
    mesh: group,
    spinnerMesh,
    projectileMesh: spinnerMesh,
    fuseTipPosition: new THREE.Vector3(0.15, 0.92, 0.08),
    category: 'Aerial Spinners & UFOs',
  };
}

// -------------------------------------------------------------
// 11. 3D NOVELTY & MAGIC (Black Cobra Snake / Color Smoke)
// -------------------------------------------------------------
export function createNoveltyModel(cracker) {
  const group = new THREE.Group();
  group.name = 'NoveltyModel';

  const isSmokeCan = cracker.name.includes('Smoke');

  if (isSmokeCan) {
    // Heavy Smoke Canister
    const canGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.4, 24);
    const canMat = new THREE.MeshStandardMaterial({
      color: cracker.color || 0xff7700,
      metalness: 0.3,
      roughness: 0.4,
    });
    const can = new THREE.Mesh(canGeo, canMat);
    can.position.y = 0.7;
    group.add(can);

    // Metal Cap & Ring
    const capGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.15, 24);
    const cap = new THREE.Mesh(capGeo, createGoldMaterial());
    cap.position.y = 1.45;
    group.add(cap);

    // Pull Wire / Fuse
    const fuseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0.08, 1.65, 0.05),
      new THREE.Vector3(0.15, 1.8, 0.08),
    ]);
    const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.025, 6, false);
    const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
    group.add(fuse);

    return {
      mesh: group,
      fuseTipPosition: new THREE.Vector3(0.15, 1.8, 0.08),
      category: 'Novelty & Magic',
    };
  }

  // Classic Black Cobra Snake Tablet
  const dishGeo = new THREE.CylinderGeometry(0.9, 0.95, 0.08, 24);
  const dish = new THREE.Mesh(dishGeo, createGoldMaterial());
  dish.position.y = 0.04;
  group.add(dish);

  // Black Chemical Tablets
  const tabGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16);
  const tabMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
  });

  const offsets = [
    [-0.25, -0.15],
    [0.25, -0.15],
    [0, 0.25],
  ];

  offsets.forEach(([x, z]) => {
    const tab = new THREE.Mesh(tabGeo, tabMat);
    tab.position.set(x, 0.16, z);
    group.add(tab);
  });

  // Top Ignition Sulfur Point
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.25, 0.25),
    new THREE.Vector3(0.05, 0.4, 0.28),
    new THREE.Vector3(0.1, 0.52, 0.3),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 10, 0.02, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
  group.add(fuse);

  return {
    mesh: group,
    fuseTipPosition: new THREE.Vector3(0.1, 0.52, 0.3),
    category: 'Novelty & Magic',
  };
}

// -------------------------------------------------------------
// MASTER FACTORY FUNCTION
// -------------------------------------------------------------
export function createCracker3D(cracker) {
  const cat = cracker.category;
  if (cat === 'Rockets') return createRocketModel(cracker);
  if (cat.includes('Fountain') || cat.includes('Anar')) return createAnarModel(cracker);
  if (cat === 'Chakri') return createChakriModel(cracker);
  if (cat === 'Phuljhari') return createPhuljhariModel(cracker);
  if (cat === 'Bombs') return createBombModel(cracker);
  if (cat.includes('Ladi') || cat.includes('Strings')) return createLadiModel(cracker);
  if (cat.includes('UFO') || cat.includes('Aerial Spinners')) return createUfoModel(cracker);
  if (cat.includes('Novelty') || cat.includes('Magic')) return createNoveltyModel(cracker);
  if (cat === 'Ground Spinners') return createGroundSpinnerModel(cracker);
  if (cat === 'Sky Shots') return createSkyShotModel(cracker);
  return createSpecialModel(cracker);
}
