namespace JZ.Studio.DataManager.Infrastructure.Models;

public class DailySecurityPrice {
	public string Ticker { get; set; } = string.Empty;

	public DateTime TradeDate { get; set; }

	public decimal Open { get; set; }

	public decimal High { get; set; }

	public decimal Low { get; set; }

	public decimal Close { get; set; }

	public long Volume { get; set; }
}