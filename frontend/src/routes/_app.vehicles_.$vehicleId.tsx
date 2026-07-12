import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Fuel, Gauge, Route as RouteIcon, Wrench } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { vehicles, trips, maintenance, fuelLogs, driverById } from "@/data/mock";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_app/vehicles_/$vehicleId")({
  loader: ({ params }) => {
    const vehicle = vehicles.find((v) => v.id === params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error.message}</div>,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <h2 className="font-display text-xl font-semibold">Vehicle not found</h2>
      <Button asChild variant="outline" className="mt-4 rounded-xl">
        <Link to="/vehicles">Back to Vehicles</Link>
      </Button>
    </div>
  ),
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();

  const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id);
  const vehicleMaintenance = maintenance.filter((m) => m.vehicleId === vehicle.id);
  const vehicleFuel = fuelLogs.filter((f) => f.vehicleId === vehicle.id);
  const totalRevenue = vehicleTrips.reduce((s, t) => s + t.revenue, 0);
  const totalFuelCost = vehicleFuel.reduce((s, f) => s + f.totalCost, 0);
  const totalMaintCost = vehicleMaintenance.reduce((s, m) => s + m.cost, 0);

  const timeline = [
    ...vehicleTrips.map((t) => ({
      date: t.startDate,
      icon: RouteIcon,
      title: `Trip ${t.ref}`,
      detail: `${t.origin} → ${t.destination} · ${driverById(t.driverId)?.name}`,
      status: t.status,
    })),
    ...vehicleMaintenance.map((m) => ({
      date: m.date,
      icon: Wrench,
      title: m.type,
      detail: `${m.vendor} · ${formatCurrency(m.cost)}`,
      status: m.status,
    })),
    ...vehicleFuel.slice(0, 4).map((f) => ({
      date: f.date,
      icon: Fuel,
      title: `Refuel — ${f.liters} L`,
      detail: `${f.station} · ${formatCurrency(f.totalCost)}`,
      status: "completed",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div>
      <PageHeader
        title={vehicle.name}
        description={`${vehicle.registration} · ${vehicle.type} · ${vehicle.year}`}
        actions={
          <Button asChild variant="outline" className="gap-1.5 rounded-xl">
            <Link to="/vehicles"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stats */}
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              Overview <StatusBadge status={vehicle.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Registration", vehicle.registration],
              ["Type", vehicle.type],
              ["Fuel type", vehicle.fuelType],
              ["Max capacity", `${formatNumber(vehicle.capacityKg)} kg`],
              ["Odometer", `${formatNumber(vehicle.odometerKm)} km`],
              ["Acquisition cost", formatCurrency(vehicle.acquisitionCost)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-accent p-3">
                <Gauge className="mx-auto h-4 w-4 text-accent-foreground" />
                <p className="mt-1 font-display text-sm font-bold">{vehicleTrips.length}</p>
                <p className="text-[10px] text-muted-foreground">Trips</p>
              </div>
              <div className="rounded-xl bg-accent p-3">
                <Fuel className="mx-auto h-4 w-4 text-accent-foreground" />
                <p className="mt-1 font-display text-sm font-bold">{formatCurrency(totalFuelCost)}</p>
                <p className="text-[10px] text-muted-foreground">Fuel</p>
              </div>
              <div className="rounded-xl bg-accent p-3">
                <Wrench className="mx-auto h-4 w-4 text-accent-foreground" />
                <p className="mt-1 font-display text-sm font-bold">{formatCurrency(totalMaintCost)}</p>
                <p className="text-[10px] text-muted-foreground">Service</p>
              </div>
            </div>
            <div className="rounded-xl gradient-hero p-4 text-primary-foreground">
              <p className="text-xs text-primary-foreground/80">Revenue generated</p>
              <p className="font-display text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="rounded-2xl border-border/70 shadow-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No recorded activity for this vehicle yet.
              </p>
            ) : (
              <ol className="relative ml-3 space-y-6 border-l border-border pl-6">
                {timeline.map((item, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[34px] grid h-6 w-6 place-items-center rounded-full border bg-card shadow-card">
                      <item.icon className="h-3 w-3 text-primary" />
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <StatusBadge status={item.status} className="text-[10px]" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{formatDate(item.date)}</p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
