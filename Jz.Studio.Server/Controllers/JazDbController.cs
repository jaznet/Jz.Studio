
using Jz.Studio.Server.Data.JazDb;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jz.Studio.Server.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class JazDbController : ControllerBase {
        private readonly JazDbContext _context;

        public JazDbController(JazDbContext context) {
            _context = context;
        }

        [HttpGet("population-api")]
        public async Task<ActionResult<IEnumerable<Population>>> GetPopulationResults() {
            if (_context == null) {
                return NotFound();
            }
            Console.WriteLine("GetPopulation");
            return await _context.Populations.ToListAsync();
        }

        [HttpGet("stock-prices-api/{ticker}")]
        public async Task<ActionResult<IEnumerable<StockPriceHistory>>> GetStockPriceHistory(string ticker) {
            try {
                if (_context == null) {
                    return NotFound();
                }

                // Filter by the ticker passed as a parameter
                var stockPriceHistories = await _context.StockPriceHistories
                    .Where(s => s.Ticker == ticker)
                    .ToListAsync();

                if (stockPriceHistories == null || !stockPriceHistories.Any()) {
                    return NoContent();
                }

                return Ok(stockPriceHistories);
            }
            catch (Exception ex) {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }


    }
}
