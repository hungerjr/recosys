using Microsoft.EntityFrameworkCore;
using ReCoSys.ECommerce.Domain.Entities;
using System;

namespace ReCoSys.ECommerce.Infrastructure.Persistence
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
                    Username = "admin",
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
        }
    }
}
