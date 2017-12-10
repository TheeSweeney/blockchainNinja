export class Helper {
  public constructor() {}

  public sleep(milliseconds: number): Promise<void> {
    console.log(`Sleeping for ${milliseconds} ms`);
    return new Promise<void>((resolve: Function) => {
      setTimeout(() => resolve(), milliseconds);
    });
  }
}