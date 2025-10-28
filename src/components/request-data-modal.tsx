'use client';

/**
 * Request Data Modal
 * 
 * Opens email client with pre-filled template for requesting data from contacts
 */

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Mail } from 'lucide-react';

interface RequestDataModalProps {
  projectName: string;
  fieldLabel?: string;
  fieldHint?: string | null;
  fieldId?: string;
  itemId?: string | null;
  group?: string;
  isGroup?: boolean;
  mailtoTemplate?: { subject: string; body: string };
  onClose: () => void;
}

export function RequestDataModal({
  projectName,
  fieldLabel,
  fieldHint,
  fieldId,
  itemId,
  group,
  isGroup = false,
  mailtoTemplate,
  onClose,
}: RequestDataModalProps) {
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requesterName, setRequesterName] = useState('Carbon Report Team');

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
      '{{user_name}}',
    ].join('\n');

    const fallbackSubject = `Data Request for {{project_name}} - {{field_display_name}}`;

    if (!mailtoTemplate) {
      return { subject: fallbackSubject, body: fallbackBody };
    }

    const subject = mailtoTemplate.subject?.trim() || fallbackSubject;
    const body = mailtoTemplate.body?.trim() || fallbackBody;

    return { subject, body };
  }, [mailtoTemplate, projectName]);

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
      if (!fieldLabel) {
        return 'the requested data point';
      }
      if (itemId) {
        return `${fieldLabel} (Item ${itemId})`;
      }
      return fieldLabel;
    })();

    const fieldList = `- ${displayName}`;

    const replacements: Record<string, string> = {
      '{{contact_name}}': contactName || 'there',
      '{{project_name}}': projectName,
      '{{field_display_name}}': displayName,
      '{{field_list}}': fieldList,
      '{{deadline}}': deadlineLabel,
      '{{user_name}}': requesterName || 'Carbon Report Team',
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
  }, [contactName, deadline, fieldLabel, itemId, projectName, requesterName, template]);

  // Generate mailto template
  const generateMailtoLink = () => {
    const subject = encodeURIComponent(preview.subject);
    const body = encodeURIComponent(preview.body);
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const handleSend = () => {
    if (!contactEmail) {
      alert('Please enter a contact email address');
      return;
    }

    const mailtoLink = generateMailtoLink();
    window.location.href = mailtoLink;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full p-6 relative bg-white">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Request Data
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isGroup
                ? `Request all ${group} data`
                : `Request data for: ${fieldLabel}`}
            </p>
            {fieldHint && (
              <p className="text-xs text-muted-foreground mt-1">
                Hint: {fieldHint}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="colleague@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
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
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - used in email greeting
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

              <div>
                <Label htmlFor="requesterName">Your Name</Label>
                <Input
                  id="requesterName"
                  type="text"
                  placeholder="Carbon Report Team"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Shown in email signature
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Email Preview:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>
                  <strong>To:</strong> {contactEmail || '[email]'}
                </p>
                <p>
                  <strong>Subject:</strong> {preview.subject}
                </p>
                {fieldId && (
                  <p>
                    <strong>Field ID:</strong> {fieldId}
                  </p>
                )}
                <div className="mt-2">
                  <strong>Body:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground bg-background/60 border rounded p-2">
                    {preview.body}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend}>
              <Mail className="h-4 w-4 mr-2" />
              Open Email Client
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
