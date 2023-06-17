// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
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
describe_indicator('Auto Harmonic Patterns Basic [Trendoscope]', 'price', { shortName: 'AHPv1 [Trendoscope]' });
const length = input('Length', 8, { min: 3, max: 200 })
const source = input('Source', 'highlow', ['highlow', 'close'])
const scale = input('Scale', 'regular', ['regular', 'log'])

const logScale = scale === 'log'

const patterns = [
    "Gartley",
    "Crab",
    "DeepCrab",
    "Bat",
    "Butterfly",
    "Shark",
    "Cypher",
    "5-0",
    "Three Drives",
    "White Swan",
    "Black Swan",
    "121"
]
const isInRange = function(ratio, min, max){
    return ratio >= min && ratio <= max;
}
const evaluate = function(patternArray, index, ratio, min, max, err_min, err_max){
    patternArray[index] = patternArray.at(index) && isInRange(ratio, min*err_min, max*err_max)
}
const scan_xab = function(xabRatio, err_min, err_max, patternArray){
    if(patternArray.includes(true)){
        //Gartley
        evaluate(patternArray, 0, xabRatio, 0.618, 0.618, err_min, err_max)
        //Crab
        evaluate(patternArray, 1, xabRatio, 0.382, 0.618, err_min, err_max)
        //DeepCrab
        evaluate(patternArray, 2, xabRatio, 0.886, 0.886, err_min, err_max)
        //Bat
        evaluate(patternArray, 3, xabRatio, 0.382, 0.500, err_min, err_max)
        //Butterfly
        evaluate(patternArray, 4, xabRatio, 0.786, 0.786, err_min, err_max)
        //Shark
        evaluate(patternArray, 5, xabRatio, 0.446, 0.618, err_min, err_max)
        //Cypher
        evaluate(patternArray, 6, xabRatio, 0.382, 0.618, err_min, err_max)
        //5-0
        evaluate(patternArray, 7, xabRatio, 1.270, 1.618, err_min, err_max)
        //Three Drives
        evaluate(patternArray, 8, xabRatio, 0.618, 0.786, err_min, err_max)
        //White Swan
        evaluate(patternArray, 9, xabRatio, 0.382, 0.786, err_min, err_max)
        //Black Swan
        evaluate(patternArray, 10, xabRatio, 1.382, 2.618, err_min, err_max)
        //121
        evaluate(patternArray, 11, xabRatio, 0.500, 0.786, err_min, err_max)
    }
}

const scan_abc_axc = function(abcRatio, axcRatio, err_min, err_max, patternArray){
    if(patternArray.includes(true)){
        //Gartley
        evaluate(patternArray, 0, abcRatio, 0.382, 0.886, err_min, err_max)
        //Crab
        evaluate(patternArray, 1, abcRatio, 0.382, 0.886, err_min, err_max)
        //DeepCrab
        evaluate(patternArray, 2, abcRatio, 0.382, 0.886, err_min, err_max)
        //Bat
        evaluate(patternArray, 3, abcRatio, 0.382, 0.886, err_min, err_max)
        //Butterfly
        evaluate(patternArray, 4, abcRatio, 0.382, 0.886, err_min, err_max)
        //Shark
        evaluate(patternArray, 5, abcRatio, 1.130, 1.618, err_min, err_max)
        //Cypher
        evaluate(patternArray, 6, axcRatio, 1.130, 1.414, err_min, err_max)
        //5-0
        evaluate(patternArray, 7, abcRatio, 1.168, 2.240, err_min, err_max)
        //Three Drives
        evaluate(patternArray, 8, abcRatio, 1.272, 1.618, err_min, err_max)
        //White Swan
        evaluate(patternArray, 9, abcRatio, 2.000, 4.237, err_min, err_max)
        //Black Swan
        evaluate(patternArray, 10, abcRatio, 0.236, 0.500, err_min, err_max)
        //121
        evaluate(patternArray, 11, abcRatio, 1.128, 3.618, err_min, err_max)
    }
}

const scan_bcd = function(bcdRatio, err_min, err_max, patternArray){
    if(patternArray.includes(true)){
        //Gartley
        evaluate(patternArray, 0, bcdRatio, 1.272, 1.618, err_min, err_max)
        //Crab
        evaluate(patternArray, 1, bcdRatio, 2.240, 3.618, err_min, err_max)
        //DeepCrab
        evaluate(patternArray, 2, bcdRatio, 2.000, 3.618, err_min, err_max)
        //Bat
        evaluate(patternArray, 3, bcdRatio, 1.618, 2.618, err_min, err_max)
        //Butterfly
        evaluate(patternArray, 4, bcdRatio, 1.618, 2.618, err_min, err_max)
        //Shark
        evaluate(patternArray, 5, bcdRatio, 1.618, 2.236, err_min, err_max)
        //5-0
        evaluate(patternArray, 7, bcdRatio, 0.500, 0.500, err_min, err_max)
        //Three Drives
        evaluate(patternArray, 8, bcdRatio, 0.618, 0.786, err_min, err_max)
        //White Swan
        evaluate(patternArray, 9, bcdRatio, 0.500, 0.886, err_min, err_max)
        //Black Swan
        evaluate(patternArray, 10, bcdRatio, 1.128, 2.000, err_min, err_max)
        //121
        evaluate(patternArray, 11, bcdRatio, 0.388, 0.786, err_min, err_max)
    }
}

