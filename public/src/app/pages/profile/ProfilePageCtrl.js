/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profile')
        .controller('ProfilePageCtrl', ProfilePageCtrl);

    /** @ngInject */
    function ProfilePageCtrl($scope, fileReader, $filter, $uibModal) {
        $scope.picture = $filter("profilePicture")("Nasta");
        $scope.removePicture = function () {
            $scope.picture = $filter("appImage")("theme/no-photo.png"), $scope.noPicture = !0
        };
        $scope.uploadPicture = function () {
            var e = document.getElementById("uploadFile");
            $scope.click()
        };
        $scope.socialProfiles = [{
            name: "Facebook",
            href: "https://www.facebook.com/akveo/",
            icon: "socicon-facebook"
        }, {
            name: "Twitter",
            href: "https://twitter.com/akveo_inc",
            icon: "socicon-twitter"
        }, {
            name: "Google",
            icon: "socicon-google"
        }, {
            name: "LinkedIn",
            href: "https://www.linkedin.com/company/akveo",
            icon: "socicon-linkedin"
        }, {
            name: "GitHub",
            href: "https://github.com/akveo",
            icon: "socicon-github"
        }, {
            name: "StackOverflow",
            icon: "socicon-stackoverflow"
        }, {
            name: "Dribbble",
            icon: "socicon-dribble"
        }, {
            name: "Behance",
            icon: "socicon-behace"
        }];
        $scope.unconnect = function (e) {
            $scope.href = void 0
        };
        $scope.showModal = function (e) {
            $uibModal.open({
                animation: !1,
                controller: "ProfileModalCtrl",
                templateUrl: "app/pages/profile/profileModal.html"
            }).result.then(function (t) {
                $scope.href = t
            })
        };
        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.file, $scope).then(function (t) {
                $scope.picture = t
            })
        };
        $scope.switches = [!0, !0, !1, !0, !0, !1]
    }

})();