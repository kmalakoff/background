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
        job = new Background.Job(1, 2, 3)
        expect(job.functions.start).toEqual(1)
        expect(job.functions.tick).toEqual(2)
        expect(job.functions.finish).toEqual(3)

        queue = new Background.JobQueue(1000)
        queue.push(1, 2, 3)
        job = queue.jobs[0]
        expect(job.functions.start).toEqual(1)
        expect(job.functions.tick).toEqual(2)
        expect(job.functions.finish).toEqual(3)

        list = new Background.JobList(1000)
        list.append(1, 2, 3)
        job = list.jobs[0]
        expect(job.functions.start).toEqual(1)
        expect(job.functions.tick).toEqual(2)
        expect(job.functions.finish).toEqual(3)
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