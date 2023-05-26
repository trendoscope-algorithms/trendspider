[![Trendoscope](https://docs.trendoscope.io/media/posts/44/logo-no-background.svg)](https://trendoscope.io)
# iSupertrend [Trendoscope]

Supertrend is a popular technical indicator used by traders to identify potential trend reversals and determine entry and exit points in financial markets. It is a trend-following indicator that combines price and volatility to generate its signals. Generally supertrend is calculated based on ATR and multiplier value which is used for calculation of stops. In these adaptions, we look to provide few variations to classical methods.

## Classic Supertrend

In general supertrend is based on regular ATR(Average True Range) stoploss. The calculation of ATR goes as below

```
True Range = Max( (high-low), (high-close[1]), (close[1]-low))
ATR = MA( TR, length )
Long Stop Distance = ATR * Multiplier
Short Stop Distance = ATR * Multiplier
```
## Variations
Below are the variations adapted in this indicator.
### Alternatives to True Range
Other than using TR for calculation of ATR and this stoploss distance, there are few other options which we can consider. Those are
+ **Ladder TR** - Ladder TR is same as TR. But, instead of having a common true range for both sides, Ladder TR calculates separate range for green and red candles. And by this, separate ATRs are calculated for red and green candles. While calculating the stop, red ATR is used for calculation of long stop and green ATR is used for calculation of short stop.
```
Green TR Array = TR array of green Candles
Red TR Array = TR array of red Candles

Green ATR = Moving average applied to last N items on Green TR Array
Red ATR = Moving average applied to last N items on Red TR Array

Long Stop Distance = Red ATR * Multiplier
Short Stop Distance = Green ATR * Multiplier
```
+ **Plus Minus Range** - Similar concept as that of Ladder True Range. But, instead of separating green and red candle range separately, in this method we calculate upside range and downside range separately for each candle.
```
Plus Range = Max( (high-open), (high-close[1]) )
Minus Range = Max( (open-low), (close[1]-low) )

Plus ATR = MA (Plus Range, length)
Minus ATR = MA (Minus Range, length)

Long Stop Distance = Minus ATR * Multiplier
Short Stop Distance = Plus ATR * Multiplier 
```
+ Other options
We can also consider things such as standard deviation, plus/minus standard deviation, or ladder deviations instead of using range based metrics. However, we have not done this implementation as part of this indicator yet.

### Applied calculation on true range
In general, average value of TR is considered for calculation of stop distance. Alternatively, we can explore following options.
1. Moving Average Types - Instead of SMA - which is simple average, we can check other types of moving averages.
2. Another less popular option is to use Max value of TR range in last N periods instead of using an average

In either case, the calculations are simple and straightforward.

### Diminishing Stop Distance
When this option is enabled, the distance between the reference price and stop can only reduce when in the direction of trend. This option can work as semi parabolic SAR. Distance between stop and close is not reduced unless there is actual reduction in volatility. But, once the volatility is reduced, the stop distance will not increase again if volatility bounces back.

```
Current Long Stop = (ATR/Red ATR/Minus ATR)*Multiplier
Long Stop Distance = if bullish, least of existing Long Stop Distance and new Long Stop Distance. Else, new long stop distance.

Current Short Stop = (ATR/Green ATR/Plus ATR)*Multiplier
Short Stop Distance = if bearish, least of existing short stop distance and new short stop distance. Else, new short stop distance.
```

## Other important input parameters
### Reference
Reference tells the indicator whether to calculate the stop on the bases of high/low prices or close price. If high/low is selected, long stop is calculated with respect to low and short stop is calculated with respect to high

### Wait For Close
If selected, the change of supertrend direction will only be done based on close prices. Otherwise, high/low prices are used for calculating the change of direction.
