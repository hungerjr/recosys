using Microsoft.EntityFrameworkCore;
using Recosys.Backend.Domain.Entities.Customer;
using Recosys.Backend.Domain.Entities.Order;
using Recosys.Backend.Domain.Entities.Products;
using Recosys.Backend.Domain.Entities.User;
using System;

namespace Recosys.Backend.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<ProductDetails> Products { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<CustomerDetails> CustomerDetails { get; set; }
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<AWBData> AWBData { get; set; }
        public DbSet<OrderDetails> Order { get; set; }
        public DbSet<OrderActivity> OrderActivity { get; set; }
        public DbSet<OrderProduct> OrderProduct { get; set; }
        public DbSet<Shipment> Shipment { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure UserInfo → UserRole (many-to-one)
            modelBuilder.Entity<UserInfo>()
                .HasOne(u => u.UserRole)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.UserRoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seeding roles
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, Name = "Admin" },
                new UserRole { Id = 2, Name = "User" }
            );

            // Seeding admin user
            modelBuilder.Entity<UserInfo>().HasData(
                new UserInfo
                {
                    Id = 1,
                    PasswordHash = "Admin@123",
                    Name = "Admin User",
                    CreatedAt = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc),
                    Email = "admin@recosys.com",
                    Phone = "9621311586",
                    UserRoleId = 1,
                    IsActive = true,
                    PasswordResetToken = null,
                    ResetTokenExpiry = null,
                }
            );

            // PasswordResetToken → User (many-to-one)
            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(t => t.User)
                .WithMany(u => u.PasswordResetTokens)
                .HasForeignKey(t => t.UserInfoId)
                .OnDelete(DeleteBehavior.Cascade);

            //
            modelBuilder.Entity<CustomerDetails>()
            .HasMany(c => c.Addresses)
            .WithOne(a => a.Customer)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
