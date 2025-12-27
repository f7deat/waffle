using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class UserAvatar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Places_Streets_StreetId",
                table: "Places");

            migrationBuilder.RenameColumn(
                name: "StreetId",
                table: "Places",
                newName: "DistrictId");

            migrationBuilder.RenameIndex(
                name: "IX_Places_StreetId",
                table: "Places",
                newName: "IX_Places_DistrictId");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "AspNetUsers",
                newName: "CreatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "AspNetUsers",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "AspNetUsers",
                type: "nvarchar(2058)",
                maxLength: 2058,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Places_Districts_DistrictId",
                table: "Places",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Places_Districts_DistrictId",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "DistrictId",
                table: "Places",
                newName: "StreetId");

            migrationBuilder.RenameIndex(
                name: "IX_Places_DistrictId",
                table: "Places",
                newName: "IX_Places_StreetId");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "AspNetUsers",
                newName: "CreatedDate");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(512)",
                oldMaxLength: 512,
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Places_Streets_StreetId",
                table: "Places",
                column: "StreetId",
                principalTable: "Streets",
                principalColumn: "Id");
        }
    }
}
