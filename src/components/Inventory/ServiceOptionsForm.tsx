import React from 'react';

interface ServiceOption {
  name: string;
  included: boolean;
}

interface ServiceOptionsFormProps {
  options: ServiceOption[];
  onChange: (options: ServiceOption[]) => void;
}

export default function ServiceOptionsForm({ options, onChange }: ServiceOptionsFormProps) {
  const handleOptionChange = (index: number) => {
    const updatedOptions = options.map((option, i) => 
      i === index ? { ...option, included: !option.included } : option
    );
    onChange(updatedOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Service Includes
      </label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <label key={option.name} className="flex items-center">
            <input
              type="checkbox"
              checked={option.included}
              onChange={() => handleOptionChange(index)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm text-gray-700">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}