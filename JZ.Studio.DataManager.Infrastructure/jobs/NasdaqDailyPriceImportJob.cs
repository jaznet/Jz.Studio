
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public class NasdaqDailyPriceImportJob {
	//private readonly JzStudioDbContext db;

	//public NasdaqDailyPriceImportJob(JzStudioDbContext db) {
	//	this.db = db;
	//}

	//public void Execute(string filePath) {
	//	Console.WriteLine($"Reading: {filePath}");

	//	if (!File.Exists(filePath)) {
	//		Console.WriteLine("File not found.");
	//		return;
	//	}

	//	var importBatch = new ImportBatch {
	//		SourceName = "NASDAQ",
	//		FileName = Path.GetFileName(filePath),
	//		StartedAt = DateTime.UtcNow,
	//		Status = "Started"
	//	};

	//	db.ImportBatches.Add(importBatch);
	//	db.SaveChanges();

	//	//
	//	// Read file once
	//	//
	//	var lines = File.ReadLines(filePath)
	//		.Skip(1)
	//		.ToList();

	//	//
	//	// Get all unique symbols from the file
	//	//
	//	var symbols = lines
	//		.Select(line => line.Split(',')[0])
	//		.Distinct()
	//		.ToList();

	//	//
	//	// Load all existing securities once
	//	//
	//	var securityLookup = db.Securities
	//		.Where(s => symbols.Contains(s.Symbol))
	//		.ToDictionary(s => s.Symbol);

	//	//
	//	// Find symbols not yet in the database
	//	//
	//	var missingSymbols = symbols
	//		.Where(symbol => !securityLookup.ContainsKey(symbol))
	//		.ToList();

	//	//
	//	// Create missing securities
	//	//
	//	foreach (var symbol in missingSymbols) {
	//		db.Securities.Add(new Security {
	//			Symbol = symbol,
	//			Name = symbol,
	//			Exchange = "NASDAQ"
	//		});
	//	}

	//	db.SaveChanges();

	//	//
	//	// Reload lookup including newly created securities
	//	//
	//	securityLookup = db.Securities
	//		.Where(s => symbols.Contains(s.Symbol))
	//		.ToDictionary(s => s.Symbol);

	//	var prices = new List<DailyPrice>();

	//	foreach (var line in lines) {
	//		var parts = line.Split(',');

	//		var symbol = parts[0];

	//		var tradeDate = DateOnly.ParseExact(
	//			parts[1],
	//			"yyyyMMdd",
	//			CultureInfo.InvariantCulture);

	//		var open = decimal.Parse(parts[2], CultureInfo.InvariantCulture);
	//		var high = decimal.Parse(parts[3], CultureInfo.InvariantCulture);
	//		var low = decimal.Parse(parts[4], CultureInfo.InvariantCulture);
	//		var close = decimal.Parse(parts[5], CultureInfo.InvariantCulture);
	//		var volume = long.Parse(parts[6], CultureInfo.InvariantCulture);

	//		//
	//		// Fast in-memory lookup
	//		//
	//		var security = securityLookup[symbol];

	//		prices.Add(new DailyPrice {
	//			SecurityId = security.SecurityId,
	//			ImportBatchId = importBatch.ImportBatchId,

	//			TradeDate = tradeDate,

	//			Open = open,
	//			High = high,
	//			Low = low,
	//			Close = close,

	//			Volume = volume
	//		});
	//	}

	//	db.DailyPrices.AddRange(prices);

	//	importBatch.Status = "Completed";
	//	importBatch.ImportedRowCount = prices.Count;
	//	importBatch.CompletedAt = DateTime.UtcNow;

	//	db.SaveChanges();

	//	Console.WriteLine(
	//		$"Imported {prices.Count:N0} DailyPrice records.");
	//}
}