//This directive is used as a fallback if the program fails to load the current img-src
//This may happen if the image link is for example broken
musiksalenApp.directive('fallback', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", "../images/score-placeholder.png");
      });
    }
   }
   return fallbackSrc;
});