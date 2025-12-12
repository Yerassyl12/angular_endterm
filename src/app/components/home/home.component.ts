import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '✈️',
      titleKey: 'Real-time Flight Tracking',
      descKey: 'Track flights from around the world in real-time using OpenSky Network data'
    },
    {
      icon: '🌍',
      titleKey: 'Global Coverage',
      descKey: 'Access flight information from all countries and regions'
    },
    {
      icon: '⭐',
      titleKey: 'Save Favorites',
      descKey: 'Bookmark your favorite flights and access them quickly'
    },
    {
      icon: '🔍',
      titleKey: 'Advanced Search',
      descKey: 'Search and filter flights by callsign, country, and more'
    }
  ];
}
