document.addEventListener("DOMContentLoaded", displayHabits);

async function loadHabits(){
    // get all habits
    try{
        const email = localStorage.getItem("userEmail")
        const accessToken = localStorage.getItem("accessToken")
        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/json",
                        "Authorization": accessToken }
        }
        let response = await fetch(`http://localhost:3000/habits/${email}`, options);
        habits = await response.json();
        return habits
    }catch (err) {
    console.log(err);
    }
}

async function displayHabits(){
    const habits = await loadHabits()
    console.log(habits)
    const habitGrid = document.querySelector(".grid-container")
    if(habits.length == 0){
        const noHabitsMessage = document.createElement("h6")
        noHabitsMessage.textContent = "No habits to display. Click 'Add Habits' above to create one"
        noHabitsMessage.style.marginTop = "20px"
        document.querySelector("#dashboard-message").appendChild(noHabitsMessage)
    }
    for(let x in habits){
        // console.log(habits[x])
        const habitContainer = document.createElement("div")
        habitContainer.setAttribute("class","grid-item")
        habitContainer.setAttribute("id",x)
        for(let i = 0 ; i<5 ; i++){
            habitContainer.appendChild(createHabitCards(habits[x])[i])
        }
        habitContainer.appendChild(makeButtons(habits[x], x))
        habitContainer.appendChild(createHabitCards(habits[x])[5])
        habitGrid.appendChild(habitContainer)
    }
}

function createHabitCards(habit){
        const habitTitle = document.createElement("h3")
        habitTitle.setAttribute("id","habitTitleTag")
        habitTitle.textContent = habit.habitName

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
            progressBar.textContent = ":)";
            progressBar.style.textAlign = "right";
            progressBar.style.color = "#000000";
        }

        return [habitTitle, habitTopStreak, habitCurrentStreak, habitFrequency, habitStatus, progressBar, progress]
}

