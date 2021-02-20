import chai from 'chai';
const { assert } = chai;

import MyPromise from './mypromise-lite.js';

const peek = (info = "peek") => val => { 
    console.log(info, {val}); 
    if (val instanceof Error) throw val;
    return val;
}

describe("MyPromiseLite test", function() {

    it("can resolve immediately", function(done) {
        MyPromise.resolve("it works")
            .then(v => assert.equal(v, "it works"))
            .then(() => done());
    });

    it("can resolve deferred", function(done) {
        new MyPromise(res => setTimeout(res, 10, "it worked"))
            .then(val => assert.equal(val, "it worked"))
            .then(peek("finished"))
            .then(done);
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
            .then(done);
    });
})