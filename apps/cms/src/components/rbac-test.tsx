'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createPage } from '@/lib/actions/pages'
import { createCollection } from '@/lib/actions/collections'
import { deleteSubmission } from '@/lib/actions/submissions'
import { Shield, Edit, Eye, AlertTriangle } from 'lucide-react'

export function RbacTest() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  const testAction = async (actionName: string, action: () => Promise<any>) => {
    setLoading(actionName)
    try {
      const result = await action()
      setResults(prev => ({ ...prev, [actionName]: result }))
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [actionName]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }))
    } finally {
      setLoading(null)
    }
  }

  const testCreatePage = () => testAction('createPage', () => 
    createPage({
      title: 'Test Page',
      slug: 'test-page',
      body: { content: 'Test content' }
    })
  )

  const testCreateCollection = () => testAction('createCollection', () => 
    createCollection({
      name: 'Test Collection',
      slug: 'test-collection',
      config: { fields: [] }
    })
  )

  const testDeleteSubmission = () => testAction('deleteSubmission', () => 
    deleteSubmission('non-existent-id')
  )

  const getResultBadge = (result: any) => {
    if (!result) return null
    
    if (result.success) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
    } else {
      return <Badge variant="destructive">Failed</Badge>
    }
  }

  const getResultMessage = (result: any) => {
    if (!result) return null
    
    if (result.success) {
      return result.id ? `Created with ID: ${result.id}` : 'Operation completed successfully'
    } else {
      return result.error || 'Operation failed'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          RBAC Test Panel
        </CardTitle>
        <CardDescription>
          Test role-based access control for different operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Create Page</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires EDITOR+ role
            </p>
            <Button 
              onClick={testCreatePage}
              disabled={loading === 'createPage'}
              size="sm"
            >
              {loading === 'createPage' ? 'Testing...' : 'Test Create Page'}
            </Button>
            {results.createPage && (
              <div className="space-y-1">
                {getResultBadge(results.createPage)}
                <p className="text-xs text-muted-foreground">
                  {getResultMessage(results.createPage)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Create Collection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires EDITOR+ role
            </p>
            <Button 
              onClick={testCreateCollection}
              disabled={loading === 'createCollection'}
              size="sm"
            >
              {loading === 'createCollection' ? 'Testing...' : 'Test Create Collection'}
            </Button>
            {results.createCollection && (
              <div className="space-y-1">
                {getResultBadge(results.createCollection)}
                <p className="text-xs text-muted-foreground">
                  {getResultMessage(results.createCollection)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Delete Submission</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires EDITOR+ role
            </p>
            <Button 
              onClick={testDeleteSubmission}
              disabled={loading === 'deleteSubmission'}
              size="sm"
            >
              {loading === 'deleteSubmission' ? 'Testing...' : 'Test Delete Submission'}
            </Button>
            {results.deleteSubmission && (
              <div className="space-y-1">
                {getResultBadge(results.deleteSubmission)}
                <p className="text-xs text-muted-foreground">
                  {getResultMessage(results.deleteSubmission)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">Role Hierarchy</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div><strong>OWNER:</strong> Full access to all features and settings</div>
            <div><strong>ADMIN:</strong> Administrative access to most features</div>
            <div><strong>EDITOR:</strong> Can create and edit content (write operations)</div>
            <div><strong>VIEWER:</strong> Read-only access to content</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
