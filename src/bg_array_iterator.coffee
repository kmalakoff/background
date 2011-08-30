class BGArrayIterator

  constructor: (array, @batch_length) ->
    @array = array
    @array_length = @array.length
    @batch_index = 0
    @batch_count = Math.floor(@array_length/@batch_length) + 1

  # checks whether all the steps are done
  isDone: -> return (@batch_index >= @batch_count) 
  getCurrentRange: -> 
    range = {index: (@batch_index-1)*@batch_length}
    range.length = if((range.index+@batch_length)>@array_length) then (@array_length-range.index) else @batch_length
    return range 

  # updates the iteration and returns a range {index: , length: }. Check length==0 to see if you are done
  step: -> 
    return {index: @array_length, length: 0} if @isDone()
    @batch_index++
    return @getCurrentRange()

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItem: (fn) ->
    range = @step()
    return true if(range.length==0) # done

    # send item by item
    index_bound = range.index+range.length
    while(range.index<index_bound)
      fn(@array[range.index], range.index, @array)
      range.index++
    
    return (index_bound>=@array_length) # check if done

  # iterates passing (array_slice, range, array) once per call (but you should only need array_slice)
  nextBySlice: (fn) ->
    range = @step()
    return true if(range.length==0) # done

    # send a slice of the array
    index_bound = range.index+range.length
    fn(@array.slice(range.index, index_bound), range, @array)

    return (index_bound>=@array_length) # check if done

  # iterates passing ({index: , length: }, array) once per call
  nextByRange: (fn) ->
    range = @step()
    return true if(range.length==0) # done

    # send the range and array 
    index_bound = range.index+range.length
    fn(range, @array)

    return (index_bound>=@array_length) # check if done

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
