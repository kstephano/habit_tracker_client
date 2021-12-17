document.addEventListener("DOMContentLoaded", displayHabits);

initNavbar();

async function initNavbar() {
    const logoutBtn = document.querySelector("#logout-btn");
    const addhabitBtn = document.querySelector("#addhabit-btn");
    logoutBtn.addEventListener("click", logout);
}   

async function loadHabits(){
    // get all habits
    try{
        const email = localStorage.getItem("userEmail");
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);

        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/json",
                        "Authorization": accessToken }
        }
        let response = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${email}`, options);

        // check if access token used for fetch is null/invalid
        if (response.status == 401 || response.status == 403) {
            const newAccessToken = await requestNewAccessToken();
            const updatedOptions = {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": newAccessToken
                }
            }
            const newResponse = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${email}`, updatedOptions);
            const habits = await newResponse.json();
            console.log("Habits in loadHabits function")
        } else {
            habits = await response.json();
            return habits
        }
    }catch (err) {
        console.log(`Cannot process habits: ${err}`);
    }
}

async function processHabits() {
    const habits = await loadHabits();
    const processedHabits = [];
    
    if (habits.length != 0) {
        habits.forEach(habit => {
            if (habit.lastLog != null) {
                let filtered = habit.lastLog.substring(0,10)
                let d = new Date()
                let filteredDate = filtered.substring(0,4)+"-"+filtered.substring(5,7) +"-"+ filtered.substring(8,10)
                let currentDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
                var diff =  Math.floor(
                    (Date.parse(currentDate.replace(/-/g,'\/')) 
                    - Date.parse(filteredDate.replace(/-/g,'\/'))) 
                    / 86400000);
                    console.log(diff);
                if(diff>parseInt(habit.frequency)){
                    processedHabits.push({
                        ...habit,
                        currentAmount: 0,
                        currentStreak: 0
                    });
                }
            }  
            processedHabits.push({...habit});
        });
        return processedHabits;
    } else{
        return habits
    }
}

async function displayHabits(){
    const habits = await processHabits();
    const habitGrid = document.querySelector(".grid-container")
    if(habits.length == 0){
        const noHabitsMessage = document.createElement("h6")
        noHabitsMessage.textContent = "No habits to display. Click 'Add Habits' above to create one"
        noHabitsMessage.style.marginTop = "20px"
        document.querySelector("#dashboard-message").appendChild(noHabitsMessage)
    }

    console.log(habits);
    for(let x in habits){
        // console.log(habits[x].habitName)
        const habitContainer = document.createElement("div")
        habitContainer.setAttribute("class","grid-item")
        habitContainer.setAttribute("id",x)
        const elements = createHabitCards(habits[x])
        for(let i = 0 ; i<5 ; i++){
            habitContainer.appendChild(elements[i])
        }
        habitContainer.appendChild(makeButtons(habits[x], x))
        habitContainer.appendChild(elements[5])
        habitGrid.appendChild(habitContainer)
    }
}

function createHabitCards(habit){
        const habitTitle = document.createElement("h3")
        habitTitle.setAttribute("id","habitTitleTag")
        const newHabitName = habit.habitName.replace("U+2215","/")
        habitTitle.textContent = newHabitName

        const habitTopStreak = document.createElement("h6")
        habitTopStreak.textContent = `Top Streak: ${habit.topStreak}`
        habitTopStreak.setAttribute("id","habitTopStreakTag")
        const habitCurrentStreak = document.createElement("h6")
        habitCurrentStreak.textContent = `Current Streak: ${habit.currentStreak}`
        habitCurrentStreak.setAttribute("id","habitCurrentStreakTag")

        let frequency = habit.frequency
        const amountExpected = habit.expectedAmount
        // console.log(habit.unit)
        habitFrequency = habitFrequencies(frequency, amountExpected, habit.unit)[0]

        const habitStatus = document.createElement("h6")
        
        const progress = Math.round((habit.currentAmount/habit.expectedAmount)*100)
        let unitShown = habit.unit.substring(0,habit.unit.length-1)
        habitStatus.textContent = `Current Progress: ${progress}% (${habit.currentAmount} ${unitShown}(s) in the last ${habitFrequencies(frequency, amountExpected, habit.unit)[1]})`

        const progressBar = document.createElement("div");
        progressBar.textContent = ".";
        progressBar.style.color = "#32DD53";
        progressBar.style.textAlign = "left";
        progressBar.style.backgroundColor = "#32DD53DD";
        progressBar.style.marginTop = "10px";
        progressBar.style.width =progress+"%";
        if (progress==100){
            // habit.currentStreak++
            progressBar.textContent = ":)";
            progressBar.style.textAlign = "right";
            progressBar.style.color = "#000000";
            // updateCurrentAmount(habit)
        }
    return [habitTitle, habitTopStreak, habitCurrentStreak, habitFrequency, habitStatus, progressBar, progress]
}

