const logger = require('./utils/logger');
/**
 * RangeCollection class
 */
class RangeCollection {
  constructor() {
    this._collection = [];
  }
  get length() {
    return this._collection.length;
  }
  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add (range) {
    validateRange(range);
    if (isEmptyRange(range)) {
      return;
    }
    let accumulatedRange = range;
    const reducedCollection = this._collection.reduce((accumulator, currentRange) => {
      if (!hasIntersection(accumulatedRange, currentRange)) {
        accumulator.push(currentRange);
      } else {
        accumulatedRange = [
          Math.min(accumulatedRange[0], currentRange[0]),
          Math.max(accumulatedRange[1], currentRange[1])
        ];
      }
      return accumulator;
    }, []);
    const insertIndex = reducedCollection.findIndex(r => r[0] > accumulatedRange[1]);
    if (insertIndex === -1) {
      reducedCollection.push(accumulatedRange);
    } else {
      reducedCollection.splice(insertIndex, 0, accumulatedRange);
    }
    this._collection = reducedCollection;
  }
  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove (range) {
    validateRange(range);
    if (isEmptyRange(range)) {
      return;
    }
    this._collection = this._collection.reduce((accumulator, currentRange) => {
      if (range[0] > currentRange[0]) {
        accumulator.push([currentRange[0], Math.min(range[0], currentRange[1])])
      }
      if (range[1] < currentRange[1]) {
        accumulator.push([Math.max(range[1], currentRange[0]), currentRange[1]])
      }
      return accumulator;
    }, []);
  }
  /**
   * Return the list of ranges in a string format
   */
  toString() {
    return this._collection.map(range => `[${range[0]}, ${range[1]})`).join(' ') || '[Empty range)';
  }
  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    logger.log(this.toString());
  }
}

function hasIntersection(range1, range2) {
  if ((range1[0] >= range2[0] && range1[0] <= range2[1]) || 
    (range1[1] >= range2[0] && range1[1] <= range2[1]) ||
    (range1[0] < range2[0] && range1[1] > range2[1])
  ) {
    return true;
  }
  return false;
}

function validateRange(range) {
  if (!Array.isArray(range) || range.length !== 2 ||
    +range[0] !== range[0] || +range[1] !== range[1]
  ) {
    throw new Error('Range should be an array of 2 numbers')
  }
  if (range[0] > range[1]) {
    throw new Error('Range start value should not be greater than range end value')
  }
}

function isEmptyRange(range) {
  return range[0] === range[1];
}

module.exports = RangeCollection;