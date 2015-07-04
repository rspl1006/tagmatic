/**
 * Created by ivana on 03.07.15..
 */

define(['appModule', 'moment'], function (module, moment) {

    "use strict";

    module.registerController('administrationController', function ($scope,
                                                                    $state,
                                                                    issueService,
                                                                    tagService,
                                                                    milestoneService,
                                                                    projectsService,
                                                                    effortService,
                                                                    $modal,
                                                                    $rootScope) {

        $scope.tags = [];
        $scope.milestones = [];
        $scope.efforts = [];
        $scope.tasks = [];
        $scope.filters = ['Tasks', 'Tags', 'Milestones', 'Efforts'];
        $scope.activeFilter = 'Tasks';

        $scope.isActive = function (filter) {
            return $scope.activeFilter == filter;
        };

        $rootScope.setFilter = function (filter) {

            $scope.activeFilter = filter;

            if (filter == 'Tasks') {
                issueService.getIssueList()
                    .then(function (tasks) {
                        $scope.tasks = tasks;
                    });
            }

            if (filter == 'Tags') {
                tagService.getTagList().then(function (tags) {
                    $scope.tags = tags;
                })
            }

            if (filter == 'Milestones') {
                milestoneService.getMilestoneList().then(function (milestones) {
                    $scope.milestones = milestones;
                })
            }

            if (filter == 'Efforts') {
                effortService.getEffortList().then(function (efforts) {
                    $scope.efforts = efforts;
                })
            }
        };

        $scope.createItem = function () {

            if ($scope.activeFilter == 'Tasks') {
                $modal.open({
                    templateUrl: 'components/issue/issueCreateView.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.issue = {};
                        $scope.submitted = false;

                        projectsService.getProjectList().then(function (data) {
                            $scope.projects = data;
                        });

                        $scope.newIssue = function (isValid) {

                            $scope.submitted = true;

                            if (isValid) {
                                issueService.createIssue($scope.issue).then(function () {
                                    $modalInstance.close();
                                    $rootScope.setFilter('Tasks');
                                });
                            }

                        };

                        $scope.closeModal = function () {
                            $modalInstance.close();
                        }
                    }
                });
            }

            if ($scope.activeFilter == 'Tags') {
                $modal.open({
                    templateUrl: 'components/tag/tagCreateView.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.tag = {};
                        $scope.submitted = false;

                        $scope.newTag = function (isValid) {

                            $scope.submitted = true;

                            if (isValid) {
                                tagService.createTag($scope.tag).then(function () {
                                    $modalInstance.close();
                                    $rootScope.setFilter('Tags');
                                });
                            }

                        };

                        $scope.closeModal = function () {
                            $modalInstance.close();
                        }
                    }
                });
            }

            if ($scope.activeFilter == 'Milestones') {
                $modal.open({
                    templateUrl: 'components/milestone/milestoneCreateView.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.milestone = {};
                        $scope.submitted = false;

                        $scope.today = function () {
                            $scope.milestone.due_date = new Date();
                        };
                        $scope.today();

                        $scope.clear = function () {
                            $scope.milestone.due_date = null;
                        };

                        $scope.open = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            $scope.opened = true;
                        };

                        $scope.dateOptions = {
                            formatYear: 'yy',
                            startingDay: 1
                        };

                        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                        $scope.format = $scope.formats[0];

                        $scope.newMilestone = function (isValid) {

                            $scope.submitted = true;

                            if (isValid) {
                                $scope.milestone.due_date = moment($scope.milestone.due_date).format("YYYY-MM-DD HH:mm")
                                milestoneService.createMilestone($scope.milestone).then(function () {
                                    $modalInstance.close();
                                    $rootScope.setFilter('Milestones');
                                });
                            }

                        };

                        $scope.closeModal = function () {
                            $modalInstance.close();
                        }
                    }
                });
            }

        };


        $scope.setFilter('Tasks');
    })
});