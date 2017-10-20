var adminDashBoardPage = function(){

    //main
    this.getAddClientButton = function(){
        return element(by.buttonText('Add new client'));
    }

    //tab1
    this.getAccountNameField = function(){
        return element(by.model('account_name'));
    }

    this.getPasswordField = function(){
        return element(by.model('password'));
    }

    this.getPasswordConfirmField = function(){
        return element(by.model('password_confirm'));
    }

    this.getEmailField = function(){
        return element(by.model('email'));
    }

    this.getTitleField = function(){
        return element(by.model('title'));
    }

    this.getClientNameField = function(){
        return element(by.model('client_name'));
    }

    this.getPositionField = function(){
        return element(by.model('position'));
    }

    this.getPositionLevelField = function(){
        return element(by.model('position_level'));
    }

    this.getPhoneField = function(){
        return element(by.model('phone'));
    }

    //tab2
    this.getCeebField = function(){
        return element(by.model('ceeb'));
    }

    this.getDepartmentField = function(){
        return element(by.model('department'));
    }

    this.getAccountTypeField = function(){
        return element(by.model('account_type'));
    }
    
    this.getIsDemoField = function(){
        return element(by.model('is_demo'));
    }

    this.getWhoopsField = function(){
        return element(by.model("report_type['whoops']"));
    }

    this.getEnhancementField = function(){
        return element(by.model("report_type['whoops']"));
    }
    
    this.getNondegreeField = function(){
        return element(by.model(report_type['non-degree']));
    }

    this.getAMPField = function(){
        return element(by.model(report_type['AMP']));
    }

    //submit
    this.getSubmitButton = function(){
        return element(by.buttonText('Create user')); 
    }

}


module.exports = new adminDashBoardPage();