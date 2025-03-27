/**
 * Сервіс для кешування даних з API
 * Використовується для зменшення кількості запитів до бази даних
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  /**
   * Зберегти дані в кеш
   * @param key - ключ для доступу до даних
   * @param data - дані для збереження
   * @param expiresIn - час життя кешу в мілісекундах (за замовчуванням 5 хвилин)
   */
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }
  
  /**
   * Отримати дані з кешу
   * @param key - ключ для доступу до даних
   * @returns дані або null, якщо дані не знайдені або застаріли
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Перевіряємо, чи не застарів кеш
    const now = Date.now();
    if (now - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  /**
   * Видалити дані з кешу
   * @param key - ключ для доступу до даних
   */
  remove(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Очистити весь кеш
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Очистити застарілі дані з кешу
   */
  clearExpired(): void {
    const now = Date.now();
    
    // Використовуємо Array.from для конвертації Map.entries() в масив
    Array.from(this.cache.entries()).forEach(([key, item]) => {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
      }
    });
  }
}

// Створюємо єдиний екземпляр сервісу для використання в усьому додатку
const cacheService = new CacheService();

export default cacheService;
