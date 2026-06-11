using JZ.Studio.DataManager.Infrastructure.Census;
using Microsoft.AspNetCore.Mvc;

namespace Jz.Studio.Server.Controllers;

[ApiController]
[Route("api/choro-data")]
public class ChoroDataController : ControllerBase {
	private readonly ICensusDatasetCatalogService catalogService;
	private readonly ICensusDownloadService downloadService;

	public ChoroDataController(
		ICensusDatasetCatalogService catalogService,
		ICensusDownloadService downloadService) {
		this.catalogService = catalogService;
		this.downloadService = downloadService;
	}

	[HttpGet("catalog")]
	public IActionResult GetCatalog() {
		return Ok(catalogService.GetDefaultCatalog());
	}

	[HttpPost("download/{key}")]
	public async Task<IActionResult> Download(string key) {
		await downloadService.DownloadAsync(key);

		return Ok(new {
			Key = key,
			Status = "Downloaded"
		});
	}
}