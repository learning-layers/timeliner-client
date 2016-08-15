'use strict';

describe('Service: SocketService', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var socket;
  beforeEach(inject(function (_SocketService_) {
    socket = _SocketService_;
  }));

  it('should expose public API', function () {
    expect(socket.rawSocket).toBeDefined();
    expect(typeof socket.rawSocket).toBe('function');
    
    expect(socket.on).toBeDefined();
    expect(typeof socket.on).toBe('function');

    expect(socket.emit).toBeDefined();
    expect(typeof socket.emit).toBe('function');
  });

});
