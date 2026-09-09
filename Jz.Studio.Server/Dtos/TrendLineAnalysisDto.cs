namespace Jz.Studio.Server.Dtos;

public sealed record TrendLineAnalysisDto(
    string Ticker,
    DateOnly From,
    DateOnly To,
    int PriceBarCount,
    int SwingPointCount,
    int CandidateCount,
    TrendLineDto? Support,
    TrendLineDto? Resistance);
