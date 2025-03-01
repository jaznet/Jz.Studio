
using Jz.Studio.Server.Data.JazDb;
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

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins(
                        "https://localhost:4200",  // Angular client
                        "https://localhost:7105"   // Swagger UI and API
                                                   // Add other origins as needed
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });


            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            // Configure DbContext with SQL Server
            builder.Services.AddDbContext<JazDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("YourConnectionStringName")));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Configure the HTTP request pipeline.
            app.UseCors("AllowSpecificOrigin"); // Apply the CORS policy

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
