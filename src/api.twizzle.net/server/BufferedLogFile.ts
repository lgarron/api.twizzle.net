const BUFFER_DURATION_MS = 10 * 1000;

export class BufferedLogFile {
  buffer = "";

  activeTimeout: number | null = null;

  constructor(private filename: string) {
  }

  // deno-lint-ignore no-explicit-any
  log(e: Record<string, any>): void {
    const now = new Date();
    e.timestampUnixMS = now.getTime();
    e.timestampHuman = now.toString();
    this.buffer += JSON.stringify(e);
    if (this.activeTimeout === null) {
      this.activeTimeout = setTimeout(this.flush.bind(this));
    }
  }

  flush(): void {
    Deno.writeTextFile(this.filename, this.buffer, { append: true });
    this.activeTimeout = null;
  }
}