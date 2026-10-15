import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { drawCardFront, drawCardBack } from '../utils/cardCanvasRenderer';

export default function ThreeStage({
  phase,             // 'intake' (Phase 1) | 'warping' | 'card' (Phase 2)
  cardData,
  userPhotoImg,
  isFlipped,
  onWarpComplete,
}) {
  const mountRef = useRef(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  // Mutable animation state
  const stateRef = useRef({
    phase: 'intake',
    isFlipped: false,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    warpProgress: 0,
    warpActive: false,
    cardRotYTarget: 0,
    cardRotYCurrent: 0,
    cardRotXTarget: 0,
    cardRotXCurrent: 0,
    cardPosTargetZ: -45,
    cardPosCurrentZ: -45,
    cardRotZTarget: 0,
    cardRotZCurrent: 0,
    idleTime: 0,
    holoMouse: new THREE.Vector2(0.5, 0.5),
  });

  useEffect(() => {
    stateRef.current.isFlipped = isFlipped;
    stateRef.current.cardRotYTarget = isFlipped ? Math.PI : 0;
  }, [isFlipped]);

  useEffect(() => {
    stateRef.current.phase = phase;
    if (phase === 'warping') {
      stateRef.current.warpActive = true;
      stateRef.current.warpProgress = 0;
    } else if (phase === 'card') {
      stateRef.current.cardPosTargetZ = 0;
    } else if (phase === 'intake') {
      stateRef.current.cardPosTargetZ = -50;
      stateRef.current.cardPosCurrentZ = -50;
    }
  }, [phase]);

  // Redraw textures when data or image changes
  const frontTextureRef = useRef(null);
  const backTextureRef = useRef(null);

  const updateTextures = () => {
    if (frontCanvasRef.current && frontTextureRef.current) {
      drawCardFront(frontCanvasRef.current, cardData, userPhotoImg);
      frontTextureRef.current.needsUpdate = true;
    }
    if (backCanvasRef.current && backTextureRef.current) {
      drawCardBack(backCanvasRef.current, cardData);
      backTextureRef.current.needsUpdate = true;
    }
  };

  useEffect(() => {
    updateTextures();
  }, [cardData, userPhotoImg]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Scene, Camera, Renderer ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040406);
    scene.fog = new THREE.FogExp2(0x040406, 0.012);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ─── Procedural Canvas Textures (2048 x 1292) ───
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 2048;
    frontCanvas.height = 1292;
    frontCanvasRef.current = frontCanvas;

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 2048;
    backCanvas.height = 1292;
    backCanvasRef.current = backCanvas;

    drawCardFront(frontCanvas, cardData, userPhotoImg);
    drawCardBack(backCanvas, cardData);

    const frontTex = new THREE.CanvasTexture(frontCanvas);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    frontTextureRef.current = frontTex;

    const backTex = new THREE.CanvasTexture(backCanvas);
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    backTextureRef.current = backTex;

    // ─── Lighting Setup ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Mouse Spotlight
    const mouseSpot = new THREE.SpotLight(0xff8c00, 7.5, 15, Math.PI / 4, 0.6, 1.2);
    mouseSpot.position.set(0, 1.5, 4.5);
    scene.add(mouseSpot);

    // Cyber Cyan Rim Light (Top Left)
    const rimCyan = new THREE.PointLight(0x00f0ff, 4.5, 12);
    rimCyan.position.set(-4, 3, 2.5);
    scene.add(rimCyan);

    // Mars Rust Key Light (Bottom Right)
    const rimMars = new THREE.PointLight(0xff4b2b, 4.5, 12);
    rimMars.position.set(4, -3, 2.5);
    scene.add(rimMars);

    // Back light for flipped specular
    const backLight = new THREE.DirectionalLight(0xffffff, 1.6);
    backLight.position.set(0, 1, -5);
    scene.add(backLight);

    // ─── 3D Card Construction ───
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const cardW = 3.42;
    const cardH = 2.16;
    const cardDepth = 0.045;
    const radius = 0.14;

    function createRoundedRectShape(w, h, r) {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    }

    const cardShape = createRoundedRectShape(cardW, cardH, radius);

    // 1. Core Extruded Polycarbonate Body (Beveled Rim)
    const extrudeSettings = {
      steps: 1,
      depth: cardDepth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 4,
    };
    const coreGeo = new THREE.ExtrudeGeometry(cardShape, extrudeSettings);
    coreGeo.center();

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x09090e,
      roughness: 0.15,
      metalness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cardGroup.add(coreMesh);

    // 2. Front Face with Canvas Texture
    const faceGeo = new THREE.ShapeGeometry(cardShape, 24);
    faceGeo.center();

    const pos = faceGeo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      uvs[i * 2] = (px + cardW / 2) / cardW;
      uvs[i * 2 + 1] = (py + cardH / 2) / cardH;
    }
    faceGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTex,
      roughness: 0.1,
      metalness: 0.28,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
    });
    const frontMesh = new THREE.Mesh(faceGeo, frontMat);
    frontMesh.position.z = cardDepth / 2 + 0.016;
    cardGroup.add(frontMesh);

    // 3. Dynamic Holographic Iridescent Sheen Layer (Front)
    const holoUniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uIntensity: { value: 0.9 },
    };

    const holoVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const holoFragmentShader = `
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uIntensity;

      void main() {
        vec2 p = vUv - uMouse;
        float dist = length(p);
        float glare = smoothstep(1.1, 0.0, dist);

        // Rainbow Spectrum
        float angle = atan(p.y, p.x);
        float hue = fract(dist * 1.6 - uTime * 0.15 + angle * 0.15);

        vec3 c1 = vec3(1.0, 0.29, 0.17); // #FF4B2B
        vec3 c2 = vec3(1.0, 0.78, 0.0);  // #FFC800
        vec3 c3 = vec3(0.0, 0.94, 0.78); // #00F0C0
        vec3 c4 = vec3(0.31, 0.39, 1.0); // #5064FF
        vec3 c5 = vec3(1.0, 0.0, 0.78);  // #FF00C8

        vec3 rainbow;
        if (hue < 0.25) rainbow = mix(c1, c2, hue / 0.25);
        else if (hue < 0.5) rainbow = mix(c2, c3, (hue - 0.25) / 0.25);
        else if (hue < 0.75) rainbow = mix(c3, c4, (hue - 0.5) / 0.25);
        else rainbow = mix(c4, c5, (hue - 0.75) / 0.25);

        // Diagonal Specular Glint
        float glint = pow(max(0.0, sin((vUv.x * 2.2 + vUv.y * 1.6) * 3.5 + uMouse.x * 4.0)), 7.0) * 0.45;

        vec3 finalCol = rainbow * glare * 0.75 + vec3(glint);
        gl_FragColor = vec4(finalCol, (glare * 0.8 + glint * 0.4) * uIntensity);
      }
    `;

    const holoMatFront = new THREE.ShaderMaterial({
      vertexShader: holoVertexShader,
      fragmentShader: holoFragmentShader,
      uniforms: holoUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const holoMeshFront = new THREE.Mesh(faceGeo.clone(), holoMatFront);
    holoMeshFront.position.z = cardDepth / 2 + 0.019;
    cardGroup.add(holoMeshFront);

    // 4. Back Face with Canvas Texture
    const backGeo = faceGeo.clone();
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTex,
      roughness: 0.12,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -(cardDepth / 2 + 0.016);
    backMesh.rotation.y = Math.PI;
    cardGroup.add(backMesh);

    // Holographic Sheen Layer (Back Face)
    const holoMatBack = holoMatFront.clone();
    const holoMeshBack = new THREE.Mesh(backGeo.clone(), holoMatBack);
    holoMeshBack.position.z = -(cardDepth / 2 + 0.019);
    holoMeshBack.rotation.y = Math.PI;
    cardGroup.add(holoMeshBack);

    // Initial card position
    cardGroup.position.set(0, 0, -50);

    // ─── Particle / Dust System ───
    const particleCount = 2200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 45;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(255, 140, 0, 0.7)');
    pGrad.addColorStop(1, 'rgba(255, 75, 43, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Speedlines for warp
    const speedlineCount = 180;
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(speedlineCount * 2 * 3);
    for (let i = 0; i < speedlineCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = -Math.random() * 50;
      linePos[i * 6] = x;
      linePos[i * 6 + 1] = y;
      linePos[i * 6 + 2] = z;
      linePos[i * 6 + 3] = x;
      linePos[i * 6 + 4] = y;
      linePos[i * 6 + 5] = z - 2;
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffa050,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const speedlines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(speedlines);

    // ─── Pointer Move ───
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetMouseX = Math.max(-1, Math.min(1, x));
      stateRef.current.targetMouseY = Math.max(-1, Math.min(1, y));

      // Hologram glare position (0 to 1)
      stateRef.current.holoMouse.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height
      );
    };

    window.addEventListener('pointermove', handlePointerMove);

    // ─── Resize ───
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ─── Animation Loop ───
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const state = stateRef.current;
      state.idleTime += delta;

      // Mouse lerp smoothing
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.08;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.08;

      // Update Holographic Shader Uniforms
      holoUniforms.uTime.value = state.idleTime;
      holoUniforms.uMouse.value.lerp(state.holoMouse, 0.1);

      // Move spotlight with mouse
      mouseSpot.position.x = state.mouseX * 3.5;
      mouseSpot.position.y = state.mouseY * 2.5 + 0.8;
      mouseSpot.target.position.set(state.mouseX * 0.8, state.mouseY * 0.5, 0);
      mouseSpot.target.updateMatrixWorld();

      // 1. PARTICLES & WARP
      const posAttr = particleGeo.attributes.position;
      const pArr = posAttr.array;

      if (state.warpActive) {
        state.warpProgress += delta * 0.85;

        lineMat.opacity = Math.min(0.9, Math.sin(Math.min(1, state.warpProgress) * Math.PI) * 1.2);
        particleMat.size = 0.065 + Math.sin(state.warpProgress * Math.PI) * 0.12;

        const lineArr = lineGeo.attributes.position.array;
        for (let i = 0; i < speedlineCount; i++) {
          lineArr[i * 6 + 2] += delta * 65;
          lineArr[i * 6 + 5] = lineArr[i * 6 + 2] - (3 + state.warpProgress * 8);
          if (lineArr[i * 6 + 2] > 10) {
            lineArr[i * 6 + 2] = -50 - Math.random() * 20;
          }
        }
        lineGeo.attributes.position.needsUpdate = true;

        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 2] += delta * (25 + state.warpProgress * 40);
          if (pArr[i * 3 + 2] > 10) {
            pArr[i * 3 + 2] = -40;
          }
        }

        const warpPeak = Math.sin(Math.min(1, state.warpProgress) * Math.PI);
        camera.fov = 42 + warpPeak * 26;
        camera.updateProjectionMatrix();

        if (state.warpProgress > 0.4) {
          const t = Math.min(1, (state.warpProgress - 0.4) / 0.6);
          const easeOut = 1 - Math.pow(1 - t, 3);
          cardGroup.position.z = -50 + easeOut * 50;
          cardGroup.rotation.z = (1 - easeOut) * Math.PI * 2;
          cardGroup.rotation.y = (1 - easeOut) * Math.PI * 3 + (state.isFlipped ? Math.PI : 0);
        }

        if (state.warpProgress >= 1.0) {
          state.warpActive = false;
          lineMat.opacity = 0;
          camera.fov = 42;
          camera.updateProjectionMatrix();
          cardGroup.position.z = 0;
          if (onWarpComplete) {
            onWarpComplete();
          }
        }
      } else {
        const speed = state.phase === 'intake' ? 0.35 : 0.8;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3] += particleVelocities[i * 3] * speed;
          pArr[i * 3 + 1] += particleVelocities[i * 3 + 1] * speed;
          pArr[i * 3 + 2] += particleVelocities[i * 3 + 2] * speed;

          if (Math.abs(pArr[i * 3]) > 14) pArr[i * 3] = -pArr[i * 3] * 0.95;
          if (Math.abs(pArr[i * 3 + 1]) > 10) pArr[i * 3 + 1] = -pArr[i * 3 + 1] * 0.95;
          if (pArr[i * 3 + 2] > 8) pArr[i * 3 + 2] = -40;
          if (pArr[i * 3 + 2] < -42) pArr[i * 3 + 2] = 6;
        }
      }
      posAttr.needsUpdate = true;

      // 2. CARD TILT & FLIP (Phase 2)
      if (state.phase === 'card' && !state.warpActive) {
        const idleY = Math.sin(state.idleTime * 1.5) * 0.04;
        const idleRotZ = Math.sin(state.idleTime * 1.2) * 0.015;

        cardGroup.position.y += (idleY - cardGroup.position.y) * 0.1;
        cardGroup.position.z += (0 - cardGroup.position.z) * 0.1;

        const maxTiltY = 0.38;
        const maxTiltX = 0.32;
        const tiltY = state.mouseX * maxTiltY;
        const tiltX = -state.mouseY * maxTiltX;

        const targetRotY = (state.isFlipped ? Math.PI : 0) + tiltY;
        const targetRotX = tiltX;

        cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.09;
        cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.09;
        cardGroup.rotation.z += (idleRotZ - cardGroup.rotation.z) * 0.09;

        rimCyan.position.x = -4 + state.mouseX * 2;
        rimMars.position.x = 4 + state.mouseX * 2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
}
