using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Xunit;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.TrendLines;

public sealed class TrendLineCandidateBuilderTests
{
    [Fact]
    public void Constructor_RejectsAnAnchorLimitBelowTwo()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => new TrendLineCandidateBuilder(maximumAnchorsPerType: 1));
    }

    private readonly TrendLineCandidateBuilder _builder = new();

    [Fact]
    public void Build_CreatesSupportCandidatesFromSwingLowsOnly()
    {
        var low1 = Point(1, 10, SwingPointType.Low);
        var high = Point(2, 20, SwingPointType.High);
        var low2 = Point(3, 12, SwingPointType.Low);
        var low3 = Point(5, 14, SwingPointType.Low);

        var result = _builder.Build(
            [low3, high, low1, low2],
            TrendLineType.Support);

        Assert.Collection(
            result,
            candidate => AssertAnchors(candidate, low1, low2),
            candidate => AssertAnchors(candidate, low1, low3),
            candidate => AssertAnchors(candidate, low2, low3));
        Assert.All(result, candidate =>
            Assert.Equal(TrendLineType.Support, candidate.Type));
    }

    [Fact]
    public void Build_CreatesResistanceCandidatesFromSwingHighsOnly()
    {
        var high1 = Point(1, 20, SwingPointType.High);
        var low = Point(2, 10, SwingPointType.Low);
        var high2 = Point(4, 18, SwingPointType.High);

        var result = _builder.Build(
            [high2, low, high1],
            TrendLineType.Resistance);

        var candidate = Assert.Single(result);
        Assert.Equal(TrendLineType.Resistance, candidate.Type);
        AssertAnchors(candidate, high1, high2);
    }

    [Fact]
    public void Build_IgnoresDuplicateBarIndexes()
    {
        var result = _builder.Build(
            [
                Point(2, 10, SwingPointType.Low),
                Point(2, 11, SwingPointType.Low)
            ],
            TrendLineType.Support);

        Assert.Empty(result);
    }

    [Fact]
    public void Build_LimitsCandidatesToTheMostRecentAnchors()
    {
        var older = Point(1, 10, SwingPointType.Low);
        var recent1 = Point(3, 12, SwingPointType.Low);
        var recent2 = Point(5, 14, SwingPointType.Low);
        var builder = new TrendLineCandidateBuilder(maximumAnchorsPerType: 2);

        var result = builder.Build(
            [older, recent1, recent2],
            TrendLineType.Support);

        var candidate = Assert.Single(result);
        AssertAnchors(candidate, recent1, recent2);
    }

    private static void AssertAnchors(
        TrendLineCandidate candidate,
        SwingPoint expectedStart,
        SwingPoint expectedEnd)
    {
        Assert.Equal(expectedStart, candidate.Start);
        Assert.Equal(expectedEnd, candidate.End);
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
