let points = [];
let numPoints = 12; // Number of control points
let dragging = -1; // Index of the point being dragged

function setup() {
    createCanvas(600, 600);
    let radius = 150;
    let centerX = width / 2;
    let centerY = height / 2;
    
    for (let i = 0; i < numPoints; i++) {
        let angle = map(i, 0, numPoints, 0, TWO_PI);
        let x = centerX + cos(angle) * radius;
        let y = centerY + sin(angle) * radius;
        points.push(createVector(x, y));
    }
}

function draw() {
    background(240);
    stroke(0);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let i = 0; i < points.length; i++) {
        curveVertex(points[i].x, points[i].y);
    }
    curveVertex(points[0].x, points[0].y); // Close the loop
    endShape(CLOSE);
    
    fill(0);
    for (let i = 0; i < points.length; i++) {
        ellipse(points[i].x, points[i].y, 8, 8);
    }
}

function mousePressed() {
    for (let i = 0; i < points.length; i++) {
        let d = dist(mouseX, mouseY, points[i].x, points[i].y);
        if (d < 10) {
            dragging = i;
            break;
        }
    }
}

function mouseDragged() {
    if (dragging !== -1) {
        points[dragging].x = mouseX;
        points[dragging].y = mouseY;
    }
}

function mouseReleased() {
    dragging = -1;
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        setup(); // Reset points to original trivial knot
    }
}
