namespace JZ.Studio.DataManager.Infrastructure.Census;

public interface ICensusDownloadService {
	Task DownloadAsync(string key);
}

