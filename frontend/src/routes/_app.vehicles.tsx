import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";

import type { Vehicle } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import logistics3d from "@/assets/logistics-3d.png";

export const Route = createFileRoute("/_app/vehicles")({
  component: VehiclesPage,
});

const PAGE_SIZE = 8;

function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
  fetchVehicles();
}, []);

const fetchVehicles = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/vehicles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setVehicles(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  const filtered = useMemo(
    () =>
      vehicles.filter((v) => {
        const q = search.toLowerCase();
        return (
          (v.name.toLowerCase().includes(q) || v.registration.toLowerCase().includes(q)) &&
          (status === "all" || v.status === status) &&
          (type === "all" || v.type === type)
        );
      }),
    [search, status, type],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openAdd = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setDrawerOpen(true); };

  return (
    <div>
      <PageHeader
        title="Vehicles"
        description={`${vehicles.length} vehicles in your fleet`}
        actions={
          <Button onClick={openAdd} className="gap-1.5 rounded-xl">
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        }
      />

      <Card className="rounded-2xl border-border/70 shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-48 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                <SelectItem value="Delivery Van">Delivery Van</SelectItem>
                <SelectItem value="Trailer">Trailer</SelectItem>
                <SelectItem value="Reefer Truck">Reefer Truck</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              image={logistics3d}
              title="No vehicles found"
              description="Try adjusting your search or filters, or add a new vehicle to your fleet."
              action={<Button onClick={openAdd} variant="outline" className="rounded-xl">Add Vehicle</Button>}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">Capacity</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">Odometer</TableHead>
                      <TableHead className="hidden xl:table-cell text-right">Acquisition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((v) => (
                      <TableRow key={v.id} className="group">
                        <TableCell className="font-mono text-xs">{v.registration}</TableCell>
                        <TableCell>
                          <Link
                            to="/vehicles/$vehicleId"
                            params={{ vehicleId: v.id }}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {v.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{v.year} · {v.fuelType}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{v.type}</TableCell>
                        <TableCell className="hidden lg:table-cell text-right">{formatNumber(v.capacityKg)} kg</TableCell>
                        <TableCell className="hidden lg:table-cell text-right">{formatNumber(v.odometerKm)} km</TableCell>
                        <TableCell className="hidden xl:table-cell text-right">{formatCurrency(v.acquisitionCost)}</TableCell>
                        <TableCell><StatusBadge status={v.status} /></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to="/vehicles/$vehicleId" params={{ vehicleId: v.id }}>
                                  <Eye className="mr-2 h-4 w-4" /> View details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(v)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => toast.success(`${v.name} archived`, { description: "This is a demo — no data was changed." })}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="rounded-lg" disabled={current === 1} onClick={() => setPage(current - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg" disabled={current === pages} onClick={() => setPage(current + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? `Edit ${editing.name}` : "Add Vehicle"}</SheetTitle>
            <SheetDescription>
              {editing ? "Update vehicle information." : "Register a new vehicle to your fleet."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4 py-2">
            <div className="grid gap-2">
              <Label>Vehicle name</Label>
              <Input defaultValue={editing?.name} placeholder="e.g. Volvo FH16 #26" />
            </div>
            <div className="grid gap-2">
              <Label>Registration number</Label>
              <Input defaultValue={editing?.registration} placeholder="TX-0000-AA" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select defaultValue={editing?.type ?? "Heavy Truck"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                    <SelectItem value="Delivery Van">Delivery Van</SelectItem>
                    <SelectItem value="Trailer">Trailer</SelectItem>
                    <SelectItem value="Reefer Truck">Reefer Truck</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select defaultValue={editing?.status ?? "available"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Capacity (kg)</Label>
                <Input type="number" defaultValue={editing?.capacityKg} placeholder="24000" />
              </div>
              <div className="grid gap-2">
                <Label>Odometer (km)</Label>
                <Input type="number" defaultValue={editing?.odometerKm} placeholder="120000" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Acquisition cost ($)</Label>
              <Input type="number" defaultValue={editing?.acquisitionCost} placeholder="125000" />
            </div>
          </div>
          <SheetFooter>
            <Button
              className="rounded-xl"
              onClick={() => {
                setDrawerOpen(false);
                toast.success(editing ? "Vehicle updated" : "Vehicle added", {
                  description: "This is a demo — no data was persisted.",
                });
              }}
            >
              {editing ? "Save changes" : "Add vehicle"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
