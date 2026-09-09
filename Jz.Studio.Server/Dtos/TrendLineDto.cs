namespace Jz.Studio.Server.Dtos;

public sealed record TrendLineDto(
    string Type,
    DateOnly StartDate,
    decimal StartValue,
    DateOnly EndDate,
    decimal EndValue,
    DateOnly ProjectedDate,
    decimal ProjectedValue,
    int TouchCount,
    int ViolationCount,
    int BarsSinceLastAnchor,
    decimal CurrentDistanceRatio,
    decimal Score);
