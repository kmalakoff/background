###
  background.js 0.3.3
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/background/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
###

root = @

# export or create Background namespace
Background = @Background = if (typeof(exports) != 'undefined') then exports else {}
Background.VERSION = '0.3.3'

legacyToLatestTask = ->
  functions = {}
  functions.start = arguments[0] if arguments.length > 0
  functions.tick = arguments[1] if arguments.length > 1
  functions.finish = arguments[2] if arguments.length > 2
  return functions

class Background._JobContainer

  constructor: (@frequency) ->
    @jobs = [];
    @interval = 0;
    @in_destroy = false

  destroy:      -> @in_destroy = true
  isDestroyed: -> return (@in_destroy or @destroyed)

  isEmpty: -> return (@jobs.length == 0)
  tick: ->
    # we are being destroyed
    (@_doDestroy() unless this.is_destroyed; return) if @in_destroy

    # let the container process the list
    @_doTick()

    # we are being destroyed
    (@_doDestroy() unless this.is_destroyed; return) if @in_destroy

  clear: ->
    # destroy the jobs
    while(job = @jobs.shift())
      job.destroy(true)

    # clear the timer
    if @interval
      root.clearInterval(@interval)
      @interval = null

  _appendJob: (functions) ->
    functions = legacyToLatestTask.apply(null, arguments) if (arguments.length>1)
    throw "Trying to append a job to a destroyed container" if @isDestroyed()

    if (functions instanceof Background.Job)
      job = functions
    else
      job = new Background.Job(functions)

    # add the job and set a interval if needed
    @jobs.push(job)
    @interval = root.setInterval((=> @tick()), @frequency) unless @interval

  _waitForJobs: ->
    if @interval
      root.clearInterval(@interval)
      @interval = null

  _doDestroy: ->
    throw "Destroy state is corrupted" if not @in_destroy or @is_destroyed
    @is_destroyed = true

    # clear the jobs
    @clear()

class Background._ArrayIterator

  constructor: (@batch_length, @total_count, @current_range) ->
    throw "Iterator parameters invalid" if not @batch_length or (@total_count==undefined) or not @current_range
    @reset()

  reset: ->
    @batch_index = -1
    @batch_count = Math.ceil(@total_count/@batch_length)

  # checks whether all the steps are done
  isDone: -> return (@batch_index >= @batch_count-1)
  updateCurrentRange: ->
    index = @batch_index * @batch_length
    excluded_boundary = index + @batch_length
    excluded_boundary = @total_count if (excluded_boundary>@total_count)

    return @current_range._setIsDone() if (index>=excluded_boundary)
    @current_range._addBatchLength(excluded_boundary-index)
    return @current_range

  # updates the iteration and returns a range {index: , excluded_boundary: }
  step: ->
    return @current_range._setIsDone() if @isDone()
    @batch_index++
    return if (@batch_index==0) then @current_range else @updateCurrentRange()

