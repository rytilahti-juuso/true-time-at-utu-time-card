let fullWorkDayMinutes = 7*60+15
// WantedProcentage is number ex. "60" without percentage markings, fullWorkDayNumber is number of full workDays currently showing at kellokortti.utu.fi.
// It will be counted from bottom to up, so if fullWorkDayNumber = 1, the oldest marking in kellokortti is full work day.
function countRealWorkingTime(wantedProcentageAsInt, fullWorkDayNumber){
    let originalArray = []
   
    let wantedProcentageInDouble = wantedProcentageAsInt/100
    let currentWorkDayLength = Math.trunc(fullWorkDayMinutes*wantedProcentageInDouble)
    //console.log("wantedPercentageInDouble is: " +wantedProcentageInDouble)
    
    let allValues = document.querySelectorAll(".header-balance-part")
    //Counts total of days showing currently on kellokortti by counting the plus icons on right side of each day working time marking
    let howManyDaysIsShowing = document.querySelectorAll(".float-right.glyphicon.glyphicon-plus-sign").length
    //let workingDaysCount = howManyDaysIsShowing-countShowingfreeDays()
    originalArray = preProcessOriginalArray(allValues, originalArray) 
    let combinedArray = createCombinedArray(originalArray)
    let minutesArray = transformArrayToMinutes(combinedArray, currentWorkDayLength, fullWorkDayNumber)
    let total = gainTotalBalance(minutesArray)
    return returnTotalHoursAndMinutesAsString(total)
}

// Takes the total balance as minutes and converts it to string of hours and min
function returnTotalHoursAndMinutesAsString(total){
    //if hours is not zero return hours amount, otherwise set it to zero
    let hours = (total%60 === 0) ? 0 : Math.trunc(total/60)
    let minutes = total % 60
    // Control where the minus is put
    if( minutes < 0 &&  hours != 0){
        minutes = (-1)* minutes
    }
    let str = ""
    if(hours != 0){
        str = `Total balance is ${hours} h and ${minutes} min`
    }else{
        str = `Total balance is ${minutes} min`
    }
    return str
}

//Counts total balance, takes arg fully processed array which elements are all ints, return total balance as int
function gainTotalBalance(arr){
    let total = 0
    for(let i = 0; i < arr.length; i++){
        let element = arr[i]
        total =  total + element
    }
    return total
}

//returns array that has hours and mins converted to minutes. All array elements are now int
function transformArrayToMinutes(combinedArray, currentWorkDayLength, fullWorkDayNumber){
    let arr = []
    for(let i = 0; i < combinedArray.length; i++){
        let element = combinedArray[i]
        let actualElement = combinedArray[i]
        element = element.replace("min", "")
        element = processHourToMinutes(element)
        //Process hours to minutes
        element = convertHoursToMinutesAndAddMinutesAndHoursTogether(element)
        element = convertRelationalMinutesToActualMinutes(element)
        if(i >= (combinedArray.length-fullWorkDayNumber)){
            element = countActionalRelationalMinutes(element, fullWorkDayMinutes, actualElement)
        }else{
            //process the shorten days to correct values
            element = countActionalRelationalMinutes(element, currentWorkDayLength, actualElement)
        }
        arr.push(element)
    }
    return arr
}

function countActionalRelationalMinutes(element, currentWorkDayLength, actualElement){
    actualElement = actualElement
    if(element >currentWorkDayLength ){
        element = element -currentWorkDayLength
    }else if(currentWorkDayLength === element || currentWorkDayLength === (element*(-1))){
        // Do nothing
    }else{
        if(element < currentWorkDayLength  ){
                element = currentWorkDayLength - element
                element = element *(-1)    
            
        }
    }
    // If working day difference is 0 min this bugs (then it should return work day  full time instead of zero). Otherwise this code should work
    if(actualElement=== "0min"){
        element = 0
    }
    return element
}

//returns actual working minutes, element is the relational minutes (+/- minus minutes as int relational to full working hours)
function convertRelationalMinutesToActualMinutes(element) {
    if(element > 0){
        element = fullWorkDayMinutes + element
    }else{
        if(element*(-1) === parseInt(fullWorkDayMinutes)){
            //Do nothing
        }else{
            let percentage =1- (((-1)*element)/fullWorkDayMinutes)
            element = fullWorkDayMinutes * percentage
            element = Math.trunc(element)
        }
    }

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
        min = parseInt(element.substring(element.indexOf("h")+1, element.length))
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
    for(let  element of allValues.values()){
        element = removeSpacesAndPutMinutesAndHoursInToOneString(element)   
        arr.push(element)
            //console.log(individualTime)
        }
    return arr
}

function removeSpacesAndPutMinutesAndHoursInToOneString(element){
    let individualTime = element.innerHTML.toString()      
        let patt = /\S/g;   
        element = individualTime.match(patt).join('')
        element = individualTime.match(patt).join('')
    return element
}

//returns number of free days from work
function countShowingfreeDays(){
    return document.querySelectorAll(".weekend-header").length
}