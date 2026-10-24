using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class SocialAccountTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialAccount_AspNetUsers_UserId",
                table: "SocialAccount");

            migrationBuilder.DropForeignKey(
                name: "FK_SocialAccount_SocialPlatforms_SocialPlatformId",
                table: "SocialAccount");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SocialAccount",
                table: "SocialAccount");

            migrationBuilder.RenameTable(
                name: "SocialAccount",
                newName: "SocialAccounts");

            migrationBuilder.RenameIndex(
                name: "IX_SocialAccount_UserId",
                table: "SocialAccounts",
                newName: "IX_SocialAccounts_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SocialAccount_SocialPlatformId",
                table: "SocialAccounts",
                newName: "IX_SocialAccounts_SocialPlatformId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SocialAccounts",
                table: "SocialAccounts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialAccounts_AspNetUsers_UserId",
                table: "SocialAccounts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SocialAccounts_SocialPlatforms_SocialPlatformId",
                table: "SocialAccounts",
                column: "SocialPlatformId",
                principalTable: "SocialPlatforms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialAccounts_AspNetUsers_UserId",
                table: "SocialAccounts");

            migrationBuilder.DropForeignKey(
                name: "FK_SocialAccounts_SocialPlatforms_SocialPlatformId",
                table: "SocialAccounts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SocialAccounts",
                table: "SocialAccounts");

            migrationBuilder.RenameTable(
                name: "SocialAccounts",
                newName: "SocialAccount");

            migrationBuilder.RenameIndex(
                name: "IX_SocialAccounts_UserId",
                table: "SocialAccount",
                newName: "IX_SocialAccount_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SocialAccounts_SocialPlatformId",
                table: "SocialAccount",
                newName: "IX_SocialAccount_SocialPlatformId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SocialAccount",
                table: "SocialAccount",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialAccount_AspNetUsers_UserId",
                table: "SocialAccount",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SocialAccount_SocialPlatforms_SocialPlatformId",
                table: "SocialAccount",
                column: "SocialPlatformId",
                principalTable: "SocialPlatforms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
