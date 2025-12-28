
export interface FishingSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: {
    lat: number;
    lng: number;
  };
  manualDurationMinutes?: number;
  species?: string;
  metrics: {
    casts: number;    // Arremessos
    attacks: number;  // Ataques
    hookups: number;  // Fisgadas
    landed: number;   // Capturados
    lost: number;     // Perdidos
  };
  notes: string;
}

export interface CalculatedStats {
  attackRate: number;     // Ataques / Arremessos
  hookupRate: number;     // Fisgadas / Ataques
  landingRate: number;    // Capturados / Fisgadas
  efficiency: number;     // Capturados / Arremessos
  castsPerFish: number;   // Quantos arremessos para 1 peixe
  attacksPer100Casts: number;
  durationMinutes: number;
  fishPerHour: number;
  castsPerHour: number;   // Arremessos por hora
}
