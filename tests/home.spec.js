/**
 * @jest-environment jsdom
 */

describe("home.js tests", ()=>{
    test("grid container exists", ()=>{
        expect(document.querySelector(".grid-container")).toBeTruthy()
    })
})
