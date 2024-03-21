using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class StockSymbol
{
    public string? Symbol { get; set; }

    public string? Name { get; set; }

    public decimal? LastSale { get; set; }

    public float? NetChange { get; set; }

    public string? Change { get; set; }

    public float? MarketCap { get; set; }

    public string? Country { get; set; }

    public short? IpoYear { get; set; }

    public int? Volume { get; set; }

    public string? Sector { get; set; }

    public string? Industry { get; set; }
}
