'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe2,
  Plus,
  RefreshCw,
  Copy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { Domain } from '@prisma/client';
import {
  checkDomain,
  removeDomain,
  requestDomain,
  setPrimaryDomain,
} from '@/server/actions/domain';
import { useFormState } from 'react-dom';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CmsLayout } from '@/components/cms-layout';

interface DomainsClientProps {
  domains: Domain[];
  tenantId: string;
}

export function DomainsClient({ domains, tenantId }: DomainsClientProps) {
  const [checkingDomains, setCheckingDomains] = useState<Set<string>>(new Set());
  const [openAddDomain, setOpenAddDomain] = useState(false);

  const handleCheckDomain = async (domainId: string) => {
    setCheckingDomains(prev => new Set(prev).add(domainId));
    try {
      await checkDomain(tenantId, domainId);
      toast.success('Domain check initiated. Status will update shortly.');
    } catch (error: any) {
      toast.error(`Failed to check domain: ${error.message}`);
    } finally {
      setCheckingDomains(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainId);
        return newSet;
      });
    }
  };

  const handleSetPrimary = async (domainId: string) => {
    try {
      await setPrimaryDomain(tenantId, domainId);
      toast.success('Primary domain updated.');
    } catch (error: any) {
      toast.error(`Failed to set primary domain: ${error.message}`);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    if (confirm('Are you sure you want to remove this domain?')) {
      try {
        await removeDomain(tenantId, domainId);
        toast.success('Domain removed.');
      } catch (error: any) {
        toast.error(`Failed to remove domain: ${error.message}`);
      }
    }
  };

  const getStatusComponent = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'ASSIGNED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-2 h-4 w-4" />
            Verified
          </Badge>
        );
      case 'PENDING':
      case 'VERIFYING':
      case 'NEEDS_DNS':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </Badge>
        );
      case 'ERROR':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
            <p className="text-muted-foreground">
              Manage your custom domains, DNS records, and SSL certificates.
            </p>
          </div>
          <AddDomainDialog
            tenantId={tenantId}
            open={openAddDomain}
            onOpenChange={setOpenAddDomain}
          />
        </div>

        {/* Domain List */}
        <div className="space-y-4">
          {domains.map(domain => (
            <Card key={domain.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {domain.hostname}
                        {domain.isPrimary && (
                          <Badge variant="secondary" className="text-xs">
                            Primary
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Status: {domain.status}
                        {domain.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                              </TooltipTrigger>
                              <TooltipContent>{domain.error}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusComponent(domain.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {domain.status === 'NEEDS_DNS' && (
                  <DnsInstructions
                    type={domain.verificationType!}
                    value={domain.verificationValue!}
                    hostname={domain.hostname}
                  />
                )}
                <div className="mt-4 flex gap-2">
                  {!domain.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(domain.id)}
                    >
                      Set as Primary
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckDomain(domain.id)}
                    disabled={checkingDomains.has(domain.id)}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${
                        checkingDomains.has(domain.id) ? 'animate-spin' : ''
                      }`}
                    />
                    {checkingDomains.has(domain.id) ? 'Checking...' : 'Re-check'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDomain(domain.id)}
                  >
                    Remove
                  </Button>
                  {domain.status === 'NEEDS_DNS' && (
                    <DnsInstructionsModal domain={domain} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CmsLayout>
  );
}

function AddDomainDialog({
  tenantId,
  open,
  onOpenChange,
}: {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction] = useFormState(requestDomain.bind(null, tenantId), {
    error: {},
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          action={async (formData: FormData) => {
            await formAction(formData);
            if (!state.error._form) {
              onOpenChange(false);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a new domain</DialogTitle>
            <DialogDescription>
              Enter the domain you want to connect to your site.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hostname" className="text-right">
                Domain
              </Label>
              <Input
                id="hostname"
                name="hostname"
                placeholder="example.com"
                className="col-span-3"
              />
            </div>
            {state?.error?.hostname && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {state.error.hostname}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Add Domain</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DnsInstructionsModal({ domain }: { domain: Domain }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Show DNS Instructions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>DNS Instructions for {domain.hostname}</DialogTitle>
          <DialogDescription>
            Follow these instructions to connect your domain to your site.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <DnsInstructions
            type={domain.verificationType!}
            value={domain.verificationValue!}
            hostname={domain.hostname}
          />
          <div className="mt-4 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>What to expect:</strong> DNS changes can take up to 48 hours to
              propagate worldwide. Once your records are verified, an SSL
              certificate will be issued automatically.
            </p>
            <p>
              <strong>How to verify:</strong> After adding the records, click the
              "Re-check" button on the domains page.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DnsInstructions({
  type,
  value,
  hostname,
}: {
  type: string;
  value: string;
  hostname: string;
}) {
  const recordName = type === 'TXT' ? `_vercel.${hostname}` : hostname;
  return (
    <div className="bg-muted p-4 rounded-lg space-y-4">
      <p className="text-sm">
        Please add the following DNS record to your domain provider to verify ownership.
      </p>
      <div className="flex items-center justify-between p-2 border rounded-lg bg-background">
        <div className="font-mono text-sm">
          {type} {recordName}
        </div>
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm bg-muted px-2 py-1 rounded">{value}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(value)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
