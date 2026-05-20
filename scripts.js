// Modular animation and interactions for MIRACLE TECH landing page
const loadingScreen = document.getElementById('loadingScreen');
const cursor = document.getElementById('customCursor');
const cursorDot = document.getElementById('cursorDot');
const slider = document.getElementById('slider3D');
const slides = Array.from(document.querySelectorAll('.slide'));
const controls = Array.from(document.querySelectorAll('.slider-control'));
const depthCards = Array.from(document.querySelectorAll('.depth-card'));
const links = Array.from(document.querySelectorAll('a, button'));
let currentIndex = 0;

const hideLoadingScreen = () => {
  if (!loadingScreen) return;
  if (window.anime) {
    anime({
      targets: loadingScreen,
      opacity: [1, 0],
      duration: 800,
      easing: 'easeOutQuad',
      complete: () => loadingScreen.classList.add('hidden'),
    });
  } else {
    loadingScreen.classList.add('hidden');
  }
};

// Hide preloader with animation when page is ready.
window.addEventListener('load', () => {
  hideLoadingScreen();
  animateIntro();
  initScrollAnimations();
  initThreeScene();
  updateSlider();
});

setTimeout(hideLoadingScreen, 4000);

// Cursor movement and hover effects.
document.addEventListener('mousemove', (event) => {
  const { clientX: x, clientY: y } = event;
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  cursorDot.style.transform = `translate(${x}px, ${y}px)`;
});

links.forEach((link) => {
  link.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(1.4)';
  });
  link.addEventListener('mouseleave', () => {
    cursor.style.transform = cursor.style.transform.replace(' scale(1.4)', '');
  });
});

// 3D slider controls and animation update.
controls.forEach((control) => {
  control.addEventListener('click', () => {
    const direction = control.dataset.direction;
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % slides.length;
    } else {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }
    updateSlider();
  });
});

function updateSlider() {
  slides.forEach((slide, index) => {
    const offset = index - currentIndex;
    const angle = offset * 18;
    const zIndex = slides.length - Math.abs(offset);
    const scale = index === currentIndex ? 1 : 0.9;
    slide.style.zIndex = zIndex;
    slide.classList.toggle('active', index === currentIndex);
    anime({
      targets: slide,
      translateX: [`${offset * 18}%`, `${offset * 18}%`],
      translateZ: [`${offset * -60}px`, `${offset === 0 ? 0 : -120}px`],
      rotateY: [`${angle}deg`, `${angle}deg`],
      scale,
      opacity: index === currentIndex ? 1 : 0.5,
      duration: 700,
      easing: 'easeOutExpo',
    });
  });
}

// Animate intro text and buttons.
function animateIntro() {
  anime.timeline({ easing: 'easeOutExpo', duration: 900 })
    .add({
      targets: '.hero h1',
      translateY: [80, 0],
      opacity: [0, 1],
      delay: 100,
    })
    .add({
      targets: '.hero p, .hero-actions .btn, .eyebrow',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(120),
    }, '-=600');
}

// Scroll-triggered animations for section blocks.
function initScrollAnimations() {
  const items = document.querySelectorAll('.section-heading, .about-card, .service-card, .showcase-panel, .testimonial-card, .contact-info, .contact-form');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 900,
          easing: 'easeOutQuad',
          delay: 80,
        });
      }
    });
  }, { threshold: 0.18 });

  items.forEach((item) => {
    item.style.opacity = '0';
    observer.observe(item);
  });
}

// Depth effect for cards on mouse move.
depthCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    const rotateX = ((y / height) - 0.5) * 18;
    const rotateY = ((x / width) - 0.5) * 18;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(2px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  });
});

// Smooth parallax effect for hero floating panel.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.querySelector('.floating-panel').style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
  });
}

