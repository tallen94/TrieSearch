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
    .controller("MainCtrl", function ($scope, $http, lodash, Lev) {
        $scope.query = "";
        $scope.suggestions = [];

        $scope.keyPressSearch = function (query) {
            if (query.length >= 3) {
                var config = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
                $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + query + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        $scope.searchResults = response;
                    }
                );
                var data = { s: query }
                $http.post("SearchSuggestions.asmx/GetSuggestions", data, config)
                    .success(function (response) {
                        $scope.suggestions = $scope.suggestions = SortByLev(response.d, query);
                    }
                );

            } else {
                $scope.searchResults = [];
                $scope.suggestions = [];
            }
        }

        $scope.enterSearch = function (query) {
            $scope.query = query;
            if (query.length > 0) {
                $http.jsonp("http://localhost:51949/Admin.asmx/GetPages?query=" + query + "&callback=JSON_CALLBACK&shouldCache=true")
                    .success(function (response) {
                        $scope.searchResults = response;
                        $scope.suggestions = [];
                    }
                );
            } 
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

