"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var classes_1 = require("./classes");
var u = __importStar(require("./utils"));
var _ = __importStar(require("underscore"));
var Process = /** @class */ (function () {
    function Process(size, order, term) {
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
    Process.prototype.generatePages = function () {
        for (var x = 0; x < this.size; x++) {
            this.inDisk.push(new classes_1.Page(x, x));
        }
    };
    Process.prototype.assignFrameQty = function (qty) {
        this.framesAvailable = qty;
    };
    Process.prototype.assignPages = function (pagelist) {
        this.inDisk = pagelist;
    };
    Process.prototype.moveToDisk = function (alg) {
        do {
            var page = void 0;
            var ind = void 0;
            switch (alg) {
                case 2:
                    ind = u.lru(this.allocated);
                    page = this.allocated[ind];
                    this.allocated.splice(ind, 1);
                    this.inDisk.push(page);
                    break;
                case 3:
                    ind = u.rand(this.allocated);
                    page = this.allocated[ind];
                    this.allocated.splice(ind, 1);
                    this.inDisk.push(page);
                    break;
                case 4:
                    ind = u.alru(this.allocated);
                    page = this.allocated[ind];
                    this.allocated.splice(ind, 1);
                    this.inDisk.push(page);
                    break;
                default:
                    ind = u.fifo(this.allocated);
                    page = this.allocated[ind];
                    this.allocated.splice(ind, 1);
                    this.inDisk.push(page);
                    break;
            }
        } while (this.allocated.length !== this.framesAvailable);
    };
    Process.prototype.changeFrameQty = function (newQty, alg) {
        this.framesAvailable = newQty;
        if (this.allocated.length > newQty) {
            this.moveToDisk(alg);
        }
    };
    Process.prototype.getFaultRatio = function () {
        if (this.faults === this.calledPages)
            return 1;
        return this.faults / this.calledPages;
    };
    Process.prototype.replacePage = function (opt, ind) {
        var page2Ind = 0;
        switch (opt) {
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
        var page1 = this.inDisk[ind];
        var page2 = this.allocated[page2Ind];
        this.inDisk[ind] = page2;
        this.allocated[page2Ind] = page1;
        this.allocated[page2Ind].needed = true;
        this.allocated[page2Ind].used++;
    };
    Process.prototype.tickProcess = function (opt) {
        this.calledPages++;
        var toBeUsed = u.getRandomNumber(this.size) - 1;
        var page = _.find(this.allocated, function (page) {
            return page.id === toBeUsed;
        });
        if (page === undefined) {
            if (this.allocated.length < this.framesAvailable) {
                var ind = _.findIndex(this.inDisk, function (page) {
                    return page.id === toBeUsed;
                });
                var page_1 = this.inDisk[ind];
                page_1.needed = true;
                page_1.used++;
                this.allocated.push(page_1);
                this.inDisk.splice(ind, 1);
            }
            else {
                if (this.framesAvailable > 0) {
                    this.faults++;
                    var ind = _.findIndex(this.inDisk, function (page) {
                        return page.id === toBeUsed;
                    });
                    if (ind === undefined) {
                        console.log("ERROR, UNDEFINED page returned");
                        return;
                    }
                    this.replacePage(opt, ind);
                }
            }
        }
        else {
            page.needed = true;
            page.used++;
        }
    };
    Process.prototype.terminate = function (iter) {
        if (iter < this.terminationPoint)
            return false;
        else {
            return true;
        }
    };
    return Process;
}());
exports.Process = Process;
