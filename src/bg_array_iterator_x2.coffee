class BGArrayIterator_x2

  constructor: (@array1, @array2, @batch_length) ->
    BGASSERT(@array1 and @array2 and @batch_length, "array and positive integer batch length required")
    @array1_length = @array1.length
    @array2_length = @array2.length
    @array_combination_count = @array1_length*@array2_length
    @reset()
    @current_range = new BGRange_x2(@array2_length, @batch_length)

  reset: ->
    @batch_index = 0
    @batch_count = Math.floor(@array_combination_count/@batch_length) + 1

  # checks whether all the steps are done
  isDone: -> return (@batch_index >= @batch_count) 
  updateCurrentRange: -> 
    index = (@batch_index-1) * @batch_length
    excluded_boundary = index + @batch_length
    excluded_boundary = @array_combination_count if(excluded_boundary>@array_combination_count)

    return @current_range.setIsDone() if(index>=excluded_boundary)
    index1 = Math.floor(index/@array2_length)
    excluded_boundary1 = Math.floor(excluded_boundary/@array2_length)+1
    index2 = index%@array2_length
    excluded_boundary2 = @array2_length
    @current_range.set(excluded_boundary-index, new BGRange(index1, excluded_boundary1), new BGRange(index2, excluded_boundary2))
    return @current_range

  # updates the iteration and returns a range {index: , excluded_boundary: }
  step: -> 
    return @current_range.setIsDone() if @isDone()
    @batch_index++
    return @updateCurrentRange()

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItems: (fn) ->
    # send item by item
    @step()
    while(not @current_range.isDone())
      fn(@array1[@current_range.range1.index], @array2[@current_range.range2.index], @current_range, @array1, @array2)
      @current_range.step()
    return @isDone()

  # iterates passing BGRange_x2 once per call
  nextByRange: (fn) ->
    # send the range and array 
    @step()
    fn(@current_range, @array1, @array2) if(not @current_range.isDone())
    return @isDone()

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
