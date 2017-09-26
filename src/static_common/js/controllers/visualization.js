var visualization = angular.module('myApp')
visualization.controller('VisualizationController',
  function(avatarService, $scope, $http, authenticationSvc) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId() + '/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";


    var myChart = echarts.init(document.getElementById('main'));


    $http({
      url: '/api/upgrid/non_degree/schools?client_id='+client_id,
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(schools) {

        console.log("schools are "+JSON.stringify(schools, null, 4))

    }).catch(function(error){
         console.log('an error occurred...'+JSON.stringify(error));
    });

    $scope.aha = function(type) {

      console.log("type="+type)

    }

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
            data:[220, 160, 280, 334, 300, 330]
        }
    ]
};

myChart.setOption(option);

      
      $scope.refresh=function() {
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
            data:[320, 160, 280, 334, 300, 330]
        }
    ]
};

myChart.setOption(option);

      }
  });