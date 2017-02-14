angular.module('ajaxModule', []).factory("ajaxService",
    function($http, $q, $filter, $timeout) {


        function getResult(start, number, params, token, enhancement, avatar) {

            var deferred = $q.defer();

            console.log("page num =  " + (start / number + 1));
            console.log("number =" + number);
            console.log("params="+JSON.stringify(params));
            if (number === 25) {
                console.log("page number 25");
                    
                        $http({
                            url: "/api/upgrid/user/program/"+(params.search.predicateObject ? ("?name=" + (params.search.predicateObject.programName ? params.search.predicateObject.programName : "") + "&degree=" + (params.search.predicateObject.degreeName ? params.search.predicateObject.degreeName : "") + "&wfs=" + (params.search.predicateObject.whoops_status ? params.search.predicateObject.whoops_status : "") + "&efs=" + (params.search.predicateObject.enhancement_status ? params.search.predicateObject.enhancement_status : "")) :"?") + enhancement + avatar + "&order=" + (params.sort.reverse ? "-" : "") + (params.sort.predicate ? (params.sort.predicate === "programName" ? "oname" : false || params.sort.predicate === "degreeName" ? "degree" : false || params.sort.predicate === "whoops_status" ? "wfs" : false || params.sort.predicate === "enhancement_status" ? "efs" : false) : "oname") + "&page=" + (start / number + 1),
                            method: 'GET',

                            headers: {
                                'Authorization': 'JWT ' + token
                            }

                        }).then(function(response) {
                            //  console.log("response.data.results[0] is "+JSON.stringify(response.data.results[0]));
                            // console.log("response.data.results[0].customer.split('#')[1] is "+JSON.stringify(response.data.results[0].customer.split('#')[1]));

                            console.log("@@@GOT! ajax detail=" + JSON.stringify(response));
                            deferred.resolve({
                                raw: response.data,
                                data: response.data.results,
                                // total: response.data.count,
                                // available: parseInt(response.data.results[0].customer.split('#')[1]),
                                numberOfPages: Math.ceil(response.data.count / number)
                            });
                        }).
                        catch(function(error) {
                            console.log('an error occurred...' + JSON.stringify(error));

                        });

            } else if (number === 50) {
                            console.log("page number 50");
                            var part1 = [];
                            var part2 = [];
               
                            $http({
                            url: "/api/upgrid/user/program/"+(params.search.predicateObject ? ("?name=" + (params.search.predicateObject.programName ? params.search.predicateObject.programName : "") + "&degree=" + (params.search.predicateObject.degreeName ? params.search.predicateObject.degreeName : "") + "&wfs=" + (params.search.predicateObject.whoops_status ? params.search.predicateObject.whoops_status : "") + "&efs=" + (params.search.predicateObject.enhancement_status ? params.search.predicateObject.enhancement_status : "")) :"?") + enhancement + avatar + "&order=" + (params.sort.reverse ? "-" : "") + (params.sort.predicate ? (params.sort.predicate === "programName" ? "oname" : false || params.sort.predicate === "degreeName" ? "degree" : false || params.sort.predicate === "whoops_status" ? "wfs" : false || params.sort.predicate === "enhancement_status" ? "efs" : false) : "oname") + "&page=" + (start / number + 1),
                            method: 'GET',

                            headers: {
                                'Authorization': 'JWT ' + token
                            }
                        }).then(function(response) {

                            part1 = response.data.results;
                            
                            if (!response.data.next) {
                                deferred.resolve({
                                    raw: response.data,
                                    data: response.data.results,
                                    // total: response.data.count,
                                    // available: parseInt(response.data.results[0].customer.split("#")[1]),
                                    numberOfPages: Math.ceil(response.data.count / number)
                                });

                            } else {
                                $http({
                                    url: response.data.next+enhancement,
                                    method: 'GET',

                                    headers: {
                                        'Authorization': 'JWT ' + token
                                    }
                                }).then(function(response) {


                                    part2 = response.data.results;
                                    deferred.resolve({
                                        raw: response.data,
                                        data: part1.concat(part2),
                                        // total: response.data.count,
                                        // available: parseInt(response.data.results[0].customer.split("#")[1]),
                                        numberOfPages: Math.ceil(response.data.count / number)
                                    });

                                    //console.log("_______final result = "+JSON.stringify(part1.concat(part2)));

                                }).
                                catch(function(error) {
                                    console.log('an error occurred...' + JSON.stringify(error));

                                });

                            }


                        }).
                        catch(function(error) {
                            console.log('an error occurred...' + JSON.stringify(error));

                        });



            }

               

            return deferred.promise;
        }

        return {
            getResult: getResult
        };

    });