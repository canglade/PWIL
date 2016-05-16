angular
  .module("pwilApp").directive('uniqueEmail', function(dbService) {

  function exists (modelValue) {
    var result = false;
    dbService.isEmailFree(modelValue).success(function (exist, next) {
      /*if (exist) {
        console.log("Dispo");
        result = true;
      }
      else {
        console.log("Pas dispo");
        result = false;
      }*/
      return exist;
    });
    return result;

  };

  function next (exist) {
    var result = false;

    if (exist) {
      console.log("Dispo");
      result = true;
    }
    else {
      console.log("Pas dispo");
      result = false;
    }
    return result
  }

  return {
    require: "ngModel",

    link: function(scope, element, attributes, ngModel) {



     ngModel.$validators.uniqueEmail = function(modelValue) {
       var result = exists(modelValue);
       return result;
       /* var result = false;

        //return modelValue == scope.otherModelValue;
        dbService.isEmailFree(modelValue).success(function (exists) {
          if (exists) {
            console.log("Dispo");
            result = true;
          }
          else {
            console.log("Pas dispo");
            result = false;
          }
        });
        return result;*/
      };

    /*  scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });*/
    }
  };
});



