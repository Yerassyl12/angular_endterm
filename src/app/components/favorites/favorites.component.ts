import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { OpenSkyService } from '../../services/opensky.service';
import { FavoritesService } from '../../services/favorites.service';
import { StateVector } from '../../services/state-vector.interface';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteProducts: StateVector[] = [];
  loading = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private openSkyService: OpenSkyService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.openSkyService.getStateVectors(),
      this.favoritesService.favorites$
    ])
    .pipe(
      map(([products, favorites]) => {
        return products.filter(p => favorites.includes(p.icao24));
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (favorites) => {
        this.favoriteProducts = favorites;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async removeFavorite(icao24: string, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    await this.favoritesService.removeFavorite(icao24);
  }
}
