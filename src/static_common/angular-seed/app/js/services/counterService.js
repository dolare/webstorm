//for counting the number of program checked, then display the num on the cart

angular.module('counterServiceModule', [])
    .factory('cartCounter', function($localStorage, $sessionStorage) {


        var countNo = function(name) {

            $storage = $localStorage;

            counterArray = [];

            //add to the array
            for (var key in $storage.counter1) {
                //var counterobj ={};
                if ($storage.counter1[key].whoops === true || $storage.counter1[key].enhancement === true) {

                    counterArray.push(key);
                };
            };


            var count = 0;


            for (i = 0; i < counterArray.length; i++) {
                for (j = i + 1; j < counterArray.length; j++) {
                    if (counterArray[i] === counterArray[j]) {
                        counterArray.splice(j, 1);
                        break;
                    }

                }
            }

            //count = counterArray.length;
            return counterArray;

        };


        var counter = function() {

            $storage = $localStorage;

            var checkedArray0 = [];
            var checkedArray = [];
            //add to the array
            for (var key in $storage.upgrid) {
                   
                    if($storage.upgrid[key]!==undefined &&JSON.stringify($storage.upgrid[key]) !=="{}"){
                        if(JSON.stringify($storage.upgrid[key].whoops) || JSON.stringify($storage.upgrid[key].enhancement)){
                                checkedArray0.push({
                                "name": key,
                                "WId": $storage.upgrid[key]["WId"],
                                "EId": $storage.upgrid[key]["EId"],
                                "WStatus": $storage.upgrid[key]["WStatus"],
                                "EStatus": $storage.upgrid[key]["EStatus"],
                                "WNotes": $storage.upgrid[key]["WNotes"],
                                "EConfirm": $storage.upgrid[key]["EConfirm"]
                            })
                        }
                     }
                
            };

            for(i=0; i<checkedArray0.length; i++){
              checkedArray.push({
                "name": checkedArray0[i].name.split("|")[0],
                "degree": checkedArray0[i].name.split("|")[1],
                "WId": checkedArray0[i].WId,
                "EId": checkedArray0[i].EId,
                "WStatus": checkedArray0[i].WStatus,
                "EStatus": checkedArray0[i].EStatus,
                "WNotes": checkedArray0[i].WNotes,
                "EConfirm": checkedArray0[i].EConfirm
              })
            }





            //count = counterArray.length;
            return checkedArray;

        };




        return {
            countNo: countNo,
            counter: counter



        };



    });