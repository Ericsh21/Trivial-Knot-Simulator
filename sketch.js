let scene, camera, renderer;
let curve, curveGeometry, curveObject;
let points = [];
let numPoints = 12; // Number of control points
let sphereHandles = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedHandle = null;
let isDragging = false;
let cameraRotationSpeed = 0.02;
let cameraZoomSpeed = 0.2;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.addEventListener("contextmenu", (event) => event.preventDefault()); // Prevent default right-click menu
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("keydown", onKeyDown, false);

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
        let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -camera.position.z);
        let planeIntersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, planeIntersect);
        
        if (planeIntersect) {
            selectedHandle.position.copy(planeIntersect);
            updateCurve();
        }
    }
}

function onMouseUp(event) {
    isDragging = false;
    selectedHandle = null;
}

function onKeyDown(event) {
    switch (event.key) {
        case "w": // Tilt down
            camera.rotation.x -= cameraRotationSpeed;
            break;
        case "s": // Tilt up
            camera.rotation.x += cameraRotationSpeed;
            break;
        case "a": // Tilt right
            camera.rotation.y -= cameraRotationSpeed;
            break;
        case "d": // Tilt left
            camera.rotation.y += cameraRotationSpeed;
            break;
        case "e": // Zoom in
            camera.position.z -= cameraZoomSpeed;
            break;
        case "q": // Zoom out
            camera.position.z += cameraZoomSpeed;
            break;
    }
}

function updateCurve() {
    for (let i = 0; i < points.length; i++) {
        points[i].copy(sphereHandles[i].position);
    }
    drawCurve();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();