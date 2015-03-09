// vector operations

function add(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}

function sub(a, b) {
    return [b[0] - a[0], b[1] - a[1]];
}

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function scale(k, a) {
    return [k * a[0], k * a[1]];
}

function length(a) {
    return Math.sqrt(dot(a, a));
}

function normalize(a) {
    return scale(1 / length(a), a);
}

function project(a, b) {
    return scale(dot(a, b) / dot(b, b), b);
}

function perpL(a) {
    return [-a[1], a[0]];
}

function perpR(a) {
    return [a[1], -a[0]];
}

// line operations

// line segment intersection

// distance to point

