class KeyedCollection<T> {
  private items: { [key: string]: T } = {};

  public containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public count(): number {
    return Object.keys(this.items).length;
  }

  public add(key: string, value: T) {
    this.items[key] = value;
  }

  public remove(key: string): boolean {
    if (this.items.hasOwnProperty(key)) {
      delete this.items[key];
      return true;
    }
    return false;
  }

  public getItem(key: string): T | null {
    return this.items[key] || null;
  }

  public keys(): string[] {
    return Object.keys(this.items);
  }

  public values(): T[] {
    return Object.values(this.items);
  }
}
