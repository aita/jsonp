var TEST_URL = 'http://jsfiddle.net/echo/jsonp/';

describe('jsonp', function() {
  it('loadScriptが呼ばれること', function() {
    spyOn(jsonp, 'loadScript').and.callThrough();
    jsonp.req(TEST_URL);
    expect(jsonp.loadScript).toHaveBeenCalledWith(TEST_URL, undefined, undefined);
  });

  it('コールバックが呼ばれること', function() {
    var callback = jasmine.createSpy('callback');
    jsonp.req(TEST_URL, callback);
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
    }, 100);
  });

  it('dataがGETパラメータとして渡されること', function() {
    spyOn(jsonp, 'loadScript').and.callThrough();
    jsonp.req(TEST_URL, { a: 1, b: 2 });
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
    }, 100);
    expect(jsonp.loadScript).toHaveBeenCalledWith(TEST_URL+'?a=1&b=2', undefined, undefined);
  });

  it('methodが省略できること', function() {
    var callback = jasmine.createSpy('callback');
    jsonp.req(TEST_URL, { a: 1, b: 2 }, callback);
    setTimeout(function() {
      expect(callback).toHaveBeenCalledWith({ a: 1, b: 2 });
    }, 100);
  });

  it('正常時にloadに指定したコールバックが呼ばれること', function() {
    var callback = jasmine.createSpy('callback');
    jsonp.req({
      url: TEST_URL,
      load: callback
    });
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
    }, 100);
  });

  it('404ステータス時にonerrorが呼ばれること', function() {
    var callback = jasmine.createSpy('callback');
    jsonp.req({
      url: 'http://gunosy.com/404',
      error: callback
    });
    setTimeout(function() {
      expect(callback).toHaveBeenCalled();
    }, 100);
  });
});
