let dataProduct;
(()=>{
    dataBtnAddCart()
    imgCarrusel()
    // addCart()
    aviseMe()
    setPromos()
    makeRequest()
    .then( data =>{
        dataProduct = data
        setInfo()
    })
    getOtherPayment()
    formasDeEntrega()
})()

function dataBtnAddCart(){
    // ID SKU
    $(".product-info .btn-agregar-al-carrito").attr("data-id-sku",skuJson_0.skus[0].sku)
    // NAME PRODUCT
    $(".product-info .btn-agregar-al-carrito").attr("data-name-product",skuJson_0.name)
}

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

function makeRequest(){

    return new Promise((res,rej) => {

        let productId = skuJson_0.productId
        let url = "/api/catalog_system/pub/products/search?fq=productId:"+productId 
        
        $.ajax({
            url: url,
            success: function(data){
                res(data)
            },
            error: function(error){
                console.error(error)
                rej(error)
            }
        })

    })

}

function setInfo(){

    // Codigo EAN
    const ean = dataProduct[0].items[0].ean
    $(".codproduto").append('<span>'+ean+'</span>')

    // Nombre del producto
    $(".productName").html(skuJson_0.name)

    // Porcentaje de descuento
    if($(".skuListPrice").length){
        const skuListPrice = parseFloat($(".skuListPrice").html().slice(2).replace(".","").replace(",","."));
        const skuBestPrice = parseFloat($(".skuBestPrice").html().slice(2).replace(".","").replace(",","."));
        const porcentaje = Math.round((skuListPrice - skuBestPrice)/(skuListPrice*0.01));
        $(".descricao-preco").append('<em class="valor-desc"><strong class="skuPerc">'+porcentaje+'% OFF</strong></em>');
    }

    // Marca en Descubri más
    if($("a.brand").length){
        const linkBrand = $("a.brand").attr("href")
        const txtBrand = $("a.brand").text()
        $(".descubri-mas .marca").attr("href",linkBrand)
        $(".descubri-mas .marca .content").text(txtBrand)
    }

}

function aviseMe(){
    if(!skuJson_0.available){

        $(".price-box").remove()
        $(".buy-button-box").removeClass("hidden")
        $(".principal .agregar-al-carrito").addClass("hidden")

        $(".sku-notifyme-client-name.notifyme-client-name").before(
            '<span class="title-input">Nombre y Apellido</span>'
        )
        $(".sku-notifyme-client-email.notifyme-client-email").before(
            '<span class="title-input">Correo electrónico</span>'
        )

        $(".sku-notifyme-client-name.notifyme-client-name").attr("placeholder","Ej: Juan Perez")
        $(".sku-notifyme-client-email.notifyme-client-email").attr("placeholder","Ej: juan.perez@gmail.com")

        $(".portal-notify-me-ref p").html(
            'En este momento no disponemos de este producto,<br/><strong>¿te gustaría que te notifiquemos al recibirlo?</strong>'
        )

        $(".btn-ok.sku-notifyme-button-ok.notifyme-button-ok").attr("value","Notificarme cuando llegue")
    }
}

// Tengo que declararlo de nuevo por un problema de scope
// function addCart(){
//     $("body").on("click",".btn-agregar-al-carrito",function(){
//         const $btn = $(this)
//         const idSku = $btn[0].dataset.idSku
//         const qt = parseInt($btn.prev().find("input").val())

//         const data = {
//             idSku: idSku,
//             nameSku : $btn.parents(".vitrina").find(".product-name").text().trim(),
//             qt: qt,
//             btn: $btn,
//             qtBeforeUpdate: 0,
//         }

//         changeBtn($btn,"loading")
//         sendSkuCheckout(idSku,qt)
//         .then((qtBeforeUpdate)=>{
//             data.qtBeforeUpdate = qtBeforeUpdate
//             getInfoCheckout(data)
//         })
//         .catch(()=>{
//             console.error("paso algo")
//             changeBtn($btn,"error")
//             setTimeout(function(){
//                 changeBtn($btn,"init")
//             },2000)
//         })
//     })
// }

