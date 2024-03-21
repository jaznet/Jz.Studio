using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class Election2020
{
    public string? StateName { get; set; }

    public string? CountyFips { get; set; }

    public string? CountyName { get; set; }

    public long? VotesGop { get; set; }

    public long? VotesDem { get; set; }

    public long? TotalVotes { get; set; }

    public long? Diff { get; set; }

    public double? PerGop { get; set; }

    public double? PerDem { get; set; }

    public double? PerPointDiff { get; set; }
}
