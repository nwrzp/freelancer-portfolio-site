// Импортируем нужные компоненты из Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Находим контейнер на странице
const container = document.getElementById('canvas-container');

// 2. Создаем сцену, камеру и рендерер
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0); // Серый фон

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(5, 5, 10); // Ставим камеру под углом
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Включаем тени (если нужны)
container.appendChild(renderer.domElement);

// 3. Добавляем управление мышкой (поворот/зум)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавная инерция
controls.target.set(0, 0, 0);

// 4. Свет (без света модель будет черной!)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ЗАГРУЗКА МОДЕЛИ (сразу, но она скрыта)
const loader = new GLTFLoader();
let modelLoaded = false;

// Дополнительный свет сзади, чтобы подсветить тени
const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(-10, 0, -10);
scene.add(backLight);

// 5. ЗАГРУЖАЕМ ВАШУ 3D МОДЕЛЬ
// const loader = new GLTFLoader();
loader.load(
    'models/model.glb', 
    function (gltf) {
        const model = gltf.scene;
        // Включаем прозрачность
                model.traverse(function (child) {
                    if (child.isMesh) {
                        child.material.transparent = true;
                        child.material.opacity = 1.0;
                    }
                });
        
        model.scale.set(1, 1, 1);  // ← попробуй 0.1, 10, 100
        
        scene.add(model);
        console.log('Модель загружена!');
    },
    undefined,
    function (error) { console.error(error); },
    
    // Функция для отслеживания прогресса загрузки (опционально)
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% загружено');
    },
    
    // Функция, которая сработает при ошибке
    function (error) {
        console.error('Ошибка загрузки модели:', error);
    }
);

// 6. Анимационный цикл (бесконечный рендеринг)
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Обновляем управление (для плавности)
    renderer.render(scene, camera);
}
animate();

// 7. Адаптация под изменение размера окна
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
// === ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ ===
window.showModel = function() {
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').classList.add('active');
};

controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;