using JZ.Studio.TechnicalAnalysis.Core.MarketData;
using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Xunit;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.TrendLines;

public sealed class TrendLineCandidateEvaluatorTests
{
    [Fact]
    public void Evaluate_ScoresSupportTouchesAndViolationsFromBarLows()
    {
        var bars = new[]
        {
            Bar(0, high: 14, low: 10, close: 12),
            Bar(1, high: 15, low: 11, close: 13),
            Bar(2, high: 16, low: 12, close: 14),
            Bar(3, high: 17, low: 10, close: 15),
            Bar(4, high: 18, low: 14, close: 14)
        };
        var candidate = Candidate(
            TrendLineType.Support,
            startIndex: 0,
            startValue: 10,
            endIndex: 2,
            endValue: 12);
        var evaluator = new TrendLineCandidateEvaluator();

        var result = evaluator.Evaluate(candidate, bars);

        Assert.Equal(4, result.TouchCount);
        Assert.Equal(1, result.ViolationCount);
        Assert.Equal(2, result.BarsSinceLastAnchor);
        Assert.Equal(0m, result.CurrentDistanceRatio);
        Assert.Equal(14.8m, result.Score);
    }

    [Fact]
    public void Evaluate_ScoresResistanceTouchesAndViolationsFromBarHighs()
    {
        var bars = new[]
        {
            Bar(0, high: 20, low: 16, close: 18),
            Bar(1, high: 19, low: 15, close: 17),
            Bar(2, high: 18, low: 14, close: 16),
            Bar(3, high: 20, low: 13, close: 15),
            Bar(4, high: 16, low: 12, close: 16)
        };
        var candidate = Candidate(
            TrendLineType.Resistance,
            startIndex: 0,
            startValue: 20,
            endIndex: 2,
            endValue: 18);
        var evaluator = new TrendLineCandidateEvaluator();

        var result = evaluator.Evaluate(candidate, bars);

        Assert.Equal(4, result.TouchCount);
        Assert.Equal(1, result.ViolationCount);
        Assert.Equal(2, result.BarsSinceLastAnchor);
        Assert.Equal(0m, result.CurrentDistanceRatio);
        Assert.Equal(14.8m, result.Score);
    }

    [Fact]
    public void Evaluate_AppliesConfiguredTouchAndProximityWeights()
    {
        var bars = new[]
        {
            Bar(0, high: 12, low: 10, close: 11),
            Bar(1, high: 13, low: 11, close: 12),
            Bar(2, high: 14, low: 12, close: 12),
            Bar(3, high: 15, low: 13, close: 13)
        };
        var candidate = Candidate(
            TrendLineType.Support,
            startIndex: 0,
            startValue: 10,
            endIndex: 2,
            endValue: 12);
        var evaluator = new TrendLineCandidateEvaluator(
            new TrendLineScoringSettings
            {
                TouchWeight = 2,
                ViolationPenalty = 5,
                RecencyPenaltyPerBar = 1,
                ProximityPenalty = 14
            });

        var result = evaluator.Evaluate(candidate, bars);

        Assert.Equal(4, result.TouchCount);
        Assert.Equal(0, result.ViolationCount);
        Assert.Equal(1, result.BarsSinceLastAnchor);
        Assert.Equal(0m, result.CurrentDistanceRatio);
        Assert.Equal(7m, result.Score);
    }

    [Fact]
    public void Evaluate_RejectsCandidateOutsideThePriceSeries()
    {
        var candidate = Candidate(
            TrendLineType.Support,
            startIndex: 1,
            startValue: 10,
            endIndex: 3,
            endValue: 12);
        var evaluator = new TrendLineCandidateEvaluator();

        Assert.Throws<ArgumentException>(() => evaluator.Evaluate(
            candidate,
            [
                Bar(0, high: 12, low: 10, close: 11),
                Bar(1, high: 13, low: 11, close: 12)
            ]));
    }

    private static TrendLineCandidate Candidate(
        TrendLineType type,
        int startIndex,
        decimal startValue,
        int endIndex,
        decimal endValue)
    {
        var swingType = type == TrendLineType.Support
            ? SwingPointType.Low
            : SwingPointType.High;

        return new TrendLineCandidate(
            type,
            Point(startIndex, startValue, swingType),
            Point(endIndex, endValue, swingType));
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

    private static PriceBar Bar(
        int day,
        decimal high,
        decimal low,
        decimal close)
    {
        return new PriceBar(
            new DateOnly(2026, 1, 1).AddDays(day),
            Open: close,
            High: high,
            Low: low,
            Close: close,
            Volume: 1_000);
    }
}
