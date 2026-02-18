using Microsoft.EntityFrameworkCore;
using Prompt.Core.Entities;
using Prompt.Core.Interfaces;
using Prompt.Infrastructure.Data;

namespace Prompt.Infrastructure.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly PromptDbContext _context;

    public SkillRepository(PromptDbContext context)
    {
        _context = context;
    }

    public async Task<Skill?> GetByIdAsync(int id)
    {
        return await _context.Skills.FindAsync(id);
    }

    public async Task<IEnumerable<Skill>> GetAllAsync()
    {
        return await _context.Skills.OrderBy(s => s.Name).ToListAsync();
    }

    public async Task<Skill> AddAsync(Skill skill)
    {
        skill.CreatedAt = DateTime.UtcNow;
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();
        return skill;
    }

    public async Task UpdateAsync(Skill skill)
    {
        skill.UpdatedAt = DateTime.UtcNow;
        _context.Skills.Update(skill);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill != null)
        {
            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
        }
    }
}
