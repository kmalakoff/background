class BGRange_x2

  constructor: (@range2_length, @batch_length, @range1, @range2) -> 
    BGASSERT(@range2_length and @batch_length, "a BGRange_x2 requires all of the parameters")
    @batch_index = 0
    return this

  setIsDone: -> 
    @batch_index = -1; @batch_length = -1
    return this
  set: (batch_length_or_range, range1, range2, range2_length) ->
    if(BGRange_x2.isARange_x2(batch_length_or_range))
      @range2_length = batch_length_or_range.range2_length
      @batch_length = batch_length_or_range.batch_length
      @range1 = batch_length_or_range.range1
      @range2 = batch_length_or_range.range2
    else
      @batch_length = batch_length_or_range
      @range1 = range1 if range1
      @range2 = range2 if range2
      @range2_length = range2_length if range2_length
    @batch_index = 0

  step: -> 
    @batch_index++
    return null if(@batch_index>=@batch_length) 

    @range2.step()
    if @range2.isDone()
      range2_excluded_boundary = @batch_length - @batch_index
      range2_excluded_boundary = @range2_length if(range2_excluded_boundary>@range2_length)
      @range2.set(0, range2_excluded_boundary)
      @range1.step()
  isDone: -> return (@batch_index>=@batch_length)

  @isARange_x2: (range) ->
    return (range and (typeof range == 'object') and ('constructor' of range) and ('name' of range.constructor) and (range.constructor.name == 'BGRange_x2'))

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
