using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReCoSys.ECommerce.Application.Interfaces;
using ReCoSys.ECommerce.Application.Services;
using ReCoSys.ECommerce.Infrastructure.Persistence;
using ReCoSys.ECommerce.Infrastructure.Repositories;
using ReCoSys.ECommerce.Infrastructure.Services;

namespace ReCoSys.ECommerce.Api.Extensions
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Register repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPasswordResetRepository, PasswordResetRepository>();

            // Register Service
            services.AddScoped<PasswordResetService>();

            return services;
        }
    }
}
