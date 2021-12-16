/**
* @jest-environment jsdom
*/

// const { TestWatcher } = require("@jest/core");
const fs = require("fs");
const path = require("path");
// const { requestLogin, requestRegistration, login, loginListeners, validatePassword } = require("../static/js/index.js");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");

let script;

describe("index.js", ()=>{           
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        script = require("../static/js/index.js");
        let password = document.querySelector("#register-password")
        password.value = "test"
    });

    afterEach(() => {
        fetch.resetMocks();
    })
    
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
            fetch.resetMocks();
        });

        it('shows the login form on click', () => {
            const addEvent = new Event('click')
            let openloginForm = document.querySelector("#open-login");
            openloginForm.dispatchEvent(addEvent)
            const loginForm = document.querySelector("#login-form")
            expect(loginForm.style.display).toEqual('flex')
        })

        it('shows the register form on click', () => {
            const addEvent = new Event('click')
            let registerBtn = document.querySelector("#open-register");
            registerBtn.dispatchEvent(addEvent)
            const registerForm = document.querySelector("#register-form")
            expect(registerForm.style.display).toEqual('flex')
        })

        test("Function exists", ()=>{
            expect(script.loginListeners()).toBeTruthy()
        });

        test('Forms hidden on page load', () => {
            let loginForm = document.querySelector("#login-form");
            expect(loginForm.style.display).toBeFalsy();
            let registerForm = document.querySelector("#register-form");
            expect(registerForm.style.display).toBeFalsy();
          });

        test('show form exists', () => {
            loginListeners().then(() => {
                expect(script.showForm()).toBeTruthy();
            })
        })
    })

    describe("Validate password", ()=>{
        test("Function exists", ()=>{
            expect(script.validatePassword()).toBeTruthy();
        });
    })

    // describe('login form submitted creates data', () => {
    //     let loginForm = document.querySelector("#login-form");
    //     loginForm.display.style = "block"
    //     const addEvent = new Event('submit')
    //     loginForm.dispatchEvent(addEvent)
    //     expect(addEvent.target.email.value).toBeTruthy();
    // })

    describe('request login', () => {
        test('request login calls fetch', async () => {
            await script.requestLogin({});
            expect(fetch).toHaveBeenCalled();
        })
    })

    describe('request registration', () => {
        test('request registration calls fetch', async () => {
            await script.requestRegistration({});
            expect(fetch).toHaveBeenCalled();
        })
    })

    describe('login', () => {
        test('login calls fetch', async () => {
            await script.login(JSON.stringify({userName: "tester", email: "tester@test.com"}));
            expect(fetch).toHaveBeenCalled();
        })
        // test('it sends an error if fetch does not work', () => {
        //     fetch.mockReject({})
        //     const returnVal = script.requestRegistration({})
        //     expect(returnVal).toBe({})
        // })})
    })
})
