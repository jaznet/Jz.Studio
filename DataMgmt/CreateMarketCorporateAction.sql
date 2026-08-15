IF OBJECT_ID(N'[Market].[CorporateAction]', N'U') IS NULL
BEGIN
    CREATE TABLE [Market].[CorporateAction]
    (
        [CorporateActionId] BIGINT IDENTITY(1, 1) NOT NULL,
        [Ticker] NVARCHAR(20) NOT NULL,
        [ExchangeCode] NVARCHAR(20) NOT NULL,
        [ActionType] NVARCHAR(20) NOT NULL,
        [ActionDate] DATE NOT NULL,
        [PaymentDate] DATE NULL,
        [Ratio] NVARCHAR(30) NULL,
        [Multiplier] DECIMAL(18, 8) NULL,
        [Amount] DECIMAL(18, 6) NULL,
        [Source] NVARCHAR(100) NULL,
        [ImportBatchId] BIGINT NULL,

        CONSTRAINT [PK_CorporateAction]
            PRIMARY KEY ([CorporateActionId]),

        CONSTRAINT [CK_CorporateAction_ActionType]
            CHECK ([ActionType] IN (N'Split', N'Dividend')),

        CONSTRAINT [FK_CorporateAction_ImportBatch]
            FOREIGN KEY ([ImportBatchId])
            REFERENCES [SystemData].[ImportBatch] ([ImportBatchId])
    );

    CREATE UNIQUE INDEX [UX_CorporateAction_Identity]
        ON [Market].[CorporateAction]
        (
            [ExchangeCode],
            [Ticker],
            [ActionType],
            [ActionDate]
        );

    CREATE INDEX [IX_CorporateAction_Ticker_ActionDate]
        ON [Market].[CorporateAction] ([Ticker], [ActionDate]);
END;
