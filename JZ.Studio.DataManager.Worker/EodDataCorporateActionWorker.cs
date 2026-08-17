using JZ.Studio.DataManager.Infrastructure.jobs;

namespace JZ.Studio.DataManager.Worker;

public sealed class EodDataCorporateActionWorker : BackgroundService {
    private readonly ILogger<EodDataCorporateActionWorker> logger;
    private readonly IServiceProvider serviceProvider;

    public EodDataCorporateActionWorker(
        ILogger<EodDataCorporateActionWorker> logger,
        IServiceProvider serviceProvider) {
        this.logger = logger;
        this.serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken) {
        using var scope = serviceProvider.CreateScope();

        var job = scope.ServiceProvider
            .GetRequiredService<EodDataCorporateActionImportJob>();

        logger.LogInformation(
            "Importing EODData corporate actions for NASDAQ/NVDA.");

        var result = await job.ExecuteAsync(
            "NASDAQ",
            "NVDA",
            stoppingToken);

        logger.LogInformation(
            "EODData import completed. Splits: {Splits}; Dividends: {Dividends}; Duplicates skipped: {Duplicates}.",
            result.SplitsImported,
            result.DividendsImported,
            result.DuplicatesSkipped);
    }
}
