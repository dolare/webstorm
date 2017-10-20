describe('client create test as account manager on admin dashboard page', function(){
    //get credential info of users
    var fs = require('fs');
    var path = require('path');
    var file = path.resolve(__dirname,'../tmp/users.json')

    try{
        var obj = JSON.parse(fs.readFileSync(file,'utf8'));
    }catch(err){
        console.log(err);
        return;
    }
    var accountManager = obj.accountManager;

    //login first 
    element(by.model('username')).sendKeys(client.username);
    element(by.model('password')).sendKeys(client.password);

    var login = element(by.className('btn')).click().then(function(){
        return browser.wait(function(){
            return browser.getCurrentUrl().then(function(url){
                return /dashboard/.test(url);
            })
        })
    })

    if(login == true){
        console.log('login successful');
    }else{
        console.log('failed login');
        return;
    }

   
    //testing start
    beforeEach(function(){
        browser.get('http:127.0.0.1:8000/#/admin-dashboard');
        browser.waitForAngular();
    })

    afterEach(function() {

    });


    //checking the current url, inputfields and signIn button    
    it('should render dashboard page', function(){
       
        var currentUrl = browser.getCurrentUrl();
        var addClientButton = element(by.buttonText('Add new client'));

        //tab1
        var accountNameField = element(by.model('account_name'));
        var passwordField = element(by.model('password'));
        var passwordConfirmField = element(by.model('password_confirm'));
        var emailField = element(by.model('email'));
        var titleField = element(by.model('title'));
        var cilentNameField = element(by.model('client_name'));
        var positionField = element(by.model('position'));
        var positionLevelField = element(by.model('position_level'));
        var phoneField = element(by.model('phone'));

        //tab2
        var ceebField = element(by.model('ceeb'));
        var departmentField = element(by.model('department'));
        var accountTypeField = element(by.model('account_type'));
        var isDemoField = element(by.model('is_demo'));
        var whoopsField = element(by.model("report_type['whoops']"));
        var enhancementField = element(by.model("report_type['whoops']"));
        var nondegreeField = element(by.model(report_type['non-degree']));
        var AMPField = element(by.model(report_type['AMP']));

        var submitButton = element(by.buttonText('Create user')); 


        expect(currentUrl).toMatch('/admin-dashboard');
        expect(addClientButton).toEqual(addClientButton.isDisplayed());

        addClientButton.click().then(function(){
            return browser.wait(function(){
                return browser.getCurrentUrl().then(function(url){
                    return /dashboard/.test(url);
                })
            })
        })
    })  
      
})
