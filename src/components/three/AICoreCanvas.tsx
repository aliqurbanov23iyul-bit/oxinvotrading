import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BotStatus } from '../../types';

interface TradingCandlestickCanvasProps {
  status?: BotStatus;
  interactive?: boolean;
  variant?: 'hero' | 'compact';
  onPhaseChange?: (phaseIndex: number) => void;
}

interface CandleSpec {
  open: number;
  close: number;
  high: number;
  low: number;
}

const CANDLE_SERIES: CandleSpec[] = [
  { open: -0.95, close: -0.62, high: -0.45, low: -1.12 },
  { open: -0.62, close: -0.78, high: -0.52, low: -0.96 },
  { open: -0.78, close: -0.35, high: -0.22, low: -0.88 },
  { open: -0.35, close: -0.05, high: 0.14, low: -0.46 },
  { open: -0.05, close: -0.28, high: 0.08, low: -0.41 },
  { open: -0.28, close: 0.12, high: 0.25, low: -0.34 },
  { open: 0.12, close: 0.42, high: 0.58, low: 0.04 },
  { open: 0.42, close: 0.22, high: 0.55, low: 0.11 },
  { open: 0.22, close: 0.02, high: 0.34, low: -0.14 },
  { open: 0.02, close: 0.38, high: 0.52, low: -0.06 },
  { open: 0.38, close: 0.74, high: 0.89, low: 0.30 },
  { open: 0.74, close: 0.58, high: 0.84, low: 0.46 },
  { open: 0.58, close: 0.92, high: 1.08, low: 0.50 },
  { open: 0.92, close: 0.65, high: 1.04, low: 0.54 },
  { open: 0.65, close: 0.88, high: 1.02, low: 0.56 },
  { open: 0.88, close: 1.24, high: 1.40, low: 0.80 },
  { open: 1.24, close: 1.02, high: 1.35, low: 0.91 },
  { open: 1.02, close: 1.38, high: 1.54, low: 0.96 },
  { open: 1.38, close: 1.68, high: 1.84, low: 1.28 },
  { open: 1.68, close: 1.46, high: 1.78, low: 1.32 },
  { open: 1.46, close: 1.82, high: 1.98, low: 1.38 },
  { open: 1.82, close: 1.62, high: 1.92, low: 1.50 },
  { open: 1.62, close: 1.96, high: 2.16, low: 1.55 },
  { open: 1.96, close: 2.24, high: 2.44, low: 1.88 },
];

