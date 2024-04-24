using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class FederalElection
{
    public string? Year { get; set; }

    public string? State { get; set; }

    public string? StatePo { get; set; }

    public string? CountyName { get; set; }

    public string? CountyFips { get; set; }

    public string? Office { get; set; }

    public string? Candidate { get; set; }

    public string? Party { get; set; }

    public string? Candidatevotes { get; set; }

    public string? Totalvotes { get; set; }

    public string? Version { get; set; }

    public string? Mode { get; set; }

    public string? StateFips { get; set; }
}
