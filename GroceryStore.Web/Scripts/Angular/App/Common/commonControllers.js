﻿(function () {

    var module = angular.module('commonControllers', []);

    module.controller('navbarController', ['product', 'productService', 'categoryService', 'priceSetService', 'relationshipService', function (product, productService, categoryService, priceSetService, relationshipService) {

        var ctrl = this;
        ctrl.productService = productService;
        ctrl.categoryService = categoryService;
        ctrl.priceSetService = priceSetService;
        ctrl.relationshipService = relationshipService;

        ctrl.product = new product();

        ctrl.getActiveProducts = function () {
            product.query({ onlyActive: true }, function (response) {
                ctrl.productService.activeProducts = response;
            });
        };

        ctrl.changeTab = function (tab) {
            ctrl.tab = tab;
            ctrl.productService.activeTab = tab;
            if (ctrl.tab == 3 || ctrl.tab == 4 || ctrl.tab == 5) {
                ctrl.getActiveProducts();
                ctrl.getFirstProduct();
            } else if (ctrl.tab == 1) {
                ctrl.productService.emptyForm();
            } else if (ctrl.tab == 2) {
                ctrl.categoryService.emptyForm();
            }


        }

        ctrl.getFirstProduct = function () {
            ctrl.product.$get({ first: 'first' }, function (response) {
                ctrl.productService.product = response;
                if (ctrl.tab == 3) {
                    ctrl.relationshipService.getAssignedCategories(response.Id);
                } else if (ctrl.tab == 4) {
                    ctrl.priceSetService.getPriceSetsByProductId(response.Id);
                } else if (ctrl.tab == 5) {
                    ctrl.productService.getReport(response.Id);
                }
            });
        };

    }]);

})();