const scan_xad_xcd = function(xadRatio, xcdRatio, err_min, err_max, patternArray){
    if(patternArray.includes(true)){
        //Gartley
        evaluate(patternArray, 0, xadRatio, 0.786, 0.786, err_min, err_max)
        //Crab
        evaluate(patternArray, 1, xadRatio, 1.618, 1.618, err_min, err_max)
        //DeepCrab
        evaluate(patternArray, 2, xadRatio, 1.618, 1.618, err_min, err_max)
        //Bat
        evaluate(patternArray, 3, xadRatio, 0.886, 0.886, err_min, err_max)
        //Butterfly
        evaluate(patternArray, 4, xadRatio, 1.272, 1.618, 1, 1)
        //Shark
        evaluate(patternArray, 5, xadRatio, 0.886, 0.886, err_min, err_max)
        //Cypher
        evaluate(patternArray, 6, xcdRatio, 0.786, 0.786, err_min, err_max)
        //5-0
        evaluate(patternArray, 7, xadRatio, 0.886, 1.130, 1, 1)
        //Three Drives
        evaluate(patternArray, 8, xadRatio, 0.130, 0.886, 1, 1)
        //White Swan
        evaluate(patternArray, 9, xadRatio, 0.230, 0.886, 1, 1)
        //Black Swan
        evaluate(patternArray, 10, xadRatio, 1.128, 2.618, 1, 1)
        //121
        evaluate(patternArray, 11, xadRatio, 0.382, 0.786, 1, 1)
    }
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

const retracementRatio = function(a, b, c, logScale=false){
    return logScale? Math.log(c/b)/Math.log(a/b) : (b-c)/(b-a)
}

const addNewPivot = function(arr, pivot){
    const last = arr.length >=2? arr[0] : null
    const llast = arr.length >=2 ? arr[1] : null
    const dir = Math.sign(pivot.direction)
    pivot.direction = arr.length >= 2 && dir * pivot.price > dir * llast.price ? dir * 2 : dir
    pivot.ratio = arr.length >= 2? retracementRatio(llast.price, last.price, pivot.price, logScale) : 1
    arr.unshift(pivot)
};

const createZigzag = function(length, source){
    const highSource = source === 'close'? close : high;
    const lowSource = source === 'close'? close : low;

    const highestPivot = highest(highSource, length);
    const lowestPivot = lowest(lowSource, length);
    const zigzagPivots = [
        {
            price : highSource[0],
            bar : 0,
            direction: 1,
            ratio: 1.0
        },
        {
            price : lowSource[0],
            bar : 0,
            direction: -1,
            ratio: 1.0
        }
    ];

    const zigzagObj = {
        pivots : zigzagPivots,
        level : 1
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
    return zigzagObj;
}

const scanPatterns = function(xabcd, flags= [], defaultEnabled = true, errorThreshold = 8.0, logScale = false){
    const err_min = (100 - errorThreshold) / 100
    const err_max = (100 + errorThreshold) / 100
    const x = xabcd[4].price
    const a = xabcd[3].price
    const b = xabcd[2].price
    const c = xabcd[1].price
    const d = xabcd[0].price
    const xabRatio = retracementRatio(x,a,b,logScale)
    const abcRatio = retracementRatio(a,b,c,logScale)
    const axcRatio = retracementRatio(a,x,c,logScale)
    const bcdRatio = retracementRatio(b,c,d,logScale)
    const xadRatio = retracementRatio(x,a,d,logScale)
    const xcdRatio = retracementRatio(x,c,d,logScale)

    const patternArray=Array.from({length: patterns.length}, i => i = true);

    scan_xab(xabRatio, err_min, err_max, patternArray)
    scan_abc_axc(abcRatio, axcRatio, err_min, err_max, patternArray)
    scan_bcd(bcdRatio, err_min, err_max, patternArray)
    scan_xad_xcd(xadRatio, xcdRatio, err_min, err_max, patternArray)
    return patternArray
}

const zigzag = createZigzag(length, source)

const xaLines = series_of(null)
const abLines = series_of(null)
const bcLines = series_of(null)
const cdLines = series_of(null)
const xbLines = series_of(null)
const bdLines = series_of(null)

const bullishLabels = series_of(null)
const bearishLabels = series_of(null)

for (let dIndex=0; dIndex< zigzag.pivots.length-5; dIndex++){
    const xabcd = zigzag.pivots.slice(dIndex, dIndex+5)
    const currentPatterns = scanPatterns(xabcd)
    if(currentPatterns.includes(true)){
        createLine(xaLines, xabcd[4], xabcd[3])
        createLine(abLines, xabcd[3], xabcd[2])
        createLine(bcLines, xabcd[2], xabcd[1])
        createLine(cdLines, xabcd[1], xabcd[0])

        createLine(xbLines, xabcd[4], xabcd[2])
        createLine(bdLines, xabcd[2], xabcd[0])

        const currentLabels = patterns.filter((item, index)=> currentPatterns[index])

        console.log(currentLabels)
        if(xabcd[0].direction < 0)
            bullishLabels[xabcd[0].bar] = currentLabels
        else
            bearishLabels[xabcd[0].bar] = currentLabels
    }
}

paint(xaLines, 'XA', 'yellow', 'line')
paint(abLines, 'AB', 'yellow', 'line')
paint(bcLines, 'BC', 'yellow', 'line')
paint(cdLines, 'CD', 'yellow', 'line')

paint(xbLines, 'XB', 'yellow', 'line')
paint(bdLines, 'BD', 'yellow', 'line')

paint(bullishLabels, 'Bullish Patterns', 'yellow', 'labels_below')
paint(bearishLabels, 'Bearish Patterns', 'yellow', 'labels_above')
