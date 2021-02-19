export default class MyPromiseLite {
    static resolve(val) {
        return new MyPromiseLite(res => res(val));
    }

    callbacks = [];

    constructor(executor) {
        executor(val => this.callbacks.forEach(cb => val = cb(val)));
    }

    then(callback) {
        return new MyPromiseLite(resolve => {
            this.callbacks.push(callback);
        });
    }
}
