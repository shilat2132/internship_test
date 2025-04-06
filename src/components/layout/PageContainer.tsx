
import React from 'react';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  children,
  action
}) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
};

export default PageContainer;
