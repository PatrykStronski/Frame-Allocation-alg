import * as P from './classes';
type Page = P.Page;

export function getRandomNumber(max:number):number{
	return Math.floor(Math.random()*max)+1;
}

export function fifo(ram: Page[]): number{
	let min: number = ram[0].order;
	let mind: number = 0;
	let x:number = 1;
	for(; x<ram.length; x++){
		if(ram[x].order<min){
			min=ram[x].order;
			mind=x;
		}
	}
	return mind;
}

export function lru(ram: Page[]): number{
	let min: number = ram[0].used;
	let mind: number = 0;
	let x:number = 1;
	for(; x<ram.length; x++){
		if(ram[x].used<min){
			min=ram[x].used;
			mind=x;
		}
	}
	return mind;
}

export function alru(ram: Page[]): number{
	for(let x in ram){
		if(ram[x].needed ===false){
			return parseInt(x);
		}
	}
	for(let x in ram){
		ram[x].needed=false;
	}
	return 0;
}

export function rand(ram: Page[]): number{
	return getRandomNumber(ram.length-1);
}

export function randomizeUsage(max:number, coef:number):number{
	let chance:number =  getRandomNumber(100);
	if(chance>coef*100){
		return getRandomNumber(max);
	} else {
		return -1;
	}
}

export function searchPage(ar: Page[],id: number): number{
	let x: number = 0;
	if(ar.length===1) return 0;
	for(;x<ar.length;x++){
		if(ar[x].id===id){
			return x;
		}
	}
	return -1;
}
