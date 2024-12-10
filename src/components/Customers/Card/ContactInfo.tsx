import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Tooltip } from '../Common/Tooltip';

interface ContactInfoProps {
  phone: string;
  email?: string;
  whatsappPhone?: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export function ContactInfo({ phone, email, whatsappPhone, preferredContact }: ContactInfoProps) {
  const getPreferredLabel = () => {
    switch (preferredContact) {
      case 'phone': return 'Prefers phone calls';
      case 'email': return 'Prefers email';
      case 'whatsapp': return 'Prefers WhatsApp';
      default: return '';
    }
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span>{phone}</span>
        </div>
        
        {email && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <Tooltip content={email}>
              <span className="truncate max-w-[200px]">{email}</span>
            </Tooltip>
          </div>
        )}
        
        {whatsappPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span>{whatsappPhone}</span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {getPreferredLabel()}
        </span>
      </div>
    </div>
  );
}