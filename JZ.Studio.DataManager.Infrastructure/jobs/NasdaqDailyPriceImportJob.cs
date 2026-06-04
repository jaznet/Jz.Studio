using System;
using System.IO;
using System.Linq;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public class NasdaqDailyPriceImportJob {
	public void Execute(string filePath) {
		Console.WriteLine($"Reading: {filePath}");

		if (!File.Exists(filePath)) {
			Console.WriteLine("File not found.");
			return;
		}

		var lines = File.ReadLines(filePath).Take(10);

		foreach (var line in lines) {
			Console.WriteLine(line);
		}
	}
}