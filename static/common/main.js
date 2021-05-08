export function randomI(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function genName() {
    return `user${randomI(0, 10000).toString().padStart(4, '0')}`;
}