import chai from 'chai';
const { assert } = chai;

import MyPromise from './mypromise-lite.js';

async function timeout(ms) {
    return new Promise(res => setTimeout(res, ms));
}

describe("MyPromise", function () {

    it("can resolve immediatly", function () {
        MyPromise.resolve("it works")
            .then(v => assert.equal(v, "it works"));
    });

    it("can resolve deferred", async function () {
        new MyPromise(res => setTimeout(res, 10, "it worked"))
            .then(val => assert.equal(val, "it worked"));
        
        await timeout(11);
    });

    
    it("can handle multiple then", async function (done) {
        function first(val) {
            console.log("first", val);
            return val + 1;
        }
        function second(val) {
            console.log("second", val);
            return val + 1;
        }

        new MyPromise(res => setTimeout(() => res(1), 10))
            .then(first)
            .then(second)
            .then(val => assert.equal(val, 3))
            .then(done());

        await timeout(11);
        assert.fail("should not reach");
    });
})