// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

// const swiper = new Swiper(".mySwiper", {
//     slidesPerView: "auto",
//     spaceBetween: 10,
//     freeMode: true,
//     breakpoints: {
//       768: {
//         slidesPerView: 5
//       },
//       576: {
//         slidesPerView: 3
//       }
//     }
//   });
const swiper = new Swiper(".mySwiper", {
  slidesPerView: "auto",
  spaceBetween: 16,
  freeMode: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});
