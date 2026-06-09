using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;

public partial class JzStudioDbContext : DbContext
{
    public JzStudioDbContext()
    {
    }

    public JzStudioDbContext(DbContextOptions<JzStudioDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DailyPrice> DailyPrices { get; set; }

    public virtual DbSet<ImportBatch> ImportBatches { get; set; }

    public virtual DbSet<Security> Securities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:jazdbserver.database.windows.net,1433;Initial Catalog=JzStudioDb;Persist Security Info=False;User ID=jziemian;Password=Jaz@8454;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DailyPrice>(entity =>
        {
            entity.HasKey(e => e.DailyPriceId).HasName("PK__DailyPri__6363912ACB996B0D");

            entity.ToTable("DailyPrice", "Market");

            entity.HasIndex(e => new { e.SecurityId, e.TradeDate }, "UQ_Market_DailyPrice_Security_TradeDate").IsUnique();

            entity.Property(e => e.Close).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.High).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Low).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Open).HasColumnType("decimal(18, 6)");

            entity.HasOne(d => d.ImportBatch).WithMany(p => p.DailyPrices)
                .HasForeignKey(d => d.ImportBatchId)
                .HasConstraintName("FK_Market_DailyPrice_ImportBatch");

            entity.HasOne(d => d.Security).WithMany(p => p.DailyPrices)
                .HasForeignKey(d => d.SecurityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Market_DailyPrice_Security");
        });

        modelBuilder.Entity<ImportBatch>(entity =>
        {
            entity.HasKey(e => e.ImportBatchId).HasName("PK__ImportBa__FD5DD5CEF1225A5E");

            entity.ToTable("ImportBatch", "SystemData");

            entity.Property(e => e.FileName)
                .HasMaxLength(260)
                .IsUnicode(false);
            entity.Property(e => e.SourceName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.StartedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("Started");
        });

        modelBuilder.Entity<Security>(entity =>
        {
            entity.HasKey(e => e.SecurityId).HasName("PK__Security__9F8B09302639E006");

            entity.ToTable("Security", "Market");

            entity.HasIndex(e => new { e.Symbol, e.Exchange }, "UQ_Market_Security_Symbol_Exchange").IsUnique();

            entity.Property(e => e.Exchange)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Symbol)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
