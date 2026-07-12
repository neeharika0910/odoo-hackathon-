import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Route as RouteIcon, Truck, Wrench, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

const activity = [
  { icon: RouteIcon, title: "Dispatched trip TR-2637", detail: "Volvo FH16 #01 · Marcus Reed", time: "2 hours ago" },
  { icon: CheckCircle2, title: "Approved 3 expense reports", detail: "Total $6,420", time: "5 hours ago" },
  { icon: Wrench, title: "Scheduled brake overhaul", detail: "Scania R500 #02 at FleetCare Pro", time: "Yesterday" },
  { icon: Truck, title: "Added new vehicle", detail: "Ford Transit #24 registered", time: "2 days ago" },
  { icon: CheckCircle2, title: "Completed monthly report", detail: "June fleet performance", time: "4 days ago" },
];

function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Your account and recent activity" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto h-20 w-20">
              <AvatarFallback className="bg-primary font-display text-2xl font-bold text-primary-foreground">
                AK
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-display text-xl font-bold">Alex Kim</h2>
            <Badge className="mt-2 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              <ShieldCheck className="mr-1 h-3 w-3" /> Operations Manager
            </Badge>
            <Separator className="my-5" />
            <div className="space-y-3 text-left text-sm">
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> alex.kim@transitops.io
              </p>
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" /> +1 (555) 014-2298
              </p>
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" /> Dallas HQ, Texas
              </p>
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-lg font-bold">128</p>
                <p className="text-[10px] text-muted-foreground">Trips managed</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold">25</p>
                <p className="text-[10px] text-muted-foreground">Vehicles</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold">3.2y</p>
                <p className="text-[10px] text-muted-foreground">Tenure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative ml-3 space-y-6 border-l border-border pl-6">
              {activity.map((item, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] grid h-6 w-6 place-items-center rounded-full border bg-card shadow-card">
                    <item.icon className="h-3 w-3 text-primary" />
                  </span>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.time}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
