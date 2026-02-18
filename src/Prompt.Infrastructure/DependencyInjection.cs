using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Prompt.Core.Interfaces;
using Prompt.Infrastructure.Data;
using Prompt.Infrastructure.Repositories;

namespace Prompt.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PromptDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<ISkillRepository, SkillRepository>();

        return services;
    }
}
