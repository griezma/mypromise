class MyPromiseException extends Error {
    constructor(err) {
        super(err?.message);
        super.name = "MyPromiseException";
    }
}

export default class MyPromise {
    callbacks = [];
    catchFn;
    complete = false;
    outcome;

    static resolve(val) {
        return new MyPromise(res => res(val));
    }

    constructor(execFn) {
        console.log("constructor", execFn);
        try {
            execFn(this.resolve, this.reject);
        } catch (err) {
            // console.log("error in execfn", { err });
            this.reject(err);
        }
    }

    then(thenFn) {
        if (!thenFn) throw new Error("Must not be null");
        this.callbacks.push({thenFn});
        if (this.outcome !== undefined) {
            this.resolve(this.outcome);
        }
        return this;
    }

    catch(catchFn) {
        if (!catchFn) throw new Error("Must not be null");
        this.callbacks.push({catchFn});
        return this;
    }

    resolve = val => {
        this.outcome = val;
        let next;
        while (!!(next = this.callbacks.shift())) {
            const { thenFn, catchFn } = next;
            if (catchFn) continue;
            try {
                this.outcome = thenFn(this.outcome);
            } catch (err) {
                // console.log("error in resolve chain", { err });
                this.reject(err);
            }
        }
    }

    nextCatchFn() {
        const found = this.callbacks.findIndex(({ catchFn }) => !!catchFn);
        if (found >= 0) {
            const { catchFn } = this.callbacks[found];
            this.callbacks = this.callbacks.slice(found + 1);
            return catchFn;
        }
    }

    reject = err => {
        const catchFn = this.nextCatchFn();
        console.log("reject", {catchFn});

        if (catchFn) {
            try {
                catchFn(err);
                return this.outcome;
            } catch (catchFnErr) {
                console.log("error in reject", { err });
                err = catchFnErr;
            }
        }
        if (err instanceof Error) {
            throw err;
        } else {
            throw Error(err);
        }
    }
}