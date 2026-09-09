namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed record TrendLineScoringSettings
{
    public decimal TouchToleranceRatio { get; init; } = 0.005m;

    public decimal ViolationToleranceRatio { get; init; } = 0.005m;

    public decimal TouchWeight { get; init; } = 10m;

    public decimal ViolationPenalty { get; init; } = 25m;

    public decimal RecencyPenaltyPerBar { get; init; } = 0.1m;

    public decimal ProximityPenalty { get; init; } = 100m;
}
