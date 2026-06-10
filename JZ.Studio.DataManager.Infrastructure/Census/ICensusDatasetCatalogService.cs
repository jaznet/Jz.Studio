namespace JZ.Studio.DataManager.Infrastructure.Census;

public interface ICensusDatasetCatalogService {
	IReadOnlyList<CensusDataset> GetDefaultCatalog();

	CensusDataset? GetByKey(string key);
}