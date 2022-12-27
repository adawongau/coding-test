import { expect } from "chai";
import { next, parse } from "./engine";
import testData from "../test/testData.json";
const _ = false;
const o = true;
describe("next", () => {
  it("should return all dead cells given all dead cells", () => {
    expect(
      next([
        [_, _, _],
        [_, _, _],
        [_, _, _]
      ])
    ).to.deep.equal([
      [_, _, _],
      [_, _, _],
      [_, _, _]
  ]);
  });

  it("should be dead if there is no neighbours", () => {
    const result = next([
      [_, _, _],
      [_, o, _],
      [_, _, _],
    ]);
    expect(result[1][1]).to.equal(_);
  });

  // all test cases from the test data
  testData.worlds.forEach(world => {
    it(world.testCase, () => {
      expect(next(world.input)).to.deep.equal(world.output);
    });
  });
});

describe("parse", () => {
  it("should return [] given ''", () => {
    expect(parse("")).to.deep.equal([]);
  });
  it("should parse O as true and . as false", () => {
    expect(parse("...\n.O.\n...\n")).to.deep.equal([
      [_, _, _],
      [_, o, _],
      [_, _, _],
    ]);
  });

  // all test cases from the test data
  testData.patterns.forEach(pattern => {
    it(pattern.testCase, () => {
      expect(parse(pattern.input)).to.deep.equal(
        pattern.output
      );      
    });  
  });
});
