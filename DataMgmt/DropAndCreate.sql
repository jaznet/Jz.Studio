DROP TABLE IF EXISTS Market.DailyPrice;
DROP TABLE IF EXISTS Market.Security;
DROP TABLE IF EXISTS SystemData.ImportBatch;
GO

CREATE TABLE SystemData.ImportBatch (
    ImportBatchId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SourceName NVARCHAR(100) NOT NULL,
    FileName NVARCHAR(260) NOT NULL,
    StartedAt DATETIME2 NOT NULL,
    CompletedAt DATETIME2 NULL,
    Status NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Market.DailyPrice (
    DailyPriceId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Ticker NVARCHAR(20) NOT NULL,
    TradeDate DATE NOT NULL,
    [Open] DECIMAL(18,6) NOT NULL,
    High DECIMAL(18,6) NOT NULL,
    Low DECIMAL(18,6) NOT NULL,
    [Close] DECIMAL(18,6) NOT NULL,
    Volume BIGINT NOT NULL,
    ImportBatchId BIGINT NULL,

    CONSTRAINT FK_DailyPrice_ImportBatch
        FOREIGN KEY (ImportBatchId)
        REFERENCES SystemData.ImportBatch(ImportBatchId)
);
GO

CREATE UNIQUE INDEX UX_DailyPrice_Ticker_TradeDate
ON Market.DailyPrice (Ticker, TradeDate);
GO