
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OverviewCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 p-1.5 rounded-md bg-muted flex items-center justify-center text-orange-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-xs">
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">em relação ao mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
