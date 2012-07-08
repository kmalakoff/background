try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.JobList", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # start
    ##############################
    describe("start is called when expected", ->
      it("should not call start without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        start = jasmine.createSpy("start")
        expect(->job_list.append({
          start: start
          tick: -> return false
        })).not.toThrow()
        expect(start).not.toHaveBeenCalled()
      )
      it("should call start once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        start = jasmine.createSpy("start")
        expect(->job_list.append({
          start: start
          tick: -> return false
        })).not.toThrow()
        job_list.tick()
        expect(start).toHaveBeenCalled()
      )
      it("should call start once for multiple ticks", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        start = jasmine.createSpy("start").andCallFake(->call_count++)
        expect(->job_list.append({
          start: start
          tick: -> return false
        })).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(start).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )

    ##############################
    # tick
    ##############################
    describe("tick is called when expected", ->
      it("should not call tick without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        tick = jasmine.createSpy("tick").andCallFake(->return false)
        expect(->job_list.append(tick)).not.toThrow()
        expect(tick).not.toHaveBeenCalled()
      )
      it("should call tick once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        tick = jasmine.createSpy("tick").andCallFake(->return false)
        expect(->job_list.append(tick)).not.toThrow()
        job_list.tick()
        expect(tick).toHaveBeenCalled()
      )
      it("should call tick once per tick for multiple ticks when told to continue", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        tick = jasmine.createSpy("tick").andCallFake(->call_count++; return false)
        expect(->job_list.append(tick)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(tick).toHaveBeenCalled()
        expect(call_count==3).toBeTruthy()
      )
      it("should call tick once for multiple ticks when told to finish", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        tick = jasmine.createSpy("tick").andCallFake(->call_count++; return true)
        expect(->job_list.append(tick)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(tick).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )

    ##############################
    # finish
    ##############################
    describe("finish is called when expected", ->
      it("should not call finish without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        finish = jasmine.createSpy("finish")
        expect(->job_list.append({
          tick: ->return false
          finish: finish
        })).not.toThrow()
        expect(finish).not.toHaveBeenCalled()
      )
      it("should not call finish with a tick and non-finished task", ->
        job_list = new Background.JobList(10000)   # some long time
        finish = jasmine.createSpy("finish")
        expect(->job_list.append({
          tick: ->return false
          finish: finish
        })).not.toThrow()
        expect(finish).not.toHaveBeenCalled()
      )
      it("should call finish once for one tick for a finished task", ->
        job_list = new Background.JobList(10000)   # some long time
        finish = jasmine.createSpy("finish")
        expect(->job_list.append(finish: finish)).not.toThrow()
        job_list.tick()
        expect(finish).toHaveBeenCalled()
      )
      it("should call finish once for multiple ticks when told to finish", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        finish = jasmine.createSpy("finish").andCallFake(->call_count++)
        expect(->job_list.append(finish: finish)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(finish).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
      it("should call finish once for multiple ticks when destroyed", ->
        call_count = 0
        job_list = new Background.JobList(30)
        finish = jasmine.createSpy("finish").andCallFake(->call_count++)
        expect(->job_list.append({
          tick: ->return false
          finish: finish
        })).not.toThrow()
        job_list.tick()
        job_list.destroy(); job_list = null
        waitsFor(-> return finish.wasCalled)
        runs(->
          expect(finish).toHaveBeenCalled()
          expect(call_count==1).toBeTruthy()
        )
      )
      it("should indicate the task was completed when completed", ->
        param_was_completed = false
        job_list = new Background.JobList(10000)   # some long time
        finish = jasmine.createSpy("finish").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_list.append(finish: finish)).not.toThrow()
        job_list.tick()
        expect(finish).toHaveBeenCalled()
        expect(param_was_completed).toBeTruthy()
      )
      it("should indicate the task was not completed when destroyed", ->
        param_was_completed = true
        job_list = new Background.JobList(30)
        finish = jasmine.createSpy("finish").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_list.append(finish: finish)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        job_list.destroy(); job_list = null
        waitsFor(-> return finish.wasCalled)
        runs(->
          expect(finish).toHaveBeenCalled()
        )
      )
    )

    ##############################
    # append functions and tick
    ##############################
    describe("checking job tick is called for each tick", ->
      it("should call once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job_list.append({
          tick: -> call_count++; return false # not done
        })
        job_list.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job_list.append({
          tick: -> call_count++; return false # not done
        })
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count==3).toBeTruthy()
      )

      it("should call all jobs for each tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append({
          tick: -> call_count_1++; return false # not done
        })
        call_count_2 = 0
        job_list.append({
          tick: -> call_count_2++; return false # not done
        })
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==3).toBeTruthy()
        expect(call_count_2==3).toBeTruthy()
      )

      it("should call continued jobs once for each tick and finished jobs only once", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append({
          tick: -> call_count_1++; return true # done
        })
        call_count_2 = 0
        job_list.append({
          tick: -> call_count_2++; return false # not done
        })
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==1).toBeTruthy()
        expect(call_count_2==3).toBeTruthy()
      )
      it("should call continued jobs once for each tick and finished jobs only once", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append({
          tick: -> call_count_1++; return false # not done
        })
        call_count_2 = 0
        job_list.append({
          tick: -> call_count_2++; return true # done
        })
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==3).toBeTruthy()
        expect(call_count_2==1).toBeTruthy()
      )
    )

    ##############################
    # append Background.Job and tick
    ##############################
    describe("checking job tick is called for each tick", ->
      it("should call once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job = new Background.Job(-> call_count++; return false)
        job_list.append(job)
        job_list.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job = new Background.Job(-> call_count++; return false)
        job_list.append(job)
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count==3).toBeTruthy()
      )
    )
  )

catch error
  alert("Background.JobList specs failed: '#{error}'")