import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { OpenSkyService } from '../../services/opensky.service';
import { FavoritesService } from '../../services/favorites.service';
import { StateVector } from '../../services/state-vector.interface';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: StateVector | undefined;
  loading = true;
  notFound = false;
  isFavorite = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private openSkyService: OpenSkyService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {

    // Основной поток получения данных
    this.route.paramMap
      .pipe(
        map(params => params.get('icao24')),
        switchMap(icao24 => {
          if (!icao24) {
            return of(undefined);
          }
          return this.openSkyService.getStateVectorById(icao24).pipe(
            catchError(err => {
              console.error('Error:', err);
              return of(undefined);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        if (!product) {
          this.notFound = true;
        } else {
          this.product = product;
          this.checkFavoriteStatus();
        }
        this.loading = false;
      });

    // Реактивный статус избранного
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkFavoriteStatus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkFavoriteStatus(): void {
    if (this.product) {
      this.isFavorite = this.favoritesService.isFavorite(this.product.icao24);
    }
  }

  async toggleFavorite(): Promise<void> {
    if (!this.product) return;

    if (this.isFavorite) {
      await this.favoritesService.removeFavorite(this.product.icao24);
    } else {
      await this.favoritesService.addFavorite(this.product.icao24);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'N/A';
    }
    return value.toString();
  }

  formatTimestamp(timestamp: number | null): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  }

  getPositionSource(source: number): string {
    const sources = ['ADS-B', 'ASTERIX', 'MLAT'];
    return sources[source] || 'Unknown';
  }
}