function habitFrequencies(frequency, amountExpected, units){
    let unitShown = units.substring(0,units.length-1)
    const habitFrequency = document.createElement("h6")
    // Check if frequency is a week, fortnight or month
    if (frequency==7){
        frequencyShown = "week"
    } else if (frequency == 14){
        frequencyShown = "fortnight"
    } else if (frequency == 30){
        frequencyShown = "month"
    } else if (frequency == 1){
        frequencyShown = "day"
    } else{
        frequencyShown = frequency + " days"
    }
    // Set text content of habitFrequency html element
    if (amountExpected==frequency){
        habitFrequency.textContent = `Frequency: One ${unitShown}(s) per day`
    } else if (amountExpected>1 && frequency == 1){
        habitFrequency.textContent = `Frequency: ${amountExpected} ${unitShown}(s) per day`
    } else if (amountExpected>1){
        habitFrequency.textContent = `Frequency: ${amountExpected} ${unitShown}(s) every ${frequencyShown}`
    } else if (amountExpected==1){
        habitFrequency.textContent = `Frequency: One ${unitShown}(s) every ${frequencyShown}`
    }
    return[habitFrequency, frequencyShown]
}

async function updateHabitStatus(e, habit){
    e.preventDefault()
    console.log(`Update with value: ${e.target.number.value}`)
    console.log(`New Value: ${parseInt(e.target.number.value) + habit.currentAmount}`)
    console.log(`Habit name: ${habit.habitName}`)
    const newAmount = parseInt(e.target.number.value) + habit.currentAmount
    
    let d = new Date()
    const updateData = {
        id: habit.id,
        userEmail: habit.userEmail,
        currentAmount: newAmount,
        lastLog: d
    }
    // If target has been reached and log is in time to continue the streak
    if((habit.expectedAmount == newAmount) && isInTime(habit.lastLog, habit.frequency)){
        updateData.currentStreak = habit.currentStreak + 1;
        // Increment top streak if equal to current streak 
        if((habit.currentStreak == habit.topStreak) ){
            updateData.topStreak = habit.topStreak + 1
        }
    // If target has been reached but it is not in time to continue the streak
    } else if (habit.expectedAmount == newAmount) {
        updateData.currentStreak = 1;
    }
    
    const accessToken = localStorage.getItem("accessToken")
    const options = {
        method: 'PUT',
        headers: { "Content-Type": "application/json",
        "Authorization": accessToken },
        body: JSON.stringify(updateData)
    }
    try{
        let response = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${habit.id}`, options);

        // check for if access token used for fetch is null/invalid
        if (response.status === 401 || response.status === 403) {
            const newAccessToken = await requestNewAccessToken();
            const updatedOptions = {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": newAccessToken,
                    body: JSON.stringify(updateData)
                }
            }
            const newResponse = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${habit.id}`, updatedOptions);
            const data = await newResponse.json();
            console.log(data); // updated habit object
            location.reload();
        } else {
            const data = await response.json();
            console.log(data); // updated habit object
            location.reload();
        }
    } catch (err) {
        console.warn(err);
    }
}

