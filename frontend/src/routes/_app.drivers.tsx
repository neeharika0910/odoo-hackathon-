import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SafetyRing } from "@/components/shared/SafetyRing";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { drivers, trips } from "@/data/mock";
import type { Driver } from "@/types";
import { formatDate, formatNumber, initials } from "@/lib/format";
import logistics3d from "@/assets/logistics-3d.png";

export const Route = createFileRoute("/_app/drivers")({
  component: DriversPage,
});

function DriversPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Driver | null>(null);

  const filtered = useMemo(
    () => drivers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <div>
      <PageHeader
        title="Drivers"
        description={`${drivers.length} drivers · ${drivers.filter((d) => d.status === "on-duty").length} on duty`}
        actions={
          <Button
            className="gap-1.5 rounded-xl"
            onClick={() => toast.success("Driver invitation sent", { description: "This is a demo — no data was changed." })}
          >
            <Plus className="h-4 w-4" /> Add Driver
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
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-11 w-11 shrink-0">
                            <AvatarFallback className="bg-accent font-semibold text-accent-foreground">
                              {initials(d.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{d.name}</p>
                            <StatusBadge status={d.status} className="mt-0.5 text-[10px]" />
                          </div>
                        </div>
                        <SafetyRing score={d.safetyScore} />
                      </div>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{d.totalTrips} trips</span>
                        <span>{formatNumber(d.totalKm)} km</span>
                        <Badge
                          variant="outline"
                          className={
                            d.licenseValid
                              ? "rounded-full border-transparent bg-success/10 text-success"
                              : "rounded-full border-transparent bg-destructive/10 text-destructive"
                          }
                        >
                          {d.licenseValid ? "License valid" : "Expiring"}
                        </Badge>
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
                      <TableRow key={d.id} className="cursor-pointer" onClick={() => setSelected(d)}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                                {initials(d.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className={
                              d.licenseValid
                                ? "rounded-full border-transparent bg-success/10 text-success"
                                : "rounded-full border-transparent bg-destructive/10 text-destructive"
                            }
                          >
                            {d.licenseValid ? "Valid" : "Expiring"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">{d.totalTrips}</TableCell>
                        <TableCell className="hidden lg:table-cell text-right">{formatNumber(d.totalKm)} km</TableCell>
                        <TableCell><SafetyRing score={d.safetyScore} size={36} /></TableCell>
                        <TableCell><StatusBadge status={d.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Driver profile drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
                      {initials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <SheetDescription>Professional driver · joined {formatDate(selected.joined)}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <div className="flex items-center justify-between rounded-2xl bg-accent p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Safety score</p>
                    <p className="font-display text-xl font-bold">{selected.safetyScore}/100</p>
                  </div>
                  <SafetyRing score={selected.safetyScore} size={56} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Total trips</p>
                    <p className="font-display text-lg font-bold">{selected.totalTrips}</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Distance driven</p>
                    <p className="font-display text-lg font-bold">{formatNumber(selected.totalKm)} km</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">License</p>
                    <p className="text-sm font-semibold">{selected.licenseNo}</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="text-sm font-semibold">{formatDate(selected.licenseExpiry)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> {selected.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> {selected.phone}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Recent trips</p>
                  <div className="space-y-2">
                    {trips
                      .filter((t) => t.driverId === selected.id)
                      .slice(0, 4)
                      .map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                          <div className="min-w-0">
                            <p className="font-medium">{t.ref}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {t.origin} → {t.destination}
                            </p>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
