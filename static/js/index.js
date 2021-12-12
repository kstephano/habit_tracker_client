document.addEventListener("DOMContentLoaded", loginListeners);

function loginListeners(){
    loginBtn = document.querySelector("#login-btn")
    registerBtn = document.querySelector("#register-btn")
    backBtn = document.querySelector("#back-btn")

    loginBtn.addEventListener("click", e=>{
        showForm("#login-form")})
    
    registerBtn.addEventListener("click", e=>{
        showForm("#register-form")})

    function showForm(form){
        document.querySelector(form).style.display = "flex";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        backBtn.style.display = "block";
    }

    backBtn.addEventListener("click", e=>{
        document.querySelector("#register-form").style.display = "none";
        document.querySelector("#login-form").style.display = "none";
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        backBtn.style.display = "none";
    })
}