function increaseValueProd() {
    let value = parseInt($(".quantity-prod").val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    $(".quantity-prod").val(value);
}

function decreaseValueProd() {
    let value = parseInt($(".quantity-prod").val(), 10);
    value = isNaN(value) ? 2 : value;
    value == 1 ? value = 2 : '';
    value--;
    $(".quantity-prod").val(value);
}

function getOtherPayment(){
    const msj = $(".see-other-payment-method-link").attr("onclick");
    const end = msj.indexOf("FormaPagamento")-3;
    const start = msj.indexOf("https");
    const url = msj.substring(start,end);
    $.ajax({
        url: url,
        method:"GET",
        success:function(page){
            setOtherPayment(page);
        },
        error:function(data){
            console.log(data);
        }
    });
}
function setOtherPayment(page){
    (new Promise((res,rej)=>{
        // Copiar tablas que ya estan creadas
        const listTarCred = $(page).find("#ddlCartao option");
        for (let i = 0; i < listTarCred.length; i++) {
            const $this = listTarCred.eq(i);
            const nomTar = $this.html().toLowerCase().replace(/\s/g,"");
            console.log(nomTar)
            $("#content-other-payment .tarjetas-credito .list").append('<div class="tar '+nomTar+'" nomtar="'+nomTar+'"></div>');
    
            $("#content-other-payment").append(
                '<div class="t-op" nomtar="'+nomTar+'">'+
                    '<div class="volver hidden-md hidden-lg">'+
                        '<div class="'+nomTar+'"></div>'+
                    '</div>'+
                    '<table id="'+nomTar+'"></table>'+
                '</div>'
            );
            const valueTar = $this.val();
            $("table#"+nomTar).replaceWith($(page).find("#tbl"+valueTar));
            traducirTablas("#tbl"+valueTar);
        }
    
        // Crear tablas de datos sueltos
        const otherListTarCred = $(page).find(".custom");
        let otherTar = "a";
        for (let k = 0; k < otherListTarCred.length; k++) {
            const $this = otherListTarCred.eq(k);
            const nomTar =  $this.find("#ltlBoletoTextoWrapper").html()
                                .replace(/à vista| vezes sem juros| vezes com juros/g,"")
                                .replace(/\d/g,"")
                                .replace(/\s/g,"")
                                .toLowerCase();
            
            const cuota =   $this.find("#ltlBoletoTextoWrapper").html()
                                .replace(/à vista/g,"un pago")
                                .replace(/vezes sem juros/g,'cuotas <span class="hasntInteres">sin interés</span>')
                                .replace(/vezes com juros/g,"cuotas con interés");

            const valorCuota = $this.find("#ltlPrecoWrapper").html().replace(/R/g,"");

            if(otherTar != nomTar){
                otherTar = nomTar
                // Se agrega la tarjeta a la lista
                $("#content-other-payment .tarjetas-credito .list").append('<div class="tar '+nomTar+'" nomtar="'+nomTar+'"></div>');
    
                // Se agrega el content de la tarjeta
                $("#content-other-payment").append(
                    '<div class="t-op" nomtar="'+nomTar+'">'+
                        '<div class="volver hidden-md hidden-lg">'+
                            '<div class="'+nomTar+'"></div>'+
                        '</div>'+
                        '<table id="'+nomTar+'" class="tbl-payment-system">'+
                            '<tbody>'+
                                '<tr class="even">'+
                                    '<th class="parcelas">Nº de Cuotas</th>'+
                                    '<th class="valor">Valor</th>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td class="parcelas">'+cuota+'</td>'+
                                    '<td>'+valorCuota+'</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</div>'
                );
            }
            else{
                $("table#"+nomTar).append(
                    '<tr>'+
                        '<td class="parcelas">'+cuota+'</td>'+
                        '<td>'+valorCuota+'</td>'+
                    '</tr>'
                )
            }

            const sinInteres = cuota.indexOf("sin interés");
            if(sinInteres != -1){
                // Obtener numero de sin interes
                const regex = /(\d+)/g;
                const numSinInteres = cuota.match(regex)[0];
                
                // Agregar msj de cantidad maxima de cuotas sin interes para mobile
                $(".tarjetas-credito .tar[nomtar='"+nomTar+"']").html('<div>'+numSinInteres+' Sin Interés</div>');
                
                // Agregar Titulo de sin Interes en icono de la lista de las tarjetas
                if(!$(".tarjetas-credito .tar[nomtar='"+nomTar+"']").hasClass("sinInteres")){
                    $(".tarjetas-credito .tar[nomtar='"+nomTar+"']").addClass("sinInteres");
                }
            }
        }

        // Cargar valor de cuotas en efectivo y debito
        const valorUnPago = $(".skuBestPrice").html();
        $("#content-other-payment .pago-efectivo").append('<span class="valor-un-pago">'+valorUnPago+'</span>');
        $("#content-other-payment .tarjetas-debito").append('<span class="valor-un-pago">'+valorUnPago+'</span>');

        res("ok");
    }))
    .then(()=>{
        // Activar la primer tabla
        if ($(window).width() > 768){
            $("#content-other-payment .tarjetas-credito .tar.visa").addClass("active");
            $("#content-other-payment .t-op[nomtar='visa']").addClass("show");
        }
        showTables();
    })

}
function traducirTablas(table){
    
    // Quitar el R$ de los valores de las cuotas
    const listValCuota = $(table+" td:not(.parcelas)");
    for (let i = 0; i < listValCuota.length; i++) {
        const $this = listValCuota.eq(i);
        const valCuotaPeso = $this.html().replace(/R/g,"");
        $this.html(valCuotaPeso);
    }

    // Traducir texto de cuotas y encontrar la mayor cuota sin interes
    const listCuotaText = $(table+" td.parcelas");
    for (let i = 0; i < listCuotaText.length; i++) {
        const $this = listCuotaText.eq(i);
        const nomtar = $this.parents(".t-op").attr("nomtar");
        const text = $this.html();
        const sinInteres = text.indexOf("vezes sem juros");
        if(sinInteres != -1){
            // Obtener numero de sin interes
            const regex = /(\d+)/g;
            const numSinInteres = text.match(regex)[0];

            // Resaltar msj de cuotas sin interes
            const textSinInteres =    text.replace(/\d/g,"")
                                        .replace(/vezes sem juros/g,"");
            $this.html(textSinInteres+" "+numSinInteres+' cuotas <span>sin interés</span>');

            // Agregar msj de cantidad maxima de cuotas sin interes para mobile
            $(".tarjetas-credito .tar[nomtar='"+nomtar+"']").html('<div>'+numSinInteres+' Sin Interés</div>');
            
            // Agregar Titulo de sin Interes en icono de la lista de las tarjetas
            if(!$(".tarjetas-credito .tar[nomtar='"+nomtar+"']").hasClass("sinInteres")){
                $(".tarjetas-credito .tar[nomtar='"+nomtar+"']").addClass("sinInteres");
            }
        }
        else{
            const textTraducido = text.replace(/à vista/g,"un pago")
                                    .replace(/vezes com juros/g,"cuotas con interés");
            $this.html(textTraducido);
        }
    }

    // Traducir encabezados de las tablas
    const listEncabezados = $(".tbl-payment-system th");
    for (let i = 0; i < listEncabezados.length; i++) {
        const $this = listEncabezados.eq(i);
        const titleTraducido =  $this.html()
                                    .replace(/Nº de Parcelas/g,"N° de Cuotas")
                                    .replace(/Valor de cada parcela/g,"Valor");
        $this.html(titleTraducido);
    }
}
function showTables(){
    let contentTar;
    let nomTar;

    $("#content-other-payment .tarjetas-credito").on("click",".tar",function(){
        nomTar = $(this).attr("nomtar");
        $(".tar").removeClass("active"); $(this).addClass("active");
        contentTar = $("#content-other-payment .t-op[nomtar='"+nomTar+"']");
        $("#content-other-payment .t-op").removeClass("show"); contentTar.addClass("show");
    });

    $("#content-other-payment").on("click",".t-op .volver",function(){
        $(this).parent().removeClass("show")
    });

    // if ($(window).width() < 768){
    //     $("#content-other-payment").on("click",".list-other-payment .dp",function(){
    //         $(this).toggleClass("show");
    //     });
    // }
}

function formasDeEntrega(){
    getFormasDeEntrega()
    .then((tiendas)=>{
        
        const provincia = JSON.parse(localStorage.getItem("franquicia")).provincia
        const franquicia = $("#franquicia").text()
        tiendas[provincia].forEach(tienda=>{

            if(tienda.name == franquicia){

                const telefonos = tienda.info.telefonos;
                let htmlTelefono = "";
                telefonos.forEach(telefono => {
                    htmlTelefono += `<span class="texto">${telefono}</span>`
                });
        
                const horarios = tienda.info.horarios;
                let htmlHorarios = "";
                horarios.forEach(horario => {
                    if(horario.rango == "24 Hs"){ 
                        htmlHorarios += `<div class="horarios"><span class="fulltime">${horario.rango}</span></div>`
                    }else{
                        htmlHorarios += `<div class="horarios"><span class="texto">${horario.dias}</span><span class="texto">${horario.rango}</span></div>`
                    }
                });

                $("#formas-entrega .info").html(
                    '<div class="nombre-sucursal">'+
                        '<span class="subtitle">RETIRÁS TU PEDIDO EN:</span>'+
                        '<span class="texto">'+tienda.name+'</span>'+
                    '</div>'+
                    '<div class="direccion-sucural">'+
                        '<span class="subtitle">Podes buscarlo en:</span>'+
                        '<span class="texto">'+tienda.info.direccion+'</span>'+
                        htmlTelefono+
                    '</div>'+
                    '<div class="horarios-sucursal">'+
                        '<span class="subtitle">Te esperamos:</span>'+
                        htmlHorarios+
                    '</div>'
                )

            }

        })
    })
}

function getFormasDeEntrega(){
    return new Promise((res,rej)=>{
        $.ajax({
            url: "/files/coordenadas-pickup.json",
            success: function(data){
                res(data)
            },
            error: function(error){
                console.error(error)
                rej(error)
            }
        })
    })
}

function setPromos(){
    if($(".gallery-prod .flags").html() != ""){
        console.log("tiene promos")
        const tipoPromo = $(".gallery-prod .flags .flag")[0].className.replace("flag ","")
        $(".product-info .price-box").addClass("hasPromo").addClass(tipoPromo)
        let txtPromo = ""
        switch (tipoPromo) {
            case "promo-precio-especial":
                txtPromo = '<span>PRECIO ESPECIAL</span>'
                break;
            case "promo-10-":
                txtPromo = "<span>-10%</span>"
                break;
            case "promo-15-":
                txtPromo = "<span>-15%</span>"
                break;
            case "promo-20-":
                txtPromo = "<span>-20%</span>"
                break;
            case "promo-25-":
                txtPromo = "<span>-25%</span>"
                break;
            case "promo-30-":
                txtPromo = "<span>-30%</span>"
                break;
            case "promo-35-":
                txtPromo = "<span>-35%</span>"
                break;
            case "promo-40-":
                txtPromo = "<span>-40%</span>"
                break;
            case "promo-50-":
                txtPromo = "<span>-50%</span>"
                break;
            case "promo-2x1":
                txtPromo = "<span>2x1</span>"
                break;
            case "promo-3x2":
                txtPromo = "<span>3x2</span>"
                break;
            case "promo-2doal50-":
                txtPromo = '<span>-50%</span><span class="aclaracion">En la 2da Unidad</span>'
                break;
            case "promo-2doal60-":
                txtPromo = '<span>-60%</span><span class="aclaracion">En la 2da Unidad</span>'
                break;
            case "promo-2doal70-":
                txtPromo = '<span>-70%</span><span class="aclaracion">En la 2da Unidad</span>'
                break;
            case "promo-2doal80-":
                txtPromo = '<span>-80%</span><span class="aclaracion">En la 2da Unidad</span>'
                break;
            default:
                break;
        }
        $(".product-info .price-box").prepend(
            `
            <div class="promo">
                ${txtPromo}
            </div>
            `
        )
    }else{
        console.log("no tiene promos")
    }
}