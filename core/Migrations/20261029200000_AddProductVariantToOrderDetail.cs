using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Waffle.Data;

#nullable disable

namespace Waffle.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261029200000_AddProductVariantToOrderDetail")]
public partial class AddProductVariantToOrderDetail : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "ProductVariantId",
            table: "OrderDetails",
            type: "uniqueidentifier",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ProductVariantId",
            table: "OrderDetails");
    }
}
