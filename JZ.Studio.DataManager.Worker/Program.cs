using JZ.Studio.DataManager.Core.contracts;
using JZ.Studio.DataManager.Infrastructure.jobs;
using JZ.Studio.DataManager.Worker;
var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddScoped<IEtlJob, DummyEtlJob>();
var host = builder.Build();
host.Run();
