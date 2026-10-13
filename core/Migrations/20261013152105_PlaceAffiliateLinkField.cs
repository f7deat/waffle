using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class PlaceAffiliateLinkField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AffiliateLink",
                table: "Places",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Places",
                type: "decimal(10,7)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Places",
                type: "decimal(10,7)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AffiliateLink",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Places");
        }
    }
}
