using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using JZ.Studio.DataManager.Core.contracts;
using JZ.Studio.DataManager.Infrastructure.EodData;
using JZ.Studio.DataManager.Infrastructure.jobs;
using JZ.Studio.DataManager.Worker;

using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddHostedService<EodDataCorporateActionWorker>();

builder.Services.AddScoped<IEtlJob, DummyEtlJob>();

var eodDataOptions = new EodDataOptions {
    BaseUrl = builder.Configuration["EodData:BaseUrl"]
        ?? "https://api.eoddata.com",
    ApiKey = builder.Configuration["EodData:ApiKey"]
        ?? string.Empty
};

builder.Services.AddSingleton(eodDataOptions);
builder.Services.AddHttpClient<IEodDataClient, EodDataClient>();
builder.Services.AddScoped<EodDataCorporateActionImportJob>();

builder.Services.AddDbContext<JzStudioDbContext>(options =>
	options.UseSqlServer(
		"Server=tcp:jazdbserver.database.windows.net,1433;" +
		"Initial Catalog=JzStudioDb;" +
		"Persist Security Info=False;" +
		"User ID=jziemian;" +
		"Password=Jaz@8454;" +
		"MultipleActiveResultSets=False;" +
		"Encrypt=True;" +
		"TrustServerCertificate=False;" +
		"Connection Timeout=30;"));

var host = builder.Build();

host.Run();