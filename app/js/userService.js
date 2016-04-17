musiksalenApp.service('userService', function() {
    this.userId = null;

    this.getUserId = function(){
        return this.userId;
    }

    this.setUserId = function(uid){
        this.userId = uid;
    }

});