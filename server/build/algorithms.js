"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Process_1 = require("./Process");
var _ = __importStar(require("underscore"));
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}
exports.getRandomNumber = getRandomNumber;
function cutDecimal(n) {
    return parseInt(n.toFixed(0));
}
exports.cutDecimal = cutDecimal;
function getAllProcSize(ps) {
    var size = 0;
    for (var _i = 0, ps_1 = ps; _i < ps_1.length; _i++) {
        var proc = ps_1[_i];
        size += proc.size;
    }
    return size;
}
exports.getAllProcSize = getAllProcSize;
function defineProcesses(nmb, maxFrames) {
    var processes = [];
    for (var i = 0; i < nmb; i++) {
        processes.push(new Process_1.Process(getRandomNumber(maxFrames), getRandomNumber(nmb), 20 + getRandomNumber(nmb)));
    }
    return processes;
}
exports.defineProcesses = defineProcesses;
//allocation of frames
function random(ps, frames) {
    for (var _i = 0, ps_2 = ps; _i < ps_2.length; _i++) {
        var proc = ps_2[_i];
        var framesAllocated = getRandomNumber(frames);
        proc.assignFrameQty(framesAllocated);
        frames -= framesAllocated;
    }
}
exports.random = random;
function equal(ps, frames) {
    var cnt = frames;
    for (var _i = 0, ps_3 = ps; _i < ps_3.length; _i++) {
        var proc = ps_3[_i];
        var framesAllocated = cutDecimal(frames / ps.length);
        if (framesAllocated === 0 && cnt > 0) {
            proc.assignFrameQty(1);
            cnt--;
        }
        if (framesAllocated > 0) {
            proc.assignFrameQty(framesAllocated);
        }
    }
}
exports.equal = equal;
function propotional(ps, frames) {
    var allProcSize = getAllProcSize(ps);
    for (var _i = 0, ps_4 = ps; _i < ps_4.length; _i++) {
        var proc = ps_4[_i];
        var framesAllocated = cutDecimal(frames * proc.size / allProcSize);
    }
}
exports.propotional = propotional;
function pff(ps, frames, alg) {
    var allProcess = _.reduce(ps, function (memo, proc) { return memo + proc.getFaultRatio(); }, 0);
    _.each(ps, function (proc) {
        proc.changeFrameQty(cutDecimal(proc.getFaultRatio() * frames / allProcess), alg);
    });
}
exports.pff = pff;
function workingSet(ps, frames) {
    equal(ps, frames);
}
exports.workingSet = workingSet;
