import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import truck3d from "@/assets/truck-3d.png";
import logoAsset from "@/assets/transitops-logo.png";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex.kim@transitops.io");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden gradient-hero lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="TransitOps logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-cover"
          />
          <span className="font-display text-xl font-bold text-primary-foreground">
            TransitOps
          </span>
        </div>

        <motion.img
          src={truck3d}
          alt="3D illustration of a modern blue semi truck"
          width={1024}
          height={1024}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl drop-shadow-2xl"
        />

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-display text-4xl font-bold tracking-tight text-primary-foreground"
          >
            Smart Transport.
            <br />
            Smooth Operations.
          </motion.h1>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
            One command center for your entire fleet — vehicles, drivers, trips,
            maintenance, fuel and costs.
          </p>
        </div>
      </div>

      {/* Right — login card */}
      <div className="flex items-center justify-center gradient-soft px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center lg:text-left">
            <img
              src={logoAsset.url}
              alt=""
              width={56}
              height={56}
              className="mx-auto mb-4 h-14 w-14 rounded-2xl object-cover lg:hidden"
            />
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your TransitOps workspace
            </p>
          </div>

          <Card className="rounded-2xl border-border/70 shadow-card">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox defaultChecked /> Remember me
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full gap-2 rounded-xl" size="lg">
                  Sign in <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo environment — any credentials will work.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
