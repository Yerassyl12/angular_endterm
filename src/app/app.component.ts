import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthState } from './items/states/auth.state';
import { TranslationService, Language } from './services/translation.service';
import { TranslatePipe } from './services/translate.pipe';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OpenSky Flight Tracker';
  user$: Observable<User | null>;
  currentLang$: Observable<Language>;
  mobileMenuOpen = false;

  constructor(
    public authState: AuthState,
    public translationService: TranslationService,
    private router: Router
  ) {
    this.user$ = this.authState.user$;
    this.currentLang$ = this.translationService.currentLang$;
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  async logout(): Promise<void> {
    await this.authState.logout();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  changeLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
