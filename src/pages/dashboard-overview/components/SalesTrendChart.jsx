import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import Icon from '../../../components/AppIcon';

const SalesTrendChart = ({ data, isLoading }) => {
    
    const formatYAxis = (tickItem) => `₦${(tickItem / 1000)}k`;
    const formatXAxis = (tickItem) => format(new Date(tickItem), 'MMM d');

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
            <div className="bg-card p-2 border border-border rounded-lg shadow-lg">
                <p className="font-medium text-foreground">{`${format(new Date(label), 'eeee, MMM d')}`}</p>
                <p className="text-primary">{`Revenue: ₦${payload[0].value.toLocaleString()}`}</p>
            </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return <div className="w-full h-[300px] bg-muted rounded-lg animate-pulse"></div>;
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                Revenue (Last 7 Days)
            </h2>
            <div style={{ width: '100%', height: 300 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis 
                                dataKey="date" 
                                stroke="var(--color-muted-foreground)" 
                                fontSize={12}
                                tickFormatter={formatXAxis}
                            />
                            <YAxis 
                                stroke="var(--color-muted-foreground)" 
                                fontSize={12} 
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <Icon name="BarChart3" size={40} className="text-muted-foreground mb-4"/>
                        <h3 className="font-medium text-foreground">No Sales Data Yet</h3>
                        <p className="text-sm text-muted-foreground">Your sales trends will appear here once you start making sales.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesTrendChart;