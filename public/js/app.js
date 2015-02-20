function Location () {
  this.wuApi = {
    urlStub: 'http://api.wunderground.com/api/',
    apiKey:  '173260e255bc99f7',
    resType: '.json'
  };
}

Location.prototype.fetchWeatherData = function (airportCode, callback) {
  var _location = this;
  var queryStub = '/conditions/almanac/q/';
  var fullQuery = _location.wuApi.urlStub + _location.wuApi.apiKey + queryStub + airportCode + _location.wuApi.resType;
  
  $.ajax({
    url: fullQuery,
    dataType: 'jsonp',
    success: function (parsedJson) {
      _location.city = parsedJson['current_observation']['observation_location']['city'];
      _location.currentTemp = parsedJson['current_observation']['temp_f'];
      _location.highTempNormal = parsedJson['almanac']['temp_high']['normal']['F'];
      _location.highTempRecord = parsedJson['almanac']['temp_high']['record']['F'];
      _location.highTempYear = parsedJson['almanac']['temp_high']['recordyear'];
      _location.lowTempNormal = parsedJson['almanac']['temp_low']['normal']['F'];
      _location.lowTempRecord = parsedJson['almanac']['temp_low']['record']['F'];
      _location.lowTempYear = parsedJson['almanac']['temp_low']['recordyear'];

      callback(_location);

    } // end success function
  }); //end ajax call
};

Location.prototype.getData = function () {
  var returnObj = {
    city:           this.city,
    currentTemp:    this.currentTemp,
    highTempNormal: this.highTempNormal,
    highTempRecord: this.highTempRecord,
    highTempYear:   this.highTempYear,
    lowTempNormal:  this.lowTempNormal,
    lowTempRecord:  this.lowTempRecord,
    lowTempYear:    this.lowTempYear
  };
  return returnObj;
};

function attachAttributes ($el, weatherData, callback) {
  $el.data('weatherData', weatherData.getData());
  callback($el);
}

function render ($element) {
  $element.find('h1').text($element.data('weatherData').city);
  $element.find('figure').text($element.data('weatherData').currentTemp);

}

$(function () {
  var locationElement = $('main.weather');
  var location = new Location();
  var citySelects = $('.city-select .cs-options');
  var selectedAirport;
    
    citySelects.on('click', 'li', function () {
      selectedAirport = $(this).data('value');
      location.fetchWeatherData(selectedAirport, function (location) {
        attachAttributes(locationElement, location, function ($element) {
          render($element);
        });
      });
    });

}); //end jQuery function

