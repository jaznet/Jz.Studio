
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
    }
}
