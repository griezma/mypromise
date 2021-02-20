import chai from 'chai';
const { assert } = chai;

import MyPromise from './mypromise.js';

const peek = (info = "peek") => val => { 
    console.log(info, {val}); 
    if (val instanceof Error) throw val;
    return val;
}

describe("MyPromise", function() {

    let finishedCount = 0;
    const finished = () => { finishedCount++ };

    this.afterAll(() => assert.equal(finishedCount, 4));

    it("can resolve immediatly", function (done) {
        MyPromise.resolve("it works")
            .then(v => assert.equal(v, "it works"))
            .then(finished)
            .then(done);
    });

    it("can resolve deferred", function(done) {
        new MyPromise(res => setTimeout(res, 10, "it worked"))
            .then(val => assert.equal(val, "it worked"))
            .then(finished)
            .then(done);
    });

    it("handles errors like a pro-mise", function(done) {
        new MyPromise(res => setTimeout(() => res("ok"), 10))
            .then(peek("ok"))
            .then(val => {throw new Error("testing")})
            .then(val => assert.fail("should be skipped"))
            // .catch(peek("Error stack expected"))
            .catch(err => assert(err.message, "testing"))
            .then(finished)
            .then(done)
    });

    it("can handle multiple then", function(done) {
        function first(val) {
            return val + 1;
        }
    
        function second(val) {
            return val + 2;
        }

        new MyPromise(res => setTimeout(() => res(1), 10))
            .then(first)
            .then(second)
            .then(val => assert.equal(val, 4))
            .then(finished)
            .then(done);
    });
})