"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, RotateCcw, Mail } from 'lucide-react';

interface MailtoTemplatesClientProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  template: { subject: string; body: string } | null;
}

export function MailtoTemplatesClient({ projectId, projectName, projectOwnerName, template }: MailtoTemplatesClientProps) {
  const [subject, setSubject] = useState(template?.subject || '');
  const [body, setBody] = useState(template?.body || '');
  const [originalSubject] = useState(template?.subject || '');
  const [originalBody] = useState(template?.body || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isDirty = subject !== originalSubject || body !== originalBody;
  const ownerDisplayName = projectOwnerName.trim() || 'Carbon Report Team';
  const sampleSignature = `${ownerDisplayName} - ${projectName}`;

  const handleRevert = () => {
    setSubject(originalSubject);
    setBody(originalBody);
  };

  const handleSave = async () => {
    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();

    if (!trimmedSubject || !trimmedBody) {
      alert('Subject and body are required.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/mailto-template`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: trimmedSubject,
          body: trimmedBody,
        }),
      });

      if (!response.ok) {
        let message = 'Failed to save template.';

        try {
          const payload = await response.json();
          if (payload?.error) {
            message = payload.error;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }

        alert(message);
        return;
      }

      // Reload page to get fresh data
      window.location.reload();
    } catch (error) {
      console.error('Error saving mailto template:', error);
      alert('Failed to save template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset template to default? Unsaved changes will be lost.'
    );
    if (!confirmed) {
      return;
    }

    setIsResetting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/mailto-template/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        let message = 'Failed to reset template.';

        try {
          const payload = await response.json();
          if (payload?.error) {
            message = payload.error;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }

        alert(message);
        return;
      }

      // Reload page to get fresh data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting template:', error);
      alert('Failed to reset template.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Template
              </CardTitle>
              <CardDescription className="mt-1">
                Customize the email template used for requesting data across all fields in this project.
              </CardDescription>
            </div>
            {isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Available placeholders:</p>
            <ul className="space-y-1 text-xs">
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{contact_name}}'}</code> — Name of the person you are contacting</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{project_name}}'}</code> — {projectName}</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{field_display_name}}'}</code> — Field name (for example: Product Name)</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{field_list}}'}</code> — Bullet list of selected fields (for bulk requests)</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{deadline}}'}</code> — Optional deadline date</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">{'{{requester_signature}}'}</code> — Auto-filled signature ({ownerDisplayName} - {projectName})</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Data Request for ${projectName}`}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="body">Email Body</Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 h-64 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder={`Dear {{contact_name}},\n\nWe are working on the ${projectName} carbon footprint report and need your help with {{field_display_name}}.\n\nCould you please provide the following information?\n{{field_list}}\n\nPlease share the latest details by {{deadline}}.\n\nThank you,\n{{requester_signature}}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isResetting || isSaving}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {isResetting ? 'Resetting…' : 'Reset to Default'}
            </Button>

            <div className="flex gap-3">
              {isDirty && (
                <Button
                  variant="ghost"
                  onClick={handleRevert}
                  disabled={isSaving || isResetting}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || isResetting || !isDirty}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>
            See how your template will look with sample data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">SUBJECT:</p>
            <p className="text-sm border rounded-md p-3 bg-muted/30">
              {subject
                .replace(/\{\{contact_name\}\}/g, 'John Doe')
                .replace(/\{\{project_name\}\}/g, projectName)
                .replace(/\{\{field_display_name\}\}/g, 'Product Carbon Footprint')
                .replace(/\{\{field_list\}\}/g, '• Product Carbon Footprint\n• Grid Emission Factor')
                .replace(/\{\{deadline\}\}/g, 'December 31, 2025')
                .replace(/\{\{requester_signature\}\}/g, sampleSignature)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">BODY:</p>
            <pre className="text-sm border rounded-md p-3 bg-muted/30 whitespace-pre-wrap font-sans">
              {body
                .replace(/\{\{contact_name\}\}/g, 'John Doe')
                .replace(/\{\{project_name\}\}/g, projectName)
                .replace(/\{\{field_display_name\}\}/g, 'Product Carbon Footprint')
                .replace(/\{\{field_list\}\}/g, '• Product Carbon Footprint\n• Grid Emission Factor')
                .replace(/\{\{deadline\}\}/g, 'December 31, 2025')
                .replace(/\{\{requester_signature\}\}/g, sampleSignature)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
