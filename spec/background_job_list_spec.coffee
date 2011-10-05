try
  describe("Background.JobList", ->
    ##############################
    # init_fn
    ##############################
    describe("init_fn is called when expected", ->
      it("should not call init_fn without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn")
        expect(->job_list.append(init_fn, (->return false))).not.toThrow()
        expect(init_fn).not.toHaveBeenCalled()
      )
      it("should call init_fn once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn")
        expect(->job_list.append(init_fn, (->return false))).not.toThrow()
        job_list.tick()
        expect(init_fn).toHaveBeenCalled()
      )
      it("should call init_fn once for multiple ticks", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn").andCallFake(->call_count++)
        expect(->job_list.append(init_fn, (->return false))).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(init_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )
    
    ##############################
    # run_fn
    ##############################
    describe("run_fn is called when expected", ->
      it("should not call run_fn without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->return false)
        expect(->job_list.append(null, run_fn)).not.toThrow()
        expect(run_fn).not.toHaveBeenCalled()
      )
      it("should call run_fn once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->return false)
        expect(->job_list.append(null, run_fn)).not.toThrow()
        job_list.tick()
        expect(run_fn).toHaveBeenCalled()
      )
      it("should call run_fn once per tick for multiple ticks when told to continue", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->call_count++; return false)
        expect(->job_list.append(null, run_fn)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(run_fn).toHaveBeenCalled()
        expect(call_count==3).toBeTruthy()
      )
      it("should call run_fn once for multiple ticks when told to finish", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->call_count++; return true)
        expect(->job_list.append(null, run_fn)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(run_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )

    ##############################
    # destroy_fn
    ##############################
    describe("destroy_fn is called when expected", ->
      it("should not call destroy_fn without a tick", ->
        job_list = new Background.JobList(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_list.append(null, (->return false), destroy_fn)).not.toThrow()
        expect(destroy_fn).not.toHaveBeenCalled()
      )
      it("should not call destroy_fn with a tick and non-finished task", ->
        job_list = new Background.JobList(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_list.append(null, (->return false), destroy_fn)).not.toThrow()
        expect(destroy_fn).not.toHaveBeenCalled()
      )
      it("should call destroy_fn once for one tick for a finished task", ->
        job_list = new Background.JobList(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_list.append(null, (->return true), destroy_fn)).not.toThrow()
        job_list.tick()
        expect(destroy_fn).toHaveBeenCalled()
      )
      it("should call destroy_fn once for multiple ticks when told to finish", ->
        call_count = 0
        job_list = new Background.JobList(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(->call_count++)
        expect(->job_list.append(null, (->return true), destroy_fn)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(destroy_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
      it("should call destroy_fn once for multiple ticks when destroyed", ->
        call_count = 0
        job_list = new Background.JobList(30)
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(->call_count++)
        expect(->job_list.append(null, (->return false), destroy_fn)).not.toThrow()
        job_list.tick()
        job_list.destroy(); job_list = null
        waitsFor(-> return destroy_fn.wasCalled)
        runs(-> 
          expect(destroy_fn).toHaveBeenCalled()
          expect(call_count==1).toBeTruthy()
        )
      )
      it("should indicate the task was completed when completed", ->
        param_was_completed = false
        job_list = new Background.JobList(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_list.append(null, (->return true), destroy_fn)).not.toThrow()
        job_list.tick()
        expect(destroy_fn).toHaveBeenCalled()
        expect(param_was_completed).toBeTruthy()
      )
      it("should indicate the task was not completed when destroyed", ->
        param_was_completed = true
        job_list = new Background.JobList(30)
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_list.append(null, (->return true), destroy_fn)).not.toThrow()
        job_list.tick(); job_list.tick(); job_list.tick()
        job_list.destroy(); job_list = null
        waitsFor(-> return destroy_fn.wasCalled)
        runs(-> 
          expect(destroy_fn).toHaveBeenCalled()
        )
      )
    )
    
    ##############################
    # append functions and tick
    ##############################
    describe("checking job run_fn is called for each tick", ->
      it("should call once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job_list.append(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_list.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job_list.append(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count==3).toBeTruthy()
      )

      it("should call all jobs for each tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append(null, 
          (-> 
            call_count_1++
            return false # not done
          )
        )
        call_count_2 = 0
        job_list.append(null, 
          (-> 
            call_count_2++
            return false # not done
          )
        )
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==3).toBeTruthy()
        expect(call_count_2==3).toBeTruthy()
      )

      it("should call continued jobs once for each tick and finished jobs only once", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append(null, 
          (-> 
            call_count_1++
            return true # done
          )
        )
        call_count_2 = 0
        job_list.append(null, 
          (-> 
            call_count_2++
            return false # not done
          )
        )
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==1).toBeTruthy()
        expect(call_count_2==3).toBeTruthy()
      )
      it("should call continued jobs once for each tick and finished jobs only once", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count_1 = 0
        job_list.append(null, 
          (-> 
            call_count_1++
            return false # not done
          )
        )
        call_count_2 = 0
        job_list.append(null, 
          (-> 
            call_count_2++
            return true # done
          )
        )
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count_1==3).toBeTruthy()
        expect(call_count_2==1).toBeTruthy()
      )
    )

    ##############################
    # append Background.Job and tick
    ##############################
    describe("checking job run_fn is called for each tick", ->
      it("should call once for one tick", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job = new Background.Job(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_list.append(job)
        job_list.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_list = new Background.JobList(10000)   # some long time
        call_count=0
        job = new Background.Job(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_list.append(job)
        job_list.tick(); job_list.tick(); job_list.tick()
        expect(call_count==3).toBeTruthy()
      )
    )
  )

catch error
  alert("Background.JobList specs failed: '#{error}'")