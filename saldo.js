
// WantedProcentage is number ex. "60" wihtout percentage markings
function countRealWorkingTime(){
    let hah = []
    let newA = []
    //let wantedProcentageInDouble = wantedProcentage/100
    //console.log("wantedPercentageInDouble is: " +wantedProcentageInDouble)
    
    let allValues = document.querySelectorAll(".header-balance-part")
    //Counts total of days showing currently on kellokortti by counting the plus icons on right side of each day working time marking
    let howManyDaysIsShowing = document.querySelectorAll(".float-right.glyphicon.glyphicon-plus-sign").length
    let workingDaysCount = howManyDaysIsShowing-countShowingfreeDays()
    console.log("workingDayscount" + workingDaysCount)
    hah = countAllMinutes(allValues, hah) 
    console.log(hah)
    for(let i = 0; i < hah.length; i++){
            if(i <= hah.length-2){
                let num2 = i+1
                if(hah[i].includes("h")){
                    let combined = hah[i] + hah[i+1]
                    newA.push(combined)
                }else{
                    if(i!= 0){
                        if(!hah[i-1].includes("h")){
                            newA.push(hah[i])
                        }
                    }
                    if(i === 0 && !hah[i].includes("h")){
                        newA.push(hah[i])
                    }
                } 
            }
                
    }
    console.log(newA)
    console.log(hah)
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