using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Xunit;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.TrendLines;

public sealed class TrendLineSelectorTests
{
    private readonly TrendLineSelector _selector = new();

    [Fact]
    public void Select_ReturnsHighestScoringSupportAndResistance()
    {
        var weakerSupport = Evaluation(TrendLineType.Support, 20, 0, 2, 3, 1, 3);
        var bestSupport = Evaluation(TrendLineType.Support, 30, 0, 3, 2, 2, 5);
        var bestResistance = Evaluation(TrendLineType.Resistance, 25, 0, 3, 1, 3, 6);
        var weakerResistance = Evaluation(TrendLineType.Resistance, 10, 0, 4, 0, 4, 7);

        var result = _selector.Select(
            [weakerResistance, bestSupport, weakerSupport, bestResistance]);

        Assert.Same(bestSupport, result.Support);
        Assert.Same(bestResistance, result.Resistance);
    }

    [Fact]
    public void Select_UsesQualityAndRecencyToBreakEqualScores()
    {
        var violated = Evaluation(TrendLineType.Support, 20, 1, 5, 0, 1, 3);
        var fewerTouches = Evaluation(TrendLineType.Support, 20, 0, 2, 0, 2, 4);
        var older = Evaluation(TrendLineType.Support, 20, 0, 3, 4, 3, 5);
        var winner = Evaluation(TrendLineType.Support, 20, 0, 3, 1, 4, 6);

        var result = _selector.Select([violated, fewerTouches, older, winner]);

        Assert.Same(winner, result.Support);
    }

    [Fact]
    public void Select_PrefersMostRecentAnchorsWhenMetricsAreEqual()
    {
        var older = Evaluation(TrendLineType.Resistance, 20, 0, 3, 1, 1, 4);
        var newer = Evaluation(TrendLineType.Resistance, 20, 0, 3, 1, 3, 6);

        var result = _selector.Select([older, newer]);

        Assert.Same(newer, result.Resistance);
    }

    [Fact]
    public void Select_ReturnsNullWhenATypeHasNoCandidates()
    {
        var support = Evaluation(TrendLineType.Support, 20, 0, 2, 1, 1, 3);

        var result = _selector.Select([support]);

        Assert.Same(support, result.Support);
        Assert.Null(result.Resistance);
    }

    private static TrendLineEvaluation Evaluation(
        TrendLineType type,
        decimal score,
        int violations,
        int touches,
        int barsSinceLastAnchor,
        int startIndex,
        int endIndex)
    {
        var swingType = type == TrendLineType.Support
            ? SwingPointType.Low
            : SwingPointType.High;
        var candidate = new TrendLineCandidate(
            type,
            Point(startIndex, 10, swingType),
            Point(endIndex, 12, swingType));

        return new TrendLineEvaluation(
            candidate,
            touches,
            violations,
            barsSinceLastAnchor,
            0,
            score);
    }

    private static SwingPoint Point(
        int barIndex,
        decimal value,
        SwingPointType type)
    {
        return new SwingPoint(
            barIndex,
            new DateOnly(2026, 1, 1).AddDays(barIndex),
            value,
            type);
    }
}
