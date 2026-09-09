namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed record TrendLineEvaluation(
    TrendLineCandidate Candidate,
    int TouchCount,
    int ViolationCount,
    int BarsSinceLastAnchor,
    decimal CurrentDistanceRatio,
    decimal Score);
