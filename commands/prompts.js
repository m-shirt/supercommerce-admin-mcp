import { discoverPrompts } from "../lib/prompts.js";

export function registerPromptsCommand(program) {
  program
    .command("prompts")
    .description("List all available prompts")
    .action(async () => {
      const prompts = await discoverPrompts();
      if (prompts.length === 0) {
       // console.log("No prompts found. Prompts should be organized as:");
       // console.log("prompts/prompt-name.js\n");
        return;
      }

     // console.log("\nAvailable Prompts:\n");

      // Group prompts by folder (optional)
      const groupedPrompts = prompts.reduce((acc, prompt) => {
        const parts = prompt.path?.split("/") || ["Unknown Folder", prompt.id];
        const folder = parts[1] || "Unknown Folder";

        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(prompt);
        return acc;
      }, {});

      // Print prompts in hierarchical structure
      for (const [folder, prompts] of Object.entries(groupedPrompts)) {
       // console.log(`Folder: ${folder}`);
        prompts.forEach(({ id, metadata }) => {
         // console.log(`  ${id}`);
         // console.log(`    Title: ${metadata.title || "No title provided"}`);
         // console.log(`    Description: ${metadata.description || "No description provided"}`);
          if (metadata.argsSchema) {
            const schema = metadata.argsSchema._def?.shape() || {};
            if (Object.keys(schema).length) {
             // console.log("    Parameters:");
              for (const [name, details] of Object.entries(schema)) {
               // console.log(`      - ${name}`);
              }
            }
          }
         // console.log("");
        });
       // console.log("");
      }
    });
}
