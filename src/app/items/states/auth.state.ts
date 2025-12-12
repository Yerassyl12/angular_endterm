import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Auth, 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthState {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(
    private auth: Auth,
    private injector: Injector
  ) {
    // Это безопасно — AngularFire сам работает здесь в DI
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      this.loadingSubject.next(false);
    });
  }

  // ================================
  // LOGIN
  // ================================
  async login(email: string, password: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        console.error('[AuthState] Login error:', error);
        throw error;
      }
    });
  }

  // ================================
  // SIGNUP
  // ================================
  async signup(email: string, password: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await createUserWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        console.error('[AuthState] Signup error:', error);
        throw error;
      }
    });
  }

  // ================================
  // LOGOUT
  // ================================
  async logout(): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      try {
        await signOut(this.auth);
      } catch (error) {
        console.error('[AuthState] Logout error:', error);
        throw error;
      }
    });
  }

  // ================================
  // GETTERS
  // ================================
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }
}
