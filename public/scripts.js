/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}



// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-All-Tables", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        // fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function register(event) {
    event.preventDefault();

    const mbtiValue  = document.getElementById('insertMbti').value;
    const emailValue = document.getElementById('insertEmail').value;
    const passwordValue = document.getElementById('insertPassword').value;
    const ageValue = document.getElementById('insertAge').value;
    const countryValue = document.getElementById('insertCountry').value;
    const genderValue = document.getElementById('insertGender').value;

  

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mbtiName:  mbtiValue,
            email: emailValue,
            password: passwordValue,
            age: ageValue,
            country: countryValue,
            gender: genderValue
            
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "register successfully!";
        // fetchTableData();
    } else {
        messageElement.textContent = "Error in registering!";
    }
}



//login 

async function login(event) {
    event.preventDefault();

   
    const emailValue = document.getElementById('loginEmail').value;
    const passwordValue = document.getElementById('loginPassword').value;
    


    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            
            email: emailValue,
            password: passwordValue,
            
            
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('loginResultMsg');

    if (responseData.success) {
        messageElement.textContent = "login successfully!";
       
    } else {
        messageElement.textContent = "Error in login!";
    }
}







// Updates names in the demotable. //todo
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        // fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}



//mbti test 

async function submitPersonalityTest(event) {
    event.preventDefault();  // Prevent the form from submitting in the traditional way

    // Get the binary values from the form
    const answers = {
        E: document.querySelector('input[name="question1"]:checked')?.value === 'E' ? 1 : 0,
        S: document.querySelector('input[name="question2"]:checked')?.value === 'S' ? 1 : 0,
        T: document.querySelector('input[name="question3"]:checked')?.value === 'T' ? 1 : 0,
        J: document.querySelector('input[name="question4"]:checked')?.value === 'J' ? 1 : 0,
    };

    const emailValue = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : null;

    const testData = {
        emailAddress: emailValue, // Use null if the user isn't logged in
        startDateTime: new Date().toISOString(),
        EIScore: answers.E,
        SNScore: answers.S,
        TFScore: answers.T,
        JPScore: answers.J
    };

    const messageElement = document.getElementById('testResultMsg');

    try {
        const response = await fetch('/submit-test-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.success) {
            messageElement.textContent = "Test submitted successfully!";
            document.getElementById('mbtiType').textContent = responseData.mbtiType;
        } else {
            throw new Error('Server response error');
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = "Error submitting test!";
    }
}

// Ensure this function is called after the document has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("personalityTestForm").addEventListener("submit", submitPersonalityTest);
});







// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    // fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", register);
    document.getElementById("loginForm").addEventListener("submit", login);
    document.getElementById("personalityTestForm").addEventListener("submit", submitPersonalityTest);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }
