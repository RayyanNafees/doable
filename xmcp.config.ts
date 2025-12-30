import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  // Define HTTP transport settings
  http: {
    debug: true,
    endpoint: "/api/mcp", // Typical endpoint for MCP
  },
  // Use Next.js adapter
  experimental: {
    adapter: "nextjs",
  },
  // Enable file-system routing for tools and resources
  paths: {
    tools: true,
    resources: true,
    prompts: true,
  },
  typescript: {
    skipTypeCheck: false,
  }
};

export default config;
