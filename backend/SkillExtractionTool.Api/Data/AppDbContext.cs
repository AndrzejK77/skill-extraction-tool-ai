using Microsoft.EntityFrameworkCore;
using SkillExtractionTool.Api.Models;

namespace SkillExtractionTool.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ExtractionResult> ExtractionResults => Set<ExtractionResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExtractionResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CvFileName).IsRequired();
            entity.Property(e => e.IfuFileName).IsRequired();
            entity.Property(e => e.ExtractedSkillsJson).IsRequired();
        });
    }
}
