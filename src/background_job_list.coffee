class Background.JobList extends Background._JobContainer

  constructor: (frequency) ->
    super(frequency)

  _doTick: ->
    # no jobs, wait for next append
    unless @jobs.length
      @_waitForJobs()
      return

    # process all jobs -> copy the jobs in case new ones are appended mid-processing (newly appended jobs will be processed next tick)
    jobs = @jobs.slice()
    for job in jobs
      continue unless job.run()

      # done so destroy and remove from list
      @jobs.splice(@jobs.indexOf(job), 1)
      job.destroy(false)
    return

  append: (functions) ->
    @_appendJob.apply(this, arguments)
