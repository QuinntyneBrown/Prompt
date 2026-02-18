using QuinntyneBrown.Git.Core;
using Prompt.Core.Interfaces;

namespace Prompt.Infrastructure.Services;

public class GitService : IGitService
{
    public Task<string> CloneRepositoryAsync(string repositoryUrl, string outputPath)
    {
        try
        {
            var clonePath = Path.Combine(outputPath, GetRepositoryName(repositoryUrl));
            
            // Clone the repository (LibGit2Sharp will fail if directory exists)
            Repository.Clone(repositoryUrl, clonePath);
            
            return Task.FromResult(clonePath);
        }
        catch (UriFormatException)
        {
            throw new ArgumentException($"Invalid repository URL format: {repositoryUrl}", nameof(repositoryUrl));
        }
        catch (NameConflictException)
        {
            throw new InvalidOperationException($"A directory already exists at the target location. Please remove it first or use a different location.");
        }
    }

    private string GetRepositoryName(string repositoryUrl)
    {
        // Extract repository name from URL
        // e.g., "https://github.com/user/repo.git" -> "repo"
        var uri = new Uri(repositoryUrl.EndsWith(".git") ? repositoryUrl : repositoryUrl + ".git");
        var repoName = Path.GetFileNameWithoutExtension(uri.AbsolutePath);
        return repoName;
    }
}
