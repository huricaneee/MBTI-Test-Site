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
		messageElement.textContent = "reset successfully!";
		// fetchTableData();
	} else {
		alert("Error resetting!");
	}
}

// Inserts new records into the demotable.
async function register(event) {
	event.preventDefault();

	const emailValue = document.getElementById('insertEmail').value;
	const passwordValue = document.getElementById('insertPassword').value;
	const mbtiValue  = document.getElementById('insertMbti').value;
	const ageValue = document.getElementById('insertAge').value;
	const countryValue = document.getElementById('insertCountry').value;
	const genderValue = document.getElementById('insertGender').value;

	const response = await fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			emailAddress: emailValue,
			password: passwordValue,
			mbtiName: mbtiValue,
			age: ageValue,
			country: countryValue,
			userGender: genderValue
		})
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('insertResultMsg');

	if (responseData.success) {
		messageElement.textContent = "register successfully!";
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
			password: passwordValue
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

// Updates account information
async function updateAccountInfo(event) {
	event.preventDefault();

	// Get the form data
	const emailValue = document.getElementById('updateEmail').value;
	const passwordValue = document.getElementById('updatePassword').value;
	const mbtiValue = document.getElementById('updateMbti').value;
	const ageValue = document.getElementById('updateAge').value;
	const countryValue = document.getElementById('updateCountry').value;
	const genderValue = document.getElementById('updateGender').value;

	// Send the data to the server
	const response = await fetch('/update-account-info', {  // Adjust the endpoint as necessary
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			emailAddress: emailValue,
			password: passwordValue,
			mbtiName: mbtiValue,
			age: ageValue,
			country: countryValue,
			userGender: genderValue
		})
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('updateNameResultMsg');

	if (responseData.success) {
		messageElement.textContent = "Account updated successfully!";
	} else {
		messageElement.textContent = "Error updating account!";
	}
}



//mbti test 

async function submitPersonalityTest(event) {
	event.preventDefault();  // Prevent the form from submitting in the traditional way

    // Get the binary values from the form
    const answers = {
        E: document.querySelector('input[name="question1"]:checked')?.value === 'E' ? 100 : 0,
        S: document.querySelector('input[name="question2"]:checked')?.value === 'S' ? 100 : 0,
        T: document.querySelector('input[name="question3"]:checked')?.value === 'T' ? 100 : 0,
        J: document.querySelector('input[name="question4"]:checked')?.value === 'J' ? 100 : 0,
    };

	const emailValue = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : null;
	const now = new Date();
	const timestamp = formatToTimestamp(now);

	const testData = {
		emailAddress: emailValue, // Use null if the user isn't logged in
		startDateTime: timestamp,
		EIScore: answers.E,
		SNScore: answers.S,
		TFScore: answers.T,
		JPScore: answers.J
	};

    const messageElement = document.getElementById('testResultMsg');
    const mbtiElement = document.getElementById('mbtiTypeDisplay');
    const retriving = document.getElementById('mbtiType');

	try {
		const response = await fetch('/submit-test-questions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(testData)
		});


		const responseData = await response.json();
        let mbti = responseData.mbtiType;

        if (responseData.success) {
            messageElement.textContent = "Test submitted successfully!";
            mbtiElement.textContent = responseData.mbtiType;
            retriving.style.display = 'none';
         console.log(mbti);
            fetchAndUpdateRecommendations('/get-book-recommendation', mbti, 'books');
    fetchAndUpdateRecommendations('/get-video-recommendation', mbti, 'videos');
    fetchAndUpdateRecommendations('/get-article-recommendation', mbti, 'articles');

//     updateTable('books', testBooks);
// updateTable('videos', testVideos);
// updateTable('articles', testArticles);
        } else {
            throw new Error('Server response error');
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = "Error submitting test!";
    }   
}
// async function fetchAndDisplayUsers() {
//     const tableElement = document.getElementById('demotable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('/demotable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const demotableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     demotableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }





// async function fetchAndUpdateRecommendations() {


//     fetchAndUpdateRecommendations('/get-book-recommendation', mbtiName, 'books');
//     fetchAndUpdateRecommendations('/get-video-recommendation', mbtiName, 'videos');
//     fetchAndUpdateRecommendations('/get-article-recommendation', mbtiName, 'articles');

//     const bookresponse = await fetch('/get-book-recommendatio', {
//         method: 'GET'
//     });

//     const bookresponseData = await bookresponse.json();
//     const booktableContent = bookresponseData.data;
//     updateTable('books', booktableContent);

//     // Always clear old, already fetched data before new fetching process.
//     // if (tableBody) {
//     //     tableBody.innerHTML = '';
//     // }
//     // booktableContent.forEach(user => {
//     //     const row = tableBody.insertRow();
//     //     user.forEach((field, index) => {
//     //         const cell = row.insertCell(index);
//     //         cell.textContent = field;
//     //     });
//     // });

// 		.then(response => response.json())
// 		.then(data => {
// 			updateTable('books', data.books);
// 			updateTable('videos', data.videos);
// 			updateTable('articles', data.articles);
// 		})
// 		.catch(error => console.error('Failed to fetch recommendations:', error));
// }

// function fetchAndUpdateRecommendations(apiEndpoint, mbtiName, type) {
//     fetch(`${apiEndpoint}?mbtiName=${mbtiName}`) // Assuming you will use query parameters
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 updateTable(type, data.data);
//             } else {
//                 console.error(`Failed to fetch ${type}:`, data.message);
//             }
//         })
//         .catch(error => console.error(`Error fetching ${type}:`, error));
// }


// function fetchAndUpdateRecommendations(apiEndpoint, mbtiName, type) {
//     fetch(apiEndpoint, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ mbtiName: mbtiName })
//     })


function fetchAndUpdateRecommendations(apiEndpoint, mbtiName, type) {
    fetch(`${apiEndpoint}?mbtiName=${encodeURIComponent(mbtiName)}`)  // Ensure the parameter is properly encoded
        .then(response => response.json())
        .then(data => {
            if (data.success) {
				// console.log(1);
				// console.log("chia");
				// console.log(data);
                updateTable(type, data.data);
            } else {
                console.error(`Failed to fetch ${type}:`, data.message);
            }
        })
        .catch(error => console.error(`Error fetching ${type}:`, error));
}

    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         updateTable(type, data.data);
    //     } else {
    //         console.error(`Failed to fetch ${type}:`, data.message);
    //     }
    // })
    // .catch(error => console.error(`Error fetching ${type}:`, error));
// }



function updateTable(type, items) {
	console.log(items);
    // Select the correct table based on the type of content
    const table = document.querySelector(`.${type}-section table`);
    
    // Generate table rows from the items array
    let rows = items.map(item => {
		
        switch (type) {
			
            case 'books':
				console.log(2);
                return `<tr>
                            <td>${item[0]}</td>
                            <td>${item[1]}</td>
                            <td><a href="${item[2]}">Read here</a></td>
                            
                        </tr>`;
            case 'videos':
				console.log(3);
                return `<tr>
                            <td>${item[0]}</td>
                            <td>${item[1]}</td>
                            <td><a href="${item[2]}">Watch here</a></td>
                        </tr>`;
            case 'articles':
				
                return `<tr>
                            <td>${item[0]}</td>
                            <td>${item[1]}</td>
                            <td>${item[2]}</td>
                            <td><a href="${item[3]}">Read here</a></td>
                        </tr>`;
            default:
                return '';
        }
    }).join('');

    // Set the inner HTML of the table to include the new rows
    table.innerHTML = rows;
}










// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countMBTItype() {
	const response = await fetch("/count-mbtitable", {
		method: 'GET'
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('countResultMsg');

	if (responseData.success) {
		const tupleCount = responseData.count;
		messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
	} else {
		messageElement.textContent = `Error in count demotable!`;
	 
		
	}
}
//helper that turn New Date(); into sql timestamp formate
function formatToTimestamp(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
	document.getElementById("updataUserTable").addEventListener("submit", updateAccountInfo);
	document.getElementById("countmbtitable").addEventListener("click", countMBTItype);
};











// Test items for "books"
const testBooks = [
    {
        bookTitle: "1984",
        bookAuthor: "George Orwell",
        bookURL: "https://example.com/1984"
    },
    {
        bookTitle: "Brave New World",
        bookAuthor: "Aldous Huxley",
        bookURL: "https://example.com/brave-new-world"
    },
    {
        bookTitle: "To Kill a Mockingbird",
        bookAuthor: "Harper Lee",
        bookURL: "https://example.com/to-kill-a-mockingbird"
    }
];

// Test items for "videos"
const testVideos = [
    {
        videoTitle: "The Power of Vulnerability",
        videoType: "TED Talk",
        videoLink: "https://example.com/the-power-of-vulnerability"
    },
    {
        videoTitle: "Understanding the Universe",
        videoType: "Documentary",
        videoLink: "https://example.com/understanding-the-universe"
    },
    {
        videoTitle: "Learn JavaScript in 1 Hour",
        videoType: "Tutorial",
        videoLink: "https://example.com/learn-javascript"
    }
];

// Test items for "articles"
const testArticles = [
    {
        articleTitle: "Exploring the Depths of the Ocean",
        articleAuthor: "Jane Doe",
        articleText: "An in-depth look at ocean exploration.",
        articleURL: "https://example.com/exploring-ocean"
    },
    {
        articleTitle: "The Future of Artificial Intelligence",
        articleAuthor: "John Smith",
        articleText: "Predicting how AI will evolve in the coming years.",
        articleURL: "https://example.com/future-ai"
    },
    {
        articleTitle: "Meditation and Mindfulness",
        articleAuthor: "Emily White",
        articleText: "How meditation and mindfulness change the brain.",
        articleURL: "https://example.com/meditation-mindfulness"
    }
];

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }
