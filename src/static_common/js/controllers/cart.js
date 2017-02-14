//for the cart page

angular.module('myApp.login.success.cart', []).
controller('ReportsController',
  function(avatarService, $location, List, $timeout, Checked, reportService, tableDataService, $scope, cartCounter, $window, $http, authenticationSvc, $state, $filter, $q, $localStorage, $sessionStorage) {
    var token = authenticationSvc.getUserInfo().accessToken;
    //init the ngStorage
    $scope.$storage = $localStorage;
    //console.log("result========"+JSON.stringify(List));

    // console.log("$state.params.url= "+$state.params.url);
    ///////////////////////////////////
    $scope.showMessage = true;

    //show the message when no program added
    $scope.message = "Please add some reports from 'whoops!' or 'enhancement' page first.";
    $scope.itemsByPage = 25;

    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;
    $scope.date = new Date();
    ///////////////////////////////////////
    //user performs no action


    console.log("output Checked programs = " + JSON.stringify(Checked));
    $scope.Checked = Checked;

    //console.log("***checked array = "+JSON.stringify($scope.Checked));
    //$scope.Checked = Checked;


    // $scope.obj1 = {wahaha: ['apple', 'juice']}


    $scope.scrolltop = function() {

      angular.element(document.getElementById('scrolltop_cart')).scrollTop(0);
    }

    // alert('wahaha[0]='+$scope.obj1.wahaha[0]);
    $scope.printReport = function() {
      window.print();

    }

    $scope.togglefullen = function() {
      angular.element(document.getElementById("ViewAll")).toggleClass('fullscreen-modal');


    }

    $scope.ShareAllSelected = function() {
      $scope.url = {
        text: null
      };


      $scope.copied = false;
      new Clipboard('.btn');


      $scope.share_counter = cartCounter.counter();


      var whoops_ids = "";
      var enhancement_ids = "";

      console.log("share_counter"+JSON.stringify($scope.share_counter));

      angular.forEach($scope.share_counter, function(value, index) {

        if($scope.share_counter[index].whoops){
          whoops_ids = whoops_ids + $scope.share_counter[index].Id + '/';
        }

        if($scope.share_counter[index].enhancement){
          enhancement_ids = enhancement_ids + $scope.share_counter[index].Id + '/';
        }


      });

      console.log("whoops_ids="+whoops_ids);
      console.log("enhancement_ids="+enhancement_ids);

      if(whoops_ids === "" && enhancement_ids === ""){
        $.notify({

              // options
              icon: "fa fa-warning",
              message: 'Please make your selection.'
            }, {
              // settings
              type: 'warning',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });

      } else {

         $("#myModal1").modal('toggle');
         $scope.shareLoading = true;
        //  $scope.url = {
        // text: $location.absUrl().split('#')[0] + '#/upgrid/share_selected_report/asd3dhu38dj93jdj93/',

        //  };
         $http({
        url: '/api/upgrid/reports/shared/',
        method: 'POST',
        data: {
          "whoops_id": (whoops_ids === ""? null: whoops_ids.slice(0,-1)),
          "enhancement_id": (enhancement_ids === ""? null: enhancement_ids.slice(0,-1)),

        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        'Content-Type': 'application/json'

      }).then(function(response) {
        

        $scope.shared_id = response.data[0].split('/')[0];
        $scope.shared_token = response.data[0].split('/')[1];
        $scope.shareLoading = false;
        $scope.url = {
          text: location.host + '/static/index.html#' + '/upgrid/share_selected_report/' + $scope.shared_id + '/' + $scope.shared_token + '/',
        };

        console.log("shared_id="+$scope.shared_id);
        console.log("$scope.shared_token"+$scope.shared_token);

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

      }

    }



    $scope.ViewAll = function() {


      App.blocks('#viewall_loading', 'state_loading');

      console.log("$local=" + JSON.stringify($storage.upgrid));
      console.log('storage result= ' + JSON.stringify(cartCounter.counter()));

      $scope.view_counter = cartCounter.counter();

      console.log("$scope.view_counter = " + JSON.stringify($scope.view_counter));
      $scope.report_array = [];

      for (i = 0; i < $scope.view_counter.length; i++) {

        $scope.report_array.push({
          'order': i,
          'w_array_final': [],
          'e_array_final': [],
          'whoops_report_program': $scope.view_counter[i].name,
          'whoops_report_degree': $scope.view_counter[i].degree
        });

      }


      angular.forEach($scope.view_counter, function(value, index) {
        console.log("index=" + index)
        if ($scope.view_counter[index].whoops) {


          console.log("*index=" + index);
          console.log("$scope.view_counter[index].Id" + $scope.view_counter[index].Id);

        
            $http({
                url: '/api/upgrid/update/view/whoops/' + $scope.view_counter[index].Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            //console.log("wwr"+JSON.stringify(response.data));
            // $scope.w_raw = response.data;
            // $scope.w_array_final = [];
            // var w_array_1 = [];
            // var w_array_2 = [];
            // var w_array_3 = [];
            // var w_array_4 = [];
            // var w_array_5 = [];
            // var w_array_6 = [];
            // var w_array_7 = [];
            // var w_array_8 = [];
            // var w_array_9 = [];


            // for (i = 0; i < $scope.w_raw.length; i++) {
            //   if ($scope.w_raw[i].additional_note_type === "dead_link") {

            //     w_array_1.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "typo") {
            //     w_array_2.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "outdated_information") {
            //     w_array_3.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "data_discrepancy") {
            //     w_array_4.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "sidebars") {

            //     w_array_5.push($scope.w_raw[i])
            //   }

            //   if ($scope.w_raw[i].additional_note_type === "infinite_loop") {
            //     w_array_6.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "floating_page") {
            //     w_array_7.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "confusing") {
            //     w_array_8.push($scope.w_raw[i])

            //   }

            //   if ($scope.w_raw[i].additional_note_type === "other_expert_note") {

            //     w_array_9.push($scope.w_raw[i])
            //   }


            // }


            $scope.w_raw = response.data.existing_report;
            $scope.w_array_final = [];
             var w_array_1 = [];
             var w_array_2 = [];
             var w_array_3 = [];
             var w_array_4 = [];
             var w_array_5 = [];
             var w_array_6 = [];
             var w_array_7 = [];
             var w_array_8 = [];
             var w_array_9 = [];
             var w_array_10 = [];

             for(var i=0; i<$scope.w_raw.dead_link.length; i++){
                  w_array_1.push($scope.w_raw.dead_link[i]);
                 }

                 for(var i=0; i<$scope.w_raw.typo.length; i++){
                  w_array_2.push($scope.w_raw.typo[i]);
                 }

                 for(var i=0; i<$scope.w_raw.outdated_information.length; i++){
                  w_array_3.push($scope.w_raw.outdated_information[i]);
                 }

                 for(var i=0; i<$scope.w_raw.data_discrepancy.length; i++){
                  w_array_4.push($scope.w_raw.data_discrepancy[i]);
                 }

                 for(var i=0; i<$scope.w_raw.sidebars.length; i++){
                  w_array_5.push($scope.w_raw.sidebars[i]);
                 }

                 for(var i=0; i<$scope.w_raw.infinite_loop.length; i++){
                  w_array_6.push($scope.w_raw.infinite_loop[i]);
                 }

                 for(var i=0; i<$scope.w_raw.floating_page.length; i++){
                  w_array_7.push($scope.w_raw.floating_page[i]);
                 }

                 for(var i=0; i<$scope.w_raw.confusing.length; i++){
                  w_array_8.push($scope.w_raw.confusing[i]);
                 }

                 for(var i=0; i<$scope.w_raw.other_expert_note.length; i++){
                  w_array_9.push($scope.w_raw.other_expert_note[i]);
                 }

                 w_array_10.push(
                 {
                  "university": response.data.university,
                  "school": response.data.school,
                  "program": response.data.program,
                  "degree": response.data.degree
                 })

            //$scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
        

            $scope.report_array[index].w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });



        }



        //////////////


        if ($scope.view_counter[index].enhancement) {
          

            $http({
                url: '/api/upgrid/update/view/enhancement/' + $scope.view_counter[index].Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {



            //console.log("released report whoops"+ JSON.stringify(response.data));
            // $scope.e_raw = response.data;
            // $scope.e_array_final = [];
            // var e_array_1 = [];
            // var e_array_2 = [];
            // var e_array_3 = [];
            // var e_array_4 = [];
            // var e_array_5 = [];
            // var e_array_6 = [];
            // var e_array_7 = [];
            // var e_array_8 = [];
            // var e_array_9 = [];
            // var e_array_10 = [];

            // for (i = 0; i < $scope.e_raw.length; i++) {
            //   e_array_1.push($scope.e_raw['p' + (i === 0 ? '' : i + 1)]);
            //   e_array_2.push($scope.e_raw['c' + (i === 0 ? '' : i + 1)]);
            //   e_array_3.push($scope.e_raw['t' + (i === 0 ? '' : i + 1)]);
            //   e_array_4.push($scope.e_raw['d' + (i === 0 ? '' : i + 1)]);
            //   e_array_5.push($scope.e_raw['r' + (i === 0 ? '' : i + 1)]);
            //   e_array_6.push($scope.e_raw['ex' + (i === 0 ? '' : i + 1)]);
            //   e_array_7.push($scope.e_raw['Intl_transcript' + (i === 0 ? '' : i + 1)]);
            //   e_array_8.push($scope.e_raw['Intl_eng_test' + (i === 0 ? '' : i + 1)]);
            //   e_array_9.push($scope.e_raw['s' + (i === 0 ? '' : i + 1)]);
            //   e_array_10.push($scope.e_raw['dura' + (i === 0 ? '' : i + 1)]);

            // }

            $scope.e_raw = response.data.existing_report;
             $scope.e_array_final = [];
             var e_array_1 = [];
             var e_array_2 = [];
             var e_array_3 = [];
             var e_array_4 = [];
             var e_array_5 = [];
             var e_array_6 = [];
             var e_array_7 = [];
             var e_array_8 = [];
             var e_array_9 = [];
             var e_array_10 = [];

             for(i=0; i<$scope.e_raw.length; i++)
             {
               e_array_1.push($scope.e_raw['p'+(i===0?'':i+1)]);
               e_array_2.push($scope.e_raw['c'+(i===0?'':i+1)]);
               e_array_3.push($scope.e_raw['t'+(i===0?'':i+1)]);
               e_array_4.push($scope.e_raw['d'+(i===0?'':i+1)]);
               e_array_5.push($scope.e_raw['r'+(i===0?'':i+1)]);
               e_array_6.push($scope.e_raw['ex'+(i===0?'':i+1)]);
               e_array_7.push($scope.e_raw['Intl_transcript'+(i===0?'':i+1)]);
               e_array_8.push($scope.e_raw['Intl_eng_test'+(i===0?'':i+1)]);
               e_array_9.push($scope.e_raw['s'+(i===0?'':i+1)]);
               e_array_10.push($scope.e_raw['dura'+(i===0?'':i+1)]);

             }

            $scope.report_array[index].e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10];
            //App.blocks('#enhancement_loading', 'state_normal');

            //console.log('e_array_1='+JSON.stringify($scope.e_array_final));


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });



        }


      });



      $q.all($scope.report_array).then(function(result) {

        App.blocks('#viewall_loading', 'state_normal');
      });


    }



    if (false) {

      $scope.showMessage = false;

      $scope.showFilter = true;

      var preData = tableDataService.getCart(List);
      console.log("preData= " + JSON.stringify(preData));
      $scope.data = [];
      for (i = 0; i < preData.length; i++) {
        //data[i].programName = $scope.programs[i].program_name;

        //check if undefined
        if ($scope.$storage.upgrid[preData[i].programName + preData[i].degreeName] !== undefined) {

          //check if has true value
          if ($scope.$storage.upgrid[preData[i].programName + preData[i].degreeName].whoops === true || $scope.$storage.upgrid[preData[i].programName + preData[i].degreeName].enhancement === true)
            $scope.data.push({
              "programId": preData[i].programId,
              "programName": preData[i].programName,
              "degreeName": preData[i].degreeName,
              "status": preData[i].status,
              "confirm": preData[i].confirm,
              "notes": preData[i].notes,
              "competing": preData[i].competing
            });

        }


      }


      console.log("D.A.T.A = " + JSON.stringify($scope.data));



      $scope.degreeSelection = [];
      //remove the duplicate degree
      for (i = 0; i < $scope.data.length; i++) {
        var exists = false;
        for (j = 0; j < $scope.degreeSelection.length; j++) {
          if ($scope.data[i].degreeName === $scope.degreeSelection[j]) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          $scope.degreeSelection.push($scope.data[i].degreeName);
        };

      };


      ///////////////////////////////////

      // WHOOPS
      $scope.pdfViewerWhoops = function(Id) {
        PDFObject.embed("#", "#my-container");
        $scope.viewerLoading = true;
        $http({
          url: '/api/whoops/',
          method: 'POST',
          data: {
            "object_id": Id
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true



        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          $scope.pdflink = fileURL;
          console.log("link = " + $scope.pdflink);
          console.log("success");
          console.log("dismissing progress bar");
          $scope.viewerLoading = false;
          PDFObject.embed(fileURL, "#my-container");



        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));
          $scope.viewerLoading = false;
        }).finally(function() {
          // $scope.viewerLoading=false;
        });



      }

      $scope.pdfDownloadWhoops = function(Id, name, degree) {

        $http({
          url: '/api/whoops/',
          method: 'POST',
          data: {
            "object_id": Id
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true



        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);

          console.log("success");

          saveAs(file, 'Whoops_Report-' + name + '(' + degree + ')' + '.pdf');


        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });



      }

      $scope.pdfShareWhoops = function(Id) {
        $scope.url = {
          text: null
        };
        $scope.shareLoading = true;
        $scope.copied = false;
        new Clipboard('.btn');
        $http({
          url: '/api/whoops/',
          method: 'POST',
          data: {
            "object_id": Id
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true


        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          $scope.pdflink = fileURL;
          console.log("link = " + $scope.pdflink);
          //window.open(fileURL);
          console.log("success");
          $scope.shareLoading = false;
          console.log("dismiss share progress");
          $scope.url = {
            text: fileURL
          };


        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));
          $scope.shareLoading = false;
        });

      };

      // ENHANCEMENT

      $scope.pdfViewerEnhancement = function(Id, competing) {
        PDFObject.embed("#", "#my-container1");
        $scope.viewerLoading = true;

        var competingUrl = Id + '/';
        //console.log('caught! '+program+' '+degree);
        for (i = 0; i < competing.length; i++) {

          competingUrl += competing[i].programId + '/';
        }

        $http({
          url: '/api/enhancement/',
          method: 'POST',
          data: {
            object_id: competingUrl.slice(0, -1)
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true



        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          $scope.pdflink = fileURL;
          console.log("link = " + $scope.pdflink);
          //window.open(fileURL);
          console.log("success");
          console.log("dismissing progress bar");
          $scope.viewerLoading = false;
          PDFObject.embed(fileURL, "#my-container1");


        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));
          $scope.viewerLoading = false;
        });


      };


      $scope.pdfDownloadEnhancement = function(Id, competing, name, degree) {
        console.log("downloading");
        var competingUrl = Id + '/';

        //console.log('caught! '+program+' '+degree);
        for (i = 0; i < competing.length; i++) {

          competingUrl += competing[i].programId + '/';
        }

        $http({
          url: '/api/enhancement/',
          method: 'POST',
          data: {
            object_id: competingUrl.slice(0, -1)
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true



        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          //$scope.pdflink = fileURL;
          //window.open(fileURL);
          console.log("success");

          //   console.log("response="+JSON.stringify(response));
          // console.log("###########################");
          // var blob = new Blob([data], {type: 'application/pdf'});
          // $scope.pdfURL = window.(window.URL||window.webkitURL).createObjectURL(blob);
          // window.open($scope.pdfURL);
          //console.log("data.data = "+JSON.stringify(data.data));
          // var file = new Blob(["Hi boy"],{type: 'application/pdf'});
          saveAs(file, 'Enhancement_Report-' + name + '(' + degree + ')' + '.pdf');
          // var blob = new Blob(["Hello, world!"], {type: 'application/pdf'});
          // saveAs(blob, "hello world.pdf");
          //saveAs(new Blob(['hello world'], {type: 'application/pdf'}), 'sample.pdf');
          // var fileURL = (window.URL||window.webkitURL).createObjectURL(file);
          //console.log("GOT! detail="+ JSON.stringify($scope.pdf));

        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });



      }


      $scope.pdfShareEnhancement = function(Id, competing) {
        $scope.url = {
          text: null
        };
        $scope.shareLoading = true;



        $scope.copied = false;
        new Clipboard('.btn');



        var competingUrl = Id + '/';
        //console.log('caught! '+program+' '+degree);
        for (i = 0; i < competing.length; i++) {

          competingUrl += competing[i].programId + '/';
        }

        $http({
          url: '/api/enhancement/',
          method: 'POST',
          data: {
            object_id: competingUrl.slice(0, -1)
          },
          headers: {
            'Authorization': 'JWT ' + token
          },
          // 'Content-Type': 'application/json'
          responseType: 'arraybuffer'
            // cache: true



        }).then(function(response) {
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          $scope.pdflink = fileURL;
          console.log("link = " + $scope.pdflink);
          //window.open(fileURL);
          console.log("success");
          //PDFObject.embed(fileURL,"#my-container");
          $scope.shareLoading = false;
          console.log("dismiss share progress");
          $scope.url = {
            text: fileURL
          };


          //   console.log("response="+JSON.stringify(response));
          // console.log("###########################");
          // var blob = new Blob([data], {type: 'application/pdf'});
          // $scope.pdfURL = window.(window.URL||window.webkitURL).createObjectURL(blob);
          // window.open($scope.pdfURL);
          //console.log("data.data = "+JSON.stringify(data.data));
          // var file = new Blob(["Hi boy"],{type: 'application/pdf'});
          //saveAs(file, 'hello.pdf');
          // var blob = new Blob(["Hello, world!"], {type: 'application/pdf'});
          // saveAs(blob, "hello world.pdf");
          //saveAs(new Blob(['hello world'], {type: 'application/pdf'}), 'sample.pdf');
          // var fileURL = (window.URL||window.webkitURL).createObjectURL(file);
          //console.log("GOT! detail="+ JSON.stringify($scope.pdf));

        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));
          $scope.shareLoading = false;
        });

      };


      $scope.DownloadAll = function() {

        App.blocks('#reports', 'state_loading');
        var fileArray = [];

        console.log("$scope.Checked = " + JSON.stringify($scope.Checked));
        console.log("length= " + $scope.Checked.length);
        for (i = 0; i < $scope.Checked.length; i++) {


          fileArray.push(i);
          // fileSystem += $scope.data[i].programName+ " (" +$scope.data[i].degreeName + ") ";
          //check if has true value
          if ($scope.Checked[i].WId) {

            //console.log("found one checked WHOOPS");
            //get the report link
            fileArray.push("W");
            fileArray.push(reportService.downloadWhoops($scope.Checked[i].WId, token));

          }
          //end of whoops

          if ($scope.Checked[i].EId) {

            fileArray.push("E");
            //get the report link
            fileArray.push(reportService.downloadEnhancement($scope.Checked[i].EId, token));

          }
          //end of enhancement



        }
        //end of program loop
        console.log("fileArray = " + JSON.stringify(fileArray))

        $q.all(fileArray).then(function(result) {
          // var fileSystemBlob = new Blob([fileSystem], {type: 'text/html'});
          // var fileSystemURL = (window.URL||window.webkitURL).createObjectURL(fileSystemBlob);
          console.log("array is " + JSON.stringify(result));
          //var file = new Blob([result[4]], {type: 'application/pdf'});
          //saveAs(result[4], 'En_Report.pdf');

          // var zip = new JSZip();
          // zip.file("enhancement.txt", "haha");
          // var img = zip.folder("images");
          // img.file("en.pdf", result[4]);
          // zip.generateAsync({type:"blob"})
          // .then(function(content) {
          //     // see FileSaver.js
          //     saveAs(content, "reports1.zip");
          // });
          var zip = new JSZip();
          var newfolder;
          for (i = 0; i < result.length; i++) {
            if (!isNaN(result[i])) {
              newfolder = zip.folder($scope.Checked[result[i]].name + " (" + $scope.Checked[result[i]].degree + ") ");
            }

            if (result[i] === "W") {
              newfolder.file("whoops_report.pdf", result[i + 1]);
            }

            if (result[i] === "E") {
              newfolder.file("enhancement_report.pdf", result[i + 1]);
            }
          }
          zip.generateAsync({
              type: "blob"
            })
            .then(function(content) {
              // see FileSaver.js
              saveAs(content, "UpgridReports.zip");
            });
          App.blocks('#reports', 'state_normal');

        });

      }

      $scope.ShareAll = function() {
          // console.log("In the storage: "+JSON.stringify($scope.$storage.upgrid));
          // var deferred = $q.defer();
          // var fileSystem = "<h1>Upgrid Reports</h1><hr/>";
          $scope.url = {
            text: null
          };
          $scope.shareLoading = true;

          $scope.copied = false;
          new Clipboard('.btn');

          var fileArray = [];


          for (i = 0; i < $scope.data.length; i++) {


            if ($scope.$storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] !== undefined) {
              //console.log("found one checked PROGRAM");
              //either is true
              if ($scope.$storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].whoops === true || $scope.$storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].enhancement === true) {
                fileArray.push(i);
                // fileSystem += $scope.data[i].programName+ " (" +$scope.data[i].degreeName + ") ";
                //check if has true value
                if ($scope.$storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].whoops === true) {

                  //console.log("found one checked WHOOPS");
                  //get the report link
                  fileArray.push("W");
                  fileArray.push(reportService.getWhoops($scope.data[i].programId, token));

                }
                //end of whoops


                if ($scope.$storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].enhancement === true) {

                  fileArray.push("E");
                  //get the report link
                  fileArray.push(reportService.getEnhancement($scope.data[i].programId, $scope.data[i].competing, token));



                }
                //end of enhancement



              }
            }
            //end of one defined program

          }
          //end of program loop

          $q.all(fileArray).then(function(result) {
            // var fileSystemBlob = new Blob([fileSystem], {type: 'text/html'});
            // var fileSystemURL = (window.URL||window.webkitURL).createObjectURL(fileSystemBlob);
            console.log("array is " + JSON.stringify(result));
            var fileSystem = "<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' rel='stylesheet' integrity='sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1' crossorigin='anonymous'><h2>Upgrid Service Reports</h2><hr/>";
            for (i = 0; i < result.length; i++) {
              if (!isNaN(result[i])) {
                fileSystem += "<i class='fa fa-folder-open-o' aria-hidden='true'></i>" + "&nbsp;&nbsp;" + $scope.data[result[i]].programName + " (" + $scope.data[result[i]].degreeName + ") <br/>";
              }

              if (result[i] === "W") {
                fileSystem += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-file-text' aria-hidden='true'></i>&nbsp;&nbsp;<a href='" + result[i + 1] + "' download>Whoops Report</a><br/>"
              }

              if (result[i] === "E") {
                fileSystem += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-file-text' aria-hidden='true'></i>&nbsp;&nbsp;<a href='" + result[i + 1] + "' download>Enhancement Report</a><br/>"
              }
            }

            var fileSystemBlob = new Blob([fileSystem], {
              type: 'text/html'
            });
            var fileSystemURL = (window.URL || window.webkitURL).createObjectURL(fileSystemBlob);
            $scope.shareLoading = false;

            $scope.url = {
              text: fileSystemURL
            };
            console.log("fileSystem url is = " + fileSystemURL);

          });


        } //end of ShareAll

      //checkbox sync with previous pages
      $scope.checkbox = function() {

        if (cartCounter.countNo().length < preData.length) {
          $scope.$storage.checkAllwhoops = false;
          $scope.$storage.checkAllenhancement = false;

        } else { //all defined
          $scope.$storage.checkAllwhoops = true;

          for (var key in $scope.$storage.upgrid) {
            if ($scope.$storage.upgrid[key].whoops !== true) {
              $scope.$storage.checkAllwhoops = false;
              console.log('set checkAll-whoops false')

              break;

            }

          };

          $scope.$storage.checkAllenhancement = true;
          //obj
          for (var key in $scope.$storage.upgrid) {
            if ($scope.$storage.upgrid[key].enhancement !== true) {
              $scope.$storage.checkAllenhancement = false;
              console.log('set checkAll-enhancement false');
              break;

            };
          }

        };

      };
    };


  });