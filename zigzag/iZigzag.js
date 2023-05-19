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

const length = input('Length', 8, { min: 3, max: 200 })
const source = input('Source', 'highlow', ['highlow', 'close'])

const highSource = source === 'close'? close : high;
const lowSource = source === 'close'? close : low;

const highestPivot = highest(highSource, length);
const lowestPivot = lowest(lowSource, length);

const customSeries = series_of(null)

let zigzagPivots = [
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

const addNewPivot = function(arr, pivot){
    const last = arr[0]
    const llast = arr.length >=2 ? arr[1] : null
    const dir = Math.sign(pivot.direction)
    const newDir = arr.length >=2 && dir * pivot.price > dir * llast.price ? dir*2 : dir
    pivot.direction = dir
    arr.unshift(pivot)
};

for(let index=0; index < high.length; index++){
    const lastPivot = zigzagPivots[0]
    const llastPivot = zigzagPivots[1]
    const pDir = Math.sign(lastPivot.direction)
    const shortHigh = highSource.slice(index+1-length, index+1)
    const shortLow = lowSource.slice(index+1-length, index+1)
    const lastHighBar = length - shortHigh.lastIndexOf(highestPivot[index]) - 1
    const lastLowBar = length - shortLow.lastIndexOf(lowestPivot[index]) - 1

    const forceDoublePivot = pDir === 1 && lastLowBar === 0 ? lowestPivot[index] < llastPivot.price :
        pDir === -1 && lastHighBar === 0 ? highestPivot[index] > llastPivot.price : false
    const distanceFromLastPivot = index - lastPivot.bar
    const overflow = distanceFromLastPivot >= length

    let type = 0
    let newPivot = false
    if ((pDir === 1 && lastHighBar === 0) || (pDir === -1 && lastLowBar === 0)){
        const value = pDir === 1 ? highestPivot[index] : lowestPivot[index]
        const removeOld = value * lastPivot.direction >= lastPivot.price * lastPivot.direction
        if(removeOld){
            zigzagPivots.shift()
            let newPivotObject = {
                price : value,
                bar : index,
                direction: pDir,
                type: 1,
                forceDoublePivot:forceDoublePivot,
                pDir:pDir,
                lastHighBar:lastHighBar,
                lastLowBar:lastLowBar,
                index:index
            }
            newPivot = true
            addNewPivot(zigzagPivots, newPivotObject)
        }
    }
    if (((pDir === 1 && lastLowBar === 0) || (pDir === -1 && lastHighBar === 0)) && (!newPivot || forceDoublePivot)){
        console.log(index)
        let newPivotObject = {
            price : pDir === 1 ? lowestPivot[index] : highestPivot[index],
            bar : index,
            direction: -pDir,
            type: 2,
            forceDoublePivot:forceDoublePivot,
            pDir:pDir,
            lastHighBar:lastHighBar,
            lastLowBar:lastLowBar,
            index:index
        }
        addNewPivot(zigzagPivots, newPivotObject)
        newPivot = true
    }
    if(overflow && !newPivot){
        let newPivotObject = {
            price : pDir === 1 ? lowestPivot[index] : highestPivot[index],
            bar : pDir === 1 ? index-lastLowBar : index-lastHighBar,
            direction: -pDir,
            type: 3,
            forceDoublePivot:forceDoublePivot,
            pDir:pDir,
            lastHighBar:lastHighBar,
            lastLowBar:lastLowBar,
            index:index
        }
        addNewPivot(zigzagPivots, newPivotObject)
        newPivot = true
    }
}
const zigzagLines = series_of(null)
const zigzagLabel = series_of(null)
console.log(zigzagPivots)
zigzagPivots.forEach(pivot => zigzagLines[pivot.bar] = pivot.price)
zigzagPivots.forEach(pivot => zigzagLabel[pivot.bar] = {
    type:pivot.type,
    forceDoublePivot:pivot.forceDoublePivot,
    pDir:pivot.pDir,
    lastHighBar:pivot.lastHighBar,
    lastLowBar:pivot.lastLowBar,
    index:pivot.index
})
paint(interpolate_sparse_series(zigzagLines), 'Zigzag', 'yellow');
paint(zigzagLabel, 'Label', 'orange')
