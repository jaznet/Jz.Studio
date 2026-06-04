using JZ.Studio.DataManager.Infrastructure.Models;
using System.Globalization;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public class NasdaqDailyPriceImportJob {
	public void Execute(string filePath) {
		Console.WriteLine($"Reading: {filePath}");

		if (!File.Exists(filePath)) {
			Console.WriteLine("File not found.");
			return;
		}

		var prices = new List<DailySecurityPrice>();

		foreach (var line in File.ReadLines(filePath).Skip(1)) {
			var parts = line.Split(',');

			var price = new DailySecurityPrice {
				Ticker = parts[0],

				TradeDate = DateTime.ParseExact(
					parts[1],
					"yyyyMMdd",
					CultureInfo.InvariantCulture),

				Open = decimal.Parse(parts[2], CultureInfo.InvariantCulture),
				High = decimal.Parse(parts[3], CultureInfo.InvariantCulture),
				Low = decimal.Parse(parts[4], CultureInfo.InvariantCulture),
				Close = decimal.Parse(parts[5], CultureInfo.InvariantCulture),
				Volume = long.Parse(parts[6], CultureInfo.InvariantCulture)
			};

			prices.Add(price);
		}

		Console.WriteLine($"Parsed {prices.Count} price rows.");

		foreach (var price in prices.Take(10)) {
			Console.WriteLine(
				$"{price.Ticker} {price.TradeDate:yyyy-MM-dd} O:{price.Open} H:{price.High} L:{price.Low} C:{price.Close} V:{price.Volume}");
		}
	}
}