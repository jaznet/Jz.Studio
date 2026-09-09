using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed record TrendLineAnalysisResult(
    IReadOnlyList<SwingPoint> SwingPoints,
    IReadOnlyList<TrendLineEvaluation> Evaluations,
    TrendLineSelection Selection);
