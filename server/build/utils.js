"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}
exports.getRandomNumber = getRandomNumber;
function fifo(ram) {
    var min = ram[0].order;
    var mind = 0;
    var x = 1;
    for (; x < ram.length; x++) {
        if (ram[x].order < min) {
            min = ram[x].order;
            mind = x;
        }
    }
    return mind;
}
exports.fifo = fifo;
function lru(ram) {
    var min = ram[0].used;
    var mind = 0;
    var x = 1;
    for (; x < ram.length; x++) {
        if (ram[x].used < min) {
            min = ram[x].used;
            mind = x;
        }
    }
    return mind;
}
exports.lru = lru;
function alru(ram) {
    for (var x in ram) {
        if (ram[x].needed === false) {
            return parseInt(x);
        }
    }
    for (var x in ram) {
        ram[x].needed = false;
    }
    return 0;
}
exports.alru = alru;
function rand(ram) {
    return getRandomNumber(ram.length - 1);
}
exports.rand = rand;
function randomizeUsage(max, coef) {
    var chance = getRandomNumber(100);
    if (chance > coef * 100) {
        return getRandomNumber(max);
    }
    else {
        return -1;
    }
}
exports.randomizeUsage = randomizeUsage;
function searchPage(ar, id) {
    var x = 0;
    if (ar.length === 1)
        return 0;
    for (; x < ar.length; x++) {
        if (ar[x].id === id) {
            return x;
        }
    }
    return -1;
}
exports.searchPage = searchPage;
