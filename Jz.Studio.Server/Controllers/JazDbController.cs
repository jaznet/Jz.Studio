
//using Jz.Studio.Server.Data.JazDb;
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

        //[HttpGet("election")]
        //public async Task<ActionResult<IEnumerable<ElectionDatum>>> GetElectionResults() {
        //    if (_context == null) {
        //        return NotFound();
        //    }
        //    Console.WriteLine("GetElectionResults");
        //    return await _context.ElectionDatum.ToListAsync();
        //}
    }
}
