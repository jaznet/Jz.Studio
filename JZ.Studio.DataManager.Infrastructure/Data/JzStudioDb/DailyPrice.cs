using System;
using System.Collections.Generic;

namespace JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;

public partial class DailyPrice
{
    public long DailyPriceId { get; set; }

    public int SecurityId { get; set; }

    public DateOnly TradeDate { get; set; }

    public decimal Open { get; set; }

    public decimal High { get; set; }

    public decimal Low { get; set; }

    public decimal Close { get; set; }

    public long Volume { get; set; }

    public long? ImportBatchId { get; set; }

    public virtual ImportBatch? ImportBatch { get; set; }

    public virtual Security Security { get; set; } = null!;
}
