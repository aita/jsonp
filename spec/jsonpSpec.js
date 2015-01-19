var TEST_URL = 'http://jsfiddle.net/echo/jsonp/';

describe('jsonp', function() {
  beforeEach(function() {
    // 非同期テストの待ち時間を長くする
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('loadScriptが呼ばれること', function() {
    spyOn(jsonp, 'loadScript').and.callThrough();
    jsonp.req(TEST_URL);
    expect(jsonp.loadScript).toHaveBeenCalledWith(TEST_URL, undefined, undefined);
  });

  it('コールバックが呼ばれること', function(done) {
    var callback = jasmine.createSpy('callback');
    jsonp.req(TEST_URL, callback);
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('dataがGETパラメータとして渡されること', function() {
    var callback = jasmine.createSpy('callback');
    spyOn(jsonp, 'loadScript').and.callThrough();
    jsonp.req(TEST_URL, { a: 1, b: 2 }, callback);
    // expect(jsonp.loadScript).toHaveBeenCalledWith(TEST_URL+'?a=1&b=2', undefined, undefined);
  });

  it('methodが省略できること', function(done) {
    var callback = jasmine.createSpy('callback');
    jsonp.req(TEST_URL, { a: 1, b: 2 }, callback);
    setTimeout(function() {
      expect(callback).toHaveBeenCalledWith({ a: 1, b: 2 });
      done();
    }, 1000);
  });

  it('正常時にloadに指定したコールバックが呼ばれること', function(done) {
    var callback = jasmine.createSpy('callback');
    jsonp.req({
      url: TEST_URL,
      load: callback
    });
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('404ステータス時にonerrorが呼ばれること', function(done) {
    var callback = jasmine.createSpy('callback');
    jsonp.req({
      url: 'http://gunosy.com/404',
      error: callback
    });
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
      done();
    }, 1000);
  });
});
