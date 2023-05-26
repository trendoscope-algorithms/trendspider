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
describe_indicator('iSupertrend [Trendoscope]', 'price', { shortName: 'iST [Trendoscope]' });
const type = input('Range Type', 'Ladder TR', ['Ladder TR', 'PlusMinus Range', 'True Range'])
const appliedCalculation = input('Applied Calculation', 'sma', [...constants.ma_types, 'highest'])
const useDiminishingStopDiff = input('Diminishing Stop Distance', 'true', ['true', 'false'])
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
const bullishLabel = series_of(null)
const bearishLabel = series_of(null)

const redCandles = series_of(null)
const greenCandles = series_of(null)

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
            greenCandles[index] = tr
        }else{
            greenCandles[index] = greenCandles[index-1]
        }
        if(close[index] < close[index-1] || low[index] < low[index-1] || close[index] < open[index]){
            redCandles[index]=tr
        }else{
            redCandles[index] = redCandles[index-1]
        }
    }
    if(type === 'True Range'){
        greenCandles[index] = tr
        redCandles[index] = tr
    }
    if(type === 'PlusMinus Range'){
        greenCandles[index] = plusRange
        redCandles[index] = minusRange
    }
}

const longAtr = mult(indicators[appliedCalculation](redCandles, length), multiplier)
const shortAtr = mult(indicators[appliedCalculation](greenCandles, length), multiplier)

for (let index = 1; index < high.length; index++) {
    longDiff = index > 1 && direction > 0 && longDiff != null && useDiminishingStopDiff === 'true' ? Math.min(longDiff, longAtr[index]) : longAtr[index]
    shortDiff = index > 1 && direction < 0 && shortDiff != null && useDiminishingStopDiff === 'true' ? Math.min(shortDiff, shortAtr[index]) : shortAtr[index]

    const longStopCurrent =  (reference === 'close'? close[index] : low[index]) - longDiff
    longStop = index > 1 && direction > 0 && longStop != null? Math.max(longStop,longStopCurrent) : longStopCurrent

    const shortStopCurrent =  (reference === 'close'? close[index] : high[index]) + shortDiff
    shortStop = index > 1 && direction < 0 && shortStop != null? Math.min(shortStop,shortStopCurrent) : shortStopCurrent

    const longValue = waitForClose === 'true'? close[index-1] : low[index-1]
    const shortValue = waitForClose === 'true'? close[index-1] : high[index-1]

    bullishLabel[index] = (direction === -1 && shortValue >= shortStop) ? 'Bullish' : null
    bearishLabel[index] = (direction === 1 && longValue <= longStop) ? 'Bearish' : null
    direction = (direction === 1 && longValue <= longStop) ? -1 : (direction === -1 && shortValue >= shortStop) ? 1 : direction

    supertrend[index] = direction> 0? longStop : shortStop
    trendColor[index] = direction > 0? 'red': 'green'
}

paint(supertrend, 'Supertrend', trendColor, 'line');
paint(bullishLabel, 'Bullish', 'green', 'labels_above')
paint(bearishLabel, 'Bearish', 'red', 'labels_below')
