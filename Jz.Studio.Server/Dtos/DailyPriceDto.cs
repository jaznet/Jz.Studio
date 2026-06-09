namespace Jz.Studio.Server.Dtos;

public sealed class DailyPriceDto {

	public string Ticker { get; set; } = string.Empty;

	public DateOnly TradeDate { get; set; }

	public decimal Open { get; set; }

	public decimal High { get; set; }

	public decimal Low { get; set; }

	public decimal Close { get; set; }

	public long Volume { get; set; }
}