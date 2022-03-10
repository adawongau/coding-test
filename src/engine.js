// (world: boolean[][]) => boolean[][]
import DieOrLive from './DieOrLive.js';
export const next = (world) => {
  let dol = new DieOrLive()
  dol.constructArr(world)
  dol.updateDataSets();
  let genArr =dol.fillingArr();
  return genArr;
};
// (pattern: string) => boolean[][]
export const parse = (pattern) => {
  let dol = new DieOrLive()
  let rowData = dol.patternToArray(pattern)
  let dataSet = dol.converStringDatatoArr(rowData)
  return dataSet;
};
