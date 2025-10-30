
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add onClick property to allow the Card component to handle click events.
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
