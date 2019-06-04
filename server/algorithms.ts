import { Process } from './Process';
import * as _ from 'underscore';

export function getRandomNumber(max:number):number{
	return Math.floor(Math.random()*max)+1;
}

export function cutDecimal(n: number):number{
	return parseInt(n.toFixed(0));
}

export function getAllProcSize(ps: Process[]): number{
	let size = 0;
	for(let proc of ps){
		size+=proc.size;
	}
	return size;
}

export function defineProcesses(nmb:number,maxFrames:number): Process[]{
	let processes: Process[] = [];
	for(let i = 0; i<nmb; i++){
		processes.push(new Process(getRandomNumber(maxFrames),getRandomNumber(nmb),20+getRandomNumber(nmb)));
	}
	return processes;
}

//allocation of frames

export function random(ps: Process[], frames: number){
	for(let proc of ps) {
		let framesAllocated = getRandomNumber(frames);
		proc.assignFrameQty(framesAllocated);
		frames-=framesAllocated;
	}
}

export function equal(ps: Process[], frames: number){
	let cnt = frames;
	for(let proc of ps){
		let framesAllocated = cutDecimal(frames/ps.length);
		if(framesAllocated === 0 && cnt>0){
			proc.assignFrameQty(1);
			cnt--;
		}
		if(framesAllocated>0){
			proc.assignFrameQty(framesAllocated);
		}
	}
}

export function propotional(ps:Process[], frames: number){
	let allProcSize = getAllProcSize(ps);
	for(let proc of ps) {
		let framesAllocated = cutDecimal(frames*proc.size/allProcSize);
	}
}

export function pff(ps: Process[], frames: number, alg:number){ //page fault frequency - more frames to more frequently faulting processes
	let allProcess:number = _.reduce(ps, (memo,proc) => {return memo+proc.getFaultRatio()},0);
	_.each(ps,(proc) => {
		proc.changeFrameQty(cutDecimal(proc.getFaultRatio()*frames/allProcess),alg);
	});
}

export function workingSet(ps: Process[], frames: number){
	pff(ps,frames,4);
}
