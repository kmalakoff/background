class BGRange_xN

  constructor: (@ranges, @batch_length) -> 
    BGASSERT(@ranges and @batch_length, "missing parameters or invalid batch length")
    @batch_index = 0
    return this

  isDone: -> return (@batch_index>=@batch_length)
  step: -> 
    @batch_index++
    index = @ranges.length - 1
    while index >= 0
      current_range = @ranges[index]
      current_range.step()
      return this if not current_range.isDone() # done an iteration
      current_range.reset()
      index--
    # done iterating over all the ranges
    @_setIsDone()
    return null
  getItems: (arrays) -> 
    items = []
    items.push(array[@ranges[index].index]) for index, array of arrays
    return items
  getCombinations: (arrays) -> 
    combinations = []
    while not @isDone()
      combination = []
      combination.push(range.getItem(arrays[index])) for index, range of @ranges
      combinations.push(combination)
      @step()
    return combinations

  _setIsDone: -> 
    @batch_index = -1; @batch_length = -1
    return this
  _addBatchLength: (batch_length) -> 
    BGASSERT(batch_length, "missing parameters")
    @batch_index = 0
    @batch_length = batch_length
    return this

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
