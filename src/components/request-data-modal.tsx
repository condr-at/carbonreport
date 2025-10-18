'use client';

/**
 * Request Data Modal
 * 
 * Opens email client with pre-filled template for requesting data from contacts
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Mail } from 'lucide-react';

interface RequestDataModalProps {
  projectName: string;
  fieldLabel?: string;
  fieldId?: string;
  itemId?: string | null;
  group?: string;
  isGroup?: boolean;
  onClose: () => void;
}

export function RequestDataModal({
  projectName,
  fieldLabel,
  fieldId,
  itemId,
  group,
  isGroup = false,
  onClose,
}: RequestDataModalProps) {
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');

  // Generate mailto template
  const generateMailtoLink = () => {
    const subject = encodeURIComponent(
      `Data Request for ${projectName} - ${group || fieldLabel}`
    );

    let bodyText = `Hi ${contactName || '[Contact Name]'},\n\n`;
    bodyText += `I'm working on the carbon footprint report for "${projectName}" and need your help with some data.\n\n`;

    if (isGroup && group) {
      bodyText += `Please provide the following information for ${group}:\n`;
      bodyText += `[List specific fields here]\n\n`;
    } else if (fieldLabel) {
      if (itemId) {
        bodyText += `Could you provide the following data for Item #${itemId}:\n`;
        bodyText += `- ${fieldLabel}\n\n`;
      } else {
        bodyText += `Could you provide the following data:\n`;
        bodyText += `- ${fieldLabel}\n\n`;
      }
    }

    bodyText += `Please reply with this information at your earliest convenience.\n\n`;
    bodyText += `Thank you!\n`;

    const body = encodeURIComponent(bodyText);
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

            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Email Preview:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>
                  <strong>To:</strong> {contactEmail || '[email]'}
                </p>
                <p>
                  <strong>Subject:</strong> Data Request for {projectName} -{' '}
                  {group || fieldLabel}
                </p>
                {fieldId && (
                  <p>
                    <strong>Field ID:</strong> {fieldId}
                  </p>
                )}
                <p className="mt-2">
                  <strong>Body:</strong> (Click &quot;Open Email Client&quot; to see full
                  message)
                </p>
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
