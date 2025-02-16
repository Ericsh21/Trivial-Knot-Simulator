let scene, camera, renderer, controls;
let curve, curveGeometry, curveObject;
let points = [];
let numPoints = 12; // Number of control points
let sphereHandles = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedHandle = null;
let isDragging = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false; // Disable default rotation
    controls.enableZoom = true;
    controls.enablePan = false; // Disable default panning
    
    document.addEventListener("contextmenu", (event) => event.preventDefault()); // Prevent default right-click menu
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mouseup", onMouseUp, false);

    let radius = 2;
    for (let i = 0; i < numPoints; i++) {
        let angle = (i / numPoints) * Math.PI * 2;
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);
        let z = 0;
        points.push(new THREE.Vector3(x, y, z));
    }
    
    drawCurve();
    createHandles();
    animate();
}

function drawCurve() {
    if (curveObject) scene.remove(curveObject);
    
    curve = new THREE.CatmullRomCurve3(points, true);
    curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    let curveMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    curveObject = new THREE.Line(curveGeometry, curveMaterial);
    scene.add(curveObject);
}

function createHandles() {
    let sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    for (let i = 0; i < points.length; i++) {
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(points[i]);
        scene.add(sphere);
        sphereHandles.push(sphere);
    }
}

function onMouseDown(event) {
    if (event.button === 2) { // Right-click starts orbit rotation
        controls.enableRotate = true;
        return;
    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(sphereHandles);
    
    if (intersects.length > 0) {
        selectedHandle = intersects[0].object;
        isDragging = true;
    }
}

function onMouseMove(event) {
    if (isDragging && selectedHandle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        let planeIntersect = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
        
        if (planeIntersect) {
            selectedHandle.position.copy(planeIntersect);
            updateCurve();
        }
    }
}

function onMouseUp(event) {
    if (event.button === 2) { // Disable orbit rotation when right-click is released
        controls.enableRotate = false;
    }
    isDragging = false;
    selectedHandle = null;
}

function updateCurve() {
    for (let i = 0; i < points.length; i++) {
        points[i].copy(sphereHandles[i].position);
    }
    drawCurve();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
