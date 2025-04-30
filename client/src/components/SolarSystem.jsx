// SolarSystem.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 50;

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planet data
    const planets = [
      { name: 'Mercury', radius: 0.8, distance: 10, speed: 0.1, color: 0x808080 },
      { name: 'Venus', radius: 1.2, distance: 15, speed: 0.08, color: 0xffa500 },
      { name: 'Earth', radius: 1.5, distance: 20, speed: 0.06, color: 0x0000ff },
      { name: 'Mars', radius: 1, distance: 25, speed: 0.04, color: 0xff0000 },
      { name: 'Jupiter', radius: 3, distance: 32, speed: 0.02, color: 0xffd700 },
      { name: 'Saturn', radius: 2.5, distance: 38, speed: 0.01, color: 0xffd39b },
    ];

    // Create planets
    const planetMeshes = planets.map((planet) => {
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Create orbit
      const orbitGeometry = new THREE.RingGeometry(
        planet.distance - 0.1,
        planet.distance + 0.1,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        opacity: 0.2,
        transparent: true,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      return {
        mesh,
        orbit: { radius: planet.distance, speed: planet.speed },
        data: planet,
      };
    });

    planetMeshes.forEach((planet) => scene.add(planet.mesh));

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate sun
      sun.rotation.y += 0.001;

      // Update planet positions
      planetMeshes.forEach((planet) => {
        time += 0.0001;
        planet.mesh.position.x =
          Math.cos(time * (1 / planet.orbit.speed)) * planet.orbit.radius;
        planet.mesh.position.z =
          Math.sin(time * (1 / planet.orbit.speed)) * planet.orbit.radius;
        planet.mesh.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        planetMeshes.map((p) => p.mesh)
      );

      if (intersects.length > 0) {
        const planet = planetMeshes.find(
          (p) => p.mesh === intersects[0].object
        );
        
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = event.clientX + 'px';
        tooltipRef.current.style.top = event.clientY + 'px';
        tooltipRef.current.innerHTML = `
          <div class="text-sm">
            <p class="font-bold">${planet.data.name}</p>
            <p>Distance from Sun: ${planet.data.distance} AU</p>
            <p>Orbital Speed: ${planet.data.speed} AU/s</p>
          </div>
        `;
      } else {
        tooltipRef.current.style.display = 'none';
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="absolute hidden bg-black bg-opacity-75 text-white p-2 rounded-lg pointer-events-none"
      />
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold">Solar System</h1>
        <p className="text-sm">Click and drag to rotate. Scroll to zoom.</p>
      </div>
    </div>
  );
};

export default SolarSystem;