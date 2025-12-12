import { Component, OnInit, OnDestroy, Injector, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

import { 
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL 
} from '@angular/fire/storage';

import { 
  Firestore,
  doc,
  setDoc,
  getDoc 
} from '@angular/fire/firestore';

import { AuthState } from '../../items/states/auth.state';
import { TranslatePipe } from '../../services/translate.pipe';
import { runInInjectionContext } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  user: User | null = null;
  profilePictureUrl: string | null = null;

  uploading = false;
  uploadMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authState: AuthState,
    private storage: Storage,
    private firestore: Firestore,
    private injector: Injector,
    private ngZone: NgZone     // <<< CRITICAL FIX
  ) {}

  ngOnInit(): void {
    console.log('[Profile] ngOnInit started');

    this.authState.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;

        if (user) {
          this.loadProfilePicture(user.uid);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // LOAD PROFILE PICTURE
  // ========================================
  private async loadProfilePicture(uid: string): Promise<void> {
    try {
      await runInInjectionContext(this.injector, async () => {

        const userRef = doc(this.firestore, `users/${uid}`);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const url = snap.data()['profilePictureUrl'] || null;

          // VERY IMPORTANT → inject into Angular zone
          this.ngZone.run(() => {
            this.profilePictureUrl = url;
          });
        }
      });
    } catch (e) {
      console.error('[Profile] Error loading profile picture:', e);
    }
  }

  // ========================================
  // SELECT FILE & UPLOAD
  // ========================================
  async onFileSelected(event: Event): Promise<void> {
    console.log('========== FILE SELECTED ==========');

    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length || !this.user) return;

    const file = input.files[0];

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.uploadMessage = 'Please upload JPG or PNG';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadMessage = 'File must be under 5MB';
      return;
    }

    this.uploading = true;
    this.uploadMessage = 'Compressing...';

    try {
      const compressed = await this.compressImage(file);

      this.uploadMessage = 'Uploading...';

      await runInInjectionContext(this.injector, async () => {

        const filePath = `profile-pictures/${this.user!.uid}/${Date.now()}_${file.name}`;
        const storageRefObj = ref(this.storage, filePath);

        const task = uploadBytesResumable(storageRefObj, compressed);

        await new Promise<void>((resolve, reject) => {
          task.on(
            'state_changed',
            () => {},
            err => reject(err),
            () => resolve()
          );
        });

        const downloadUrl = await getDownloadURL(storageRefObj);

        await setDoc(
          doc(this.firestore, `users/${this.user!.uid}`),
          { profilePictureUrl: downloadUrl },
          { merge: true }
        );

        // FIX → Angular UI update
        this.ngZone.run(() => {
          this.profilePictureUrl = downloadUrl;
          this.uploadMessage = 'Profile picture updated successfully!';
        });
      });

      setTimeout(() => {
        this.ngZone.run(() => (this.uploadMessage = ''));
      }, 2000);

    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      this.uploadMessage = 'Error uploading image';
    } finally {
      this.uploading = false;
    }
  }

  // ========================================
  // IMAGE COMPRESSION
  // ========================================
  private async compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          let width = img.width;
          let height = img.height;
          const max = 800;

          if (width > height && width > max) {
            height *= max / width;
            width = max;
          } else if (height > width && height > max) {
            width *= max / height;
            height = max;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            blob => blob ? resolve(blob) : reject('Compression error'),
            'image/jpeg',
            0.8
          );
        };

        img.onerror = () => reject('Image load error');
      };

      reader.onerror = () => reject('File read error');
    });
  }
}
