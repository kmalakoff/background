try {
  describe("BGJob", function() {
    return describe("new BGJob()", function() {
      it("should not require an init_fn", function() {
        return expect(function() {
          return new BGJob(null, function() {});
        }).not.toThrow();
      });
      it("should require a run_fn", function() {
        return expect(function() {
          return new BGJob(null, null);
        }).toThrow('run_fn is mandatory');
      });
      return it("should not require a destroy_fn", function() {
        return expect(function() {
          return new BGJob(null, (function() {}), null);
        }).not.toThrow();
      });
    });
  });
} catch (error) {
  alert("BGJob specs failed: '" + error + "'");
}