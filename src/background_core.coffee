###
  background.js 0.2.2
  (c) 2011, 2012 Kevin Malakoff.
  Mixin is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/background/blob/master/LICENSE
  Dependencies: None.
###

root = @

# export or create Background namespace
Background = @Background = if (typeof(exports) != 'undefined') then exports else {}
Background.VERSION = '0.2.2'

class Background._JobContainer

  constructor: (@frequency) ->
    @jobs = [];
    @timeout = 0;
    @being_destroyed = false

  destroy:      -> @being_destroyed = true
  isDestroyed: -> return (@being_destroyed or @destroyed)

  isEmpty: -> return (@jobs.length == 0)
  tick: ->
    # we are being destroyed
    (@_doDestroy(); return) if @being_destroyed

    # let the container process the list
    @_doTick()

    # we are being destroyed
    (@_doDestroy(); return) if @being_destroyed

  clear: ->
    # destroy the jobs
    while(job = @jobs.shift())
      job.destroy(true)

    # clear the timer
    if @timeout
      root.clearInterval(@timeout)
      @timeout = null

  _appendJob: (init_fn_or_job, run_fn, destroy_fn) ->
    throw new Error("Background._JobContainer._appendJob: trying to append a job to a destroyed container") if @isDestroyed()

    if Background.Job.isAJob(init_fn_or_job)
      job = init_fn_or_job
    else
      job = new Background.Job(init_fn_or_job, run_fn, destroy_fn)

    # add the job and set a timeout if needed
    @jobs.push(job)
    @timeout = root.setInterval((=> @tick()), @frequency) if not @timeout

  _waitForJobs: ->
    if @timeout
      root.clearInterval(@timeout)
      @timeout = null

  _doDestroy: ->
    throw new Error("Background._JobContainer.destroy: destroy state is corrupted") if not @being_destroyed or @is_destroyed
    @is_destroyed = true

    # clear the jobs
    @clear()

class Background._ArrayIterator

  constructor: (@batch_length, @total_count, @current_range) ->
    throw new Error("Background._ArrayIterator: parameters invalid") if not @batch_length or (@total_count==undefined) or not @current_range
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

