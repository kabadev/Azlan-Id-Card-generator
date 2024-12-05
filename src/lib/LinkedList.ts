interface Node<T> {
  data: T;
  next: Node<T> | null;
  prev: Node<T> | null;
}

class LinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private current: Node<T> | null = null;

  insert(data: T): void {
    const newNode: Node<T> = { data, next: null, prev: null };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.current && this.current.next) {
        let temp = this.current.next;
        while (temp.next) {
          temp = temp.next;
        }
        this.tail = temp;
      }

      newNode.prev = this.current;
      if (this.current) {
        this.current.next = newNode;
      }
      this.tail = newNode;
    }

    this.current = newNode;
  }

  undoEdit(): T | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current.data;
    }
    return null;
  }

  redoEdit(): T | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.data;
    }
    return null;
  }
}

export const storeData = new LinkedList<any>();
