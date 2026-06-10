namespace JZ.Studio.DataManager.Infrastructure.Census;

public class CensusDownloadService : ICensusDownloadService {
	private readonly ICensusDatasetCatalogService catalogService;
	private readonly HttpClient httpClient;

	private const string DataRoot =
		@"D:\Repos\Jz.Studio\Data";

	public CensusDownloadService(
		ICensusDatasetCatalogService catalogService,
		HttpClient httpClient) {
		this.catalogService = catalogService;
		this.httpClient = httpClient;
	}

	public async Task DownloadAsync(string key) {
		var dataset = catalogService.GetByKey(key);

		if (dataset == null) {
			throw new InvalidOperationException(
				$"Census dataset not found: {key}");
		}

		var folder = Path.Combine(
			DataRoot,
			dataset.RelativeFolder);

		Directory.CreateDirectory(folder);

		var filePath = Path.Combine(
			folder,
			dataset.LocalFileName);

		Console.WriteLine($"Downloading {dataset.Name}");
		Console.WriteLine(dataset.SourceUrl);
		Console.WriteLine(filePath);

		var bytes = await httpClient.GetByteArrayAsync(
			dataset.SourceUrl);

		await File.WriteAllBytesAsync(filePath, bytes);

		dataset.IsDownloaded = true;
		dataset.DownloadedAtUtc = DateTime.UtcNow;
		dataset.Status = "Downloaded";

		Console.WriteLine("Download complete.");
	}
}