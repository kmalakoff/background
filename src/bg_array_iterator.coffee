class BGArrayIterator

  constructor: (@array, @batch_length) ->
    BGASSERT(@array and @batch_length, "array and positive integer batch length required")
    @array_length = @array.length
    @batch_index = 0
    @batch_count = Math.floor(@array_length/@batch_length) + 1

  # checks whether all the steps are done
  isDone: -> return (@batch_index >= @batch_count) 
  getCurrentRange: -> 
    range = {index: (@batch_index-1)*@batch_length}
    range.excluded_boundary = (range.index+@batch_length)
    range.excluded_boundary = @array_length if(range.excluded_boundary>@array_length)
    return range 

  # updates the iteration and returns a range {index: , excluded_boundary: }
  step: -> 
    return {index: @array_length, excluded_boundary: @array_length} if @isDone()
    @batch_index++
    return @getCurrentRange()

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItem: (fn) ->
    # send item by item
    range = @step()
    while(range.index<range.excluded_boundary)
      fn(@array[range.index], range.index, @array)
      range.index++
    
    return @isDone()

  # iterates passing (array_slice, range, array) once per call (but you should only need array_slice)
  nextBySlice: (fn) ->
    # send a slice of the array
    range = @step()
    if(range.index<range.excluded_boundary)
      fn(@array.slice(range.index, range.excluded_boundary), range, @array)

    return @isDone()

  # iterates passing ({index: , excluded_boundary: }, array) once per call
  nextByRange: (fn) ->
    # send the range and array 
    range = @step()
    if(range.index<range.excluded_boundary)
      fn(range, @array)

    return @isDone()

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
