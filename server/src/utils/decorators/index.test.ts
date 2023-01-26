import { describe, test, expect } from "@jest/globals";
import DecorateAll from "./DecorateAll";
import TryCatchMiddleware from "./TryCatchMiddleware";

describe("DecorateAll, TryCatchMiddleware", () => {
  @DecorateAll(TryCatchMiddleware)
  class TestController {
    state: any;
    constructor(state?: any) {
      this.state = state;
    }
    async middleware1(req: any, res: any, next: any) {
      throw new Error();
      return true;
    }
    async middleware2(req: any, res: any, next: any) {
      throw new Error();
      return true;
    }
    async getStateMiddleware(req: any, res: any, next: any) {
      return this.state;
    }
  }
  test("Applies to all class methods and does not throwing an error", () => {
    const test = new TestController();
    return expect(async () => {
      await test.middleware1({}, {}, () => {});
      await test.middleware2({}, {}, () => {});
    }).not.toThrowError();
  });
  test("Check context in decorated method", async () => {
    const state = Symbol();
    const test = new TestController(state);
    const derivedState = await test.getStateMiddleware({}, {}, () => {});
    return expect(derivedState).toBe(state);
  });
});
