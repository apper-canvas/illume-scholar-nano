import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import emailService from "@/services/api/emailService";

const EmailComposer = ({ recipients = [], onClose, defaultSubject = "", defaultBody = "" }) => {
  const [formData, setFormData] = useState({
    subject: defaultSubject,
    body: defaultBody,
    selectedRecipients: recipients.map(r => r.id)
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setSending(true);
    try {
      const selectedRecipients = recipients.filter(r => 
        formData.selectedRecipients.includes(r.id)
      );
      
      await emailService.bulkSendEmail(
        selectedRecipients,
        formData.subject,
        formData.body
      );
      
      toast.success(`Email sent to ${selectedRecipients.length} recipients`);
      onClose();
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecipientToggle = (recipientId) => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: prev.selectedRecipients.includes(recipientId)
        ? prev.selectedRecipients.filter(id => id !== recipientId)
        : [...prev.selectedRecipients, recipientId]
    }));
  };

  const selectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: recipients.map(r => r.id)
    }));
  };

  const selectNone = () => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-premium-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Compose Email to Parents
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Recipients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Recipients ({formData.selectedRecipients.length} selected)</Label>
              <div className="flex items-center space-x-2">
                <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={selectNone}>
                  Select None
                </Button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
              {recipients.map(recipient => (
                <label key={recipient.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedRecipients.includes(recipient.id)}
                    onChange={() => handleRecipientToggle(recipient.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{recipient.name}</p>
                    <p className="text-sm text-gray-600">{recipient.parentName} - {recipient.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              required
            />
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="body">Message</Label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Enter your message..."
              rows={10}
              className="input-field resize-none"
              required
            />
          </div>

          {/* Quick Templates */}
          <div>
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  subject: "Weekly Grade Update",
                  body: "Dear Parents,\n\nI hope this email finds you well. I wanted to provide you with an update on your child's academic progress this week.\n\nBest regards,\nTeacher"
                }))}
              >
                Grade Update
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  subject: "Upcoming Assignment Reminder",
                  body: "Dear Parents,\n\nThis is a friendly reminder about an upcoming assignment due next week. Please ensure your child is prepared.\n\nBest regards,\nTeacher"
                }))}
              >
                Assignment Reminder
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  subject: "General Announcement",
                  body: "Dear Parents,\n\nI have an important announcement to share with you regarding our class.\n\nBest regards,\nTeacher"
                }))}
              >
                General Announcement
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailComposer;