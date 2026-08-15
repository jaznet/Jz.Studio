using System.Text.Json.Serialization;

namespace JZ.Studio.DataManager.Infrastructure.EodData;

public sealed record EodDataDividend(
    [property: JsonPropertyName("exchangeCode")] string ExchangeCode,
    [property: JsonPropertyName("symbolCode")] string SymbolCode,
    [property: JsonPropertyName("dateStamp")] string DateStamp,
    [property: JsonPropertyName("paymentDateStamp")] string? PaymentDateStamp,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("source")] string? Source);
