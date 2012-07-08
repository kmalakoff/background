class Background.ArrayIterator_xN extends Background._ArrayIterator

  constructor: (@arrays, batch_length) ->
    throw "Background.ArrayIterator_xN: missing arrays" unless @arrays
    array_combination_count = 1
    array_combination_count *= array.length for array in @arrays
    @reset()
    ranges = []; ranges.push(new Background.Range(0,array.length)) for array in @arrays
    super(batch_length, array_combination_count, new Background.Range_xN(ranges, batch_length))

  # iterates passing (items, range, arrays) for each element per call (but you should only need item)
  nextByItems: (fn) ->
    @step()
    while(not @current_range.isDone())
      fn(@current_range.getItems(@arrays), @current_range, @arrays)
      @current_range.step()
    return @isDone()

  # iterates passing (array_combinations, range, arrays) once per call (but you should only need array_combinations)
  nextByCombinations: (fn) ->
    @step()
    fn(@current_range.getCombinations(@arrays), @current_range, @array) unless @current_range.isDone()
    return @isDone()

  # iterates passing range and arrays once per call
  nextByRange: (fn) ->
    @step()
    fn(@current_range, @arrays) unless @current_range.isDone()
    return @isDone()
