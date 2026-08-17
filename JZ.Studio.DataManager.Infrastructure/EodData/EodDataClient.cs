using System.Globalization;
using System.Net.Http.Json;

namespace JZ.Studio.DataManager.Infrastructure.EodData;

public sealed class EodDataClient : IEodDataClient {
    private readonly HttpClient httpClient;
    private readonly EodDataOptions options;

    public EodDataClient(HttpClient httpClient, EodDataOptions options) {
        this.httpClient = httpClient;
        this.options = options;

        if (string.IsNullOrWhiteSpace(options.ApiKey)) {
            throw new InvalidOperationException("EODData API key is not configured.");
        }

        if (!Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out var baseAddress)) {
            throw new InvalidOperationException("EODData base URL is invalid.");
        }

        httpClient.BaseAddress ??= baseAddress;
    }

    public Task<IReadOnlyList<EodDataQuote>> GetDailyQuotesAsync(
        string exchangeCode,
        string symbolCode,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken cancellationToken = default) {
        var parameters = new List<KeyValuePair<string, string?>> {
            new("Interval", "d"),
            new("apiKey", options.ApiKey),
            new("FromDateStamp", FormatDate(fromDate)),
            new("ToDateStamp", FormatDate(toDate))
        };

        return GetListAsync<EodDataQuote>(
            $"/Quote/List/{Encode(exchangeCode)}/{Encode(symbolCode)}",
            parameters,
            cancellationToken);
    }

    public Task<IReadOnlyList<EodDataSplit>> GetSplitsAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken = default) {
        return GetListAsync<EodDataSplit>(
            $"/Splits/List/{Encode(exchangeCode)}/{Encode(symbolCode)}",
            ApiKeyParameter(),
            cancellationToken);
    }

    public Task<IReadOnlyList<EodDataDividend>> GetDividendsAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken = default) {
        return GetListAsync<EodDataDividend>(
            $"/Dividends/List/{Encode(exchangeCode)}/{Encode(symbolCode)}",
            ApiKeyParameter(),
            cancellationToken);
    }

    private async Task<IReadOnlyList<T>> GetListAsync<T>(
        string path,
        IEnumerable<KeyValuePair<string, string?>> parameters,
        CancellationToken cancellationToken) {
        var requestUri = BuildRequestUri(path, parameters);
        using var response = await httpClient.GetAsync(requestUri, cancellationToken);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<T>>(cancellationToken)
            ?? [];
    }

    private IEnumerable<KeyValuePair<string, string?>> ApiKeyParameter() {
        yield return new KeyValuePair<string, string?>("apiKey", options.ApiKey);
    }

    private static string BuildRequestUri(
        string path,
        IEnumerable<KeyValuePair<string, string?>> parameters) {
        var query = string.Join(
            "&",
            parameters
                .Where(parameter => !string.IsNullOrWhiteSpace(parameter.Value))
                .Select(parameter =>
                    $"{Uri.EscapeDataString(parameter.Key)}={Uri.EscapeDataString(parameter.Value!)}"));

        return string.IsNullOrEmpty(query) ? path : $"{path}?{query}";
    }

    private static string Encode(string value) {
        if (string.IsNullOrWhiteSpace(value)) {
            throw new ArgumentException("Exchange and symbol codes are required.", nameof(value));
        }

        return Uri.EscapeDataString(value.Trim().ToUpperInvariant());
    }

    private static string? FormatDate(DateOnly? value) {
        return value?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
    }
}
