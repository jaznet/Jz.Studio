using System;
using System.Collections.Generic;

namespace JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;

public partial class ImportBatch
{
    public long ImportBatchId { get; set; }

    public string SourceName { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public DateTime StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<CorporateAction> CorporateActions { get; set; } = new List<CorporateAction>();

    public virtual ICollection<DailyPrice> DailyPrices { get; set; } = new List<DailyPrice>();
}
