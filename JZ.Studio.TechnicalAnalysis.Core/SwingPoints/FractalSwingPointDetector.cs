using JZ.Studio.TechnicalAnalysis.Core.MarketData;

namespace JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

public sealed class FractalSwingPointDetector : ISwingPointDetector
{
    private readonly int _barsOnEachSide;

    public FractalSwingPointDetector(int barsOnEachSide = 2)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(barsOnEachSide, 1);
        _barsOnEachSide = barsOnEachSide;
    }

    public IReadOnlyList<SwingPoint> Detect(IReadOnlyList<PriceBar> bars)
    {
        ArgumentNullException.ThrowIfNull(bars);

        var swingPoints = new List<SwingPoint>();
        var firstCandidate = _barsOnEachSide;
        var lastCandidate = bars.Count - _barsOnEachSide - 1;

        for (var candidateIndex = firstCandidate;
             candidateIndex <= lastCandidate;
             candidateIndex++)
        {
            var candidate = bars[candidateIndex];

            if (IsSwingHigh(bars, candidateIndex, candidate.High))
            {
                swingPoints.Add(new SwingPoint(
                    candidateIndex,
                    candidate.Date,
                    candidate.High,
                    SwingPointType.High));
            }

            if (IsSwingLow(bars, candidateIndex, candidate.Low))
            {
                swingPoints.Add(new SwingPoint(
                    candidateIndex,
                    candidate.Date,
                    candidate.Low,
                    SwingPointType.Low));
            }
        }

        return swingPoints;
    }

    private bool IsSwingHigh(
        IReadOnlyList<PriceBar> bars,
        int candidateIndex,
        decimal candidateHigh)
    {
        for (var offset = 1; offset <= _barsOnEachSide; offset++)
        {
            if (candidateHigh <= bars[candidateIndex - offset].High ||
                candidateHigh <= bars[candidateIndex + offset].High)
            {
                return false;
            }
        }

        return true;
    }

    private bool IsSwingLow(
        IReadOnlyList<PriceBar> bars,
        int candidateIndex,
        decimal candidateLow)
    {
        for (var offset = 1; offset <= _barsOnEachSide; offset++)
        {
            if (candidateLow >= bars[candidateIndex - offset].Low ||
                candidateLow >= bars[candidateIndex + offset].Low)
            {
                return false;
            }
        }

        return true;
    }
}
