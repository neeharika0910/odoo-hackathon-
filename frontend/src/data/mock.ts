import type {
  Vehicle,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelLog,
  Expense,
} from "@/types";

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-random helpers (stable across renders)         */
/* ------------------------------------------------------------------ */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const pick = <T,>(arr: T[], seed: number): T => arr[Math.floor(rand(seed) * arr.length)];
const between = (min: number, max: number, seed: number) =>
  Math.round(min + rand(seed) * (max - min));

const cities = [
  "Chicago, IL", "Dallas, TX", "Atlanta, GA", "Denver, CO", "Phoenix, AZ",
  "Seattle, WA", "Memphis, TN", "Columbus, OH", "Kansas City, MO", "Nashville, TN",
  "Indianapolis, IN", "Louisville, KY", "Salt Lake City, UT", "Portland, OR", "Houston, TX",
];

/* ------------------------------------------------------------------ */
/* Vehicles — 25                                                       */
/* ------------------------------------------------------------------ */
const vehicleModels: Array<[Vehicle["type"], string]> = [
  ["Heavy Truck", "Volvo FH16"], ["Heavy Truck", "Scania R500"], ["Heavy Truck", "Freightliner Cascadia"],
  ["Delivery Van", "Mercedes Sprinter"], ["Delivery Van", "Ford Transit"], ["Delivery Van", "RAM ProMaster"],
  ["Trailer", "Great Dane Dry Van"], ["Reefer Truck", "Kenworth T680 Reefer"],
  ["Pickup", "Ford F-350"], ["Heavy Truck", "Peterbilt 579"],
];
const vehicleStatuses: Vehicle["status"][] = [
  "active", "active", "active", "available", "available", "maintenance", "inactive",
];

export const vehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => {
  const [type, model] = vehicleModels[i % vehicleModels.length];
  return {
    id: `veh-${i + 1}`,
    registration: `TX-${String(4000 + i * 37).slice(0, 4)}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(66 + ((i * 3) % 24))}`,
    name: `${model} #${String(i + 1).padStart(2, "0")}`,
    type,
    capacityKg: type === "Heavy Truck" || type === "Trailer" ? between(18000, 32000, i + 1)
      : type === "Reefer Truck" ? between(14000, 22000, i + 2)
      : type === "Delivery Van" ? between(1200, 3500, i + 3)
      : between(1000, 1600, i + 4),
    odometerKm: between(12000, 420000, i + 5),
    acquisitionCost: type === "Heavy Truck" ? between(95000, 165000, i + 6)
      : type === "Reefer Truck" ? between(120000, 180000, i + 7)
      : type === "Trailer" ? between(35000, 60000, i + 8)
      : between(28000, 62000, i + 9),
    status: vehicleStatuses[i % vehicleStatuses.length],
    year: 2017 + (i % 9),
    fuelType: i % 11 === 0 ? "Electric" : i % 4 === 0 ? "Petrol" : "Diesel",
  };
});

/* ------------------------------------------------------------------ */
/* Drivers — 20                                                        */
/* ------------------------------------------------------------------ */
const driverNames = [
  "Marcus Reed", "Elena Vasquez", "Darnell Brooks", "Priya Sharma", "Tomasz Kowalski",
  "Aisha Bello", "Jake Morrison", "Sofia Ricci", "Hank Delaney", "Nina Petrova",
  "Carlos Mendez", "Grace Okafor", "Ryan Whitfield", "Leila Haddad", "Owen Gallagher",
  "Mei Chen", "Victor Osei", "Hannah Lindqvist", "Sam Turner", "Rosa Delgado",
];
const driverStatuses: Driver["status"][] = ["on-duty", "on-duty", "on-duty", "off-duty", "on-leave"];

export const drivers: Driver[] = driverNames.map((name, i) => ({
  id: `drv-${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@transitops.io`,
  phone: `+1 (555) ${String(200 + i * 7).padStart(3, "0")}-${String(1000 + i * 391).slice(0, 4)}`,
  licenseNo: `CDL-${String(583000 + i * 1741)}`,
  licenseExpiry: `202${6 + (i % 3)}-${String(1 + (i % 12)).padStart(2, "0")}-15`,
  licenseValid: i % 7 !== 3,
  safetyScore: between(68, 99, i + 40),
  status: driverStatuses[i % driverStatuses.length],
  totalTrips: between(40, 480, i + 50),
  totalKm: between(22000, 380000, i + 60),
  joined: `20${18 + (i % 7)}-0${1 + (i % 9)}-01`,
}));

