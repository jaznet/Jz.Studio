using System;
using System.Collections.Generic;

namespace Jz.Studio.Server.Data.JazDb;

public partial class FederalBudget
{
    public short? AgencyCode { get; set; }

    public string? AgencyName { get; set; }

    public short? BureauCode { get; set; }

    public string? BureauName { get; set; }

    public int? AccountCode { get; set; }

    public string? AccountName { get; set; }

    public short? TreasuryAgencyCode { get; set; }

    public short? SubfunctionCode { get; set; }

    public string? SubfunctionTitle { get; set; }

    public string? BeaCategory { get; set; }

    public string? GrantNonGgrantSplit { get; set; }

    public string? OnOffBudget { get; set; }

    public short? Year { get; set; }

    public int? Amount { get; set; }
}
