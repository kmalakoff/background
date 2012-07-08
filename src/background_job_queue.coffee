class Background.JobQueue extends Background._JobContainer

  constructor: (frequency) ->
    super(frequency)
    @current_job = null;

  _doTick: ->
    # get a new job
    unless @current_job

      # no jobs, wait for next push
      unless @jobs.length
        @_waitForJobs()
        return

      # get next job
      @current_job = @jobs.shift()

    # done
    if @current_job.run()
      @current_job.destroy(false)
      @current_job = null

  push: (functions) ->
    @_appendJob.apply(this, arguments)

  _doDestroy: ->
    # destroy the current job
    (@current_job.destroy(true); @current_job = null) if @current_job
    super()
