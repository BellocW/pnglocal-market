const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProduct');

let products = JSON.parse(localStorage.getItem('products')) || [];

function displayProducts() {
    productList.innerHTML = '';
    products.forEach((p, index) => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p><strong>PGK ${p.price}</strong></p>
        `;
        productList.appendChild(card);
    });
}

addProductBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    if (!name || !price || !description) {
        alert("Please fill all required fields!");
        return;
    }

    products.push({ name, price, description, image });
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();

    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    document.getElementById('image').value = '';
});

displayProducts();
