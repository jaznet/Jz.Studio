namespace JZ.Studio.DataManager.Infrastructure.Census;

public class CensusDataset {
	public int Id { get; set; }

	public string Key { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public string Category { get; set; } = string.Empty;

	public CensusSourceType SourceType { get; set; }

	public int VintageYear { get; set; }

	public string SourceUrl { get; set; } = string.Empty;
	public string RelativeFolder { get; set; } = string.Empty;
	public string LocalFileName { get; set; } = string.Empty;

	public bool IsDownloaded { get; set; }
	public DateTime? DownloadedAtUtc { get; set; }

	public bool IsImported { get; set; }
	public DateTime? ImportedAtUtc { get; set; }

	public string Status { get; set; } = "Pending";
}