// Three.js floating sphere scene.
function initThreeScene() {
  const container = document.getElementById('threeScene');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.5, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4fd7ff,
    emissive: 0x1b2b77,
    metalness: 0.45,
    roughness: 0.1,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x4fd7ff,
    emissive: 0x44d9ff,
    metalness: 0.8,
    roughness: 0.15,
    transparent: true,
    opacity: 0.48,
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.04, 16, 120), ringMaterial);
  ring.rotation.x = Math.PI / 2.2;
  group.add(ring);

  const satelliteMaterial = new THREE.MeshStandardMaterial({
    color: 0x80e1ff,
    emissive: 0x1d3f7f,
    metalness: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.95,
  });

  const satellites = [];
  for (let i = 0; i < 3; i += 1) {
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), satelliteMaterial);
    satellite.position.set(Math.cos(i * Math.PI * 0.8) * 3, Math.sin(i * Math.PI * 0.9) * 1.2, Math.sin(i * Math.PI * 0.8) * 1.2);
    satellite.scale.setScalar(0.85);
    satellites.push(satellite);
    group.add(satellite);
  }

  const stars = new THREE.BufferGeometry();
  const starCount = 120;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const radius = 2.8 + Math.random() * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.9;
    positions[i * 3 + 2] = Math.cos(phi) * radius;
  }

  stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0x8ff1ff,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  const starField = new THREE.Points(stars, starMaterial);
  group.add(starField);

  const lightA = new THREE.PointLight(0x6f7dff, 1.2, 14);
  lightA.position.set(3, 2, 5);
  scene.add(lightA);

  const lightB = new THREE.PointLight(0x4fd7ff, 0.9, 10);
  lightB.position.set(-3, -1, 3);
  scene.add(lightB);

  const ambient = new THREE.AmbientLight(0x1b2747, 0.9);
  scene.add(ambient);

  let pointer = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let hoverState = false;

  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    targetRotation.x = pointer.y * 0.18;
    targetRotation.y = pointer.x * 0.26;

    const hue = 190 + pointer.x * 36;
    const saturation = 0.6 + Math.abs(pointer.y) * 0.2;
    const brightness = 0.75 + Math.abs(pointer.x) * 0.12;
    material.color.setHSL(hue / 360, saturation, brightness);
    material.emissive.setHSL(hue / 360, 0.55, 0.15);
    ringMaterial.emissive.setHSL(hue / 360, 0.7, 0.25);
    starMaterial.color.setHSL(hue / 360, 0.3, 0.85);
  });

  container.addEventListener('mouseenter', () => {
    hoverState = true;
    container.style.cursor = 'grab';
    anime({
      targets: mesh.material,
      opacity: 1,
      duration: 420,
      easing: 'easeOutCirc',
    });
  });

  container.addEventListener('mouseleave', () => {
    hoverState = false;
    targetRotation.x = 0;
    targetRotation.y = 0;
    container.style.cursor = 'default';
    anime({
      targets: mesh.material,
      opacity: 0.92,
      duration: 420,
      easing: 'easeOutCirc',
    });
  });

  container.addEventListener('pointerdown', () => {
    anime({
      targets: [mesh.scale, ring.scale],
      x: '+=0.06',
      y: '+=0.06',
      z: '+=0.06',
      duration: 220,
      easing: 'easeOutQuad',
      direction: 'alternate',
      loop: 1,
    });
  });

  const clock = new THREE.Clock();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const animate = () => {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    group.rotation.x += (targetRotation.x - group.rotation.x) * 0.08;
    group.rotation.y += (targetRotation.y - group.rotation.y) * 0.08;

    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.007;
    mesh.position.y = Math.sin(elapsed * 1.1) * 0.08;

    ring.rotation.z += 0.0035;
    ring.position.y = Math.sin(elapsed * 0.9) * 0.05;
    ring.scale.setScalar(hoverState ? 1.02 : 1);

    starField.rotation.y += 0.0025;
    starField.position.x = Math.cos(elapsed * 0.25) * 0.03;

    satellites.forEach((satellite, index) => {
      const speed = 0.9 + index * 0.12;
      satellite.position.x = Math.cos(elapsed * speed + index * 2.1) * 3.1;
      satellite.position.y = Math.sin(elapsed * speed * 1.1 + index * 1.7) * 1.2;
      satellite.position.z = Math.sin(elapsed * speed * 0.85 + index * 1.3) * 1.3;
    });

    renderer.render(scene, camera);
  };

  animate();
}

// Smooth button hover glow using anime.js.
document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('mouseenter', () => {
    anime({
      targets: button,
      scale: 1.04,
      duration: 260,
      easing: 'easeOutQuad',
    });
  });
  button.addEventListener('mouseleave', () => {
    anime({
      targets: button,
      scale: 1,
      duration: 260,
      easing: 'easeOutQuad',
    });
  });
});

// Button and link hover effect for cursor.
const hoverTargets = document.querySelectorAll('.btn, .slider-control, .nav-links a');
hoverTargets.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    cursor.style.width = '72px';
    cursor.style.height = '72px';
  });
  item.addEventListener('mouseleave', () => {
    cursor.style.width = '52px';
    cursor.style.height = '52px';
  });
});
