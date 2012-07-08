class Background.ArrayIterator extends Background._ArrayIterator

  constructor: (@array, batch_length) ->
    throw "Background.ArrayIterator: missing array" unless @array
    @reset()
    excluded_boundary = if batch_length < @array.length then batch_length else (if @array.length then @array.length else 1)
    super(batch_length, @array.length, new Background.Range(0, excluded_boundary))

  # iterates passing (item, index, array) for each element per call (but you should only need item)
  nextByItem: (fn) ->
    @step()
    while(not @current_range.isDone())
      fn(@current_range.getItem(@array), @current_range.index, @array)
      @current_range.step()
    return @isDone()

  # iterates passing (array_slice, range, array) once per call (but you should only need array_slice)
  nextBySlice: (fn) ->
    @step()
    fn(@current_range.getSlice(@array), @current_range, @array) unless @current_range.isDone()
    @current_range._stepToEnd()
    return @isDone()

  # iterates passing (range, array) once per call
  nextByRange: (fn) ->
    @step()
    fn(@current_range, @array) unless @current_range.isDone()
    return @isDone()
