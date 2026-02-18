using Microsoft.AspNetCore.Mvc;
using Prompt.Core.Entities;
using Prompt.Core.Interfaces;

namespace Prompt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly ISkillRepository _skillRepository;
    private readonly ILogger<SkillsController> _logger;

    public SkillsController(ISkillRepository skillRepository, ILogger<SkillsController> logger)
    {
        _skillRepository = skillRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Skill>>> GetAll()
    {
        try
        {
            var skills = await _skillRepository.GetAllAsync();
            return Ok(skills);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving skills");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Skill>> GetById(int id)
    {
        try
        {
            var skill = await _skillRepository.GetByIdAsync(id);
            if (skill == null)
                return NotFound();

            return Ok(skill);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving skill {SkillId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Skill>> Create([FromBody] Skill skill)
    {
        try
        {
            var createdSkill = await _skillRepository.AddAsync(skill);
            return CreatedAtAction(nameof(GetById), new { id = createdSkill.Id }, createdSkill);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating skill");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Skill skill)
    {
        try
        {
            if (id != skill.Id)
                return BadRequest("ID mismatch");

            var existingSkill = await _skillRepository.GetByIdAsync(id);
            if (existingSkill == null)
                return NotFound();

            await _skillRepository.UpdateAsync(skill);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating skill {SkillId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var skill = await _skillRepository.GetByIdAsync(id);
            if (skill == null)
                return NotFound();

            await _skillRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting skill {SkillId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
