try

  describe("BGJob", ->
    ##############################
    # new BGJob()
    ##############################
    describe("new BGJob()", ->
      it("should not require an init_fn", ->
        expect(->new BGJob(null, ->)).not.toThrow()
      )
      it("should require a run_fn", ->
        expect(->new BGJob(null, null)).toThrow('run_fn is mandatory')
      )
      it("should not require a destroy_fn", ->
        expect(->new BGJob(null, (->), null)).not.toThrow()
      )
    )
  )

catch error
  alert("BGJob specs failed: '#{error}'")