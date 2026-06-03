using JZ.Studio.DataManager.Core.contracts;
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
	//protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
	//	_logger.LogInformation("JZ Studio DataManager Worker started at: {time}", DateTimeOffset.Now);
	//	using var scope = _serviceProvider.CreateScope();
	//	var jobs = scope.ServiceProvider.GetServices<IEtlJob>();
	//	foreach (var job in jobs) {
	//		_logger.LogInformation("Starting ETL job: {JobName}", job.Name);
	//		await job.RunAsync(stoppingToken);
	//		_logger.LogInformation("Finished ETL job: {JobName}", job.Name);
	//	}
	//	_logger.LogInformation("JZ Studio DataManager Worker finished initial ETL run at: {time}", DateTimeOffset.Now);
	//}

	protected override async Task ExecuteAsync(
	CancellationToken stoppingToken) {
		var job = new NasdaqDailyPriceImportJob();

		job.Execute(
			@"C:\MarketData\NASDAQ_20260106.txt");

		await Task.CompletedTask;
	}
}
