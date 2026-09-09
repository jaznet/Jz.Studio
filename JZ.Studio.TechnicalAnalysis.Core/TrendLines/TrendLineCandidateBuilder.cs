using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed class TrendLineCandidateBuilder
{
    public IReadOnlyList<TrendLineCandidate> Build(
        IReadOnlyList<SwingPoint> swingPoints,
        TrendLineType type)
    {
        ArgumentNullException.ThrowIfNull(swingPoints);

        var requiredSwingType = type == TrendLineType.Support
            ? SwingPointType.Low
            : SwingPointType.High;

        var anchors = swingPoints
            .Where(point => point.Type == requiredSwingType)
            .OrderBy(point => point.BarIndex)
            .ToArray();

        var candidates = new List<TrendLineCandidate>();

        for (var startIndex = 0; startIndex < anchors.Length - 1; startIndex++)
        {
            for (var endIndex = startIndex + 1; endIndex < anchors.Length; endIndex++)
            {
                if (anchors[startIndex].BarIndex == anchors[endIndex].BarIndex)
                {
                    continue;
                }

                candidates.Add(new TrendLineCandidate(
                    type,
                    anchors[startIndex],
                    anchors[endIndex]));
            }
        }

        return candidates;
    }
}
