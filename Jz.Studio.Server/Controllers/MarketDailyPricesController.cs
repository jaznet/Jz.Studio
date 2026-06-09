using Jz.Studio.Server.Data.JzStudioDb;
using Jz.Studio.Server.Dtos;
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
			var prices = await db.DailyPrices

				.Where(x => x.Security.Symbol == ticker)

				.OrderBy(x => x.TradeDate)

				.Select(x => new DailyPriceDto {
					Ticker = x.Security.Symbol,

					TradeDate = x.TradeDate,

					Open = x.Open,
					High = x.High,
					Low = x.Low,
					Close = x.Close,

					Volume = x.Volume
				})

				.ToListAsync();

			if (!prices.Any()) {
				return NotFound(
					$"No daily prices found for '{ticker}'.");
			}

			return Ok(prices);
		}
	}
}