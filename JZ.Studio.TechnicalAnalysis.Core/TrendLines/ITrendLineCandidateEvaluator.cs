using JZ.Studio.TechnicalAnalysis.Core.MarketData;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public interface ITrendLineCandidateEvaluator
{
    TrendLineEvaluation Evaluate(
        TrendLineCandidate candidate,
        IReadOnlyList<PriceBar> bars);
}
