using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public interface ITrendLineCandidateBuilder
{
    IReadOnlyList<TrendLineCandidate> Build(
        IReadOnlyList<SwingPoint> swingPoints,
        TrendLineType type);
}
