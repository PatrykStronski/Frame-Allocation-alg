export class Page{
	public id: number;
	public order: number;
	public used: number;
	public needed: boolean;
	constructor(id:number,order: number){
		this.needed = false;
		this.id = id;
		this.order = order; 
		this.used = 0;
	}
};

export interface FaultReport{
	equal: number;
	random: number;
	propotional: number;
	pff: number;
	workingSet: number;
}
export interface AlgAlias{
	[key: number]: string;
 }
