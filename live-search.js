// Attach an event listener to the search input field
	document.querySelector('.search-field').addEventListener('input', function (event) {
		// Get the search query from the input field
		var searchQuery = event.target.value;

		// Check if the search query is empty
		if (searchQuery === '') {
			// If the search query is empty, remove the search results
			document.getElementById('search-results').innerHTML = '';
			return;
		}

		// Show the loader
		document.getElementById('search-results').innerHTML = '<div class="loader"></div>';

		// Wait 5 seconds before sending the API requests
		setTimeout(function () {
			// An array to hold the promises returned by the API requests
			var promises = [];

			// Send a GET request to the WordPress REST API endpoint to search for posts
			promises.push(fetch('/wp-json/wp/v2/posts?search=' + searchQuery).then(function (response) {
				return response.json();
			}));

			// Send a GET request to the WordPress REST API endpoint to search for pages
			promises.push(fetch('/wp-json/wp/v2/pages?search=' + searchQuery).then(function (response) {
				return response.json();
			}));

			// Wait for both API requests to complete
			Promise.all(promises)
				.then(function (results) {
					// Combine the results from the two API requests
					var posts = results[0].concat(results[1]);

					// Check if any matches were found
					if (posts.length === 0) {
						// If no matches were found, show a "Not Found" message
						document.getElementById('search-results').innerHTML = '<p>Not Found</p>';
					} else {

						// Create a list element to hold the search results
						var list = document.createElement('ul');

						// Loop through the returned posts and add each one to the list
						for (var i = 0; i < posts.length; i++) {
							var item = document.createElement('li');
							var link = document.createElement('a');

							// Check if the post has a link property
							if (posts[i].link) {
								link.href = posts[i].link;
							} else {
								link.href = '#';
							}

							// Check if the post has a title property
							if (posts[i].title && posts[i].title.rendered) {
								link.innerHTML = posts[i].title.rendered;
							} else {
								link.innerHTML = 'No Title';
							}

							item.appendChild(link);
							list.appendChild(item);
						}

						// Replace the existing search results with the new list
						document.getElementById('search-results').innerHTML = '';
						document.getElementById('search-results').appendChild(list);

					}


				});
		}, 1000);

	});
