try
  describe("BGArrayIterator_x2", ->
    ##############################
    # nextByItems
    ##############################
    describe("checking element counts in nextByItems", ->
      it("should count once for each element in the array", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,2)
        while(not iterator.nextByItems(->test_count++))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
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
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.nextByItems((item1, item2)->
          index1 = Math.floor(test_count/test_array2.length)
          index2 = test_count%test_array2.length
          expect(item1 == test_array1[index1]).toBeTruthy()
          expect(item2 == test_array2[index2]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByItems batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
        while(not iterator.nextByItems((item1,item2)->
          index1 = Math.floor(test_count/test_array2.length)
          index2 = test_count%test_array2.length
          expect(item1 == test_array1[index1]).toBeTruthy()
          expect(item2 == test_array2[index2]).toBeTruthy()
          test_count++ 
        ))
          no_op=true
      )
    )

    ##############################
    # nextByRange
    ##############################
    describe("checking element counts in nextByRange", ->
      it("should count once for each element in the array", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.nextByRange((range)->
          while(not range.isDone()) 
            test_count++
            range.step()
        ))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,2)
        while(not iterator.nextByRange((range)->
          while(not range.isDone()) 
            test_count++
            range.step()
        ))
          no_op=true
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
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
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.nextByRange((range, array1, array2)->
          while(not range.isDone()) 
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.range1.index == index1).toBeTruthy()
            expect(test_array1[range.range1.index] == test_array1[index1]).toBeTruthy()
            expect(range.range2.index == index2).toBeTruthy()
            expect(test_array2[range.range2.index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
        ))
          no_op=true
      )
      it("should refer to the correct elements in nextByRange batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
        while(not iterator.nextByRange((range, array1, array2)->
          while(not range.isDone()) 
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.range1.index == index1).toBeTruthy()
            expect(test_array1[range.range1.index] == test_array1[index1]).toBeTruthy()
            expect(range.range2.index == index2).toBeTruthy()
            expect(test_array2[range.range2.index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
        ))
          no_op=true
      )
    )
    ##############################
    # Manually using step()
    ##############################
    describe("checking element counts using step()", ->
      it("should count once for each element in the array", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone()) 
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 2", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,2)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone()) 
            test_count++
            range.step()
        expect(test_count==total_count).toBeTruthy()
      )
      it("should count once for each element in the array with batch size 3 and an odd number of elements", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
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
        iterator = new BGArrayIterator_x2(test_array1,test_array2,1)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone()) 
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.range1.index == index1).toBeTruthy()
            expect(test_array1[range.range1.index] == test_array1[index1]).toBeTruthy()
            expect(range.range2.index == index2).toBeTruthy()
            expect(test_array2[range.range2.index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
      )
      it("should refer to the correct elements in step batch size 3", ->
        test_array1 = [1,2,3]; test_array2 = [1,2,3,4,5]
        total_count = test_array1.length * test_array2.length
        test_count = 0
        iterator = new BGArrayIterator_x2(test_array1,test_array2,3)
        while(not iterator.isDone())
          range = iterator.step()
          while(not range.isDone()) 
            index1 = Math.floor(test_count/test_array2.length)
            index2 = test_count%test_array2.length
            expect(range.range1.index == index1).toBeTruthy()
            expect(test_array1[range.range1.index] == test_array1[index1]).toBeTruthy()
            expect(range.range2.index == index2).toBeTruthy()
            expect(test_array2[range.range2.index] == test_array2[index2]).toBeTruthy()
            range.step()
            test_count++
      )
    )
  )

catch error
  alert("BGArrayIterator_x2 specs failed: '#{error}'")