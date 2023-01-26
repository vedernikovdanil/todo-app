import { describe, test, expect } from "@jest/globals";
import * as utils from ".";

describe("toSQLDate", () => {
  const sqlDate = utils.toSQLDate(new Date("01/01/1970"));
  test("Date matches regex", () => {
    return expect(sqlDate).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
  test("Date is correct", () => {
    const [year, month, day] = sqlDate.split("-");
    return expect(new Date(`${month}/${day}/${year}`).valueOf()).not.toBeNaN();
  });
});

describe("getRandom", () => {
  const array = Array(2).fill(null).map(Symbol);
  test("Check returned element for equal from original array", () => {
    return expect(array.includes(utils.getRandom(array))).toBeTruthy();
  });
});

describe("getInstances", () => {
  const _class = Date;
  const length = 10;
  const array = utils.getInstances(() => new _class(), length);
  test("Check length array", () => {
    return expect(array.length).toBe(length);
  });
  test("Check elements from array on instance of return type", () => {
    const check = array.reduce((acc, el) => acc && el instanceof _class, true);
    return expect(check).toBeTruthy();
  });
});
