try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.ArrayIterator_x3", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # nextByItems
    ##############################
    describe("checking element counts in nextByItems", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByItems(->test_count++))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],2)
        while(not iterator.nextByItems(->test_count++))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)
        while(not iterator.nextByItems(->test_count++))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size greater than the number of elements", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],test_array1.length*test_array2.length+5)
        while(not iterator.nextByItems(->test_count++))
          return
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking results match in nextByItems", ->
      test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
      total_count = test_array1.length * test_array2.length * test_array3.length
      expected_result_1x2 = 3*3 + 3*5 + 7*3 + 7*5 + 11*3 + 11*5
      expected_result = expected_result_1x2*13 + expected_result_1x2*3 + expected_result_1x2*23

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]*items[2]
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],4)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]*items[2]
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],test_array1.length*test_array2.length+5)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]*items[2]
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
    )

    ##############################
    # nextByCombinations
    ##############################
    describe("checking element counts in nextByCombinations", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],2)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          return
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking results match in nextByCombinations", ->
      test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
      total_count = test_array1.length * test_array2.length * test_array3.length
      expected_result_1x2 = 3*3 + 3*5 + 7*3 + 7*5 + 11*3 + 11*5
      expected_result = expected_result_1x2*13 + expected_result_1x2*3 + expected_result_1x2*23

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1]*combination[2] for combination in combinations
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],4)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1]*combination[2] for combination in combinations
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],test_array1.length*test_array2.length+5)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1]*combination[2] for combination in combinations
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
    )

    ##############################
    # nextByRange
    ##############################
    describe("checking element counts in nextByRange", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],2)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking results match in nextByRange", ->
      test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
      total_count = test_array1.length * test_array2.length * test_array3.length
      expected_result_1x2 = 3*3 + 3*5 + 7*3 + 7*5 + 11*3 + 11*5
      expected_result = expected_result_1x2*13 + expected_result_1x2*3 + expected_result_1x2*23

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])*range.ranges[2].getItem(arrays[2])
            range.step()
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],4)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])*range.ranges[2].getItem(arrays[2])
            range.step()
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],test_array1.length*test_array2.length+5)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])*range.ranges[2].getItem(arrays[2])
            range.step()
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
    )
    ##############################
    # Manually using step()
    ##############################
    describe("checking element counts using step()", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],2)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
        total_count = test_array1.length * test_array2.length * test_array3.length
        test_count = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking results match using step()", ->
      test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
      total_count = test_array1.length * test_array2.length * test_array3.length
      expected_result_1x2 = 3*3 + 3*5 + 7*3 + 7*5 + 11*3 + 11*5
      expected_result = expected_result_1x2*13 + expected_result_1x2*3 + expected_result_1x2*23

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]*test_array3[range.ranges[2].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],4)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]*test_array3[range.ranges[2].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],test_array1.length*test_array2.length+5)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]*test_array3[range.ranges[2].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
    )
  )

catch error
  alert("Background.ArrayIterator_xN specs failed: '#{error}'")