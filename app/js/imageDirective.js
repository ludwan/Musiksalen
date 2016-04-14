musiksalenApp.directive('fallback', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", "../images/placeholder.png");
      });
    }
   }
   return fallbackSrc;
});