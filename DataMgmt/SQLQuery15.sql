CREATE UNIQUE INDEX UX_DailyPrice_Ticker_TradeDate
ON Market.DailyPrice (Ticker, TradeDate);
