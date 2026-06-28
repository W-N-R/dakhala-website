import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Mdcat3DModel({ colorHex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 240;

    // ─── Scene, Camera, Renderer ───
    const scene = new THREE.Scene();

    // Set up camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // ─── DNA Helix Group ───
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Create DNA Double Helix
    const numPoints = 22;
    const helixRadius = 1.0;
    const helixHeight = 3.6;
    const angleStep = 0.35; // Twist rate

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const strand1Mat = new THREE.MeshStandardMaterial({
      color: colorHex ? new THREE.Color(colorHex) : new THREE.Color('#0B5D56'), // Brand Deep Teal
      metalness: 0.8,
      roughness: 0.2,
      emissive: colorHex ? new THREE.Color(colorHex).multiplyScalar(0.2) : new THREE.Color('#0B5D56').multiplyScalar(0.2)
    });

    const strand2Mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14B8A6'), // Mint Teal Accent
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color('#14B8A6').multiplyScalar(0.2)
    });

    const rungGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const rungMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.9,
      roughness: 0.1
    });

    // Generate Helix nodes and connections
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const y = (i / numPoints) * helixHeight - (helixHeight / 2);

      // Strand 1 Position
      const x1 = Math.sin(angle) * helixRadius;
      const z1 = Math.cos(angle) * helixRadius;

      // Strand 2 Position (opposite phase)
      const x2 = Math.sin(angle + Math.PI) * helixRadius;
      const z2 = Math.cos(angle + Math.PI) * helixRadius;

      // Sphere 1
      const sphere1 = new THREE.Mesh(sphereGeo, strand1Mat);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      // Sphere 2
      const sphere2 = new THREE.Mesh(sphereGeo, strand2Mat);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Connecting Rung (every 2nd node to keep it clean)
      if (i % 2 === 0) {
        const rung = new THREE.Mesh(rungGeo, rungMat);
        // Position at center of the two nodes
        rung.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        
        // Scale and rotate cylinder to connect sphere 1 and sphere 2
        rung.scale.y = helixRadius * 2;
        
        // Point the cylinder towards Sphere 1
        const direction = new THREE.Vector3(x1 - x2, 0, z1 - z2).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
        rung.setRotationFromQuaternion(quaternion);

        dnaGroup.add(rung);
      }
    }

    // ─── Holographic Base Ring at the bottom ───
    const ringGeo = new THREE.RingGeometry(1.8, 1.9, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: colorHex || '#0B5D56', 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -2.2;
    scene.add(ringMesh);

    // Subtle projection lines
    const lineGeo = new THREE.CylinderGeometry(1.8, 0.1, 2.2, 32, 1, true);
    const lineMat = new THREE.MeshBasicMaterial({
      color: colorHex || '#0B5D56',
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coneMesh = new THREE.Mesh(lineGeo, lineMat);
    coneMesh.position.y = -1.1;
    scene.add(coneMesh);

    // ─── Lights ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 8);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(colorHex || '#0B5D56', 1.8, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // ─── Mouse Drag Orbit ───
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      dnaGroup.rotation.y += deltaX * 0.01;
      dnaGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      dnaGroup.rotation.y += deltaX * 0.01;
      dnaGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // ─── Animation Loop ───
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation when not dragging
      if (!isDragging) {
        dnaGroup.rotation.y += 0.012;
        // Subtle vertical oscillation
        dnaGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── Handle Resize ───
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      
      if (containerRef.current && dom.parentNode === containerRef.current) {
        containerRef.current.removeChild(dom);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [colorHex]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[220px] cursor-grab active:cursor-grabbing select-none"
    />
  );
}
