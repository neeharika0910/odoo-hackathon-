import { createFileRoute } from "@tanstack/react-router";
import { Plus, Receipt, TrendingDown, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expenses, costSeries } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/expenses")({
  component: ExpensesPage,
});

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

const categoryColors = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)", "var(--primary-glow)",
];

function ExpensesPage() {
  const total = expenses.reduce((s, x) => s + x.amount, 0);
  const pending = expenses.filter((x) => x.status === "pending").reduce((s, x) => s + x.amount, 0);
  const approvedCount = expenses.filter((x) => x.status === "approved").length;

  const byCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, x) => {
      acc[x.category] = (acc[x.category] ?? 0) + x.amount;
      return acc;
    }, {}),
  ).map(([name, value], i) => ({ name, value, color: categoryColors[i % categoryColors.length] }));

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Monitor and approve operational spend"
        actions={
          <Button
            className="gap-1.5 rounded-xl"
            onClick={() => toast.success("Expense submitted", { description: "This is a demo — no data was changed." })}
          >
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Total Spend (YTD)" value={formatCurrency(total)} icon={Wallet} hint="all categories" />
        <KpiCard title="Pending Approval" value={formatCurrency(pending)} icon={Receipt} hint={`${expenses.filter((x) => x.status === "pending").length} items`} delay={0.05} />
        <KpiCard title="Approved" value={String(approvedCount)} icon={TrendingDown} trend="-3%" trendUp hint="cost vs last quarter" delay={0.1} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Spend by Category</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                  {byCategory.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Cost Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="fuel" stackId="a" fill="var(--chart-1)" maxBarSize={26} />
                <Bar dataKey="maintenance" stackId="a" fill="var(--chart-4)" maxBarSize={26} />
                <Bar dataKey="other" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={26} />
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
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell className="font-medium">{x.category}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-72 truncate text-muted-foreground">{x.description}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(x.date)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(x.amount)}</TableCell>
                    <TableCell><StatusBadge status={x.status} /></TableCell>
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
