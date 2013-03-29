(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);
  jasmineEnv.addReporter(new jasmine.ConsoleReporterHeadless());
  jasmineEnv.specFilter = function(spec) { return htmlReporter.specFilter(spec); };

  var is_running = false;
  var startRunner = function() {
    if (is_running) return;
    is_running = true;
    jasmineEnv.execute();

    var start = Date.now();
    var timeout = 60000;
    var interval = setInterval((function() {
      var code, stats;
      if (Date.now() > start + timeout) {
        $('body').append($('<div id="HTMLReporter"><div class="failingAlert bar">TESTS TIMED OUT</div></div>'));
        throw 'Warning: tests timed out';
      }
      else {
        var runner = jasmine.getEnv().currentRunner();
        if (runner.queue.isRunning()) { return; }

        clearInterval(interval);
        if (runner.results().totalCount <= 0) {
          $('body').append($('<div id="HTMLReporter"><div class="failingAlert bar">NO TESTS RUN</div></div>'));
          throw 'Warning: no tests run';
        }
      }
    }), 500);
  };

  // AMD
  if (typeof define === 'function' && define.amd) {
    return define('jasmine_test_runner', function() { return {start: startRunner}; });
  }

  // embedded in window
  else {
    var currentWindowOnload = window.onload;
    window.onload = function() {
      if (currentWindowOnload) currentWindowOnload();
      startRunner();
    };
  }
})();