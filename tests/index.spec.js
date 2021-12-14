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
    
    describe("HTML tests", ()=>{
        test("Elements exist", ()=>{
            const buttons = document.querySelectorAll("button");
            expect(buttons.length).toBe(5)
            const forms = document.querySelectorAll("form");
            expect(forms.length).toBe(2)
        })
        test("Inputs are of correct type", ()=>{
            const emailInput = document.getElementsByName("email");
            expect(emailInput[0].type).toBe("email")
            expect(emailInput[1].type).toBe("email")
            const passwordInput = document.getElementsByName("password");
            expect(passwordInput[0].type).toBe("password")
            expect(passwordInput[1].type).toBe("password")
        })
    })

    describe("Login Listeners", ()=>{
        beforeEach(()=>{
            events = {};
		    document.addEventListener = jest.fn((event, callback) => {
      		    events[event] = callback;
    	    });
            document.removeEventListener = jest.fn((event, callback) => {
      	        delete events[event];
            });
        });

        test("Function Exists", ()=>{
            expect(script.loginListeners).toBeTruthy()
        });

        test('Forms hidden on page load"', () => {
            let loginForm = document.querySelector("#login-form");
            expect(loginForm.style.display).toBeFalsy();
            let registerForm = document.querySelector("#register-form");
            expect(registerForm.style.display).toBeFalsy();
          });
    })

    describe("Validate Password", ()=>{
        test("Function Exists", ()=>{
            expect(script.validatePassword).toBeTruthy();
        });

    })

    describe("Submit Login", ()=>{
        test("Function Exists", ()=>{
            expect(script.submitLogin).toBeTruthy()
        })
        test("Takes 2 arguments", ()=>{
            expect(script.submitLogin.length).toBe(2)
        })
    })
})
