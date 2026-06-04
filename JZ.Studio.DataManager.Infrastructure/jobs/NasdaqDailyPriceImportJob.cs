using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public class NasdaqDailyPriceImportJob {
	private readonly JzStudioDbContext db;

	public NasdaqDailyPriceImportJob(JzStudioDbContext db) {
		this.db = db;
	}

	public void Execute(string filePath) {
		Console.WriteLine($"Reading: {filePath}");

		if (!File.Exists(filePath)) {
			Console.WriteLine("File not found.");
			return;
		}

		var importBatch = new ImportBatch {
			SourceName = "NASDAQ",
			FileName = Path.GetFileName(filePath),
			StartedAt = DateTime.UtcNow,
			Status = "Started"
		};

		db.ImportBatches.Add(importBatch);
		db.SaveChanges();

		var prices = new List<DailyPrice>();

		foreach (var line in File.ReadLines(filePath).Skip(1)) {
			var parts = line.Split(',');

			var symbol = parts[0];

			var tradeDate = DateTime.ParseExact(
				parts[1],
				"yyyyMMdd",
				CultureInfo.InvariantCulture);

			var open = decimal.Parse(parts[2], CultureInfo.InvariantCulture);
			var high = decimal.Parse(parts[3], CultureInfo.InvariantCulture);
			var low = decimal.Parse(parts[4], CultureInfo.InvariantCulture);
			var close = decimal.Parse(parts[5], CultureInfo.InvariantCulture);
			var volume = long.Parse(parts[6], CultureInfo.InvariantCulture);

			Console.WriteLine(
				$"{symbol} {tradeDate:yyyy-MM-dd} O:{open} H:{high} L:{low} C:{close} V:{volume}");

			//
			// Find or create Security
			//
			var security = db.Securities
				.FirstOrDefault(s => s.Symbol == symbol);

			if (security == null) {
				security = new Security {
					Symbol = symbol,
					Name = symbol,
					Exchange = "NASDAQ"
				};

				db.Securities.Add(security);
				db.SaveChanges();
			}

			//
			// Create DailyPrice
			//
			var dailyPrice = new DailyPrice {
				SecurityId = security.SecurityId,
				ImportBatchId = importBatch.ImportBatchId,

				TradeDate = DateOnly.FromDateTime(tradeDate),

				Open = open,
				High = high,
				Low = low,
				Close = close,

				Volume = volume
			};

			prices.Add(dailyPrice);
		}

		db.DailyPrices.AddRange(prices);

		importBatch.Status = "Completed";

		db.SaveChanges();

		Console.WriteLine(
			$"Imported {prices.Count} DailyPrice records.");
	}
}