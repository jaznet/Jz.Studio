using JZ.Studio.TechnicalAnalysis.Core.MarketData;
using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed class TrendLineAnalysisPipeline : ITrendLineAnalysisPipeline
{
    private readonly ISwingPointDetector _swingPointDetector;
    private readonly ITrendLineCandidateBuilder _candidateBuilder;
    private readonly ITrendLineCandidateEvaluator _candidateEvaluator;
    private readonly ITrendLineSelector _selector;

    public TrendLineAnalysisPipeline(
        ISwingPointDetector swingPointDetector,
        ITrendLineCandidateBuilder candidateBuilder,
        ITrendLineCandidateEvaluator candidateEvaluator,
        ITrendLineSelector selector)
    {
        ArgumentNullException.ThrowIfNull(swingPointDetector);
        ArgumentNullException.ThrowIfNull(candidateBuilder);
        ArgumentNullException.ThrowIfNull(candidateEvaluator);
        ArgumentNullException.ThrowIfNull(selector);

        _swingPointDetector = swingPointDetector;
        _candidateBuilder = candidateBuilder;
        _candidateEvaluator = candidateEvaluator;
        _selector = selector;
    }

    public TrendLineAnalysisResult Analyze(IReadOnlyList<PriceBar> bars)
    {
        ArgumentNullException.ThrowIfNull(bars);

        var swingPoints = _swingPointDetector.Detect(bars);
        var candidates = BuildCandidates(swingPoints);
        var evaluations = candidates
            .Select(candidate => _candidateEvaluator.Evaluate(candidate, bars))
            .ToArray();
        var selection = _selector.Select(evaluations);

        return new TrendLineAnalysisResult(
            swingPoints,
            evaluations,
            selection);
    }

    private IReadOnlyList<TrendLineCandidate> BuildCandidates(
        IReadOnlyList<SwingPoint> swingPoints)
    {
        var supportCandidates = _candidateBuilder.Build(
            swingPoints,
            TrendLineType.Support);
        var resistanceCandidates = _candidateBuilder.Build(
            swingPoints,
            TrendLineType.Resistance);

        return [.. supportCandidates, .. resistanceCandidates];
    }
}
