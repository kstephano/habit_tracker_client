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
        const r = await fetch(`https://warm-forest-14168.herokuapp.com/auth/login`, options)
        const fetchData = await r.json()
        if (fetchData.err){ throw Error(fetchData.err); }
        localStorage.setItem('accessToken', fetchData.accessToken)
        localStorage.setItem('refreshToken', fetchData.refreshToken)
        login(data);
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
        const r = await fetch(`https://warm-forest-14168.herokuapp.com/auth/register`, options)
        const fetchData = await r.json()
        if (fetchData.err){ throw Error(fetchData.err) }
        requestLogin(options.body);
    } catch (err) {
        console.warn(err);
    }
}

async function login(data){
    data = JSON.parse(data)
    const email = data.email.replace(/\./g, '%2E').replace(/\@/g, '%40')
    try {
        const response = await fetch(`https://warm-forest-14168.herokuapp.com/users/${email}`)
        const data = await response.json()
        localStorage.setItem('userName', data.userName)
        localStorage.setItem('userEmail', email);
        window.location.href = './home.html'
    } catch (err) {
        console.warn(err)
    }
    // fetchUsername(email)
    // localStorage.setItem('userEmail', email);
    // window.location.href = './home.html'
}

// async function fetchUsername(email) {
//     try {
//         const response = await fetch(`http://localhost:3000/users/${email}`)
//         const data = await response.json()
//         localStorage.setItem('userName', data.userName)
//     } catch (err) {
//         console.warn(err)
//     }
// }

// module.exports = {
//     loginListeners,
//     validatePassword,
// }