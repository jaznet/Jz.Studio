class KeyedCollection<T> {
  private items: Map<string, T> = new Map<string, T>();

  public containsKey(key: string): boolean {
    return this.items.has(key);
  }

  public count(): number {
    return this.items.size;
  }

  public add(key: string, value: T) {
    this.items.set(key, value);
  }

  public remove(key: string): boolean {
    return this.items.delete(key);
  }

  public getItem(key: string): T | undefined {
    return this.items.get(key);
  }

  public keys(): IterableIterator<string> {
    return this.items.keys();
  }

  public values(): IterableIterator<T> {
    return this.items.values();
  }

  public entries(): IterableIterator<[string, T]> {
    return this.items.entries();
  }
}

