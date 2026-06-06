using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
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

		job.Execute(
			@"D:\Data\NASDAQ\NASDAQ_2021\NASDAQ_20210102.txt");

		await Task.CompletedTask;
	}
}