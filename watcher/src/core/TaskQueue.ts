import { Task } from "./Task";

export class TaskQueue {
  private queue: Task[] = [];

  public isEmpty() {
    return this.queue.length === 0;
  }

  public peek() {
    if (this.isEmpty()) {
      return null;
    }

    return { ...this.queue[0] };
  }

  public enqueue(task: Task) {
    this.queue.push(task);
  }

  public dequeue() {
    const head = this.queue.shift();
    return head ? { ...head } : null;
  }
}
