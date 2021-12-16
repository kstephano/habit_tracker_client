/**
 * @jest-environment jsdom
 */

// const { TestWatcher } = require("@jest/core");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../addHabit.html"), "utf8");
global.fetch = require("jest-fetch-mock");

let script;
describe("addHabit.js", ()=>{           
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        script = require("../static/js/addHabit.js");
    
    });
    afterEach(()=>{
        fetch.resetMocks();
     })

    describe("load listeners", ()=>{
        test("Function exists", ()=>{
            expect(script.loadListeners()).toBeTruthy();
        });
    })

    describe("post habits", ()=>{
        test("Function exists", ()=>{
            expect(script.postHabit()).toBeTruthy();
        });
        test('post habit calls fetch', async () => {
            await script.postHabit({});
            expect(fetch).toHaveBeenCalled();
        })
    })


})