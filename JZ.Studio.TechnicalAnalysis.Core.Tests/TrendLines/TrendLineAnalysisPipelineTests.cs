using JZ.Studio.TechnicalAnalysis.Core.MarketData;
using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Xunit;

namespace JZ.Studio.TechnicalAnalysis.Core.Tests.TrendLines;

public sealed class TrendLineAnalysisPipelineTests
{
    [Fact]
    public void Analyze_RunsTheCompleteTrendLinePipeline()
    {
        var bars = new[]
        {
            Bar(0, high: 10, low: 8),
            Bar(1, high: 15, low: 9),
            Bar(2, high: 11, low: 5),
            Bar(3, high: 16, low: 9),
            Bar(4, high: 12, low: 6),
            Bar(5, high: 17, low: 10)
        };
        var pipeline = Pipeline();

        var result = pipeline.Analyze(bars);

        Assert.Equal(4, result.SwingPoints.Count);
        Assert.Equal(2, result.Evaluations.Count);
        var support = Assert.IsType<TrendLineEvaluation>(
            result.Selection.Support);
        var resistance = Assert.IsType<TrendLineEvaluation>(
            result.Selection.Resistance);
        Assert.Equal(
            TrendLineType.Support,
            support.Candidate.Type);
        Assert.Equal(
            TrendLineType.Resistance,
            resistance.Candidate.Type);
    }

    [Fact]
    public void Analyze_ReturnsEmptyResultWhenNoLinesCanBeConstructed()
    {
        var pipeline = Pipeline();

        var result = pipeline.Analyze(
            [
                Bar(0, high: 10, low: 8),
                Bar(1, high: 11, low: 9)
            ]);

        Assert.Empty(result.SwingPoints);
        Assert.Empty(result.Evaluations);
        Assert.Null(result.Selection.Support);
        Assert.Null(result.Selection.Resistance);
    }

    private static TrendLineAnalysisPipeline Pipeline()
    {
        return new TrendLineAnalysisPipeline(
            new FractalSwingPointDetector(barsOnEachSide: 1),
            new TrendLineCandidateBuilder(),
            new TrendLineCandidateEvaluator(),
            new TrendLineSelector());
    }

    private static PriceBar Bar(int day, decimal high, decimal low)
    {
        var close = (high + low) / 2;

        return new PriceBar(
            new DateOnly(2026, 1, 1).AddDays(day),
            Open: close,
            High: high,
            Low: low,
            Close: close,
            Volume: 1_000);
    }
}
