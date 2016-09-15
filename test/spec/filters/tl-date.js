'use strict';

describe('Filter: tlDate', function () {

  // load the filter's module
  beforeEach(module('timelinerApp'));

  // initialize a new instance of the filter before each test
  var tlDate, date;
  beforeEach(inject(function ($filter) {
    tlDate = $filter('tlDate');
    date = $filter('date');
  }));

  it('should return the input formatted with "tlDate filter:"', function () {
    var text = '2016-08-23T15:22:53.294Z';
    expect(tlDate(text)).toBe(date(text, 'dd.MM.yyyy'));
    expect(tlDate(text, true)).toBe(date(text, 'dd.MM.yyyy HH:mm'));
  });

  it('should return the unhandlable input "tlDate filter:"', function () {
    var text = 'unsuitable';
    expect(tlDate(text)).toBe(text);
  });

});
