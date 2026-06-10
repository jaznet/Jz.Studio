using Jz.Studio.Server.Data.JazDb;
using JZ.Studio.DataManager.Infrastructure.Census;
using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Jz.Studio.Server {
	public class Program {
		public static void Main(string[] args) {
			var invariantSetting = Environment.GetEnvironmentVariable("DOTNET_SYSTEM_GLOBALIZATION_INVARIANT");
			Console.WriteLine($"Environment Variable DOTNET_SYSTEM_GLOBALIZATION_INVARIANT is set to: {invariantSetting}");

			CultureInfo.CurrentCulture = new CultureInfo("en-US");
			CultureInfo.CurrentUICulture = new CultureInfo("en-US");

			var builder = WebApplication.CreateBuilder(args);

			builder.Services.AddCors(options => {
				options.AddPolicy("AllowSpecificOrigin",
					builder => builder.WithOrigins(
						"https://localhost:4200",
						"https://localhost:7105"
					)
					.AllowAnyHeader()
					.AllowAnyMethod());
			});

			builder.Services.AddControllers();

			builder.Services.AddDbContext<JazDbContext>(options =>
				options.UseSqlServer(
					builder.Configuration.GetConnectionString("YourConnectionStringName")));

			builder.Services.AddDbContext<JzStudioDbContext>(options =>
				options.UseSqlServer(
					builder.Configuration.GetConnectionString("JzStudioDb")));

			// Census services
			builder.Services.AddSingleton<ICensusDatasetCatalogService, CensusDatasetCatalogService>();
			builder.Services.AddHttpClient<ICensusDownloadService, CensusDownloadService>();

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			app.UseDefaultFiles();
			app.UseStaticFiles();

			if (app.Environment.IsDevelopment()) {
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseCors("AllowSpecificOrigin");

			app.UseHttpsRedirection();

			app.UseAuthorization();

			app.MapControllers();

			app.MapFallbackToFile("/index.html");

			app.Run();
		}
	}
}