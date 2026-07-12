import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { utilizationSeries, fuelSeries, costSeries, vehicles } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

const profitSeries = costSeries.map((m) => ({
  month: m.month,
  revenue: m.revenue,
  expenses: m.fuel + m.maintenance + m.other + 98000,
  profit: m.revenue - (m.fuel + m.maintenance + m.other + 98000),
}));

const roiData = vehicles.slice(0, 8).map((v, i) => ({
  name: v.name.split(" #")[0].split(" ").slice(-1)[0] + ` #${String(i + 1).padStart(2, "0")}`,
  roi: Math.round(18 + ((i * 13) % 42)),
}));

const efficiencyData = fuelSeries.map((m) => ({
  month: m.month,
  kmPerLiter: Math.round((2.8 + (m.liters % 7) * 0.08) * 100) / 100,
}));

const costBreakdown = [
  { name: "Fuel", value: 88440, color: "var(--chart-1)" },
  { name: "Maintenance", value: 44900, color: "var(--chart-4)" },
  { name: "Salaries", value: 196000, color: "var(--chart-2)" },
  { name: "Insurance", value: 38200, color: "var(--chart-5)" },
  { name: "Other", value: 32800, color: "var(--muted-foreground)" },
];

function exportCsv() {
  const rows = [
    ["Month", "Revenue", "Expenses", "Profit"],
    ...profitSeries.map((r) => [r.month, r.revenue, r.expenses, r.profit]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transitops-report.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV report downloaded");
}

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Fleet performance and financial analytics"
        actions={
          <>
            <Button variant="outline" className="gap-1.5 rounded-xl" onClick={exportCsv}>
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button
              className="gap-1.5 rounded-xl"
              onClick={() => {
                toast.success("Preparing PDF report", { description: "Using your browser's print dialog." });
                setTimeout(() => window.print(), 400);
              }}
            >
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 shadow-card lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue vs Expenses vs Profit</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--chart-4)" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="profit" stroke="var(--chart-3)" strokeWidth={2.5} fill="url(#prof)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Fleet Utilization</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} unit="%" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="utilization" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Vehicle ROI (%)</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} unit="%" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="roi" fill="var(--chart-1)" radius={[0, 6, 6, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Fuel Efficiency (km/L)</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} domain={[2.5, 3.5]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="kmPerLiter" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Cost Breakdown (YTD)</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {costBreakdown.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
