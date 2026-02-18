namespace Prompt.Core.Interfaces;

public interface IGitService
{
    Task<string> CloneRepositoryAsync(string repositoryUrl, string outputPath);
}
