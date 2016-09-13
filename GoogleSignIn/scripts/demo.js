(function (global) {
  var DemoViewModel,
      geoTransitionListener = null,
      app = global.app = global.app || {};
  
  // TODO
  
  DemoViewModel = kendo.data.ObservableObject.extend({
    
    initGeo: function () {
      if (!this.checkSimulator()) {
        geofence.initialize(this.onSuccessWithAlert);
      }
    },
    
    monitorEnterLeave20m: function () {
      this._determineLocation('20m', 20);
    },

    monitorEnterLeave500m: function () {
      this._determineLocation('500m', 500);      
    },

    _determineLocation: function (id, radius) {
      var that = this;
      navigator.geolocation.getCurrentPosition(
        function(position) {
          that._monitorEnterLeave(id, radius, position)
        },
        that.onError
      );
    },

    _monitorEnterLeave: function (id, radius, position) {
      var that = this;
      geofence.addOrUpdate ({
          id:             id, //A unique identifier of geofence
          latitude:       position.coords.latitude, //Geo latitude of geofence
          longitude:      position.coords.longitude, //Geo longitude of geofence
          radius:         radius, //Radius of geofence in meters
          transitionType: 3, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
          notification: {         //Notification object
              id:             1, //optional should be integer, id of notification
              title:          'Geofencing enter/leave', //Title of notification
              text:           'For id: ' + id + ', radius: ' + radius, //Text of notification
//              smallIcon:      String, //Small icon showed in notification area, only res URI
//              icon:           String, //icon showed in notification drawer
              openAppOnClick: true,//is main app activity should be opened after clicking on notification
//              vibration:      [Integer], //Optional vibration pattern - see description
              data:           {id: id}  //Custom object associated with notification
          }
      }).then(
        function () {
          // now that we have a geofence we should listen for transitions,
          // so set up a listener if we don't have one already
          if (geoTransitionListener === null) {
            geoTransitionListener = function (geofences) {
              geofences.forEach(function (geo) {
                that.onSuccessWithAlert('Geofence transition detected', JSON.stringify(geo));
              });
            };
            geofence.onTransitionReceived = geoTransitionListener;
          };
	        that.onSuccessWithAlert("Geofence added");
        },
        that.onError
      );
    },

    remove20m: function () {
      geofence.remove('20m').then(this.onSuccessWithAlert);
    },

    remove500m: function () {
      geofence.remove('500m').then(this.onSuccessWithAlert);
    },

    removeAll: function () {
      geofence.removeAll().then(this.onSuccessWithAlert);
    },

    checkSimulator: function() {
      if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
      } else if (window.geofence === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
      } else {
        return false;
      }
    },

    // callbacks
    onSuccess: function(msg) {
      if (msg === undefined) {
        console.log('OK, done');
      } else {
	      console.log('OK, details: ' + JSON.stringify(msg));        
      }
    },

    onSuccessWithAlert: function(msg) {
      if (msg === undefined || msg === null) {
        alert('OK, done');
      } else {
	      alert('Success message: ' + JSON.stringify(msg));        
      }
    },

    onError: function(msg) {
      alert('Geofencing error: ' + JSON.stringify(msg));
    }
  });

  app.demoService = {
    viewModel: new DemoViewModel()
  };
})(window);