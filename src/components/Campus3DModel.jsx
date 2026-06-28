import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getUniversityLogo } from '../data/universities';

export default function Campus3DModel({ colorHex, uniId }) {
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
    renderer.shadowMap.enabled = false;
    containerRef.current.appendChild(renderer.domElement);

    // ─── Logo Group ───
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(getUniversityLogo(uniId));

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37, // Rich Gold
      metalness: 0.9,
      roughness: 0.15
    });

    // 1. Detailed 3D Volumetric Extruded Logo (Layer Stacked Sandwich)
    const medallion = new THREE.Group();
    logoGroup.add(medallion);

    // Number of slices to create the 3D depth
    const layers = 24;
    const depth = 0.32; // total depth
    const step = depth / layers;

    // Materials
    const frontMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      roughness: 0.25,
      metalness: 0.2,
      alphaTest: 0.35,
      side: THREE.FrontSide
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      roughness: 0.25,
      metalness: 0.2,
      alphaTest: 0.35,
      side: THREE.FrontSide
    });

    // Metallic material matching university's theme color for the extruded body sides
    const edgeColor = colorHex ? new THREE.Color(colorHex) : new THREE.Color(0xD4AF37);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      color: edgeColor,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      alphaTest: 0.35,
      side: THREE.DoubleSide
    });

    const faceGeo = new THREE.PlaneGeometry(3.6, 3.6);

    for (let i = 0; i <= layers; i++) {
      const zPos = -depth / 2 + i * step;
      let mesh;
      if (i === layers) {
        // Front layer (colored logo)
        mesh = new THREE.Mesh(faceGeo, frontMat);
        mesh.position.z = zPos;
      } else if (i === 0) {
        // Back layer (colored logo, facing backward)
        mesh = new THREE.Mesh(faceGeo, backMat);
        mesh.position.z = zPos;
        mesh.rotation.y = Math.PI;
      } else {
        // Middle layers (extruded metallic core)
        mesh = new THREE.Mesh(faceGeo, edgeMaterial);
        mesh.position.z = zPos;
      }
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      medallion.add(mesh);
    }

    // Holographic Base Ring at the bottom
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
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coneMesh = new THREE.Mesh(lineGeo, lineMat);
    coneMesh.position.y = -1.1;
    scene.add(coneMesh);

    // ─── Lights ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 8);
    dirLight.castShadow = false;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(colorHex || '#0B5D56', 1.5, 10);
    pointLight.position.set(0, -2, 2);
    scene.add(pointLight);

    // ─── Mouse Drag Orbit ───
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) {
        // Subtle hover parallax
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / width) * 2 - 1;
        const y = -((e.clientY - rect.top) / height) * 2 + 1;
        logoGroup.rotation.y = x * 0.4;
        logoGroup.rotation.x = y * 0.2;
        return;
      }
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      logoGroup.rotation.y += deltaMove.x * 0.007;
      logoGroup.rotation.x += deltaMove.y * 0.007;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // ─── Animation Loop ───
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous rotation & float if not dragging
      if (!isDragging) {
        logoGroup.rotation.y = time * 0.8; // rotating around its own edges
        logoGroup.position.y = Math.sin(time * 1.5) * 0.15; // smooth bobbing
      }

      // Rotate holographic elements
      ringMesh.rotation.z = -time * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize Handler ───
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
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (containerRef.current && domElement.parentNode) {
        containerRef.current.removeChild(domElement);
      }

      // Dispose resources
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [uniId, colorHex]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-60 cursor-grab active:cursor-grabbing relative overflow-hidden" 
    />
  );
}
