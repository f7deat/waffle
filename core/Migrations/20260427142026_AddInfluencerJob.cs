using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class AddInfluencerJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InfluencerJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BudgetMax = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ContentType = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RequiredFollowers = table.Column<int>(type: "int", nullable: true),
                    Brand = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InfluencerJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InfluencerJobApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InfluencerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppliedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InfluencerJobApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InfluencerJobApplications_InfluencerJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "InfluencerJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InfluencerJobApplications_JobId",
                table: "InfluencerJobApplications",
                column: "JobId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InfluencerJobApplications");

            migrationBuilder.DropTable(
                name: "InfluencerJobs");
        }
    }
}
