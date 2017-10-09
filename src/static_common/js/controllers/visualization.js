var visualization = angular.module('myApp')
visualization.controller('VisualizationController',
  function(avatarService, $scope, $http, authenticationSvc, $q, apiService) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId() + '/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    

    var myChart = echarts.init(document.getElementById('main'));

    $scope.selection_settings = {displayProp: 'label', styleActive: true, groupBy: 'name'};
    // $scope.selection_settings = {displayProp: 'label', styleActive: true, groupByTextProvider: function(groupValue) { if (groupValue) {return 'Categories'} }, groupBy: 'label'};

    $scope.text_settings = {buttonDefaultText : 'Cat.', dynamicButtonTextSuffix: '  ✔'}


    $scope.init_bar = true
    $scope.course_type_amp = true
    $scope.course_type_non_amp = true
    $scope.course_format_onsite = true
    $scope.course_format_online = true
    $scope.course_format_hybrid = true


//     $scope.reset = function(index){
        

        
//         $scope.selection[index].school = null;
//         $scope.selection[index].category = [];
//         $scope.selection[index].categories = []

//         bar_result[index]= 0


//         option = {
//     color: ['#3398DB'],
//     tooltip : {
//         trigger: 'axis',
//         axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//             type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//         }
//     },
//     grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     xAxis : [
//         {
//             type : 'category',
//             data : [],
//             axisTick: {
//                 alignWithLabel: true
//             }
//         }
//     ],
//     yAxis : [
//         {
//             type : 'value'
//         }
//     ],
//     series : [
//         {
//             name:'',
//             type:'bar',
//             barWidth: '70%',
//              label: {
//                 normal: {
//                     show: true,
//                     position: 'inside'
//                 }
//             },
//             data:bar_result
//         }
//     ]
// };

// myChart.setOption(option);

//     }
    //end of reset


    //init get all schools
    $http({
      url: '/api/upgrid/non_degree/schools?page_size=100&client_id='+client_id,
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(schools) {

        console.log("schools are "+JSON.stringify(schools, null, 4))
        
        $scope.schools = schools.data.results 

        $scope.selection = []

        $scope.bar_result = [];

        var promises = [];
        
        angular.forEach($scope.schools, function(school, index) {

            $scope.bar_result.push(0)



            $scope.selection[index] = {
                'categories': [],
                'select': null,
                'school': school.object_id,
                // 'school': $scope.schools[0].object_id,
                'category': [],
            }


            // $scope.get_category(school.object_id, index, true)
            // $scope.get_category($scope.schools[0].object_id, index, true)
            apiService.getCategories(token, $scope.schools[index].object_id, index, $scope.selection, true).then(function(result) {
                console.log("result="+JSON.stringify(result, null, 4))
                $scope.selection = result
            })


            promises.push(apiService.getCategories(token, $scope.schools[index].object_id, index, $scope.selection, true));

        })


        $q.all(promises).then(function() {
            $scope.refresh()
            

        });


option = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            barWidth: '70%',
             label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:$scope.bar_result
        }
    ]
};

myChart.setOption(option);


    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });

    $scope.aha = function(type) {

      console.log("type="+type)

    }

    


    $scope.get_category = function(school, index, check_all){

        if(school){

        $http({
      url: '/api/upgrid/non_degree/schools/'+school+'/categories',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(categories) {

        console.log("cat are "+JSON.stringify(categories, null, 4))
        $scope.selection[index].category = []

        var temp_selection = []
        for(var k=0; k<categories.data.length; k++){
            // temp_selection[k]['id'] = categories.data[k].object_id
            // temp_selection[k]['label'] = categories.data[k].name

            temp_selection.push({
                'id': categories.data[k].object_id, 
                'label': categories.data[k].name,
                'name': 'categories'
            })
        }

        $scope.selection[index].categories = temp_selection

        //$scope.selection[index].categories = [ {id: 1, label: "David adnk asdjaks askdmakd asdmlaksdad"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}]; 
        //$scope.example2model = []; 
        //$scope.example2data = [ {id: 1, label: "David adnk asdjaks askdmakd asdmlaksdad"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}]; 
        //$scope.example2settings = {displayProp: 'label'};
        //$scope.selection_settings = {displayProp: 'label', styleActive: true, groupByTextProvider: function(groupValue) { if (groupValue) {return 'Categories'} }, groupBy: 'label'};

        console.log("temp_selection="+JSON.stringify(temp_selection, null, 4))
        //if(check_all){
       

            var temp_categories = []

            for(var p=0; p<$scope.selection[index].categories.length;p++){
                temp_categories.push(
                    $scope.selection[index].categories[p]
                )
            }
            console.log("temp_categories="+JSON.stringify(temp_categories, null, 4))

            $scope.selection[index].category = temp_categories


            $scope.refresh_one(index)

        // end of check_all



    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });
} else {
    
    $scope.selection[index].school = null;
        $scope.selection[index].category = [];
        $scope.selection[index].categories = []

        $scope.bar_result[index]= 0

}

    }







    $scope.set_category = function(cat, index){

        $scope.selection[index].select = cat

        


    }

    $scope.onItemDeselect= function(item){
        alert("aha")
    }

    // $scope.onSelectionChanged = function() {
    //     console.log("haha")
    //     $scope.refresh()
    // }

$scope.$watch('selection', function(newVal, oldVal) {
  //alert("changed")
  // if(!$scope.init_bar) {
  //   $scope.refresh()
  // }
  if(!$scope.init_bar) {

    console.log("oldVal="+JSON.stringify(oldVal, null, 4))
  console.log("newVal="+JSON.stringify(newVal, null, 4))



    for(var q=0; q<oldVal.length; q++){

        if(oldVal[q].school === newVal[q].school && 
             _.isEqual(oldVal[q].category, newVal[q].category) ){

        } else if (oldVal[q].school !== newVal[q].school){
            $scope.get_category(newVal[q].school, q, true)

        } else if(!_.isEqual(oldVal[q].category, newVal[q].category)) {
            $scope.refresh_one(q)
        }
    }



  }
  

}, true);


$scope.get_bar_result = function (index) {


    console.log("###get one bar result###")
    console.log("###selected=###"+JSON.stringify($scope.selection[index].category, null, 4))
    var deferred = $q.defer();

        

        var temp_cat = ''
        
        for(var j=0; j<$scope.selection[index].category.length; j++){

            temp_cat = temp_cat + ((j===0 ? '' : '&category=') + $scope.selection[index].category[j].id)
        }

        

        $http({
          url: '/api/upgrid/non_degree/courses?category='+ temp_cat + ($scope.course_format_onsite ? '&type=onsite':'') + ($scope.course_format_online ? '&type=online':'') + ($scope.course_format_hybrid ? '&type=hybrid':'') + ($scope.course_type_amp && $scope.course_type_non_amp ? '' : (($scope.course_type_amp ? '&is_AMP=True' : '') + ($scope.course_type_non_amp ? '&is_AMP=False' : ''))),
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
        .then(function(value) {

        console.log("temp_cat="+JSON.stringify(temp_cat, null, 4))
        console.log("value.data.count="+value.data.count)        
        $scope.bar_result[index] = value.data.count

        deferred.resolve($scope.bar_result[index]);
         
    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
         deferred.reject(error);
    });

    return deferred.promise;


}


$scope.refresh_one = function(index) {
    App.blocks('#chart_block', 'state_loading');

    var promises_bar = []
    
    console.log("index === "+index)
    
            if($scope.selection[index].category.length!==0 && ($scope.course_type_amp || $scope.course_type_non_amp)){
                $scope.get_bar_result(index).then(function(result) {
                    console.log("refresh result = "+JSON.stringify(result, null, 4))
                    $scope.bar_result[index] = result

                    console.log("changed result = "+JSON.stringify($scope.bar_result, null, 4))

                })

                promises_bar.push($scope.get_bar_result(index))


            } else {
                $scope.bar_result[index] = 0

            }






     $q.all(promises_bar).then(function() {
            
            console.log()

            console.log("refreshing one")
            $scope.init_bar = false

            App.blocks('#chart_block', 'state_normal');
                option = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            barWidth: '70%',
             label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:$scope.bar_result
        }
    ]
};

myChart.setOption(option);
    

            

        });

    
}


      
$scope.refresh=function() {

    App.blocks('#chart_block', 'state_loading');


    console.log("**********************")
    var promises_bar = []
    angular.forEach($scope.selection, function(value, index) {
    
           

            if(value.category.length!==0 && ($scope.course_type_amp || $scope.course_type_non_amp)){
                $scope.get_bar_result(index).then(function(result) {
                    console.log("refresh result = "+JSON.stringify(result, null, 4))
                    $scope.bar_result[index] = result

                })

                promises_bar.push($scope.get_bar_result(index))


            } else {
                $scope.bar_result[index] = 0



            }


             });




     $q.all(promises_bar).then(function() {
            

            $scope.init_bar = false

            App.blocks('#chart_block', 'state_normal');
                option = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            barWidth: '70%',
             label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:$scope.bar_result
        }
    ]
};

myChart.setOption(option);
    

            

        });

    
 


}


})