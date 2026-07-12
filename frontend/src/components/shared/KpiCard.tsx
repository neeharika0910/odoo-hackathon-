import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export function KpiCard({ title, value, icon: Icon, hint, trend, trendUp, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="rounded-2xl border-border/70 shadow-card card-lift">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {title}
              </p>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                {value}
              </p>
            </div>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent">
              <Icon className="h-4 w-4 text-accent-foreground" />
            </div>
          </div>
          {(hint || trend) && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              {trend && (
                <span className={cn("font-semibold", trendUp ? "text-success" : "text-destructive")}>
                  {trend}
                </span>
              )}
              {hint}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
