using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Jz.Studio.Server.Data.JazDb;

public partial class JazDbContext : DbContext
{
    public JazDbContext()
    {
    }

    public JazDbContext(DbContextOptions<JazDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Censu> Census { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<CountyStat> CountyStats { get; set; }

    public virtual DbSet<ElectionDatum> ElectionData { get; set; }

    public virtual DbSet<Email> Emails { get; set; }

    public virtual DbSet<FederalBudget> FederalBudgets { get; set; }

    public virtual DbSet<FederalElection> FederalElections { get; set; }

    public virtual DbSet<FederalElectionsState> FederalElectionsStates { get; set; }

    public virtual DbSet<Pofipsmap> Pofipsmaps { get; set; }

    public virtual DbSet<Population> Populations { get; set; }

    public virtual DbSet<StateFipsMapping> StateFipsMappings { get; set; }

    public virtual DbSet<StockPriceHistory> StockPriceHistories { get; set; }

    public virtual DbSet<StockSymbol> StockSymbols { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:jazdbserver.database.windows.net,1433;Initial Catalog=JazDb;Persist Security Info=False;User ID=jziemian;Password=Jaz@8454;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Censu>(entity =>
        {
            entity.HasKey(e => new { e.State, e.County, e.Year });

            entity.Property(e => e.State).HasColumnName("STATE");
            entity.Property(e => e.County).HasColumnName("COUNTY");
            entity.Property(e => e.Year).HasColumnName("YEAR");
            entity.Property(e => e.Age04Fem).HasColumnName("AGE04_FEM");
            entity.Property(e => e.Age04Male).HasColumnName("AGE04_MALE");
            entity.Property(e => e.Age04Tot).HasColumnName("AGE04_TOT");
            entity.Property(e => e.Age1014Fem).HasColumnName("AGE1014_FEM");
            entity.Property(e => e.Age1014Male).HasColumnName("AGE1014_MALE");
            entity.Property(e => e.Age1014Tot).HasColumnName("AGE1014_TOT");
            entity.Property(e => e.Age1417Fem).HasColumnName("AGE1417_FEM");
            entity.Property(e => e.Age1417Male).HasColumnName("AGE1417_MALE");
            entity.Property(e => e.Age1417Tot).HasColumnName("AGE1417_TOT");
            entity.Property(e => e.Age1519Fem).HasColumnName("AGE1519_FEM");
            entity.Property(e => e.Age1519Male).HasColumnName("AGE1519_MALE");
            entity.Property(e => e.Age1519Tot).HasColumnName("AGE1519_TOT");
            entity.Property(e => e.Age1544Fem).HasColumnName("AGE1544_FEM");
            entity.Property(e => e.Age1544Male).HasColumnName("AGE1544_MALE");
            entity.Property(e => e.Age1544Tot).HasColumnName("AGE1544_TOT");
            entity.Property(e => e.Age16plusFem).HasColumnName("AGE16PLUS_FEM");
            entity.Property(e => e.Age16plusMale).HasColumnName("AGE16PLUS_MALE");
            entity.Property(e => e.Age16plusTot).HasColumnName("AGE16PLUS_TOT");
            entity.Property(e => e.Age1824Fem).HasColumnName("AGE1824_FEM");
            entity.Property(e => e.Age1824Male).HasColumnName("AGE1824_MALE");
            entity.Property(e => e.Age1824Tot).HasColumnName("AGE1824_TOT");
            entity.Property(e => e.Age18plusFem).HasColumnName("AGE18PLUS_FEM");
            entity.Property(e => e.Age18plusMale).HasColumnName("AGE18PLUS_MALE");
            entity.Property(e => e.Age18plusTot).HasColumnName("AGE18PLUS_TOT");
            entity.Property(e => e.Age2024Fem).HasColumnName("AGE2024_FEM");
            entity.Property(e => e.Age2024Male).HasColumnName("AGE2024_MALE");
            entity.Property(e => e.Age2024Tot).HasColumnName("AGE2024_TOT");
            entity.Property(e => e.Age2529Fem).HasColumnName("AGE2529_FEM");
            entity.Property(e => e.Age2529Male).HasColumnName("AGE2529_MALE");
            entity.Property(e => e.Age2529Tot).HasColumnName("AGE2529_TOT");
            entity.Property(e => e.Age2544Fem).HasColumnName("AGE2544_FEM");
            entity.Property(e => e.Age2544Male).HasColumnName("AGE2544_MALE");
            entity.Property(e => e.Age2544Tot).HasColumnName("AGE2544_TOT");
            entity.Property(e => e.Age3034Fem).HasColumnName("AGE3034_FEM");
            entity.Property(e => e.Age3034Male).HasColumnName("AGE3034_MALE");
            entity.Property(e => e.Age3034Tot).HasColumnName("AGE3034_TOT");
            entity.Property(e => e.Age3539Fem).HasColumnName("AGE3539_FEM");
            entity.Property(e => e.Age3539Male).HasColumnName("AGE3539_MALE");
            entity.Property(e => e.Age3539Tot).HasColumnName("AGE3539_TOT");
            entity.Property(e => e.Age4044Fem).HasColumnName("AGE4044_FEM");
            entity.Property(e => e.Age4044Male).HasColumnName("AGE4044_MALE");
            entity.Property(e => e.Age4044Tot).HasColumnName("AGE4044_TOT");
            entity.Property(e => e.Age4549Fem).HasColumnName("AGE4549_FEM");
            entity.Property(e => e.Age4549Male).HasColumnName("AGE4549_MALE");
            entity.Property(e => e.Age4549Tot).HasColumnName("AGE4549_TOT");
            entity.Property(e => e.Age4564Fem).HasColumnName("AGE4564_FEM");
            entity.Property(e => e.Age4564Male).HasColumnName("AGE4564_MALE");
            entity.Property(e => e.Age4564Tot).HasColumnName("AGE4564_TOT");
            entity.Property(e => e.Age5054Fem).HasColumnName("AGE5054_FEM");
            entity.Property(e => e.Age5054Male).HasColumnName("AGE5054_MALE");
            entity.Property(e => e.Age5054Tot).HasColumnName("AGE5054_TOT");
            entity.Property(e => e.Age513Fem).HasColumnName("AGE513_FEM");
            entity.Property(e => e.Age513Male).HasColumnName("AGE513_MALE");
            entity.Property(e => e.Age513Tot).HasColumnName("AGE513_TOT");
            entity.Property(e => e.Age5559Fem).HasColumnName("AGE5559_FEM");
            entity.Property(e => e.Age5559Male).HasColumnName("AGE5559_MALE");
            entity.Property(e => e.Age5559Tot).HasColumnName("AGE5559_TOT");
            entity.Property(e => e.Age59Fem).HasColumnName("AGE59_FEM");
            entity.Property(e => e.Age59Male).HasColumnName("AGE59_MALE");
            entity.Property(e => e.Age59Tot).HasColumnName("AGE59_TOT");
            entity.Property(e => e.Age6064Fem).HasColumnName("AGE6064_FEM");
            entity.Property(e => e.Age6064Male).HasColumnName("AGE6064_MALE");
            entity.Property(e => e.Age6064Tot).HasColumnName("AGE6064_TOT");
            entity.Property(e => e.Age6569Fem).HasColumnName("AGE6569_FEM");
            entity.Property(e => e.Age6569Male).HasColumnName("AGE6569_MALE");
            entity.Property(e => e.Age6569Tot).HasColumnName("AGE6569_TOT");
            entity.Property(e => e.Age65plusFem).HasColumnName("AGE65PLUS_FEM");
            entity.Property(e => e.Age65plusMale).HasColumnName("AGE65PLUS_MALE");
            entity.Property(e => e.Age65plusTot).HasColumnName("AGE65PLUS_TOT");
            entity.Property(e => e.Age7074Fem).HasColumnName("AGE7074_FEM");
            entity.Property(e => e.Age7074Male).HasColumnName("AGE7074_MALE");
            entity.Property(e => e.Age7074Tot).HasColumnName("AGE7074_TOT");
            entity.Property(e => e.Age7579Fem).HasColumnName("AGE7579_FEM");
            entity.Property(e => e.Age7579Male).HasColumnName("AGE7579_MALE");
            entity.Property(e => e.Age7579Tot).HasColumnName("AGE7579_TOT");
            entity.Property(e => e.Age8084Fem).HasColumnName("AGE8084_FEM");
            entity.Property(e => e.Age8084Male).HasColumnName("AGE8084_MALE");
            entity.Property(e => e.Age8084Tot).HasColumnName("AGE8084_TOT");
            entity.Property(e => e.Age85plusFem).HasColumnName("AGE85PLUS_FEM");
            entity.Property(e => e.Age85plusMale).HasColumnName("AGE85PLUS_MALE");
            entity.Property(e => e.Age85plusTot).HasColumnName("AGE85PLUS_TOT");
            entity.Property(e => e.Ctyname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CTYNAME");
            entity.Property(e => e.Fips)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("fips");
            entity.Property(e => e.MedianAgeFem).HasColumnName("MEDIAN_AGE_FEM");
            entity.Property(e => e.MedianAgeMale).HasColumnName("MEDIAN_AGE_MALE");
            entity.Property(e => e.MedianAgeTot).HasColumnName("MEDIAN_AGE_TOT");
            entity.Property(e => e.PopestFem).HasColumnName("POPEST_FEM");
            entity.Property(e => e.PopestMale).HasColumnName("POPEST_MALE");
            entity.Property(e => e.Popestimate).HasColumnName("POPESTIMATE");
            entity.Property(e => e.Stname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("STNAME");
            entity.Property(e => e.Sumlev).HasColumnName("SUMLEV");
            entity.Property(e => e.Under5Fem).HasColumnName("UNDER5_FEM");
            entity.Property(e => e.Under5Male).HasColumnName("UNDER5_MALE");
            entity.Property(e => e.Under5Tot).HasColumnName("UNDER5_TOT");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Tag)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<CountyStat>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Affgeoid)
                .HasMaxLength(50)
                .HasColumnName("AFFGEOID");
            entity.Property(e => e.Aland).HasColumnName("ALAND");
            entity.Property(e => e.Awater).HasColumnName("AWATER");
            entity.Property(e => e.Countyfp)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("COUNTYFP");
            entity.Property(e => e.Countyns)
                .HasMaxLength(50)
                .HasColumnName("COUNTYNS");
            entity.Property(e => e.FipsCounty)
                .HasMaxLength(50)
                .HasColumnName("fipsCounty");
            entity.Property(e => e.Geoid)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("GEOID");
            entity.Property(e => e.Lsad)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("LSAD");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("NAME");
            entity.Property(e => e.Statefp)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("STATEFP");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("timestamp");
        });

        modelBuilder.Entity<ElectionDatum>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Candidate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidate\"");
            entity.Property(e => e.Candidatevotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidatevotes\"");
            entity.Property(e => e.Notes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"notes\"");
            entity.Property(e => e.Office)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"office\"");
            entity.Property(e => e.PartyDetailed)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"party_detailed\"");
            entity.Property(e => e.PartySimplified)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"party_simplified\"");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state\"");
            entity.Property(e => e.StateCen)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_cen\"");
            entity.Property(e => e.StateFips)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_fips\"");
            entity.Property(e => e.StateIc)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_ic\"");
            entity.Property(e => e.StatePo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_po\"");
            entity.Property(e => e.Totalvotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"totalvotes\"");
            entity.Property(e => e.Version)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"version\"");
            entity.Property(e => e.Writein)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"writein\"");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"year\"");
        });

        modelBuilder.Entity<Email>(entity =>
        {
            entity.Property(e => e.From).HasMaxLength(50);
            entity.Property(e => e.Subject).HasMaxLength(50);
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.To).HasMaxLength(50);
        });

        modelBuilder.Entity<FederalBudget>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("FederalBudget");

            entity.Property(e => e.AccountCode).HasColumnName("Account Code");
            entity.Property(e => e.AccountName)
                .HasMaxLength(142)
                .IsUnicode(false)
                .HasColumnName("Account Name");
            entity.Property(e => e.AgencyCode).HasColumnName("Agency Code");
            entity.Property(e => e.AgencyName)
                .HasMaxLength(88)
                .IsUnicode(false)
                .HasColumnName("Agency Name");
            entity.Property(e => e.BeaCategory)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("BEA Category");
            entity.Property(e => e.BureauCode).HasColumnName("Bureau Code");
            entity.Property(e => e.BureauName)
                .HasMaxLength(88)
                .IsUnicode(false)
                .HasColumnName("Bureau Name");
            entity.Property(e => e.GrantNonGgrantSplit)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("Grant NonGGrant split");
            entity.Property(e => e.OnOffBudget)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.SubfunctionCode).HasColumnName("Subfunction Code");
            entity.Property(e => e.SubfunctionTitle)
                .HasMaxLength(64)
                .IsUnicode(false)
                .HasColumnName("Subfunction Title");
            entity.Property(e => e.TreasuryAgencyCode).HasColumnName("Treasury Agency Code");
        });

        modelBuilder.Entity<FederalElection>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Candidate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidate\"");
            entity.Property(e => e.Candidatevotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidatevotes\"");
            entity.Property(e => e.CountyFips)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"county_fips\"");
            entity.Property(e => e.CountyName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"county_name\"");
            entity.Property(e => e.Mode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"mode\"");
            entity.Property(e => e.Office)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"office\"");
            entity.Property(e => e.Party)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"party\"");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state\"");
            entity.Property(e => e.StateFips)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("\"state_fips\"");
            entity.Property(e => e.StatePo)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("\"state_po\"");
            entity.Property(e => e.Totalvotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"totalvotes\"");
            entity.Property(e => e.Version)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"version\"");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"year\"");
        });

        modelBuilder.Entity<FederalElectionsState>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("FederalElectionsState");

            entity.Property(e => e.Candidate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidate\"");
            entity.Property(e => e.Candidatevotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"candidatevotes\"");
            entity.Property(e => e.Notes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"notes\"");
            entity.Property(e => e.Office)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"office\"");
            entity.Property(e => e.PartyDetailed)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"party_detailed\"");
            entity.Property(e => e.PartySimplified)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"party_simplified\"");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state\"");
            entity.Property(e => e.StateCen)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_cen\"");
            entity.Property(e => e.StateFips)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_fips\"");
            entity.Property(e => e.StateIc)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_ic\"");
            entity.Property(e => e.StatePo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"state_po\"");
            entity.Property(e => e.Totalvotes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"totalvotes\"");
            entity.Property(e => e.Version)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"version\"");
            entity.Property(e => e.Writein)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"writein\"");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("\"year\"");
        });

        modelBuilder.Entity<Pofipsmap>(entity =>
        {
            entity.HasKey(e => e.StatePo).HasName("PK_PO-FIPS-Map");

            entity.ToTable("POFIPSMap");

            entity.Property(e => e.StatePo)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("StatePO`");
            entity.Property(e => e.StateFips)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("StateFIPS");
        });

        modelBuilder.Entity<Population>(entity =>
        {
            entity.HasKey(e => new { e.Fips, e.Year });

            entity.ToTable("Population");

            entity.Property(e => e.Fips)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("fips");
            entity.Property(e => e.Year).HasColumnName("YEAR");
            entity.Property(e => e.Age04Fem).HasColumnName("AGE04_FEM");
            entity.Property(e => e.Age04Male).HasColumnName("AGE04_MALE");
            entity.Property(e => e.Age04Tot).HasColumnName("AGE04_TOT");
            entity.Property(e => e.Age1014Fem).HasColumnName("AGE1014_FEM");
            entity.Property(e => e.Age1014Male).HasColumnName("AGE1014_MALE");
            entity.Property(e => e.Age1014Tot).HasColumnName("AGE1014_TOT");
            entity.Property(e => e.Age1417Fem).HasColumnName("AGE1417_FEM");
            entity.Property(e => e.Age1417Male).HasColumnName("AGE1417_MALE");
            entity.Property(e => e.Age1417Tot).HasColumnName("AGE1417_TOT");
            entity.Property(e => e.Age1519Fem).HasColumnName("AGE1519_FEM");
            entity.Property(e => e.Age1519Male).HasColumnName("AGE1519_MALE");
            entity.Property(e => e.Age1519Tot).HasColumnName("AGE1519_TOT");
            entity.Property(e => e.Age1544Fem).HasColumnName("AGE1544_FEM");
            entity.Property(e => e.Age1544Male).HasColumnName("AGE1544_MALE");
            entity.Property(e => e.Age1544Tot).HasColumnName("AGE1544_TOT");
            entity.Property(e => e.Age16plusFem).HasColumnName("AGE16PLUS_FEM");
            entity.Property(e => e.Age16plusMale).HasColumnName("AGE16PLUS_MALE");
            entity.Property(e => e.Age16plusTot).HasColumnName("AGE16PLUS_TOT");
            entity.Property(e => e.Age1824Fem).HasColumnName("AGE1824_FEM");
            entity.Property(e => e.Age1824Male).HasColumnName("AGE1824_MALE");
            entity.Property(e => e.Age1824Tot).HasColumnName("AGE1824_TOT");
            entity.Property(e => e.Age18plusFem).HasColumnName("AGE18PLUS_FEM");
            entity.Property(e => e.Age18plusMale).HasColumnName("AGE18PLUS_MALE");
            entity.Property(e => e.Age18plusTot).HasColumnName("AGE18PLUS_TOT");
            entity.Property(e => e.Age2024Fem).HasColumnName("AGE2024_FEM");
            entity.Property(e => e.Age2024Male).HasColumnName("AGE2024_MALE");
            entity.Property(e => e.Age2024Tot).HasColumnName("AGE2024_TOT");
            entity.Property(e => e.Age2529Fem).HasColumnName("AGE2529_FEM");
            entity.Property(e => e.Age2529Male).HasColumnName("AGE2529_MALE");
            entity.Property(e => e.Age2529Tot).HasColumnName("AGE2529_TOT");
            entity.Property(e => e.Age2544Fem).HasColumnName("AGE2544_FEM");
            entity.Property(e => e.Age2544Male).HasColumnName("AGE2544_MALE");
            entity.Property(e => e.Age2544Tot).HasColumnName("AGE2544_TOT");
            entity.Property(e => e.Age3034Fem).HasColumnName("AGE3034_FEM");
            entity.Property(e => e.Age3034Male).HasColumnName("AGE3034_MALE");
            entity.Property(e => e.Age3034Tot).HasColumnName("AGE3034_TOT");
            entity.Property(e => e.Age3539Fem).HasColumnName("AGE3539_FEM");
            entity.Property(e => e.Age3539Male).HasColumnName("AGE3539_MALE");
            entity.Property(e => e.Age3539Tot).HasColumnName("AGE3539_TOT");
            entity.Property(e => e.Age4044Fem).HasColumnName("AGE4044_FEM");
            entity.Property(e => e.Age4044Male).HasColumnName("AGE4044_MALE");
            entity.Property(e => e.Age4044Tot).HasColumnName("AGE4044_TOT");
            entity.Property(e => e.Age4549Fem).HasColumnName("AGE4549_FEM");
            entity.Property(e => e.Age4549Male).HasColumnName("AGE4549_MALE");
            entity.Property(e => e.Age4549Tot).HasColumnName("AGE4549_TOT");
            entity.Property(e => e.Age4564Fem).HasColumnName("AGE4564_FEM");
            entity.Property(e => e.Age4564Male).HasColumnName("AGE4564_MALE");
            entity.Property(e => e.Age4564Tot).HasColumnName("AGE4564_TOT");
            entity.Property(e => e.Age5054Fem).HasColumnName("AGE5054_FEM");
            entity.Property(e => e.Age5054Male).HasColumnName("AGE5054_MALE");
            entity.Property(e => e.Age5054Tot).HasColumnName("AGE5054_TOT");
            entity.Property(e => e.Age513Fem).HasColumnName("AGE513_FEM");
            entity.Property(e => e.Age513Male).HasColumnName("AGE513_MALE");
            entity.Property(e => e.Age513Tot).HasColumnName("AGE513_TOT");
            entity.Property(e => e.Age5559Fem).HasColumnName("AGE5559_FEM");
            entity.Property(e => e.Age5559Male).HasColumnName("AGE5559_MALE");
            entity.Property(e => e.Age5559Tot).HasColumnName("AGE5559_TOT");
            entity.Property(e => e.Age59Fem).HasColumnName("AGE59_FEM");
            entity.Property(e => e.Age59Male).HasColumnName("AGE59_MALE");
            entity.Property(e => e.Age59Tot).HasColumnName("AGE59_TOT");
            entity.Property(e => e.Age6064Fem).HasColumnName("AGE6064_FEM");
            entity.Property(e => e.Age6064Male).HasColumnName("AGE6064_MALE");
            entity.Property(e => e.Age6064Tot).HasColumnName("AGE6064_TOT");
            entity.Property(e => e.Age6569Fem).HasColumnName("AGE6569_FEM");
            entity.Property(e => e.Age6569Male).HasColumnName("AGE6569_MALE");
            entity.Property(e => e.Age6569Tot).HasColumnName("AGE6569_TOT");
            entity.Property(e => e.Age65plusFem).HasColumnName("AGE65PLUS_FEM");
            entity.Property(e => e.Age65plusMale).HasColumnName("AGE65PLUS_MALE");
            entity.Property(e => e.Age65plusTot).HasColumnName("AGE65PLUS_TOT");
            entity.Property(e => e.Age7074Fem).HasColumnName("AGE7074_FEM");
            entity.Property(e => e.Age7074Male).HasColumnName("AGE7074_MALE");
            entity.Property(e => e.Age7074Tot).HasColumnName("AGE7074_TOT");
            entity.Property(e => e.Age7579Fem).HasColumnName("AGE7579_FEM");
            entity.Property(e => e.Age7579Male).HasColumnName("AGE7579_MALE");
            entity.Property(e => e.Age7579Tot).HasColumnName("AGE7579_TOT");
            entity.Property(e => e.Age8084Fem).HasColumnName("AGE8084_FEM");
            entity.Property(e => e.Age8084Male).HasColumnName("AGE8084_MALE");
            entity.Property(e => e.Age8084Tot).HasColumnName("AGE8084_TOT");
            entity.Property(e => e.Age85plusFem).HasColumnName("AGE85PLUS_FEM");
            entity.Property(e => e.Age85plusMale).HasColumnName("AGE85PLUS_MALE");
            entity.Property(e => e.Age85plusTot).HasColumnName("AGE85PLUS_TOT");
            entity.Property(e => e.County).HasColumnName("COUNTY");
            entity.Property(e => e.Ctyname)
                .HasMaxLength(33)
                .IsUnicode(false)
                .HasColumnName("CTYNAME");
            entity.Property(e => e.MedianAgeFem).HasColumnName("MEDIAN_AGE_FEM");
            entity.Property(e => e.MedianAgeMale).HasColumnName("MEDIAN_AGE_MALE");
            entity.Property(e => e.MedianAgeTot).HasColumnName("MEDIAN_AGE_TOT");
            entity.Property(e => e.PopestFem).HasColumnName("POPEST_FEM");
            entity.Property(e => e.PopestMale).HasColumnName("POPEST_MALE");
            entity.Property(e => e.Popestimate).HasColumnName("POPESTIMATE");
            entity.Property(e => e.State).HasColumnName("STATE");
            entity.Property(e => e.Stname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("STNAME");
            entity.Property(e => e.Sumlev).HasColumnName("SUMLEV");
            entity.Property(e => e.Under5Fem).HasColumnName("UNDER5_FEM");
            entity.Property(e => e.Under5Male).HasColumnName("UNDER5_MALE");
            entity.Property(e => e.Under5Tot).HasColumnName("UNDER5_TOT");
        });

        modelBuilder.Entity<StateFipsMapping>(entity =>
        {
            entity.HasKey(e => e.StatePo).HasName("PK__StateFip__C3BA03BB7F99DFEC");

            entity.ToTable("StateFipsMapping");

            entity.Property(e => e.StatePo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("StatePO");
            entity.Property(e => e.StateFips)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("StateFIPS");
        });

        modelBuilder.Entity<StockPriceHistory>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("StockPriceHistory");

            entity.Property(e => e.Close).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.High).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Low).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Open).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Ticker)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<StockSymbol>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Change)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("% Change");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Industry)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IpoYear).HasColumnName("IPO Year");
            entity.Property(e => e.LastSale)
                .HasColumnType("decimal(28, 0)")
                .HasColumnName("Last Sale");
            entity.Property(e => e.MarketCap).HasColumnName("Market Cap");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NetChange).HasColumnName("Net Change");
            entity.Property(e => e.Sector)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Symbol)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
