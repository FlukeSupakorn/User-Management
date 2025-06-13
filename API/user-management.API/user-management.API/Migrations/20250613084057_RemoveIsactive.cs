﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace user_management.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsactive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Permissions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Permissions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
