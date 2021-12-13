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
const habits=[
    {
    habitName: "Water",
    frequency: 1,
    amount: [{ expected: 3 }, { current: 0 }],
    streak: [{ top: 5 }, { current: 3 }],
    lastLog: "2021-12-11T11:31:21.988Z"
    },
    {
    habitName: "Brushing Teeth",
    frequency: 14,
    amount: [{ expected: 7 }, { current: 1 }],
    streak: [{ top: 101 }, { current: 70 }],
    lastLog: "2021-12-11T11:31:21.988Z"
    },
    {
    habitName: "Dog Walking",
    frequency: 7,
    amount: [{ expected: 1 }, { current: 0 }],
    streak: [{ top: 76 }, { current: 76 }],
    lastLog: "2021-12-11T11:31:21.988Z"
    },

]

function displayHabits(){
    const habitGrid = document.querySelector(".grid-container")
    for(let x in habits){
        const habitContainer = document.createElement("div")
        habitContainer.setAttribute("class","grid-item")
        const habitName = document.createElement("h3")
        habitName.textContent = habits[x].habitName
        habitContainer.appendChild(habitName)

        const habitTopStreak = document.createElement("h6")
        habitTopStreak.textContent = `Top Streak: ${habits[x].streak[0].top}`
        const habitCurrentStreak = document.createElement("h6")
        habitCurrentStreak.textContent = `Current Streak: ${habits[x].streak[1].current}`
        habitContainer.appendChild(habitTopStreak)
        habitContainer.appendChild(habitCurrentStreak)

        let frequency = habits[x].frequency
        const amountExpected = habits[x].amount[0].expected
        habitFrequency = habitFrequencies(frequency, amountExpected)
        habitContainer.appendChild(habitFrequency)

        const habitStatus = document.createElement("h6")
        habitStatus.textContent = `Times Completed: ${habits[x].amount[1].current}`
        habitContainer.appendChild(habitStatus)

        const habitButton = document.createElement("button")
        habitButton.textContent = "Completed"
        habitButton.setAttribute("class","btn btn-success")
        habitButton.setAttribute("name",x)
        habitButton.addEventListener("click", e=>{
            updateHabitStatus(e)
        })

        habitContainer.appendChild(habitButton)
        habitGrid.appendChild(habitContainer)
    }
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
    } else{
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
    return(habitFrequency)
}

function updateHabitStatus(e){
    e.preventDefault()
    // habit index can be used in url when carrying out the put request
    console.log(`habit index: ${e.target.name}`)
    console.log(habits[e.target.name].habitName)
    // put request, where habitName = habits[e.target.name].habitName
}