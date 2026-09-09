
using Xunit;
using JZ.Studio.TechnicalAnalysis.Core.MarketData;
using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.SwingPoints;

public sealed class FractalSwingPointDetectorTests
{
    [Fact]
    public void Detect_ReturnsConfirmedSwingHighAndLow()
    {
        var bars = new[]
        {
            Bar(0, high: 10, low: 6),
            Bar(1, high: 12, low: 5),
            Bar(2, high: 15, low: 4),
            Bar(3, high: 11, low: 3),
            Bar(4, high: 9, low: 1),
            Bar(5, high: 10, low: 3),
            Bar(6, high: 12, low: 4)
        };
        var detector = new FractalSwingPointDetector();

        var result = detector.Detect(bars);

        Assert.Collection(
            result,
            point => Assert.Equal(
                new SwingPoint(2, bars[2].Date, 15, SwingPointType.High),
                point),
            point => Assert.Equal(
                new SwingPoint(4, bars[4].Date, 1, SwingPointType.Low),
                point));
    }

    [Fact]
    public void Detect_DoesNotReturnUnconfirmedEdgeBars()
    {
        var bars = new[]
        {
            Bar(0, high: 20, low: 1),
            Bar(1, high: 10, low: 5),
            Bar(2, high: 11, low: 4),
            Bar(3, high: 12, low: 3),
            Bar(4, high: 25, low: 0)
        };
        var detector = new FractalSwingPointDetector();

        var result = detector.Detect(bars);

        Assert.Empty(result);
    }

    [Fact]
    public void Constructor_RejectsWindowSmallerThanOne()
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => new FractalSwingPointDetector(0));
    }

    private static PriceBar Bar(int day, decimal high, decimal low)
    {
        return new PriceBar(
            new DateOnly(2026, 1, 1).AddDays(day),
            Open: low + 1,
            High: high,
            Low: low,
            Close: high - 1,
            Volume: 1_000);
    }
}
