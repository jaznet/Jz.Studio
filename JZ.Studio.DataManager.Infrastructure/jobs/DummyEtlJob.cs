using JZ.Studio.DataManager.Core.contracts;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JZ.Studio.DataManager.Infrastructure.jobs
{
	public class DummyEtlJob : IEtlJob {
		private readonly ILogger<DummyEtlJob> _logger;
		public DummyEtlJob(ILogger<DummyEtlJob> logger) {
			_logger = logger;
		}
		public string Name => "Dummy ETL Job";
		public Task RunAsync(CancellationToken cancellationToken) {
			_logger.LogInformation("Running {JobName}", Name);
			_logger.LogInformation("This proves the DataManager Worker can execute an ETL job.");
			return Task.CompletedTask;
		}
	}

}
