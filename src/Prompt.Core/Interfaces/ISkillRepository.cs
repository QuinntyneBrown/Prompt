using Prompt.Core.Entities;

namespace Prompt.Core.Interfaces;

public interface ISkillRepository
{
    Task<Skill?> GetByIdAsync(int id);
    Task<IEnumerable<Skill>> GetAllAsync();
    Task<Skill> AddAsync(Skill skill);
    Task UpdateAsync(Skill skill);
    Task DeleteAsync(int id);
}
