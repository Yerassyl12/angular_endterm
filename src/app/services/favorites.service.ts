import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { AuthState } from '../items/states/auth.state';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$: Observable<string[]> = this.favoritesSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authState: AuthState
  ) {
    this.loadFavorites();
    
    // Listen to auth state changes
    this.authState.user$.subscribe(user => {
      if (user) {
        this.syncFavoritesWithFirestore(user.uid);
      } else {
        this.loadFromLocalStorage();
      }
    });
  }

  private loadFavorites(): void {
    const user = this.authState.getCurrentUser();
    if (user) {
      this.loadFromFirestore(user.uid);
    } else {
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('favorites');
    const favorites = stored ? JSON.parse(stored) : [];
    this.favoritesSubject.next(favorites);
  }

  private async loadFromFirestore(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.favoritesSubject.next(data['favorites'] || []);
      } else {
        this.favoritesSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading favorites from Firestore:', error);
      this.loadFromLocalStorage();
    }
  }

  private async syncFavoritesWithFirestore(uid: string): Promise<void> {
    const localFavorites = this.getLocalFavorites();
    
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const serverFavorites = docSnap.data()['favorites'] || [];
        const merged = Array.from(new Set([...localFavorites, ...serverFavorites]));
        
        await updateDoc(docRef, { favorites: merged });
        this.favoritesSubject.next(merged);
        
        if (localFavorites.length > 0) {
          console.log('Local favorites merged with server favorites');
        }
      } else {
        await setDoc(docRef, { favorites: localFavorites });
        this.favoritesSubject.next(localFavorites);
      }
      
      localStorage.removeItem('favorites');
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  }

  private getLocalFavorites(): string[] {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  }

  async addFavorite(icao24: string): Promise<void> {
    const user = this.authState.getCurrentUser();
    const currentFavorites = this.favoritesSubject.value;
    
    if (currentFavorites.includes(icao24)) {
      return;
    }
    
    const newFavorites = [...currentFavorites, icao24];
    
    if (user) {
      try {
        const docRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(docRef, {
          favorites: arrayUnion(icao24)
        });
        this.favoritesSubject.next(newFavorites);
      } catch (error) {
        console.error('Error adding favorite to Firestore:', error);
      }
    } else {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      this.favoritesSubject.next(newFavorites);
    }
  }

  async removeFavorite(icao24: string): Promise<void> {
    const user = this.authState.getCurrentUser();
    const currentFavorites = this.favoritesSubject.value;
    const newFavorites = currentFavorites.filter(id => id !== icao24);
    
    if (user) {
      try {
        const docRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(docRef, {
          favorites: arrayRemove(icao24)
        });
        this.favoritesSubject.next(newFavorites);
      } catch (error) {
        console.error('Error removing favorite from Firestore:', error);
      }
    } else {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      this.favoritesSubject.next(newFavorites);
    }
  }

  isFavorite(icao24: string): boolean {
    return this.favoritesSubject.value.includes(icao24);
  }

  getFavorites(): string[] {
    return this.favoritesSubject.value;
  }
}
