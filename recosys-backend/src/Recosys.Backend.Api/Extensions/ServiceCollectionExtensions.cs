using Microsoft.Extensions.DependencyInjection;

namespace Recosys.Backend.Api.Extensions
{
    public static class ApplicationServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Add business services, CQRS handlers, etc.
            return services;
        }
    }
}