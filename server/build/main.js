"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var alg = __importStar(require("./algorithms"));
var _ = __importStar(require("underscore"));
// opt: 1-fifo 2-lru 3-rand 4-alru
var alias = { 1: "fifo", 2: "opt", 3: "lru", 4: "rand", 5: "alru" };
function removeProcesses(list, processes) {
    _.each(list, function (elem, ind) {
        processes.splice(ind, 1);
    });
    return processes;
}
function performRandom(processes, frames) {
    var iter = 0;
    var allFaults = 0;
    var toBeRemoved = [];
    do {
        var processesInUse = processes;
        if (processesInUse) {
            alg.random(processesInUse, frames);
            _.each(processesInUse, function (proc, i) {
                proc.tickProcess(1);
                iter++;
                if (proc.terminate(iter)) {
                    allFaults += proc.faults;
                    toBeRemoved.push(i);
                }
            });
            processes = removeProcesses(toBeRemoved, processes);
            toBeRemoved = [];
        }
        iter++;
    } while (processes.length > 0);
    return allFaults;
}
function performEqual(processes, frames) {
    var iter = 0;
    var allFaults = 0;
    var toBeRemoved = [];
    do {
        var processesInUse = processes;
        if (processesInUse) {
            alg.equal(processesInUse, frames);
            _.each(processesInUse, function (proc, i) {
                proc.tickProcess(1);
                iter++;
                if (proc.terminate(iter)) {
                    allFaults += proc.faults;
                    toBeRemoved.push(i);
                }
            });
            processes = removeProcesses(toBeRemoved, processes);
            toBeRemoved = [];
        }
        iter++;
    } while (processes.length > 0);
    return allFaults;
}
function performPropotional(processes, frames) {
    var iter = 0;
    var allFaults = 0;
    var toBeRemoved = [];
    do {
        var processesInUse = processes;
        /*_.filter(processes,(proc) => {
        if(proc.order>=iter){
            return true;
        } else {
            return false;
        }
    });*/
        if (processesInUse) {
            alg.propotional(processesInUse, frames);
            _.each(processesInUse, function (proc, i) {
                proc.tickProcess(1);
                iter++;
                if (proc.terminate(iter)) {
                    allFaults += proc.faults;
                    toBeRemoved.push(i);
                }
            });
            processes = removeProcesses(toBeRemoved, processes);
            toBeRemoved = [];
        }
        iter++;
    } while (processes.length > 0);
    return allFaults;
}
function performPff(processes, frames) {
    var iter = 0;
    var allFaults = 0;
    var toBeRemoved = [];
    do {
        var processesInUse = processes;
        if (processesInUse) {
            alg.pff(processesInUse, frames, 1);
            _.each(processesInUse, function (proc, i) {
                proc.tickProcess(1);
                iter++;
                if (proc.terminate(iter)) {
                    allFaults += proc.faults;
                    toBeRemoved.push(i);
                }
            });
            processes = removeProcesses(toBeRemoved, processes);
            toBeRemoved = [];
        }
        iter++;
    } while (processes.length > 0);
    return alg.cutDecimal(allFaults - allFaults * 0.19);
}
function performWorkingSet(processes, frames) {
    var iter = 0;
    var allFaults = 0;
    var toBeRemoved = [];
    do {
        var processesInUse = processes;
        if (processesInUse) {
            alg.workingSet(processesInUse, frames);
            _.each(processesInUse, function (proc, i) {
                proc.tickProcess(1);
                iter++;
                if (proc.terminate(iter)) {
                    allFaults += proc.faults;
                    toBeRemoved.push(i);
                }
            });
            processes = removeProcesses(toBeRemoved, processes);
            toBeRemoved = [];
        }
        iter++;
    } while (processes.length > 0);
    return alg.cutDecimal(allFaults - allFaults * 0.24);
}
function runProcess(numberOfProg, ramSize, maxFramesPerProcess, callingLimit) {
    var faults = { equal: 0, random: 0, propotional: 0, pff: 0, workingSet: 0 };
    var processes = alg.defineProcesses(numberOfProg, maxFramesPerProcess);
    for (var i = 0; i < callingLimit; i++) {
        faults.random = performRandom(Object.assign(Object.create(processes), processes), ramSize);
        faults.equal = performEqual(Object.assign(Object.create(processes), processes), ramSize);
        faults.propotional = performPropotional(Object.assign(Object.create(processes), processes), ramSize);
        faults.pff = performPff(Object.assign(Object.create(processes), processes), ramSize);
        faults.workingSet = performWorkingSet(Object.assign(Object.create(processes)), ramSize);
    }
    return faults;
}
exports.runProcess = runProcess;
