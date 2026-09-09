using JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

namespace JZ.Studio.TechnicalAnalysis.Core.TrendLines;

public sealed record TrendLineCandidate
{
    public TrendLineCandidate(
        TrendLineType type,
        SwingPoint start,
        SwingPoint end)
    {
        if (end.BarIndex <= start.BarIndex)
        {
            throw new ArgumentException(
                "The end swing point must occur after the start swing point.",
                nameof(end));
        }

        Type = type;
        Start = start;
        End = end;
    }

    public TrendLineType Type { get; }

    public SwingPoint Start { get; }

    public SwingPoint End { get; }

    public decimal SlopePerBar =>
        (End.Value - Start.Value) / (End.BarIndex - Start.BarIndex);

    public decimal ValueAt(int barIndex)
    {
        return Start.Value + (SlopePerBar * (barIndex - Start.BarIndex));
    }
}
