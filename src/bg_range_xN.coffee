class BGRange_xN

  constructor: (@ranges, @batch_length) -> 
    BGASSERT(@ranges and @batch_length, "missing parameters or invalid batch length")
    @batch_index = 0
    return this
  clone: -> 
    ranges = []; ranges.push(range.clone()) for range in @ranges
    return new BGRange_xN(ranges, @batch_length)

  setIsDone: -> 
    @batch_index = -1; @batch_length = -1
    return this
  addBatchLength: (batch_length) -> 
    BGASSERT(batch_length, "missing parameters")
    @batch_index = 0
    @batch_length = batch_length
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
    @setIsDone()
    return null
  stepToEnd: -> 
    while not @isDone()
      @step()

  @isARange_xN: (range) ->
    return (range and (typeof range == 'object') and ('constructor' of range) and ('name' of range.constructor) and (range.constructor.name == 'BGRange_xN'))

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
