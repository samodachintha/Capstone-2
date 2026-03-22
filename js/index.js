import * as THREE from 'three';

const container = document.getElementById('canvas-container');
if (container) {
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry & Premium MeshPhysicalMaterial
    // An Icosahedron gives a sleek, low-poly tech crystal vibe
    const geometry = new THREE.IcosahedronGeometry(1.2, 0); 
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x050505, // matches your #050505 background tone
        metalness: 0.9,   // highly metallic to reflect the neon lights
        roughness: 0.15,  // glossy
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9      // slight transparency to blend in seamlessly
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Scale it down to be small but visible
    mesh.scale.set(0.6, 0.6, 0.6);
    
    // Move it to the middle-left, so it sits behind the hero text and away from the profile pic!
    mesh.position.set(-2.5, 0.5, -1);

    scene.add(mesh);

    // Floating animation offset
    let time = 0;

    // Lighting (crucial for MeshPhysicalMaterial to look good)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff003c, 2.5); // accent color
    pointLight.position.set(3, 4, 3);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7000ff, 2); // accent alt
    pointLight2.position.set(-3, -2, -3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x00f0ff, 1.5); // primary color
    pointLight3.position.set(0, 5, -2);
    scene.add(pointLight3);

    // Animation Loop
    const animate = function () {
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        
        // Gentle floating effect with its new base Y position
        time += 0.01;
        mesh.position.y = 0.5 + Math.sin(time) * 0.15;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });
}