class BGArrayIterator extends _BGArrayIterator

  constructor: (@array, batch_length) ->
    BGASSERT(@array, "array required")
    @reset()
    super(batch_length, @array.length, new BGRange(0, batch_length))

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItem: (fn) ->
    @step()
    while(not @current_range.isDone())
      fn(@array[@current_range.index], @current_range.index, @array)
      @current_range.step()
    return @isDone()

  # iterates passing (array_slice, range, array) once per call (but you should only need array_slice)
  nextBySlice: (fn) ->
    @step()
    fn(@current_range.sliceArray(@array), @current_range, @array) if(not @current_range.isDone())
    @current_range.stepToEnd()
    return @isDone()

  # iterates passing (range, array) once per call
  nextByRange: (fn) ->
    @step()
    fn(@current_range.clone(), @array) if(not @current_range.isDone())
    @current_range.stepToEnd()
    return @isDone()

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
