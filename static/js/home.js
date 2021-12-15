document.addEventListener("DOMContentLoaded", loadHabits);

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
        response = await response.json();
        console.log(response)
        displayHabits(response)
    }catch (err) {
    console.log(err);
    }
}

// fetch default habit names also?
const defaultHabits = ["drink water","walk the dog","eat fruit","shower","study","read","run","walk"]

// const habits=[
//     {
//         id: 0,
//         userEmail: "initialUser@email.com",
//         userName: "Initial User",
//         habitName: "Water",
//         frequency: 1,
//         unit: "cups",
//         expectedAmount: 3,
//         currentAmount: 0,
//         topStreak: 5,
//         currentStreak: 3,
//         lastLog: "2021-12-11T11:31:21.988Z"
//     },
//     {
//         id: 1,
//         userEmail: "initialUser@email.com",
//         userName: "Initial User",
//         habitName: "Run",
//         frequency: 7,
//         unit: "kilometres",
//         expectedAmount: 10,
//         currentAmount: 3,
//         topStreak: 5,
//         currentStreak: 3,
//         lastLog: "2021-12-11T11:31:21.988Z"
//     },
//     {
//         id: 2,
//         userEmail: "initialUser@email.com",
//         userName: "Initial User",
//         habitName: "Read",
//         frequency: 1,
//         unit: "minutes",
//         expectedAmount: 30,
//         currentAmount: 0,
//         topStreak: 10,
//         currentStreak: 2,
//         lastLog: "2021-12-11T11:31:21.988Z"
//     }
// ]

function displayHabits(habits){
    console.log(habits)
    const habitGrid = document.querySelector(".grid-container")
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
        // const progress = createHabitCards(habits[x])[5]
        progressBar.style.width =progress+"%";
        if (progress==100){
            progressBar.textContent = ":)";
            progressBar.style.textAlign = "right";
            progressBar.style.color = "#000000";
        }

        return [habitTitle, habitTopStreak, habitCurrentStreak, habitFrequency, habitStatus, progressBar]
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
    const options = {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    }
    try{
        const response = await fetch(`http://localhost:3000/habits/${habit.userEmail}/${habit.id}`, options)
        const r = await response.json()
    } catch (err) {
        console.warn(err)
    }
}

function makeButtons(habit, x){
        console.log(habit)
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
        updateContainer.appendChild(habitButton)

        const logInput = document.createElement("input");
        logInput.setAttribute("type","number");
        logInput.setAttribute("class","form-control mb-3")
        logInput.setAttribute("name","number")
        logInput.setAttribute("min","0")
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
        if(defaultHabits.includes(habits[x].habitName.toLowerCase())){
            leaderboardBtn.disabled = false;
        }else{
            leaderboardBtn.disabled = true;
        }
        leaderboardBtn.addEventListener("click", e=>{
            checkLeaderboard(e)
        })
        leaderboardBtn.style.height="42px";
        buttonContainer.appendChild(leaderboardBtn)

        return(buttonContainer)
}

function checkLeaderboard(element){
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

    // get leaderboard/streak data from backend and display top 5 users on this card
}

module.exports = {
    displayHabits,
    createHabitCards,
    habitFrequencies,
    updateHabitStatus,
    makeButtons,
    checkLeaderboard
}

