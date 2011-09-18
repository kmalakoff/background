try {
  describe("BGArrayIterator", function() {
    describe("checking element counts in nextByItem", function() {
      it("should count once for each element in the array", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.nextByItem(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 2);
        while (!iterator.nextByItem(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        while (!iterator.nextByItem(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size greater than the number of elements", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, test_array.length + 5);
        while (!iterator.nextByItem(function() {
            return test_count++;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
    });
    describe("checking element values match in nextByItem", function() {
      it("should refer to the correct elements in nextByItem batch size 1", function() {
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        _results = [];
        while (!iterator.nextByItem(function(item) {
            expect(item === test_array[test_count]).toBeTruthy();
            return test_count++;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
      return it("should refer to the correct elements in nextByItem batch size 3", function() {
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        _results = [];
        while (!iterator.nextByItem(function(item) {
            expect(item === test_array[test_count]).toBeTruthy();
            return test_count++;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
    });
    describe("checking element counts in nextBySlice", function() {
      it("should count once for each element in the array", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_count++);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 2);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_count++);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_count++);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
    });
    describe("checking element values match in nextBySlice", function() {
      it("should refer to the correct elements in nextByItem batch size 1", function() {
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        _results = [];
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results2;
            _results2 = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results2.push((function(item) {
                expect(item === test_array[test_count]).toBeTruthy();
                return test_count++;
              })(item));
            }
            return _results2;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
      return it("should refer to the correct elements in nextBySlice batch size 3", function() {
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        _results = [];
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results2;
            _results2 = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results2.push((function(item) {
                expect(item === test_array[test_count]).toBeTruthy();
                return test_count++;
              })(item));
            }
            return _results2;
          })) {
          _results.push(no_op = true);
        }
        return _results;
      });
    });
    describe("checking results match in nextBySlice", function() {
      var expected_result, test_array, test_count;
      test_array = [1, 2, 3, 4, 5];
      test_count = 0;
      expected_result = 1 + 2 + 3 + 4 + 5;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_result += item);
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
        iterator = new BGArrayIterator(test_array, 4);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_result += item);
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
        iterator = new BGArrayIterator(test_array, test_array.length + 5);
        while (!iterator.nextBySlice(function(slice) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = slice.length; _i < _len; _i++) {
              item = slice[_i];
              _results.push(test_result += item);
            }
            return _results;
          })) {
          no_op = true;
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
    describe("checking element counts in nextByRange", function() {
      it("should count once for each element in the array", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
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
        return expect(test_count === test_array.length).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 2);
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
        return expect(test_count === test_array.length).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, no_op, test_array, test_count;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
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
        return expect(test_count === test_array.length).toBeTruthy();
      });
    });
    describe("checking element values match in nextByRange", function() {
      it("should refer to the correct elements in nextByItem batch size 1", function() {
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        _results = [];
        while (!iterator.nextByRange(function(range, array) {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              expect(range.getItem(array) === test_array[test_count]).toBeTruthy();
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
        var iterator, no_op, test_array, test_count, _results;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        _results = [];
        while (!iterator.nextByRange(function(range, array) {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              expect(range.getItem(array) === test_array[test_count]).toBeTruthy();
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
    describe("checking results match in nextByRange", function() {
      var expected_result, test_array, test_count;
      test_array = [1, 2, 3, 4, 5];
      test_count = 0;
      expected_result = 1 + 2 + 3 + 4 + 5;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, no_op, test_result;
        test_result = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.nextByRange(function(range, array) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.getItem(array);
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
        iterator = new BGArrayIterator(test_array, 4);
        while (!iterator.nextByRange(function(range, array) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.getItem(array);
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
        iterator = new BGArrayIterator(test_array, test_array.length + 5);
        while (!iterator.nextByRange(function(range, array) {
            var _results;
            _results = [];
            while (!range.isDone()) {
              test_result += range.getItem(array);
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
      it("should count once for each element in the array", function() {
        var iterator, range, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      it("should count once for each element in the array with batch size 2", function() {
        var iterator, range, test_array, test_count;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 2);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
      return it("should count once for each element in the array with batch size 3 and an odd number of elements", function() {
        var iterator, range, test_array, test_count;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_count++;
            range.step();
          }
        }
        return expect(test_count === test_array.length).toBeTruthy();
      });
    });
    describe("checking element values match using step()", function() {
      it("should refer to the correct elements in nextByItem batch size 1", function() {
        var iterator, range, test_array, test_count, _results;
        test_array = [1, 2, 3, 4];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 1);
        _results = [];
        while (!iterator.isDone()) {
          range = iterator.step();
          _results.push((function() {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              expect(range.getItem(test_array) === test_array[test_count]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })());
        }
        return _results;
      });
      return it("should refer to the correct elements in step batch size 3", function() {
        var iterator, range, test_array, test_count, _results;
        test_array = [1, 2, 3, 4, 5];
        test_count = 0;
        iterator = new BGArrayIterator(test_array, 3);
        _results = [];
        while (!iterator.isDone()) {
          range = iterator.step();
          _results.push((function() {
            var _results2;
            _results2 = [];
            while (!range.isDone()) {
              expect(range.getItem(test_array) === test_array[test_count]).toBeTruthy();
              range.step();
              _results2.push(test_count++);
            }
            return _results2;
          })());
        }
        return _results;
      });
    });
    return describe("checking results match using step()", function() {
      var expected_result, test_array, test_count;
      test_array = [1, 2, 3, 4, 5];
      test_count = 0;
      expected_result = 1 + 2 + 3 + 4 + 5;
      it("should calculate the correct result with batch size 1", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new BGArrayIterator(test_array, 1);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += range.getItem(test_array);
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      it("should calculate the correct result with batch size 4", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new BGArrayIterator(test_array, 4);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += range.getItem(test_array);
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
      return it("should calculate the correct result with batch size greater than the number of elements", function() {
        var iterator, range, test_result;
        test_result = 0;
        iterator = new BGArrayIterator(test_array, test_array.length + 5);
        while (!iterator.isDone()) {
          range = iterator.step();
          while (!range.isDone()) {
            test_result += range.getItem(test_array);
            range.step();
          }
        }
        return expect(test_result === expected_result).toBeTruthy();
      });
    });
  });
} catch (error) {
  alert("BGArrayIterator specs failed: '" + error + "'");
}