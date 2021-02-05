(()=>{
    setCarruselProd()
    slide()
    carruselCategorias()
    
})()

function setCarruselProd(){
    const carruselProd = $(".carrusel-prod")
    if(carruselProd.length){
        const cantCarruseles = carruselProd.length;
        for (let i = 0; i < cantCarruseles; i++) {
            const carrusel = carruselProd.eq(i)
            carruselInjection(carrusel);
            carruselType(carrusel);
            carruselImg(carrusel);
        }
    }
  }
  function carruselInjection(carrusel){
    const listaProduct = carrusel.find(".prateleira.vitrine.n12colunas");
  
    for (let i = 0; i < listaProduct.length; i++) {
        let $this = listaProduct.eq(i).parent();
        carrusel.find(".swiper-wrapper").append(
            '<div class="swiper-slide">'+$this.html()+'</div>'  // Agregar cada producto al carrusel
        );
    }
  
  }
  function carruselImg(carrusel){
    console.log(carrusel)
    console.log(carrusel.find(".box-banner"))
    const boxBanner = carrusel.find(".box-banner")
    console.log(boxBanner)
    carrusel.find(".redirect").html(boxBanner)
  }
  function carruselType(carrusel){
    console.log(carrusel)
    console.log()
    if(carrusel.hasClass("type-1")){
        new Swiper('.carrusel-prod.type-1 .swiper-container',{
            spaceBetween: 20,
            slidesPerView: 'auto',
            loop: false,
            freeMode: true,
            navigation: {
                nextEl: null,
                prevEl: null,
            },
            // autoplay: {
            //     delay: 3200,
            //     disableOnInteraction: false,
            // },
            breakpoints: {
                768: {
                    slidesPerView: 5,
                    freeMode: false,
                    navigation: {
                        nextEl: '.carrusel-prod .swiper-button-next',
                        prevEl: '.carrusel-prod .swiper-button-prev',
                    },
                },
            }
        });
    }else{
      new Swiper('.carrusel-prod.type-2 .swiper-container',{
        spaceBetween: 20,
        slidesPerView: 'auto',
        loop: false,
        freeMode: false,
        navigation: {
            nextEl: '.carrusel-prod .swiper-button-next',
            prevEl: '.carrusel-prod .swiper-button-prev',
        },
        // autoplay: {
        //     delay: 3200,
        //     disableOnInteraction: false,
        // },
        breakpoints: {
            768: {
                slidesPerView: 4,
                freeMode: false,
                navigation: {
                    nextEl: '.carrusel-prod .swiper-button-next',
                    prevEl: '.carrusel-prod .swiper-button-prev',
                },
            },
        }
    });
    }
  }

  function banInjection(contentEspecifico){
    const listaBan = $(contentEspecifico).find(".box-banner")
    for (let i = 0; i < listaBan.length; i++) {
        let $this = listaBan.eq(i)
        contentEspecifico.find(".swiper-wrapper").append(
            '<div class="swiper-slide">'+$this.html()+'</div>'  // Agregar cada ban al slide
        );
        // $this.remove();
    }
}
function slide(){
    if($(".slide-banner").length){
        let cantSlide = $(".slide-banner").length
        for (let i = 0; i < cantSlide; i++) {
            const contentEspecifico = $(".slide-banner").eq(i);
            banInjection(contentEspecifico)
        }
        // Como todo es sincronico se puede ejecutar el swiper al finalizar todo
        const swiperSlide = new Swiper('.slide-banner .swiper-container',{
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.slide-full .swiper-pagination',
                dynamicBullets: true,
            },
        })
    }
}

function carruselCategorias(){

    var swiper = new Swiper('.categorias-home', {
        slidesPerView: 'auto',
        autoplay: {
            delay: 3000,
          },
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 6,
            spaceBetween: 10,
            autoplay: false,
            navigation: {
                nextEl: null,
                prevEl: null,
              }
          },
      
        }
      });
}