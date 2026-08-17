namespace JZ.Studio.DataManager.Infrastructure.jobs;

public sealed record EodDataCorporateActionImportResult(
    int SplitsImported,
    int DividendsImported,
    int DuplicatesSkipped);
