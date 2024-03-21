using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class CountyStat
{
    public int Id { get; set; }

    public string FipsCounty { get; set; } = null!;

    public string? Statefp { get; set; }

    public string? Countyfp { get; set; }

    public string? Countyns { get; set; }

    public string? Affgeoid { get; set; }

    public string? Geoid { get; set; }

    public string? Name { get; set; }

    public string? Lsad { get; set; }

    public long? Aland { get; set; }

    public long? Awater { get; set; }

    public DateTime Timestamp { get; set; }
}
