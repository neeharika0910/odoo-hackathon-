import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  // vehicles
  active: "bg-primary/10 text-primary border-transparent",
  available: "bg-success/10 text-success border-transparent",
  maintenance: "bg-warning/15 text-warning-foreground border-transparent",
  inactive: "bg-muted text-muted-foreground border-transparent",
  // drivers
  "on-duty": "bg-success/10 text-success border-transparent",
  "off-duty": "bg-muted text-muted-foreground border-transparent",
  "on-leave": "bg-warning/15 text-warning-foreground border-transparent",
  // trips
  draft: "bg-muted text-muted-foreground border-transparent",
  dispatched: "bg-primary/10 text-primary border-transparent",
  completed: "bg-success/10 text-success border-transparent",
  cancelled: "bg-destructive/10 text-destructive border-transparent",
  // maintenance
  scheduled: "bg-muted text-muted-foreground border-transparent",
  "in-progress": "bg-primary/10 text-primary border-transparent",
  // expenses
  approved: "bg-success/10 text-success border-transparent",
  pending: "bg-warning/15 text-warning-foreground border-transparent",
  rejected: "bg-destructive/10 text-destructive border-transparent",
};

const labels: Record<string, string> = {
  "on-duty": "On duty",
  "off-duty": "Off duty",
  "on-leave": "On leave",
  "in-progress": "In progress",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium capitalize", styles[status], className)}
    >
      {labels[status] ?? status}
    </Badge>
  );
}
