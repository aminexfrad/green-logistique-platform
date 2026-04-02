export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'expéditeur' | 'transporteur' | 'client'
  company: string
  avatar?: string
  status: 'active' | 'inactive'
}

export interface Shipment {
  id: string
  origin: string
  destination: string
  weight: number
  volume: number
  cargoType: string
  transportMode: 'road' | 'rail' | 'maritime' | 'air' | 'multimodal'
  status: 'created' | 'inTransit' | 'delivered' | 'cancelled' | 'incident'
  co2Kg: number
  createdAt: string
  deliveryDate: string
  carrier?: {
    id: string
    name: string
    greenScore: number
  }
  trackingNumber: string
  timeline: TrackingEvent[]
}

export interface TrackingEvent {
  id: string
  status: string
  timestamp: string
  location?: string
  latitude?: number
  longitude?: number
  message: string
}

export interface Carrier {
  id: string
  name: string
  greenCertification: 'bronze' | 'silver' | 'gold'
  greenScore: number
  zone: string
  isVerified: boolean
  rating: number
  vehicles: Vehicle[]
  reviewCount: number
}

export interface Vehicle {
  id: string
  type: 'dieselTruck' | 'electricTruck' | 'hybridTruck' | 'van'
  fuelType: 'diesel' | 'electric' | 'hybrid' | 'gnv'
  co2Factor: number
  capacityKg: number
  plate: string
}

export interface CarbonProject {
  id: string
  name: string
  type: 'reforestation' | 'solar' | 'wind' | 'ocean'
  location: string
  certification: string
  co2TonsAvailable: number
  pricePerTon: number
  image: string
}

export interface Company {
  id: string
  name: string
  siret: string
  sector: string
  greenScore: number
  carbonBalance: number
  certificationLevel: 'bronze' | 'silver' | 'gold'
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    role: 'admin',
    company: 'Green Logistique',
    status: 'active',
  },
  {
    id: '2',
    name: 'Marie Bernard',
    email: 'marie@example.com',
    role: 'expéditeur',
    company: 'FreshFood Inc',
    status: 'active',
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'pierre@example.com',
    role: 'transporteur',
    company: 'EcoTrans Ltd',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    email: 'sophie@example.com',
    role: 'client',
    company: 'RetailCo',
    status: 'active',
  },
]

// Mock Shipments
export const mockShipments: Shipment[] = [
  {
    id: 'SHIP-001',
    origin: 'Paris, France',
    destination: 'Lyon, France',
    weight: 500,
    volume: 12,
    cargoType: 'Electronics',
    transportMode: 'road',
    status: 'inTransit',
    co2Kg: 45.5,
    createdAt: '2026-04-01',
    deliveryDate: '2026-04-03',
    trackingNumber: 'TRK-2026-0001',
    carrier: {
      id: 'CAR-001',
      name: 'EcoTrans Express',
      greenScore: 92,
    },
    timeline: [
      {
        id: 'evt-1',
        status: 'created',
        timestamp: '2026-04-01 08:00',
        location: 'Paris Warehouse',
        message: 'Shipment created and registered',
      },
      {
        id: 'evt-2',
        status: 'inTransit',
        timestamp: '2026-04-02 10:30',
        location: 'Orléans',
        latitude: 47.9029,
        longitude: 1.9094,
        message: 'In transit towards destination',
      },
    ],
  },
  {
    id: 'SHIP-002',
    origin: 'Marseille, France',
    destination: 'Barcelona, Spain',
    weight: 2000,
    volume: 50,
    cargoType: 'Food & Beverages',
    transportMode: 'maritime',
    status: 'delivered',
    co2Kg: 156,
    createdAt: '2026-03-28',
    deliveryDate: '2026-04-02',
    trackingNumber: 'TRK-2026-0002',
    carrier: {
      id: 'CAR-002',
      name: 'GreenShip Co',
      greenScore: 95,
    },
    timeline: [
      {
        id: 'evt-3',
        status: 'created',
        timestamp: '2026-03-28 09:00',
        message: 'Shipment created',
      },
      {
        id: 'evt-4',
        status: 'delivered',
        timestamp: '2026-04-02 14:00',
        location: 'Barcelona Port',
        message: 'Successfully delivered',
      },
    ],
  },
  {
    id: 'SHIP-003',
    origin: 'Lille, France',
    destination: 'Brussels, Belgium',
    weight: 750,
    volume: 25,
    cargoType: 'Machinery',
    transportMode: 'road',
    status: 'created',
    co2Kg: 62.3,
    createdAt: '2026-04-02',
    deliveryDate: '2026-04-05',
    trackingNumber: 'TRK-2026-0003',
    timeline: [
      {
        id: 'evt-5',
        status: 'created',
        timestamp: '2026-04-02 11:00',
        message: 'Shipment created',
      },
    ],
  },
]

