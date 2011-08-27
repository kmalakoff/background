try
  describe("BGArrayIterator", ->
    ##############################
    # next_by_item
    ##############################
    describe("checking element counts in next_by_item", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_item(->test_count++))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,2)
        while(not iterator.next_by_item(->test_count++))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,3)
        while(not iterator.next_by_item(->test_count++)) 
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in next_by_item", ->
      it("should refer to the correct elements in next_by_item batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_item((entry)->
          expect(entry == test_array[test_count]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
      it("should refer to the correct elements in next_by_item batch size 3", ->
        test_array = [1,2,3,4, 5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_item((entry)->
          expect(entry == test_array[test_count]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
    )
    ##############################
    # next_by_slice
    ##############################
    describe("checking element counts in next_by_slice", ->
      it("should count once for each element in the array", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_slice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,2)
        while(not iterator.next_by_slice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,3)
        while(not iterator.next_by_slice((slice)->test_count++ for entry in slice))
          no_op=true
        expect(test_count==test_array.length).toBeTruthy()
      )
    )
    describe("checking element values match in next_by_slice", ->
      it("should refer to the correct elements in next_by_item batch size 1", ->
        test_array = [1,2,3,4]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_slice((slice)->
          for entry in slice
            do (entry) ->
              expect(entry == test_array[test_count]).toBeTruthy()
              test_count++ 
        ))
          no_op=true
      )
      it("should refer to the correct elements in next_by_item batch size 3", ->
        test_array = [1,2,3,4,5]
        test_count = 0
        iterator = new BGArrayIterator(test_array,1)
        while(not iterator.next_by_slice((slice)->
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