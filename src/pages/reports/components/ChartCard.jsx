import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, isLoading }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
        {title}
      </h2>
      <div style={{ width: '100%', height: 400 }}>
        {isLoading ? (
           <div className="w-full h-full bg-muted rounded-lg animate-pulse"></div>
        ) : (
            <ResponsiveContainer>
                {children}
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartCard;