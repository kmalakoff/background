class BGArrayIterator

  constructor: (array, @batch_size) ->
    @array = array
    @batch_count = Math.floor(@array.length/@batch_size) + 1
    @batch_index = 0
    @array_index = 0

  nextByItem: (fn) ->
    current_batch_count = @array_index + @batch_size
    current_batch_count = @array.length if(current_batch_count > @array.length)

    # send item by item
    while(@array_index<current_batch_count)
      fn(@array[@array_index], @array_index)
      @array_index++
    
    @batch_index++
    return (@batch_index==@batch_count)

  nextBySlice: (fn) ->
    current_batch_count = @batch_size
    current_batch_count = (@array.length-@array_index) if(@array_index + current_batch_count > @array.length)

    # send a slice of the array
    return true if(current_batch_count==0)
    fn(@array.slice(@array_index, @array_index+current_batch_count))

    @array_index += current_batch_count
    @batch_index++
    return (@batch_index==@batch_count)

####################################################
# CommonJS
####################################################
exports.BGArrayIterator = BGArrayIterator if (typeof exports != 'undefined')
