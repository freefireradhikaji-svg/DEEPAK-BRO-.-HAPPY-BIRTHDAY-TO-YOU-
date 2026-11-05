import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeCakeSceneProps {
  isCut: boolean;
  candlesBlown: boolean;
  onSliceComplete?: () => void;
}

export const ThreeCakeScene: React.FC<ThreeCakeSceneProps> = ({
  isCut,
  candlesBlown,
  onSliceComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isCutRef = useRef(isCut);
  const candlesBlownRef = useRef(candlesBlown);
  const onSliceCompleteRef = useRef(onSliceComplete);

  useEffect(() => {
    isCutRef.current = isCut;
  }, [isCut]);

  useEffect(() => {
    candlesBlownRef.current = candlesBlown;
  }, [candlesBlown]);

  useEffect(() => {
    onSliceCompleteRef.current = onSliceComplete;
  }, [onSliceComplete]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go under floor
    controls.minDistance = 3.2;
    controls.maxDistance = 11.0;
    controls.target.set(0, 1.4, 0);

    // 5. Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xffeedd, 0x111122, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0d0, 2.8);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcc2222, 1.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const goldAccentLight = new THREE.PointLight(0xffd700, 2.2, 8);
    goldAccentLight.position.set(0, 4, 1.5);
    scene.add(goldAccentLight);

    // 6. Materials
    const goldMirrorMat = new THREE.MeshStandardMaterial({
      color: 0xf5d77f,
      metalness: 0.95,
      roughness: 0.15,
      name: 'GoldMirror',
    });

    const goldBrushedMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.35,
    });

    const rubyRedVelvetMat = new THREE.MeshStandardMaterial({
      color: 0x880815,
      roughness: 0.8,
      metalness: 0.1,
    });

    const darkChocolateMat = new THREE.MeshStandardMaterial({
      color: 0x140e0b,
      roughness: 0.6,
      metalness: 0.15,
    });

    const creamWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      roughness: 0.45,
      metalness: 0.05,
    });

    const candleWaxMat = new THREE.MeshStandardMaterial({
      color: 0xfff3d6,
      roughness: 0.3,
      metalness: 0.05,
    });

    // 7. Base Stand / Pedestal
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Stand base
    const standBaseGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.25, 48);
    const standBase = new THREE.Mesh(standBaseGeo, goldMirrorMat);
    standBase.position.y = 0.125;
    standBase.receiveShadow = !isSoftwareGl;
    cakeGroup.add(standBase);

    // Stand plate
    const standPlateGeo = new THREE.CylinderGeometry(2.2, 2.05, 0.15, 48);
    const standPlate = new THREE.Mesh(standPlateGeo, goldMirrorMat);
    standPlate.position.y = 0.3;
    standPlate.receiveShadow = !isSoftwareGl;
    cakeGroup.add(standPlate);

    // Beaded gold pearls around cake plate rim
    const pearlGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const pearlCount = 36;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, goldMirrorMat);
      pearl.position.set(Math.cos(angle) * 2.15, 0.38, Math.sin(angle) * 2.15);
      cakeGroup.add(pearl);
    }

    // Contact shadow beneath stand
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // 8. The Cake Tiers
    // We will separate the cake into:
    // (A) The main bulk of the cake (arc from 45 deg to 360 deg)
    // (B) The cut wedge (arc from 0 to 45 deg) that slides out when cutting!
    const sliceAngle = Math.PI / 4; // 45 degree wedge

    // Tier 1: Base Tier (Dark Chocolate & Gold)
    const tier1Height = 0.85;
    const tier1Radius = 1.85;
    const tier1Y = 0.38 + tier1Height / 2;

    const tier1MainGeo = new THREE.CylinderGeometry(tier1Radius, tier1Radius, tier1Height, 48, 1, false, sliceAngle, Math.PI * 2 - sliceAngle);
    const tier1Main = new THREE.Mesh(tier1MainGeo, darkChocolateMat);
    tier1Main.position.y = tier1Y;
    tier1Main.castShadow = !isSoftwareGl;
    tier1Main.receiveShadow = !isSoftwareGl;
    cakeGroup.add(tier1Main);

    // Tier 1 Gold Ribbon Trim
    const ribbon1Geo = new THREE.TorusGeometry(tier1Radius + 0.02, 0.05, 16, 64);
    ribbon1Geo.rotateX(Math.PI / 2);
    const ribbon1 = new THREE.Mesh(ribbon1Geo, goldMirrorMat);
    ribbon1.position.y = tier1Y - tier1Height / 2 + 0.06;
    cakeGroup.add(ribbon1);

    // Tier 2: Middle Tier (Cream White & Gold quilted look)
    const tier2Height = 0.75;
    const tier2Radius = 1.35;
    const tier2Y = tier1Y + tier1Height / 2 + tier2Height / 2;

    const tier2MainGeo = new THREE.CylinderGeometry(tier2Radius, tier2Radius, tier2Height, 48, 1, false, sliceAngle, Math.PI * 2 - sliceAngle);
    const tier2Main = new THREE.Mesh(tier2MainGeo, creamWhiteMat);
    tier2Main.position.y = tier2Y;
    tier2Main.castShadow = !isSoftwareGl;
    tier2Main.receiveShadow = !isSoftwareGl;
    cakeGroup.add(tier2Main);

    // Tier 2 Gold Ribbon
    const ribbon2Geo = new THREE.TorusGeometry(tier2Radius + 0.02, 0.045, 16, 64);
    ribbon2Geo.rotateX(Math.PI / 2);
    const ribbon2 = new THREE.Mesh(ribbon2Geo, goldMirrorMat);
    ribbon2.position.y = tier2Y - tier2Height / 2 + 0.05;
    cakeGroup.add(ribbon2);

    // Tier 3: Top Tier (Ruby Red Velvet)
    const tier3Height = 0.65;
    const tier3Radius = 0.9;
    const tier3Y = tier2Y + tier2Height / 2 + tier3Height / 2;

    const tier3MainGeo = new THREE.CylinderGeometry(tier3Radius, tier3Radius, tier3Height, 48, 1, false, sliceAngle, Math.PI * 2 - sliceAngle);
    const tier3Main = new THREE.Mesh(tier3MainGeo, rubyRedVelvetMat);
    tier3Main.position.y = tier3Y;
    tier3Main.castShadow = !isSoftwareGl;
    tier3Main.receiveShadow = !isSoftwareGl;
    cakeGroup.add(tier3Main);

    // Tier 3 Gold Crown Trim
    const ribbon3Geo = new THREE.TorusGeometry(tier3Radius + 0.02, 0.04, 16, 64);
    ribbon3Geo.rotateX(Math.PI / 2);
    const ribbon3 = new THREE.Mesh(ribbon3Geo, goldMirrorMat);
    ribbon3.position.y = tier3Y - tier3Height / 2 + 0.05;
    cakeGroup.add(ribbon3);

    // 9. Cut Slice Group (Tiers 1, 2, 3 wedge with inner red velvet sponge details!)
    const cutSliceGroup = new THREE.Group();
    cakeGroup.add(cutSliceGroup);

    const sliceInteriorMat = new THREE.MeshStandardMaterial({
      color: 0x991122, // Rich red velvet sponge inside
      roughness: 0.9,
      metalness: 0.05,
    });

    // Wedge geometries (0 to sliceAngle)
    const t1WedgeGeo = new THREE.CylinderGeometry(tier1Radius, tier1Radius, tier1Height, 16, 1, false, 0, sliceAngle);
    const t1Wedge = new THREE.Mesh(t1WedgeGeo, [darkChocolateMat, sliceInteriorMat, sliceInteriorMat]);
    t1Wedge.position.y = tier1Y;
    cutSliceGroup.add(t1Wedge);

    const t2WedgeGeo = new THREE.CylinderGeometry(tier2Radius, tier2Radius, tier2Height, 16, 1, false, 0, sliceAngle);
    const t2Wedge = new THREE.Mesh(t2WedgeGeo, [creamWhiteMat, sliceInteriorMat, sliceInteriorMat]);
    t2Wedge.position.y = tier2Y;
    cutSliceGroup.add(t2Wedge);

    const t3WedgeGeo = new THREE.CylinderGeometry(tier3Radius, tier3Radius, tier3Height, 16, 1, false, 0, sliceAngle);
    const t3Wedge = new THREE.Mesh(t3WedgeGeo, [rubyRedVelvetMat, sliceInteriorMat, sliceInteriorMat]);
    t3Wedge.position.y = tier3Y;
    cutSliceGroup.add(t3Wedge);

    // Fondant 3D Roses around tiers
    const createRose = (scale: number = 0.15) => {
      const roseGroup = new THREE.Group();
      const petalMat = new THREE.MeshStandardMaterial({
        color: 0xd90429,
        roughness: 0.7,
        metalness: 0.1,
      });
      const petalGeo = new THREE.SphereGeometry(scale, 8, 8);
      petalGeo.scale(1, 0.4, 0.8);

      for (let p = 0; p < 7; p++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.rotation.y = (p / 7) * Math.PI * 2;
        petal.rotation.x = 0.35 + p * 0.05;
        petal.position.set(Math.cos(petal.rotation.y) * scale * 0.5, 0, Math.sin(petal.rotation.y) * scale * 0.5);
        roseGroup.add(petal);
      }
      return roseGroup;
    };

    // Place roses on Tier 1 & Tier 2 shoulders
    const rosePositions = [
      { r: tier1Radius - 0.25, y: tier1Y + tier1Height / 2 + 0.05, angle: 1.2 },
      { r: tier1Radius - 0.25, y: tier1Y + tier1Height / 2 + 0.05, angle: 2.5 },
      { r: tier1Radius - 0.25, y: tier1Y + tier1Height / 2 + 0.05, angle: 3.8 },
      { r: tier1Radius - 0.25, y: tier1Y + tier1Height / 2 + 0.05, angle: 5.1 },
      { r: tier2Radius - 0.2, y: tier2Y + tier2Height / 2 + 0.05, angle: 1.8 },
      { r: tier2Radius - 0.2, y: tier2Y + tier2Height / 2 + 0.05, angle: 3.4 },
      { r: tier2Radius - 0.2, y: tier2Y + tier2Height / 2 + 0.05, angle: 4.9 },
    ];
    rosePositions.forEach((pos) => {
      const rose = createRose(0.12);
      rose.position.set(Math.cos(pos.angle) * pos.r, pos.y, Math.sin(pos.angle) * pos.r);
      cakeGroup.add(rose);
    });

    // 10. Golden Topper Medallion / Crown for DEEPAK BHAI
    const topperGroup = new THREE.Group();
    topperGroup.position.y = tier3Y + tier3Height / 2 + 0.05;
    cakeGroup.add(topperGroup);

    // Crown Base
    const crownBaseGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.16, 24);
    const crownBase = new THREE.Mesh(crownBaseGeo, goldMirrorMat);
    topperGroup.add(crownBase);

    // Crown Peaks
    const crownPeakCount = 8;
    for (let c = 0; c < crownPeakCount; c++) {
      const cAngle = (c / crownPeakCount) * Math.PI * 2;
      const spikeGeo = new THREE.ConeGeometry(0.08, 0.35, 8);
      const spike = new THREE.Mesh(spikeGeo, goldMirrorMat);
      spike.position.set(Math.cos(cAngle) * 0.46, 0.22, Math.sin(cAngle) * 0.46);
      topperGroup.add(spike);

      // Ruby at tip of spike
      const rubyGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const rubyMat = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        roughness: 0.1,
        metalness: 0.4,
        emissive: 0x550011,
      });
      const ruby = new THREE.Mesh(rubyGeo, rubyMat);
      ruby.position.set(Math.cos(cAngle) * 0.46, 0.38, Math.sin(cAngle) * 0.46);
      topperGroup.add(ruby);
    }

    // 11. Birthday Candles (7 Candles for 7 November!)
    const candleCount = 7;
    const candles: Array<{
      flameMesh: THREE.Mesh;
      light: THREE.PointLight;
      wick: THREE.Mesh;
      basePos: THREE.Vector3;
    }> = [];

    const flameGeo = new THREE.ConeGeometry(0.05, 0.18, 12);
    flameGeo.translate(0, 0.09, 0);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
    });

    const candleCandleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.5, 16);

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const cRadius = 0.62;
      const cx = Math.cos(angle) * cRadius;
      const cz = Math.sin(angle) * cRadius;
      const cy = tier3Y + tier3Height / 2;

      // Candle wax stick
      const candleStick = new THREE.Mesh(candleCandleGeo, candleWaxMat);
      candleStick.position.set(cx, cy + 0.25, cz);
      candleStick.castShadow = !isSoftwareGl;
      cakeGroup.add(candleStick);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.08, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(cx, cy + 0.53, cz);
      cakeGroup.add(wick);

      // Flame
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(cx, cy + 0.56, cz);
      cakeGroup.add(flame);

      // Candle Glow Light
      const candleLight = new THREE.PointLight(0xff9922, 0.8, 2.5);
      candleLight.position.set(cx, cy + 0.65, cz);
      scene.add(candleLight);

      candles.push({
        flameMesh: flame,
        light: candleLight,
        wick,
        basePos: new THREE.Vector3(cx, cy, cz),
      });
    }

    // 12. Golden Cake-Cutting Knife / Dagger
    const knifeGroup = new THREE.Group();
    cakeGroup.add(knifeGroup);
    knifeGroup.position.set(1.4, 4.2, 0.8);
    knifeGroup.rotation.z = -Math.PI / 4;
    knifeGroup.visible = false;

    // Knife blade
    const bladeGeo = new THREE.BoxGeometry(0.12, 1.4, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xfff0aa,
      metalness: 0.98,
      roughness: 0.1,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = -0.7;
    knifeGroup.add(blade);

    // Knife gold handle
    const handleGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.55, 16);
    const handle = new THREE.Mesh(handleGeo, goldBrushedMat);
    handle.position.y = 0.28;
    knifeGroup.add(handle);

    // 13. Floating Metallic Balloons (Ruby Red, Gold, Black)
    const balloonGroup = new THREE.Group();
    scene.add(balloonGroup);

    const balloonColors = [0xd90429, 0xffd700, 0x1a1a1a, 0xef233c, 0xfca311];
    const balloons: Array<{
      mesh: THREE.Mesh;
      baseY: number;
      speed: number;
      offset: number;
    }> = [];

    const balloonGeo = new THREE.SphereGeometry(0.48, 24, 24);
    balloonGeo.scale(1, 1.25, 1);

    for (let b = 0; b < 12; b++) {
      const bColor = balloonColors[b % balloonColors.length];
      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        metalness: bColor === 0xffd700 ? 0.9 : 0.45,
        roughness: 0.2,
      });
      const bMesh = new THREE.Mesh(balloonGeo, bMat);

      const bAngle = (b / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const bDist = 3.6 + Math.random() * 1.6;
      const bx = Math.cos(bAngle) * bDist;
      const bz = Math.sin(bAngle) * bDist;
      const by = 2.5 + Math.random() * 2.5;

      bMesh.position.set(bx, by, bz);
      balloonGroup.add(bMesh);

      balloons.push({
        mesh: bMesh,
        baseY: by,
        speed: 0.8 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // 14. 3D Sparkle Star Particles
    const starCount = 60;
    const starGeo = new THREE.OctahedronGeometry(0.06, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffdf77 });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const dummy = new THREE.Object3D();

    const starPositions: Array<{ x: number; y: number; z: number; speed: number; phase: number }> = [];
    for (let s = 0; s < starCount; s++) {
      const sx = (Math.random() - 0.5) * 12;
      const sy = 0.5 + Math.random() * 6;
      const sz = (Math.random() - 0.5) * 12;
      starPositions.push({
        x: sx,
        y: sy,
        z: sz,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      });
      dummy.position.set(sx, sy, sz);
      dummy.updateMatrix();
      starInstanced.setMatrixAt(s, dummy.matrix);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    scene.add(starInstanced);

    // 15. Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();
    let sliceSlideDistance = 0;
    let knifeCutProgress = 0;
    let knifeCutting = false;

    // Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Slow gentle cake rotation if user is not actively cutting
      if (!knifeCutting && !isCutRef.current) {
        cakeGroup.rotation.y += delta * 0.22;
      }

      // Floating balloons
      balloons.forEach((b) => {
        b.mesh.position.y = b.baseY + Math.sin(time * b.speed + b.offset) * 0.25;
        b.mesh.rotation.y = Math.sin(time * 0.5 + b.offset) * 0.2;
      });

      // Animated stars
      for (let s = 0; s < starCount; s++) {
        const star = starPositions[s];
        dummy.position.set(
          star.x,
          star.y + Math.sin(time * star.speed + star.phase) * 0.2,
          star.z
        );
        const scale = 0.6 + Math.sin(time * 3 + star.phase) * 0.4;
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.x = time * 0.8;
        dummy.rotation.y = time * 1.2;
        dummy.updateMatrix();
        starInstanced.setMatrixAt(s, dummy.matrix);
      }
      starInstanced.instanceMatrix.needsUpdate = true;

      // Candle Flame flickering or blowing out
      candles.forEach((c, idx) => {
        if (candlesBlownRef.current) {
          // Extinguish smoothly
          c.flameMesh.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
          c.light.intensity = THREE.MathUtils.lerp(c.light.intensity, 0, 0.1);
          if (c.flameMesh.scale.x < 0.01) {
            c.flameMesh.visible = false;
          }
        } else {
          // Dynamic flame flickers
          c.flameMesh.visible = true;
          const flicker = Math.sin(time * 14 + idx * 2.3) * 0.18 + Math.cos(time * 21 + idx) * 0.08;
          c.flameMesh.scale.set(1 + flicker * 0.5, 1 + flicker, 1 + flicker * 0.5);
          c.light.intensity = 0.7 + flicker * 0.4;
        }
      });

      // Cake Cutting Sequence
      if (isCutRef.current) {
        if (!knifeCutting && sliceSlideDistance === 0) {
          knifeCutting = true;
          knifeGroup.visible = true;
        }

        if (knifeCutting) {
          knifeCutProgress = Math.min(1, knifeCutProgress + delta * 1.4);
          // Knife slices down along Y
          knifeGroup.position.x = 1.0;
          knifeGroup.position.z = 0.5;
          knifeGroup.position.y = 4.2 - knifeCutProgress * 2.8;
          knifeGroup.rotation.z = -Math.PI / 6 + Math.sin(knifeCutProgress * Math.PI) * 0.2;

          if (knifeCutProgress >= 1) {
            knifeCutting = false;
            knifeGroup.visible = false;
            if (onSliceCompleteRef.current) {
              onSliceCompleteRef.current();
            }
          }
        }

        // Slide the wedge slice out outwards along angle sliceAngle / 2
        if (knifeCutProgress >= 0.7) {
          sliceSlideDistance = THREE.MathUtils.lerp(sliceSlideDistance, 0.65, 0.05);
          const midAngle = sliceAngle / 2;
          cutSliceGroup.position.x = Math.cos(midAngle) * sliceSlideDistance;
          cutSliceGroup.position.z = Math.sin(midAngle) * sliceSlideDistance;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto touch-none"
      style={{ touchAction: 'none' }}
    />
  );
};
