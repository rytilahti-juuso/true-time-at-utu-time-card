
// WantedProcentage is number ex. "60" wihtout percentage markings
function countRealWorkingTime(){
    let originalArray = []
   
    //let wantedProcentageInDouble = wantedProcentage/100
    //console.log("wantedPercentageInDouble is: " +wantedProcentageInDouble)
    
    let allValues = document.querySelectorAll(".header-balance-part")
    //Counts total of days showing currently on kellokortti by counting the plus icons on right side of each day working time marking
    let howManyDaysIsShowing = document.querySelectorAll(".float-right.glyphicon.glyphicon-plus-sign").length
    let workingDaysCount = howManyDaysIsShowing-countShowingfreeDays()
    console.log("workingDayscount" + workingDaysCount)
    originalArray = countAllMinutes(allValues, originalArray) 
    let combinedArray = createCombinedArray(originalArray)
    let newA = transferArrayToMinutes(combinedArray)
    console.log(newA)
    console.log(originalArray)
    console.log(combinedArray)
}

function transferArrayToMinutes(combinedArray){
    let arr = []
    for(let i = 0; i < combinedArray.length; i++){
        let element = combinedArray[i]
        element = element.replace("min", "")
        element = processHourToMinutes(element)
        //Process hours to minutes
        element = addMinutesToHour(element)
        arr.push(element)
    }
    return arr
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

function addMinutesToHour(element){
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

function countAllMinutes(allValues, hah){
    let allMinutes = 0
    let previousHourWasMinus = false
    for(let  val of allValues.values()){
        console.log(allValues.values()[0])
        let individualTime = val.innerHTML.toString()      
        let patt = /\S/g;
        
        let result = individualTime.match(patt).join('')
        allMinutes = addMinutes(result, allMinutes, previousHourWasMinus)
        allMinutes = subtractMinutes(result, allMinutes, previousHourWasMinus)
        // next round of minutes is minus      
        if(result.includes("-") && result.includes("h")){
            previousHourWasMinus = true
        }
        // Has gone through the minus minutes 
        if(result.includes("min" && previousHourWasMinus)){
            previousHourWasMinus = false
        }
        hah.push(result = individualTime.match(patt).join(''))
        console.log("allMinutes is: " + allMinutes)
            //console.log(individualTime)
        }
    return hah
}

//add minutes, if is hour, changes it to minutes automatically before add
function addMinutes(result, allMinutes, previousHourWasMinus){
    let pattN = /[0-9]/g
    let isHour = result.includes("h")
    if(!result.includes("-")){

        if(isHour ){
            allMinutes = allMinutes + hoursToMin(result)
        }else{
            if(!previousHourWasMinus){
                allMinutes = allMinutes + parseInt(result.match(pattN).join(''))
            }
        }
    }
    return allMinutes
}

//Subtract minutes, if is hour, changes it to minutes automatically before subtracting
function subtractMinutes(result, allMinutes, previousHourWasMinus){
    let pattN = /[0-9]/g
    let isHour = result.includes("h")
    if(result.includes("-")){
        if(isHour){
        allMinutes = allMinutes - (hoursToMin(result))
    }else{
        if(result.includes("-") || previousHourWasMinus)
        allMinutes = allMinutes - parseInt(result.match(pattN).join(''))
        }
    }
    return allMinutes
}

//h is string still containing letter 'h'
function hoursToMin(result){
    let pattN = /[0-9]/g
    let min = parseInt(result.match(pattN).join('')) * 60
    console.log(min)
    return min
}

//returns number of free days from work
function countShowingfreeDays(){
    return document.querySelectorAll(".weekend-header").length
}