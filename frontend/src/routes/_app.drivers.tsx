import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SafetyRing } from "@/components/shared/SafetyRing";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter
} from "@/components/ui/sheet";
import api from "@/lib/api";
import type { Driver } from "@/types";
import { formatDate, formatNumber, initials } from "@/lib/format";
import logistics3d from "@/assets/logistics-3d.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/drivers")({
  component: DriversPage,
});

function DriversPage() {
  const [loading, setLoading] = useState(true);

const [drivers, setDrivers] = useState<Driver[]>([]);

const [search, setSearch] = useState("");

const [selected, setSelected] = useState<Driver | null>(null);
const [drawerOpen, setDrawerOpen] = useState(false);

const [editing, setEditing] = useState<Driver | null>(null);

const [formData, setFormData] = useState({
  name: "",
  licenseNumber: "",
  licenseCategory: "LMV",
  licenseExpiry: "",
  contactNumber: "",
  safetyScore: 100,
  status: "available",
});

useEffect(() => {
  fetchDrivers();
}, []);

const fetchDrivers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/drivers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDrivers(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
  setFormData({
    name: "",
    licenseNumber: "",
    licenseCategory: "LMV",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: 100,
    status: "available",
  });

  setEditing(null);
};

const openAdd = () => {
  resetForm();
  setDrawerOpen(true);
};

const openEdit = (driver: Driver) => {
  setEditing(driver);

  setFormData({
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiry: driver.licenseExpiry?.slice(0, 10),
    contactNumber: driver.contactNumber,
    safetyScore: driver.safetyScore,
    status: driver.status,
  });

  setDrawerOpen(true);
};
  const filtered = useMemo(() => {
  return drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
}, [drivers, search]);
if (loading) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      Loading Drivers...
    </div>
  );
}


const handleSaveDriver = async () => {
  try {
    const token = localStorage.getItem("token");

    if (editing) {
      await api.put(
        `/drivers/${editing._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Driver Updated");
    } else {
      await api.post(
        "/drivers",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Driver Added");
    }

    fetchDrivers();

    setDrawerOpen(false);

    resetForm();

  } catch (err: any) {
    console.log(err);

    toast.error(
      err?.response?.data?.message ||
      "Failed to save driver"
    );
  }
};
  return (
    <div>
      <PageHeader
        title="Drivers"
        description={`${drivers.length} drivers · ${drivers.filter((d) => d.status === "on-duty").length} on duty`}
        actions={
         <Button
  className="gap-1.5 rounded-xl"
  onClick={openAdd}
>
  <Plus className="h-4 w-4" />
  Add Driver
</Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drivers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          image={logistics3d}
          title="No drivers found"
          description="Try a different search, or invite a new driver to your team."
        />
      ) : (
        <Tabs defaultValue="cards">
          <TabsList className="mb-4 rounded-full">
            <TabsTrigger value="cards" className="rounded-full">Cards</TabsTrigger>
            <TabsTrigger value="table" className="rounded-full">Table</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((d, i) => (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => setSelected(d)}
                  className="text-left"
                >
                  <Card className="h-full rounded-2xl border-border/70 shadow-card card-lift">
                    
                    <CardContent className="p-5">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <Avatar className="h-12 w-12">
        <AvatarFallback>
          {initials(d.name)}
        </AvatarFallback>
      </Avatar>

      <div>

        <h3 className="font-semibold">
          {d.name}
        </h3>

        <StatusBadge status={d.status} />

      </div>

    </div>

    <SafetyRing score={d.safetyScore} />

  </div>

  <Separator className="my-4" />

  <div className="space-y-2 text-sm">

    <p>
      <strong>License:</strong>{" "}
      {d.licenseNumber}
    </p>

    <p>
      <strong>Category:</strong>{" "}
      {d.licenseCategory}
    </p>

    <p>
      <strong>Contact:</strong>{" "}
      {d.contactNumber}
    </p>

    <p>
      <strong>Expiry:</strong>{" "}
      {formatDate(d.licenseExpiry)}
    </p>

  </div>

</CardContent>
                  </Card>
                </motion.button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <Card className="rounded-2xl border-border/70 shadow-card">
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead className="hidden md:table-cell">License</TableHead>
                      <TableHead className="hidden sm:table-cell text-right">Trips</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">Distance</TableHead>
                      <TableHead>Safety</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                 <TableBody>

  {filtered.map((d) => (

    <TableRow
      key={d._id}
      onClick={() => openEdit(d)}
      className="cursor-pointer"
    >

      <TableCell>

        <div className="flex items-center gap-2">

          <Avatar className="h-8 w-8">

            <AvatarFallback>
              {initials(d.name)}
            </AvatarFallback>

          </Avatar>

          <span>{d.name}</span>

        </div>

      </TableCell>

      <TableCell>

        {d.licenseNumber}

      </TableCell>

      <TableCell>

        {d.licenseCategory}

      </TableCell>

      <TableCell>

        {formatDate(d.licenseExpiry)}

      </TableCell>

      <TableCell>

        {d.contactNumber}

      </TableCell>

      <TableCell>

        <SafetyRing
          score={d.safetyScore}
          size={36}
        />

      </TableCell>

      <TableCell>

        <StatusBadge status={d.status} />

      </TableCell>

    </TableRow>

  ))}

</TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

<Sheet
  open={drawerOpen}
  onOpenChange={setDrawerOpen}
>
  <SheetContent className="w-full overflow-y-auto sm:max-w-md">

    <SheetHeader>

      <SheetTitle>
        {editing ? "Edit Driver" : "Add Driver"}
      </SheetTitle>

      <SheetDescription>
        {editing
          ? "Update driver information."
          : "Register a new driver."}
      </SheetDescription>

    </SheetHeader>

    <div className="space-y-4 px-4 py-4">

      {/* Driver Name */}

      <div className="grid gap-2">

        <Label>Name</Label>

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

      {/* License Number */}

      <div className="grid gap-2">

        <Label>License Number</Label>

        <Input
          value={formData.licenseNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              licenseNumber: e.target.value,
            })
          }
        />

      </div>

      {/* License Category */}

      <div className="grid gap-2">

        <Label>License Category</Label>

        <Input
          value={formData.licenseCategory}
          onChange={(e) =>
            setFormData({
              ...formData,
              licenseCategory: e.target.value,
            })
          }
        />

      </div>

      {/* License Expiry */}

      <div className="grid gap-2">

        <Label>License Expiry</Label>

        <Input
          type="date"
          value={formData.licenseExpiry}
          onChange={(e) =>
            setFormData({
              ...formData,
              licenseExpiry: e.target.value,
            })
          }
        />

      </div>

      {/* Contact */}

      <div className="grid gap-2">

        <Label>Contact Number</Label>

        <Input
          value={formData.contactNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              contactNumber: e.target.value,
            })
          }
        />

      </div>

      {/* Safety */}

      <div className="grid gap-2">

        <Label>Safety Score</Label>

        <Input
          type="number"
          value={formData.safetyScore}
          onChange={(e) =>
            setFormData({
              ...formData,
              safetyScore: Number(e.target.value),
            })
          }
        />

      </div>

      {/* Status */}

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

            <SelectItem value="on_trip">
              On Trip
            </SelectItem>

            <SelectItem value="off_duty">
              Off Duty
            </SelectItem>

            <SelectItem value="suspended">
              Suspended
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

    </div>

    <SheetFooter>

      <Button
        className="rounded-xl"
        onClick={handleSaveDriver}
      >
        {editing ? "Save Changes" : "Add Driver"}
      </Button>

    </SheetFooter>

  </SheetContent>

</Sheet>
    </div>
  );
}
