"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  phoneNumber: string;
  message: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber, 
  message, 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  ...props 
}) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn("bg-gradient-to-r from-black to-amber-300 !text-white hover:from-amber-500 hover:to-black transition-all duration-300", className)}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};

export default WhatsAppButton;