using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recosys.Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerDetailsTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId",
                table: "CustomerAddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                table: "Customers");

            migrationBuilder.RenameTable(
                name: "Customers",
                newName: "CustomerDetails");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomerDetails",
                table: "CustomerDetails",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAddresses_CustomerDetails_CustomerId",
                table: "CustomerAddresses",
                column: "CustomerId",
                principalTable: "CustomerDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAddresses_CustomerDetails_CustomerId",
                table: "CustomerAddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomerDetails",
                table: "CustomerDetails");

            migrationBuilder.RenameTable(
                name: "CustomerDetails",
                newName: "Customers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                table: "Customers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId",
                table: "CustomerAddresses",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
