document.addEventListener("DOMContentLoaded", loginListeners);

const loginForm = document.querySelector("#login-form")
const registerForm = document.querySelector("#register-form")

// Event listeners for login page, to display/hide forms
function loginListeners(){
    openLoginForm = document.querySelector("#open-login");
    registerBtn = document.querySelector("#open-register");
    backBtn = document.querySelector("#back-btn");

    openLoginForm.addEventListener("click", e=>{
        showForm(loginForm)});

    registerBtn.addEventListener("click", e=>{
        showForm(registerForm)});

    function showForm(form){
        form.style.display = "flex";
        openLoginForm.style.display = "none";
        registerBtn.style.display = "none";
        backBtn.style.display = "block";
    }

    backBtn.addEventListener("click", e=>{
        document.querySelector("#register-form").style.display = "none";
        document.querySelector("#login-form").style.display = "none";
        openLoginForm.style.display = "block";
        registerBtn.style.display = "block";
        backBtn.style.display = "none";
    })
}


// Confirm password when registering a user
let password = document.querySelector("#register-password")
let confirmPassword = document.querySelector("#confirm-password");
password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;

function validatePassword(){
  if(password.value != confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPassword.setCustomValidity('');
  }
}

// Handle login form data
loginForm.addEventListener("submit", e=>{
    e.preventDefault()
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    requestLogin(JSON.stringify(formData))
})

registerForm.addEventListener("submit", e=>{
    e.preventDefault()
    const formData = {
        email: e.target.email.value,
        userName: e.target.username.value,
        password: e.target.password.value
    }
    requestRegistration(JSON.stringify(formData))
})

async function requestLogin(data){
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        }
        // console.log(options.body)
        const r = await fetch(`http://localhost:3000/auth/login`, options)
        console.log(r)
        const fetchData = await r.json()
        console.log(fetchData)
        if (fetchData.err){ throw Error(fetchData.err); }
        login(fetchData);
    } catch (err) {
        console.warn(err);
    }
}

async function requestRegistration(data) {
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        }
        const r = await fetch(`http://localhost:3000/auth/register`, options)
        // console.log(r)
        const fetchData = await r.json()
        if (fetchData.err){ throw Error(fetchData.err) }
        // console.log(fetchData)
        requestLogin(options.body);
    } catch (err) {
        console.warn(err);
    }
}

function login(data){
    localStorage.setItem('userName', data.userName);
    localStorage.setItem('userEmail', data.userEmail);
    window.location.href = './home.html'
}

module.exports = {
    loginListeners,
    validatePassword,
}