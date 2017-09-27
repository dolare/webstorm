var visualization = angular.module('myApp')
visualization.controller('VisualizationController',
  function(avatarService, $scope, $http, authenticationSvc) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId() + '/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";


    var myChart = echarts.init(document.getElementById('main'));

    $scope.selection = []

    for(var i=0; i<6; i++){

            $scope.selection[i] = {
                'categories': [],
                'select': null
            }
           

        }
    

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


        

    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });

    $scope.aha = function(type) {

      console.log("type="+type)

    }

    


    $scope.get_category = function(school, index){
        $http({
      url: '/api/upgrid/non_degree/schools/'+school+'/categories',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(categories) {

        console.log("cat are "+JSON.stringify(categories, null, 4))
        


        $scope.selection[index].categories = categories.data

    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });

    }




    $scope.set_category = function(cat, index){

        $scope.selection[index].select = cat

        


    }

var bar_result = [0,0,0,0,0,0];

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
            data : ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6'],
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

// $scope.reset(index){
//     $scope.selection
// }
      
$scope.refresh=function() {

    var bar_result = [];


    angular.forEach($scope.selection, function(value, index) {
    
                   

            if(value.select){

                $http({
                  url: '/api/upgrid/non_degree/courses/count?category='+ value.select + ($scope.course_format ? ($scope.course_format === 'online'? '&type=online': ($scope.course_format === 'onsite'? '&type=onsite': '&type=hybrid')) : '') + ($scope.course_type ? ($scope.course_type === 'amp'? '&is_AMP=True': '&is_AMP=false'): ''),
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
            data : ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6'],
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
            data : ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6'],
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