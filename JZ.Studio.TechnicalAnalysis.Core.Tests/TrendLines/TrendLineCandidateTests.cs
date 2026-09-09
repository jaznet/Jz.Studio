using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Xunit;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.TrendLines;

public sealed class TrendLineCandidateTests
{
    [Fact]
    public void SlopePerBar_ReturnsPriceChangePerBar()
    {
        var candidate = new TrendLineCandidate(
            TrendLineType.Support,
            Point(2, 10, SwingPointType.Low),
            Point(6, 14, SwingPointType.Low));

        Assert.Equal(1m, candidate.SlopePerBar);
    }

    [Theory]
    [InlineData(0, 8)]
    [InlineData(2, 10)]
    [InlineData(4, 12)]
    [InlineData(8, 16)]
    public void ValueAt_ProjectsTheLineAcrossAnyBar(int barIndex, int expected)
    {
        var candidate = new TrendLineCandidate(
            TrendLineType.Support,
            Point(2, 10, SwingPointType.Low),
            Point(6, 14, SwingPointType.Low));

        Assert.Equal((decimal)expected, candidate.ValueAt(barIndex));
    }

    [Fact]
    public void Constructor_RejectsReversedOrCoincidentAnchors()
    {
        Assert.Throws<ArgumentException>(() => new TrendLineCandidate(
            TrendLineType.Resistance,
            Point(4, 20, SwingPointType.High),
            Point(4, 18, SwingPointType.High)));
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
