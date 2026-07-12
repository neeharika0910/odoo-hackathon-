import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editing, setEditing] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    registration: "",
    type: "Heavy Truck",
    fuelType: "Diesel",
    year: 2024,
    capacityKg: 0,
    odometerKm: 0,
    acquisitionCost: 0,
    status: "available",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");

      setVehicles(res.data);
    } catch (error) {
      console.log(error);

      toast.error("Unable to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);

    setFormData({
      name: "",
      registration: "",
      type: "Heavy Truck",
      fuelType: "Diesel",
      year: 2024,
      capacityKg: 0,
      odometerKm: 0,
      acquisitionCost: 0,
      status: "available",
    });

    setDrawerOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditing(vehicle);

    setFormData({
      name: vehicle.name,
      registration: vehicle.registration,
      type: vehicle.type,
      fuelType: vehicle.fuelType,
      year: vehicle.year,
      capacityKg: vehicle.capacityKg,
      odometerKm: vehicle.odometerKm,
      acquisitionCost: vehicle.acquisitionCost,
      status: vehicle.status,
    });

    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/vehicles/${editing._id}`, formData);

        toast.success("Vehicle Updated");
      } else {
        await api.post("/vehicles", formData);

        toast.success("Vehicle Added");
      }

      fetchVehicles();

      setDrawerOpen(false);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;

    try {
      await api.delete(`/vehicles/${id}`);

      toast.success("Vehicle Deleted");

      fetchVehicles();
    } catch (error) {
      console.log(error);

      toast.error("Delete Failed");
    }
  };

  const filtered = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const query = search.toLowerCase();

      return (
        (vehicle.name.toLowerCase().includes(query) ||
          vehicle.registration.toLowerCase().includes(query)) &&
        (status === "all" || vehicle.status === status) &&
        (type === "all" || vehicle.type === type)
      );
    });
  }, [vehicles, search, status, type]);

  const pages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const current = Math.min(page, pages);

  const rows = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Vehicles...
        </h2>
      </div>
    );
  }

  return (
  <div>
    <PageHeader
      title="Vehicles"
      description={`${vehicles.length} vehicles in your fleet`}
      actions={
        <Button onClick={openAdd} className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      }
    />

    <Card className="rounded-2xl border-border/70 shadow-card">
      <CardContent className="p-4 sm:p-5">

        <div className="mb-4 flex flex-wrap items-center gap-2">

          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search by name or registration..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={type}
            onValueChange={(value) => {
              setType(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
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
            title="No Vehicles Found"
            description="Try changing filters or add a new vehicle."
            action={
              <Button
                variant="outline"
                onClick={openAdd}
                className="rounded-xl"
              >
                Add Vehicle
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">

              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">
                      Capacity
                    </TableHead>
                    <TableHead className="text-right">
                      Odometer
                    </TableHead>
                    <TableHead className="text-right">
                      Cost
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {rows.map((v) => (

                    <TableRow key={v._id}>

                      <TableCell className="font-mono">
                        {v.registration}
                      </TableCell>

                      <TableCell>

                        <Link
                          to="/vehicles/$vehicleId"
                          params={{
                            vehicleId: v._id,
                          }}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {v.name}
                        </Link>

                        <p className="text-xs text-muted-foreground">
                          {v.year} • {v.fuelType}
                        </p>

                      </TableCell>

                      <TableCell>
                        {v.type}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatNumber(v.capacityKg)} kg
                      </TableCell>

                      <TableCell className="text-right">
                        {formatNumber(v.odometerKm)} km
                      </TableCell>

                      <TableCell className="text-right">
                        {formatCurrency(v.acquisitionCost)}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={v.status} />
                      </TableCell>

                      <TableCell>

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>

                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>

                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem asChild>

                              <Link
                                to="/vehicles/$vehicleId"
                                params={{
                                  vehicleId: v._id,
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>

                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => openEdit(v)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                deleteVehicle(v._id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
                Showing {(current - 1) * PAGE_SIZE + 1} -
                {Math.min(current * PAGE_SIZE, filtered.length)}
                {" "}of{" "}
                {filtered.length}
              </p>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={current === pages}
                  onClick={() => setPage(current + 1)}
                >
                  Next
                </Button>

              </div>

            </div>

          </>
        )}

      </CardContent>
    </Card>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit Vehicle" : "Add Vehicle"}
            </SheetTitle>

            <SheetDescription>
              {editing
                ? "Update vehicle information."
                : "Register a new vehicle."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-6">

            <div className="grid gap-2">
              <Label>Vehicle Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Registration</Label>
              <Input
                value={formData.registration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registration: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="grid gap-2">
                <Label>Type</Label>

                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Heavy Truck">
                      Heavy Truck
                    </SelectItem>

                    <SelectItem value="Delivery Van">
                      Delivery Van
                    </SelectItem>

                    <SelectItem value="Trailer">
                      Trailer
                    </SelectItem>

                    <SelectItem value="Pickup">
                      Pickup
                    </SelectItem>

                    <SelectItem value="Reefer Truck">
                      Reefer Truck
                    </SelectItem>
                  </SelectContent>

                </Select>

              </div>

              <div className="grid gap-2">

                <Label>Status</Label>

                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="available">
                      Available
                    </SelectItem>

                    <SelectItem value="active">
                      Active
                    </SelectItem>

                    <SelectItem value="maintenance">
                      Maintenance
                    </SelectItem>

                    <SelectItem value="inactive">
                      Inactive
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="grid gap-2">
                <Label>Fuel Type</Label>

                <Input
                  value={formData.fuelType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelType: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">

                <Label>Year</Label>

                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: Number(e.target.value),
                    })
                  }
                />

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="grid gap-2">

                <Label>Capacity (kg)</Label>

                <Input
                  type="number"
                  value={formData.capacityKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacityKg: Number(e.target.value),
                    })
                  }
                />

              </div>

              <div className="grid gap-2">

                <Label>Odometer (km)</Label>

                <Input
                  type="number"
                  value={formData.odometerKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      odometerKm: Number(e.target.value),
                    })
                  }
                />

              </div>

            </div>

            <div className="grid gap-2">

              <Label>Acquisition Cost</Label>

              <Input
                type="number"
                value={formData.acquisitionCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acquisitionCost: Number(e.target.value),
                  })
                }
              />

            </div>

          </div>

          <SheetFooter>

            <Button
              onClick={handleSave}
              className="w-full"
            >
              {editing ? "Update Vehicle" : "Add Vehicle"}
            </Button>

          </SheetFooter>

        </SheetContent>
      </Sheet>

    </div>
  );
}