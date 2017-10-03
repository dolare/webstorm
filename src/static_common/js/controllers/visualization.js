var visualization = angular.module('myApp')
visualization.controller('VisualizationController',
  function(avatarService, $scope, $http, authenticationSvc, $q) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId() + '/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";


    var myChart = echarts.init(document.getElementById('main'));


    $scope.course_type_amp = true
    $scope.course_type_non_amp = true
    $scope.course_format_onsite = true
    $scope.course_format_online = true
    $scope.course_format_hybrid = true

    



    $scope.reset = function(index){
        //alert(bar_result)

        
        $scope.selection[index].school = null;
        $scope.selection[index].category = [];
        $scope.selection[index].categories = []

        bar_result[index]= 0

        //alert(bar_result)

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
            data:bar_result
        }
    ]
};

myChart.setOption(option);

    }
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

        var bar_result = [];


        
        angular.forEach($scope.schools, function(school, index) {

            bar_result.push(0)

            $scope.selection[index] = {
                'categories': [],
                'select': null,
                'school': school.object_id,
                'category': [],
            }


            $scope.get_category(school.object_id, index, true)



        })









    // for(var i=0; i<11; i++){

    //         $scope.selection[i] = {
    //             'categories': [],
    //             'select': null,
    //             'school': null,
    //             'category': [],
    //         }
    //     }

        

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
            data:bar_result
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
        
        var temp_selection = []
        for(var k=0; k<categories.data.length; k++){
            // temp_selection[k]['id'] = categories.data[k].object_id
            // temp_selection[k]['label'] = categories.data[k].name

            temp_selection.push({
                'id': categories.data[k].object_id, 
                'label': categories.data[k].name
            })
        }

        $scope.selection[index].categories = temp_selection

        //$scope.selection[index].categories = [ {id: 1, label: "David adnk asdjaks askdmakd asdmlaksdad"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}]; 
        //$scope.example2model = []; 
        //$scope.example2data = [ {id: 1, label: "David adnk asdjaks askdmakd asdmlaksdad"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}]; 
        //$scope.example2settings = {displayProp: 'label'};
        $scope.selection_settings = {displayProp: 'label'};

        if(check_all){

            var temp_categories = []

            for(var p=0; p<$scope.selection[index].categories.length;p++){
                temp_categories.push({
                    'id': $scope.selection[index].categories[p].id
                })
            }
            console.log("temp_categories="+JSON.stringify(temp_categories, null, 4))

            $scope.selection[index].category = temp_categories

        }



    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });
} else {
    
    $scope.selection[index].school = null;
        $scope.selection[index].category = [];
        $scope.selection[index].categories = []

        bar_result[index]= 0

}

    }







    $scope.set_category = function(cat, index){

        $scope.selection[index].select = cat

        


    }


$scope.$watch('selection', function(newNames, oldNames) {
  //alert("changed")
  $scope.refresh()
}, true);

      
$scope.refresh=function() {

    var bar_result = [];


    angular.forEach($scope.selection, function(value, index) {
    
           

            if(value.category.length!==0 && ($scope.course_type_amp || $scope.course_type_non_amp)){

                //alert("entered")
                var temp_cat = ''
                for(var j=0; j<value.category.length; j++){

                    temp_cat = temp_cat + ((j===0 ? '' : '&category=') + value.category[j].id)
                }

                $http({
                  url: '/api/upgrid/non_degree/courses?category='+ temp_cat + ($scope.course_format_onsite ? '&type=onsite':'') + ($scope.course_format_online ? '&type=online':'') + ($scope.course_format_hybrid ? '&type=hybrid':'') + ($scope.course_type_amp && $scope.course_type_non_amp ? '' : (($scope.course_type_amp ? '&is_AMP=True' : '') + ($scope.course_type_non_amp ? '&is_AMP=False' : ''))),
                  method: 'GET',
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                })
                .then(function(value) {

                    
                    bar_result[index] = value.data.count

                    console.log("bar_result="+JSON.stringify(bar_result, null, 4))
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
                            data:bar_result
                        }
                    ]
                };

                myChart.setOption(option);

                                }).catch(function(error){
                                     console.log('an error occurred...'+JSON.stringify(error));
                                });



                            } else {
                                bar_result[index] = 0



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
            data:bar_result
        }
    ]
};

myChart.setOption(option);
            }

            // if(index === 5) {

            //     alert(bar_result)
    
            // }

    })

    






      }
  });