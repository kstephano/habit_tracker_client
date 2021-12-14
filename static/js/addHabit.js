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
        newHabitName = e.target.existing_habit_name.value
    }else if(e.target.existing_habit_name.value==""){
        newHabitName = e.target.new_habit_name.value
    }else{
        console.log("BROKEN")
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