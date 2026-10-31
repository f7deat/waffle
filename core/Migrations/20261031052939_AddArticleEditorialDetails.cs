using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class AddArticleEditorialDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArticleEditorialDetails",
                columns: table => new
                {
                    ArticleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpotlightLabel = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    HeroCaption = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    AuthorName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    AuthorHandle = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    AuthorTitle = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    AuthorAvatar = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    AuthorBio = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    ReadingMinutes = table.Column<int>(type: "int", nullable: true),
                    TopicsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RouteTitle = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    RouteDescription = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    RouteAddress = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    RouteMapUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    RouteDownloadUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    RouteStopsJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleEditorialDetails", x => x.ArticleId);
                    table.ForeignKey(
                        name: "FK_ArticleEditorialDetails_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArticleEditorialDetails");
        }
    }
}