function makeButtons(habit, x){
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-evenly";

        const updateContainer = document.createElement("form");
        updateContainer.style.display = "flex";
        updateContainer.style.justifyContent = "space-evenly";
        updateContainer.style.width = "40%";
        const habitButton = document.createElement("button");
        habitButton.textContent = "Update";
        habitButton.setAttribute("class","btn btn-success");
        habitButton.setAttribute("type","submit");
        habitButton.setAttribute("name",x);
        habitButton.style.height="42px";
        if(createHabitCards(habit)[6]>=100){
            habitButton.disabled = true;
        }
        updateContainer.appendChild(habitButton);

        const logInput = document.createElement("input");
        logInput.setAttribute("type","number");
        logInput.setAttribute("class","form-control mb-3");
        logInput.setAttribute("name","number");
        logInput.setAttribute("min","1");
        const maxInput = habit.expectedAmount - habit.currentAmount;
        logInput.setAttribute("max",maxInput.toString());
        logInput.setAttribute("placeholder",habit.unit.toString());
        logInput.required = true;
        // logInput.setAttribute("max",habit.expectedAmount.toString())
        logInput.style.width = "40%";
        logInput.style.height="42px";
        updateContainer.appendChild(logInput);

        updateContainer.addEventListener("submit", (e)=>{
            updateHabitStatus(e, habit);
        });
        buttonContainer.appendChild(updateContainer);

        const leaderboardBtn = document.createElement("button");
        leaderboardBtn.textContent = "Leaderboards ";
        leaderboardBtn.setAttribute("class","btn btn-warning");
        const ldbIcon = document.createElement("i");
        ldbIcon.setAttribute("class", "bi bi-bar-chart");
        leaderboardBtn.appendChild(ldbIcon);
        leaderboardBtn.setAttribute("name",x);
        leaderboardBtn.style.width = "45%";
        const defaultHabits = ["drink water","walk the dog","eat fruitu+2215veg","shower","study","read","run","walk"];
        if(defaultHabits.includes(habit.habitName.toLowerCase())){
            leaderboardBtn.disabled = false;
        }else{
            leaderboardBtn.disabled = true;
        }
        leaderboardBtn.addEventListener("click", e=>{
            checkLeaderboard(e, habit.habitName, habit.frequency, habit.expectedAmount, habit.unit);
        });
        leaderboardBtn.style.height="42px";
        buttonContainer.appendChild(leaderboardBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("class","btn btn-danger");
        const deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("class", "bi bi-trash");
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.setAttribute("name",x);
        deleteBtn.style.width = "10%";
        deleteIcon.style.pointerEvents= "none";
        deleteBtn.style.height = "42px";
        deleteBtn.addEventListener("click", e=>{
            deleteHabit(e, habits[x]);
        });
        buttonContainer.appendChild(deleteBtn);

        return(buttonContainer);
}

async function checkLeaderboard(element, habitName, frequency, expectedAmount, unit){
    element.preventDefault();
    const habitContainer = document.getElementById(`${element.target.name}`);
    habitContainer.innerHTML = "";
    const elements = createHabitCards(habits[element.target.name]);
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("class","btn-close");
    closeBtn.addEventListener("click", e=>{
        habitContainer.innerHTML = "";
        for(let x = 0 ; x<5 ; x++){
            habitContainer.appendChild(elements[x]);
        }
        habitContainer.appendChild(makeButtons(habits[element.target.name],element.target.name));
        habitContainer.appendChild(elements[5]);
        closeBtn.innerHTML = "";
    })
    habitContainer.appendChild(closeBtn)
    habitContainer.appendChild(habitFrequencies(frequency, expectedAmount, unit)[0]);
    habitContainer.appendChild(elements[0]);

    try{
        const email = localStorage.getItem("userEmail");
        const accessToken = localStorage.getItem("accessToken");
        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/json",
                        "Authorization": accessToken }}
        let response = await fetch(`https://warm-forest-14168.herokuapp.com/habits/leaderboard/${habitName}`, options);

        // check for if access token used for fetch is null/invalid
        if (response.status === 401 || response.status === 403) {
            const newAccessToken = await requestNewAccessToken();
            const updatedOptions = {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": newAccessToken,
                }
            }
            const newResponse = await fetch(`https://warm-forest-14168.herokuapp.com/habits/leaderboard/${habitName}`, updatedOptions);
            const leaders = await newResponse.json();
            const filteredLeaders = leaders.filter(leader => leader.frequency == frequency && leader.unit == unit && leader.expectedAmount == expectedAmount);
            const leaderboard = createLeaderboardTable(filteredLeaders);
            habitContainer.appendChild(leaderboard);
        } else {
            const leaders = await response.json();
            const filteredLeaders = leaders.filter(leader => leader.frequency == frequency && leader.unit == unit && leader.expectedAmount == expectedAmount);
            const leaderboard = createLeaderboardTable(filteredLeaders);
            habitContainer.appendChild(leaderboard);
        }
    } catch (err) {
        console.warn(err);
    }
}

