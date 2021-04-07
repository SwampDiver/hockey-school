$(function() {
  $('.partners__slider').slick({
    slidesToShow: 4,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive:[
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },{
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
});
