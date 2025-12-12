import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { StateVector, OpenSkyResponse } from './state-vector.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenSkyService {
  private apiUrl = 'https://opensky-network.org/api/states/all';
  private cache$: Observable<StateVector[]> | null = null;
  private cacheTime = 0;
  private cacheDuration = 10000; // 10 seconds cache

  constructor(private http: HttpClient) {}

  getStateVectors(): Observable<StateVector[]> {
    const now = Date.now();
    
    // Return cached data if available and not expired
    if (this.cache$ && (now - this.cacheTime) < this.cacheDuration) {
      return this.cache$;
    }

    // Fetch new data
    this.cacheTime = now;
    this.cache$ = this.http.get<OpenSkyResponse>(this.apiUrl).pipe(
      map(response => this.transformResponse(response)),
      catchError(error => {
        console.error('Error fetching OpenSky data:', error);
        return of([]);
      }),
      shareReplay(1)
    );

    return this.cache$;
  }

  getStateVectorById(icao24: string): Observable<StateVector | undefined> {
    return this.getStateVectors().pipe(
      map(vectors => vectors.find(v => v.icao24 === icao24))
    );
  }

  private transformResponse(response: OpenSkyResponse): StateVector[] {
    if (!response || !response.states) {
      return [];
    }

    return response.states.map(state => ({
      icao24: state[0] || '',
      callsign: state[1] ? state[1].trim() : null,
      origin_country: state[2] || '',
      time_position: state[3],
      last_contact: state[4],
      longitude: state[5],
      latitude: state[6],
      baro_altitude: state[7],
      on_ground: state[8] || false,
      velocity: state[9],
      true_track: state[10],
      vertical_rate: state[11],
      sensors: state[12],
      geo_altitude: state[13],
      squawk: state[14],
      spi: state[15] || false,
      position_source: state[16] || 0
    }));
  }
}
