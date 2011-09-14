class BGArrayIterator

  constructor: (@array, @batch_length) ->
    BGASSERT(@array and @batch_length, "array and positive integer batch length required")
    @array_length = @array.length
    @reset()
    @current_range = new BGRange()

  reset: ->
    @batch_index = 0
    @batch_count = Math.floor(@array_length/@batch_length) + 1

  # checks whether all the steps are done
  isDone: -> return (@batch_index >= @batch_count) 
  updateCurrentRange: -> 
    index = (@batch_index-1) * @batch_length
    excluded_boundary = index + @batch_length
    excluded_boundary = @array_length if(excluded_boundary>@array_length)
    return @current_range.set(index, excluded_boundary)

  # updates the iteration and returns a range {index: , excluded_boundary: }
  step: -> 
    return @current_range.setIsDone() if @isDone()
    @batch_index++
    return @updateCurrentRange()

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItem: (fn) ->
    # send item by item
    @step()
    while(not @current_range.isDone())
      fn(@array[@current_range.index], @current_range.index, @array)
      @current_range.step()
    return @isDone()

  # iterates passing (array_slice, range, array) once per call (but you should only need array_slice)
  nextBySlice: (fn) ->
    # send a slice of the array
    @step()
    fn(@current_range.sliceArray(@array), @current_range, @array) if(not @current_range.isDone())
    return @isDone()

  # iterates passing ({index: , excluded_boundary: }, array) once per call
  nextByRange: (fn) ->
    # send the range and array 
    @step()
    fn(@current_range, @array) if(not @current_range.isDone())
    return @isDone()

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
