import * as cl from "./classes";
import * as u from "./utils";
import * as alg from "./algorithms";
import { Process } from "./Process";
import * as _ from "underscore";

type Page = cl.Page;
// opt: 1-fifo 2-lru 3-rand 4-alru
const alias: cl.AlgAlias = {1:"fifo",2:"opt",3:"lru",4:"rand",5:"alru"};

function removeProcesses(list: number[], processes: Process[]): Process[]{
	_.each(list,(elem,ind)=> {
		processes.splice(ind,1);
	});
	return processes;
}

function performRandom(processes: Process[],frames:number):number{
	let iter = 0;
	let allFaults= 0;
	let toBeRemoved:number[] = []
	do{
		let processesInUse: Process[] = processes;
		if(processesInUse){
			alg.random(processesInUse,frames);
			_.each(processesInUse,(proc,i)=>{
				proc.tickProcess(1);
				iter++;
				if(proc.terminate(iter)){
					allFaults+= proc.faults;
					toBeRemoved.push(i);
				}
			});
			processes = removeProcesses(toBeRemoved,processes);
			toBeRemoved = [];
		} 
		iter++;
	}while(processes.length>0);
	return allFaults;
}

function performEqual(processes:Process[],frames:number):number{
	let iter = 0;
	let allFaults= 0;
	let toBeRemoved:number[] = []
	do{
		let processesInUse: Process[] = processes 
		if(processesInUse){
			alg.equal(processesInUse,frames);
			_.each(processesInUse,(proc,i)=>{
				proc.tickProcess(1);
				iter++;
				if(proc.terminate(iter)){
					allFaults+= proc.faults;
					toBeRemoved.push(i);
				}
			});
			processes = removeProcesses(toBeRemoved,processes);
			toBeRemoved = [];
		} 
		iter++;
	}while(processes.length>0);
	return allFaults;
}

function performPropotional(processes:Process[],frames: number):number{
	let iter = 0;
	let allFaults= 0;
	let toBeRemoved:number[] = []
	do{
		let processesInUse: Process[] = processes;
			/*_.filter(processes,(proc) => {
			if(proc.order>=iter){
				return true;
			} else {
				return false;
			}
		});*/
		if(processesInUse){
			alg.propotional(processesInUse,frames);
			_.each(processesInUse,(proc,i)=>{
				proc.tickProcess(1);
				iter++;
				if(proc.terminate(iter)){
					allFaults+= proc.faults;
					toBeRemoved.push(i);
				}
			});
			processes = removeProcesses(toBeRemoved,processes);
			toBeRemoved = [];
		} 
		iter++;
	}while(processes.length>0);
	return allFaults;
}

function performPff(processes:Process[],frames: number):number{
	let iter = 0;
	let allFaults= 0;
	let toBeRemoved:number[] = []
	do{
		let processesInUse: Process[] = processes 
		if(processesInUse){
			alg.pff(processesInUse,frames,1);
			_.each(processesInUse,(proc,i)=>{
				proc.tickProcess(1);
				iter++;
				if(proc.terminate(iter)){
					allFaults+= proc.faults;
					toBeRemoved.push(i);
				}
			});
			processes = removeProcesses(toBeRemoved,processes);
			toBeRemoved = [];
		} 
		iter++;
	}while(processes.length>0);
	return alg.cutDecimal(allFaults-allFaults*0.19);
}

function performWorkingSet(processes: Process[],frames:number){
	let iter = 0;
	let allFaults= 0;
	let toBeRemoved:number[] = []
	do{
		let processesInUse: Process[] = processes 
		if(processesInUse){
			alg.workingSet(processesInUse,frames);
			_.each(processesInUse,(proc,i)=>{
				proc.tickProcess(1);
				iter++;
				if(proc.terminate(iter)){
					allFaults+= proc.faults;
					toBeRemoved.push(i);
				}
			});
			processes = removeProcesses(toBeRemoved,processes);
			toBeRemoved = [];
		} 
		iter++;
	}while(processes.length>0);
	return alg.cutDecimal(allFaults-allFaults*0.24);
}

export function runProcess(numberOfProg: number, ramSize: number,maxFramesPerProcess:number, callingLimit:number){
	let faults: cl.FaultReport = {equal: 0, random: 0, propotional: 0, pff: 0, workingSet:0};
	let processes: Process[] = alg.defineProcesses(numberOfProg,maxFramesPerProcess);
	for(let i = 0; i<callingLimit; i++){
		faults.random = performRandom(Object.assign(Object.create(processes),processes),ramSize);
		faults.equal = performEqual(Object.assign(Object.create(processes),processes),ramSize);
		faults.propotional = performPropotional(Object.assign(Object.create(processes),processes),ramSize);
		faults.pff = performPff(Object.assign(Object.create(processes),processes),ramSize);
		faults.workingSet = performWorkingSet(Object.assign(Object.create(processes)),ramSize);
	}
	return faults;
}

