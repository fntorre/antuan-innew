
/*
 *
 * Desenvolvido por Integrando.se
 * hello@integrando.se
 *
 * Bootstrap v.3
 *
 */

$(document).ready( function(){

    // if ($.fn.ADMAKEadvancedFilter) {
    //     $(document).ADMAKEadvancedFilter({
    //         tipoFiltros: {},
    //     });
    // }

    if ($.fn.ADMAKEmenu) {
        $(document).ADMAKEmenu();
    }

    /*
        $('.col-mini-cart').ADMAKEminiCart({
            miniCartQtd : '.mini-cart-qty-admake',
        });
    */

    var $btnComprar = $('.btn-add-buy-button-asynchronous');
    if( $btnComprar.length ){
        $btnComprar.html('<i class="fa fa-shopping-cart"></i> Añadir al Carrito');
    }

    if($('.product-description-box.description-1 h2').length){
        $('.product-description-box.description-1 h2').html("También podría gustarte")
    }
    if($('.product-description-box.description-2 h2').length){
        $('.product-description-box.description-2 h2').html("También podría gustarte")
    }
    if($('.product-info .buy-button-box .buy-in-page-button').length){
        $('.product-info .buy-button-box .buy-in-page-button').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="20" viewBox="0 0 22 22"><defs><clipPath id="clip-Icono_bag"><rect width="22" height="22"/></clipPath></defs><g id="Icono_bag" data-name="Icono &gt;bag" clip-path="url(#clip-Icono_bag)"><g id="bag" transform="translate(3 2.545)"><path id="Trazado_2" data-name="Trazado 2" d="M50.982,5.035a.145.145,0,0,0-.145-.133H48.219V4.181a4.218,4.218,0,0,0-8.436,0V4.9H37.164a.145.145,0,0,0-.145.133L36,18.3a.143.143,0,0,0,.038.109.146.146,0,0,0,.107.046H51.855a.146.146,0,0,0,.107-.046A.144.144,0,0,0,52,18.3ZM40.946,4.181a3.055,3.055,0,0,1,6.109,0V4.9H40.946Zm-.582,4.758A1.45,1.45,0,0,1,38.91,7.5a1.361,1.361,0,0,1,.873-1.321V7.5a.582.582,0,0,0,1.164,0V6.177A1.364,1.364,0,0,1,41.819,7.5,1.45,1.45,0,0,1,40.364,8.939Zm7.273,0A1.45,1.45,0,0,1,46.182,7.5a1.361,1.361,0,0,1,.873-1.321V7.5a.582.582,0,0,0,1.164,0V6.177A1.364,1.364,0,0,1,49.091,7.5,1.45,1.45,0,0,1,47.637,8.939Z" transform="translate(-36.001)" fill="#fff"/></g></g></svg> Comprar')
    }
    if($('#collections .prateleira ul li .box-item .wrapper-buy-button-asynchronous .btn-add-buy-button-asynchronous').length){
        $('#collections .prateleira ul li .box-item .wrapper-buy-button-asynchronous .btn-add-buy-button-asynchronous').html("Comprar")
    }

    // filter fadeToggle movil
    $('.departament-button-filter').click((e) => {
        $(e.currentTarget).parent().find('.departament-navegador-movil').fadeToggle();
    });

    var $btnComprarProduto = $('.buy-button.buy-button-ref');
    if( $btnComprarProduto.length ){

        if( $('#comprar-flutuante').length ){
            var $comprarFlutuante = $('#comprar-flutuante');
            var btnComprarTop = $('.product-info .buy-button-box').offset().top;
            $(window).scroll( function(){
                if( $(window).width() > 768 ){
                    if( $(this).scrollTop() >= btnComprarTop && !$comprarFlutuante.is(':visible') ){
                        $comprarFlutuante.fadeIn( function(){
                            var urlImage = ( $('#include #image-main').attr('src') != '' ) ? $('#include #image-main').attr('src') : '/arquivos/sem-foto.gif';
                            $('#foto-comprar-flutuante').attr('src', urlImage);
                            $('body').css('padding-bottom', $comprarFlutuante.height() + 30);
                        });
                    }else if( $(this).scrollTop() < btnComprarTop && $comprarFlutuante.is(':visible') ){
                        $comprarFlutuante.fadeOut( function(){
                            $('body').css('padding-bottom', 0);
                        });
                    }
                }
            });
        }


        $btnComprarProduto.html('Comprar <i class="fa fa-lock"></i>');

        $btnComprarProduto.click( function(){
            var $this = $(this);
            var url   = $this.attr('href');
            if( url.indexOf('qty=1') > 0 ){
                $this.attr('href', url.replace('qty=1', 'qty='+ parseInt( $('.buy-button-box .box-qtd .qtd').val() ) ) );
            }
        });

        var $recebeQtyForm = $btnComprarProduto.parents('.buy-button-box');
        if( $recebeQtyForm.length ){
            $recebeQtyForm.prepend(
                '<div class="pull-left box-qtd">' +
                '	<input type="text" class="qtd pull-left" value="1" />' +
                '	<div class="bts pull-left">' +
                '		<button class="btn btn-mais">+</button>' +
                '		<button class="btn btn-menos">-</button>' +
                ' 	</div>' +
                '</div>'
            );
            $(document).on('keypress' , '.buy-button-box .box-qtd .qtd', function(e){
                var tecla = ( window.event ) ? event.keyCode : e.which;
                if( ( tecla > 47 && tecla < 58 ) ){
                    return true;
                }else{
                    if ( tecla == 8 || tecla == 0 ){
                        return true;
                    }else{
                        return false;
                    }
                }
            });
            $(document).on('keyup' , '.buy-button-box .box-qtd .qtd', function(e){
                $('.buy-button-box .box-qtd .qtd').val( $(this).val() );
            });
            $(document).on('blur' , '.buy-button-box .box-qtd .qtd', function(e){
                var $this = $(this);
                if( $this.val() === '' || parseInt( $this.val() ) < 1 ){
                    $('.buy-button-box .box-qtd .qtd').val(1);
                }else{
                    $('.buy-button-box .box-qtd .qtd').val( $this.val() );
                }
            });
            $(document).on('click', '.buy-button-box .box-qtd .btn', function(){
                var $this = $(this);
                var $qtd  = $('.buy-button-box .box-qtd .qtd');
                var valor = parseInt( $qtd.val() );
                if( $this.hasClass('btn-mais') ){
                    $qtd.val( valor + 1 );
                }else if( $this.hasClass('btn-menos') ){
                    if( valor > 1 ){
                        $qtd.val( valor - 1 );
                    }
                }
            });
        }
    }

    $('.grid-products-body .helperComplement').remove();

    if( $.fn.owlCarousel ){

        var $fullbanner = $(".fullbanner");
        if( $fullbanner.length ){
            $fullbanner.owlCarousel({
                items 			: 1,
                singleItem 		: true,
                autoPlay 		: true,
                stopOnHover 	: false,
                navigation 		: true,
                pagination      : true,
                dots            : true,
                navigationText 	: ['<i class="icon"></i>','<i class="icon"></i>'],
            });
        }

        $(window).load(function () {
            var $showCaseOwl = $(".showcase-owl:not(.js-half) .prateleira > ul");
            if( $showCaseOwl.length ){
                $showCaseOwl.find('.helperComplement').remove();
                $showCaseOwl.owlCarousel({
                    items 				: 7,
                    autoPlay 			: true,
                    stopOnHover 		: false,
                    pagination 	 		: false,
                    center              : true,
                    itemsDesktop 		: [1199,7],
                    itemsDesktopSmall 	: [980,7],
                    itemsTablet 		: [768,2],
                    itemsMobile 		: [479,1],
                    navigation 			: true,
                    margin              : 20,
                    navigationText 		:['<i class="icon"></i>','<i class="icon"></i>'],
                });
            } 
        });

        var $showCaseOwlHalf = $(".showcase-owl.js-half .prateleira > ul");
        if( $showCaseOwlHalf.length ){
            $showCaseOwlHalf.find('.helperComplement').remove();
            $showCaseOwlHalf.owlCarousel({
                items 				: 1,
                autoPlay 			: true,
                stopOnHover 		: false,
                pagination 	 		: false,
                center              : true,
                itemsDesktop 		: [1199,2],
                itemsDesktopSmall 	: [980,2],
                itemsTablet 		: [768,2],
                itemsMobile 		: [479,1],
                navigation 			: true,
                margin              : 20,
                navigationText 		: ['<i class="icon"></i>','<i class="icon"></i>'],
            });
        }

    }

    var $ofertasSemanales = $(".slide-ofertas-semanales ul");
        if( $ofertasSemanales.length ){
            $ofertasSemanales.owlCarousel({
                items 				: 5,
                autoPlay 			: true,
                stopOnHover 		: false,
                pagination 	 		: true,
                itemsDesktop 		: [1199,5],
                itemsDesktopSmall 	: [980,5],
                itemsTablet 		: [768,3],
                itemsMobile 		: [479,3]
                });
        }

    $(".medios-pago ul").owlCarousel({
        items 			    : 8,
        itemsDesktop 		: [1199,8],
        itemsDesktopSmall 	: [980,8],
        itemsTablet 		: [768,4],
        itemsMobile 		: [479,4],
        autoPlay 		    : true,
        stopOnHover 	    : false,
        navigation 	    	: false,
        pagination          : false
    });

    $('.helperComplement').remove();
    var $gridProducts = $(".ofertas-new .prateleira ul");
    if( $gridProducts.length ){
        $gridProducts.owlCarousel({
            items 			    : 4,
            itemsDesktop 		: [1199,4],
            itemsDesktopSmall 	: [980,4],
            itemsTablet 		: [768,3],
            itemsMobile 		: [479,1],
            autoPlay 		    : true,
            stopOnHover 	    : false,
            navigation 	    	: true,
            pagination          : true
        });
    }
    var $gridJoyas = $(".lj-seccion .slider ul");
    if( $gridJoyas.length ){
        $gridJoyas.owlCarousel({
            items 			    : 4,
            itemsDesktop 		: [1199,4],
            itemsDesktopSmall 	: [980,4],
            itemsTablet 		: [768,2],
            itemsMobile 		: [479,2],
            autoPlay 		    : true,
            stopOnHover 	    : false,
            navigation 	    	: true,
            pagination          : true
        });
    }

});