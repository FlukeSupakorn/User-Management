using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using user_management.API.Models;

namespace user_management.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ModulePermission> ModulePermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationship between Users and Roles (one-to-many)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            // Configure relationship between Users and ModulePermissions (one-to-many)
            modelBuilder.Entity<ModulePermission>()
                .HasOne(mp => mp.User)
                .WithMany()
                .HasForeignKey(mp => mp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ModulePermission table
            modelBuilder.Entity<ModulePermission>()
                .HasIndex(mp => new { mp.UserId, mp.ModuleName })
                .IsUnique();

        }
    }
}