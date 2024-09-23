const selectBox = document.getElementById("sort");
const formButton = document.getElementById("form__all");
//handle search
handleSearch = function() {
    formButton.submit();
}

//handle sort
selectBox.onchange = function() {
    formButton.submit();
}

//handle rating filter
const ratingCheckBoxs = document.getElementsByClassName("form-check-input");
for (let ratingCheckBox of ratingCheckBoxs) {
    ratingCheckBox.onchange = function() {
        console.log("dsdsfsadfsdfsfsdfsfdsfsfds");
        const formButton = document.getElementById("form__all");
        formButton.submit();}
}

//handle pagination
function First(a) {
    console.log("First function");
document.getElementById("page").value = a;
formButton.submit();
}

//handle adding favorites/collections
document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', async function() {
        const gymId = this.getAttribute('data-gym-id');

        try {
            const response = await fetch(`/toggle-favorite/${gymId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log("result from heart", result);
            if (result.success) {
                const icon = this.querySelector('i');
                if (icon.classList.contains('bi-heart')) {
                    // When the gym is not in the user's favorites, add it
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill', 'text-danger');
                } else {
                    // when the gym is already in the user's favorites, remove it
                    icon.classList.remove('bi-heart-fill', 'text-danger');
                    icon.classList.add('bi-heart');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    });
});


