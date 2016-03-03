﻿(function () {

    var module = angular.module('productServices', [])

    module.factory('product', ["$resource", function ($resource) {

        return $resource('/api/products/:id', null, {
            update: { method: "put" }
        });
    }]);

    module.service('productService', ['product', function (product) {

        var service = this;
        service.products = [];
        service.product = new product();
        service.productIndex;

        service.getProducts = function () {
            product.query(function (response) {
                service.products = response;
            });
        };

        service.getActiveProducts = function () {          
            product.query({ onlyActive: true }, function (response) {
                service.products = response;
            });
        }

        service.getProduct = function (id, $index) {
            service.product = new product();
            service.product.$get({ id: id }, function (response) {
                service.product = response;
                service.productIndex = $index;
                service.products[$index] = service.product;
                console.log('prod svc, prod id: ' + service.product.Id);
            });
        };

        service.addProduct = function () {
            service.product.$save(function (response) {
                service.product = response;
                service.products.push(service.product);
                service.emptyForm();
            });
        }

        service.updateProduct = function () {
            service.product.$update({ id: service.product.Id, product: service.product }, function (response) {
                service.emptyForm();
            });

        }

        service.addOrUpdate = function () {
            if (!service.product.Id)
                service.addProduct();
            else
                service.updateProduct();


        }

        service.deleteProduct = function (id, $index) {
            service.product.$delete({ id: id }, function (response) {
                service.products.splice($index, 1);
                service.emptyForm();
            });
        }

        service.emptyForm = function () {
            if (service.product.Id) {
                service.getProducts();
            }
            service.product = new product();
            service.productIndex = -1;
        }



    }]);



})();