export class Lock {
  private count = 0;

  get locked() {
    return this.count > 0;
  }

  acquire() {
    this.count++;
  }

  release() {
    this.count--;
  }
}
