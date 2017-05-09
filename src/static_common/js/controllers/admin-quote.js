// ********************************Quote********************************
angular.module('myApp').controller('QuoteController', ['$scope', '$localStorage', '$window',
  function($scope, $localStorage, $window) {


    $scope.user_program = 0;
    $scope.competing_program = 0;
    $scope.programs = $scope.user_program * ($scope.competing_program + 1);
    $scope.discount = 1;
    $scope.rate = "$112";
    $scope.ApplyPromo = function() {
      if ($scope.promocode.toUpperCase() === "ONSITE15" || $scope.promocode.toUpperCase() === 'ALMAMATER50' || $scope.promocode.toUpperCase() === 'ALMAMATER40' || $scope.promocode.toUpperCase() === 'ALMAMATER30' || $scope.promocode.toUpperCase() === 'ALMAMATER20') {


        if ($scope.promocode.toUpperCase() === 'ONSITE15') {
          $scope.discount = 0.85;
          $.notify({

            // options
            icon: "fa fa-check",
            message: 'The code has been successfully applied !'
          }, {
            // settings
            type: 'success',
            placement: {
              from: "top",
              align: "center"
            },
            z_index: 1999,
          });
        }

        if ($scope.promocode.toUpperCase() === 'ALMAMATER50') {


          if ($scope.result > 40000) {
            $scope.discount = 0.5;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $40,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });

          }

        }

        if ($scope.promocode.toUpperCase() === 'ALMAMATER40') {


          if ($scope.result > 30000) {
            $scope.discount = 0.6;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $30,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }


        if ($scope.promocode.toUpperCase() === 'ALMAMATER30') {


          if ($scope.result > 20000) {
            $scope.discount = 0.7;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $20,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }


        if ($scope.promocode.toUpperCase() === 'ALMAMATER20') {


          if ($scope.result > 10000) {
            $scope.discount = 0.8;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $10,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }



      } else {

        $scope.discount = 1;
        $.notify({


          // options
          icon: "fa fa-times",
          message: 'Please enter a valid code.'
        }, {
          // settings
          type: 'danger',
          placement: {
            from: "top",
            align: "center"
          },
        });
      }

    }

    $scope.$watchGroup(['user_program', 'competing_program'], function(newValues, oldValues, scope) {
      //alert("changed");
      if (!isNaN($scope.user_program) && !isNaN($scope.competing_program) && $scope.user_program > 0 && $scope.user_program < 251 && $scope.competing_program >= 0 && $scope.competing_program < 11) {
        $scope.programs = $scope.user_program * ($scope.competing_program + 1);
        $scope.result = $scope.programs > 300 ? 91500 + 200 * ($scope.programs - 300) : 75 * Math.ceil($scope.programs / 15) * (Math.ceil($scope.programs / 15) - 1) + (410 - 10 * Math.ceil($scope.programs / 15)) * $scope.programs;

      } else {
        $scope.result = 0;
      }

    });
    jQuery('.js-validation-bootstrap').validate({
      ignore: [],
      errorClass: 'help-block animated fadeInDown',
      errorElement: 'div',
      errorPlacement: function(error, e) {
        jQuery(e).parents('.form-group > div').append(error);
      },
      highlight: function(e) {
        var elem = jQuery(e);

        elem.closest('.form-group').removeClass('has-error').addClass('has-error');
        elem.closest('.help-block').remove();
      },
      success: function(e) {
        var elem = jQuery(e);

        elem.closest('.form-group').removeClass('has-error');
        elem.closest('.help-block').remove();
      },
      rules: {
        'val-username': {
          required: true,
          minlength: 3
        },
        'val-email': {
          required: true,
          email: true
        },
        'val-password': {
          required: true,
          minlength: 5
        },
        'val-confirm-password': {
          required: true,
          equalTo: '#val-password'
        },
        'val-select2': {
          required: true
        },
        'val-select2-multiple': {
          required: true,
          minlength: 2
        },
        'val-suggestions': {
          required: true,
          minlength: 5
        },
        'val-skill': {
          required: true
        },
        'val-currency': {
          required: true,
          currency: ['$', true]
        },
        'val-website': {
          required: true,
          url: true
        },
        'val-phoneus': {
          required: true,
          phoneUS: true
        },
        'val-digits': {
          required: true,
          digits: true
        },
        'val-number': {
          required: true,
          number: true
        },
        'val-range': {
          required: true,
          range: [1, 5]
        },
        'val-terms': {
          required: true
        }
      },
      messages: {
        'val-username': {
          required: 'Please enter a username',
          minlength: 'Your username must consist of at least 3 characters'
        },
        'val-email': 'Please enter a valid email address',
        'val-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long'
        },
        'val-confirm-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long',
          equalTo: 'Please enter the same password as above'
        },
        'val-select2': 'Please select a value!',
        'val-select2-multiple': 'Please select at least 2 values!',
        'val-suggestions': 'What can we do to become better?',
        'val-skill': 'Please select a skill!',
        'val-currency': 'Please enter a price!',
        'val-website': 'Please enter your website!',
        'val-phoneus': 'Please enter a US phone!',
        'val-digits': 'Please enter only digits!',
        'val-number': 'Please enter a number!',
        'val-range': 'Please enter a number between 1 and 5!',
        'val-terms': 'You must agree to the service terms!'
      }
    });



    // Chart.js v2 Charts, for more examples you can check out http://www.chartjs.org/docs
    var initChartsChartJSv2 = function() {
      // Set Global Chart.js configuration
      Chart.defaults.global.defaultFontColor = '#999';
      Chart.defaults.global.defaultFontFamily = 'Open Sans';
      Chart.defaults.global.defaultFontStyle = '600';
      Chart.defaults.scale.gridLines.color = "rgba(0,0,0,.05)";
      Chart.defaults.scale.gridLines.zeroLineColor = "rgba(0,0,0,.1)";
      Chart.defaults.global.elements.line.borderWidth = 2;
      Chart.defaults.global.elements.point.radius = 4;
      Chart.defaults.global.elements.point.hoverRadius = 6;
      Chart.defaults.global.tooltips.titleFontFamily = 'Source Sans Pro';
      Chart.defaults.global.tooltips.titleFontSize = 14;
      Chart.defaults.global.tooltips.bodyFontFamily = 'Open Sans';
      Chart.defaults.global.tooltips.bodyFontSize = 13;
      Chart.defaults.global.tooltips.cornerRadius = 3;
      Chart.defaults.global.tooltips.backgroundColor = "rgba(137,189,255,0.85)";
      Chart.defaults.global.legend.labels.boxWidth = 15;

      // Get Chart Containers
      //var $chart2LinesCon  = jQuery('.js-chartjs2-lines');
      var $chart2BarsCon = jQuery('.js-chartjs2-bars');

      // Set Chart and Chart Data variables
      var $chart2Lines, $chart2Bars;


      // Lines/Bar/Radar Chart Data
      var $chart2LinesBarsRadarData = {
        labels: ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150', '165', '180', '195', '210', '225', '240', '255', '270', '285', '300', '315', '330', '...'],
        datasets: [

          {
            label: 'THE LADDER PRICING MODEL',
            fill: true,
            backgroundColor: 'rgba(171, 227, 125, .3)',
            borderColor: 'rgba(112,185, 235, 0.5)',
            pointBackgroundColor: 'rgba(171, 227, 125, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(171, 227, 125, 1)',
            data: [400, 390, 380, 370, 360, 350, 340, 330, 320, 310, 300, 290, 280, 270, 260, 250, 240, 230, 220, 210, 200, 200, 200]

          }
        ]
      };

      $chart2Bars = new Chart($chart2BarsCon, {
        highlightFromIndex: 3,
        type: 'bar',
        data: $chart2LinesBarsRadarData,
        options: {

          responsive: true,
          maintainAspectRatio: true,

          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'PRICE / PROGRAM'
              },

              ticks: {

                min: 150,
                beginAtZero: true,
                max: 450,
                userCallback: function(value, index, values) {
                  // Convert the number to a string and splite the string every 3 charaters from the end
                  value = value.toString();
                  value = value.split(/(?=(?:...)*$)/);

                  // Convert the array to a string and format the output
                  value = value.join('.');
                  return '$' + value;
                }
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SELECTED PROGRAMS'
              },


            }],

          },

          tooltips: {

            enabled: true,
            mode: 'single',
            callbacks: {
              title: function(tooltipItem, data) {
                if (data.labels[tooltipItem[0].index] < 315) {
                  var display = data.labels[tooltipItem[0].index] - 14 + ' ~ ' + data.labels[tooltipItem[0].index];
                } else {
                  var display = "300+";
                }

                return display + " programs";

              },
              label: function(tooltipItems, data) {
                return 'Price: ' + '$ ' + tooltipItems.yLabel + '/program';
              }
            }
          },

        }


      });
    };

    initChartsChartJSv2();


    Chart.pluginService.register({
      beforeUpdate: function(chartInstance) {
        var yvalue;
        if ($scope.programs === 0) {
          yvalue = 500
        } else if ($scope.programs <= 15) {
          yvalue = 400
        } else if ($scope.programs <= 30) {
          yvalue = 390
        } else if ($scope.programs <= 45) {
          yvalue = 380
        } else if ($scope.programs <= 60) {
          yvalue = 370
        } else if ($scope.programs <= 75) {
          yvalue = 360
        } else if ($scope.programs <= 90) {
          yvalue = 350
        } else if ($scope.programs <= 105) {
          yvalue = 340
        } else if ($scope.programs <= 120) {
          yvalue = 330
        } else if ($scope.programs <= 135) {
          yvalue = 320
        } else if ($scope.programs <= 150) {
          yvalue = 310
        } else if ($scope.programs <= 165) {
          yvalue = 300
        } else if ($scope.programs <= 180) {
          yvalue = 290
        } else if ($scope.programs <= 195) {
          yvalue = 280
        } else if ($scope.programs <= 210) {
          yvalue = 270
        } else if ($scope.programs <= 225) {
          yvalue = 260
        } else if ($scope.programs <= 240) {
          yvalue = 250
        } else if ($scope.programs <= 255) {
          yvalue = 240
        } else if ($scope.programs <= 270) {
          yvalue = 230
        } else if ($scope.programs <= 285) {
          yvalue = 220
        } else if ($scope.programs <= 300) {
          yvalue = 210
        } else if ($scope.programs > 300) {
          yvalue = 200
        }
        chartInstance.data.datasets.forEach(function(dataset) {
          dataset.backgroundColor = dataset.data.map(function(data) {


           

            return data >= yvalue ? 'rgba(112,185, 235, 0.4)' : 'rgba(243, 243, 243, 1)';
          })
        })
      }
    });



    $scope.$watch('programs', function() {
      console.log('monitoring...');
      //console.log('STORAGE in success.js= '+JSON.stringify($scope.$storage));

      //get the number of program checked and display the count on the cart icon
      
      //$chart2Bars.update();
      initChartsChartJSv2();

    }, true);

  }
]);
