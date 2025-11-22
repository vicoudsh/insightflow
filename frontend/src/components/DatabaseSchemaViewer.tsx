'use client'

import { Database, FileJson } from 'lucide-react'
import { Project } from '@/lib/api'

interface DatabaseSchemaViewerProps {
  project: Project
}

export default function DatabaseSchemaViewer({ project }: DatabaseSchemaViewerProps) {
  const schema = project.database_schema

  if (!schema || schema === null) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Database Schema</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          No database schema available for this project
        </div>
      </div>
    )
  }

  // JSONB comes as an object/array directly, no need to parse if it's already an object
  // But handle string case for backwards compatibility
  let parsedSchema: any = schema
  if (typeof schema === 'string') {
    try {
      parsedSchema = JSON.parse(schema)
    } catch (e) {
      // If it's not valid JSON, treat as plain text
      parsedSchema = null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Database Schema</h3>
      </div>

      {parsedSchema ? (
        // Display as JSON cards
        <div className="space-y-4">
          {typeof parsedSchema === 'object' && Array.isArray(parsedSchema) ? (
            // Array of tables or schemas
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parsedSchema.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900">
                      {item.name || item.table_name || item.schema || `Item ${index + 1}`}
                    </h4>
                  </div>
                  {item.columns && Array.isArray(item.columns) && (
                    <div className="text-sm text-gray-600 mb-2">
                      {item.columns.length} column{item.columns.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {item.tables && Array.isArray(item.tables) && (
                    <div className="text-sm text-gray-600 mb-2">
                      {item.tables.length} table{item.tables.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </div>
                  )}
                  {item.columns && Array.isArray(item.columns) && item.columns.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500 font-medium mb-1">Columns:</div>
                      <div className="space-y-1">
                        {item.columns.slice(0, 3).map((col: any, colIdx: number) => (
                          <div key={colIdx} className="text-xs text-gray-600 truncate">
                            {col.name || col.column_name || col}
                          </div>
                        ))}
                        {item.columns.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{item.columns.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : typeof parsedSchema === 'object' && parsedSchema !== null ? (
            // Single object - check if it has tables array
            parsedSchema.tables && Array.isArray(parsedSchema.tables) ? (
              // Schema object with tables array
              <div className="space-y-4">
                {parsedSchema.name && (
                  <div className="text-lg font-semibold text-gray-900">{parsedSchema.name}</div>
                )}
                {parsedSchema.description && (
                  <div className="text-sm text-gray-600">{parsedSchema.description}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parsedSchema.tables.map((table: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileJson className="w-4 h-4 text-blue-600" />
                        <h4 className="font-medium text-gray-900">
                          {table.name || table.table_name || `Table ${index + 1}`}
                        </h4>
                      </div>
                      {table.columns && Array.isArray(table.columns) && (
                        <div className="text-sm text-gray-600 mb-2">
                          {table.columns.length} column{table.columns.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      {table.description && (
                        <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {table.description}
                        </div>
                      )}
                      {table.columns && Array.isArray(table.columns) && table.columns.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500 font-medium mb-1">Columns:</div>
                          <div className="space-y-1">
                            {table.columns.slice(0, 3).map((col: any, colIdx: number) => (
                              <div key={colIdx} className="text-xs text-gray-600 truncate">
                                {col.name || col.column_name || col}
                              </div>
                            ))}
                            {table.columns.length > 3 && (
                              <div className="text-xs text-gray-400">
                                +{table.columns.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Generic object - display as formatted JSON
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <pre className="text-sm text-gray-700 overflow-x-auto max-h-96">
                  {JSON.stringify(parsedSchema, null, 2)}
                </pre>
              </div>
            )
          ) : (
            // Primitive value
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-700">{String(parsedSchema)}</div>
            </div>
          )}
        </div>
      ) : (
        // Display as plain text (fallback)
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {typeof schema === 'string' ? schema : JSON.stringify(schema)}
          </pre>
        </div>
      )}
    </div>
  )
}

