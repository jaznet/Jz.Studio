using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class FederalElectionsState
{
    public string? Year { get; set; }

    public string? State { get; set; }

    public string? StatePo { get; set; }

    public string? StateFips { get; set; }

    public string? StateCen { get; set; }

    public string? StateIc { get; set; }

    public string? Office { get; set; }

    public string? Candidate { get; set; }

    public string? PartyDetailed { get; set; }

    public string? Writein { get; set; }

    public string? Candidatevotes { get; set; }

    public string? Totalvotes { get; set; }

    public string? Version { get; set; }

    public string? Notes { get; set; }

    public string? PartySimplified { get; set; }
}