function habitFrequencies(frequency, amountExpected, units){
    let unitShown = units.substring(0,units.length-1)
    const habitFrequency = document.createElement("h6")
    // Check if frequency is a week, fortnight or month
    if(frequency==7){
        frequencyShown = "week"
    } else if (frequency == 14){
        frequencyShown = "fortnight"
    } else if (frequency == 30){
        frequencyShown = "month"
    } else if (frequency == 1){
        frequencyShown = "day"
    }
    else{
        frequencyShown = frequency + " days"
    }
    // Set text content of habitFrequency html element
    if(amountExpected==frequency){
        habitFrequency.textContent = `Frequency: One ${unitShown}(s) per day`
    }
    else if(amountExpected>1 && frequency == 1){
        habitFrequency.textContent = `Frequency: ${amountExpected} ${unitShown}(s) per day`
    }
    else if(amountExpected>1){
        habitFrequency.textContent = `Frequency: ${amountExpected} ${unitShown}(s) every ${frequencyShown}`
    }
    
    else if(amountExpected==1){
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
    const updateData = {
        id: habit.id,
        userEmail: habit.userEmail,
        currentAmount: newAmount
    }
    const accessToken = localStorage.getItem("accessToken")
    const options = {
        method: 'PUT',
        headers: { "Content-Type": "application/json",
        "Authorization": accessToken },
        body: JSON.stringify(updateData)
    }
    try{
        const response = await fetch(`http://localhost:3000/habits/${habit.id}`, options)
        const r = await response.json()
        location.reload()
    } catch (err) {
        console.warn(err)
    }
}

function makeButtons(habit, x){
        const buttonContainer = document.createElement("div")
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-evenly";

        const updateContainer = document.createElement("form")
        updateContainer.style.display = "flex";
        updateContainer.style.justifyContent = "space-evenly";
        updateContainer.style.width = "40%"
        const habitButton = document.createElement("button")
        habitButton.textContent = "Update"
        habitButton.setAttribute("class","btn btn-success")
        habitButton.setAttribute("type","submit")
        habitButton.setAttribute("name",x)
        habitButton.style.height="42px";
        if(createHabitCards(habit)[6]>=100){
            habitButton.disabled = true
        }
        updateContainer.appendChild(habitButton)

        const logInput = document.createElement("input");
        logInput.setAttribute("type","number");
        logInput.setAttribute("class","form-control mb-3")
        logInput.setAttribute("name","number")
        logInput.setAttribute("min","0")
        const maxInput = habit.expectedAmount - habit.currentAmount
        logInput.setAttribute("max",maxInput.toString())
        logInput.setAttribute("placeholder",habit.unit.toString())
        logInput.required = true;
        // logInput.setAttribute("max",habit.expectedAmount.toString())
        logInput.style.width = "40%";
        logInput.style.height="42px";
        updateContainer.appendChild(logInput)

        updateContainer.addEventListener("submit", (e)=>{
            updateHabitStatus(e, habit)
        })
        buttonContainer.appendChild(updateContainer)

        const leaderboardBtn = document.createElement("button")
        leaderboardBtn.textContent = "Leaderboards "
        leaderboardBtn.setAttribute("class","btn btn-warning")
        const ldbIcon = document.createElement("i")
        ldbIcon.setAttribute("class", "bi bi-bar-chart")
        leaderboardBtn.appendChild(ldbIcon)
        leaderboardBtn.setAttribute("name",x)
        leaderboardBtn.style.width = "45%"
        const defaultHabits = ["drink water","walk the dog","eat fruit/veg","shower","study","read","run","walk"]
        if(defaultHabits.includes(habits[x].habitName.toLowerCase())){
            leaderboardBtn.disabled = false;
        }else{
            leaderboardBtn.disabled = true;
        }
        leaderboardBtn.addEventListener("click", e=>{
            checkLeaderboard(e, habits[x].habitName, habits[x].frequency, habits[x].expectedAmount, habits[x].unit)
        })
        leaderboardBtn.style.height="42px";
        buttonContainer.appendChild(leaderboardBtn)

        const deleteBtn = document.createElement("button")
        deleteBtn.setAttribute("class","btn btn-danger")
        const deleteIcon = document.createElement("i")
        deleteIcon.setAttribute("class", "bi bi-trash")
        deleteBtn.appendChild(deleteIcon)
        deleteBtn.setAttribute("name",x)
        deleteBtn.style.width = "10%"
        deleteIcon.style.pointerEvents= "none";
        deleteBtn.style.height = "42px"
        deleteBtn.addEventListener("click", e=>{
            deleteHabit(e, habits[x])
        })
        buttonContainer.appendChild(deleteBtn)

        return(buttonContainer)
}

async function checkLeaderboard(element, habitName, frequency, expectedAmount, unit){
    element.preventDefault()
    const habitContainer = document.getElementById(`${element.target.name}`)
    habitContainer.innerHTML = "";
    const closeBtn = document.createElement("button")
    closeBtn.setAttribute("class","btn-close")
    closeBtn.addEventListener("click", e=>{
        habitContainer.innerHTML = "";
        for(let x = 0 ; x<5 ; x++){
            habitContainer.appendChild(createHabitCards(habits[element.target.name])[x])
        }
        habitContainer.appendChild(makeButtons(habits[element.target.name],element.target.name))
        habitContainer.appendChild(createHabitCards(habits[element.target.name])[5])
        closeBtn.innerHTML = "";
    })
    habitContainer.appendChild(closeBtn)
    habitContainer.appendChild(habitFrequencies(frequency, expectedAmount, unit)[0])
    habitContainer.appendChild(createHabitCards(habits[element.target.name])[0])

    try{
        const email = localStorage.getItem("userEmail")
        const accessToken = localStorage.getItem("accessToken")
        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/json",
                        "Authorization": accessToken }}
        const r = await fetch(`http://localhost:3000/habits/leaderboard/${habitName}`, options)
        const leaders = await r.json()
        const filteredLeaders = leaders.filter(leader => leader.frequency == frequency && leader.unit == unit && leader.expectedAmount == expectedAmount)
        const leaderboard = createLeaderboardTable(filteredLeaders)
        habitContainer.appendChild(leaderboard)
        } catch (err) {
            console.warn(err)
        }
}

