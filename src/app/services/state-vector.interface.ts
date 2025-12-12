export interface StateVector {
  icao24: string;           // 0 - Unique ICAO 24-bit address of the transponder
  callsign: string | null;  // 1 - Callsign of the vehicle
  origin_country: string;   // 2 - Country name inferred from the ICAO 24-bit address
  time_position: number | null;  // 3 - Unix timestamp (seconds) for the last position update
  last_contact: number;     // 4 - Unix timestamp (seconds) for the last update
  longitude: number | null; // 5 - WGS-84 longitude in decimal degrees
  latitude: number | null;  // 6 - WGS-84 latitude in decimal degrees
  baro_altitude: number | null;  // 7 - Barometric altitude in meters
  on_ground: boolean;       // 8 - Boolean value which indicates if the position was retrieved from a surface position report
  velocity: number | null;  // 9 - Velocity over ground in m/s
  true_track: number | null;  // 10 - True track in decimal degrees clockwise from north
  vertical_rate: number | null;  // 11 - Vertical rate in m/s
  sensors: number[] | null;  // 12 - IDs of the receivers which contributed to this state vector
  geo_altitude: number | null;  // 13 - Geometric altitude in meters
  squawk: string | null;    // 14 - The transponder code aka Squawk
  spi: boolean;             // 15 - Whether flight status indicates special purpose indicator
  position_source: number;  // 16 - Origin of this state's position (0 = ADS-B, 1 = ASTERIX, 2 = MLAT)
}

export interface OpenSkyResponse {
  time: number;
  states: any[][];
}
