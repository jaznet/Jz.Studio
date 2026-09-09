using JZ.Studio.TechnicalAnalysis.Core.MarketData;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed class TrendLineCandidateEvaluator : ITrendLineCandidateEvaluator
{
    private readonly TrendLineScoringSettings _settings;

    public TrendLineCandidateEvaluator(TrendLineScoringSettings? settings = null)
    {
        _settings = settings ?? new TrendLineScoringSettings();
        Validate(_settings);
    }

    public TrendLineEvaluation Evaluate(
        TrendLineCandidate candidate,
        IReadOnlyList<PriceBar> bars)
    {
        ArgumentNullException.ThrowIfNull(candidate);
        ArgumentNullException.ThrowIfNull(bars);

        if (candidate.End.BarIndex >= bars.Count)
        {
            throw new ArgumentException(
                "The candidate anchors must exist within the supplied price bars.",
                nameof(candidate));
        }

        var touchCount = 0;
        var violationCount = 0;

        for (var barIndex = candidate.Start.BarIndex;
             barIndex < bars.Count;
             barIndex++)
        {
            var lineValue = candidate.ValueAt(barIndex);
            var observedValue = ObservedValue(candidate.Type, bars[barIndex]);
            var distanceRatio = DistanceRatio(observedValue, lineValue);

            if (distanceRatio <= _settings.TouchToleranceRatio)
            {
                touchCount++;
            }

            if (IsViolation(candidate.Type, observedValue, lineValue))
            {
                violationCount++;
            }
        }

        var currentBarIndex = bars.Count - 1;
        var currentLineValue = candidate.ValueAt(currentBarIndex);
        var currentDistanceRatio = DistanceRatio(
            bars[currentBarIndex].Close,
            currentLineValue);
        var barsSinceLastAnchor = currentBarIndex - candidate.End.BarIndex;
        var score = CalculateScore(
            touchCount,
            violationCount,
            barsSinceLastAnchor,
            currentDistanceRatio);

        return new TrendLineEvaluation(
            candidate,
            touchCount,
            violationCount,
            barsSinceLastAnchor,
            currentDistanceRatio,
            score);
    }

    private bool IsViolation(
        TrendLineType type,
        decimal observedValue,
        decimal lineValue)
    {
        var tolerance = Math.Abs(lineValue) * _settings.ViolationToleranceRatio;

        return type == TrendLineType.Support
            ? observedValue < lineValue - tolerance
            : observedValue > lineValue + tolerance;
    }

    private decimal CalculateScore(
        int touchCount,
        int violationCount,
        int barsSinceLastAnchor,
        decimal currentDistanceRatio)
    {
        return (touchCount * _settings.TouchWeight)
            - (violationCount * _settings.ViolationPenalty)
            - (barsSinceLastAnchor * _settings.RecencyPenaltyPerBar)
            - (currentDistanceRatio * _settings.ProximityPenalty);
    }

    private static decimal ObservedValue(
        TrendLineType type,
        PriceBar bar)
    {
        return type == TrendLineType.Support ? bar.Low : bar.High;
    }

    private static decimal DistanceRatio(decimal value, decimal reference)
    {
        return reference == 0
            ? Math.Abs(value - reference)
            : Math.Abs(value - reference) / Math.Abs(reference);
    }

    private static void Validate(TrendLineScoringSettings settings)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(settings.TouchToleranceRatio);
        ArgumentOutOfRangeException.ThrowIfNegative(settings.ViolationToleranceRatio);
        ArgumentOutOfRangeException.ThrowIfNegative(settings.TouchWeight);
        ArgumentOutOfRangeException.ThrowIfNegative(settings.ViolationPenalty);
        ArgumentOutOfRangeException.ThrowIfNegative(settings.RecencyPenaltyPerBar);
        ArgumentOutOfRangeException.ThrowIfNegative(settings.ProximityPenalty);
    }
}
