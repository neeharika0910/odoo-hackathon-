import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Wrench, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { maintenance, vehicleById } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import maintenance3d from "@/assets/maintenance-3d.png";

export const Route = createFileRoute("/_app/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  const scheduled = maintenance.filter((m) => m.status === "scheduled");
  const inProgress = maintenance.filter((m) => m.status === "in-progress");
  const completed = maintenance.filter((m) => m.status === "completed");
  const totalCost = maintenance.reduce((s, m) => s + m.cost, 0);

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Keep your fleet healthy and on the road"
        actions={
          <Button
            className="gap-1.5 rounded-xl"
            onClick={() => toast.success("Work order created", { description: "This is a demo — no data was changed." })}
          >
            <Plus className="h-4 w-4" /> New Work Order
          </Button>
        }
      />

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 grid items-center gap-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:grid-cols-[1fr_auto] sm:p-8"
      >
        <div>
          <h2 className="font-display text-xl font-bold">Shop status</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {inProgress.length} vehicles currently in the shop, {scheduled.length} services scheduled.
            Total maintenance spend this year: <span className="font-semibold text-foreground">{formatCurrency(totalCost)}</span>.
          </p>
          <div className="mt-4 grid max-w-md grid-cols-3 gap-3">
            <div className="rounded-xl bg-accent p-3 text-center">
              <Clock className="mx-auto h-4 w-4 text-accent-foreground" />
              <p className="mt-1 font-display text-lg font-bold">{scheduled.length}</p>
              <p className="text-[10px] text-muted-foreground">Scheduled</p>
            </div>
            <div className="rounded-xl bg-accent p-3 text-center">
              <Wrench className="mx-auto h-4 w-4 text-accent-foreground" />
              <p className="mt-1 font-display text-lg font-bold">{inProgress.length}</p>
              <p className="text-[10px] text-muted-foreground">In progress</p>
            </div>
            <div className="rounded-xl bg-accent p-3 text-center">
              <CheckCircle2 className="mx-auto h-4 w-4 text-accent-foreground" />
              <p className="mt-1 font-display text-lg font-bold">{completed.length}</p>
              <p className="text-[10px] text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <img
          src={maintenance3d}
          alt="3D illustration of a truck being serviced"
          width={768}
          height={768}
          loading="lazy"
          className="hidden h-44 w-44 object-contain sm:block"
        />
      </motion.div>

      {/* In-progress cards */}
      {inProgress.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inProgress.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Card className="rounded-2xl border-border/70 shadow-card card-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{vehicleById(m.vehicleId)?.name}</p>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.type}</p>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{m.progress}%</span>
                    </div>
                    <Progress value={m.progress} className="h-2" />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {m.vendor} · est. {formatCurrency(m.cost)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full table */}
      <Card className="rounded-2xl border-border/70 shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden md:table-cell">Vendor</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenance.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{vehicleById(m.vehicleId)?.name}</TableCell>
                    <TableCell>
                      <p>{m.type}</p>
                      <p className="hidden text-xs text-muted-foreground lg:block">{m.description}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{m.vendor}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(m.date)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(m.cost)}</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
