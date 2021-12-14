document.addEventListener("DOMContentLoaded", displayHabits);

// async function loadHabits(){
//     // get all habits
//     try{
//         let response = await fetch(`http://localhost:3000/habits`);
//         response = await response.json();
//         displayHabits(response)
//     }catch (err) {
//     console.log(err);
//     }
// }

// fetch default habit names also?
const defaultHabits = ["drink water","walk the dog","eat fruit","shower","study","read"]

const habits=[
    {
    habitName: "Drink Water",
    frequency: 1,
    amount: { expected: 3 ,  current: 1 },
    streak: { top: 5 ,  current: 3 },
    lastLog: "2021-12-11T11:31:21.988Z"
    },
    {
    habitName: "Brushing Teeth",
    frequency: 7,
    amount: { expected: 14 , current: 9 },
    streak: { top: 101 ,  current: 70 },
    lastLog: "2021-12-11T11:31:21.988Z"
    },
    {
    habitName: "Walk the Dog",
    frequency: 7,
    amount: { expected: 1 , current: 1 },
    streak: { top: 76 ,  current: 76 },
    lastLog: "2021-12-11T11:31:21.988Z"
    },
]

function displayHabits(){
    const habitGrid = document.querySelector(".grid-container")
    for(let x in habits){
        const habitContainer = document.createElement("div")
        habitContainer.setAttribute("class","grid-item")
        habitContainer.setAttribute("id",x)
        for(let i = 0 ; i<5 ; i++){
            habitContainer.appendChild(createHabitCards(habits[x])[i])
        }
        habitContainer.appendChild(makeButtons(x))
        habitContainer.appendChild(createHabitCards(habits[x])[5])
        habitGrid.appendChild(habitContainer)
    }
}

function createHabitCards(habit){
        const habitTitle = document.createElement("h3")
        habitTitle.textContent = habit.habitName

        const habitTopStreak = document.createElement("h6")
        habitTopStreak.textContent = `Top Streak: ${habit.streak.top}`
        const habitCurrentStreak = document.createElement("h6")
        habitCurrentStreak.textContent = `Current Streak: ${habit.streak.current}`

        let frequency = habit.frequency
        const amountExpected = habit.amount.expected
        habitFrequency = habitFrequencies(frequency, amountExpected)[0]

        const habitStatus = document.createElement("h6")
        const progress = Math.round((habit.amount.current/habit.amount.expected)*100)
        habitStatus.textContent = `Current Progress: ${progress}% (${habit.amount.current} time(s) in the last ${habitFrequencies(frequency, amountExpected)[1]})`

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

function habitFrequencies(frequency, amountExpected){
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
        habitFrequency.textContent = `Frequency: Once per day`
    }
    else if(amountExpected>1 && frequency == 1){
        habitFrequency.textContent = `Frequency: ${amountExpected} times per day`
    }
    else if(amountExpected>1){
        habitFrequency.textContent = `Frequency: ${amountExpected} times every ${frequencyShown}`
    }
    
    else if(amountExpected==1){
        habitFrequency.textContent = `Frequency: Once every ${frequencyShown}`
    }
    return[habitFrequency, frequencyShown]
}

function updateHabitStatus(e){
    e.preventDefault()
    // habit index can be used in url when carrying out the put request
    console.log(`habit index: ${e.target.name}`)
    console.log(habits[e.target.name].habitName)
    // put request, where habitName = habits[e.target.name].habitName
}

function makeButtons(x){
        const buttonContainer = document.createElement("div")
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-evenly";

        const habitButton = document.createElement("button")
        habitButton.textContent = "Log Progress (+1)"
        habitButton.setAttribute("class","btn btn-success")
        habitButton.setAttribute("name",x)
        habitButton.addEventListener("click", e=>{
            updateHabitStatus(e)
        })
        buttonContainer.appendChild(habitButton)

        const leaderboardBtn = document.createElement("button")
        leaderboardBtn.textContent = "Leaderboards"
        leaderboardBtn.setAttribute("class","btn btn-warning")
        leaderboardBtn.setAttribute("name",x)
        if(defaultHabits.includes(habits[x].habitName.toLowerCase())){
            leaderboardBtn.disabled = false;
        }else{
            leaderboardBtn.disabled = true;
        }
        leaderboardBtn.addEventListener("click", e=>{
            checkLeaderboard(e)
        })
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
        habitContainer.appendChild(makeButtons(element.target.name))
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

