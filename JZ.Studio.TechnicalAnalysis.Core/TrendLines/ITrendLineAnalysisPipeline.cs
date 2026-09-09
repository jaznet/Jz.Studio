using JZ.Studio.TechnicalAnalysis.Core.MarketData;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public interface ITrendLineAnalysisPipeline
{
    TrendLineAnalysisResult Analyze(IReadOnlyList<PriceBar> bars);
}
