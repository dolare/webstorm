var fs = require('fs');
var path = require('path');
var rootUrl = require('./config/settings').getRootUrl();
var loginPage = require('./pages/login');


describe('login page', function(){
    //get credential info of users

    var file = path.resolve(__dirname,'../tmp/users.json');

    try{
        var obj = JSON.parse(fs.readFileSync(file,'utf8'));
    }catch(err){
        console.log(err);
        return;
    }
    var accountManager = obj.accountManager;
    var client = obj.client;

    //testing start
    beforeEach(function(){
        browser.get(rootUrl + loginPage.getUrl());
        browser.waitForAngular();
    })

    afterEach(function() {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.manage().deleteAllCookies();
    });


    //checking the current url, inputfields and signIn button    
    it('should render login page', function(){
       
        var currentUrl = browser.getCurrentUrl();
        var isDisplayusernameField = loginPage.getUsernameField().isDisplayed();
        var isDisplaypasswordField = loginPage.getPasswordField().isDisplayed();
        var isDisplaysignInButton = loginPage.getSignInButton().isDisplayed()

        expect(currentUrl).toMatch('/login');
        expect(usernameField).toEqual(true);
        expect(passwordField).toEqual(true);
        expect(signInButton).toEqual(true);
    })


    it('should sign in successful as account manager', function(){

        //log in with fake data
        loginPage.getUsernameField().sendKeys(accountManager.username);
        loginPage.getPasswordField().sendKeys(accountManager.password);

        //click login and wait for the url relocation as account manager
        var isLoginAsAdmin = loginPage.getSignInButton().click().then(function(){
            return browser.wait(function(){
                return browser.getCurrentUrl().then(function(url){
                    return /admin-dashboard/.test(url);
                })
            })
        })

        expect(isLoginAsAdmin).toEqual(true);
        
    })

    it('should sign in successful as account manager', function(){
        
        //log in with fake data
        element(by.model('username')).sendKeys(client.username);
        element(by.model('password')).sendKeys(client.password);

        //click login and wait for the url relocation as client
        var isLoginAsClient = element(by.className('btn')).click().then(function(){
            return browser.wait(function(){
                return browser.getCurrentUrl().then(function(url){
                    return /dashboard/.test(url);
                })
            })
        })

        expect(isLoginAsClient).toEqual(true);

    })

},120000)
