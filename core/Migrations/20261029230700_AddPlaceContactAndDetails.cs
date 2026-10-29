using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Waffle.Data;

#nullable disable

namespace Waffle.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261029230700_AddPlaceContactAndDetails")]
public partial class AddPlaceContactAndDetails : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Amenities",
            table: "Places",
            type: "nvarchar(max)",
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "OpeningHours",
            table: "Places",
            type: "nvarchar(256)",
            maxLength: 256,
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "PhoneNumber",
            table: "Places",
            type: "nvarchar(64)",
            maxLength: 64,
            nullable: true);

        migrationBuilder.AddColumn<decimal>(
            name: "PriceFrom",
            table: "Places",
            type: "decimal(18,2)",
            nullable: true);

        migrationBuilder.AddColumn<decimal>(
            name: "PriceTo",
            table: "Places",
            type: "decimal(18,2)",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "Amenities", table: "Places");
        migrationBuilder.DropColumn(name: "OpeningHours", table: "Places");
        migrationBuilder.DropColumn(name: "PhoneNumber", table: "Places");
        migrationBuilder.DropColumn(name: "PriceFrom", table: "Places");
        migrationBuilder.DropColumn(name: "PriceTo", table: "Places");
    }
}
