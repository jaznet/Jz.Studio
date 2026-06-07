using Jz.Studio.Server.Dtos;
using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jz.Studio.Server.Controllers {

	[ApiController]
	[Route("api/market/daily-prices")]
	public class MarketDailyPricesController : ControllerBase {
		private readonly JzStudioDbContext db;

		public MarketDailyPricesController(JzStudioDbContext db) {
			this.db = db;
		}

		[HttpGet("{ticker}")]
		public async Task<ActionResult<List<DailyPriceDto>>> GetDailyPrices(string ticker) {
			ticker = ticker.ToUpper();

			var data =
				await db.DailyPrices
					.AsNoTracking()
					.Where(p => p.Security.Symbol == ticker)
					.OrderBy(p => p.TradeDate)
					.Select(p => new DailyPriceDto {
						Date = p.TradeDate.ToDateTime(TimeOnly.MinValue),
						Open = p.Open,
						High = p.High,
						Low = p.Low,
						Close = p.Close,
						Volume = p.Volume
					})
					.ToListAsync();

			return Ok(data);
		}
	}
}