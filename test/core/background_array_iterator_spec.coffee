try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.ArrayIterator", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # nextByItem
    ##############################
    describe("checking element counts in nextByItem", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextByItem(->test_count++))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,2)
        while(not iterator.nextByItem(->test_count++))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextByItem(->test_count++))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size greater than the number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,test_array.length+5)
        while(not iterator.nextByItem(->test_count++))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in nextByItem", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextByItem((item)->
          expect(item == test_array[test_count]).toBeTruthy()
          test_count++
        ))
          return
        return
      )
      it("should refer to the correct elements in nextByItem batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextByItem((item)->
          expect(item == test_array[test_count]).toBeTruthy()
          test_count++
        ))
          return
        return
      )
    )
    ##############################
    # nextBySlice
    ##############################
    describe("checking element counts in nextBySlice", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->test_count++ for item in slice))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,2)
        while(not iterator.nextBySlice((slice)->test_count++ for item in slice))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextBySlice((slice)->test_count++ for item in slice))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in nextBySlice", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->
          for item in slice
            expect(item == test_array[test_count]).toBeTruthy()
            test_count++
          return
        ))
          return
        return
      )
      it("should refer to the correct elements in nextBySlice batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextBySlice((slice)->
          for item in slice
            expect(item == test_array[test_count]).toBeTruthy()
            test_count++
          return
        ))
          return
        return
      )
    )
    describe("checking results match in nextBySlice", ->
      test_array = [1,2,3,4,5]
      test_count = 0
      expected_result = 1 + 2 + 3 + 4 + 5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->
          test_result += item for item in slice
          return
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,4)
        while(not iterator.nextBySlice((slice)->
          test_result += item for item in slice
          return
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,test_array.length+5)
        while(not iterator.nextBySlice((slice)->
          test_result += item for item in slice
          return
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
    )

    ##############################
    # nextByRange
    ##############################
    describe("checking element counts in nextByRange", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,2)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextByRange((range)->
          while(not range.isDone())
            test_count++
            range.step()
        ))
          return
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in nextByRange", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextByRange((range, array)->
          while(not range.isDone())
            expect(range.getItem(array) == test_array[test_count]).toBeTruthy()
            range.step()
            test_count++
        ))
          return
        return
      )
      it("should refer to the correct elements in nextByRange batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.nextByRange((range, array)->
          while(not range.isDone())
            expect(range.getItem(array) == test_array[test_count]).toBeTruthy()
            range.step()
            test_count++
        ))
          return
        return
      )
    )
    describe("checking results match in nextByRange", ->
      test_array = [1,2,3,4,5]
      test_count = 0
      expected_result = 1 + 2 + 3 + 4 + 5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.nextByRange((range, array)->
          while(not range.isDone())
            test_result += range.getItem(array)
            range.step()
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,4)
        while(not iterator.nextByRange((range, array)->
          while(not range.isDone())
            test_result += range.getItem(array)
            range.step()
        ))
          return
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,test_array.length+5)
        while(not iterator.nextByRange((range, array)->
          while(not range.isDone())
            test_result += range.getItem(array)
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
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,2)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_count++
            range.step()
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match using step()", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            expect(range.getItem(test_array) == test_array[test_count]).toBeTruthy()
            range.step()
            test_count++
        return
      )
      it("should refer to the correct elements in step batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new Background.ArrayIterator(test_array,3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            expect(range.getItem(test_array) == test_array[test_count]).toBeTruthy()
            range.step()
            test_count++
        return
      )
    )
    describe("checking results match using step()", ->
      test_array = [1,2,3,4,5]
      test_count = 0
      expected_result = 1 + 2 + 3 + 4 + 5

      it("should calculate the correct result with batch size 1", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += range.getItem(test_array)
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size 4", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,4)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += range.getItem(test_array)
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
      it("should calculate the correct result with batch size greater than the number of elements", ->
        test_result = 0
        iterator = new Background.ArrayIterator(test_array,test_array.length+5)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone())
            test_result += range.getItem(test_array)
            range.step()
        expect(test_result == expected_result).toBeTruthy()
      )
    )
  )

catch error
  alert("Background.ArrayIterator specs failed: '#{error}'")