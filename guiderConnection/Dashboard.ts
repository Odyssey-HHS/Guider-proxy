export class Dashboard {
  private openDoor = false;
  private lampColor = 0;
  private connection: Deno.Conn | null = null;

  async setDoor(value: boolean): Promise<string> {
    this.openDoor = value;
    return await this.updateGuider({ openDoor: this.openDoor });
  }

  async setLampColor(value: number): Promise<string> {
    this.lampColor = value;
    return await this.updateGuider({ lampColor: this.lampColor });
  }

  async connect(options: Deno.ConnectOptions) {
    this.connection = await Deno.connect(options);
  }

  async updateGuider(data: Record<string, unknown>): Promise<string> {
    if (this.connection === null) {
      throw new Error(
        "Dashboard doesn't have an active TCP connection to Guider",
      );
    }

    const jsonEncoded = new TextEncoder().encode(JSON.stringify(data));
    await this.connection.write(jsonEncoded);

    const buffer = new Uint8Array(4096);
    this.connection.read(buffer);

    const guiderResponse = new TextDecoder().decode(buffer);
    return guiderResponse;
  }
}
