import { Command } from "commander";
import { registerToolsCommand } from "./commands/tools.js";
import { registerPromptsCommand } from "./commands/prompts.js";

const program = new Command();

// Register commands
registerToolsCommand(program);
registerPromptsCommand(program);


program.parse(process.argv);
