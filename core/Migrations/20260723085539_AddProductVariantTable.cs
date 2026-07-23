using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariantTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductVariants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    SKU = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true),
                    SalePrice = table.Column<decimal>(type: "money", nullable: true),
                    UnitInStock = table.Column<int>(type: "int", nullable: true),
                    Thumbnail = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVariants_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IDX_ProductVariant_ProductId",
                table: "ProductVariants",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductVariants");
        }
    }
}
