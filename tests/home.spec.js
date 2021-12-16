/**
 * @jest-environment jsdom
 */
 
 const fs = require("fs");
 const path = require("path");
 const html = fs.readFileSync(path.resolve(__dirname, "../home.html"), "utf8");
 
 global.fetch = require("jest-fetch-mock");
 
 describe("home.js tests", ()=>{
    beforeEach(()=>{
        app = require('../static/js/home.js')
        testHabit ={
         id: 0,
         userEmail: "initialUser@email.com",
         userName: "Initial User",
         habitName: "Water",
         frequency: 1,
         unit: "cups",
         expectedAmount: 3,
         currentAmount: 0,
         topStreak: 5,
         currentStreak: 3,
         lastLog: "2021-12-11T11:31:21.988Z" }
     
    })
    afterEach(()=>{
       fetch.resetMocks();
 
    })
    test("grid container exists", ()=>{
        expect(document.querySelector(".grid-container")).toBeTruthy()
    })
    test("Test created cards elements",()=>{
       expect(document.querySelector(".grid-container grid-item")).toBeTruthy()
       expect(document.querySelector(".grid-container grid-item btn btn-success")).toBeTruthy()
       expect(document.querySelector(".grid-container grid-item btn btn-warning")).toBeTruthy()
       expect(document.querySelector("#habitTitleTag")).toBeTruthy()
 
       expect(document.querySelector("#habitTopStreakTag")).toBeTruthy()
       expect(document.querySelector("#habitTopStreakTag").textContent.includes("Top Streak"))
 
       expect(document.querySelector("#habitCurrentStreakTag")).toBeTruthy()
       expect(document.querySelector("#habitCurrentStreakTag").textContent.includes("Current Streak"))
 
       
    })
 
    describe("Display Habits",()=>{
        
       test("Function works",()=>{
           expect(app.displayHabits).toBeTruthy()
       })
       test("Function takes in an arguement",()=>{
           expect(app.displayHabits.length).toBe(1)
       })
 
    })
 
    describe("Display Habits",()=>{   
       beforeEach(()=>{
         const card = app.createHabitCards(testHabit)
       }) 
       test("Test elements",()=>{
           
       })
       test("Create Habit Cards work",()=>{
           expect(app.createHabitCards).toBeTruthy()
       })
       test("Display Habits takes in an habitlist",()=>{
           expect(app.createHabitCards.length).toBe(1)
       })
   })
 
   describe("Habit Frequencies",()=>{
       beforeEach(()=>{  
         let unit = "min"
       })
 
       test("Frequency is for a week",()=>{
         let freq = 7
         let amount = 1
         let func = app.habitFrequencies(freq,amount,unit)
         expect(func[1]).toBe("1 week")
       })
 
       test("Frequency is for a fortnight",()=>{
         let freq = 14 
         let amount = 1
         let func = app.habitFrequencies(freq,amount,unit)
         expect(func[1]).toBe("1 fortnight")
       })
 
       test("Frequency is for a month",()=>{
         let freq = 30 
         let amount = 1
         let func = app.habitFrequencies(freq,amount,unit)
         expect(func[1]).toBe("1 month")
       })
 
       test("Frequency is for a day",()=>{
         let freq = 1 
         let amount = 1
         let func = app.habitFrequencies(freq,amount,unit)
         expect(func[1]).toBe("1 day")
       })
 
       test("Frequency is for 4 days",()=>{
         let freq = 4 
         let amount = 1
         let func = app.habitFrequencies(freq,amount,unit)
         expect(func[1]).toBe("4 days")
       })
 
       test("Function work",()=>{
           expect(app.habitFrequencies).toBeTruthy()
       })
       test("Display Habits takes in three arguements",()=>{
           expect(app.habitFrequencies.length).toBe(3)
       })
   })
 
   describe("Update Habit Status",()=>{
       test("Function works",()=>{
           expect(app.updateHabitStatus).toBeTruthy()
       })
   })
 
   describe("Makes Buttons",()=>{
       test("Function works",()=>{
           expect(app.makeButtons).toBeTruthy()
       })
       test("Takes in an arguement",()=>{
           expect(app.makeButtons.length).toBe(1)
       })
   })
 
   describe("Checking leaderboard",()=>{
     test("Function works",()=>{
         expect(app.checkLeaderboard).toBeTruthy()
     })
     test("Takes in an arguement",()=>{
         expect(app.checkLeaderboard.length).toBe(1)
     })
 })
 
 describe("Checking leaderboard",()=>{
     test("Function works",()=>{
         expect(app.checkLeaderboard).toBeTruthy()
     })
     test("Takes in an arguement",()=>{
         expect(app.checkLeaderboard.length).toBe(1)
     })
 })
 
 
 
 
 })
 
 