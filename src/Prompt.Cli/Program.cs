using System.CommandLine;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Prompt.Core.Entities;
using Prompt.Core.Interfaces;
using Prompt.Infrastructure;
using Prompt.Infrastructure.Data;
using TextCopy;

// Configure database path in user folder
var userFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
var dbPath = Path.Combine(userFolder, ".prompt", "skills.db");
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);
var connectionString = $"Data Source={dbPath}";

// Configure services
var services = new ServiceCollection();
services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.SetMinimumLevel(LogLevel.Warning);
});

services.AddInfrastructure(connectionString);

var serviceProvider = services.BuildServiceProvider();

// Ensure database is created
using (var scope = serviceProvider.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PromptDbContext>();
    context.Database.EnsureCreated();
}

var skillRepository = serviceProvider.GetRequiredService<ISkillRepository>();
var gitService = serviceProvider.GetRequiredService<IGitService>();

// Create root command
var rootCommand = new RootCommand("Prompt CLI - Manage skills and generate prompts");

// === PROMPT COMMAND ===
var promptCommand = new Command("prompt", "Execute a prompt with optional skills");
var promptArgument = new Argument<string>("prompt", "The prompt text to use");
var skillsOption = new Option<int[]>("--skills", () => Array.Empty<int>(), "Skill IDs to include");
skillsOption.AddAlias("-s");
skillsOption.AllowMultipleArgumentsPerToken = true;

var gitRepoOption = new Option<string[]>("--git-repo", () => Array.Empty<string>(), "Git repository URLs to clone");
gitRepoOption.AddAlias("-g");
gitRepoOption.AllowMultipleArgumentsPerToken = true;

promptCommand.AddArgument(promptArgument);
promptCommand.AddOption(skillsOption);
promptCommand.AddOption(gitRepoOption);
promptCommand.SetHandler(async (string prompt, int[] skills, string[] gitRepos) =>
{
    try
    {
        var output = prompt;

        if (skills != null && skills.Length > 0)
        {
            var skillsSection = "\n\nSkills to use when responding:\n";
            foreach (var skillId in skills)
            {
                var skill = await skillRepository.GetByIdAsync(skillId);
                if (skill != null)
                {
                    skillsSection += $"- {skill.Name}: {skill.Description}\n";
                }
            }
            output += skillsSection;
        }

        // Handle git repositories
        if (gitRepos != null && gitRepos.Length > 0)
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var repoContents = new List<string>();

            foreach (var repoUrl in gitRepos)
            {
                try
                {
                    Console.WriteLine($"Cloning repository: {repoUrl}...");
                    var clonedPath = await gitService.CloneRepositoryAsync(repoUrl, currentDirectory);
                    Console.WriteLine($"✓ Repository cloned to: {clonedPath}");

                    // Read repository contents and add to output
                    var repoContent = await ReadRepositoryContentsAsync(clonedPath);
                    repoContents.Add(repoContent);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"✗ Failed to clone {repoUrl}: {ex.Message}");
                }
            }

            // Write repository contents to a text file
            if (repoContents.Any())
            {
                var outputFileName = Path.Combine(currentDirectory, "repository-contents.txt");
                await File.WriteAllTextAsync(outputFileName, string.Join("\n\n" + new string('=', 80) + "\n\n", repoContents));
                Console.WriteLine($"✓ Repository contents written to: {outputFileName}");
            }
        }

        try
        {
            await ClipboardService.SetTextAsync(output);
            Console.WriteLine("✓ Prompt copied to clipboard!");
        }
        catch
        {
            Console.WriteLine("⚠ Could not copy to clipboard (no clipboard service available)");
        }
        
        Console.WriteLine();
        Console.WriteLine("=== Prompt Content ===");
        Console.WriteLine(output);
        Console.WriteLine("======================");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}, promptArgument, skillsOption, gitRepoOption);

rootCommand.AddCommand(promptCommand);

// === SKILL COMMAND ===
var skillCommand = new Command("skill", "Manage skills");

