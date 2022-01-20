export class Dashboard {
  private openDoor = false;
  private lampColor = 0;
  private motionAlert = false;
  private fireAlert = false; 
  private panicAlert = false;
  private forceNightTime = false;
  private connection: Deno.Conn | null = null;

  async setDoor(value: boolean): Promise<string> {
    this.openDoor = value;
    return await this.updateGuider({ openDoor: this.openDoor });
  }

  async setLampColor(value: number): Promise<string> {
    this.lampColor = value;
    return await this.updateGuider({ lampColor: this.lampColor });
  }

  async setForceNightTime(value: boolean): Promise<string> {
    this.forceNightTime = value;
    return await this.updateGuider({ fnt: this.forceNightTime });
  }

  async setMotionAlert(value: boolean): Promise<string> {
    this.motionAlert = value;
    return await this.updateGuider({ motionAlert: this.motionAlert });
  }

  async setFireAlert(value: boolean): Promise<string> {
    this.fireAlert = value;
    return await this.updateGuider({ fireAlert: this.fireAlert });
  }

  async setPanicAlert(value: boolean): Promise<string> {
    this.panicAlert = value;
    return await this.updateGuider({ panicAlert: this.panicAlert });
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
    await this.connection.read(buffer);

    const filledBuffer = buffer.slice(
      0,
      buffer.findLastIndex((value) => value !== 0) + 1,
    );

    const guiderResponse = new TextDecoder().decode(filledBuffer);
    return guiderResponse;
  }
}
