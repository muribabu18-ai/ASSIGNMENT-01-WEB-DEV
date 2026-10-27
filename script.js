console.log("script loaded");

// ===== Step 2: Get the elements we need =====
const form = document.getElementById("regform");
const fields = document.querySelectorAll("input, select, textarea");
const errors = document.querySelectorAll(".error");
const successMsg = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const count = document.getElementById("count");
const themeBtn = document.getElementById("theme");

// Check that every element was found (none should say null)
console.log(form, fields, errors, successMsg, memberList, count, themeBtn);


// ===== Steps 3-8: Handle the form submission =====
form.addEventListener("submit", function (event) {
    // Stop the page from refreshing
    event.preventDefault();

    let valid = true;

    // Read the values the user typed
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const country = document.getElementById("country").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const bio = document.getElementById("bio").value.trim();

    // Remove old error messages before checking again
    clearErrors();

    // ----- Step 4: Validate each field -----

    // Name
    if (name === "") {
        showError("name", "Please enter your full name.");
        valid = false;
    } else if (name.length < 3) {
        showError("name", "Name must be at least 3 characters long.");
        valid = false;
    }

    // Email
    if (email === "") {
        showError("email", "Please enter your email.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Please enter a valid email address.");
        valid = false;
    }

    // Password
    if (password === "") {
        showError("password", "Please enter a password.");
        valid = false;
    } else if (password.length < 8) {
        showError("password", "Password must have at least 8 characters.");
        valid = false;
    }

    // Confirm password
    if (confirmPassword === "") {
        showError("confirm-password", "Please confirm your password.");
        valid = false;
    } else if (password !== confirmPassword) {
        showError("confirm-password", "Passwords do not match.");
        valid = false;
    }

    // Gender
    if (gender === "") {
        showError("gender", "Please select your gender.");
        valid = false;
    }

    // Date of birth
    if (dob === "") {
        showError("dob", "Please enter your date of birth.");
        valid = false;
    } else if (new Date(dob) > new Date()) {
        showError("dob", "Date of birth cannot be in the future.");
        valid = false;
    }

    // Country
    if (country === "") {
        showError("country", "Please enter your country.");
        valid = false;
    }

    // Phone (counts the digits only)
    if (phone === "") {
        showError("phone", "Please enter your phone number.");
        valid = false;
    } else if (phone.replace(/\D/g, "").length < 7) {
        showError("phone", "Phone number must have at least 7 digits.");
        valid = false;
    }

    // Bio
    if (bio === "") {
        showError("bio", "Please tell us something about yourself.");
        valid = false;
    } else if (bio.length < 10) {
        showError("bio", "Your bio must be at least 10 characters long.");
        valid = false;
    }

    // ----- Steps 6-8: Register the member if everything is correct -----
    if (valid) {
        addMember(name, email, gender, dob, country, phone, bio);

        // Step 7: update the counter
        updateCount();

        // Step 8: show the success message, then reset the form
        successMsg.textContent = "Member registered successfully!";
        successMsg.classList.remove("hidden");

        form.reset();
        clearErrors();

        // Hide the success message after 3 seconds
        setTimeout(function () {
            successMsg.classList.add("hidden");
        }, 3000);
    }
});


// ===== Show an error under the correct field =====
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = field.parentElement.querySelector(".error");

    error.textContent = message;
    field.classList.add("invalid");
}


// ===== Remove all error messages =====
function clearErrors() {
    errors.forEach(function (error) {
        error.textContent = "";
    });

    fields.forEach(function (field) {
        field.classList.remove("invalid");
    });
}


// ===== Step 5: Clear an error as soon as the user fixes the field =====
fields.forEach(function (field) {
    field.addEventListener("input", clearFieldError);
    field.addEventListener("change", clearFieldError);
});

function clearFieldError(event) {
    const field = event.target;
    const error = field.parentElement.querySelector(".error");

    if (error) {
        error.textContent = "";
    }

    field.classList.remove("invalid");
}


// ===== Step 6: Add a new member to the list =====
function addMember(name, email, gender, dob, country, phone, bio) {

    // Remove the "No members yet" note if it is showing
    const emptyNote = document.getElementById("emptyNote");
    if (emptyNote) {
        emptyNote.remove();
    }

    // The list item for this member
    const member = document.createElement("li");
    member.classList.add("member-item");

    // Container for the member's details
    const info = document.createElement("div");
    info.classList.add("info");

    // Name
    const memberName = document.createElement("strong");
    memberName.textContent = name;

    // Other details on one line
    const details = document.createElement("span");
    details.textContent = email + " | " + gender + " | " + dob +
        " | " + country + " | " + phone;

    // Bio
    const memberBio = document.createElement("p");
    memberBio.textContent = bio;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.type = "button";
    removeBtn.classList.add("remove");

    // Put the pieces together
    info.appendChild(memberName);
    info.appendChild(details);
    info.appendChild(memberBio);

    member.appendChild(info);
    member.appendChild(removeBtn);

    // Show the member on the page
    memberList.appendChild(member);
}


// ===== Step 7: Update the member counter =====
function updateCount() {
    const members = memberList.querySelectorAll(".member-item");
    count.textContent = members.length;
}


// ===== Step 9: Remove a member =====
memberList.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove")) {

        const member = event.target.closest("li");
        member.remove();

        updateCount();

        // Show the empty message again if no members are left
        if (memberList.querySelectorAll(".member-item").length === 0) {
            const emptyNote = document.createElement("li");
            emptyNote.id = "emptyNote";
            emptyNote.classList.add("empty");
            emptyNote.textContent = "No members yet. Register someone to begin.";
            memberList.appendChild(emptyNote);
        }
    }
});


// ===== Step 10: Dark Mode toggle =====
themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "Light Mode";
    } else {
        themeBtn.textContent = "Dark Mode";
    }
});


// Set the correct member count when the page loads
updateCount();
