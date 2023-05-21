// This work is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0) https://creativecommons.org/licenses/by-nc-sa/4.0/
// © Trendoscope Pty Ltd
//                                       ░▒
//                                  ▒▒▒   ▒▒
//                              ▒▒▒▒▒     ▒▒
//                      ▒▒▒▒▒▒▒░     ▒     ▒▒
//                  ▒▒▒▒▒▒           ▒     ▒▒
//             ▓▒▒▒       ▒        ▒▒▒▒▒▒▒▒▒▒▒
//   ▒▒▒▒▒▒▒▒▒▒▒ ▒        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
//   ▒  ▒       ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░
//   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒▒▒▒▒▒▒▒
//   ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒
//    ▒▒▒▒▒         ▒▒▒▒▒▒▒
//                 ▒▒▒▒▒▒▒▒▒
//                ▒▒▒▒▒ ▒▒▒▒▒
//               ░▒▒▒▒   ▒▒▒▒▓      ████████╗██████╗ ███████╗███╗   ██╗██████╗  ██████╗ ███████╗ ██████╗ ██████╗ ██████╗ ███████╗
//              ▓▒▒▒▒     ▒▒▒▒      ╚══██╔══╝██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
//              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        ██║   ██████╔╝█████╗  ██╔██╗ ██║██║  ██║██║   ██║███████╗██║     ██║   ██║██████╔╝█████╗
//             ▒▒▒▒▒       ▒▒▒▒▒       ██║   ██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║██║   ██║╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝
//            ▒▒▒▒▒         ▒▒▒▒▒      ██║   ██║  ██║███████╗██║ ╚████║██████╔╝╚██████╔╝███████║╚██████╗╚██████╔╝██║     ███████╗
//             ▒▒             ▒
//
describe_indicator('iZigzag [Trendoscope]', 'price', { shortName: 'iZG [Trendoscope]' });

const theme = input('Theme', 'dark', ['dark', 'light'])
const length = input('Length', 8, { min: 3, max: 200 })
const source = input('Source', 'highlow', ['highlow', 'close'])
const highlight = input('Highlight Level', 1, {min : 1, max: 20})
const highSource = source === 'close'? close : high;
const lowSource = source === 'close'? close : low;

const highestPivot = highest(highSource, length);
const lowestPivot = lowest(lowSource, length);

const randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const hslToHex = function (h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

const getRandomColor = function(theme, highlight=true){
    const min = theme === 'dark'? 60 : 0
    const max = theme === 'dark'? 100 : 40
    const h = Math.floor(Math.random() * 360);
    const sMax = 100
    const sMin = 70
    const s = Math.floor(Math.random() * (sMax - sMin + 1) + sMin)
    const l = Math.floor(Math.random() * (max - min + 1) + min)
    const opacity = Math.round(Math.min(Math.max(highlight?1:0.4 || 1, 0), 1) * 255);
    //return `hsl(${h}deg, ${s}%, ${l}%)`
    return hslToHex(h, s, l) + opacity.toString(16).toUpperCase();
}

const zigzagPivots = [
    {
        price : highSource[0],
        bar : 0,
        direction: 1
    },
    {
        price : lowSource[0],
        bar : 0,
        direction: -1
    }
];

const zigzagObj = {
    pivots : zigzagPivots,
    level : 1
}

const createLine = function(series, from, to){
    const start = from.bar < to.bar ? from : to
    const end = from.bar < to.bar? to : from
    if(from.bar !== to.bar && start.bar >=0){
        let arr = Array(end.bar - start.bar+1).fill(null)
        arr[0] = from.price
        arr[arr.length-1] = to.price
        arr = interpolate_sparse_series(arr)
        arr.forEach((value, index) => {
            series[start.bar+index] = value
        })
    }
    return series
}

const drawZigzag = function(zigzagObj, highlight = true){
    const zigzagLines = series_of(null)
    for(let index=1;index <zigzagObj.pivots.length; index++){
        createLine(zigzagLines, zigzagObj.pivots[index], zigzagObj.pivots[index-1])
    }
    paint(zigzagLines, 'Zigzag'+zigzagObj.level, getRandomColor(theme, highlight),
        highlight? 'line' : 'dotted')
}

const addNewPivot = function(arr, pivot){
    const llast = arr.length >=2 ? arr[1] : null
    const dir = Math.sign(pivot.direction)
    pivot.direction = arr.length >= 2 && dir * pivot.price > dir * llast.price ? dir * 2 : dir
    arr.unshift(pivot)
};

const nextLevel = function(zigzagObj){
    const nextLevel = {
        pivots : [],
        level : zigzagObj.level+1
    }
    if(zigzagObj.pivots.length > 0){
        let tempBullishPivot = null
        let tempBearishPivot = null
        for(let index = zigzagObj.pivots.length-1; index >=0; index--){
            const pivot = Object.assign({}, zigzagObj.pivots[index])
            const dir = pivot.direction
            const newDir = Math.sign(dir)
            const value = pivot.price
            pivot.level = pivot.level + 1
            pivot.componentIndex = index
            if(nextLevel.pivots.length > 0){
                const lastPivot = nextLevel.pivots[0]
                const lastDir = Math.sign(lastPivot.direction)
                const lastValue = lastPivot.price
                if(Math.abs(dir) === 2){
                    if(lastDir === newDir){
                        if(dir*lastValue < dir*value){
                            nextLevel.pivots.shift()
                        }else{
                            const tempPivot = newDir > 0? tempBearishPivot : tempBullishPivot
                            if(tempPivot !== null){
                                addNewPivot(nextLevel.pivots, tempPivot)
                            }else{
                                continue
                            }
                        }
                    }else{
                        const tempFirstPivot = newDir > 0? tempBullishPivot : tempBearishPivot
                        const tempSecondPivot = newDir > 0? tempBearishPivot : tempBullishPivot
                        if( tempFirstPivot !== null && tempSecondPivot !== null){
                            const tempVal = tempFirstPivot.price
                            const val = pivot.price
                            if(newDir*tempVal > newDir*val){
                                addNewPivot(nextLevel.pivots, tempFirstPivot)
                                addNewPivot(nextLevel.pivots, tempSecondPivot)
                            }
                        }
                    }
                    addNewPivot(nextLevel.pivots, pivot)
                    tempBullishPivot = null
                    tempBearishPivot = null
                }else{
                    if(newDir > 0){
                        tempBullishPivot = pivot
                    }else{
                        tempBearishPivot = pivot
                    }
                }
            }else if(Math.abs(dir) === 2){
                addNewPivot(nextLevel.pivots, pivot)
            }
        }
    }
    if(nextLevel.pivots.length >= zigzagObj.pivots.length){
        nextLevel.pivots.clear()
    }
    return nextLevel
}

for(let index=0; index < high.length; index++){
    const lastPivot = zigzagObj.pivots[0]
    const llastPivot = zigzagObj.pivots[1]
    const pDir = Math.sign(lastPivot.direction)
    const shortHigh = highSource.slice(index+1-length, index+1)
    const shortLow = lowSource.slice(index+1-length, index+1)
    const lastHighBar = length - shortHigh.lastIndexOf(highestPivot[index]) - 1
    const lastLowBar = length - shortLow.lastIndexOf(lowestPivot[index]) - 1

    const forceDoublePivot = pDir === 1 && lastLowBar === 0 ? lowestPivot[index] < llastPivot.price :
        pDir === -1 && lastHighBar === 0 ? highestPivot[index] > llastPivot.price : false
    const distanceFromLastPivot = index - lastPivot.bar
    const overflow = distanceFromLastPivot >= length

    let newPivot = false
    if ((pDir === 1 && lastHighBar === 0) || (pDir === -1 && lastLowBar === 0)){
        const value = pDir === 1 ? highestPivot[index] : lowestPivot[index]
        const removeOld = value * lastPivot.direction >= lastPivot.price * lastPivot.direction
        if(removeOld){
            zigzagObj.pivots.shift()
            let newPivotObject = {
                price : value,
                bar : index,
                direction: pDir,
                level: 1,
            }
            newPivot = true
            addNewPivot(zigzagObj.pivots, newPivotObject)
        }
    }
    if (((pDir === 1 && lastLowBar === 0) || (pDir === -1 && lastHighBar === 0)) && (!newPivot || forceDoublePivot)){
        let newPivotObject = {
            price : pDir === 1 ? lowestPivot[index] : highestPivot[index],
            bar : index,
            direction: -pDir,
            level: 1,
        }
        addNewPivot(zigzagObj.pivots, newPivotObject)
        newPivot = true
    }
    if(overflow && !newPivot){
        let newPivotObject = {
            price : pDir === 1 ? lowestPivot[index] : highestPivot[index],
            bar : pDir === 1 ? index-lastLowBar : index-lastHighBar,
            direction: -pDir,
            level: 1,
        }
        addNewPivot(zigzagObj.pivots, newPivotObject)
        newPivot = true
    }
}
let mlZigzagObj = zigzagObj
while(mlZigzagObj.pivots.length > 3){
    const isHighlight = mlZigzagObj.level === highlight
    drawZigzag(mlZigzagObj, isHighlight)
    mlZigzagObj = nextLevel(mlZigzagObj)
}
