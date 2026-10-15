import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CosmicBackground({ isWarping, onWarpComplete }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    isWarping: false,
    warpProgress: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  useEffect(() => {
    stateRef.current.isWarping = isWarping;
    if (isWarping) {
      stateRef.current.warpProgress = 0;
    }
  }, [isWarping]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040406);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic mouse spotlight in Three.js
    const spot = new THREE.PointLight(0xff4b2b, 2.5, 25);
    spot.position.set(0, 0, 5);
    scene.add(spot);

    // Secondary cyan ambient glow
    const ambientSpot = new THREE.PointLight(0x00f0ff, 1.2, 20);
    ambientSpot.position.set(0, 3, 4);
    scene.add(ambientSpot);

    // 1. Cosmic Dust Particles (2,000 points)
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 35;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 40;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.35, 'rgba(255, 140, 0, 0.7)');
    pGrad.addColorStop(1, 'rgba(255, 75, 43, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTex,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Warp Speedlines (during hyperdrive transition)
    const speedlineCount = 200;
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(speedlineCount * 2 * 3);
    for (let i = 0; i < speedlineCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 15;
      const z = -Math.random() * 45;
      linePos[i * 6] = x;
      linePos[i * 6 + 1] = y;
      linePos[i * 6 + 2] = z;
      linePos[i * 6 + 3] = x;
      linePos[i * 6 + 4] = y;
      linePos[i * 6 + 5] = z - 2;
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff8c00,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const speedlines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(speedlines);

    // Pointer move
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetMouseX = x;
      stateRef.current.targetMouseY = y;
    };

    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const state = stateRef.current;

      state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

      spot.position.x = state.mouseX * 6;
      spot.position.y = state.mouseY * 4;
      ambientSpot.position.x = -state.mouseX * 4;

      const posAttr = particleGeo.attributes.position;
      const pArr = posAttr.array;

      if (state.isWarping) {
        state.warpProgress += delta * 0.9;
        const p = Math.min(1.0, state.warpProgress);

        lineMat.opacity = Math.sin(p * Math.PI) * 0.95;
        particleMat.size = 0.075 + Math.sin(p * Math.PI) * 0.14;

        const lineArr = lineGeo.attributes.position.array;
        for (let i = 0; i < speedlineCount; i++) {
          lineArr[i * 6 + 2] += delta * 70;
          lineArr[i * 6 + 5] = lineArr[i * 6 + 2] - (3 + p * 8);
          if (lineArr[i * 6 + 2] > 10) {
            lineArr[i * 6 + 2] = -50 - Math.random() * 20;
          }
        }
        lineGeo.attributes.position.needsUpdate = true;

        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 2] += delta * (30 + p * 45);
          if (pArr[i * 3 + 2] > 10) {
            pArr[i * 3 + 2] = -40;
          }
        }

        camera.fov = 45 + Math.sin(p * Math.PI) * 25;
        camera.updateProjectionMatrix();

        if (state.warpProgress >= 1.0) {
          state.isWarping = false;
          lineMat.opacity = 0;
          camera.fov = 45;
          camera.updateProjectionMatrix();
          if (onWarpComplete) onWarpComplete();
        }
      } else {
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3] += particleVelocities[i * 3] * 0.5;
          pArr[i * 3 + 1] += particleVelocities[i * 3 + 1] * 0.5;
          pArr[i * 3 + 2] += particleVelocities[i * 3 + 2] * 0.5;

          if (Math.abs(pArr[i * 3]) > 18) pArr[i * 3] = -pArr[i * 3] * 0.95;
          if (Math.abs(pArr[i * 3 + 1]) > 13) pArr[i * 3 + 1] = -pArr[i * 3 + 1] * 0.95;
          if (pArr[i * 3 + 2] > 10) pArr[i * 3 + 2] = -40;
          if (pArr[i * 3 + 2] < -42) pArr[i * 3 + 2] = 8;
        }
      }
      posAttr.needsUpdate = true;

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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
