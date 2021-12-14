/**
 * @jest-environment jsdom
 */

// const { TestWatcher } = require("@jest/core");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
// global.fetch = require("jest-fetch-mock");

let script;
describe("index.js", ()=>{           
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        script = require("../static/js/index.js");
    });
    
    describe("Login Listeners", ()=>{
        test("Function Exists", ()=>{
            expect(script.loginListeners).toBeTruthy()
        });
        test("")
    })

    describe("Validate Password", ()=>{
        test("Function Exists", ()=>{
            expect(script.validatePassword).toBeTruthy()
        })
    })

    describe("Submit Login", ()=>{
        test("Function Exists", ()=>{
            expect(script.submitLogin).toBeTruthy()
        })
    })
})

