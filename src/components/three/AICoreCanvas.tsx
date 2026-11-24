import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BotStatus } from '../../types';

interface AICoreCanvasProps {
  status?: BotStatus;
  active?: boolean;
  interactive?: boolean;
  variant?: 'hero' | 'compact';
  className?: string;
}

function createSoftParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.28, 'rgba(96, 165, 250, 0.92)');
    grad.addColorStop(0.65, 'rgba(37, 99, 235, 0.35)');
    grad.addColorStop(1, 'rgba(37, 99, 235, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const AICoreCanvas: React.FC<AICoreCanvasProps> = ({
  status,
  active = true,
  interactive = true,
  variant = 'hero',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedStatus: BotStatus = status ?? (active ? 'running' : 'paused');
  const statusRef = useRef<BotStatus>(resolvedStatus);
  statusRef.current = resolvedStatus;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 160);
    const height = Math.max(container.clientHeight, 160);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const glRenderer = dbgInfo ? String(gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /swiftshader|llvmpipe|softpipe|software/i.test(glRenderer);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, variant === 'hero' ? 4.9 : 5.3);

    // Bright blue & white studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4.2, 4.8, 5.5);
    scene.add(keyLight);

    const blueFillLight = new THREE.PointLight(0x2563eb, 4.2, 16);
    blueFillLight.position.set(-3.2, -2.0, 3.8);
    scene.add(blueFillLight);

    const cyanRimLight = new THREE.PointLight(0x60a5fa, 3.6, 16);
    cyanRimLight.position.set(3.4, 2.6, -2.2);
    scene.add(cyanRimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inner Fluid Animated Blue Energy Sphere
    const coreUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uColorDeep: { value: new THREE.Color(0x1d4ed8) },
      uColorPrimary: { value: new THREE.Color(0x2563eb) },
      uColorLight: { value: new THREE.Color(0x60a5fa) },
      uColorHighlight: { value: new THREE.Color(0xeef6ff) },
    };

    const fluidCoreGeo = new THREE.SphereGeometry(0.92, isSoftwareGl ? 36 : 64, isSoftwareGl ? 36 : 64);
    const fluidCoreMat = new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 p = position;
          float wave1 = sin(p.x * 3.8 + uTime * 1.45) * cos(p.y * 3.4 - uTime * 1.15);
          float wave2 = sin(p.z * 4.2 + uTime * 1.8) * 0.5;
          float disp = (wave1 + wave2) * 0.042 * uIntensity;
          vec3 displaced = p + normal * disp;
          vPos = displaced;
          vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uColorDeep;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorLight;
        uniform vec3 uColorHighlight;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vViewDir;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewDir);
          float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.2);

          float plasmaA = sin(vPos.x * 4.2 + uTime * 1.3) * cos(vPos.y * 3.9 - uTime * 1.1);
          float plasmaB = sin((vPos.z + vPos.y) * 5.0 + uTime * 1.7);
          float flow = clamp((plasmaA * 0.5 + plasmaB * 0.5) * 0.5 + 0.5, 0.0, 1.0);

          vec3 base = mix(uColorDeep, uColorPrimary, smoothstep(0.12, 0.72, flow));
          base = mix(base, uColorLight, smoothstep(0.55, 0.96, flow));
          base = mix(base, uColorHighlight, fresnel * (0.68 + 0.22 * uIntensity));

          gl_FragColor = vec4(base, 0.96);
        }
      `,
      transparent: true,
    });
    const fluidCoreMesh = new THREE.Mesh(fluidCoreGeo, fluidCoreMat);
    rootGroup.add(fluidCoreMesh);

    // 2. Smooth Optical Glass Outer Shell
    const glassGeo = new THREE.SphereGeometry(1.16, isSoftwareGl ? 36 : 64, isSoftwareGl ? 36 : 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xeaf2ff),
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      ior: 1.45,
      reflectivity: 0.9,
      envMapIntensity: 1.35,
      transmission: isSoftwareGl ? 0.0 : 0.72,
      thickness: 0.65,
      transparent: true,
      opacity: isSoftwareGl ? 0.26 : 0.95,
      depthWrite: false,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    rootGroup.add(glassMesh);

    // 3. Soft Inner Halo Shell
    const haloGeo = new THREE.SphereGeometry(1.28, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    rootGroup.add(haloMesh);

    // 4. Smooth Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(1.56, 0.014, 16, 128);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.42,
      metalness: 0.55,
      roughness: 0.2,
      transparent: true,
      opacity: 0.78,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.78, 0.01, 16, 128);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.35,
      metalness: 0.45,
      roughness: 0.25,
      transparent: true,
      opacity: 0.62,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(-Math.PI * 0.28, Math.PI * 0.44, 0.22);
    rootGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(1.98, 0.007, 12, 128);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.4,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.set(Math.PI * 0.48, -Math.PI * 0.2, 0.4);
    rootGroup.add(ring3);

    // 5. Soft Glowing Floating Particles
    const particleCount = isSoftwareGl ? 64 : 110;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBaseRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.45 + Math.random() * 1.15;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.1;
      particleBaseRadii[i] = r;
      particleAngles[i] = theta;
      particleHeights[i] = y;
      particlePositions[i * 3] = Math.cos(theta) * r;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(theta) * r;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleTex = createSoftParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      map: particleTex,
      color: 0x2563eb,
      size: variant === 'hero' ? 0.14 : 0.12,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nextW = Math.max(container.clientWidth, 160);
      const nextH = Math.max(container.clientHeight, 160);
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH, false);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // State target palette (Running = vivid blue energy, Paused = calm soft blue, Stopped = cool slate blue)
    const statePalettes: Record<
      BotStatus,
      { deep: number; primary: number; light: number; ring: number; speed: number; intensity: number; halo: number }
    > = {
      running: {
        deep: 0x1d4ed8,
        primary: 0x2563eb,
        light: 0x60a5fa,
        ring: 0x2563eb,
        speed: 1.0,
        intensity: 1.0,
        halo: 0.16,
      },
      paused: {
        deep: 0x3b82f6,
        primary: 0x60a5fa,
        light: 0xbfdbfe,
        ring: 0x60a5fa,
        speed: 0.34,
        intensity: 0.45,
        halo: 0.1,
      },
      stopped: {
        deep: 0x475569,
        primary: 0x64748b,
        light: 0x94a3b8,
        ring: 0x94a3b8,
        speed: 0.1,
        intensity: 0.18,
        halo: 0.05,
      },
    };

    let simTime = 0;
    let lastNow = performance.now();
    let rafId = 0;
    let timerId = 0;
    let disposed = false;

    const targetColorDeep = new THREE.Color();
    const targetColorPrimary = new THREE.Color();
    const targetColorLight = new THREE.Color();
    const targetRingColor = new THREE.Color();

    const stepScene = (now: number) => {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;

      const palette = statePalettes[statusRef.current];
      const speedMult = prefersReducedMotion ? 0.15 : palette.speed;
      simTime += dt * speedMult;

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      targetColorDeep.setHex(palette.deep);
      targetColorPrimary.setHex(palette.primary);
      targetColorLight.setHex(palette.light);
      targetRingColor.setHex(palette.ring);

      coreUniforms.uTime.value = simTime * 1.4;
      coreUniforms.uIntensity.value += (palette.intensity - coreUniforms.uIntensity.value) * 0.08;
      coreUniforms.uColorDeep.value.lerp(targetColorDeep, 0.08);
      coreUniforms.uColorPrimary.value.lerp(targetColorPrimary, 0.08);
      coreUniforms.uColorLight.value.lerp(targetColorLight, 0.08);

      ring1Mat.color.lerp(targetRingColor, 0.08);
      ring1Mat.emissive.lerp(targetRingColor, 0.08);
      ring1Mat.emissiveIntensity = statusRef.current === 'running' ? 0.45 : statusRef.current === 'paused' ? 0.24 : 0.08;
      haloMat.opacity += (palette.halo - haloMat.opacity) * 0.08;
      particleMat.opacity += ((statusRef.current === 'stopped' ? 0.35 : 0.85) - particleMat.opacity) * 0.08;

      const breath = 1 + Math.sin(simTime * 1.8) * (statusRef.current === 'running' ? 0.032 : 0.012);
      fluidCoreMesh.scale.setScalar(breath);
      glassMesh.scale.setScalar(1 + Math.sin(simTime * 1.8) * 0.01);

      rootGroup.rotation.y = pointer.x * 0.32 + simTime * 0.16;
      rootGroup.rotation.x = pointer.y * 0.22;

      ring1.rotation.z = simTime * 0.42;
      ring1.rotation.x = Math.PI * 0.36 + Math.sin(simTime * 0.5) * 0.08;

      ring2.rotation.z = -simTime * 0.31;
      ring2.rotation.y = Math.PI * 0.44 + Math.cos(simTime * 0.4) * 0.08;

      ring3.rotation.z = simTime * 0.19;

      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const theta = particleAngles[i] + simTime * (0.18 + (i % 4) * 0.04);
        const r = particleBaseRadii[i] + Math.sin(simTime * 1.2 + i) * 0.06;
        posAttr.array[i * 3] = Math.cos(theta) * r;
        posAttr.array[i * 3 + 1] = particleHeights[i] + Math.sin(simTime + i * 0.6) * 0.09;
        posAttr.array[i * 3 + 2] = Math.sin(theta) * r;
      }
      posAttr.needsUpdate = true;
    };

    // Synchronous initial paint before scheduling next frame
    stepScene(performance.now());
    renderer.render(scene, camera);

    const scheduleNext = () => {
      if (disposed) return;
      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          if (disposed) return;
          rafId = requestAnimationFrame(renderLoop);
        }, 70);
      } else {
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    const renderLoop = (now: number) => {
      if (disposed) return;
      stepScene(now);
      renderer.render(scene, camera);
      scheduleNext();
    };

    scheduleNext();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      fluidCoreGeo.dispose();
      fluidCoreMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, variant]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative ${className}`}
      aria-label="OXINVO AI Sphere"
    />
  );
};
