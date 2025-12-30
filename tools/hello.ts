import { z } from "zod";

export default {
  name: "hello",
  description: "A simple hello world tool to verify MCP setup",
  parameters: {
    name: z.string().describe("The name of the person to greet"),
  },
  execute: async ({ name }: { name: string }) => {
    return `Hello, ${name}!`;
  },
};
