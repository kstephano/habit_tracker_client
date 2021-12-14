document.addEventListener("DOMContentLoaded", loginListeners);

const loginForm = document.querySelector("#login-form")
const registerForm = document.querySelector("#register-form")

// Event listeners for login page, to display/hide forms
function loginListeners(){
    openLoginForm = document.querySelector("#open-login")
    registerBtn = document.querySelector("#open-register")
    backBtn = document.querySelector("#back-btn")

    openLoginForm.addEventListener("click", e=>{
        showForm(loginForm)})
    registerBtn.addEventListener("click", e=>{
        showForm(registerForm)})

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
    submitLogin(e, "login")
})

registerForm.addEventListener("submit", e=>{
    e.preventDefault()
    submitLogin(e, "register")
})

function submitLogin(e, path){
    const loginData = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    const options = {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
        },
      };
    console.log(loginData)
    // post to the '/blogs' URL
    fetch(`http://localhost:3000/${path}`, options)
        .then((r) => r.json())
        .then(window.location.href = "home.html")
        .catch(console.warn);
    // location.reload();
}

module.exports = {
    loginListeners,
    validatePassword,
    submitLogin
}