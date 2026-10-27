using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Waffle.Data;

#nullable disable

namespace Waffle.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261027203900_AddArticleSchedule")]
public partial class AddArticleSchedule : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<DateTimeOffset>(
            name: "ScheduledAt",
            table: "Articles",
            type: "datetimeoffset",
            nullable: true);

        migrationBuilder.Sql("""
            UPDATE Articles
            SET ScheduledAt = TODATETIMEOFFSET(PublishedAt, '+00:00'),
                PublishedAt = NULL
            WHERE PublishedAt > SYSUTCDATETIME();
            """);

        migrationBuilder.CreateIndex(
            name: "IX_Articles_ScheduledAt",
            table: "Articles",
            column: "ScheduledAt");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            UPDATE Articles
            SET PublishedAt = CONVERT(datetime2, SWITCHOFFSET(ScheduledAt, '+00:00'))
            WHERE ScheduledAt IS NOT NULL AND PublishedAt IS NULL;
            """);

        migrationBuilder.DropIndex(
            name: "IX_Articles_ScheduledAt",
            table: "Articles");

        migrationBuilder.DropColumn(
            name: "ScheduledAt",
            table: "Articles");
    }
}
