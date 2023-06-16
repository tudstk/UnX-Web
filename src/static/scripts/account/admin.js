
// get all users button
document.getElementById('get-users-btn').addEventListener('click', function () {
    fetch('http://localhost:3000/admin/user/get-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data); // You can perform further processing here
        })
        .catch(error => {
            console.error(error);
        });
});

// delete user button
document.getElementById('delete-user-button').addEventListener('click', function () {
    const username = document.getElementById('username-input').value.trim();
    if (username === '') {
        alert('Please enter a username');
        return;
    }

    fetch(`http://localhost:3000/admin/user/delete/${username}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
});

// add user form
document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    const email = form.elements.email.value;
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const isAdmin = document.getElementById('is-admin-checkbox').checked;

    const userData = {
        email: email,
        username: username,
        password: password,
        isAdmin: isAdmin
    };

    fetch('http://localhost:3000/admin/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {

            if (typeof data.error === 'undefined') { // registration succeded
                console.log("User added successfully");
            }

            else { // there is an input error

                // Find the div element with the class "invalid-input"
                const invalidDiv = document.querySelector('.invalid-input');
                invalidDiv.innerHTML = '';

                if (data.error == "Invalid password format") {
                    const texts = [
                        "The password must:",
                        "• contain at least one letter",
                        "• contain at least one digit",
                        "• be at least 6 characters long"
                    ];

                    texts.forEach(text => {
                        const h5 = document.createElement("h5");
                        h5.textContent = text;
                        invalidDiv.appendChild(h5);
                    });
                }

                else if (data.error == "Invalid email format") {

                    const h5 = document.createElement('h5');
                    h5.textContent = data.error;

                    // Append the h5 element to the div
                    invalidDiv.appendChild(h5);
                }
            }

            console.log(data.error);

        })
        .catch(error => {
            console.error(error);
        });
});

// delete review button
document.getElementById('delete-review-button').addEventListener('click', function () {
    const reviewId = document.getElementById('review-id-input').value.trim();
    if (reviewId === '') {
        alert('Please enter a review id');
        return;
    }
    fetch(`http://localhost:3000/admin/review/delete/${reviewId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
});