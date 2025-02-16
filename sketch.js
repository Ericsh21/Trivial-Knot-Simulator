let scene, camera, renderer, controls;
let curve, curveGeometry, curveObject;
let points = [];
let numPoints = 12; // Number of control points
let sphereHandles = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create initial circular control points
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
