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
describe_indicator('iRSI [Trendoscope]', 'lower', { shortName: 'iRSI [Trendoscope]' });
const source = input('Source', 'close', constants.price_source_options);
const length = input('Length', 14, {min: 10})
const rangeLength = input('High/Low Reference Length', 28, {min: 10})
const maType = input('Range Method', 'sma', constants.ma_types.concat('highlow'));

const rsiVal = rsi(prices[source], length)

const rsiHigh = highest(rsiVal, rangeLength)
const rsiLow = lowest(rsiVal, rangeLength)

const overbought = maType === 'highlow' ? lowest(rsiHigh, rangeLength):indicators[maType](rsiHigh, rangeLength)
const oversold = maType === 'highlow' ? highest(rsiLow, rangeLength):indicators[maType](rsiLow, rangeLength)
paint(rsiVal, 'RSI', 'cyan')
paint(overbought, 'Overbought', 'green')
paint(oversold, 'Oversold', 'red')
