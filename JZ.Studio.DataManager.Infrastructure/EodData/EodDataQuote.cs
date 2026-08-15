using System.Text.Json.Serialization;

namespace JZ.Studio.DataManager.Infrastructure.EodData;

public sealed record EodDataQuote(
    [property: JsonPropertyName("exchangeCode")] string ExchangeCode,
    [property: JsonPropertyName("symbolCode")] string SymbolCode,
    [property: JsonPropertyName("name")] string? Name,
    [property: JsonPropertyName("interval")] string? Interval,
    [property: JsonPropertyName("dateStamp")] string DateStamp,
    [property: JsonPropertyName("open")] decimal Open,
    [property: JsonPropertyName("high")] decimal High,
    [property: JsonPropertyName("low")] decimal Low,
    [property: JsonPropertyName("close")] decimal Close,
    [property: JsonPropertyName("adjustedClose")] decimal? AdjustedClose,
    [property: JsonPropertyName("volume")] long Volume,
    [property: JsonPropertyName("openInterest")] long? OpenInterest,
    [property: JsonPropertyName("bid")] decimal? Bid,
    [property: JsonPropertyName("ask")] decimal? Ask,
    [property: JsonPropertyName("previous")] decimal? Previous,
    [property: JsonPropertyName("change")] decimal? Change,
    [property: JsonPropertyName("currency")] string? Currency);
