musiksalenApp.service('userService', function() {
    this.userId = null;
    this.userName = null;

    this.getUserId = function(){
        return this.userId;
    }

    this.setUserId = function(uid){
        this.userId = uid;
    }

    this.setUserName = function(userName){
    	this.userName = userName;
    }

    this.getUserName = function(){
    	return this.userName;
    }

});