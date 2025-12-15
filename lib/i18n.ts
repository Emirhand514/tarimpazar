// Basit i18n sistemi

export type Locale = 'tr' | 'en';

const translations = {
  tr: {
    // Genel
    'site.title': 'Tarımpazar',
    'site.description': 'Tarım ürünleri ve iş ilanları platformu',
    
    // Navigasyon
    'nav.home': 'Ana Sayfa',
    'nav.explore': 'Market',
    'nav.dashboard': 'Panel',
    'nav.profile': 'Profil',
    'nav.settings': 'Ayarlar',
    'nav.logout': 'Çıkış Yap',
    'nav.login': 'Giriş Yap',
    'nav.signup': 'Kayıt Ol',
    
    // İlanlar
    'listing.price': 'Fiyat',
    'listing.wage': 'Ücret',
    'listing.barter': 'Takas Teklifi',
    'listing.create': 'İlan Oluştur',
    'listing.edit': 'İlan Düzenle',
    'listing.delete': 'İlan Sil',
    'listing.description': 'Açıklama',
    'listing.location': 'Konum',
    'listing.contact': 'İletişim',
    'listing.call': 'Ara',
    'listing.message': 'Mesaj Gönder',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.myListings': 'İlanlarım',
    'dashboard.favorites': 'Favoriler',
    'dashboard.messages': 'Mesajlar',
    'dashboard.reports': 'Raporlar',
    'dashboard.notifications': 'Bildirimler',
    
    // Auth
    'auth.login': 'Giriş Yap',
    'auth.signup': 'Kayıt Ol',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.name': 'Ad Soyad',
    'auth.forgotPassword': 'Şifremi Unuttum',
    
    // Common
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.close': 'Kapat',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Bir hata oluştu',
    'common.success': 'Başarılı',
  },
  en: {
    // General
    'site.title': 'TarimPazar',
    'site.description': 'Agricultural products and job listings platform',
    
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Market',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Listings
    'listing.price': 'Price',
    'listing.wage': 'Wage',
    'listing.barter': 'Barter Offer',
    'listing.create': 'Create Listing',
    'listing.edit': 'Edit Listing',
    'listing.delete': 'Delete Listing',
    'listing.description': 'Description',
    'listing.location': 'Location',
    'listing.contact': 'Contact',
    'listing.call': 'Call',
    'listing.message': 'Send Message',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.myListings': 'My Listings',
    'dashboard.favorites': 'Favorites',
    'dashboard.messages': 'Messages',
    'dashboard.reports': 'Reports',
    'dashboard.notifications': 'Notifications',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.forgotPassword': 'Forgot Password',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
  },
};

export function t(key: string, locale: Locale = 'tr'): string {
  const localeTranslations = translations[locale] as Record<string, string>;
  return localeTranslations[key] || key;
}

export function getTranslations(locale: Locale = 'tr') {
  return (key: string) => t(key, locale);
}

