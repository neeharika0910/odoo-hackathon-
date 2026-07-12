import type { ReactNode } from "react";

interface EmptyStateProps {
  image: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ image, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
      <img src={image} alt="" width={160} height={160} loading="lazy" className="h-40 w-40 object-contain opacity-90" />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
