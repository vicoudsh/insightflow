import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * OpenAPI Schema Edge Function
 * Serves the OpenAPI 3.1.0 specification for the InsightFlow MCP Server in JSON format
 * 
 * This function is PUBLICLY ACCESSIBLE - no authentication required.
 * Auth keys are accessed via environment variables automatically available in Edge Functions.
 * 
 * Endpoint:
 * GET /functions/v1/openapi - Returns OpenAPI JSON specification (default)
 */

// OpenAPI schema for the MCP Handler Edge Function (JSON format)
// Auth keys are automatically available via Deno.env.get() in Supabase Edge Functions
const getOpenApiJson = () => {
  // Get Supabase URL from environment (automatically available in Edge Functions)
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://yoxuhgzmxmrzxzrxrlky.supabase.co'
  const mcpHandlerUrl = `${supabaseUrl.replace('.supabase.co', '.supabase.co/functions/v1/mcp-handler')}`
  
  return {
    openapi: '3.1.0',
    info: {
      title: 'InsightFlow MCP Server API',
      description: `MCP (Model Context Protocol) server for managing projects, stacks, roadmaps, tasks, and subtasks via Supabase Edge Functions.

Available tools:
- Projects: list, get, create, update, delete
- Stacks: list, get, create, update, delete
- Roadmaps: list, get, create, update, delete
- Tasks: list, get, create, update, delete
- Subtasks: list, get, create, update, delete

All tools except /tools require authentication with a valid Supabase user token.
The /tools endpoint can be accessed with an anon key.`,
      version: '1.0.0',
      contact: {
        email: 'support@insightflow.com',
      },
    },
    servers: [
      {
        url: mcpHandlerUrl,
        description: 'Supabase Edge Function (Production)',
      },
    ],
    security: [
      { bearerAuth: [] },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase authentication token (anon key for /tools, user token for other endpoints). Available via environment variables in Edge Functions.',
        },
      },
      schemas: {
        Tool: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Tool name (e.g., projects/list)',
            },
            description: {
              type: 'string',
              description: 'Tool description',
            },
            inputSchema: {
              type: 'object',
              description: 'JSON schema for tool input parameters',
            },
          },
        },
        MCPResponse: {
          type: 'object',
          properties: {
            tool: {
              type: 'string',
              description: 'Tool name that was executed',
            },
            success: {
              type: 'boolean',
              description: 'Whether the tool execution was successful',
            },
            result: {
              type: 'object',
              description: 'Tool execution result (varies by tool)',
            },
            error: {
              type: 'string',
              description: 'Error message if success is false',
            },
            message: {
              type: 'string',
              description: 'Additional message',
            },
          },
        },
      },
    },
    paths: {
      '/tools': {
        get: {
          summary: 'Get available MCP tools',
          description: `Returns a list of all available MCP tools with their input schemas.
This endpoint is public and can be accessed with an anon key.
Use this endpoint to discover what tools are available.`,
          operationId: 'getTools',
          tags: ['Discovery'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of available tools',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      tools: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Tool',
                        },
                      },
                    },
                  },
                  example: {
                    tools: [
                      {
                        name: 'projects/list',
                        description: 'List all projects',
                        inputSchema: {
                          type: 'object',
                          properties: {
                            page: { type: 'number' },
                            limit: { type: 'number' },
                          },
                        },
                      },
                      {
                        name: 'projects/create',
                        description: 'Create a new project',
                        inputSchema: {
                          type: 'object',
                          required: ['name'],
                          properties: {
                            name: { type: 'string' },
                            description: { type: 'string' },
                            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Missing or invalid authentication token',
            },
          },
        },
      },
      '/': {
        post: {
          summary: 'Execute MCP tool',
          description: 'Execute any MCP tool by providing the tool name and parameters in the request body. The tool name must match one of the available tools from the /tools endpoint. Examples: projects/list, projects/create, stacks/list, roadmaps/list, tasks/list, subtasks/list.',
          operationId: 'executeTool',
          tags: ['Execution'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tool'],
                  properties: {
                    tool: {
                      type: 'string',
                      description: 'Tool name (e.g., projects/list, projects/create, stacks/list, etc.)',
                      example: 'projects/list',
                    },
                  },
                },
                examples: {
                  listProjects: {
                    summary: 'List projects',
                    value: {
                      tool: 'projects/list',
                      page: 1,
                      limit: 10,
                    },
                  },
                  createProject: {
                    summary: 'Create project',
                    value: {
                      tool: 'projects/create',
                      name: 'My New Project',
                      description: 'Project description',
                      status: 'active',
                    },
                  },
                  listStacks: {
                    summary: 'List stacks',
                    value: {
                      tool: 'stacks/list',
                      project_id: 'uuid-here',
                      page: 1,
                      limit: 10,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Tool execution result',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/MCPResponse',
                  },
                  examples: {
                    success: {
                      summary: 'Successful execution',
                      value: {
                        tool: 'projects/list',
                        success: true,
                        result: {
                          data: [],
                          pagination: {
                            page: 1,
                            limit: 10,
                            total: 0,
                            totalPages: 0,
                          },
                        },
                      },
                    },
                    error: {
                      summary: 'Error response',
                      value: {
                        tool: 'projects/list',
                        success: false,
                        error: 'Bad Request',
                        message: 'Missing required parameter',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request - Invalid tool name or missing required parameters',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/MCPResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Missing or invalid authentication token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: false,
                      },
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                      message: {
                        type: 'string',
                        example: 'Missing or invalid authorization header',
                      },
                    },
                  },
                },
              },
            },
            '405': {
              description: 'Method Not Allowed - Only POST requests are accepted',
            },
          },
        },
      },
    },
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // THIS IS A PUBLIC ENDPOINT - NO AUTHENTICATION REQUIRED
  // Auth keys are included directly via environment variables - accessible without client auth
  // Supabase Edge Functions automatically provide SUPABASE_URL and SUPABASE_ANON_KEY
  
  try {
    // Supabase environment variables are automatically available in Edge Functions
    // These are injected by Supabase at runtime - no need for client to provide auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://yoxuhgzmxmrzxzrxrlky.supabase.co'
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    // Auth keys are included directly in the function via environment variables
    // If Supabase platform requires auth header, use anon key from environment as fallback
    // But the function code itself doesn't validate or require auth

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/openapi', '') || '/'
    
    // Check if YAML format is requested (default is JSON)
    const isYaml = path === '/.yaml' || path.endsWith('.yaml') || path === '/.yml' || path.endsWith('.yml') ||
                   url.searchParams.get('format') === 'yaml' || url.searchParams.get('format') === 'yml'

    // Only allow GET requests - this is a public endpoint (no auth required)
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({
          error: 'Method not allowed',
          message: 'Only GET requests are accepted',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        },
      )
    }

    // Serve OpenAPI schema - JSON is default, YAML available via .yaml extension or format parameter
    if (isYaml) {
      // YAML format not implemented - JSON is the preferred format
      return new Response(
        JSON.stringify({
          error: 'YAML format not available',
          message: 'This endpoint serves JSON format by default',
          jsonUrl: url.toString().replace('.yaml', '').replace('.yml', '').replace('format=yaml', '').replace('format=yml', ''),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 501,
        },
      )
    } else {
      // Return JSON - Public endpoint, no auth required (default format)
      // Auth keys are accessible via environment variables - no need for client auth
      const openApiSchema = getOpenApiJson()
      return new Response(JSON.stringify(openApiSchema, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'inline; filename="openapi.json"',
        },
        status: 200,
      })
    }
  } catch (error) {
    console.error('OpenAPI Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
