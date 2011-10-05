try {
  describe("Background.ArrayIterator_x3", function() {
    describe("checking element counts in nextByItems", function() {
      it("should count once for each element in the arrays", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the arrays with batch size 2", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 2);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 3);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the arrays with batch size greater than the number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], test_array1.length * test_array2.length + 5);
        while (!iterator.nextByItems(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
    });
    describe("checking results match in nextByItems", function() {
      var expected_result, expected_result_1x2, test_array1, test_array2, test_array3, total_count;
      test_array1 = [3, 7, 11];
      test_array2 = [3, 5];
      test_array3 = [13, 3, 23];
      total_count = test_array1.length * test_array2.length * test_array3.length;
      expected_result_1x2 = 3 * 3 + 3 * 5 + 7 * 3 + 7 * 5 + 11 * 3 + 11 * 5;
      expected_result = expected_result_1x2 * 13 + expected_result_1x2 * 3 + expected_result_1x2 * 23;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.nextByItems(function(items) {
            return test_result += items[0] * items[1] * items[2];
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      it("should calculate the correct result with batch size 4", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 4);
        while (!iterator.nextByItems(function(items) {
            return test_result += items[0] * items[1] * items[2];
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      return it("should calculate the correct result with batch size greater than the number of elements", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], test_array1.length * test_array2.length + 5);
        while (!iterator.nextByItems(function(items) {
            return test_result += items[0] * items[1] * items[2];
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
    describe("checking element counts in nextByCombinations", function() {
      it("should count once for each element in the arrays", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.nextByCombinations(function(combinations) {
            return test_count += combinations.length;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the arrays with batch size 2", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 2);
        while (!iterator.nextByCombinations(function(combinations) {
            return test_count += combinations.length;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the arrays with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 3);
        while (!iterator.nextByCombinations(function(combinations) {
            return test_count += combinations.length;
          })) {
          no_op = true;
        }
        return expect(test_count === total_count).toBeTruthy();
      });
    });
    describe("checking results match in nextByCombinations", function() {
      var expected_result, expected_result_1x2, test_array1, test_array2, test_array3, total_count;
      test_array1 = [3, 7, 11];
      test_array2 = [3, 5];
      test_array3 = [13, 3, 23];
      total_count = test_array1.length * test_array2.length * test_array3.length;
      expected_result_1x2 = 3 * 3 + 3 * 5 + 7 * 3 + 7 * 5 + 11 * 3 + 11 * 5;
      expected_result = expected_result_1x2 * 13 + expected_result_1x2 * 3 + expected_result_1x2 * 23;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.nextByCombinations(function(combinations) {
            var combination, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = combinations.length; _i < _len; _i++) {
              combination = combinations[_i];
              _results.push(test_result += combination[0] * combination[1] * combination[2]);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      it("should calculate the correct result with batch size 4", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 4);
        while (!iterator.nextByCombinations(function(combinations) {
            var combination, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = combinations.length; _i < _len; _i++) {
              combination = combinations[_i];
              _results.push(test_result += combination[0] * combination[1] * combination[2]);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      return it("should calculate the correct result with batch size greater than the number of elements", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], test_array1.length * test_array2.length + 5);
        while (!iterator.nextByCombinations(function(combinations) {
            var combination, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = combinations.length; _i < _len; _i++) {
              combination = combinations[_i];
              _results.push(test_result += combination[0] * combination[1] * combination[2]);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
    describe("checking element counts in nextByRange", function() {
      it("should count once for each element in the arrays", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
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
      it("should count once for each element in the arrays with batch size 2", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 2);
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
      return it("should count once for each element in the arrays with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 3);
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
    describe("checking results match in nextByRange", function() {
      var expected_result, expected_result_1x2, test_array1, test_array2, test_array3, total_count;
      test_array1 = [3, 7, 11];
      test_array2 = [3, 5];
      test_array3 = [13, 3, 23];
      total_count = test_array1.length * test_array2.length * test_array3.length;
      expected_result_1x2 = 3 * 3 + 3 * 5 + 7 * 3 + 7 * 5 + 11 * 3 + 11 * 5;
      expected_result = expected_result_1x2 * 13 + expected_result_1x2 * 3 + expected_result_1x2 * 23;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.nextByRange(function(range, arrays) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.ranges[0].getItem(arrays[0]) * range.ranges[1].getItem(arrays[1]) * range.ranges[2].getItem(arrays[2]);
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      it("should calculate the correct result with batch size 4", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 4);
        while (!iterator.nextByRange(function(range, arrays) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.ranges[0].getItem(arrays[0]) * range.ranges[1].getItem(arrays[1]) * range.ranges[2].getItem(arrays[2]);
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      return it("should calculate the correct result with batch size greater than the number of elements", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], test_array1.length * test_array2.length + 5);
        while (!iterator.nextByRange(function(range, arrays) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.ranges[0].getItem(arrays[0]) * range.ranges[1].getItem(arrays[1]) * range.ranges[2].getItem(arrays[2]);
              _results.push(range.step());
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
    describe("checking element counts using step()", function() {
      it("should count once for each element in the arrays", function() {
        var iterator, range, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      it("should count once for each element in the arrays with batch size 2", function() {
        var iterator, range, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 2);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === total_count).toBeTruthy();
      });
      return it("should count once for each element in the arrays with batch size 3 and an odd number of elements", function() {
        var iterator, range, test_array1, test_array2, test_array3, test_count, total_count;
        test_array1 = [3, 7, 11];
        test_array2 = [3, 5];
        test_array3 = [13, 3, 23];
        total_count = test_array1.length * test_array2.length * test_array3.length;
        test_count = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 3);
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
    return describe("checking results match using step()", function() {
      var expected_result, expected_result_1x2, test_array1, test_array2, test_array3, total_count;
      test_array1 = [3, 7, 11];
      test_array2 = [3, 5];
      test_array3 = [13, 3, 23];
      total_count = test_array1.length * test_array2.length * test_array3.length;
      expected_result_1x2 = 3 * 3 + 3 * 5 + 7 * 3 + 7 * 5 + 11 * 3 + 11 * 5;
      expected_result = expected_result_1x2 * 13 + expected_result_1x2 * 3 + expected_result_1x2 * 23;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 1);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += test_array1[range.ranges[0].index] * test_array2[range.ranges[1].index] * test_array3[range.ranges[2].index];
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      it("should calculate the correct result with batch size 4", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], 4);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += test_array1[range.ranges[0].index] * test_array2[range.ranges[1].index] * test_array3[range.ranges[2].index];
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      return it("should calculate the correct result with batch size greater than the number of elements", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new Background.ArrayIterator_xN([test_array1, test_array2, test_array3], test_array1.length * test_array2.length + 5);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += test_array1[range.ranges[0].index] * test_array2[range.ranges[1].index] * test_array3[range.ranges[2].index];
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
  });
} catch (error) {
  alert("Background.ArrayIterator_xN specs failed: '" + error + "'");
}