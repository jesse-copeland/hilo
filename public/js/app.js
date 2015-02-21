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

function calcScalePos (elemVal, scaleArray) {

  var offset = elemVal - scaleArray[0];
  var tempRange = scaleArray[1] - scaleArray[0];
  var currentPerc =  offset / tempRange;
  var position = scaleArray[2] * currentPerc;
  return position;
}

function render ($element) {

  var cityData = $element.data('weatherData').city;
  var currentTempData = $element.data('weatherData').currentTemp;
  var highTempNormalData = $element.data('weatherData').highTempNormal;
  var highTempRecordData = $element.data('weatherData').highTempRecord;
  var highTempYearData = $element.data('weatherData').highTempYear;
  var lowTempNormalData = $element.data('weatherData').lowTempNormal;
  var lowTempRecordData = $element.data('weatherData').lowTempRecord;
  var lowTempYearData = $element.data('weatherData').lowTempYear;

  var cityEl = $element.find('.city');
  var currentTempEl = $element.find('.current-temp .temp-val');
  var highTempNormalEl = $element.find('.normal-high-temp .temp-val');
  var highTempRecordEl = $element.find('.record-high .temp-val');
  var highTempYearEl = $element.find('.record-high h3');
  var lowTempNormalEl = $element.find('.normal-low-temp .temp-val');
  var lowTempRecordEl = $element.find('.record-low .temp-val');
  var lowTempYearEl = $element.find('.record-low h3');

  cityEl.text(cityData);
  currentTempEl.text(currentTempData);
  highTempNormalEl.text(highTempNormalData);
  highTempRecordEl.text(highTempRecordData);
  highTempYearEl.text(highTempYearData);
  lowTempNormalEl.text(lowTempNormalData);
  lowTempRecordEl.text(lowTempRecordData);
  lowTempYearEl.text(lowTempYearData);

  var scaleArray = [lowTempRecordData, highTempRecordData, 230];

  var markerHighPosEl = $('.ther-marker.top-marker');
  var markerCurrentPosEl = $('.ther-marker.center-marker');
  var markerLowPosEl = $('.ther-marker.bottom-marker');

  markerHighPosEl.css('left', calcScalePos(highTempNormalData, scaleArray)); 
  markerCurrentPosEl.css('left', calcScalePos(currentTempData, scaleArray)); 
  markerLowPosEl.css('left', calcScalePos(lowTempNormalData, scaleArray)); 
  cityEl.slideDown();
          
}

$(function () {
  var thermElement = $('.thermometer');
  thermElement.find('h1.city').hide();
  var location = new Location();
  var citySelects = $('.city-select .cs-options');
  var resetButton = $('.reset');
  var selectedAirport;
    
    citySelects.on('click', 'li', function () {
      selectedAirport = $(this).data('value');
      location.fetchWeatherData(selectedAirport, function (location) {
        attachAttributes(thermElement, location, function ($element) {
          render($element);
        });
      });
    });

    resetButton.click(function () {
      var checkTherm = $('.thermometer')[0];
      if ($.hasData(checkTherm)) {
        thermElement.removeData('weatherData');
        console.log('Data removed: weatherData');
      } else {
        console.log('No data to remove');
      }
    });

}); //end jQuery function

