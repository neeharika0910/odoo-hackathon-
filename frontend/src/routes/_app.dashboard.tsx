import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Gauge,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

import { formatCurrency, formatDate } from "@/lib/format";
import fleet3d from "@/assets/fleet-3d.png";
import api from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>({});

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      const [
        vehicleRes,
        driverRes,
        tripRes,
        maintenanceRes,
        expenseRes,
      ] = await Promise.all([
        api.get("/vehicles").catch(() => ({ data: [] })),
        api.get("/drivers").catch(() => ({ data: [] })),
        api.get("/trips").catch(() => ({ data: [] })),
        api.get("/maintenance").catch(() => ({ data: [] })),
        api.get("/expenses").catch(() => ({ data: [] })),
      ]);

      setVehicles(vehicleRes.data);
      setDrivers(driverRes.data);
      setTrips(tripRes.data);
      setMaintenance(maintenanceRes.data);
      setExpenses(expenseRes.data);

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const userName = user?.name || "User";

  const activeVehicles = vehicles.filter(
    (v) => v.status === "on_trip"
  ).length;

  const availableVehicles = vehicles.filter(
    (v) => v.status === "available"
  ).length;

  const inMaintenance = vehicles.filter(
    (v) => v.status === "maintenance"
  ).length;

  const activeTrips = trips.filter(
    (t) =>
      t.status === "Dispatched" ||
      t.status === "In Progress"
  ).length;

  const pendingTrips = trips.filter(
    (t) => t.status === "Draft"
  ).length;

  const completedTrips = trips.filter(
    (t) => t.status === "Completed"
  ).length;

  const onDutyDrivers = drivers.filter(
    (d) =>
      d.status === "on_trip" ||
      d.status === "active"
  ).length;

  const utilization =
    vehicles.length === 0
      ? 0
      : Math.round(
          ((activeVehicles + inMaintenance) /
            vehicles.length) *
            100
        );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const recentTrips = [...trips].slice(0, 5);

  const recentMaintenance = [...maintenance].slice(0, 5);

  const recentExpenses = [...expenses].slice(0, 5);

  const driverById = (id: string) =>
    drivers.find((d) => d._id === id);

  const vehicleById = (id: string) =>
    vehicles.find((v) => v._id === id);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }


  return (
  <div className="space-y-6">

  {/* Hero Section */}
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-xl"
  >
    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

    <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] items-center">

      <div>

        <p className="text-sm text-blue-100">
          Fleet Management Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome back, {userName} 👋
        </h1>

        <p className="mt-3 max-w-xl text-blue-100">
          Your fleet currently has{" "}
          <span className="font-semibold">{activeVehicles}</span> active
          vehicles,{" "}
          <span className="font-semibold">{activeTrips}</span> ongoing trips,
          and{" "}
          <span className="font-semibold">{inMaintenance}</span> vehicles under
          maintenance.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <Button asChild>
            <Link to="/trips">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Trip
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link to="/vehicles">
              <Truck className="mr-2 h-4 w-4" />
              Vehicles
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link to="/drivers">
              <Users className="mr-2 h-4 w-4" />
              Drivers
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link to="/maintenance">
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance
            </Link>
          </Button>

        </div>

      </div>

      <div className="hidden lg:flex justify-center">
        <img
          src={fleet3d}
          alt="Fleet"
          className="max-h-64 object-contain"
        />
      </div>

    </div>

  </motion.div>

  {/* KPI Cards */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  <KpiCard
    title="Total Vehicles"
    value={String(vehicles.length)}
    icon={Truck}
    hint="Registered vehicles"
    delay={0}
  />

  <KpiCard
    title="Available Vehicles"
    value={String(availableVehicles)}
    icon={CheckCircle2}
    trend={`${availableVehicles}`}
    trendUp
    hint="Ready for dispatch"
    delay={0.05}
  />

  <KpiCard
    title="Vehicles On Trip"
    value={String(activeVehicles)}
    icon={RouteIcon}
    hint="Currently active"
    delay={0.10}
  />

  <KpiCard
    title="Maintenance"
    value={String(inMaintenance)}
    icon={Wrench}
    hint="In workshop"
    delay={0.15}
  />

  <KpiCard
    title="Drivers"
    value={String(drivers.length)}
    icon={Users}
    hint="Registered drivers"
    delay={0.20}
  />

  <KpiCard
    title="Drivers On Duty"
    value={String(onDutyDrivers)}
    icon={Users}
    trend={`${onDutyDrivers}`}
    trendUp
    hint="Currently working"
    delay={0.25}
  />

  <KpiCard
    title="Active Trips"
    value={String(activeTrips)}
    icon={RouteIcon}
    hint="Running now"
    delay={0.30}
  />

  <KpiCard
    title="Completed Trips"
    value={String(completedTrips)}
    icon={Gauge}
    hint="Finished successfully"
    delay={0.35}
  />

  <KpiCard
    title="Pending Trips"
    value={String(pendingTrips)}
    icon={Clock}
    hint="Waiting for dispatch"
    delay={0.40}
  />

  <KpiCard
    title="Fleet Utilization"
    value={`${utilization}%`}
    icon={Gauge}
    trend={`${utilization}%`}
    trendUp
    hint="Current utilization"
    delay={0.45}
  />

  <KpiCard
    title="Expenses"
    value={formatCurrency(totalExpenses)}
    icon={Wrench}
    hint="Total operational cost"
    delay={0.50}
  />

  <KpiCard
    title="Maintenance Records"
    value={String(maintenance.length)}
    icon={Wrench}
    hint="Service history"
    delay={0.55}
  />

</div>

{/* Fleet Overview */}
<div className="grid gap-6 lg:grid-cols-3">

  {/* Fleet Status */}
  <Card className="rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle>Fleet Status</CardTitle>
    </CardHeader>

    <CardContent className="space-y-5">

      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Available</span>
          <span>{availableVehicles}</span>
        </div>

        <div className="h-3 rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{
              width: `${
                vehicles.length
                  ? (availableVehicles / vehicles.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span>On Trip</span>
          <span>{activeVehicles}</span>
        </div>

        <div className="h-3 rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-blue-500"
            style={{
              width: `${
                vehicles.length
                  ? (activeVehicles / vehicles.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Maintenance</span>
          <span>{inMaintenance}</span>
        </div>

        <div className="h-3 rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-yellow-500"
            style={{
              width: `${
                vehicles.length
                  ? (inMaintenance / vehicles.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

    </CardContent>
  </Card>

  {/* Trips Summary */}
  <Card className="rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle>Trip Summary</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">

      <div className="flex justify-between">
        <span>Total Trips</span>
        <strong>{trips.length}</strong>
      </div>

      <div className="flex justify-between">
        <span>Active Trips</span>
        <strong>{activeTrips}</strong>
      </div>

      <div className="flex justify-between">
        <span>Completed Trips</span>
        <strong>{completedTrips}</strong>
      </div>

      <div className="flex justify-between">
        <span>Pending Trips</span>
        <strong>{pendingTrips}</strong>
      </div>

    </CardContent>
  </Card>

  {/* Expense Summary */}
  <Card className="rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle>Expense Summary</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">

      <div className="flex justify-between">
        <span>Total Expenses</span>
        <strong>{formatCurrency(totalExpenses)}</strong>
      </div>

      <div className="flex justify-between">
        <span>Maintenance Records</span>
        <strong>{maintenance.length}</strong>
      </div>

      <div className="flex justify-between">
        <span>Drivers</span>
        <strong>{drivers.length}</strong>
      </div>

      <div className="flex justify-between">
        <span>Fleet Utilization</span>
        <strong>{utilization}%</strong>
      </div>

    </CardContent>
  </Card>

</div>


{/* Recent Activity */}

<Card className="rounded-2xl shadow-md">

  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
  </CardHeader>

  <CardContent>

    <Tabs defaultValue="trips">

      <TabsList>

        <TabsTrigger value="trips">
          Trips
        </TabsTrigger>

        <TabsTrigger value="maintenance">
          Maintenance
        </TabsTrigger>

        <TabsTrigger value="expenses">
          Expenses
        </TabsTrigger>

      </TabsList>

      {/* ================= Trips ================= */}

      <TabsContent value="trips">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Vehicle</TableHead>

              <TableHead>Driver</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Date</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {recentTrips.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={4}
                  className="text-center"
                >
                  No Trips Found
                </TableCell>

              </TableRow>

            ) : (

              recentTrips.map((trip) => (

                <TableRow key={trip._id}>

                  <TableCell>

                    {vehicleById(trip.vehicleId)?.vehicleNumber ||
                      "N/A"}

                  </TableCell>

                  <TableCell>

                    {driverById(trip.driverId)?.name ||
                      "N/A"}

                  </TableCell>

                  <TableCell>

                    <StatusBadge
                      status={trip.status}
                    />

                  </TableCell>

                  <TableCell>

                    {formatDate(
                      trip.createdAt
                    )}

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TabsContent>

      {/* ================= Maintenance ================= */}

      <TabsContent value="maintenance">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Vehicle</TableHead>

              <TableHead>Type</TableHead>

              <TableHead>Cost</TableHead>

              <TableHead>Status</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {recentMaintenance.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={4}
                  className="text-center"
                >
                  No Maintenance Records
                </TableCell>

              </TableRow>

            ) : (

              recentMaintenance.map((item) => (

                <TableRow key={item._id}>

                  <TableCell>

                    {vehicleById(item.vehicleId)
                      ?.vehicleNumber || "N/A"}

                  </TableCell>

                  <TableCell>

                    {item.type}

                  </TableCell>

                  <TableCell>

                    {formatCurrency(item.cost)}

                  </TableCell>

                  <TableCell>

                    <StatusBadge
                      status={item.status}
                    />

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TabsContent>

      {/* ================= Expenses ================= */}

      <TabsContent value="expenses">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Category</TableHead>

              <TableHead>Amount</TableHead>

              <TableHead>Date</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {recentExpenses.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={3}
                  className="text-center"
                >
                  No Expenses Found
                </TableCell>

              </TableRow>

            ) : (

              recentExpenses.map((expense) => (

                <TableRow key={expense._id}>

                  <TableCell>

                    {expense.category}

                  </TableCell>

                  <TableCell>

                    {formatCurrency(
                      expense.amount
                    )}

                  </TableCell>

                  <TableCell>

                    {formatDate(
                      expense.createdAt
                    )}

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TabsContent>

    </Tabs>

  </CardContent>

</Card>

</div>
  )
}
