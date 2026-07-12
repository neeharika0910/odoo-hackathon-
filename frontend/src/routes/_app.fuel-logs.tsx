import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Fuel, Plus, DollarSign, Droplets } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { fuelLogs, fuelSeries, vehicles, vehicleById, driverById } from "@/data/mock";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_app/fuel-logs")({
  component: FuelLogsPage,
});

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

function FuelLogsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const totalLiters = fuelLogs.reduce((s, f) => s + f.liters, 0);
  const totalCost = fuelLogs.reduce((s, f) => s + f.totalCost, 0);
  const avgPrice = totalCost / totalLiters;

  return (
    <div>
      <PageHeader
        title="Fuel Logs"
        description="Track consumption and cost across the fleet"
        actions={
          <Button className="gap-1.5 rounded-xl" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Log Refuel
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Total Fuel (YTD)" value={`${formatNumber(totalLiters)} L`} icon={Droplets} trend="+6%" trendUp hint="vs last year" />
        <KpiCard title="Fuel Spend (YTD)" value={formatCurrency(totalCost)} icon={DollarSign} hint="across 30 fills" delay={0.05} />
        <KpiCard title="Avg Price / Liter" value={`$${avgPrice.toFixed(2)}`} icon={Fuel} hint="fleet average" delay={0.1} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Fuel Cost</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelSeries}>
                <defs>
                  <linearGradient id="fuelCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="cost" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#fuelCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Fuel Consumption (Liters)</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="liters" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="hidden md:table-cell">Driver</TableHead>
                  <TableHead className="hidden lg:table-cell">Station</TableHead>
                  <TableHead className="text-right">Liters</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">$/L</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelLogs.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-muted-foreground">{formatDate(f.date)}</TableCell>
                    <TableCell className="font-medium">{vehicleById(f.vehicleId)?.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{driverById(f.driverId)?.name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{f.station}</TableCell>
                    <TableCell className="text-right">{f.liters}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right text-muted-foreground">${f.costPerLiter.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(f.totalCost)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log refuel drawer */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Log Refuel</SheetTitle>
            <SheetDescription>Record a new fuel purchase.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4 py-2">
            <div className="grid gap-2">
              <Label>Vehicle</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicles.slice(0, 12).map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Liters</Label>
                <Input type="number" placeholder="250" />
              </div>
              <div className="grid gap-2">
                <Label>Price per liter</Label>
                <Input type="number" step="0.01" placeholder="1.32" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Station</Label>
              <Input placeholder="e.g. Pilot Flying J" />
            </div>
            <div className="grid gap-2">
              <Label>Odometer (km)</Label>
              <Input type="number" placeholder="184200" />
            </div>
          </div>
          <SheetFooter>
            <Button
              className="rounded-xl"
              onClick={() => {
                setFormOpen(false);
                toast.success("Fuel log recorded", { description: "This is a demo — no data was persisted." });
              }}
            >
              Save log
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
