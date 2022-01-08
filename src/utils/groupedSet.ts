export class GroupedSet<T> {
  private sets: Map<string, Set<T>> = new Map();
  private count: number = 0;

  has(group: string | number): boolean {
    return this.sets.has(String(group));
  }

  get(group: string | number): Set<T> | null {
    return this.sets.get(String(group)) ?? null;
  }

  size(): number {
    return this.count;
  }

  numberOfGroups(): number {
    return this.sets.size;
  }

  add(group: string | number, value: T): boolean {
    const set = this.sets.get(String(group));
    if (set) {
      if (!set.has(value)) {
        set.add(value);
        this.count += 1;
      }
    } else {
      this.sets.set(String(group), new Set([value]));
      this.count += 1;
    }
    return true;
  }

  remove(group: string | number, value: T): boolean {
    const set = this.sets.get(String(group));
    if (!set?.has(value)) return false;
    set.delete(value);
    this.count -= 1;
    if (set.size === 0) this.removeGroup(group);
    return true;
  }

  pop(group: string | number): T | null {
    const set = this.get(group);
    if (!set) return null;
    const item = set.values().next();
    if (item.done) return null;
    else this.remove(group, item.value);
    return item.value;
  }

  popFromAny(amount: number): T[] {
    const items: T[] = [];
    const groups = this.sets.entries();
    for (const [id, group] of groups) {
      for (const item of group.values()) {
        items.push(item);
        this.remove(id, item);
        if (items.length === amount) return items;
      }
    }
    return items;
  }

  removeGroup(group: string | number): boolean {
    const set = this.sets.get(String(group));
    if (!set) return false;
    this.count -= set.size;
    this.sets.delete(String(group));
    return true;
  }
}
