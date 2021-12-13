document.addEventListener("DOMContentLoaded", loadListeners);

function loadListeners(){
    const selectExistingBtn = document.querySelector("#default-habit-button")
    const createNewBtn = document.querySelector("#own-habit-button")

    selectExistingBtn.addEventListener("click",e=>{
        document.querySelector("#default-habit-selection").required = true;
        document.querySelector("#create-own-habit").required = false;
        document.querySelector("#own-habit").style.display = "none";
        document.querySelector("#default-habits").style.display = "flex";
    })

    createNewBtn.addEventListener("click",e=>{
        document.querySelector("#default-habit-selection").required = false;
        document.querySelector("#create-own-habit").required = true;
        document.querySelector("#own-habit").style.display = "flex";
        document.querySelector("#default-habits").style.display = "none";
    })
}

const habitForm = document.querySelector("#add-habit-form")

habitForm.addEventListener("submit", e=>{
    e.preventDefault()
    if(e.target.new_habit_name.value==""){
        console.log("existing habit chosen")
        newHabitName = e.target.existing_habit_name.value
    }else if(e.target.existing_habit_name.value==""){
        console.log("new habit chosen")
        newHabitName = e.target.new_habit_name.value
    }

    const habitData = {
        habitName: newHabitName,
        frequency: e.target.frequency.value,
        amount: [{ expected: e.target.amount.value }, { current: 0 }],
        streak: [{ top: 0 }, { current: 0 }],
        lastLog: ""
        }

    console.log(habitData)
})