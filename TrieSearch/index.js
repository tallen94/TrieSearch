'use strict';

angular.module("SearchEngine", ['ngMaterial', 'ngLodash'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
    })
    .directive('dlKeyCode', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $element.bind("keypress", function (event) {
                    var keyCode = event.which || event.keyCode;

                    if (keyCode == $attrs.code) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.dlKeyCode, { $event: event });
                        });
                    }
                });
            }
        }
    })
    .controller("MainCtrl", function ($scope, $http, lodash, Lev, $timeout) {
        $scope.query = "";
        $scope.suggestions = [];
        $scope.previousQueries = [];
        $scope.Images = [];
        $scope.pages = 0;
        $scope.currentPage = 1;
        $scope.searching = false;
        $scope.loadedPrevQuery = false;
        $scope.currentQuery = "";

        $scope.keyPressSearch = function (query) {
            $scope.suggestions = [];
            $scope.currentPage = 0;
            $scope.loadedPrevQuery = false;
            if (query.length > 0) {
                var config = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
                var foundPrevQueries = FindInPreviousQueries($scope.previousQueries, query);
                if (foundPrevQueries.length > 0) {
                    $scope.suggestions.push(foundPrevQueries[0]);
                    $timeout(function () {
                        console.log(query + " " + $scope.query);
                        if (query === $scope.query) {
                            $scope.searching = true;
                            $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + foundPrevQueries[0] + "&callback=JSON_CALLBACK&page=0")
                                .success(function (response) {
                                    $scope.searching = false;
                                    $scope.searchResults = response.data;
                                    $scope.numPages = Range(response.numPages);
                                    $scope.Images = CreateImageArray(response.data);
                                    $scope.loadedPrevQuery = true;
                                    $scope.currentQuery = foundPrevQueries[0];
                                }
                            );
                        }
                    }, 500);
                } else if (query.length >= 5) {
                    $timeout(function () {
                        console.log(query + " " + $scope.query);
                        if (query === $scope.query) {
                            $scope.searching = true;
                            $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + query + "&callback=JSON_CALLBACK&page=0")
                                .success(function (response) {
                                    $scope.searching = false;
                                    $scope.searchResults = response.data;
                                    $scope.numPages = Range(response.numPages);
                                    if (response.data.length > 0) {
                                        $scope.previousQueries.push(query);
                                    }
                                    $scope.Images = CreateImageArray(response.data);
                                    $scope.currentQuery = query;
                                }
                            );
                        }
                    }, 500);
                }

                var data = { s: query }
                $http.post("SearchSuggestions.asmx/GetSuggestions", data, config)
                    .success(function (response) {
                        var suggestions = SortByLev(response.d, query);
                        $scope.suggestions = $scope.suggestions.concat(suggestions.slice($scope.suggestions.length));
                    }
                );
            } else {
                $scope.searchResults = [];
                $scope.currentQuery = "";
            }
        }

        $scope.enterSearch = function (query) {
            $scope.suggestions = [];
            if (query.length > 0 && query != $scope.currentQuery) {
                console.log(query != $scope.currentQuery);
                $scope.searching = true;
                $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + query + "&callback=JSON_CALLBACK&page=0")
                    .success(function (response) {
                        $scope.searching = false;
                        $scope.searchResults = response.data;
                        $scope.numPages = Range(response.numPages);
                        if (response.data.length > 0) {
                            $scope.previousQueries.push(query);
                        }
                        $scope.Images = CreateImageArray(response.data);
                        $scope.currentQuery = query;
                    }
                );
            } 
        }

        $scope.GetPage = function (page) {
            if (page != $scope.currentPage) {
                $scope.currentPage = page;
                $scope.searching = true;
                $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + $scope.query + "&callback=JSON_CALLBACK&page=" + (page - 1))
                    .success(function (response) {
                        $scope.searching = false;
                        $scope.searchResults = response.data;
                        $scope.numPages = Range(response.numPages);
                        $scope.Images = CreateImageArray(response.data);
                        angular.element(document.querySelector(".search-results")).scollTop = 0;
                    }
                );
            }
        }

        $scope.ParseArrayString = function (str) {
            return JSON.parse(str);
        }

        function CreateImageArray(results) {
            var arr = [];
            for (var i = 0; i < results.length; i++) {
                var srcArray = JSON.parse(results[i].Images);
                for (var j = 0; j < srcArray.length; j++) {
                    var img = {
                        src: srcArray[j],
                        href: results[i].Link,
                        title: results[i].Title
                    }
                    arr.push(img);
                }
            }
            return arr;
        }

        function SortByLev(array, query) {
            array = MergeSort(array, query);
            return lodash.take(array, 5);
        }

        function MergeSort(array, query) {
            if (array.length < 2) {
                return array;
            }
            var left = lodash.take(array, array.length / 2);
            var right = lodash.takeRight(array, array.length / 2);
            return Merge(MergeSort(left, query), MergeSort(right, query), query);
        }

        function Merge(left, right, query) {
            var result = []
            var lefti = 0;
            var righti = 0;

            while (lefti < left.length && righti < right.length) {
                if (Lev(query, left[lefti]) < Lev(query, right[righti])) {
                    result.push(left[lefti++]);
                } else {
                    result.push(right[righti++]);
                }
            }
            result = result.concat(left.slice(lefti));
            result = result.concat(right.slice(righti));
            return result;
        }

        function FindInPreviousQueries(arr, str) {
            var queries = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(str) > -1) {
                    queries.push(arr[i]);
                }
            }
            return SortByLev(queries, str);
        }

        function Range(num) {
            var range = [];
            for (var i = 1; i <= num; i++) {
                range.push(i);
            }
            return range;
        }
    })
    .factory("Lev", function () {
        return function (s, t) {
            var d = []; //2d matrix

            // Step 1
            var n = s.length;
            var m = t.length;

            if (n == 0) return m;
            if (m == 0) return n;

            //Create an array of arrays in javascript (a descending loop is quicker)
            for (var i = n; i >= 0; i--) d[i] = [];

            // Step 2
            for (var i = n; i >= 0; i--) d[i][0] = i;
            for (var j = m; j >= 0; j--) d[0][j] = j;

            // Step 3
            for (var i = 1; i <= n; i++) {
                var s_i = s.charAt(i - 1);

                // Step 4
                for (var j = 1; j <= m; j++) {

                    //Check the jagged ld total so far
                    if (i == j && d[i][j] > 4) return n;

                    var t_j = t.charAt(j - 1);
                    var cost = (s_i == t_j) ? 0 : 1; // Step 5

                    //Calculate the minimum
                    var mi = d[i - 1][j] + 1;
                    var b = d[i][j - 1] + 1;
                    var c = d[i - 1][j - 1] + cost;

                    if (b < mi) mi = b;
                    if (c < mi) mi = c;

                    d[i][j] = mi; // Step 6

                    //Damerau transposition
                    if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
                    }
                }
            }

            // Step 7
            return d[n][m];
        }
    });

