using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Waffle.Data;

#nullable disable

namespace Waffle.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261029224858_CommentModeration")]
public partial class CommentModeration : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "IsOfficialResponse",
            table: "Comments",
            type: "bit",
            nullable: false,
            defaultValue: false);

        migrationBuilder.AddColumn<bool>(
            name: "IsPinned",
            table: "Comments",
            type: "bit",
            nullable: false,
            defaultValue: false);

        migrationBuilder.CreateTable(
            name: "CommentReports",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                CommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CommentReports", x => x.Id);
                table.ForeignKey(
                    name: "FK_CommentReports_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_CommentReports_Comments_CommentId",
                    column: x => x.CommentId,
                    principalTable: "Comments",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "CommentModerationRules",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                Pattern = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                Action = table.Column<int>(type: "int", nullable: false),
                IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                MatchCount = table.Column<int>(type: "int", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_CommentModerationRules", x => x.Id));

        migrationBuilder.CreateIndex(
            name: "IX_CommentReports_CommentId_UserId",
            table: "CommentReports",
            columns: new[] { "CommentId", "UserId" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_CommentReports_UserId",
            table: "CommentReports",
            column: "UserId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "CommentModerationRules");
        migrationBuilder.DropTable(name: "CommentReports");
        migrationBuilder.DropColumn(name: "IsOfficialResponse", table: "Comments");
        migrationBuilder.DropColumn(name: "IsPinned", table: "Comments");
    }
}
