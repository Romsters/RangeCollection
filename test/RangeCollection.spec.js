const logger = require('../lib/utils/logger');
const RangeCollection = require('../lib/RangeCollection');

let rc = null;

describe('[RangeCollection]', () => {
  beforeEach(() => {
    rc = new RangeCollection();
  })
  it('should be initialized with empty collection of ranges when called', () => {
    expect(rc.length).toBe(0);
  })
  describe('toString:', () => {
    describe('when range collection is empty', () => {
      it('should return an "[Empty range)" string', () => {
        expect(rc.toString()).toBe('[Empty range)');
      })
    })
    describe('when range collection is not empty', () => {
      beforeEach(() => {
        rc.add([3,4]);
        rc.add([10,17]);
        rc.add([32,40]);
      })
      it('should return a range collection in a string format', () => {
        expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40)');
      })
    })
  })
  describe('print:', () => {
    beforeEach(() => {
      spyOn(rc, 'toString').andReturn('some string');
      spyOn(logger, 'log');
    })
    it('should call toString method', () => {
      rc.print();
      expect(rc.toString).toHaveBeenCalled();
    })
    it('should log value returned by a toString call', () => {
      rc.print();
      expect(logger.log).toHaveBeenCalledWith('some string');
    })
  })
  describe('add:', () => {
    describe('when range parameter is not defined', () => {
      it('should throw an error', () => {
        expect(() => rc.add()).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is not an array of 2 elements', () => {
      it('should throw an error', () => {
        expect(() => rc.add([1,2,3])).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is not an array of 2 numbers', () => {
      it('should throw an error', () => {
        expect(() => rc.add([1,'a'])).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is an array of 2 numbers', () => {
      describe('and start value of the range is greater than the end value', () => {
        it('should throw an error', () => {
          expect(() => rc.add([3,2])).toThrow('Range start value should not be greater than range end value');
        })
      })
      describe('and start value of the range is not greater than the end value', () => {
        describe('and range is empty', () => {
          it('should not add range to the collection', () => {
            rc.add([1,1]);
            expect(rc.length).toBe(0);
          })
        })
        describe('and range is not empty', () => {
          describe('and range collection is empty', () => {
            it('should add the range without changes to the collection', () => {
              const range = [5, 10];
              rc.add(range);
              expect(rc.toString()).toBe('[5, 10)');
            })
          })
          describe('and range collection is not empty', () => {
            beforeEach(() => {
              rc.add([3,4]);
              rc.add([10,17]);
              rc.add([32,40]);
            })
            describe('and range does not intersect with any other ranges in the collection', () => {
              describe('and range starts before all the other ranges in the collection', () => {
                it('should add the range before all the other ranges', () => {
                  rc.add([1,2]);
                  expect(rc.toString()).toBe('[1, 2) [3, 4) [10, 17) [32, 40)');
                })
              })
              describe('and range starts after all the other ranges in the collection', () => {
                it('should add the range after all the other ranges', () => {
                  rc.add([51,69]);
                  expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40) [51, 69)');
                })
              })
              describe('and range is somewhere in the middle of collection', () => {
                it('should add the range according to ascending order', () => {
                  rc.add([7,8]);
                  expect(rc.toString()).toBe('[3, 4) [7, 8) [10, 17) [32, 40)');
                })
              })
            })
            describe('and range intersects with other ranges in the collection', () => {
              describe('and range is a subrange of one of the ranges in the collection', () => {
                it('should not change the collection', () => {
                  rc.add([10, 13]);
                  expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40)')
                })
              })
              describe('and one of the ranges in the collection is a subrange of the given range', () => {
                it('should replace the subrange with the given range', () => {
                  rc.add([7, 20]);
                  expect(rc.toString()).toBe('[3, 4) [7, 20) [32, 40)')
                })
              })
              describe('and one of the ranges in the collection intersects with given range', () => {
                it('should replace this range with the union of the given range and this range', () => {
                  rc.add([13, 28]);
                  expect(rc.toString()).toBe('[3, 4) [10, 28) [32, 40)')
                })
              })
              describe('and more than one of the ranges in the collection intersects with given range', () => {
                it('should replace these ranges with the union of the given range and these ranges', () => {
                  rc.add([4, 25]);
                  expect(rc.toString()).toBe('[3, 25) [32, 40)')
                })
              })
            })
          })
        })
      })
    })
  });
  describe('remove:', () => {
    describe('when range parameter is not defined', () => {
      it('should throw an error', () => {
        expect(() => rc.remove()).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is not an array of 2 elements', () => {
      it('should throw an error', () => {
        expect(() => rc.remove([1,2,3])).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is not an array of 2 numbers', () => {
      it('should throw an error', () => {
        expect(() => rc.remove([1,'a'])).toThrow('Range should be an array of 2 numbers');
      })
    })
    describe('when range parameter is an array of 2 numbers', () => {
      describe('and start value of the range is greater than the end value', () => {
        it('should throw an error', () => {
          expect(() => rc.remove([3,2])).toThrow('Range start value should not be greater than range end value');
        })
      })
      describe('and start value of the range is not greater than the end value', () => {
        describe('and range is empty', () => {
          it('should not change the collection', () => {
            rc.remove([1,1]);
            expect(rc.length).toBe(0);
          })
        })
        describe('and range is not empty', () => {
          describe('and range collection is empty', () => {
            it('should not change the collection', () => {
              const range = [5, 10];
              rc.remove(range);
              expect(rc.length).toBe(0);
            })
          })
          describe('and range collection is not empty', () => {
            beforeEach(() => {
              rc.add([3,4]);
              rc.add([10,17]);
              rc.add([32,40]);
            })
            describe('and range does not intersect with any other ranges in the collection', () => {
              describe('and range starts before all the other ranges in the collection', () => {
                it('should not change the collection', () => {
                  rc.remove([1,2]);
                  expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40)');
                })
              })
              describe('and range starts after all the other ranges in the collection', () => {
                it('should not change the collection', () => {
                  rc.remove([51,69]);
                  expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40)');
                })
              })
              describe('and range is somewhere in the middle of collection', () => {
                it('should not change the collection', () => {
                  rc.remove([7,8]);
                  expect(rc.toString()).toBe('[3, 4) [10, 17) [32, 40)');
                })
              })
            })
            describe('and range intersects with other ranges in the collection', () => {
              describe('and range is a subrange of one of the ranges in the collection', () => {
                it('should remove the range form the collection', () => {
                  rc.remove([12, 16]);
                  expect(rc.toString()).toBe('[3, 4) [10, 12) [16, 17) [32, 40)')
                })
              })
              describe('and one of the ranges in the collection is a subrange of the given range', () => {
                it('should remove such a range from the collection', () => {
                  rc.remove([9, 20]);
                  expect(rc.toString()).toBe('[3, 4) [32, 40)')
                })
              })
              describe('and one of the ranges in the collection intersects with the given range', () => {
                it('should replace this range with the subtraction of the this range and given range', () => {
                  rc.remove([13, 28]);
                  expect(rc.toString()).toBe('[3, 4) [10, 13) [32, 40)')
                })
              })
              describe('and more than one of the ranges in the collection intersects with given range', () => {
                it('should replace these ranges with the subtraction of the these ranges and given range', () => {
                  rc.remove([3, 12]);
                  expect(rc.toString()).toBe('[12, 17) [32, 40)')
                })
              })
              describe('and all the ranges in the collection are subranges of the given range', () => {
                it('should remove all the ranges from the collection', () => {
                  rc.remove([2, 50]);
                  expect(rc.length).toBe(0);
                })
              })
            })
          })
        })
      })
    })
  })
})