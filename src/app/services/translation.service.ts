import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'ru' | 'kz';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<Language>('en');
  public currentLang$: Observable<Language> = this.currentLangSubject.asObservable();

  private translations: Translations = {
    'app.title': {
      en: 'OpenSky Flight Tracker',
      ru: 'OpenSky Трекер Полетов',
      kz: 'OpenSky Ұшу Трекері'
    },
    'nav.home': {
      en: 'Home',
      ru: 'Главная',
      kz: 'Басты бет'
    },
    'nav.products': {
      en: 'Flights',
      ru: 'Рейсы',
      kz: 'Рейстер'
    },
    'nav.favorites': {
      en: 'Favorites',
      ru: 'Избранное',
      kz: 'Таңдаулылар'
    },
    'nav.profile': {
      en: 'Profile',
      ru: 'Профиль',
      kz: 'Профиль'
    },
    'nav.login': {
      en: 'Login',
      ru: 'Войти',
      kz: 'Кіру'
    },
    'nav.signup': {
      en: 'Sign Up',
      ru: 'Регистрация',
      kz: 'Тіркелу'
    },
    'nav.logout': {
      en: 'Logout',
      ru: 'Выйти',
      kz: 'Шығу'
    },
    'home.welcome': {
      en: 'Welcome to OpenSky Flight Tracker',
      ru: 'Добро пожаловать в OpenSky Трекер Полетов',
      kz: 'OpenSky Ұшу Трекеріне қош келдіңіз'
    },
    'home.description': {
      en: 'Track real-time flight data from around the world using OpenSky Network API',
      ru: 'Отслеживайте данные о полетах в реальном времени со всего мира с помощью OpenSky Network API',
      kz: 'OpenSky Network API арқылы әлем бойынша нақты уақыттағы ұшу деректерін қадағалаңыз'
    },
    'products.title': {
      en: 'Flight List',
      ru: 'Список рейсов',
      kz: 'Рейстер тізімі'
    },
    'products.search': {
      en: 'Search by callsign or country...',
      ru: 'Поиск по позывному или стране...',
      kz: 'Шақыру белгісі немесе ел бойынша іздеу...'
    },
    'products.loading': {
      en: 'Loading flights...',
      ru: 'Загрузка рейсов...',
      kz: 'Рейстер жүктелуде...'
    },
    'products.details': {
      en: 'Details',
      ru: 'Детали',
      kz: 'Толығырақ'
    },
    'products.addToFavorites': {
      en: 'Add to Favorites',
      ru: 'Добавить в избранное',
      kz: 'Таңдаулыларға қосу'
    },
    'products.removeFromFavorites': {
      en: 'Remove from Favorites',
      ru: 'Удалить из избранного',
      kz: 'Таңдаулылардан алып тастау'
    },
    'details.title': {
      en: 'Flight Details',
      ru: 'Детали рейса',
      kz: 'Рейс туралы толық ақпарат'
    },
    'details.backToList': {
      en: 'Back to List',
      ru: 'Назад к списку',
      kz: 'Тізімге оралу'
    },
    'login.title': {
      en: 'Login',
      ru: 'Вход',
      kz: 'Кіру'
    },
    'login.email': {
      en: 'Email',
      ru: 'Электронная почта',
      kz: 'Электрондық пошта'
    },
    'login.password': {
      en: 'Password',
      ru: 'Пароль',
      kz: 'Құпия сөз'
    },
    'login.submit': {
      en: 'Login',
      ru: 'Войти',
      kz: 'Кіру'
    },
    'login.noAccount': {
      en: "Don't have an account?",
      ru: 'Нет аккаунта?',
      kz: 'Аккаунтыңыз жоқ па?'
    },
    'signup.title': {
      en: 'Sign Up',
      ru: 'Регистрация',
      kz: 'Тіркелу'
    },
    'signup.repeatPassword': {
      en: 'Repeat Password',
      ru: 'Повторите пароль',
      kz: 'Құпия сөзді қайталаңыз'
    },
    'signup.submit': {
      en: 'Sign Up',
      ru: 'Зарегистрироваться',
      kz: 'Тіркелу'
    },
    'signup.hasAccount': {
      en: 'Already have an account?',
      ru: 'Уже есть аккаунт?',
      kz: 'Аккаунтыңыз бар ма?'
    },
    'profile.title': {
      en: 'Profile',
      ru: 'Профиль',
      kz: 'Профиль'
    },
    'profile.uploadPicture': {
      en: 'Upload Profile Picture',
      ru: 'Загрузить фото профиля',
      kz: 'Профиль суретін жүктеу'
    },
    'favorites.title': {
      en: 'My Favorites',
      ru: 'Мои избранные',
      kz: 'Менің таңдаулыларым'
    },
    'favorites.empty': {
      en: 'No favorites yet',
      ru: 'Пока нет избранных',
      kz: 'Әзірге таңдаулылар жоқ'
    },
    'filter.country': {
      en: 'Country',
      ru: 'Страна',
      kz: 'Ел'
    },
    'filter.all': {
      en: 'All',
      ru: 'Все',
      kz: 'Барлығы'
    },
    'pagination.itemsPerPage': {
      en: 'Items per page',
      ru: 'Элементов на странице',
      kz: 'Беттегі элементтер'
    },
    'pagination.page': {
      en: 'Page',
      ru: 'Страница',
      kz: 'Бет'
    },
    'error.required': {
      en: 'This field is required',
      ru: 'Это поле обязательно',
      kz: 'Бұл өріс міндетті'
    },
    'error.email': {
      en: 'Invalid email format',
      ru: 'Неверный формат email',
      kz: 'Email форматы қате'
    },
    'error.password': {
      en: 'Password must be at least 8 characters with 1 number and 1 special character',
      ru: 'Пароль должен содержать минимум 8 символов, 1 цифру и 1 специальный символ',
      kz: 'Құпия сөз кемінде 8 таңбадан, 1 саннан және 1 арнайы таңбадан тұруы керек'
    },
    'error.passwordMatch': {
      en: 'Passwords do not match',
      ru: 'Пароли не совпадают',
      kz: 'Құпия сөздер сәйкес келмейді'
    }
  };

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ru', 'kz'].includes(savedLang)) {
      this.currentLangSubject.next(savedLang);
    }
  }

  setLanguage(lang: Language): void {
    this.currentLangSubject.next(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLanguage(): Language {
    return this.currentLangSubject.value;
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      return key;
    }
    return translation[this.getCurrentLanguage()] || key;
  }
}