// List skills
var listCommand = new Command("list", "List all skills");
listCommand.SetHandler(async () =>
{
    try
    {
        var skills = await skillRepository.GetAllAsync();
        if (!skills.Any())
        {
            Console.WriteLine("No skills found.");
            return;
        }

        Console.WriteLine("Skills:");
        Console.WriteLine("ID\tName\t\t\tDescription");
        Console.WriteLine("--\t----\t\t\t-----------");
        foreach (var skill in skills)
        {
            Console.WriteLine($"{skill.Id}\t{skill.Name,-20}\t{skill.Description}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
});
skillCommand.AddCommand(listCommand);

// Add skill
var addCommand = new Command("add", "Add a new skill");
var nameOption = new Option<string>("--name", "Skill name") { IsRequired = true };
var descriptionOption = new Option<string>("--description", "Skill description") { IsRequired = true };
addCommand.AddOption(nameOption);
addCommand.AddOption(descriptionOption);
addCommand.SetHandler(async (string name, string description) =>
{
    try
    {
        var skill = new Skill
        {
            Name = name,
            Description = description
        };
        var createdSkill = await skillRepository.AddAsync(skill);
        Console.WriteLine($"✓ Skill '{createdSkill.Name}' added with ID {createdSkill.Id}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}, nameOption, descriptionOption);
skillCommand.AddCommand(addCommand);

// Get skill
var getCommand = new Command("get", "Get a skill by ID");
var idArgument = new Argument<int>("id", "Skill ID");
getCommand.AddArgument(idArgument);
getCommand.SetHandler(async (int id) =>
{
    try
    {
        var skill = await skillRepository.GetByIdAsync(id);
        if (skill == null)
        {
            Console.WriteLine($"Skill with ID {id} not found.");
            return;
        }

        Console.WriteLine($"ID: {skill.Id}");
        Console.WriteLine($"Name: {skill.Name}");
        Console.WriteLine($"Description: {skill.Description}");
        Console.WriteLine($"Created: {skill.CreatedAt}");
        if (skill.UpdatedAt.HasValue)
            Console.WriteLine($"Updated: {skill.UpdatedAt}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}, idArgument);
skillCommand.AddCommand(getCommand);

// Update skill
var updateCommand = new Command("update", "Update a skill");
var updateIdArgument = new Argument<int>("id", "Skill ID");
var updateNameOption = new Option<string?>("--name", "Skill name");
var updateDescriptionOption = new Option<string?>("--description", "Skill description");
updateCommand.AddArgument(updateIdArgument);
updateCommand.AddOption(updateNameOption);
updateCommand.AddOption(updateDescriptionOption);
updateCommand.SetHandler(async (int id, string? name, string? description) =>
{
    try
    {
        var skill = await skillRepository.GetByIdAsync(id);
        if (skill == null)
        {
            Console.WriteLine($"Skill with ID {id} not found.");
            return;
        }

        if (!string.IsNullOrWhiteSpace(name))
            skill.Name = name;
        if (!string.IsNullOrWhiteSpace(description))
            skill.Description = description;

        await skillRepository.UpdateAsync(skill);
        Console.WriteLine($"✓ Skill {id} updated successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}, updateIdArgument, updateNameOption, updateDescriptionOption);
skillCommand.AddCommand(updateCommand);

// Delete skill
var deleteCommand = new Command("delete", "Delete a skill");
var deleteIdArgument = new Argument<int>("id", "Skill ID");
deleteCommand.AddArgument(deleteIdArgument);
deleteCommand.SetHandler(async (int id) =>
{
    try
    {
        var skill = await skillRepository.GetByIdAsync(id);
        if (skill == null)
        {
            Console.WriteLine($"Skill with ID {id} not found.");
            return;
        }

        await skillRepository.DeleteAsync(id);
        Console.WriteLine($"✓ Skill {id} deleted successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}, deleteIdArgument);
skillCommand.AddCommand(deleteCommand);

rootCommand.AddCommand(skillCommand);

// Helper function to read repository contents
static async Task<string> ReadRepositoryContentsAsync(string repositoryPath)
{
    var output = new System.Text.StringBuilder();
    var repoName = Path.GetFileName(repositoryPath);
    
    output.AppendLine($"Repository: {repoName}");
    output.AppendLine($"Path: {repositoryPath}");
    output.AppendLine();
    
    // Read all text files in the repository
    var textExtensions = new[] { ".cs", ".txt", ".md", ".json", ".yml", ".yaml", ".xml", ".config", ".js", ".ts", ".py", ".java", ".go", ".rs", ".cpp", ".h", ".html", ".css" };
    var files = Directory.GetFiles(repositoryPath, "*.*", SearchOption.AllDirectories)
        .Where(f => !f.Contains("/.git/") && !f.Contains("\\.git\\"))
        .Where(f => textExtensions.Contains(Path.GetExtension(f).ToLower()))
        .OrderBy(f => f);
    
    foreach (var file in files)
    {
        try
        {
            var relativePath = Path.GetRelativePath(repositoryPath, file);
            output.AppendLine($"--- File: {relativePath} ---");
            var content = await File.ReadAllTextAsync(file);
            output.AppendLine(content);
            output.AppendLine();
        }
        catch (Exception ex)
        {
            output.AppendLine($"Error reading {file}: {ex.Message}");
        }
    }
    
    return output.ToString();
}

// Execute
return await rootCommand.InvokeAsync(args);
