/**
 * @jest-environment jsdom
 */

// const { TestWatcher } = require("@jest/core");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../addHabit.html"), "utf8");
// global.fetch = require("jest-fetch-mock");

let script;
describe("index.js", ()=>{           
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        script = require("../static/js/addHabit.js");
    
    });
    afterEach(()=>{
        fetch.resetMocks();
     })

     test("Test elements",()=>{
         

     })


})