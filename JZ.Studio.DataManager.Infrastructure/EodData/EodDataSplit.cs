using System.Text.Json.Serialization;

namespace JZ.Studio.DataManager.Infrastructure.EodData;

public sealed record EodDataSplit(
    [property: JsonPropertyName("exchangeCode")] string ExchangeCode,
    [property: JsonPropertyName("symbolCode")] string SymbolCode,
    [property: JsonPropertyName("dateStamp")] string DateStamp,
    [property: JsonPropertyName("ratio")] string Ratio,
    [property: JsonPropertyName("multiplier")] decimal Multiplier,
    [property: JsonPropertyName("source")] string? Source);
