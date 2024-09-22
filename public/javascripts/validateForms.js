//public directory is the root directory of the server. it is for static files like images, css, js, etc and it is not for dynamic files like ejs files. it could be accessed by anyone. so we need to put the public directory in the root directory of the server. and it is needed because we need to serve the static files like css, js, images, etc
(function () {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to -->
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission -->
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

