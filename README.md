# Prompt

A command-line tool and API for managing skills and generating prompts with skill integration for LLM interactions.

## Features

- **N-Tier Architecture**: Clean separation of concerns with Core, Infrastructure, API, and CLI layers
- **Skill Management**: Full CRUD operations for managing skills via CLI or API
- **Prompt Generation**: Create prompts with optional skill integration
- **Git Integration**: Clone repositories and extract their contents for LLM analysis
- **Clipboard Integration**: Automatically copy prompts to clipboard for easy LLM interaction
- **Persistent Storage**: SQLite database stored in user folder for persistence across upgrades
- **RESTful API**: Production-grade API with Swagger documentation
- **Microsoft Extensions**: Built with dependency injection, logging, and configuration

## Architecture

```
Prompt/
├── src/
│   ├── Prompt.Core/          # Domain entities and interfaces
│   ├── Prompt.Infrastructure/ # EF Core, repositories, SQLite
│   ├── Prompt.Api/           # REST API with Swagger
│   └── Prompt.Cli/           # Command-line interface
```

## Getting Started

### Prerequisites

- .NET 10.0 SDK or later

### Build

```bash
dotnet build
```

### Run CLI

```bash
cd src/Prompt.Cli
dotnet run
```

### Run API

```bash
cd src/Prompt.Api
dotnet run
```

The API will be available at `http://localhost:5119` with Swagger UI at `http://localhost:5119/swagger`

## CLI Usage

### Skill Management

#### List all skills
```bash
dotnet run -- skill list
```

#### Add a new skill
```bash
dotnet run -- skill add --name "C# Expert" --description "Expert in C# programming"
```

#### Get a skill by ID
```bash
dotnet run -- skill get 1
```

#### Update a skill
```bash
dotnet run -- skill update 1 --name "New Name" --description "New Description"
```

#### Delete a skill
```bash
dotnet run -- skill delete 1
```

### Prompt Generation

#### Create a prompt without skills
```bash
dotnet run -- prompt "Create a REST API for managing products"
```

#### Create a prompt with skills
```bash
dotnet run -- prompt "Create a REST API" --skills 1 2
# or short form:
dotnet run -- prompt "Create a REST API" -s 1 2
```

#### Create a prompt with Git repository integration
```bash
dotnet run -- prompt "Analyze this code" --git-repo https://github.com/user/repo
# or short form:
dotnet run -- prompt "Analyze this code" -g https://github.com/user/repo

# Multiple repositories
dotnet run -- prompt "Compare these projects" -g https://github.com/user/repo1 https://github.com/user/repo2
```

When using the `--git-repo` option, the repositories will be cloned to the current directory and their contents will be written to a `repository-contents.txt` file that can be uploaded to an LLM along with your prompt.

#### Combine skills and repositories
```bash
dotnet run -- prompt "Review this code" -s 1 2 -g https://github.com/user/repo
```

The prompt will be copied to your clipboard and displayed in the console, including the specified skills.

## API Endpoints

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/{id}` - Get a skill by ID
- `POST /api/skills` - Create a new skill
- `PUT /api/skills/{id}` - Update a skill
- `DELETE /api/skills/{id}` - Delete a skill

### Example API Request

```bash
# Get all skills
curl http://localhost:5119/api/skills

# Create a skill
curl -X POST http://localhost:5119/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"C# Expert","description":"Expert in C# programming"}'
```

## Database

The application uses SQLite for persistence. The database file is stored at:
- Linux/macOS: `~/.prompt/skills.db`
- Windows: `%USERPROFILE%\.prompt\skills.db`

This ensures your skills persist across application upgrades.

## Technology Stack

- **.NET 10.0**: Latest .NET runtime
- **System.CommandLine**: Modern command-line interface
- **Entity Framework Core**: ORM for database operations
- **SQLite**: Lightweight, file-based database
- **LibGit2Sharp**: Git repository operations and cloning
- **Swashbuckle/Swagger**: API documentation
- **Microsoft Extensions**: Dependency injection, logging, configuration
- **TextCopy**: Cross-platform clipboard operations

## Publishing

### Publish CLI as a standalone executable

To create a standalone executable that can be run without the .NET SDK:

```bash
# Windows
cd src/Prompt.Cli
dotnet publish -c Release -r win-x64 --self-contained -p:PublishSingleFile=true

# Linux
cd src/Prompt.Cli
dotnet publish -c Release -r linux-x64 --self-contained -p:PublishSingleFile=true

# macOS
cd src/Prompt.Cli
dotnet publish -c Release -r osx-x64 --self-contained -p:PublishSingleFile=true
```

The executable will be in `src/Prompt.Cli/bin/Release/net10.0/{runtime}/publish/`

### Install CLI globally

```bash
cd src/Prompt.Cli
dotnet pack -c Release
dotnet tool install --global --add-source ./bin/Release Prompt.Cli
```

## Development

### Project Structure

- **Prompt.Core**: Contains domain entities and repository interfaces
- **Prompt.Infrastructure**: Implements data access using EF Core and SQLite
- **Prompt.Api**: ASP.NET Core Web API with controllers and Swagger
- **Prompt.Cli**: Command-line interface using System.CommandLine

### Adding New Features

1. Add domain entities to `Prompt.Core/Entities`
2. Define repository interfaces in `Prompt.Core/Interfaces`
3. Implement repositories in `Prompt.Infrastructure/Repositories`
4. Create API controllers in `Prompt.Api/Controllers`
5. Add CLI commands in `Prompt.Cli/Program.cs`

## License

This project is licensed under the MIT License.

