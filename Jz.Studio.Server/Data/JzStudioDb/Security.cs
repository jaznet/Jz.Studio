using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JzStudioDb;

public partial class Security
{
    public int SecurityId { get; set; }

    public string Symbol { get; set; } = null!;

    public string? Exchange { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<DailyPrice> DailyPrices { get; set; } = new List<DailyPrice>();
}
