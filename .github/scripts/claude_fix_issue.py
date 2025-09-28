#!/usr/bin/env python3
"""
Claude Issue Auto-Fixer Script
Analyzes GitHub issues and generates fixes using Claude API
"""

import os
import sys
import json
import re
from pathlib import Path
import anthropic
from github import Github
import git

# Initialize Claude client
client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))

# Get issue details from environment
issue_title = os.environ.get('ISSUE_TITLE', '')
issue_body = os.environ.get('ISSUE_BODY', '')
issue_number = os.environ.get('ISSUE_NUMBER', '')

def analyze_codebase():
    """Gather relevant codebase context"""
    context = {
        'files': [],
        'structure': [],
        'package_info': {}
    }

    # Read package.json if it exists
    if Path('package.json').exists():
        with open('package.json', 'r') as f:
            context['package_info'] = json.load(f)

    # Get file structure (limit to relevant directories)
    relevant_dirs = ['src', 'lib', 'tools', 'prompts', 'pages', 'components', 'app']
    for dir_name in relevant_dirs:
        if Path(dir_name).exists():
            for file_path in Path(dir_name).rglob('*.js'):
                context['files'].append(str(file_path))
            for file_path in Path(dir_name).rglob('*.ts'):
                context['files'].append(str(file_path))
            for file_path in Path(dir_name).rglob('*.jsx'):
                context['files'].append(str(file_path))
            for file_path in Path(dir_name).rglob('*.tsx'):
                context['files'].append(str(file_path))

    return context

def extract_error_context(issue_body):
    """Extract error messages, stack traces, and code snippets from issue"""
    error_patterns = {
        'error': r'(?i)error[:\s]+(.+?)(?:\n|$)',
        'stack_trace': r'(?i)stack trace[:\s]*\n([\s\S]+?)(?:\n\n|$)',
        'code_block': r'```[\w]*\n([\s\S]+?)```',
        'file_reference': r'(?:in |at |file:?\s*)([\/\w\-\.]+\.[jt]sx?):?(\d+)?',
    }

    extracted = {}
    for key, pattern in error_patterns.items():
        matches = re.findall(pattern, issue_body)
        if matches:
            extracted[key] = matches

    return extracted

def read_relevant_files(error_context, codebase_context):
    """Read files mentioned in the issue or error messages"""
    relevant_content = {}

    # Extract file paths from error context
    file_refs = error_context.get('file_reference', [])

    for ref in file_refs[:5]:  # Limit to 5 files to avoid token limits
        file_path = ref[0] if isinstance(ref, tuple) else ref
        if Path(file_path).exists():
            with open(file_path, 'r') as f:
                relevant_content[file_path] = f.read()[:5000]  # Limit content

    # Also check for files mentioned directly in issue
    words = (issue_title + ' ' + issue_body).split()
    for word in words:
        if word.endswith(('.js', '.ts', '.jsx', '.tsx')):
            if Path(word).exists():
                with open(word, 'r') as f:
                    relevant_content[word] = f.read()[:5000]

    return relevant_content

def generate_fix_with_claude(issue_data, codebase_context, error_context, relevant_files):
    """Use Claude to analyze the issue and generate a fix"""

    # Prepare the prompt
    prompt = f"""You are an expert software engineer tasked with fixing a GitHub issue automatically.

## Issue Details
**Issue Number:** #{issue_number}
**Title:** {issue_title}
**Description:**
{issue_body}

## Codebase Context
**Project Type:** Node.js/Next.js MCP Server
**Main Dependencies:** {json.dumps(codebase_context.get('package_info', {}).get('dependencies', {}), indent=2)}
**File Structure:** {json.dumps(codebase_context['files'][:20], indent=2)}

## Error Context
{json.dumps(error_context, indent=2)}

## Relevant File Contents
{json.dumps(relevant_files, indent=2)}

## Task
Analyze this issue and generate the necessary code changes to fix it.

Please provide:
1. A clear understanding of the problem
2. The root cause analysis
3. The specific files that need to be modified
4. The exact code changes needed (provide full file contents or clear diffs)

Format your response as JSON with this structure:
{{
    "analysis": "Brief problem analysis",
    "root_cause": "Root cause of the issue",
    "files_to_modify": [
        {{
            "path": "file/path.js",
            "action": "modify|create|delete",
            "content": "full new content or null for delete"
        }}
    ],
    "validation_steps": ["Step to validate fix 1", "Step 2"]
}}

Be conservative - only suggest changes you're confident will fix the issue without breaking existing functionality.
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            temperature=0.2,
            system="You are a precise code fixing assistant. Generate only valid, working code changes.",
            messages=[{"role": "user", "content": prompt}]
        )

        # Extract JSON from response
        response_text = response.content[0].text

        # Try to parse JSON from the response
        json_match = re.search(r'\{[\s\S]+\}', response_text)
        if json_match:
            fix_data = json.loads(json_match.group())
            return fix_data
        else:
            print("Could not parse JSON from Claude response")
            return None

    except Exception as e:
        print(f"Error calling Claude API: {e}")
        return None

def apply_fixes(fix_data):
    """Apply the fixes suggested by Claude to the codebase"""
    if not fix_data or 'files_to_modify' not in fix_data:
        print("No fixes to apply")
        return False

    changes_made = False

    for file_change in fix_data['files_to_modify']:
        file_path = file_change['path']
        action = file_change['action']
        content = file_change.get('content')

        try:
            if action == 'create':
                # Create directory if needed
                Path(file_path).parent.mkdir(parents=True, exist_ok=True)
                with open(file_path, 'w') as f:
                    f.write(content)
                print(f"Created: {file_path}")
                changes_made = True

            elif action == 'modify':
                if Path(file_path).exists():
                    with open(file_path, 'w') as f:
                        f.write(content)
                    print(f"Modified: {file_path}")
                    changes_made = True
                else:
                    print(f"File not found for modification: {file_path}")

            elif action == 'delete':
                if Path(file_path).exists():
                    Path(file_path).unlink()
                    print(f"Deleted: {file_path}")
                    changes_made = True

        except Exception as e:
            print(f"Error applying fix to {file_path}: {e}")

    # Write analysis to a file for PR description
    if changes_made:
        with open('.github/fix_analysis.json', 'w') as f:
            json.dump({
                'analysis': fix_data.get('analysis', ''),
                'root_cause': fix_data.get('root_cause', ''),
                'validation_steps': fix_data.get('validation_steps', [])
            }, f, indent=2)

    return changes_made

def main():
    """Main execution flow"""
    print(f"Analyzing issue #{issue_number}: {issue_title}")

    # Step 1: Analyze codebase structure
    print("Gathering codebase context...")
    codebase_context = analyze_codebase()

    # Step 2: Extract error context from issue
    print("Extracting error context...")
    error_context = extract_error_context(issue_body)

    # Step 3: Read relevant files
    print("Reading relevant files...")
    relevant_files = read_relevant_files(error_context, codebase_context)

    # Step 4: Generate fix with Claude
    print("Generating fix with Claude...")
    fix_data = generate_fix_with_claude(
        {'title': issue_title, 'body': issue_body, 'number': issue_number},
        codebase_context,
        error_context,
        relevant_files
    )

    if fix_data:
        print(f"Fix generated: {fix_data.get('analysis', 'No analysis')}")

        # Step 5: Apply fixes
        print("Applying fixes...")
        if apply_fixes(fix_data):
            print("Fixes applied successfully")
            sys.exit(0)
        else:
            print("No changes were made")
            sys.exit(1)
    else:
        print("Could not generate a fix for this issue")
        sys.exit(1)

if __name__ == "__main__":
    main()