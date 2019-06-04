import { Page } from './classes';
import * as u from './utils';
import * as _ from 'underscore';

export class Process{
	order: number;
	faults: number;
	calledPages: number;
	size: number
	allocated: Page[];
	inDisk: Page[];
	terminationPoint: number;
	framesAvailable: number; // number of pages that a process can use === max length of "allocated" list
	
	constructor(size:number,order:number,term:number){
		this.order = order;
		this.size = size;
		this.terminationPoint = term;
		this.faults = 0;
		this.calledPages = 0;
		this.allocated = [];
		this.inDisk = [];
		this.framesAvailable = 0;
		this.generatePages();
	}

	generatePages(){
		for(let x = 0; x<this.size;x++){
			this.inDisk.push(new Page(x,x));
		}
	}

	assignFrameQty(qty: number){
		this.framesAvailable = qty;
	}

	assignPages(pagelist: Page[]){
		this.inDisk = pagelist;
	}

	moveToDisk(alg:number){
		do{
			let page: Page;
			let ind: number; 
			switch(alg){
					case 2:
						ind = u.lru(this.allocated);
						page = this.allocated[ind];
						this.allocated.splice(ind,1);
						this.inDisk.push(page);
					break;
					case 3:
						ind = u.rand(this.allocated);
						page = this.allocated[ind];
						this.allocated.splice(ind,1);
						this.inDisk.push(page);
					break;
					case 4:
						ind = u.alru(this.allocated);
						page = this.allocated[ind];
						this.allocated.splice(ind,1);
						this.inDisk.push(page);
					break;
					default: 
						ind = u.fifo(this.allocated);
						page = this.allocated[ind];
						this.allocated.splice(ind,1);
						this.inDisk.push(page);
					break;
				}		
		} while(this.allocated.length!==this.framesAvailable);
	}

	changeFrameQty(newQty: number, alg: number){
		this.framesAvailable = newQty;
		if(this.allocated.length>newQty){
			this.moveToDisk(alg);
		}
	}

	getFaultRatio(): number{
		if(this.faults===this.calledPages) return 1;
		return this.faults/this.calledPages;
	}

	replacePage(opt:number,ind:number){
		let page2Ind: number = 0;
		switch(opt){
			case 1:
				page2Ind = u.fifo(this.allocated);
			break;
			case 2:
				page2Ind = u.lru(this.allocated);
			break;
			case 3:
				page2Ind = u.rand(this.allocated);
			break;
			case 4:
				page2Ind = u.alru(this.allocated);
			break;
		}
		let page1 = this.inDisk[ind];
		let page2 = this.allocated[page2Ind];
		this.inDisk[ind] = page2;
		this.allocated[page2Ind] = page1;
		this.allocated[page2Ind].needed=true;
		this.allocated[page2Ind].used++;
	}

	tickProcess(opt:number){
		this.calledPages++;
		let toBeUsed = u.getRandomNumber(this.size)-1;
		let page = _.find(this.allocated, (page: Page) => {
			return page.id===toBeUsed;
		});
		if(page === undefined){
			if(this.allocated.length<this.framesAvailable){
				let ind = _.findIndex(this.inDisk,(page: Page) => {
					return page.id===toBeUsed;
				});
				let page: Page = this.inDisk[ind]; 
				page.needed = true;
				page.used++;
				this.allocated.push(page);
				this.inDisk.splice(ind,1);
			} else {
				if(this.framesAvailable>0){
					this.faults++;
					let ind = _.findIndex(this.inDisk,(page: Page) => {
						return page.id===toBeUsed;
					});
					if(ind===undefined) {console.log("ERROR, UNDEFINED page returned");return;}
					this.replacePage(opt,ind);
				}
			}
		} else {
			page.needed=true;
			page.used++;
		}

	}

	terminate(iter:number):boolean{
		if(iter<this.terminationPoint) return false;
		else {
			return true;
		}
	}
}
