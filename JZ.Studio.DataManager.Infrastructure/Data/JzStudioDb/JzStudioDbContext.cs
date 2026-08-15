using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;

public partial class JzStudioDbContext : DbContext {
    public JzStudioDbContext() {
    }

    public JzStudioDbContext(DbContextOptions<JzStudioDbContext> options)
        : base(options) {
    }

    public virtual DbSet<CorporateAction> CorporateActions { get; set; }

    public virtual DbSet<DailyPrice> DailyPrices { get; set; }

    public virtual DbSet<ImportBatch> ImportBatches { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:jazdbserver.database.windows.net,1433;Initial Catalog=JzStudioDb;Persist Security Info=False;User ID=jziemian;Password=Jaz@8454;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<CorporateAction>(entity => {
            entity.HasKey(e => e.CorporateActionId)
                .HasName("PK_CorporateAction");

            entity.ToTable("CorporateAction", "Market");

            entity.HasIndex(
                    e => new {
                        e.ExchangeCode,
                        e.Ticker,
                        e.ActionType,
                        e.ActionDate
                    },
                    "UX_CorporateAction_Identity")
                .IsUnique();

            entity.Property(e => e.ActionType).HasMaxLength(20);
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.ExchangeCode).HasMaxLength(20);
            entity.Property(e => e.Multiplier).HasColumnType("decimal(18, 8)");
            entity.Property(e => e.Ratio).HasMaxLength(30);
            entity.Property(e => e.Source).HasMaxLength(100);
            entity.Property(e => e.Ticker).HasMaxLength(20);

            entity.HasOne(d => d.ImportBatch)
                .WithMany(p => p.CorporateActions)
                .HasForeignKey(d => d.ImportBatchId)
                .HasConstraintName("FK_CorporateAction_ImportBatch");
        });

        modelBuilder.Entity<DailyPrice>(entity => {
            entity.HasKey(e => e.DailyPriceId).HasName("PK__DailyPri__6363912A06CAACCB");

            entity.ToTable("DailyPrice", "Market");

            entity.HasIndex(e => new { e.Ticker, e.TradeDate }, "UX_DailyPrice_Ticker_TradeDate").IsUnique();

            entity.Property(e => e.Close).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.High).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Low).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Open).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Ticker).HasMaxLength(20);

            entity.HasOne(d => d.ImportBatch).WithMany(p => p.DailyPrices)
                .HasForeignKey(d => d.ImportBatchId)
                .HasConstraintName("FK_DailyPrice_ImportBatch");
        });

        modelBuilder.Entity<ImportBatch>(entity => {
            entity.HasKey(e => e.ImportBatchId).HasName("PK__ImportBa__FD5DD5CE16BD9892");

            entity.ToTable("ImportBatch", "SystemData");

            entity.Property(e => e.FileName).HasMaxLength(260);
            entity.Property(e => e.SourceName).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
