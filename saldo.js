const fullWorkDayMinutes = 7*60+25
// WantedProcentage is number ex. "60" wihtout percentage markings
function countRealWorkingTime(wantedProcentage){
    let originalArray = []
   
    let wantedProcentageInDouble = wantedProcentage/100
    let currentWorkDayLength = Math.trunc(fullWorkDayMinutes*wantedProcentageInDouble)
    //console.log("wantedPercentageInDouble is: " +wantedProcentageInDouble)
    
    let allValues = document.querySelectorAll(".header-balance-part")
    //Counts total of days showing currently on kellokortti by counting the plus icons on right side of each day working time marking
    let howManyDaysIsShowing = document.querySelectorAll(".float-right.glyphicon.glyphicon-plus-sign").length
    let workingDaysCount = howManyDaysIsShowing-countShowingfreeDays()
    console.log("workingDayscount" + workingDaysCount)
    originalArray = preProcessOriginalArray(allValues, originalArray) 
    let combinedArray = createCombinedArray(originalArray)
    let minutesArray = transformArrayToMinutes(combinedArray, currentWorkDayLength)
    console.log(minutesArray)
    console.log(originalArray)
    console.log(combinedArray)
}

//returns array that has hours and mins converted to minutes. All array elements are now int
function transformArrayToMinutes(combinedArray, currentWorkDayLength){
    let arr = []
    for(let i = 0; i < combinedArray.length; i++){
        let element = combinedArray[i]
        element = element.replace("min", "")
        element = processHourToMinutes(element)
        //Process hours to minutes
        element = convertHoursToMinutesAndAddMinutesAndHoursTogether(element)
        element = convertRelationalMinutesToActualMinutes(element)
        element = countActionalRelationalMinutes(element, currentWorkDayLength)
        arr.push(element)
    }
    return arr
}

function countActionalRelationalMinutes(element, currentWorkDayLength){
    element = element -currentWorkDayLength
    return element
}

//returns actual working minutes, element is the relational minutes (+/- minus minutes as int relational to full working hours)
function convertRelationalMinutesToActualMinutes(element) {
        element = fullWorkDayMinutes + element
    return element
}


//Process hour to minutes from array's element, return minus ex. 120-h39
function processHourToMinutes(element){
    if(element.includes("h")){
        let hour = 0
        //take the int of hour
        if(element.includes("-")){
            hour = element.substring(1, element.indexOf("h"))
        }else{
            hour= element.substring(0, element.indexOf("h"))
        }
        hour = parseInt(hour)*60
        //replace the hour amount with hour's amount of minutes
        if(element.includes("-")){
            element = element.replace(element.substring(1, element.indexOf("h")), "")
        }else{
            element = element.replace(element.substring(0, element.indexOf("h")), "")
        }
        element = hour.toString() + element
    }
    return element
}

//returns allMinutes as Int!
function convertHoursToMinutesAndAddMinutesAndHoursTogether(element){
    // all minutes combined
    let allMinutes = 0
    //minutes converted from hour
    let hMin = 0
    //"normal" minutes
    let min = 0
    let isMinus = element.includes("-")
    //removing "-"-sign for easier preprocessing
    element = element.replace("-", "")
    if(element.includes("h")){
        hMin = parseInt(element.substring(0, element.indexOf("h")))
        min = parseInt(element.indexOf("h")+1, element.length)
        allMinutes = hMin +min
    }else{
        min= parseInt(element)
        allMinutes = min
    }
    //If is minus multiply with -1
    if(isMinus){
        allMinutes = allMinutes * (-1)
    }
    return allMinutes
}

function createCombinedArray(originalArray){
    let hoursAndMinsCombined = []
    for(let i = 0; i < originalArray.length; i++){
        if(i <= originalArray.length-2){
            let num2 = i+1
            if(originalArray[i].includes("h")){
                let combined = originalArray[i] + originalArray[i+1]
                hoursAndMinsCombined.push(combined)
            }else{
                if(i!= 0){
                    if(!originalArray[i-1].includes("h")){
                        hoursAndMinsCombined.push(originalArray[i])
                    }
                }
                if(i === 0 && !originalArray[i].includes("h")){
                    hoursAndMinsCombined.push(originalArray[i])
                }
            } 
        }
            
}
return hoursAndMinsCombined
}

//Cleans Original array of extra spaces etc.
function preProcessOriginalArray(allValues, arr){
    let previousHourWasMinus = false
    for(let  val of allValues.values()){
        let individualTime = val.innerHTML.toString()      
        let patt = /\S/g;   
        let result = individualTime.match(patt).join('')
        arr.push(result = individualTime.match(patt).join(''))
            //console.log(individualTime)
        }
    return arr
}

//returns number of free days from work
function countShowingfreeDays(){
    return document.querySelectorAll(".weekend-header").length
}