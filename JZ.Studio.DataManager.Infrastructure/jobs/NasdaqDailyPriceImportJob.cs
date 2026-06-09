using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using System.Globalization;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public class NasdaqDailyPriceImportJob {
	private readonly JzStudioDbContext db;

	private const int BatchSize = 250;

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

		var batch = new List<DailyPrice>();
		var seen = new HashSet<string>();

		var importedCount = 0;
		var skippedDuplicateCount = 0;

		foreach (var line in File.ReadLines(filePath).Skip(1)) {
			var parts = line.Split(',');

			var ticker = parts[0];

			var tradeDate = DateOnly.ParseExact(
				parts[1],
				"yyyyMMdd",
				CultureInfo.InvariantCulture);

			var duplicateKey = $"{ticker}|{tradeDate:yyyyMMdd}";

			if (!seen.Add(duplicateKey)) {
				skippedDuplicateCount++;

				Console.WriteLine(
					$"Skipped duplicate in file {Path.GetFileName(filePath)}: {ticker} {tradeDate:yyyy-MM-dd}");

				continue;
			}

			var open = decimal.Parse(parts[2], CultureInfo.InvariantCulture);
			var high = decimal.Parse(parts[3], CultureInfo.InvariantCulture);
			var low = decimal.Parse(parts[4], CultureInfo.InvariantCulture);
			var close = decimal.Parse(parts[5], CultureInfo.InvariantCulture);
			var volume = long.Parse(parts[6], CultureInfo.InvariantCulture);

			batch.Add(new DailyPrice {
				Ticker = ticker,
				TradeDate = tradeDate,

				Open = open,
				High = high,
				Low = low,
				Close = close,

				Volume = volume,
				ImportBatchId = importBatch.ImportBatchId
			});

			if (batch.Count >= BatchSize) {
				importedCount += SaveBatch(batch);
				batch.Clear();

				Console.WriteLine(
					$"Imported {importedCount:N0} rows so far from {Path.GetFileName(filePath)}...");
			}
		}

		if (batch.Count > 0) {
			importedCount += SaveBatch(batch);
			batch.Clear();
		}

		importBatch.Status = "Completed";
		importBatch.CompletedAt = DateTime.UtcNow;

		db.SaveChanges();

		Console.WriteLine(
			$"Completed {Path.GetFileName(filePath)}. Imported {importedCount:N0} rows. Skipped {skippedDuplicateCount:N0} duplicates.");
	}

	private int SaveBatch(List<DailyPrice> batch) {
		db.DailyPrices.AddRange(batch);
		db.SaveChanges();

		var count = batch.Count;

		db.ChangeTracker.Clear();

		return count;
	}
}