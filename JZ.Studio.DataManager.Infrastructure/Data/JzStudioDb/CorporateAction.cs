namespace JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;

public partial class CorporateAction {
    public long CorporateActionId { get; set; }

    public string Ticker { get; set; } = null!;

    public string ExchangeCode { get; set; } = null!;

    public string ActionType { get; set; } = null!;

    public DateOnly ActionDate { get; set; }

    public DateOnly? PaymentDate { get; set; }

    public string? Ratio { get; set; }

    public decimal? Multiplier { get; set; }

    public decimal? Amount { get; set; }

    public string? Source { get; set; }

    public long? ImportBatchId { get; set; }

    public virtual ImportBatch? ImportBatch { get; set; }
}
