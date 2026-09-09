using Jz.Studio.Server.Dtos;
using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using JZ.Studio.TechnicalAnalysis.Core.MarketData;
using JZ.Studio.TechnicalAnalysis.Core.TrendLines;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jz.Studio.Server.Controllers;

[ApiController]
[Route("api/market/trendlines")]
public sealed class MarketTrendLinesController : ControllerBase
{
    private const int DefaultMaximumBars = 750;
    private const int AbsoluteMaximumBars = 1_000;

    private readonly JzStudioDbContext _db;
    private readonly ITrendLineAnalysisPipeline _pipeline;

    public MarketTrendLinesController(
        JzStudioDbContext db,
        ITrendLineAnalysisPipeline pipeline)
    {
        _db = db;
        _pipeline = pipeline;
    }

    [HttpGet("{ticker}")]
    public async Task<ActionResult<TrendLineAnalysisDto>> GetTrendLines(
        string ticker,
        [FromQuery] DateOnly? from = null,
        [FromQuery] DateOnly? to = null,
        [FromQuery] int maximumBars = DefaultMaximumBars,
        CancellationToken cancellationToken = default)
    {
        ticker = ticker.Trim().ToUpperInvariant();

        if (ticker.Length == 0)
        {
            return BadRequest("A ticker is required.");
        }

        if (from > to)
        {
            return BadRequest("The from date must not occur after the to date.");
        }

        if (maximumBars is < 1 or > AbsoluteMaximumBars)
        {
            return BadRequest(
                $"Maximum bars must be between 1 and {AbsoluteMaximumBars}.");
        }

        var query = _db.DailyPrices
            .AsNoTracking()
            .Where(price => price.Ticker == ticker);

        if (from.HasValue)
        {
            query = query.Where(price => price.TradeDate >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(price => price.TradeDate <= to.Value);
        }

        var prices = await query
            .OrderByDescending(price => price.TradeDate)
            .Take(maximumBars)
            .Select(price => new PriceBar(
                price.TradeDate,
                price.Open,
                price.High,
                price.Low,
                price.Close,
                price.Volume))
            .ToListAsync(cancellationToken);

        if (prices.Count == 0)
        {
            return NotFound($"No daily prices found for '{ticker}'.");
        }

        prices.Reverse();

        var analysis = _pipeline.Analyze(prices);
        var lastBarIndex = prices.Count - 1;
        var response = new TrendLineAnalysisDto(
            ticker,
            prices[0].Date,
            prices[lastBarIndex].Date,
            prices.Count,
            analysis.SwingPoints.Count,
            analysis.Evaluations.Count,
            Map(analysis.Selection.Support, prices[lastBarIndex].Date, lastBarIndex),
            Map(analysis.Selection.Resistance, prices[lastBarIndex].Date, lastBarIndex));

        return Ok(response);
    }

    private static TrendLineDto? Map(
        TrendLineEvaluation? evaluation,
        DateOnly projectedDate,
        int projectedBarIndex)
    {
        if (evaluation is null)
        {
            return null;
        }

        var candidate = evaluation.Candidate;

        return new TrendLineDto(
            candidate.Type.ToString(),
            candidate.Start.Date,
            candidate.Start.Value,
            candidate.End.Date,
            candidate.End.Value,
            projectedDate,
            candidate.ValueAt(projectedBarIndex),
            evaluation.TouchCount,
            evaluation.ViolationCount,
            evaluation.BarsSinceLastAnchor,
            evaluation.CurrentDistanceRatio,
            evaluation.Score);
    }
}