export const TradingCandlestickCanvas: React.FC<TradingCandlestickCanvasProps> = ({
  status = 'running',
  interactive = true,
  variant = 'hero',
  onPhaseChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglUnsupported, setWebglUnsupported] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isCompactViewport = typeof window !== 'undefined' && window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isCompactViewport,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnsupported(true);
      return;
    }

    const gl = renderer.getContext();
    let isSoftwareGl = false;
    try {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const unmasked = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
      isSoftwareGl = /swiftshader|llvmpipe|software|mesa offscreen/i.test(unmasked);
    } catch {
      isSoftwareGl = false;
    }

    const maxDpr = isSoftwareGl || isCompactViewport ? 1.25 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 220);
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Environment reflection via RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(1.1, 1.55, variant === 'compact' ? 8.2 : 8.7);
    camera.lookAt(0, 0.25, 0);

    // Studio directional & blue rim lighting
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.45);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 7, 6);
    const blueRim = new THREE.PointLight(0x3b82f6, 3.2, 22);
    blueRim.position.set(-4.5, 3.2, 3.5);
    const emeraldFill = new THREE.PointLight(0x10b981, 1.4, 16);
    emeraldFill.position.set(4.5, -0.5, 4);
    scene.add(ambient, keyLight, blueRim, emeraldFill);

    // Root stage group for gentle perspective parallax
    const chartGroup = new THREE.Group();
    chartGroup.position.set(0, -0.35, 0);
    scene.add(chartGroup);

    // Perspective Grid Floor
    const grid = new THREE.GridHelper(13, 18, 0x2563eb, 0x13274c);
    grid.position.y = -1.45;
    if (Array.isArray(grid.material)) {
      grid.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.42;
      });
    } else {
      grid.material.transparent = true;
      grid.material.opacity = 0.42;
    }
    chartGroup.add(grid);

    // Candlesticks
    const activeSeries = isCompactViewport ? CANDLE_SERIES.slice(-14) : CANDLE_SERIES;
    const spacing = isCompactViewport ? 0.42 : 0.34;
    const startX = -((activeSeries.length - 1) * spacing) / 2;

    const unitBoxGeo = new THREE.BoxGeometry(isCompactViewport ? 0.22 : 0.19, 1, isCompactViewport ? 0.22 : 0.19);
    const unitWickGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 8);

    const bullMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.35,
      roughness: 0.24,
      metalness: 0.18,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
    });

    const bearMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.32,
      roughness: 0.26,
      metalness: 0.18,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2,
    });

    const bullWickMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      emissive: 0x10b981,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.4,
    });

    const bearWickMat = new THREE.MeshStandardMaterial({
      color: 0xfca5a5,
      emissive: 0xef4444,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.4,
    });

    interface CandleHandle {
      body: THREE.Mesh;
      wick: THREE.Mesh;
      baseCenterY: number;
      baseHeight: number;
      wickCenterY: number;
      wickHeight: number;
      index: number;
      isLastCluster: boolean;
    }

    const candleHandles: CandleHandle[] = [];
    const emaPoints: THREE.Vector3[] = [];
    const fastPoints: THREE.Vector3[] = [];
    let ema = activeSeries[0].close;

    activeSeries.forEach((c, idx) => {
      const x = startX + idx * spacing;
      const bullish = c.close >= c.open;
      const bodyHeight = Math.max(0.11, Math.abs(c.close - c.open));
      const bodyCenterY = (c.open + c.close) / 2;
      const wickHeight = Math.max(bodyHeight + 0.1, c.high - c.low);
      const wickCenterY = (c.high + c.low) / 2;

      const body = new THREE.Mesh(unitBoxGeo, bullish ? bullMat : bearMat);
      body.position.set(x, bodyCenterY, Math.sin(idx * 0.28) * 0.12);
      body.scale.set(1, bodyHeight, 1);

      const wick = new THREE.Mesh(unitWickGeo, bullish ? bullWickMat : bearWickMat);
      wick.position.set(x, wickCenterY, body.position.z);
      wick.scale.set(1, wickHeight, 1);

      chartGroup.add(body, wick);
      candleHandles.push({
        body,
        wick,
        baseCenterY: bodyCenterY,
        baseHeight: bodyHeight,
        wickCenterY,
        wickHeight,
        index: idx,
        isLastCluster: idx >= activeSeries.length - 5,
      });

      ema = ema * 0.72 + c.close * 0.28;
      emaPoints.push(new THREE.Vector3(x, ema + 0.16, body.position.z + 0.26));
      fastPoints.push(new THREE.Vector3(x, c.close + 0.28, body.position.z + 0.34));
    });

    // Smooth electric-blue trend spline & silver signal curve
    const emaCurve = new THREE.CatmullRomCurve3(emaPoints);
    const emaGeo = new THREE.TubeGeometry(emaCurve, isCompactViewport ? 48 : 84, 0.024, 8, false);
    const emaMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.92 });
    const emaMesh = new THREE.Mesh(emaGeo, emaMat);
    chartGroup.add(emaMesh);

    const fastCurve = new THREE.CatmullRomCurve3(fastPoints);
    const fastGeo = new THREE.TubeGeometry(fastCurve, isCompactViewport ? 48 : 84, 0.013, 6, false);
    const fastMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.65 });
    const fastMesh = new THREE.Mesh(fastGeo, fastMat);
    chartGroup.add(fastMesh);

    // Subtle floating data particles along horizon
    const particleCount = isCompactViewport ? 22 : 42;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = -1.2 + Math.random() * 3.8;
      particlePositions[i * 3 + 2] = -2.2 + Math.random() * 3.2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    chartGroup.add(particles);

    // Pointer parallax state (zero allocations in loop)
    let targetRotX = 0.07;
    let targetRotY = -0.22;
    const onPointerMove = (e: PointerEvent) => {
      if (!interactive || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = -0.22 + nx * 0.24;
      targetRotX = 0.07 + ny * 0.14;
    };
    const onPointerLeave = () => {
      targetRotX = 0.07;
      targetRotY = -0.22;
    };

    if (interactive) {
      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    const resizeObserver = new ResizeObserver(() => {
      const nextW = Math.max(container.clientWidth, 260);
      const nextH = Math.max(container.clientHeight, 200);
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let lastPhase = -1;
    const startMs = performance.now();

    const renderFrame = (nowMs: number) => {
      const elapsed = (nowMs - startMs) * 0.001;
      const speedMult = status === 'stopped' ? 0.25 : status === 'paused' ? 0.5 : 1;

      if (!prefersReducedMotion) {
        const t = elapsed * speedMult;
        chartGroup.rotation.y += (targetRotY + Math.sin(t * 0.35) * 0.06 - chartGroup.rotation.y) * 0.06;
        chartGroup.rotation.x += (targetRotX - chartGroup.rotation.x) * 0.06;

        // Subtle live pulse on recent candles
        for (let i = 0; i < candleHandles.length; i++) {
          const h = candleHandles[i];
          const wave = h.isLastCluster
            ? Math.sin(t * 2.1 + h.index * 0.75) * 0.09
            : Math.sin(t * 0.9 + h.index * 0.45) * 0.025;
          h.body.scale.y = Math.max(0.08, h.baseHeight + wave);
          h.body.position.y = h.baseCenterY + wave * 0.5;
          h.wick.scale.y = Math.max(0.16, h.wickHeight + wave * 0.8);
          h.wick.position.y = h.wickCenterY + wave * 0.4;
        }

        particles.rotation.y = t * 0.03;

        if (onPhaseChange) {
          const nextPhase = Math.floor(t / 3.4) % 3;
          if (nextPhase !== lastPhase) {
            lastPhase = nextPhase;
            onPhaseChange(nextPhase);
          }
        }
      } else {
        chartGroup.rotation.set(0.07, -0.22, 0);
      }

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderFrame(startMs);
    } else if (isSoftwareGl) {
      const loopSoftware = () => {
        if (disposed) return;
        renderFrame(performance.now());
        timerId = window.setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(loopSoftware);
        }, 42);
      };
      rafId = requestAnimationFrame(loopSoftware);
    } else {
      const loopGpu = (now: number) => {
        if (disposed) return;
        renderFrame(now);
        rafId = requestAnimationFrame(loopGpu);
      };
      rafId = requestAnimationFrame(loopGpu);
    }

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      }
      unitBoxGeo.dispose();
      unitWickGeo.dispose();
      bullMat.dispose();
      bearMat.dispose();
      bullWickMat.dispose();
      bearWickMat.dispose();
      emaGeo.dispose();
      emaMat.dispose();
      fastGeo.dispose();
      fastMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [status, interactive, variant, onPhaseChange]);

  if (webglUnsupported) {
    return (
      <div className="w-full h-full flex items-center justify-center px-6">
        <svg viewBox="0 0 360 180" className="w-full max-w-md h-auto" aria-hidden="true">
          <defs>
            <linearGradient id="ox-fb-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          {CANDLE_SERIES.slice(-16).map((c, idx) => {
            const x = 18 + idx * 21;
            const bull = c.close >= c.open;
            const yTop = 120 - Math.max(c.open, c.close) * 32;
            const yBot = 120 - Math.min(c.open, c.close) * 32;
            const yHigh = 120 - c.high * 32;
            const yLow = 120 - c.low * 32;
            return (
              <g key={idx}>
                <line
                  x1={x}
                  x2={x}
                  y1={yHigh}
                  y2={yLow}
                  stroke={bull ? '#34D399' : '#F87171'}
                  strokeWidth="1.6"
                />
                <rect
                  x={x - 5}
                  y={yTop}
                  width="10"
                  height={Math.max(4, yBot - yTop)}
                  rx="2"
                  fill={bull ? '#10B981' : '#EF4444'}
                />
              </g>
            );
          })}
          <path
            d="M18 134 C 90 120, 170 86, 333 44"
            fill="none"
            stroke="url(#ox-fb-line)"
            strokeWidth="2.2"
          />
        </svg>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full relative select-none" />;
};

export const AICoreCanvas = TradingCandlestickCanvas;