function createLeaderboardTable (data) {
    const leaderboardTable = document.createElement('table')
    const leaderboardHeaders = document.createElement('tr')
    const headers = ['Rank','Username','Top Streak']
    for (let x = 0; x < headers.length; x++) {
        const heading = document.createElement('td')
        const headingText = document.createTextNode(`${headers[x]}`)
        heading.appendChild(headingText)
        leaderboardHeaders.appendChild(heading)
    }
    leaderboardTable.appendChild(leaderboardHeaders)
    for (let x = 0; x < data.length; x++) {
        const leaderRow = document.createElement('tr')
        const rank = document.createElement('td')
        const rankText = document.createTextNode(`${x+1}`)
        rank.appendChild(rankText)
        leaderRow.appendChild(rank)
        const username = document.createElement('td')
        const usernameText = document.createTextNode(`${data[x].userName}`)
        username.appendChild(usernameText)
        leaderRow.appendChild(username)
        const streak = document.createElement('td')
        const streakText = document.createTextNode(`${data[x].topStreak}`)
        streak.appendChild(streakText)
        leaderRow.appendChild(streak)
        leaderboardTable.appendChild(leaderRow)
    }
    leaderboardTable.setAttribute('class', 'table')
    return leaderboardTable
}

async function deleteHabit(element, habit){
    element.preventDefault()
    const habitContainer = document.getElementById(`${element.target.name}`)
    habitContainer.innerHTML = "";
    const closeBtn = document.createElement("button")
    closeBtn.setAttribute("class","btn-close")
    closeBtn.addEventListener("click", e=>{
        habitContainer.innerHTML = "";
        for(let x = 0 ; x<5 ; x++){
            habitContainer.appendChild(createHabitCards(habits[element.target.name])[x])
        }
        habitContainer.appendChild(makeButtons(habits[element.target.name],element.target.name))
        habitContainer.appendChild(createHabitCards(habits[element.target.name])[5])
        closeBtn.innerHTML = "";
    })
    habitContainer.appendChild(closeBtn)
    habitContainer.appendChild(createHabitCards(habits[element.target.name])[0])
    
    const deleteText = document.createElement("h6")
    deleteText.style.margin = "10px 0px 10px 0px"
    deleteText.textContent = "Are you sure you want to delete this habit? This cannot be undone."
    habitContainer.appendChild(deleteText)
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("class","btn btn-danger")
    deleteBtn.textContent = "Yes, Delete "
    deleteBtn.style.marginBottom = "10px"
    const deleteIcon = document.createElement("i")
    deleteIcon.setAttribute("class", "bi bi-trash")
    deleteBtn.appendChild(deleteIcon)
    deleteBtn.style.width = "50%"
    deleteIcon.style.pointerEvents= "none";
    deleteBtn.style.height = "42px"
    habitContainer.appendChild(deleteBtn)
    deleteBtn.addEventListener("click", async (e)=>{
        const accessToken = localStorage.getItem("accessToken")
        console.log(habit.id)
        const habitData = {
            id: habit.id
        }
        const options = {   
            method: 'DELETE',
            headers: { "Content-Type": "application/json",
                    "Authorization": accessToken }}
        try{ 
            const response = await fetch(`http://localhost:3000/habits/${habit.id}`, options)
            // const r = await response.json()
            location.reload()
        } catch (err) {
            console.warn(err)
        }
    })
}

// module.exports = {
//     displayHabits,
//     createHabitCards,
//     habitFrequencies,
//     updateHabitStatus,
//     makeButtons,
//     checkLeaderboard
// }

