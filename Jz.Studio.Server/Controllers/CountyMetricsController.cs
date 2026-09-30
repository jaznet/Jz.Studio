using System.ComponentModel.DataAnnotations;
using Jz.Studio.Server.Data.JazDb;
using Jz.Studio.Server.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jz.Studio.Server.Controllers;

[ApiController]
[Route("api/choro-data/county-metrics")]
public sealed class CountyMetricsController : ControllerBase {
    private readonly JazDbContext dbContext;

    public CountyMetricsController(JazDbContext dbContext) {
        this.dbContext = dbContext;
    }

    // Year is the stored Population.YEAR key; no implicit latest-year selection.
    [HttpGet("median-age")]
    public async Task<ActionResult<IReadOnlyList<CountyMetricValueDto>>> GetMedianAge(
        [FromQuery, Required, Range(1, short.MaxValue)] short? year,
        CancellationToken cancellationToken) {
        var values = await dbContext.Populations
            .AsNoTracking()
            .Where(row => row.Year == year!.Value
                && row.Sumlev == 50
                && row.County > 0
                && row.MedianAgeTot.HasValue
                && row.MedianAgeTot.Value >= 0)
            .OrderBy(row => row.Fips)
            .Select(row => new CountyMetricValueDto(
                row.Fips,
                (double)row.MedianAgeTot!.Value))
            .ToListAsync(cancellationToken);

        return Ok(values);
    }
}
