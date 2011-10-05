try
  describe("BGArrayIterator_x2", ->
    ##############################
    # nextByItems
    ##############################
    describe("checking element counts in nextByItems", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],2)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size greater than the number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],test_array1.length*test_array2.length+5)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking element values match in nextByItems", ->
      it("should refer to the correct elements in nextByItems batch size 1", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByItems((items)->
          index1 = Math.floor(test_count/test_array2.length)
          index2 = test_count%test_array2.length
          expect(items[0] == test_array1[index1]).toBeTruthy()
          expect(items[1] == test_array2[index2]).toBeTruthy()
          test_count++
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByItems batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.nextByItems((items)->
          index1 = Math.floor(test_count/test_array2.length)
          index2 = test_count%test_array2.length
          expect(items[0] == test_array1[index1]).toBeTruthy()
          expect(items[1] == test_array2[index2]).toBeTruthy()
          test_count++
        ))
          no_op=true
      )
    )
    describe("checking results match in nextByItems", ->
      test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
      total_count = test_array1.length * test_array2.length
      expected_result = 1*1 + 1*2 + 1*3 + 1*4 + 1*5 + 2*1 + 2*2 + 2*3 + 2*4 + 2*5 + 3*1 + 3*2 + 3*3 + 3*4 + 3*5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],4)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],test_array1.length*test_array2.length+5)
        while(not iterator.nextByItems((items)->
          test_result += items[0]*items[1]
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
    )

    ##############################
    # nextByCombinations
    ##############################
    describe("checking element counts in nextByCombinations", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],2)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.nextByCombinations((combinations)->test_count+=combinations.length))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking results match in nextByCombinations", ->
      test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
      total_count = test_array1.length * test_array2.length
      expected_result = 1*1 + 1*2 + 1*3 + 1*4 + 1*5 + 2*1 + 2*2 + 2*3 + 2*4 + 2*5 + 3*1 + 3*2 + 3*3 + 3*4 + 3*5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1] for combination in combinations
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],4)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1] for combination in combinations
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],test_array1.length*test_array2.length+5)
        while(not iterator.nextByCombinations((combinations)->
          test_result += combination[0]*combination[1] for combination in combinations
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
    )

    ##############################
    # nextByRange
    ##############################
    describe("checking element counts in nextByRange", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],2)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking element values match in nextByRange", ->
      it("should refer to the correct elements in nextByItems batch size 1", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.ranges[0].index == index1).toBeTruthy()
            expect(range.ranges[0].getItem(arrays[0]) == test_array1[index1]).toBeTruthy()
            expect(range.ranges[1].index == index2).toBeTruthy()
            expect(range.ranges[1].getItem(arrays[1]) == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByRange batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.ranges[0].index == index1).toBeTruthy()
            expect(range.ranges[0].getItem(arrays[0]) == test_array1[index1]).toBeTruthy()
            expect(range.ranges[1].index == index2).toBeTruthy()
            expect(range.ranges[1].getItem(arrays[1]) == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
        ))
          no_op=true
      )
    )
    describe("checking results match in nextByRange", ->
      test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
      total_count = test_array1.length * test_array2.length
      expected_result = 1*1 + 1*2 + 1*3 + 1*4 + 1*5 + 2*1 + 2*2 + 2*3 + 2*4 + 2*5 + 3*1 + 3*2 + 3*3 + 3*4 + 3*5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])
            range.step()
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],4)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])
            range.step()
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],test_array1.length*test_array2.length+5)
        while(not iterator.nextByRange((range, arrays)->
          while(not range.isDone())
            test_result += range.ranges[0].getItem(arrays[0])*range.ranges[1].getItem(arrays[1])
            range.step()
        ))
          no_op=true
        expect(test_result == expected_result).toBeTruthy()
      )
    )
    ##############################
    # Manually using step()
    ##############################
    describe("checking element counts using step()", ->
      it("should count once for each element in the arrays", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],2)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the arrays with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
    )
    describe("checking element values match using step()", ->
      it("should refer to the correct elements in nextByItems batch size 1", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.ranges[0].index == index1).toBeTruthy()
            expect(test_array1[range.ranges[0].index] == test_array1[index1]).toBeTruthy()
            expect(range.ranges[1].index == index2).toBeTruthy()
            expect(test_array2[range.ranges[1].index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
      )
      it("should refer to the correct elements in step batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.ranges[0].index == index1).toBeTruthy()
            expect(test_array1[range.ranges[0].index] == test_array1[index1]).toBeTruthy()
            expect(range.ranges[1].index == index2).toBeTruthy()
            expect(test_array2[range.ranges[1].index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
      )
    )
    describe("checking results match using step()", ->
      test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
      total_count = test_array1.length * test_array2.length
      expected_result = 1*1 + 1*2 + 1*3 + 1*4 + 1*5 + 2*1 + 2*2 + 2*3 + 2*4 + 2*5 + 3*1 + 3*2 + 3*3 + 3*4 + 3*5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],4)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new BGArrayIterator_xN([test_array1,test_array2],test_array1.length*test_array2.length+5)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += test_array1[range.ranges[0].index]*test_array2[range.ranges[1].index]
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
    )
  )

catch error
  alert("BGArrayIterator_xN specs failed: '#{error}'")