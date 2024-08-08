document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const cartTableBody = document.getElementById('cartTable').querySelector('tbody');
    const favouritesList = document.getElementById('favouritesList');
    const applyFavouritesButton = document.getElementById('applyFavourites');
    const clearCartButton = document.getElementById('clearCart');
    const buyNowButton = document.getElementById('buyNow');
    const finalTotalPriceElement = document.getElementById('finalTotalPrice');

    // Function to get product details
    function getProductDetails(product) {
        return {
            name: product.dataset.name,
            price: parseFloat(product.dataset.price),
            image: product.dataset.image,
            quantity: product.querySelector('.item-quantity') ? parseInt(product.querySelector('.item-quantity').value, 10) : 1
        };
    }

    // Function to add product to cart
    function addProductToCart(productDetails) {
        const newRow = cartTableBody.insertRow(-1);
        newRow.innerHTML = `
            <td>${productDetails.name}</td>
            <td><img src="${productDetails.image}" alt="${productDetails.name}" width="50" height="50"></td>
            <td>Rs. ${productDetails.price.toFixed(2)}/-</td>
            <td>${productDetails.quantity}</td>
            <td>Rs. ${(productDetails.price * productDetails.quantity).toFixed(2)}/-</td>
        `;
        updateFinalTotalPrice();
    }

    // Function to update the final total price
    function updateFinalTotalPrice() {
        let totalPrice = 0;
        cartTableBody.querySelectorAll('tr').forEach((row) => {
            const rowTotal = parseFloat(row.cells[4].textContent.replace('Rs. ', '').replace('/-', ''));
            totalPrice += rowTotal;
        });
        finalTotalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Add event listeners to "Add to Cart" buttons
    products.forEach((product) => {
        product.querySelector('.add-to-cart').addEventListener('click', () => {
            addProductToCart(getProductDetails(product));
        });
    });

    // Add event listeners to "Add to Favourite" buttons
    products.forEach((product) => {
        product.querySelector('.toggle-favourite').addEventListener('click', () => {
            const favouriteProduct = product.cloneNode(true);
            favouriteProduct.querySelector('.toggle-favourite').remove();
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Favourite';
            removeButton.className = 'remove-from-favourite';
            favouriteProduct.appendChild(removeButton);
            removeButton.addEventListener('click', () => {
                favouriteProduct.remove();
            });
            favouritesList.appendChild(favouriteProduct);
        });
    });

    // Add event listener to the "Apply Favourites" button
    applyFavouritesButton.addEventListener('click', () => {
        favouritesList.querySelectorAll('.product').forEach((favouriteProduct) => {
            addProductToCart(getProductDetails(favouriteProduct));
        });
    });

    // Clear cart button functionality
    clearCartButton.addEventListener('click', () => {
        cartTableBody.innerHTML = '';
        updateFinalTotalPrice();
    });

    // Buy Now button functionality
    buyNowButton.addEventListener('click', () => {
        const cartData = [];
        cartTableBody.querySelectorAll('tr').forEach((row) => {
            const name = row.cells[0].textContent;
            const image = row.cells[1].querySelector('img').src;
            const price = parseFloat(row.cells[2].textContent.replace('Rs. ', '').replace('/-', ''));
            const quantity = parseInt(row.cells[3].textContent, 10);
            const total = parseFloat(row.cells[4].textContent.replace('Rs. ', '').replace('/-', ''));
            cartData.push({ name, image, price, quantity, total });
        });
        const finalTotalPrice = finalTotalPriceElement.textContent;
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('finalTotalPrice', finalTotalPrice);
    });
});