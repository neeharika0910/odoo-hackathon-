import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Plus, Search, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { trips, vehicles, drivers, vehicleById, driverById } from "@/data/mock";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import logistics3d from "@/assets/logistics-3d.png";

export const Route = createFileRoute("/_app/trips")({
  component: TripsPage,
});

const wizardSteps = ["Route", "Assignment", "Review"];

function TripsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargo, setCargo] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");

  const filtered = useMemo(
    () =>
      trips.filter((t) => {
        const q = search.toLowerCase();
        return (
          (t.ref.toLowerCase().includes(q) ||
            t.origin.toLowerCase().includes(q) ||
            t.destination.toLowerCase().includes(q)) &&
          (status === "all" || t.status === status)
        );
      }),
    [search, status],
  );

  const resetWizard = () => {
    setStep(0); setOrigin(""); setDestination(""); setCargo(""); setVehicleId(""); setDriverId("");
  };

  const finishWizard = () => {
    setWizardOpen(false);
    resetWizard();
    toast.success("Trip created as draft", { description: "This is a demo — no data was persisted." });
  };

  return (
    <div>
      <PageHeader
        title="Trips"
        description={`${trips.length} trips · ${trips.filter((t) => t.status === "dispatched").length} currently on the road`}
        actions={
          <Button className="gap-1.5 rounded-xl" onClick={() => { resetWizard(); setWizardOpen(true); }}>
            <Plus className="h-4 w-4" /> Create Trip
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          image={logistics3d}
          title="No trips found"
          description="Adjust your filters or create a new trip to get freight moving."
          action={<Button variant="outline" className="rounded-xl" onClick={() => setWizardOpen(true)}>Create Trip</Button>}
        />
      ) : (
        <Tabs defaultValue="table">
          <TabsList className="mb-4 rounded-full">
            <TabsTrigger value="table" className="rounded-full">Table</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-full">Timeline</TabsTrigger>
            <TabsTrigger value="map" className="rounded-full">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card className="rounded-2xl border-border/70 shadow-card">
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trip</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
                        <TableHead className="hidden md:table-cell">Driver</TableHead>
                        <TableHead className="hidden sm:table-cell">Start</TableHead>
                        <TableHead className="hidden xl:table-cell text-right">Distance</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.slice(0, 15).map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.ref}</TableCell>
                          <TableCell className="max-w-48 truncate text-muted-foreground">
                            {t.origin} → {t.destination}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">{vehicleById(t.vehicleId)?.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{driverById(t.driverId)?.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(t.startDate)}</TableCell>
                          <TableCell className="hidden xl:table-cell text-right">{formatNumber(t.distanceKm)} km</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(t.revenue)}</TableCell>
                          <TableCell><StatusBadge status={t.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="rounded-2xl border-border/70 shadow-card">
              <CardContent className="p-6">
                <ol className="relative ml-3 space-y-6 border-l border-border pl-6">
                  {filtered.slice(0, 10).map((t) => (
                    <li key={t.id} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-card",
                          t.status === "completed" ? "bg-success"
                            : t.status === "dispatched" ? "bg-primary"
                            : t.status === "cancelled" ? "bg-destructive"
                            : "bg-muted-foreground",
                        )}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{t.ref}</p>
                        <StatusBadge status={t.status} className="text-[10px]" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.origin} → {t.destination} · {t.cargo}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                        {formatDate(t.startDate)} · {driverById(t.driverId)?.name} · {vehicleById(t.vehicleId)?.name}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="rounded-2xl border-border/70 shadow-card">
              <CardContent className="p-4">
                <div className="grid h-96 place-items-center rounded-xl border border-dashed bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:20px_20px]">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 font-display font-semibold">Live map coming soon</p>
                    <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                      Real-time trip tracking will appear here once GPS telematics are connected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Create trip wizard */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Trip</DialogTitle>
            <DialogDescription>Plan a new trip in {wizardSteps.length} quick steps.</DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {wizardSteps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                    i < step ? "bg-success text-success-foreground"
                      : i === step ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn("hidden text-xs font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
                  {s}
                </span>
                {i < wizardSteps.length - 1 && <div className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Origin</Label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Chicago, IL" />
              </div>
              <div className="grid gap-2">
                <Label>Destination</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Denver, CO" />
              </div>
              <div className="grid gap-2">
                <Label>Cargo</Label>
                <Input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="e.g. Consumer electronics" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Vehicle</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
                  <SelectTrigger><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.filter((v) => v.status === "available").map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name} · {v.registration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Driver</Label>
                <Select value={driverId} onValueChange={setDriverId}>
                  <SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger>
                  <SelectContent>
                    {drivers.filter((d) => d.status !== "on-leave").map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} · Safety {d.safetyScore}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 rounded-xl bg-accent p-4 text-sm">
              {[
                ["Route", origin && destination ? `${origin} → ${destination}` : "Not set"],
                ["Cargo", cargo || "Not set"],
                ["Vehicle", vehicleId ? vehicleById(vehicleId)?.name ?? "—" : "Not assigned"],
                ["Driver", driverId ? driverById(driverId)?.name ?? "—" : "Not assigned"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2">
            {step > 0 && (
              <Button variant="outline" className="rounded-xl" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < wizardSteps.length - 1 ? (
              <Button className="gap-1.5 rounded-xl" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-1.5 rounded-xl" onClick={finishWizard}>
                <Check className="h-4 w-4" /> Create Trip
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
