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

// --- Logo 3D Glow & Refraction Effect ---
const logoEl = document.querySelector('.logo');
if (logoEl) {
    logoEl.style.position = 'relative';
    logoEl.style.display = 'inline-block';
    
    // Keep text on top
    const textSpan = document.createElement('span');
    textSpan.innerHTML = logoEl.innerHTML;
    textSpan.style.position = 'relative';
    textSpan.style.zIndex = '2';
    // Add subtle glow to text to match the 3D glowing effect underneath
    textSpan.style.textShadow = '0 0 15px rgba(0, 240, 255, 0.6), 0 0 20px rgba(112, 0, 255, 0.4)';
    textSpan.style.letterSpacing = '2px';
    
    logoEl.innerHTML = '';
    logoEl.appendChild(textSpan);

    const logoCanvasContainer = document.createElement('div');
    logoCanvasContainer.style.position = 'absolute';
    logoCanvasContainer.style.top = '50%';
    logoCanvasContainer.style.left = '50%';
    logoCanvasContainer.style.transform = 'translate(-50%, -50%)';
    // Responsive to logo width
    logoCanvasContainer.style.width = '300px'; 
    logoCanvasContainer.style.height = '100px';
    logoCanvasContainer.style.zIndex = '1';
    logoCanvasContainer.style.pointerEvents = 'none';
    logoEl.appendChild(logoCanvasContainer);

    const logoScene = new THREE.Scene();
    const logoCamera = new THREE.PerspectiveCamera(45, 300 / 100, 0.1, 100);
    logoCamera.position.z = 4;

    const logoRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    logoRenderer.setSize(300, 100);
    logoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    logoCanvasContainer.appendChild(logoRenderer.domElement);

    // Use a sleek geometry that looks cool when refracting - a horizontal capsule
    const logoGeo = new THREE.CapsuleGeometry(0.6, 2.5, 4, 32);
    
    // MeshRefractionMaterial simulation via MeshPhysicalMaterial
    const logoMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0, // This makes it a refractive material
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.8,
        specularIntensity: 1,
    });

    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    // Rotate to be horizontal
    logoMesh.rotation.z = Math.PI / 2;
    logoScene.add(logoMesh);

    // Glowing accent lights to give the "glowing effect" inside the refraction
    const primaryLightColor = 0x00f0ff; // matching var(--primary-color)
    const accentLightColor = 0x7000ff;  // matching var(--accent-alt)
    
    const logoLight1 = new THREE.PointLight(primaryLightColor, 5, 10);
    logoScene.add(logoLight1);

    const logoLight2 = new THREE.PointLight(accentLightColor, 5, 10);
    logoScene.add(logoLight2);
    
    const logoAmbient = new THREE.AmbientLight(0xffffff, 0.5);
    logoScene.add(logoAmbient);

    let logoTime = 0;
    const animateLogo = () => {
        requestAnimationFrame(animateLogo);
        // Gently rotate the capsule
        logoMesh.rotation.x = Math.sin(logoTime * 0.5) * 0.2;
        logoMesh.rotation.y = Math.cos(logoTime * 0.3) * 0.2;
        
        logoTime += 0.02;
        // Orbit lights around the refractive center to create dynamic glowing refraction
        logoLight1.position.set(
            Math.sin(logoTime) * 2,
            Math.cos(logoTime * 0.8) * 0.5,
            Math.sin(logoTime * 1.2) * 2
        );
        logoLight2.position.set(
            Math.cos(logoTime * 1.1) * 2,
            Math.sin(logoTime * 0.9) * 0.5,
            Math.cos(logoTime * 1.3) * 2
        );

        logoRenderer.render(logoScene, logoCamera);
    };
    animateLogo();
}