using Jz.Studio.Server.Data.JzStudioDb;
using JZ.Studio.DataManager.Infrastructure.jobs;

namespace JZ.Studio.DataManager.Worker;

public class Worker : BackgroundService {
	private readonly ILogger<Worker> _logger;
	private readonly IServiceProvider _serviceProvider;

	public Worker(
		ILogger<Worker> logger,
		IServiceProvider serviceProvider) {
		_logger = logger;
		_serviceProvider = serviceProvider;
	}

	protected override async Task ExecuteAsync(
		CancellationToken stoppingToken) {

		using var scope = _serviceProvider.CreateScope();

		var db = scope.ServiceProvider
			.GetRequiredService<JzStudioDbContext>();

		var job = new NasdaqDailyPriceImportJob(db);

		var rootFolder = @"D:\Data\NASDAQ";

		var files = Directory
			.EnumerateFiles(
				rootFolder,
				"NASDAQ_*.txt",
				SearchOption.AllDirectories)
			.OrderBy(x => x)
			.ToList();

		foreach (var file in files) {
			if (stoppingToken.IsCancellationRequested)
				break;

			_logger.LogInformation(
				"Importing NASDAQ file: {File}",
				file);

		//	job.Execute(file);
		}

		await Task.CompletedTask;
	}
}