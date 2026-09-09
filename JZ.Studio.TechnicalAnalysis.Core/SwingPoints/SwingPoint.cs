namespace JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

public sealed record SwingPoint(
    int BarIndex,
    DateOnly Date,
    decimal Value,
    SwingPointType Type);
