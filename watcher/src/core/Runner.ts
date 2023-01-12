import { spawn } from "node:child_process";
import { Task } from "./Task";
import { TaskQueue } from "./TaskQueue";

export class Runner {
  private running: boolean = false;
  private current: Task | null = null;

  constructor(private queue: TaskQueue) {}

  private run({ command, env }: Task) {
    return new Promise<void>((resolve) => {
      const exec = spawn(command, {
        stdio: "inherit",
        shell: true,
        cwd: process.cwd(),
        env: { ...process.env, ...env },
      });

      exec.on("close", () => resolve());
      exec.on("exit", () => resolve());
    });
  }

  public isRunning() {
    return this.running;
  }

  public async proccess() {
    if (this.running) {
      return void 0;
    }

    const task = this.queue.dequeue();
    this.current = task ? { ...task } : null;
    if (!task) {
      return void 0;
    }

    this.running = true;
    return this.run(task).then(() => {
      this.running = false;
      this.current = null;
      this.proccess();
    });
  }
}
