using LibGit2Sharp;
using Prompt.Core.Interfaces;

namespace Prompt.Infrastructure.Services;

public class GitService : IGitService
{
    public async Task<string> CloneRepositoryAsync(string repositoryUrl, string outputPath)
    {
        return await Task.Run(() =>
        {
            var clonePath = Path.Combine(outputPath, GetRepositoryName(repositoryUrl));
            
            // If directory already exists, remove it to do a fresh clone
            if (Directory.Exists(clonePath))
            {
                Directory.Delete(clonePath, true);
            }

            Repository.Clone(repositoryUrl, clonePath);
            
            return clonePath;
        });
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
