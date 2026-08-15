namespace JZ.Studio.DataManager.Infrastructure.EodData;

public interface IEodDataClient {
    Task<IReadOnlyList<EodDataQuote>> GetDailyQuotesAsync(
        string exchangeCode,
        string symbolCode,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<EodDataSplit>> GetSplitsAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<EodDataDividend>> GetDividendsAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken = default);
}
