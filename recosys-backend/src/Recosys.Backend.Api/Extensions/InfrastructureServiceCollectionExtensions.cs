using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Recosys.Backend.Application.Interfaces.Customer;
using Recosys.Backend.Application.Interfaces.Products;
using Recosys.Backend.Application.Interfaces.User;
using Recosys.Backend.Application.Services;
using Recosys.Backend.Infrastructure.Persistence;
using Recosys.Backend.Infrastructure.Repositories.Customer;
using Recosys.Backend.Infrastructure.Repositories.Products;
using Recosys.Backend.Infrastructure.Repositories.User;
using Recosys.Backend.Infrastructure.Services;

namespace Recosys.Backend.Api.Extensions
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
            services.AddScoped<ICustomerRepository, CustomerRepository>();

            // Register Service
            services.AddScoped<PasswordResetService>();

            return services;
        }
    }
}
