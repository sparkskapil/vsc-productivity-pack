# VSC Productivity Pack

A VS Code extension providing a collection of productivity commands for developers working with Perforce and Git workflows.

## Features

### Perforce Commands

#### P4 Annotate
- Run `p4 annotate -c -u` command on the active file with a single command
- Automatically validates the file is in a Perforce workspace (checks P4CLIENT, P4PORT, P4USER)
- Generates a blame file in the temp directory (`/tmp/p4annotate/` on Linux/Mac, `%temp%/p4annotate/` on Windows)
- Opens the generated annotate/blame file in the editor
- Shows changelist numbers and usernames for each line

### Git Commands

#### Git Blame
- Run `git blame` on the active file with formatted output
- Shows commit ID (short hash), author name, and code line
- Validates file is in a Git repository and tracked by Git
- Generates a blame file in the temp directory (`/tmp/gitblame/` on Linux/Mac, `%temp%/gitblame/` on Windows)
- Opens the generated blame file automatically

## Requirements

### For Perforce Commands:
- Perforce command-line client (`p4`) must be installed and available in your PATH
- Files must be in a Perforce workspace with proper configuration:
  - P4CLIENT must be set
  - P4PORT must be set
  - P4USER must be set
- Configure using a `p4config.txt` file in your depot root or run `p4 set P4CONFIG=p4config.txt`

### For Git Commands:
- Git must be installed and available in your PATH
- File must be in a Git repository and tracked by Git

## Usage

### Perforce Annotate

1. Open a file that is part of a Perforce depot
2. Save the file (if unsaved)
3. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
4. Type "VSC PP: Perforce Annotate Current File" and select the command
5. The annotate output will be saved to a `.blame` file and opened automatically

### Git Blame

1. Open a file that is tracked in a Git repository
2. Save the file (if unsaved)
3. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
4. Type "VSC PP: Git Blame Current File" and select the command
5. The blame output will be saved to a `.blame` file and opened automatically

## Commands

| Command | Description |
|---------|-------------|
| `VSC PP: Perforce Annotate Current File` | Run p4 annotate on the active file |
| `VSC PP: Git Blame Current File` | Run git blame on the active file |
| `VSC PP: Clean Up Temporary Files` | Delete all temporary files created by VSC PP |

## Extension Settings

This extension does not currently contribute any settings.

## Known Issues

- Files must be saved before running annotate or blame commands
- Perforce commands only work with files in Perforce depot
- Git commands only work with tracked files in Git repository

## Roadmap

Future commands planned for this productivity pack:
- P4 Diff commands
- P4 Submit helpers
- Additional developer productivity tools

## Release Notes

### 1.1.0

- Added Git Blame command with commit ID, author, and code line display
- Added cleanup command to delete temporary files
- Centralized temp folder management (`/tmp/vsc-productivity-pack/` or OS equivalent)
- Enhanced validation: checks if Git file is tracked
- Added publisher field: `sparkskapil`
- Repository field added to package.json
- Refactored commands to use shared temp folder utilities

### 1.0.0

- First stable release
- MIT License added
- Production-ready Perforce Annotate command
- Refactored to VSC Productivity Pack with modular architecture
- Added P4 workspace validation (P4CLIENT, P4PORT, P4USER)
- Improved error messages
- Separated commands and utilities into modular structure

---

## For Developers

### Project Structure

```
src/
├── extension.ts          # Main entry point
├── commands/
│   ├── index.ts         # Command registration
│   └── annotate.ts      # P4 annotate implementation
└── utils/
    └── p4Client.ts      # Shared Perforce utilities
```

### Running the Extension

1. Open this project in VS Code
2. Run `npm install` to install dependencies
3. Press `F5` to open a new Extension Development Host window
4. In the new window, open a file from a Perforce workspace
5. Run the command "VSC PP: Perforce Annotate Current File"

### Building VSIX Package

```bash
npm run package
npx @vscode/vsce package
```

### Adding New Commands

1. Create a new file in `src/commands/` (e.g., `myCommand.ts`)
2. Export your command function
3. Import and register it in `src/commands/index.ts`
4. Add the command to `package.json` under `contributes.commands`

---

**Author:** Kapil Verma


### Building

```bash
npm install
npm run compile
```

**Enjoy!**

