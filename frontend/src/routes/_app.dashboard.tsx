import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  vehicles,
  drivers,
  trips,
  maintenance,
  expenses,
  monthlyTrips,
  utilizationSeries,
  fuelSeries,
  costSeries,
  vehicleById,
  driverById,
} from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import fleet3d from "@/assets/fleet-3d.png";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
  boxShadow: "var(--shadow-card)",
};

function Dashboard() {
  const activeVehicles = vehicles.filter((v) => v.status === "active").length;
  const availableVehicles = vehicles.filter((v) => v.status === "available").length;
  const inMaintenance = vehicles.filter((v) => v.status === "maintenance").length;
  const onDuty = drivers.filter((d) => d.status === "on-duty").length;
  const activeTrips = trips.filter((t) => t.status === "dispatched").length;
  const pendingTrips = trips.filter((t) => t.status === "draft").length;
  const utilization = Math.round(((activeVehicles + inMaintenance) / vehicles.length) * 100);

  const statusData = [
    { name: "Active", value: activeVehicles, color: "var(--chart-1)" },
    { name: "Available", value: availableVehicles, color: "var(--chart-3)" },
    { name: "Maintenance", value: inMaintenance, color: "var(--chart-4)" },
    { name: "Inactive", value: vehicles.length - activeVehicles - availableVehicles - inMaintenance, color: "var(--muted-foreground)" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-primary-foreground sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-medium text-primary-foreground/75">
              Saturday, July 12
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Good morning, Alex 👋
            </h1>
            <p className="mt-2 max-w-lg text-sm text-primary-foreground/80">
              Your fleet is running at {utilization}% utilization today. {activeTrips} trips
              are on the road and {inMaintenance} vehicles are in the shop.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm" className="gap-1.5 rounded-full">
                <Link to="/trips"><PlusCircle className="h-4 w-4" /> Create Trip</Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="gap-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25">
                <Link to="/vehicles"><Truck className="h-4 w-4" /> Add Vehicle</Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="gap-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25">
                <Link to="/drivers"><Users className="h-4 w-4" /> Add Driver</Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="gap-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25">
                <Link to="/maintenance"><Wrench className="h-4 w-4" /> Maintenance</Link>
              </Button>
            </div>
          </div>
          <motion.img
            src={fleet3d}
            alt="3D illustration of a delivery fleet"
            width={1024}
            height={768}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden max-h-52 w-full object-contain drop-shadow-xl lg:block"
          />
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <KpiCard title="Active Vehicles" value={String(activeVehicles)} icon={Truck} trend="+2" trendUp hint="vs last week" delay={0} />
        <KpiCard title="Available" value={String(availableVehicles)} icon={CheckCircle2} hint="ready to dispatch" delay={0.04} />
        <KpiCard title="In Maintenance" value={String(inMaintenance)} icon={Wrench} hint="2 back this week" delay={0.08} />
        <KpiCard title="Drivers On Duty" value={String(onDuty)} icon={Users} trend="+4" trendUp hint="vs yesterday" delay={0.12} />
        <KpiCard title="Active Trips" value={String(activeTrips)} icon={RouteIcon} hint="on the road now" delay={0.16} />
        <KpiCard title="Pending Trips" value={String(pendingTrips)} icon={Clock} hint="awaiting dispatch" delay={0.2} />
        <KpiCard title="Fleet Utilization" value={`${utilization}%`} icon={Gauge} trend="+5%" trendUp hint="vs last month" delay={0.24} />
        <KpiCard title="Monthly Revenue" value="$176k" icon={CheckCircle2} trend="+8%" trendUp hint="July to date" delay={0.28} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 shadow-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationSeries}>
                <defs>
                  <linearGradient id="util" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} unit="%" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="utilization" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#util)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4} strokeWidth={0}>
                  {statusData.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Trips</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrips}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="trips" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fuel Consumption</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="liters" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Operational Cost</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="fuel" stackId="a" fill="var(--chart-1)" maxBarSize={28} />
                <Bar dataKey="maintenance" stackId="a" fill="var(--chart-4)" maxBarSize={28} />
                <Bar dataKey="other" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity tables */}
      <Card className="rounded-2xl border-border/70 shadow-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="trips">
            <TabsList className="rounded-full">
              <TabsTrigger value="trips" className="rounded-full">Latest Trips</TabsTrigger>
              <TabsTrigger value="maintenance" className="rounded-full">Maintenance</TabsTrigger>
              <TabsTrigger value="expenses" className="rounded-full">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent value="trips">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead className="hidden md:table-cell">Driver</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.slice(0, 6).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.ref}</TableCell>
                      <TableCell className="max-w-44 truncate text-muted-foreground">
                        {t.origin} → {t.destination}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{driverById(t.driverId)?.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(t.startDate)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(t.revenue)}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="maintenance">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.slice(0, 6).map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{vehicleById(m.vehicleId)?.name}</TableCell>
                      <TableCell className="text-muted-foreground">{m.type}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(m.date)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(m.cost)}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="expenses">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.slice(0, 6).map((x) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{x.category}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-56 truncate text-muted-foreground">{x.description}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(x.date)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(x.amount)}</TableCell>
                      <TableCell><StatusBadge status={x.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
