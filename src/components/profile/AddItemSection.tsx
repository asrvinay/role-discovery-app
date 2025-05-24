
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface AddItemSectionProps {
  label: string;
  items: string[];
  onAddItem: (value: string) => void;
  onRemoveItem: (index: number) => void;
  placeholder: string;
  isInputActive: boolean;
  onToggleInput: () => void;
  currentInput: string;
  onInputChange: (value: string) => void;
  onInputSubmit: () => void;
}

const AddItemSection: React.FC<AddItemSectionProps> = ({
  label,
  items,
  onAddItem,
  onRemoveItem,
  placeholder,
  isInputActive,
  onToggleInput,
  currentInput,
  onInputChange,
  onInputSubmit
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRemoveItem(index)}
              />
            </Badge>
          ))}
        </div>
        {isInputActive ? (
          <div className="flex gap-2">
            <Input
              value={currentInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={placeholder}
              onKeyPress={(e) => e.key === 'Enter' && onInputSubmit()}
            />
            <Button onClick={onInputSubmit}>Add</Button>
          </div>
        ) : (
          <Button variant="outline" onClick={onToggleInput}>
            <Plus className="h-4 w-4 mr-1" /> {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItemSection;
