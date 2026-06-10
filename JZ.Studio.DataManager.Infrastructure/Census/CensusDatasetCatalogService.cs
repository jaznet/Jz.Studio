namespace JZ.Studio.DataManager.Infrastructure.Census;

public class CensusDatasetCatalogService
	: ICensusDatasetCatalogService {
	private readonly List<CensusDataset> catalog;

	public CensusDatasetCatalogService() {
		catalog = BuildCatalog();
	}

	public IReadOnlyList<CensusDataset>
		GetDefaultCatalog() {
		return catalog;
	}

	public CensusDataset?
		GetByKey(string key) {
		return catalog.FirstOrDefault(
			x => x.Key == key);
	}

	private static List<CensusDataset>
		BuildCatalog() {
		return new() {
			// we'll populate this next
		};
	}
}