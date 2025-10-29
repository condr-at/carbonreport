'use client';

/**
 * Request Data Modal
 * 
 * Opens email client with pre-filled template for requesting data from contacts
 */

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { X, Mail, Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestDataModalProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  // Legacy single-field props (kept for backward compatibility)
  fieldLabel?: string;
  fieldHint?: string | null;
  fieldId?: string;
  itemId?: string | null;
  group?: string;
  isGroup?: boolean;
  // New multi-field prop
  fields?: Array<{
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
}

export function RequestDataModal({
  projectId,
  projectName,
  projectOwnerName,
  fieldLabel,
  fieldHint,
  fieldId,
  itemId,
  group,
  isGroup = false,
  fields,
  mailtoTemplate,
  onClose,
  onLogged,
  contacts = [],
}: RequestDataModalProps) {
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const [stage, setStage] = useState<'form' | 'confirm'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Normalize fields: use new fields prop or fallback to legacy single-field props
  const requestFields = useMemo(() => {
    if (fields && fields.length > 0) {
      return fields;
    }
    // Fallback to legacy single-field mode
    if (fieldId || fieldLabel) {
      return [
        {
          fieldId: fieldId || '',
          fieldLabel: fieldLabel || '',
          itemId: itemId ?? null,
          fieldHint: fieldHint ?? null,
        },
      ];
    }
    return [];
  }, [fields, fieldId, fieldLabel, itemId, fieldHint]);

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

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setApiError(null);

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
        group: group || null,
      })),
      mailtoPreview: preview,
    };

    try {
      if (!isValidEmail(contactEmail)) {
        setApiError('Contact email must be a valid email address');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/data-requests/bulk', {
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

      alert('Data request logged (mock)');
      if (onLogged) {
        await onLogged();
      }
      resetAndClose();
    } catch (error) {
      console.error('Failed to log data request', error);
      const message = error instanceof Error ? error.message : 'Failed to log request';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full p-6 relative bg-white">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={resetAndClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6">
          {stage === 'form' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  Request Data
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isGroup
                    ? `Request all ${group} data`
                    : requestFields.length === 1
                    ? `Request data for: ${requestFields[0].fieldLabel}`
                    : `Requesting ${requestFields.length} data points`}
                </p>
                {requestFields.length === 1 && requestFields[0].fieldHint && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Hint: {requestFields[0].fieldHint}
                  </p>
                )}
                {requestFields.length > 1 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium">Fields:</p>
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
              </div>

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
                          <span className="truncate">
                            {selectedContact.name}
                          </span>
                        ) : (
                          "Select contact..."
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
                                  setSelectedContactId(
                                    selected?.id === selectedContactId ? null : selected?.id ?? null
                                  );
                                  setContactPickerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedContactId === option.id ? "opacity-100" : "opacity-0"
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional - used in email greeting
                  </p>
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

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button onClick={handleSend}>
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold">Confirm Email</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Was the email sent successfully?
                </p>
              </div>

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
                    <ul className="list-disc list-inside mt-1">
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
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {apiError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="ghost" onClick={handleBackToEdit}>
                  &lt; Change details
                </Button>
                <div className="flex gap-3 justify-end w-full sm:w-auto">
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
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