// Mock Carriers
export const mockCarriers: Carrier[] = [
  {
    id: 'CAR-001',
    name: 'EcoTrans Express',
    greenCertification: 'gold',
    greenScore: 92,
    zone: 'Central Europe',
    isVerified: true,
    rating: 4.8,
    reviewCount: 145,
    vehicles: [
      {
        id: 'VEH-001',
        type: 'electricTruck',
        fuelType: 'electric',
        co2Factor: 10,
        capacityKg: 5000,
        plate: 'EC-001-BZ',
      },
      {
        id: 'VEH-002',
        type: 'hybridTruck',
        fuelType: 'hybrid',
        co2Factor: 35,
        capacityKg: 8000,
        plate: 'HY-002-BZ',
      },
    ],
  },
  {
    id: 'CAR-002',
    name: 'GreenShip Co',
    greenCertification: 'gold',
    greenScore: 95,
    zone: 'Mediterranean',
    isVerified: true,
    rating: 4.9,
    reviewCount: 278,
    vehicles: [
      {
        id: 'VEH-003',
        type: 'van',
        fuelType: 'electric',
        co2Factor: 5,
        capacityKg: 2000,
        plate: 'GS-003-FR',
      },
    ],
  },
  {
    id: 'CAR-003',
    name: 'Swift Logistics',
    greenCertification: 'silver',
    greenScore: 78,
    zone: 'Northern Europe',
    isVerified: true,
    rating: 4.5,
    reviewCount: 92,
    vehicles: [
      {
        id: 'VEH-004',
        type: 'dieselTruck',
        fuelType: 'diesel',
        co2Factor: 62,
        capacityKg: 12000,
        plate: 'SW-004-NL',
      },
    ],
  },
  {
    id: 'CAR-004',
    name: 'VersaTrans',
    greenCertification: 'bronze',
    greenScore: 65,
    zone: 'Western Europe',
    isVerified: false,
    rating: 4.2,
    reviewCount: 45,
    vehicles: [
      {
        id: 'VEH-005',
        type: 'van',
        fuelType: 'diesel',
        co2Factor: 45,
        capacityKg: 3000,
        plate: 'VT-005-BE',
      },
    ],
  },
]

// Mock Carbon Projects
export const mockCarbonProjects: CarbonProject[] = [
  {
    id: 'PROJ-001',
    name: 'Amazon Rainforest Protection',
    type: 'reforestation',
    location: 'Brazil',
    certification: 'Gold Standard',
    co2TonsAvailable: 50000,
    pricePerTon: 15,
    image: '🌳',
  },
  {
    id: 'PROJ-002',
    name: 'Solar Farm Romania',
    type: 'solar',
    location: 'Romania',
    certification: 'VCS',
    co2TonsAvailable: 30000,
    pricePerTon: 18,
    image: '☀️',
  },
  {
    id: 'PROJ-003',
    name: 'Wind Energy Portugal',
    type: 'wind',
    location: 'Portugal',
    certification: 'VCS',
    co2TonsAvailable: 25000,
    pricePerTon: 16,
    image: '🌬️',
  },
  {
    id: 'PROJ-004',
    name: 'Ocean Cleanup Initiative',
    type: 'ocean',
    location: 'Mediterranean',
    certification: 'Gold Standard',
    co2TonsAvailable: 15000,
    pricePerTon: 22,
    image: '🌊',
  },
]

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: 'COM-001',
    name: 'FreshFood Inc',
    siret: '12345678901234',
    sector: 'Food & Beverage',
    greenScore: 78,
    carbonBalance: 2500,
    certificationLevel: 'silver',
  },
  {
    id: 'COM-002',
    name: 'TechSupply Ltd',
    siret: '98765432109876',
    sector: 'Electronics',
    greenScore: 85,
    carbonBalance: 5000,
    certificationLevel: 'gold',
  },
  {
    id: 'COM-003',
    name: 'RetailCo',
    siret: '55555555555555',
    sector: 'Retail',
    greenScore: 72,
    carbonBalance: 1500,
    certificationLevel: 'bronze',
  },
]

// Mock user by role
export function getMockUserByRole(role: string): User {
  const userMap: { [key: string]: User } = {
    admin: mockUsers[0],
    expéditeur: mockUsers[1],
    transporteur: mockUsers[2],
    client: mockUsers[3],
  }
  return userMap[role] || mockUsers[0]
}
