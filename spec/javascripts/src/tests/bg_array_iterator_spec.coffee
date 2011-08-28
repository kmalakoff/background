try
  describe("BGArrayIterator", ->
    ##############################
    # nextByItem
    ##############################
    describe("checking element counts in nextByItem", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextByItem(->test_count++))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,2)
        while(not iterator.nextByItem(->test_count++))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,3)
        while(not iterator.nextByItem(->test_count++)) 
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in nextByItem", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextByItem((entry)->
          expect(entry == test_array[test_count]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByItem batch size 3", ->
        test_array = [1,2,3,4, 5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextByItem((entry)->
          expect(entry == test_array[test_count]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
    )
    ##############################
    # nextBySlice
    ##############################
    describe("checking element counts in nextBySlice", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,2)
        while(not iterator.nextBySlice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,3)
        while(not iterator.nextBySlice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in nextBySlice", ->
      it("should refer to the correct elements in nextByItem batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->
          for entry in slice
            do (entry) ->
              expect(entry == test_array[test_count]).toBeTruthy()
              test_count++ 
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByItem batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.nextBySlice((slice)->
          for entry in slice
            do (entry) ->
              expect(entry == test_array[test_count]).toBeTruthy()
              test_count++ 
        ))
          no_op=true
      )
    )
  )

catch error
  alert("BGArrayIterator specs failed: '#{error}'")