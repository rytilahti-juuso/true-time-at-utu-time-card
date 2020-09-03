function saldo(){
let allValues = document.querySelectorAll(".header-balance-part")
let allMinutes = 0
for(let val of allValues.values()){
    let individualTime = val.innerHTML.toString()      
    let patt = /\S/g;
    
    let result = individualTime.match(patt).join('')
    allMinutes = addMinutes(result, allMinutes)
    allMinutes = subtractMinutes(result, allMinutes)      

     console.log(result)
        //console.log(individualTime)
    }
console.log(allMinutes)
}

//add minutes, if is hour, changes it to minutes automatically before add
function addMinutes(result, allMinutes){
    let pattN = /[0-9]/g
    let isHour = result.includes("h")
    if(isHour && !result.includes("-")){
        allMinutes = allMinutes + hoursToMin(result)
    }else{
        allMinutes = allMinutes + parseInt(result.match(pattN).join(''))
        }
    return allMinutes
}

//Subtract minutes, if is hour, changes it to minutes automatically before subtracting
function subtractMinutes(result, allMinutes){
    let pattN = /[0-9]/g
    let isHour = result.includes("h")
    if(result.includes("-")){
        if(isHour){
        allMinutes = allMinutes - (-1*hoursToMin(result))
    }else{
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
