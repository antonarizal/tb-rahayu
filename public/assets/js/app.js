'use strict';

(function () {
    function init() {
        var router = new Router([
            new Route('dashboard', 'dashboard', true),            
            new Route('about', 'about'),
            new Route('barang', 'barang'),
        ]);
    }
    init();
}());
