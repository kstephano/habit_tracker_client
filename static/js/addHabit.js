document.addEventListener("DOMContentLoaded", loadListeners);
const habitForm = document.querySelector("#add-habit-form")


function loadListeners(){
    const selectExistingBtn = document.querySelector("#default-habit-button")
    const selectExistingDiv = document.querySelector("#default-habits")
    const createNewBtn = document.querySelector("#own-habit-button")
    const createNewDiv = document.querySelector("#own-habit")
    const submitBtn = document.querySelector("#submitBtn")
    submitBtn.disabled = true;

    selectExistingBtn.addEventListener("click",e=>{
        document.querySelector("#default-habit-selection").required = true;
        document.querySelector("#create-own-habit").required = false;
        createNewDiv.style.display = "none";
        selectExistingDiv.style.display = "flex";
        submitBtn.disabled = false;
    })

    createNewBtn.addEventListener("click",e=>{
        document.querySelector("#default-habit-selection").required = false;
        document.querySelector("#create-own-habit").required = true;
        createNewDiv.style.display = "flex";
        selectExistingDiv.style.display = "none";
        submitBtn.disabled = false;
    })
}

habitForm.addEventListener("submit", e=>{
    e.preventDefault()
    if(e.target.new_habit_name.value==""){
        habitName = e.target.existing_habit_name.value
    }else if(e.target.existing_habit_name.value==""){
        habitName = e.target.new_habit_name.value
    }else{
        console.log("BROKEN")
    }
    const newHabitName = habitName.replace("/","U+2215")
    console.log(newHabitName)
    const habitData = {
        habitName: newHabitName,
        frequency: e.target.frequency.value,
        unit: e.target.units.value,
        amount: e.target.amount.value,
    }
    postHabit(habitData)
})

async function postHabit(data) {
    const email = localStorage.getItem('userEmail')
    const username = localStorage.getItem('userName')
    const accessToken = localStorage.getItem('accessToken')
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json",
                        "Authorization": accessToken },
            body: JSON.stringify({...data, userName: username})
        }
        console.log(options.body)
        const response = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${email}`, options);

        // check for if access token used for fetch is null/invalid
        if (response.status == 401 || response.status == 403) {
            const newAccessToken = await requestNewAccessToken();
            const updatedOptions = {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": newAccessToken
                },
                body: JSON.stringify({...data, userName: username})
            }
            const newResponse = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${email}`, updatedOptions);
            const habitData = await newResponse.json();
            console.log(habitData);
            window.location.href = './home.html'
        } else {
            const habitData = await response.json()
            window.location.href = './home.html'
        }
    } catch (err) {
        console.warn(err)
    }
}

async function requestNewAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const email = localStorage.getItem('userEmail');

    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken })
    }

    // attempt to fetch a new access token
    try {
        // fetch request for new access token
        const response = await fetch(`https://warm-forest-14168.herokuapp.com/auth/token/${email}`, options);
        const data = await response.json();

        // check if refreshToken is null or invalid
        if (response.status === 403 || response.status === 401) {
            alert("Session expired, please log in");
            return logout();
        // check if a new access token has been successfully retrieved    
        } if (response.status === 200) {
            console.log(`New access token acquired: ${data.accessToken}`);
            return data.accessToken;
        }
    } catch (err) {
        console.log(`Error requesting new access token: ${err}`);
    }
}

async function logout() {
    const userEmail = localStorage.getItem("userEmail");
    const refreshToken = localStorage.getItem("refreshToken");

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
    }

    try {
        const response = await fetch(`https://warm-forest-14168.herokuapp.com/auth/logout/${userEmail}`, options);
        // check is logout is successful
        if (response.status == 204) {
            console.log("user logged out");
        }
        window.location.href = './index.html';
    } catch(err){
        console.warn(err);
    }
}
