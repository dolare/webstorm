var loginPage = function(){

    this.getUrl = function(){
        return "/#/login";
    }

    this.getUsernameField = function(){
        return element(by.model("username"));
    }

    this.getPasswordField = function(){
        return element(by.model("password"));
    }

    this.getSignInButton = function(){
        return element(by.buttonText('Log in'));
    }

}


module.exports = new loginPage();