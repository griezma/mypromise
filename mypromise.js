export default class MyPromise {
    callbacks = [];
    complete = false;
    error = false;
    outcome;

    static resolve(val) {
        return new MyPromise(res => res(val));
    }

    constructor(execFn) {
        // console.log("MyPromise", execFn);
        try {
            execFn(this.resolve, this.reject);
        } catch (err) {
            this.reject(err);
        }
    }

    then(thenFn) {
        if (!thenFn) throw new Error("thenFn must not be null");
        this.callbacks.push({thenFn});
        if (this.complete && !this.error) {
            this.resolve(this.outcome);
        }
        return this;
    }

    catch(catchFn) {
        if (!catchFn) throw new Error("catchFn must not be null");
        this.callbacks.push({catchFn});
        if (this.complete && this.error) {
            this.reject(this.outcome);
        }
        return this;
    }

    resolve = val => {
        this.complete = true;
        this.outcome = val;
        this.error = false;

        let next;
        while (!!(next = this.callbacks.shift())) {
            const { thenFn, catchFn } = next;
            if (catchFn) continue;
            try {
                this.outcome = thenFn(this.outcome);
            } catch (err) {
                this.reject(err);
            }
        }
    }

    nextCatchFn() {
        const catchIndex = this.callbacks.findIndex(({ catchFn }) => !!catchFn);

        if (catchIndex >= 0) {
            const { catchFn } = this.callbacks[catchIndex];
            this.callbacks = this.callbacks.slice(catchIndex + 1);
            return catchFn;
        }
    }

    reject = err => {
        this.complete = true;
        this.error = true;
        this.outcome = err;

        const catchFn = this.nextCatchFn();

        if (catchFn) {
            try {
                this.resolve(catchFn(err));
            } catch (err) {
                this.reject(err);
            }
        } else {
            if (err instanceof Error) {
                throw err;
            } else {
                throw Error(err);
            }
        }
    }
}