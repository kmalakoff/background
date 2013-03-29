try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.Job", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # new Background.Job()
    ##############################
    describe("new Background.Job()", ->
      it("the legacy task interface should exist", ->
        start = ->
        tick = ->
        end = ->

        job = new Background.Job(start, tick, end)
        expect(job.functions.start).toEqual(start)
        expect(job.functions.tick).toEqual(tick)
        expect(job.functions.finish).toEqual(end)

        queue = new Background.JobQueue(1000)
        queue.push(start, tick, end)
        job = queue.jobs[0]
        expect(job.functions.start).toEqual(start)
        expect(job.functions.tick).toEqual(tick)
        expect(job.functions.finish).toEqual(end)

        list = new Background.JobList(1000)
        list.append(start, tick, end)
        job = list.jobs[0]
        expect(job.functions.start).toEqual(start)
        expect(job.functions.tick).toEqual(tick)
        expect(job.functions.finish).toEqual(end)
      )
      "Missing task functions"

      it("should require a tick", ->
        expect(->new Background.Job(null)).toThrow('Missing task functions')
        expect(->new Background.Job(null)).toThrow('Missing task functions')
      )
    )
  )

catch error
  alert("Background.Job specs failed: '#{error}'")