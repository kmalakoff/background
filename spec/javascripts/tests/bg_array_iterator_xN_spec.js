try {
  describe("BGArrayIterator_xN", function() {
    describe("checking element counts in nextByItems", function() {
      it("should count once for each element in the array", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 2);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
    });
    describe("checking element values match in nextByItems", function() {
      it("should refer to the correct elements in nextByItems batch size 1", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        _results = [];
        while (!iterator.nextByItems(function(items) {
            var index1, index2;
            index1 = Math.floor(test_count / test_array2.length);
            index2 = test_count % test_array2.length;
            expect(items[0] === test_array1[index1]).toBeTruthy();
            expect(items[1] === test_array2[index2]).toBeTruthy();
            return test_count++;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
      return it("should refer to the correct elements in nextByItems batch size 3", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        _results = [];
        while (!iterator.nextByItems(function(items) {
            var index1, index2;
            index1 = Math.floor(test_count / test_array2.length);
            index2 = test_count % test_array2.length;
            expect(items[0] === test_array1[index1]).toBeTruthy();
            expect(items[1] === test_array2[index2]).toBeTruthy();
            return test_count++;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
    });
    describe("checking element counts in nextByRange", function() {
      it("should count once for each element in the array", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        while (!iterator.nextByRange(function(range) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_count++;
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 2);
        while (!iterator.nextByRange(function(range) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_count++;
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        while (!iterator.nextByRange(function(range) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_count++;
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
    });
    describe("checking element values match in nextByRange", function() {
      it("should refer to the correct elements in nextByItems batch size 1", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        _results = [];
        while (!iterator.nextByRange(function(range, arrays) {
            var index1, index2, _results2;
            _results2 = [];
            while (!range.isDone()) {
              index1 = Math.floor(test_count / test_array2.length);
              index2 = test_count % test_array2.length;
              expect(range.ranges[0].index === index1).toBeTruthy();
              expect(arrays[0][range.ranges[0].index] === test_array1[index1]).toBeTruthy();
              expect(range.ranges[1].index === index2).toBeTruthy();
              expect(arrays[1][range.ranges[1].index] === test_array2[index2]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
      return it("should refer to the correct elements in nextByRange batch size 3", function() {
        var iterator, no_op, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        _results = [];
        while (!iterator.nextByRange(function(range, arrays) {
            var index1, index2, _results2;
            _results2 = [];
            while (!range.isDone()) {
              index1 = Math.floor(test_count / test_array2.length);
              index2 = test_count % test_array2.length;
              expect(range.ranges[0].index === index1).toBeTruthy();
              expect(arrays[0][range.ranges[0].index] === test_array1[index1]).toBeTruthy();
              expect(range.ranges[1].index === index2).toBeTruthy();
              expect(arrays[1][range.ranges[1].index] === test_array2[index2]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
    });
    describe("checking element counts using step()", function() {
      it("should count once for each element in the array", function() {
        var iterator, range, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, range, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 2);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, range, test_array1, test_array2, test_count, total_count;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === total_count).toBeTruthy();
      });
    });
    return describe("checking element values match using step()", function() {
      it("should refer to the correct elements in nextByItems batch size 1", function() {
        var index1, index2, iterator, range, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 1);
        _results = [];
        while (!iterator.isDone()) {
          range = iterator.step();
          _results.push((function() {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              index1 = Math.floor(test_count / test_array2.length);
              index2 = test_count % test_array2.length;
              expect(range.ranges[0].index === index1).toBeTruthy();
              expect(test_array1[range.ranges[0].index] === test_array1[index1]).toBeTruthy();
              expect(range.ranges[1].index === index2).toBeTruthy();
              expect(test_array2[range.ranges[1].index] === test_array2[index2]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })());
        }
        return _results;
      });
      return it("should refer to the correct elements in step batch size 3", function() {
        var index1, index2, iterator, range, test_array1, test_array2, test_count, total_count, _results;
        test_array1 = [1, 2, 3];
        test_array2 = [1, 2, 3, 4, 5];
        total_count = test_array1.length * test_array2.length;
        test_count = 0;
        iterator = new BGArrayIterator_xN([test_array1, test_array2], 3);
        _results = [];
        while (!iterator.isDone()) {
          range = iterator.step();
          _results.push((function() {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              index1 = Math.floor(test_count / test_array2.length);
              index2 = test_count % test_array2.length;
              expect(range.ranges[0].index === index1).toBeTruthy();
              expect(test_array1[range.ranges[0].index] === test_array1[index1]).toBeTruthy();
              expect(range.ranges[1].index === index2).toBeTruthy();
              expect(test_array2[range.ranges[1].index] === test_array2[index2]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })());
        }
        return _results;
      });
    });
  });
} catch (error) {
  alert("BGArrayIterator_xN specs failed: '" + error + "'");
}