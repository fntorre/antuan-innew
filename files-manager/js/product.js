let dataProduct;
(()=>{
    compreJunto()
    imgCarrusel()    
})()

// COMPRAR JUNTOS
setTimeout(function compreJunto(){
    
        content1 = $(".skuListPrice").html();
        content2 = $(".skuBestPrice").html();

        $("<em class='valor-de price-list-price' style='display: block;'><strong class='old-price-usd'>" + content1 +"</strong></em>").insertAfter(".skuListPrice");
        $("<em class='valor-por price-best-price' style='display: block;'>Por: <strong class='best-price-usd'>" + content2 +"</strong></em>").insertAfter(".skuBestPrice");

        $("#divCompreJunto tr").first().addClass('activo');

        $("td.plus").on("click", function(){
            if($("#divCompreJunto tr.activo").next().length > 0) {
                $("#divCompreJunto tr.activo").removeClass('activo').next().addClass("activo");
            }else{
                $("#divCompreJunto tr.activo").removeClass('activo');
                $("#divCompreJunto tr").first().addClass('activo');
            }
        })

        if ($("#divCompreJunto table").length > 0){
            $("#junto-tit").css("display", "block");
            //$("#cambiar").css("display", "block");
        }

        setTimeout(function() {
        $('td.buy').html(function () {
            return $(this).html().replace(/Por apenas/g,'').replace(/de/g,'').replace(/Comprando junto você economiza:/g, 'Comprando ambos productos ahorras: '); 
        });
        }, 1500);

        $("#divTitulo").text('¡Duplica los beneficios!')
        $(".comprar-junto a").text("¡Quiero los dos!")

    }, 4000);

// IMAGEN PRINCIPAL PRODUCTO

function imgCarrusel(){
    const listImg = $(".thumbs a");
    for (let i = 0; i < listImg.length; i++) {
        $(".gallery-thumbs .swiper-wrapper").append('<div class="swiper-slide"><img src="'+listImg.eq(i).attr("rel")+'"/></div>');
        $(".gallery-prod .swiper-wrapper").append('<div class="swiper-slide"><img src="'+listImg.eq(i).attr("zoom")+'" data-magnify-src="'+listImg.eq(i).attr("zoom")+'"/></div>');
    }
    $(".swiper-container.gallery-prod").append('<div class="cant-fotos bg-gris3 color-violeta1"><strong>'+listImg.length+' FOTOS</strong></div>')

    const galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints:{
            1024: {
                direction: 'vertical',
                slidesPerView: 4,
                freeMode: false,
            },

            768: {
                direction: 'horizontal',
                slidesPerView: 4,
                freeMode: false,
            }


        
        }
    });
    const galleryTop = new Swiper('.gallery-prod', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.gallery-prod .swiper-button-next',
            prevEl: '.gallery-prod .swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs,
        }
    });

    if ($(window).width() >= 768){
        $(".gallery-prod img").magnify();
    }
}








