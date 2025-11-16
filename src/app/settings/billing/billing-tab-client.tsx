'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UpgradePlanDialog } from '../upgrade-plan-dialog'

const SUPPORT_EMAIL = 'billing@carbonreport.com'

type BillingTabProps = {
  organizationId: string
  organizationName: string
  plan: {
    code: string
    label: string
    valid_until: string | null
  }
  billingUiEnabled: boolean
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No expiry'
  }
  try {
    const date = new Date(value)
    return date.toLocaleDateString()
  } catch {
    return value
  }
}

export function BillingTab({ organizationId, organizationName, plan, billingUiEnabled }: BillingTabProps) {
  if (!billingUiEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Billing UI is not enabled for this workspace yet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Contact us to enable billing management for <span className="font-medium text-foreground">{organizationName}</span>.
          </p>
          <Button asChild variant="outline">
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Enable%20billing%20UI`}>Email support</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              {organizationName} · {plan.label}
            </CardDescription>
            <div className="mt-2 text-xs text-muted-foreground">Renews on {formatDate(plan.valid_until)}</div>
          </div>
          <UpgradePlanDialog organizationId={organizationId} currentPlanCode={plan.code} />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{plan.code}</Badge>
            <span className="text-muted-foreground">Next invoice: {formatDate(plan.valid_until)}</span>
          </div>
          <p className="text-muted-foreground">Upgrade or downgrade at any time. Changes prorate automatically.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download recent invoices or update billing contacts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
            Invoice history will appear here once billing is connected.
          </div>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Need a PO or vendor form? Our billing team can help.
            </div>
            <Button asChild variant="outline">
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Carbon%20Report%20billing%20question`}>Contact billing</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
