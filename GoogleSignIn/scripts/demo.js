(function (global) {
  var DemoViewModel,
      geoTransitionListener = null,
      app = global.app = global.app || {};
  
  DemoViewModel = kendo.data.ObservableObject.extend({
    
    login: function () {
      if (!this.checkSimulator()) {
        var feedback = document.querySelector("#feedback");
        window.plugins.googleplus.login(
          {},
          function (obj) {
            feedback.innerHTML = "Hi, " + obj.displayName + ", " + obj.email;

            var image = document.querySelector("#image");
            image.src = obj.imageUrl;
            image.style.visibility = 'visible';
          },
          function (msg) {
            feedback.innerHTML = "error: " + msg;
          }
        );
      }
    },

    trySilentLogin: function () {
      if (!this.checkSimulator()) {
        var feedback = document.querySelector("#feedback");
        window.plugins.googleplus.trySilentLogin(
          {},
          function (obj) {
            feedback.innerHTML = "(Silent) Hi, " + obj.displayName + ", " + obj.email;

            var image = document.querySelector("#image");
            image.src = obj.imageUrl;
            image.style.visibility = 'visible';
          },
          function (msg) {
            feedback.innerHTML = "error: " + msg;
          }
        );
      }
    },
    
    logout: function () {
      if (!this.checkSimulator()) {
        var feedback = document.querySelector("#feedback");
        window.plugins.googleplus.logout(
          function (msg) {
            feedback.innerHTML = msg;
            document.querySelector("#image").style.visibility = 'hidden';
          },
          function (msg) {
            feedback.innerHTML = "error: " + msg;
          }
        );
      }
    },

    disconnect: function () {
      if (!this.checkSimulator()) {
        var feedback = document.querySelector("#feedback");
        window.plugins.googleplus.disconnect(
          function (msg) {
            feedback.innerHTML = msg;
            document.querySelector("#image").style.visibility = 'hidden';
          },
          function (msg) {
            feedback.innerHTML = "error: " + msg;
          }
        );
      }
    },

    checkSimulator: function() {
      if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
      } else if (window.plugins === undefined || window.plugins.googleplus === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
      } else {
        return false;
      }
    }
  });

  app.demoService = {
    viewModel: new DemoViewModel()
  };
})(window);