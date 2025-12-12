import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { OpenSkyService } from '../../services/opensky.service';
import { FavoritesService } from '../../services/favorites.service';
import { StateVector } from '../../services/state-vector.interface';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: StateVector[] = [];
  filteredProducts: StateVector[] = [];
  displayedProducts: StateVector[] = [];

  loading = true;

  // SEARCH
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // FILTERS
  selectedCountry = 'all';
  countries: string[] = [];

  minAltitude: number | null = null;
  minVelocity: number | null = null;

  // PAGINATION
  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalPages = 1;

  favorites: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private openSkyService: OpenSkyService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();

    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favs => this.favorites = favs);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // LOAD DATA
  private loadProducts(): void {
    this.openSkyService.getStateVectors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.products = data;
          this.extractCountries();
          this.applyFilters();
          this.loading = false;
        },
        error: err => {
          console.error('Error loading products:', err);
          this.loading = false;
        }
      });
  }

  // SEARCH LOGIC
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )
    .subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  // FILTER EVENTS
  onCountryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onMinAltitudeChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onMinVelocityChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // FILTERING CORE LOGIC
  private applyFilters(): void {
    let filtered = [...this.products];

    // SEARCH
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.callsign && p.callsign.toLowerCase().includes(term)) ||
        p.origin_country.toLowerCase().includes(term) ||
        p.icao24.toLowerCase().includes(term)
      );
    }

    // COUNTRY
    if (this.selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.origin_country === this.selectedCountry);
    }

    // ALTITUDE
    if (this.minAltitude !== null) {
      filtered = filtered.filter(p => (p.geo_altitude ?? 0) >= this.minAltitude!);
    }

    // VELOCITY
    if (this.minVelocity !== null) {
      filtered = filtered.filter(p => (p.velocity ?? 0) >= this.minVelocity!);
    }

    this.filteredProducts = filtered;

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedProducts = filtered.slice(start, end);
  }

  // PAGINATION
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  }

  // FAVORITES
  isFavorite(icao24: string): boolean {
    return this.favorites.includes(icao24);
  }

  async toggleFavorite(icao24: string, event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.isFavorite(icao24)) {
      await this.favoritesService.removeFavorite(icao24);
    } else {
      await this.favoritesService.addFavorite(icao24);
    }
  }

  // COUNTRY EXTRACTION
  private extractCountries(): void {
    const set = new Set<string>();
    this.products.forEach(p => {
      if (p.origin_country) set.add(p.origin_country);
    });
    this.countries = Array.from(set).sort();
  }

  Math = Math;
}
