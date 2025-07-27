using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recosys.Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedAddressTableSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Line2",
                table: "CustomerAddresses");

            migrationBuilder.RenameColumn(
                name: "Line1",
                table: "CustomerAddresses",
                newName: "Address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "CustomerAddresses",
                newName: "Line1");

            migrationBuilder.AddColumn<string>(
                name: "Line2",
                table: "CustomerAddresses",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
