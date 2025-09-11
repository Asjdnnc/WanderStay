document.querySelectorAll("a").forEach(a => {
    a.addEventListener('click', async () => {
      const category = a.getAttribute('data-category');
      const response = await fetch(`/wanderstay/listings?category=${category}`);
      const listings = await response.json();
      displayListings(listings);
    });
  });
  
    // Implement this function to update your listings display
    function displayListings(listings) {
        const container = document.getElementById('listings-container');
        container.innerHTML = '';
        listings.forEach(listing => {
          const listingElement = document.createElement('div');
          listingElement.classList.add('listing');
          listingElement.innerHTML = `
            <img src="${listing.image.url}" alt="${listing.title}">
            <h3>${listing.title}</h3>
            <p>${listing.description}</p>
            <p>₹${listing.price} / night</p>
          `;
          container.appendChild(listingElement);
        });
      }
