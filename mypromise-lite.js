export default class MyPromiseLite {
    static resolve(val) {
        return new MyPromiseLite(res => res(val));
    }

    callbacks = [];
    complete = false;
    outcome;

    constructor(execFn) {
        execFn(this._resolve.bind(this));
    }

    _resolve(val) {
        this.outcome = this.callbacks.reduce((acc, nextCb) => nextCb(acc), val);
        this.complete = true;
    }

    then(callback) {
        if (this.complete) {
            callback(this.outcome);
        } else {
            this.callbacks.push(callback);
        }
        return this;
    }
}

