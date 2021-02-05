$(document).ready(function() {

    /* DEFINICIÓN DE MUTATIONOBSERVER Y VTEXUTILS */
    var vtexUtils = new VTEX.VtexUtils();
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    /* DEFINICIÓN DE MUTATIONOBSERVER Y VTEXUTILS (FIN) */

    /* ELIMINACIÓN DE ALERT DE PRODUCTO AGREGADO Y TRADUCCIÓN DE "SELECCIONAR MODELO DESEADO" */
    var intervalAlertAgregado = setInterval(function() {
        if ($('.buy-in-page-button').length > 0) {
            var botonClonar = $('.buy-in-page-button[productindex=0]').clone();
            $('.buy-in-page-button[productindex=0]').remove();
            $('.buy-button-box > .buy-in-page-quantity').after(botonClonar);
            $('.buy-in-page-button[productindex=0]').buyButton(parseInt($('#___rc-p-id').val()), {salesChannel: 1}, {redirect: false, errorMessage: 'Por favor, seleccioná el modelo deseado.', errMessage: 'No se agregó el producto al carrito.', hideUnavailable: true});

            clearInterval(intervalAlertAgregado);
        }
    }, 1000);
    /* ELIMINACIÓN DE ALERT DE PRODUCTO AGREGADO Y TRADUCCIÓN DE "SELECCIONAR MODELO DESEADO" (FIN) */

    /* FUNCIONALIDAD DE PRODUCTOS AGOTADOS O PARES DE ESPECIFICACIONES INEXISTENTES EN UN SKU */
    if ($('.sku-selector-container > .topic').length >= $('.sku-selector-container label').length) {
        // Solo chequeo si el producto está agotado
        var flagAgotado = true;
        $.each(skuJson.skus, function(index, value) {
            if (value.available && value.availablequantity > 0) {
                flagAgotado = false;
            }
        });

        if (flagAgotado) {
            $('.sku-selector-container > .topic label').removeAttr("for").css({
                "background-color": "#ddd",
                "color": "#999"
            }).removeClass("checked sku-picked");

            $('.buy-in-page-button, #comprar-flutuante .buy-button').removeClass("puede-agregar");
            $('.buy-in-page-button, #comprar-flutuante .buy-button').text("Agotado");
            $('.buy-in-page-button, #comprar-flutuante .buy-button').css({
                "pointer-events": "none",
                "background-color": "#808080",
                "opacity": ".15"
            });
        } else {
            $('.sku-selector-container label').addClass("checked sku-picked");
            $('.buy-in-page-button, #comprar-flutuante .buy-button').addClass("puede-agregar");
            $('.buy-in-page-button, #comprar-flutuante .buy-button').css({
                "pointer-events": "auto",
                "background-color": "#31b7bc",
                "opacity": "1"
            });
        }
    } /*else {
        var topicClass = $('.sku-selector-container > .topic').first().attr("class");
        var comienzo = topicClass.search(/productid-[0-9]+/) + 10;
        var idProducto = topicClass.slice(comienzo);
        var final = idProducto.search(" ");
        idProducto = idProducto.slice(0, final);
        var _VTEXAPIPRODUCTENDPOINT = "/api/catalog_system/pub/products/variations/" + idProducto

        $('.sku-selector-container > .topic').each(function(index, element) {
            if (index > 0) {
                $(element).css("cssText", "display: none !important");
            }
        });

        $('.sku-selector-container label').each(function() {
            $(this).attr("data-for", $(this).attr("for"));
        });

        var firstTopic = $('.sku-selector-container > .topic').first();
        var firstDimension = firstTopic.find('input').first().data("dimension");

        firstTopic.find('label').removeAttr("for").css({
            "background-color": "#ddd",
            "color": "#999"
        }).removeClass("checked sku-picked");

        var skusValuesAvailables = [];

        $.each(skuJson_0.skus, function(index, value) {
            if (value.available && value.availablequantity > 0 && skusValuesAvailables.indexOf(value.dimensions[firstDimension]) === -1) {
                skusValuesAvailables.push(value.dimensions[firstDimension]);
            }
        });

        if (skusValuesAvailables.length == 0) {
            $('.sku-a').html("¡Actualmente el producto está agotado!");
            $('.product-content .action, .product-content .shipping-calculate').hide();
        } else {
            $.each(skusValuesAvailables, function(index, value) {
                var labelActivar = firstTopic.find('input[data-value="' + value + '"]').next();
                labelActivar.attr("for", labelActivar.data("for")).removeAttr("style");
            });

            $('.sku-selector-container label').click(function() {
                var $labelClick = $(this);
                if (typeof($labelClick.attr("for")) !== 'undefined' && $labelClick.attr("for") !== false) {
                    var thisTopic = $labelClick.parent().parent().parent();
                    var thisDimension = $labelClick.prev().data("dimension");
                    var thisSelectedValue = $labelClick.prev().data("value");
                    var siguienteTopic = $labelClick.parent().parent().parent().next();
                    var siguienteDimension = siguienteTopic.find('input').first().data("dimension");
                    siguienteTopic.find('label').removeAttr("for");
                    siguienteTopic.find('label').removeClass("checked sku-picked");
                    siguienteTopic.find('label').css({
                        "background-color": "#ddd",
                        "color": "#999"
                    });
                    siguienteTopic.find('input').removeAttr("checked");
                    siguienteTopic.find('input').removeClass("checked sku-picked");

                    $.ajax({
                        headers: {
                            "Accept": "application/vnd.vtex.ds.v10+json",
                            "Content-Type": "application/json",
                        },
                        type: 'GET',
                        url: _VTEXAPIPRODUCTENDPOINT,
                        success: function (data) {
                            var skusAux = data.skus;
                            var skuValuesAvailables = [];
                            $.each(skusAux, function (skusAuxIndex, skusAuxValue) {
                                if (Object.keys(skusAuxValue.dimensions).length > 0) {
                                    if (skusAuxValue.dimensions[thisDimension] == thisSelectedValue && skusAuxValue.available && skusAuxValue.availablequantity > 0) {
                                        skuValuesAvailables.push(skusAuxValue.dimensions[siguienteDimension]);
                                    }
                                }
                            });

                            $.each(skuValuesAvailables, function (availableIndex, availableValue) {
                                var labelActivar = siguienteTopic.find('input[data-value="' + availableValue + '"]').next();
                                labelActivar.attr("for", labelActivar.data("for")).removeAttr("style");
                            });

                            siguienteTopic.removeAttr("style");
                            if (thisTopic.is(':last-child') && typeof($labelClick.attr("for")) !== 'undefined' && $labelClick.attr("for") !== false) {
                                $('.buy-in-page-button, #comprar-flutuante .buy-button').addClass("puede-agregar");
                                $('.buy-in-page-button, #comprar-flutuante .buy-button').css({
                                    "pointer-events": "auto",
                                    "background-color": "#31b7bc",
                                    "opacity": "1"
                                });
                            } else {
                                $('.buy-in-page-button, #comprar-flutuante .buy-button').removeClass("puede-agregar");
                                $('.buy-in-page-button, #comprar-flutuante .buy-button').css({
                                    "pointer-events": "none",
                                    "background-color": "#808080",
                                    "opacity": ".15"
                                });
                            }
                        }
                    });
                }
            });

            if ($('.sku-selector-container > .topic').first().find('label').length == 1) {
                $('.sku-selector-container > .topic').first().find('label').click();
                $('.sku-selector-container > .topic').first().find('label').addClass("checked sku-picked");
            };

            $('.sku-selector-container .topic').each(function(index) {
                if ($(this).find('label').length == 1 && index == 0) {
                    $(this).find('label').off("click");

                    if ($(this).is(':last-child')) {
                        $('.buy-in-page-button, #comprar-flutuante .buy-button').addClass("puede-agregar");
                        $('.buy-in-page-button, #comprar-flutuante .buy-button').css({
                            "pointer-events": "auto",
                            "background-color": "#31b7bc",
                            "opacity": "1"
                        });
                    } else {
                        $(this).next().removeAttr("style");
                    }
                } else {
                    return false;
                }
            });
        }
    }*/
    /* FUNCIONALIDAD DE PRODUCTOS AGOTADOS O PARES DE ESPECIFICACIONES INEXISTENTES EN UN SKU (FIN) */

     /* PARCHE DE ERROR EN MINICARRITO */
     var intervalBotonComprar = setInterval(function() {
        if ($('.buy-in-page-button').length > 0) {
            var botonComprarMutante = $('.buy-in-page-button');
            var botonComprarCambio = new MutationObserver(function(mutations) {
                $('.buy-in-page-button').off("click.buybuttonfix");
                $('.buy-in-page-button').on("click.buybuttonfix", function() {
                    if ($(this).hasClass("puede-agregar")) {
                        var yaExiste = false;
                        $('.js-minicart-item').each(function(index) {
                            if ($(this).children('.js-mini-cart-skuid').text() == $('#___rc-p-sku-ids').attr("value")) {
                                yaExiste = true;
                            }
                        });

                        if (!yaExiste) {
                            
                            if($('.custom-selector li.placeholder.active').length >= 1){
                                
                                alert('Por favor, seleccione talle y/o color');
                            
                            } else {

                                if ($('.js-mini-cart-list').find('li').length == 0) {
                                $('.js-mini-cart-list').empty();
                                }

                                var imagen = $('.thumbs li:first-of-type img').attr("src");
                                var nombre = $('.product-info .product-name .fn.productName').first().text();
                                var precioSinFormato = parseInt($('.price-box .skuBestPrice').first().text().replace(/\D/g,''));
                                var precio = vtexUtils.vtexHelpers.formatPrice(precioSinFormato, ',', '.', 2, '$ ');
                                var skuId = $('#calculoFrete').attr("skucorrente");

                                $('.js-mini-cart-list').append('<li class="js-minicart-item" data-js-minicart="product-list-item"><div class="js-mini-cart-image" data-js-minicart="product-list-item-image"><img class="js-minicar-list-0-img" src="' + imagen + '" alt="' + nombre + '"></div><div class="js-mini-cart-name" data-js-minicart="product-list-item-name">' + nombre + '</div><div class="js-mini-cart-quantity" data-js-minicart="product-list-item-quantity">(1)</div><div class="js-mini-cart-price" data-js-minicart="product-list-item-price">' + precio + '</div><div class="js-mini-cart-skuid" data-js-minicart="product-list-item-skuid" style="display: none;">' + skuId + '</div></li>');

                                var nuevoPrecioTotal = parseInt($('.js-mini-cart-total').text().replace(/\D/g,'')) + parseInt($('.price-box .skuBestPrice').first().text().replace(/\D/g,''));
                                $('.js-mini-cart-total').text("Total: " + vtexUtils.vtexHelpers.formatPrice(nuevoPrecioTotal, ',', '.', 2, '$ '));

                                $('.js-cart-count').text(parseInt($('.js-cart-count').text()) + 1);

                                /*$('.js-mini-cart').css({
                                    "opacity": "0",
                                    "visibility": "hidden",
                                    "-webkit-transform": "translateY(0)",
                                    "transform": "translateY(0)"
                                });*/

                                /* MODAL IR AL CARRITO
                                $('.ir-carrito-producto').append('<div class="nombre-producto">"' + nombre + '"</div><div class="imagen-producto"><img class="js-minicar-list-0-img" src="' + imagen + '" alt="' + nombre + '"></div>');

                                $('#modal-ir-carrito').css({
                                    "opacity": "1",
                                    "display": "block"
                                });
                                $('#modal-bg').addClass('active')
                                 MODAL IR AL CARRITO */

                                //IR DIRECTAMENTE AL CARRITO
                                location.replace("/checkout/#/cart");
                                //IR DIRECTAMENTE AL CARRITO

                                if (($('.js-mini-cart').outerHeight() + $('.welcome-bar').outerHeight() + $('.header').outerHeight()) > window.outerHeight) {
                                    $('.js-mini-cart').outerHeight(window.outerHeight - ($('.welcome-bar').outerHeight() + $('.header').outerHeight()));
                                    $('.js-mini-cart-list').outerHeight(window.outerHeight - ($('.welcome-bar').outerHeight() + $('.header').outerHeight()) - $('.js-mini-cart-footer').outerHeight());
                                    $('.js-mini-cart-list').css({
                                        "overflow-y": "scroll"
                                    });
                                }
                                $('header.header-container').css({
                                    "position": "relative",
                                    "z-index": "10021"
                                });
                                $('.velo-producto-agregado').show();
                                /* var intervalBotonComprar = setTimeout(function() {
                                    $('.js-mini-cart, .js-mini-cart-list, .js-mini-cart-footer, header.header-container, .velo-producto-agregado').removeAttr("style");
                                }, 3000); */

                            }

                        } else {
                            $('.abrir-popup-existe').click();
                        }
                    }
                });
            });
            botonComprarMutante.each(function(index, element) {
                botonComprarCambio.observe(element, {attributes: true, childList: true, characterData: true});
            });

            clearInterval(intervalBotonComprar);
        }
    }, 500);

    $('#modal-bg, #modal-ir-carrito .close, .btn-seguir-comprando').click(function () {
        $('#modal-ir-carrito').css({
            "opacity": "0",
            "display": "none"
        });
        $('#modal-bg').removeClass('active');
    })
    $('.btn-seguir-comprando2').click(function () {
        $('#modal-existe').css('display','none');
        $('.modal-backdrop').remove();
    })
    /* PARCHE DE ERROR EN MINICARRITO (FIN) */

    // MODAL IR AL CARRITO
    $('#modal-ir-carrito .modal-header .close').click(function () {
        $('#modal-ir-carrito').removeAttr('style');
        $('.velo-producto-agregado').css('display', 'none');
    });
    $('.ir-carrito .btn-seguir-comprando').click(function () {
        $('#modal-ir-carrito').removeAttr('style');
        $('.velo-producto-agregado').css('display', 'none');
    });
    $('.velo-producto-agregado').click(function () {
        $('#modal-ir-carrito').removeAttr('style');
    });
    // MODAL IR AL CARRITO

    /* REFORMATO POR SI NO HAY COMENTARIOS HECHOS EN EL PRODUCTO Y TRASLADO DE PROMEDIOS HACIA ARRIBA */
    var promedioEnTitulo = false;
    var reviewsMutante = $('#reviews');
    var reviewsCambio = new MutationObserver(function(mutations) {
        if ($('#resenha .resenhas .quem > li').length == 0) {
            $('#resenha .resenhas').hide();
            $('#resenha .user-review > h4, #resenha .user-review .avaliacao .media, #resenha .user-review .avaliacao #ulPubliqueResenha').css({
                "width": "100%",
                "padding-right": "0",
                "text-align": "center"
            });
        }

        if (!promedioEnTitulo) {
            $('.rating-produto:not(#spnRatingProdutoBottom)').removeClass().addClass($('#spnRatingProdutoBottom').attr("class")).append("<span class='review-general'>" + $('#reviews p.media em span').text() + " | Calificá este producto</span>");
            promedioEnTitulo = true;
        }
    });
    reviewsMutante.each(function(index, element) {
        reviewsCambio.observe(element, {attributes: true, childList: true, characterData: true, subtree: true});
    });
    /* REFORMATO POR SI NO HAY COMENTARIOS HECHOS EN EL PRODUCTO Y TRASLADO DE PROMEDIOS HACIA ARRIBA (FIN) */

    /* AGREGADO DE PRECIOS INDIVIDUALES A LOS PRODUCTOS EN "COMPRE JUNTO" */
    /* var preciosCompreJunto = function() {
        var prodAPrecioActual = $('.price-box .valor-por strong').first().text();
        var prodAPrecioActualSinFormato = parseInt(prodAPrecioActual.replace(/\D/g,''));
        var prodAPrecioAnterior = $('.price-box .valor-de strong').first().text() ? $('.price-box .valor-de strong').first().text() : prodAPrecioActual;
        var prodAPrecioAnteriorSinFormato = parseInt(prodAPrecioAnterior.replace(/\D/g,''));

        $('#divCompreJunto > table > tbody > tr').each(function() {
            var precioFinalActualSinFormato = parseInt($(this).children('.buy').contents().first().text().replace(/\D/g,''));
            var precioFinalAhorroSinFormato = $(this).find('.ahorro').length > 0 ? parseInt($(this).find('.ahorro').text().replace(/\D/g,'')) : 0;
            var precioFinalAnteriorSinFormato = precioFinalActualSinFormato + precioFinalAhorroSinFormato;
            var precioFinalAnterior = vtexUtils.vtexHelpers.formatPrice(precioFinalAnteriorSinFormato, ',', ',', 2, '$ ');

            var prodBPrecioActualSinFormato = precioFinalActualSinFormato - prodAPrecioActualSinFormato;
            var prodBPrecioActual = vtexUtils.vtexHelpers.formatPrice(prodBPrecioActualSinFormato, ',', ',', 2, '$ ');
            var prodBPrecioAnteriorSinFormato = precioFinalAnteriorSinFormato - prodAPrecioAnteriorSinFormato;
            var prodBPrecioAnterior = vtexUtils.vtexHelpers.formatPrice(prodBPrecioAnteriorSinFormato, ',', ',', 2, '$ ');

            if ($(this).find('.itemA h3 a').length == 1) {
                $(this).find('.itemA h3 a').after("<a class='precio'><span class='actual'>" + prodAPrecioActual + "</span><span class='anterior'>" + (prodAPrecioAnteriorSinFormato == prodAPrecioActualSinFormato ? "" : prodAPrecioAnterior) + "</span></a>");
            }
            if ($(this).find('.itemB h3 a').length == 1) {
                $(this).find('.itemB h3 a').after("<a class='precio'><span class='actual'>" + prodBPrecioActual + "</span><span class='anterior'>" + (prodBPrecioAnteriorSinFormato == prodBPrecioActualSinFormato ? "" : prodBPrecioAnterior) + "</span></a>");
            }
            $(this).find('.ahorro').text(precioFinalAhorroSinFormato == 0 ? "" : precioFinalAnterior);
        });
    }

    var compreJuntoMutante = $('#divCompreJunto');
    var compreJuntoCambio = new MutationObserver(function(mutations) {
        preciosCompreJunto();
    });
    compreJuntoMutante.each(function(index, element) {
        compreJuntoCambio.observe(element, {attributes: true, childList: true, characterData: true});
    });

    preciosCompreJunto(); */
    /* AGREGADO DE PRECIOS INDIVIDUALES A LOS PRODUCTOS EN "COMPRE JUNTO" (FIN) */

    /* CUCARDA DE DESCUENTO PORCENTUAL */
    if (skuJson.skus[0].listPrice != 0) {
        $('.apresentacao').before("<div class='porcentual'>" + Math.round(100 - (skuJson.skus[0].bestPrice * 100 / skuJson.skus[0].listPrice)) + "%</div>");
    }
    /* CUCARDA DE DESCUENTO PORCENTUAL (FIN) */

    // traduccion OU en cuotas
    let getStuff = document.getElementsByClassName('valor-dividido');
    let getCount = getStuff.length
    let n, replace
    setTimeout(function() {
        for (n = 0; n < getCount; n++) {
            replace = getStuff[n].innerHTML.split('ou').join('o').split('x').join(' cuotas');
            getStuff[n].innerHTML = replace;
        };
    }, 1000);

    // Ocultar 0% OFF
    let offPer = document.getElementsByClassName('porcentual')[0];
    if (offPer) {
        if (offPer.innerText == '0%') { offPer.setAttribute('style', 'display: none;'); };
    };

    // SELECTORES FICHA PRODUCTO
    let selectorsTotal = document.getElementsByClassName('skuList').length;
    let selectors = document.getElementsByClassName('skuList');
    let x = 0;
    let selector, selLength, f, getClass, setClass
    let zIn = selectorsTotal;
    let contMargin = 0;
    let listCont = "";
    let top = 10;

    for (selectorsTotal > 0; selectorsTotal > x; x++) {
        selector = selectors[x].children[0];
        selLength = selectors[x].children[0].length;
        contMargin += 45;
        getClass = selectors[x].classList.length;
        setClass = selectors[x].classList[getClass - 1];
        f = 0;
        listCont += '<ul class="custom-selector ' + setClass + '" style="z-index: ' + zIn + '; top: ' + top + 'px;" >';
        for (selLength > 0; selLength > f; f++ ) {
            if (selector.options[f].innerText != '') {
                listCont += "<li>" + selector.options[f].innerText + "</li>";
            };
        };

        listCont += "<li class='placeholder active'>- Por favor seleccione -</li>";

        listCont += '</ul>';
        zIn -= 1;
        top += 48;
    };

    let selContainer = '<div id="custom-selectors-cont" style="margin-bottom: ' + contMargin + 'px;" >' + listCont + '</div>';
    if (selectorsTotal > 0) {
        let selectCont = document.getElementsByClassName('seletor-sku')[0];
        $('.skuList select option').removeAttr('selected');
        selectCont.innerHTML += selContainer;
    };

    // FUNCION SELECTORES FICHA DE PRODUCTO
    $('.custom-selector li').click(function(){
        if ($(this).hasClass('active')){
            $(this).closest('ul').toggleClass('active');
        } else {
            var value = this.innerHTML;
            $(this).closest('ul').children('li').removeClass('active');
            $(this).addClass('active');
            $(this).closest('ul').children('.placeholder').remove();
            $(this).closest('ul').removeClass('active');
            $('.skuList select option[value="' + value + '"]').closest('select').children('option').removeAttr('selected');
            $('.skuList select option[value="' + value + '"]').attr('selected','selected');
        }
    });

    // MOSTRAR "COMPRAR" ACOSADOR AL HACER SCROLL
    $(document).scroll(function() {
        var scroll = $(this).scrollTop();
        if (scroll > 100) {
          $('#comprar-flutuante').addClass('active');
        } else {
          $('#comprar-flutuante').removeClass('active');
        }
    });
    // MOSTRAR "COMPRAR" ACOSADOR AL HACER SCROLL

    // MOSTRAR/OCULTAR ENCUENTRA TU TALLA
    /*if($('.topic.Medida').length == 0){
        $('.product-info .seletor-sku .talle').css('display','none');
    }*/
    // MOSTRAR/OCULTAR ENCUENTRA TU TALLA

    // SLIDE DE IMAGENES Y ZOOM MOBILE
    var skuId = vtxctx.skus
    $.ajax({
        headers:{
            "X-VTEX-API-AppKey": "vtexappkey-antuansrl-FJOGID",
            "X-VTEX-API-AppToken": "AFBJISGCQFFDFKDXRZLWWTYMCMOXRQTRLMHBIYHANDOLOIRICVQWNNRGGOGWDILZMOSSDBPTRLISEMYUUGVVAWEYVAVURKWESPZAQYFBGXEBEYCTQMBXNPZQKTXCGUBG"
        },
        type: 'GET',
        url: '/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuId,
        success: function(response) {
                $('.product-image-m').append('<div class="imagenes"></div><div class="zoom-image-m"><div class="close-zoom-m">x</div></div>');
                for (let i = 0; i < response.Images.length; i++) {
                    var imageUrl = response.Images[i].ImageUrl;
                    $('.imagenes').append( '<img src="' + imageUrl + '">' );
                    // $('.zoom-image-m .images-m').append( '<img src="' + imageUrl + '">' );
                }
                setInterval(() => {
                    var arrayImg = $('.product-details .product-image-m .imagenes');
                    var zoomImg  = $('.zoom-image-m .images-m');
                    if( arrayImg.length ){
                        arrayImg.owlCarousel({
                            items 			    : 1,
                            autoPlay 		    : false,
                            navigation 	    	: false,
                            pagination          : true
                        });
                        zoomImg.owlCarousel({
                            items 			    : 1,
                            autoPlay 		    : false,
                            navigation 	    	: false,
                            pagination          : true
                        });
                        clearInterval();
                    }
                }, 500);
                $('.close-zoom-m').click(function(){
                    $('.product-image-m .zoom-image-m').fadeToggle();
                    $('.zoom-content').remove()
                });
                $('.product-image-m .imagenes img').click(function(){
                    $('.zoom-image-m').fadeToggle();
                    $('.zoom-image-m').append('<div class="zoom-content"><div class="zoom-scroll"><img src="' + $(this).attr('src') + '" class="zoom-img"></div></div>');
                });
        },
        error: function(error) {
            console.log("No se ha podido obtener la información", {error})
        }
    });
    // SLIDE DE IMAGENES Y ZOOM MOBILE

});
