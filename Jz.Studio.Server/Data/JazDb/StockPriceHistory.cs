using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class StockPriceHistory
{
    public int Id { get; set; }

    public DateTime Timestamp { get; set; }

    public string Ticker { get; set; } = null!;

    public DateTime Date { get; set; }

    public decimal Open { get; set; }

    public decimal High { get; set; }

    public decimal Low { get; set; }

    public decimal Close { get; set; }

    public int Volume { get; set; }
}
