import { CmsLayout } from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Send, Mail, CheckCircle, Clock, Filter, Calendar, FormInput } from "lucide-react"
import { getSubmissions, getFormNames, getSubmissionStats, SubmissionsFilters } from "@/lib/actions/submissions"
import { formatDistanceToNow } from "date-fns"

interface SubmissionsPageProps {
  searchParams: Promise<{
    form?: string
    dateFrom?: string
    dateTo?: string
  }>
}

export default async function Submissions({ searchParams }: SubmissionsPageProps) {
  const resolvedSearchParams = await searchParams
  const filters: SubmissionsFilters = {
    form: resolvedSearchParams.form,
    dateFrom: resolvedSearchParams.dateFrom,
    dateTo: resolvedSearchParams.dateTo,
  }

  const [submissions, formNames, stats] = await Promise.all([
    getSubmissions(filters),
    getFormNames(),
    getSubmissionStats(),
  ])

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions and inquiries.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.new}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Current month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>
                  {submissions.length} submission{submissions.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No submissions found</p>
                <p className="text-sm">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters' 
                    : 'Contact form submissions will appear here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="form-filter">Form</Label>
                    <Select defaultValue={filters.form || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="All forms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All forms</SelectItem>
                        {formNames.map((form) => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="date-from">From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      defaultValue={filters.dateFrom || ""}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="date-to">To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      defaultValue={filters.dateTo || ""}
                    />
                  </div>
                  <Button>
                    <Filter className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>

                {/* Submissions Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <Badge variant="secondary">
                              <FormInput className="h-3 w-3 mr-1" />
                              {submission.form}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <pre className="text-xs bg-muted p-2 rounded overflow-hidden">
                                {JSON.stringify(submission.payload, null, 2)}
                              </pre>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {submission.ip || 'Unknown'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CmsLayout>
  )
}
