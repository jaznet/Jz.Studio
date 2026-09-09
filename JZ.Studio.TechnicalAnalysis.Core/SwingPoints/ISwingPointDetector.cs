using JZ.Studio.TechnicalAnalysis.Core.MarketData;

namespace JZ.Studio.TechnicalAnalysis.Core.SwingPoints;

public interface ISwingPointDetector
{
    IReadOnlyList<SwingPoint> Detect(IReadOnlyList<PriceBar> bars);
}