function createLeaderboardTable (data) {
    const leaderboardTable = document.createElement('table');
    const leaderboardHeaders = document.createElement('tr');
    const headers = ['Rank','Username','Top Streak'];
    for (let x = 0; x < headers.length; x++) {
        const heading = document.createElement('td');
        const headingText = document.createTextNode(`${headers[x]}`);
        heading.appendChild(headingText);
        leaderboardHeaders.appendChild(heading);
    }
    leaderboardTable.appendChild(leaderboardHeaders);
    for (let x = 0; x < data.length; x++) {
        const leaderRow = document.createElement('tr');
        const rank = document.createElement('td');
        const rankText = document.createTextNode(`${x+1}`);
        rank.appendChild(rankText);
        leaderRow.appendChild(rank);
        const username = document.createElement('td');
        const usernameText = document.createTextNode(`${data[x].userName}`);
        username.appendChild(usernameText);
        leaderRow.appendChild(username);
        const streak = document.createElement('td');
        const streakText = document.createTextNode(`${data[x].topStreak}`);
        streak.appendChild(streakText);
        leaderRow.appendChild(streak);
        leaderboardTable.appendChild(leaderRow);
    }
    leaderboardTable.setAttribute('class', 'table');
    return leaderboardTable;
}

async function deleteHabit(element, habit){
    element.preventDefault();
    const habitContainer = document.getElementById(`${element.target.name}`);
    habitContainer.innerHTML = "";
    const closeBtn = document.createElement("button");
    const elements = createHabitCards(habits[element.target.name]);
    closeBtn.setAttribute("class","btn-close");
    closeBtn.addEventListener("click", e=>{
        habitContainer.innerHTML = "";
        for(let x = 0 ; x<5 ; x++){
            habitContainer.appendChild(elements[x]);
        }
        habitContainer.appendChild(makeButtons(habits[element.target.name],element.target.name));
        habitContainer.appendChild(elements[5]);
        closeBtn.innerHTML = "";
    })
    habitContainer.appendChild(closeBtn);
    habitContainer.appendChild(elements[0]);
    
    const deleteText = document.createElement("h6");
    deleteText.style.margin = "10px 0px 10px 0px";
    deleteText.textContent = "Are you sure you want to delete this habit? This cannot be undone.";
    habitContainer.appendChild(deleteText);
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class","btn btn-danger");
    deleteBtn.textContent = "Yes, Delete ";
    deleteBtn.style.marginBottom = "10px";
    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("class", "bi bi-trash");
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.style.width = "50%";
    deleteIcon.style.pointerEvents= "none";
    deleteBtn.style.height = "42px";
    habitContainer.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", async (e)=>{
        const accessToken = localStorage.getItem("accessToken");

        const options = {   
            method: 'DELETE',
            headers: { "Content-Type": "application/json",
                    "Authorization": accessToken }}
        try{ 
            let response = await fetch(`https://warm-forest-14168.herokuapp.com/habits/${habit.id}`, options);

            // check for if access token used for fetch is null/invalid
            if (response.status === 401 || response.status === 403) {
                const newAccessToken = await requestNewAccessToken();
                const updatedOptions = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": newAccessToken,
                    }
                }
                const newResponse = await fetch(`https://warm-forest-14168.herokuapp.com/habits/leaderboard/${habitName}`, updatedOptions);
                const deletedHabit = newResponse.json();
                console.log(deletedHabit); // log deleted habit
            }
            location.reload()
        } catch (err) {
            console.warn(err)
        }
    })
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

function isInTime(lastLog, frequency){
    // filter last log to only contain date (no time component)
    let filtered = lastLog.substring(0,10)
    let d = new Date()
    let filteredDate = filtered.substring(0,4)+"-"+filtered.substring(5,7) +"-"+ filtered.substring(8,10)
    
    let currentDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
    // get the difference between lastLog and current time
    var diff =  Math.floor(
        (Date.parse(currentDate.replace(/-/g,'\/')) 
        - Date.parse(filteredDate.replace(/-/g,'\/'))) 
        / 86400000);
    
    if(diff < frequency) {
        return true
    }
    return false
}
