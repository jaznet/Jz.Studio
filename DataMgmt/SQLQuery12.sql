SELECT COUNT(*) AS DailyPriceRows
FROM Market.DailyPrice;

SELECT 
    TradeDate,
    COUNT(*) AS RowsForDate
FROM Market.DailyPrice
GROUP BY TradeDate
ORDER BY TradeDate;