/* ------------------------------------------------------------------ */
/* Trips — 40                                                          */
/* ------------------------------------------------------------------ */
const cargos = [
  "Consumer electronics", "Refrigerated produce", "Auto parts", "Building materials",
  "Retail apparel", "Pharmaceuticals", "Packaged foods", "Industrial machinery",
  "Paper goods", "Beverages",
];
const tripStatuses: Trip["status"][] = [
  "completed", "completed", "completed", "completed", "dispatched", "dispatched", "draft", "cancelled",
];

export const trips: Trip[] = Array.from({ length: 40 }, (_, i) => {
  const status = tripStatuses[i % tripStatuses.length];
  const day = 1 + (i % 28);
  const month = 1 + Math.floor(i / 7) % 7;
  const start = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const origin = cities[i % cities.length];
  let destination = cities[(i * 3 + 4) % cities.length];
  if (destination === origin) destination = cities[(i * 3 + 5) % cities.length];
  return {
    id: `trp-${i + 1}`,
    ref: `TR-${String(2600 + i).padStart(4, "0")}`,
    vehicleId: `veh-${(i % 25) + 1}`,
    driverId: `drv-${(i % 20) + 1}`,
    origin,
    destination,
    distanceKm: between(180, 2400, i + 70),
    cargo: pick(cargos, i + 80),
    status,
    startDate: start,
    endDate: status === "completed" ? `2026-${String(month).padStart(2, "0")}-${String(Math.min(day + 2, 28)).padStart(2, "0")}` : null,
    revenue: between(1400, 9800, i + 90),
  };
});

/* ------------------------------------------------------------------ */
/* Maintenance — 18                                                    */
/* ------------------------------------------------------------------ */
const maintenanceTypes = [
  ["Preventive service", "Scheduled 40k km inspection and fluid change"],
  ["Brake overhaul", "Front and rear brake pad replacement"],
  ["Tire replacement", "Full set of drive-axle tires"],
  ["Engine diagnostics", "Check-engine fault investigation"],
  ["Transmission service", "Transmission fluid flush and filter"],
  ["Electrical repair", "Alternator and battery replacement"],
  ["Suspension repair", "Air suspension bellows replacement"],
  ["A/C service", "Cab and reefer unit refrigerant recharge"],
] as const;
const maintenanceStatuses: MaintenanceRecord["status"][] = ["completed", "completed", "in-progress", "scheduled"];
const vendors = ["FleetCare Pro", "RoadReady Garage", "Titan Truck Service", "Apex Fleet Maintenance"];

export const maintenance: MaintenanceRecord[] = Array.from({ length: 18 }, (_, i) => {
  const [type, description] = maintenanceTypes[i % maintenanceTypes.length];
  const status = maintenanceStatuses[i % maintenanceStatuses.length];
  return {
    id: `mnt-${i + 1}`,
    vehicleId: `veh-${((i * 3) % 25) + 1}`,
    type,
    description,
    status,
    progress: status === "completed" ? 100 : status === "in-progress" ? between(25, 85, i + 100) : 0,
    cost: between(280, 6400, i + 110),
    date: `2026-0${1 + (i % 7)}-${String(2 + (i % 26)).padStart(2, "0")}`,
    vendor: pick(vendors, i + 120),
  };
});

/* ------------------------------------------------------------------ */
/* Fuel logs — 30                                                      */
/* ------------------------------------------------------------------ */
const stations = ["Pilot Flying J", "Love's Travel Stop", "TA Petro", "Shell Fleet", "BP Truckstop"];

export const fuelLogs: FuelLog[] = Array.from({ length: 30 }, (_, i) => {
  const liters = between(90, 520, i + 130);
  const costPerLiter = 1.12 + rand(i + 140) * 0.4;
  return {
    id: `ful-${i + 1}`,
    vehicleId: `veh-${((i * 2) % 25) + 1}`,
    driverId: `drv-${((i * 3) % 20) + 1}`,
    date: `2026-0${1 + (i % 7)}-${String(1 + ((i * 2) % 27)).padStart(2, "0")}`,
    liters,
    costPerLiter: Math.round(costPerLiter * 100) / 100,
    totalCost: Math.round(liters * costPerLiter),
    odometerKm: between(15000, 400000, i + 150),
    station: pick(stations, i + 160),
  };
});

