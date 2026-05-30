using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waffle.Migrations
{
    /// <inheritdoc />
    public partial class AddActionUrlToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[Notifications]', N'U') IS NOT NULL
AND COL_LENGTH('Notifications', 'ActionUrl') IS NULL
BEGIN
    ALTER TABLE [Notifications] ADD [ActionUrl] nvarchar(1024) NULL;
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[Notifications]', N'U') IS NOT NULL
AND COL_LENGTH('Notifications', 'ActionUrl') IS NOT NULL
BEGIN
    ALTER TABLE [Notifications] DROP COLUMN [ActionUrl];
END
");
        }
    }
}
