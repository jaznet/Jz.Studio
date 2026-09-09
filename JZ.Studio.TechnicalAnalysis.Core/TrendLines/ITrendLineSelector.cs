namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public interface ITrendLineSelector
{
    TrendLineSelection Select(
        IReadOnlyList<TrendLineEvaluation> evaluations);
}
