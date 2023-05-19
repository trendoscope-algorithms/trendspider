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
describe_indicator('iSupertrend [Trendoscope]', 'price', { shortName: 'iST [Trendoscope]' });
const type = input('Range Type', 'Ladder TR', ['Ladder TR', 'PlusMinus Range', 'True Range'])
const appliedCalculation = input('Applied Calculation', 'max', ['average', 'max'])
const length = input('Length', 20, { min: 10});
const multiplier = input('Multiplier', 4, {min: 0.5})
const reference = input('Reference', 'high/low', ['high/low', 'close'])
const waitForClose = input('Wait For Close', 'true', ['true', 'false'])

const atrDiff = mult(atr(length), multiplier)

let longDiff = null
let shortDiff = null
let longStop = null
let shortStop = null
let direction = 1

const supertrend = series_of(null)
const trendColor = series_of('red')

const longAtr = series_of(null)
const shortAtr = series_of(null)

const redCandles = []
const greenCandles = []

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
const lpush = function(arr, val, size){
    arr.push(val)
    if(arr.length > size)
        arr.shift()
};

for (let index = 1; index < high.length; index++) {
    const tr = Math.max(
        Math.abs(high[index]-low[index]),
        Math.abs(high[index]-close[index-1]),
        Math.abs(low[index]-close[index-1])
    )
    const plusRange = Math.max(
        high[index] - open[index],
        high[index] - close[index-1]
    )
    const minusRange = Math.max(
        open[index] - low[index],
        close[index-1] - low[index]
    )

    if(type === 'Ladder TR'){
        if(close[index] > close[index-1] || high[index] > high[index-1] || close[index] > open[index]){
            lpush(greenCandles, tr, length)
        }

        if(close[index] < close[index-1] || low[index] < low[index-1] || close[index] < open[index]){
            lpush(redCandles, tr, length)
        }
    }
    if(type === 'True Range'){
        lpush(greenCandles, tr, length)
        lpush(redCandles, tr, length)
    }
    if(type === 'PlusMinus Range'){
        lpush(greenCandles, plusRange, length)
        lpush(redCandles, minusRange, length)
    }

    longAtr[index] = redCandles.length < length? atrDiff[index] : average(redCandles)*multiplier
    shortAtr[index] = greenCandles.length < length?  atrDiff[index] : average(greenCandles)*multiplier

    longDiff = index > 1 && direction > 0 && longDiff != null ? Math.min(longDiff, longAtr[index]) : longAtr[index]
    shortDiff = index > 1 && direction < 0 && longDiff != null ? Math.min(shortDiff, shortAtr[index]) : shortAtr[index]

    const longStopCurrent =  (reference === 'close'? close[index] : low[index]) - longDiff
    longStop = index > 1 && direction > 0 && longStop != null? Math.max(longStop,longStopCurrent) : longStopCurrent

    const shortStopCurrent =  (reference === 'close'? close[index] : high[index]) + shortDiff
    shortStop = index > 1 && direction < 0 && shortStop != null? Math.min(shortStop,shortStopCurrent) : shortStopCurrent

    const longValue = waitForClose === 'true'? close[index] : low[index]
    const shortValue = waitForClose === 'true'? close[index] : high[index]

    direction = (direction === 1 && longValue <= longStop) ? -1 : (direction === -1 && shortValue >= shortStop) ? 1 : direction

    supertrend[index] = direction> 0? longStop : shortStop
    trendColor[index] = direction > 0? 'red': 'green'
}

paint(supertrend, 'Supertrend', trendColor);
