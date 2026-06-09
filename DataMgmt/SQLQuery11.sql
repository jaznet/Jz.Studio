SELECT 
    s.Symbol,
    COUNT(*) AS PriceRows,
    MIN(dp.TradeDate) AS FirstDate,
    MAX(dp.TradeDate) AS LastDate
FROM Market.DailyPrice dp
JOIN Market.Security s
    ON s.SecurityId = dp.SecurityId
WHERE s.Symbol = 'NVDA'
GROUP BY s.Symbol;