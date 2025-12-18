import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-card border border-border shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-warm">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        {trend && (
          <span className={cn(
            "text-sm font-semibold px-2 py-1 rounded-lg",
            trend.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default StatCard;