/* ------------------------------------------------------------------ */
/* Expenses — 20                                                       */
/* ------------------------------------------------------------------ */
const expenseSeed: Array<[Expense["category"], string]> = [
  ["Fuel", "Bulk diesel purchase — Dallas depot"],
  ["Maintenance", "Quarterly fleet servicing invoice"],
  ["Tolls", "I-80 corridor toll settlement"],
  ["Insurance", "Fleet liability premium — Q3"],
  ["Salaries", "Driver payroll — bi-weekly run"],
  ["Parking", "Overnight secure parking — Chicago hub"],
  ["Miscellaneous", "DOT compliance filing fees"],
  ["Fuel", "Fuel card settlement — week 27"],
  ["Maintenance", "Emergency roadside repair — TR-2612"],
  ["Tolls", "PA Turnpike fleet account"],
] ;
const expenseStatuses: Expense["status"][] = ["approved", "approved", "approved", "pending", "rejected"];

export const expenses: Expense[] = Array.from({ length: 20 }, (_, i) => {
  const [category, description] = expenseSeed[i % expenseSeed.length];
  return {
    id: `exp-${i + 1}`,
    category,
    description,
    amount: category === "Salaries" ? between(18000, 42000, i + 170)
      : category === "Insurance" ? between(6000, 14000, i + 180)
      : between(120, 5200, i + 190),
    date: `2026-0${1 + (i % 7)}-${String(3 + (i % 25)).padStart(2, "0")}`,
    status: expenseStatuses[i % expenseStatuses.length],
    vehicleId: i % 3 === 0 ? `veh-${((i * 5) % 25) + 1}` : undefined,
  };
});

/* ------------------------------------------------------------------ */
/* Chart series                                                        */
/* ------------------------------------------------------------------ */
export const monthlyTrips = [
  { month: "Jan", trips: 42, completed: 38 },
  { month: "Feb", trips: 48, completed: 44 },
  { month: "Mar", trips: 55, completed: 50 },
  { month: "Apr", trips: 51, completed: 47 },
  { month: "May", trips: 63, completed: 58 },
  { month: "Jun", trips: 70, completed: 66 },
  { month: "Jul", trips: 58, completed: 41 },
];

export const utilizationSeries = [
  { month: "Jan", utilization: 68 },
  { month: "Feb", utilization: 72 },
  { month: "Mar", utilization: 77 },
  { month: "Apr", utilization: 74 },
  { month: "May", utilization: 81 },
  { month: "Jun", utilization: 86 },
  { month: "Jul", utilization: 83 },
];

export const fuelSeries = [
  { month: "Jan", liters: 8200, cost: 10450 },
  { month: "Feb", liters: 8900, cost: 11320 },
  { month: "Mar", liters: 9600, cost: 12480 },
  { month: "Apr", liters: 9100, cost: 11890 },
  { month: "May", liters: 10400, cost: 13910 },
  { month: "Jun", liters: 11200, cost: 15230 },
  { month: "Jul", liters: 9800, cost: 13160 },
];

export const costSeries = [
  { month: "Jan", fuel: 10450, maintenance: 6200, other: 4100, revenue: 148000 },
  { month: "Feb", fuel: 11320, maintenance: 4800, other: 4400, revenue: 156000 },
  { month: "Mar", fuel: 12480, maintenance: 7900, other: 4650, revenue: 171000 },
  { month: "Apr", fuel: 11890, maintenance: 5100, other: 4300, revenue: 163000 },
  { month: "May", fuel: 13910, maintenance: 8600, other: 5100, revenue: 189000 },
  { month: "Jun", fuel: 15230, maintenance: 6400, other: 5350, revenue: 204000 },
  { month: "Jul", fuel: 13160, maintenance: 5900, other: 4900, revenue: 176000 },
];

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */
export const vehicleById = (id: string) => vehicles.find((v) => v.id === id);
export const driverById = (id: string) => drivers.find((d) => d.id === id);
