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
		const int year = 2024;

		return new() {
		new CensusDataset {
			Key = "TIGER_COUNTY_500K",
			Name = "County Cartographic Boundary",
			Description = "County and equivalent cartographic boundary shapefile at 1:500,000 scale.",
			Category = "TIGER",
			SourceType = CensusSourceType.DirectZipDownload,
			VintageYear = year,
			SourceUrl = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip",
			RelativeFolder = @"Census\TIGER\2024\County",
			LocalFileName = "cb_2024_us_county_500k.zip"
		},

		new CensusDataset {
			Key = "TIGER_STATE_500K",
			Name = "State Cartographic Boundary",
			Description = "State cartographic boundary shapefile at 1:500,000 scale.",
			Category = "TIGER",
			SourceType = CensusSourceType.DirectZipDownload,
			VintageYear = year,
			SourceUrl = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip",
			RelativeFolder = @"Census\TIGER\2024\State",
			LocalFileName = "cb_2024_us_state_500k.zip"
		},

		new CensusDataset {
			Key = "TIGER_TRACT_500K",
			Name = "Census Tract Cartographic Boundary",
			Description = "Census tract cartographic boundary shapefile at 1:500,000 scale.",
			Category = "TIGER",
			SourceType = CensusSourceType.DirectZipDownload,
			VintageYear = year,
			SourceUrl = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_tract_500k.zip",
			RelativeFolder = @"Census\TIGER\2024\Tract",
			LocalFileName = "cb_2024_us_tract_500k.zip"
		},

		new CensusDataset {
			Key = "TIGER_BLOCKGROUP_500K",
			Name = "Block Group Cartographic Boundary",
			Description = "Block group cartographic boundary shapefile at 1:500,000 scale.",
			Category = "TIGER",
			SourceType = CensusSourceType.DirectZipDownload,
			VintageYear = year,
			SourceUrl = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_bg_500k.zip",
			RelativeFolder = @"Census\TIGER\2024\BlockGroup",
			LocalFileName = "cb_2024_us_bg_500k.zip"
		},

		new CensusDataset {
			Key = "TIGER_PLACE_500K",
			Name = "Place Cartographic Boundary",
			Description = "Place cartographic boundary shapefile at 1:500,000 scale.",
			Category = "TIGER",
			SourceType = CensusSourceType.DirectZipDownload,
			VintageYear = year,
			SourceUrl = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_place_500k.zip",
			RelativeFolder = @"Census\TIGER\2024\Place",
			LocalFileName = "cb_2024_us_place_500k.zip"
		}
	};
	}
}