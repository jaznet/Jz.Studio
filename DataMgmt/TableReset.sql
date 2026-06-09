DELETE FROM Market.DailyPrice;
DELETE FROM Market.Security;
DELETE FROM SystemData.ImportBatch;

DBCC CHECKIDENT ('Market.DailyPrice', RESEED, 0);
DBCC CHECKIDENT ('Market.Security', RESEED, 0);
DBCC CHECKIDENT ('SystemData.ImportBatch', RESEED, 0);

SELECT COUNT(*) AS DailyPrices FROM Market.DailyPrice;
SELECT COUNT(*) AS Securities FROM Market.Security;
SELECT COUNT(*) AS ImportBatches FROM SystemData.ImportBatch;