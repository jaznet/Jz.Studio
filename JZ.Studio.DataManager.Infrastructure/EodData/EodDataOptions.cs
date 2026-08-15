namespace JZ.Studio.DataManager.Infrastructure.EodData;

public sealed class EodDataOptions {
    public const string SectionName = "EodData";

    public string BaseUrl { get; init; } = "https://api.eoddata.com";

    public string ApiKey { get; init; } = string.Empty;
}
