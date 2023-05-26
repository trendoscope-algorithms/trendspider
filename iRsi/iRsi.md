# iRsi [Trendoscope]

The Relative Strength Index (RSI) is a popular technical indicator used by traders and investors to assess the strength and momentum of price movements in financial markets. It is primarily used to identify potential overbought and oversold conditions in an asset.

The RSI indicator is plotted as a line that oscillates between 0 and 100 on a separate chart below the price chart. The RSI calculation is based on the average gains and losses over a specified period, typically 14 periods. The formula compares the magnitude of recent price gains to recent price losses and generates a value between 0 and 100.

## Classical interpretation
When the RSI value approaches or exceeds 70, it is often interpreted as an indication that the asset may be overbought, meaning its price has risen too far, too fast, and a potential reversal or corrective pullback could occur. Conversely, when the RSI value approaches or falls below 30, it suggests the asset may be oversold, implying that the price has declined too far, too fast, and a potential upward reversal or bounce may be imminent.

Issue with this interpretation is that in strong trending markets, the overbought and oversold areas may go untouched for prolonged period of time. Due to this, it makes it impossible to spot pullbacks using RSI static overbought and oversold interpretation

## Dynamic Oversold and Overbought areas
In this custom indicator, we look to resolve the issue of static overbought and oversold regions by dynamically calculating them.

### Process
Here are the steps to derive the dynamic overbought and oversold levels
* Calculate the highest and lowest of RSI in last N bars. The length for calculation of highest and lowest value can be different to that of RSI length.
* Apply range calculation method on high and low of RSI to derive dynamic overbought and oversold levels. Range calculation methods include variety of moving averages and option to use highlow
    * When highlow option is used highest of low RSI becomes oversold and lowest of high RSI becomes overbought level
    * When other moving average types are used, then moving average of high RSI becomes overbought and moving average of low RSI becomes oversold level
* HighLow calculation length can be altered based on the intended trade duration. Higher value will yield the levels close to borders (80-100 and 0-20 range) and offers less variation over period of time. Shorter HighLow length produces dynamic overbought oversold levels which can vary a lot - even towards 40-60 range
