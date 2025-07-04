# Instructions Template for AI Projects

## Overview
This template captures best practices for communicating with AI assistants on complex projects, especially when dealing with token limits and file generation.

## Key Communication Strategies

### 1. Token Limit Management
**Problem**: AI assistants have token limits that can cause incomplete file generation or errors when creating large files.

**Solution**: Request file creation in manageable chunks.

**Example Request**:
```
"You keep running into your token limit and messing up the files you create, so please create different files for different tasks, so that when I type continue you can work on the file and complete it correctly. Or better yet, create file chunks which combined result in the full file. Ensure you have enough tokens to complete each file."
```

### 2. Project Structure Planning
**Best Practice**: Start with clear project requirements and ask for a structured approach.

**Example Request**:
```
"I've setup a repo in github [URL] to host using github pages. Please suggest a good way to create the site with easy data management for the community."
```

### 3. File Generation Strategy
**Best Practice**: Ask for files to be split into logical parts that can be completed without hitting limits.

**Effective Approach**:
- Part 1: Overview & core HTML files
- Part 2A: Data files (first chunk)
- Part 2B: Data files (continuation)
- Part 2C: Data files (completion)
- Part 3: CSS styles
- Part 4: JavaScript files
- Part 5: Documentation
- Part 6: Configuration files

### 4. Continuation Requests
**Simple and Effective**: Just type "continue" to proceed with the next part.

### 5. Correction Requests
**Example**:
```
"There's a mistake in your analysis. [Explain the error]. Also please suggest how can I make this table easily editable by the community online."
```

## Project Template Structure

### Initial Request Format
```
1. Project Goal: [Clear description]
2. Technical Requirements: [Platform, framework, constraints]
3. User Requirements: [Who will use it, how they'll contribute]
4. Special Considerations: [Community editing, no backend, etc.]
```

### File Generation Request Format
```
"Please create [specific functionality] for [project name]. 
- Split into manageable parts if needed
- Ensure each part is complete and functional
- Provide clear instructions for assembly
```

## Example: COTC Project Flow

1. **Initial Request**: Create awakening stone guide with community editing
2. **AI Response**: Provided HTML table and markdown
3. **Token Limit Issue**: Files were incomplete
4. **Solution Request**: "Create different files for different tasks"
5. **AI Response**: Split into 6 parts with clear structure
6. **Continuation**: Simple "continue" commands to complete each part

## Best Practices Summary

1. **Be Explicit About Constraints**
   - "Ensure you have enough tokens to complete each file"
   - "Create file chunks which combined result in the full file"

2. **Request Structured Output**
   - Ask for numbered parts
   - Request clear file paths and names
   - Ask for assembly instructions

3. **Provide Context**
   - Share repository URLs
   - Explain the end goal
   - Describe who will use it

4. **Iterative Refinement**
   - Point out mistakes clearly
   - Ask for specific improvements
   - Request additional features as needed

5. **Documentation Request**
   - "Create a claude.md file for claude code to create the site"
   - Ask for whatever additional files might be needed

## Template for Future Projects

```markdown
# Project: [Name]

## Goal
[Clear description of what you want to build]

## Requirements
- Platform: [GitHub Pages, etc.]
- Users: [Who will use/maintain it]
- Features: [List key features]
- Constraints: [No backend, static only, etc.]

## Request
Please create [project description]. 

Important:
1. Split files into manageable chunks to avoid token limits
2. Each part should be complete and functional
3. Provide clear instructions for assembly
4. Create a setup guide for automated tools (like claude.md)

Start with an overview of the structure, then create files in parts I can continue through.
```

## Key Phrases That Work Well

- "Continue" - Simple continuation
- "Create different files for different tasks" - Avoids token issues
- "Ensure you have enough tokens to complete each file" - Explicit constraint
- "Or better yet, create file chunks" - Suggests optimal approach
- "Please suggest a good way" - Gets thoughtful architecture
- "How can I make this easily editable by the community" - Gets user-friendly solutions

## Remember

1. **AI assistants work best with**:
   - Clear, structured requests
   - Explicit constraints
   - Iterative refinement
   - Simple continuation commands

2. **Avoid**:
   - Asking for everything at once
   - Vague requirements
   - Not mentioning token concerns upfront

3. **Always helpful to include**:
   - The end goal
   - Who will use it
   - Technical constraints
   - Preference for chunked delivery

This template ensures smooth project development without token limit frustrations or incomplete deliverables.