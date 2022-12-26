import { expect } from "chai";
import { next, parse } from "./engine";
import testData from "../test/testData.json";
const _ = false;
const o = true;
describe("next", () => {
  // const p_56P6H1V0 = ".....OOO..........OOO.....\nOOO.O.......OO.......O.OOO\n....O...O..O..O..O...O....\n....O.....O....O.....O....\n..........OO..OO..........\n.......O...O..O...O.......\n.......O.O......O.O.......\n........OOOOOOOOOO........\n..........O....O..........\n........O........O........\n.......O..........O.......\n........O........O........\n";
  // const parsedPattern = parse(p_56P6H1V0);
  it("should return all dead cells given all dead cells", () => {
    expect(
      next([
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ])
    ).to.deep.equal([
      [false, false, false],
      [false, false, false],
      [false, false, false]
  ]);
  });

  it.skip("should be dead if there is no neighbours", () => {
    const result = next([
      [_, _, _],
      [_, o, _],
      [_, _, _],
    ]);
    expect(result[1][1]).to.equal(false);
  });
});

describe("parse", () => {
  it("should return [] given ''", () => {
    expect(parse("")).to.deep.equal([]);
  });
  it("should parse O as true and . as false", () => {
    expect(parse("...\n.O.\n...\n")).to.deep.equal([
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ]);
  });
  it("should parse pattern", () => {
    expect(parse(testData.parse[0].input)).to.deep.equal(
      testData.parse[0].output
    );
  });
});
