namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed class TrendLineSelector : ITrendLineSelector
{
    public TrendLineSelection Select(
        IReadOnlyList<TrendLineEvaluation> evaluations)
    {
        ArgumentNullException.ThrowIfNull(evaluations);

        return new TrendLineSelection(
            Best(evaluations, TrendLineType.Support),
            Best(evaluations, TrendLineType.Resistance));
    }

    private static TrendLineEvaluation? Best(
        IReadOnlyList<TrendLineEvaluation> evaluations,
        TrendLineType type)
    {
        return evaluations
            .Where(evaluation => evaluation.Candidate.Type == type)
            .OrderByDescending(evaluation => evaluation.Score)
            .ThenBy(evaluation => evaluation.ViolationCount)
            .ThenByDescending(evaluation => evaluation.TouchCount)
            .ThenBy(evaluation => evaluation.BarsSinceLastAnchor)
            .ThenByDescending(evaluation => evaluation.Candidate.End.BarIndex)
            .ThenByDescending(evaluation => evaluation.Candidate.Start.BarIndex)
            .FirstOrDefault();
    }
}
