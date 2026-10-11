'use client';

import { fetchWithSession } from '@/lib/session-client'

/**
 * Request Data Modal
 * 
 * Opens email client with pre-filled template for requesting data from contacts
 */

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Mail, Loader2, ChevronsUpDown, Check, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications } from '@/components/ui/notifications';

interface RequestDataModalProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  fields: Array<{
    fieldId: string;
    fieldLabel: string;
    itemId?: string | null;
    fieldHint?: string | null;
  }>;
  mailtoTemplate?: { subject: string; body: string };
  onClose: () => void;
  onLogged?: () => void | Promise<void>;
  contacts?: Array<{
    id: string;
    name: string;
    email: string;
    position?: string | null;
  }>;
  initialContact?: {
    id?: string | null;
    email?: string;
    name?: string | null;
  };
}

export function RequestDataModal({
  projectId,
  projectName,
  projectOwnerName,
  fields,
  mailtoTemplate,
  onClose,
  onLogged,
  contacts = [],
  initialContact,
}: RequestDataModalProps) {
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const [stage, setStage] = useState<'form' | 'confirm'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const requestFields = useMemo(() => fields || [], [fields]);

  const isValidEmail = useMemo(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: string) => emailPattern.test(value);
  }, []);

  const contactOptions = useMemo(
    () =>
      contacts.map((contact) => ({
        id: contact.id,
        name: (contact.name ?? '').trim() || contact.email,
        email: contact.email,
        position: contact.position ?? null,
      })),
    [contacts]
  );

  const selectedContact = useMemo(
    () => contactOptions.find((option) => option.id === selectedContactId) ?? null,
    [contactOptions, selectedContactId]
  );

  useEffect(() => {
    if (!selectedContact) {
      return;
    }
    setContactEmail(selectedContact.email);
    setContactName(selectedContact.name);
  }, [selectedContact]);

  useEffect(() => {
    if (!initialContact) {
      setSelectedContactId(null);
      setContactEmail('');
      setContactName('');
    }
  }, [initialContact]);

  useEffect(() => {
    if (!initialContact) {
      return;
    }

    if (initialContact.id) {
      const match = contacts.find((candidate) => candidate.id === initialContact.id);
      if (match) {
        setSelectedContactId(match.id);
        setContactEmail(match.email);
        setContactName(match.name);
        return;
      }
    }

    const normalizedEmail = (initialContact.email ?? '').trim();
    const normalizedName = (initialContact.name ?? '').trim();

    setSelectedContactId(null);
    setContactEmail(normalizedEmail);
    setContactName(normalizedName || normalizedEmail);
  }, [initialContact, contacts]);

  const template = useMemo(() => {
    const fallbackBody = [
      'Dear {{contact_name}},',
      '',
      'We are working on the {{project_name}} carbon footprint report and need your help with {{field_display_name}}.',
      '',
      'Could you please provide the following information?',
      '{{field_list}}',
      '',
      'Please share the latest details by {{deadline}}.',
      '',
      'Thank you,',
      '{{requester_signature}}',
    ].join('\n');

    const fallbackSubject = `Data Request for {{project_name}} - {{field_display_name}}`;

    if (!mailtoTemplate) {
      return { subject: fallbackSubject, body: fallbackBody };
    }

    const subject = mailtoTemplate.subject?.trim() || fallbackSubject;
    const body = mailtoTemplate.body?.trim() || fallbackBody;

    return { subject, body };
  }, [mailtoTemplate]);

  const preview = useMemo(() => {
    const deadlineLabel = (() => {
      if (!deadline) {
        return 'your earliest convenience';
      }

      try {
        return new Date(`${deadline}T00:00:00`).toLocaleDateString();
      } catch {
        return deadline;
      }
    })();

    const displayName = (() => {
      if (requestFields.length === 0) {
        return 'the requested data point';
      }
      if (requestFields.length === 1) {
        const field = requestFields[0];
        if (field.itemId) {
          return `${field.fieldLabel} (Item ${field.itemId})`;
        }
        return field.fieldLabel;
      }
      return `${requestFields.length} data points`;
    })();

    const fieldList = requestFields
      .map((field) => {
        const label = field.fieldLabel || field.fieldId;
        if (field.itemId) {
          return `- ${label} (Item ${field.itemId})`;
        }
        return `- ${label}`;
      })
      .join('\n');

    const signature = (() => {
      const owner = projectOwnerName?.trim();
      const project = projectName?.trim();

      if (owner && project) {
        return `${owner} - ${project}`;
      }

      if (owner) {
        return owner;
      }

      return project || 'Carbon Report Team';
    })();

    const replacements: Record<string, string> = {
      '{{contact_name}}': contactName || 'there',
      '{{project_name}}': projectName,
      '{{field_display_name}}': displayName,
      '{{field_list}}': fieldList,
      '{{deadline}}': deadlineLabel,
      '{{requester_signature}}': signature,
    };

    const apply = (text: string) =>
      Object.entries(replacements).reduce(
        (acc, [token, value]) => acc.split(token).join(value),
        text
      );

    return {
      subject: apply(template.subject),
      body: apply(template.body),
    };
  }, [contactName, deadline, requestFields, projectName, projectOwnerName, template]);

  // Generate mailto template
  const generateMailtoLink = () => {
    const subject = encodeURIComponent(preview.subject);
    const body = encodeURIComponent(preview.body);
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const resetAndClose = () => {
    setStage('form');
    setIsSubmitting(false);
    setApiError(null);
    onClose();
  };

  const handleSend = () => {
    if (!contactEmail) {
      alert('Please enter a contact email address');
      return;
    }

    if (!isValidEmail(contactEmail)) {
      alert('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    const mailtoLink = generateMailtoLink();
    window.location.href = mailtoLink;
    setStage('confirm');
  };

  const handleBackToEdit = () => {
    setStage('form');
    setApiError(null);
  };

  const handleConfirm = () => {
    setApiError(null);

    if (!isValidEmail(contactEmail)) {
      setApiError('Contact email must be a valid email address');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      projectId,
      contact: {
        id: selectedContactId || undefined,
        email: contactEmail,
        name: contactName || undefined,
      },
      deadline: deadline || null,
      fields: requestFields.map((field) => ({
        dataPointId: field.fieldId || null,
        fieldLabel: field.fieldLabel || null,
        itemId: field.itemId || null,
        group: null,
      })),
      mailtoPreview: preview,
    };

    const logRequestPromise = (async () => {
      const response = await fetchWithSession('/api/data-requests/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response
          .json()
          .catch(() => ({ error: 'Failed to log request' }));
        const detailed = Array.isArray(errorPayload?.details) && errorPayload.details.length > 0
          ? errorPayload.details[0]?.message
          : null;
        throw new Error(detailed || errorPayload?.error || 'Failed to log request');
      }

      if (onLogged) {
        await onLogged();
      }
    })();

    notifications.promise(logRequestPromise, {
      loading: 'Logging data request...',
      success: 'Data request logged successfully.',
      error: (error) => (error instanceof Error ? error.message : 'Failed to log request'),
    });

    resetAndClose();

    logRequestPromise.catch((error) => {
      console.error('Failed to log data request', error);
    });
  };

  const formSubtitle = requestFields.length === 1
    ? `Request data for: ${requestFields[0].fieldLabel}`
    : `Requesting ${requestFields.length} data points`;

  const singleFieldHint = requestFields.length === 1 ? requestFields[0].fieldHint : null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          resetAndClose();
        }
      }}
    >
      <DialogContent className="max-w-lg space-y-6">
        {stage === 'form' ? (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Mail className="h-6 w-6" />
                Request Data
              </DialogTitle>
              <DialogDescription>{formSubtitle}</DialogDescription>
              {singleFieldHint && (
                <p className="text-xs text-muted-foreground">Hint: {singleFieldHint}</p>
              )}
              {requestFields.length > 1 && (
                <div className="space-y-1 pt-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Fields</p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    {requestFields.map((field, idx) => (
                      <li key={idx}>
                        {field.fieldLabel}
                        {field.itemId && ` (Item ${field.itemId})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-picker">Contact</Label>
                <Popover open={contactPickerOpen} onOpenChange={setContactPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={contactPickerOpen}
                      className="w-full justify-between"
                    >
                      {selectedContact ? (
                        <span className="truncate">{selectedContact.name}</span>
                      ) : (
                        'Select contact...'
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-0 p-0" align="start" sideOffset={4}>
                    <Command>
                      <CommandInput placeholder="Search contact..." />
                      <CommandList>
                        <CommandEmpty>No contact found.</CommandEmpty>
                        <CommandGroup>
                          {contactOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              value={option.email}
                              onSelect={(currentValue) => {
                                const selected = contactOptions.find((c) => c.email === currentValue);
                                setSelectedContactId(selected?.id === selectedContactId ? null : selected?.id ?? null);
                                setContactPickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedContactId === option.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  {contactOptions.length > 0
                    ? 'Select a saved contact or enter email manually below.'
                    : 'No saved contacts. Add them in project settings or enter email manually.'}
                </p>
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="colleague@company.com"
                  value={contactEmail}
                  onChange={(e) => {
                    setSelectedContactId(null);
                    setContactEmail(e.target.value);
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="John Doe"
                  value={contactName}
                  onChange={(e) => {
                    setSelectedContactId(null);
                    setContactName(e.target.value);
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional - used in email greeting</p>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional - used to fill the {'{{deadline}}'} placeholder
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-end sm:space-x-2">
              <Button variant="outline" onClick={resetAndClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSend} className="w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4" />
                Open Email Client
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Email</DialogTitle>
              <DialogDescription>Was the email sent successfully?</DialogDescription>
            </DialogHeader>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Contact:</strong> {contactName ? `${contactName} <${contactEmail}>` : contactEmail}
              </p>
              <p>
                <strong>Subject:</strong> {preview.subject}
              </p>
              <div>
                <strong>Included Fields:</strong>
                {requestFields.length === 1 ? (
                  <span>
                    {' '}
                    {requestFields[0].fieldLabel}
                    {requestFields[0].itemId && ` (Item ${requestFields[0].itemId})`}
                  </span>
                ) : (
                  <ul className="mt-1 list-disc list-inside">
                    {requestFields.map((field, idx) => (
                      <li key={idx}>
                        {field.fieldLabel}
                        {field.itemId && ` (Item ${field.itemId})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {deadline && (
                <p>
                  <strong>Deadline:</strong> {deadline}
                </p>
              )}
            </div>

            {apiError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <DialogFooter className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={handleBackToEdit} className="w-full justify-center sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change details
              </Button>
              <div className="flex w-full justify-end gap-2 sm:w-auto">
                <Button variant="outline" onClick={resetAndClose} disabled={isSubmitting}>
                  No, cancel
                </Button>
                <Button onClick={handleConfirm} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging...
                    </span>
                  ) : (
                    'Yes, log request'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
