//url for rails api, made it a const so i only had to change one url when I deploy
const apiUrl = 'http://18.201.136.216:3000/products'; // originally http://localhost:3000/products but I changed it when deployed
//when dom has fully loaded ...
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();  //load products first
  document.getElementById('availability-filter').addEventListener('change', loadProducts); //reload products when filter changes

  //handle form submission for creating/updating a product
  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();  //stop page reload
    const id = document.getElementById('product-id').value;
    //if there's an ID, update existing product; otherwise, create new product
    id ? updateProduct(id) : createProduct();
  });
});
//to load and display products from api
function loadProducts() {
  fetch(apiUrl)
    .then(res => res.json())  //convert response to json
    .then(data => {
      const filter = document.getElementById('availability-filter').value;  //filter according to selected option
      if (filter === 'available') {
        data = data.filter(p => p.available);  //show available products only
      } else if (filter === 'unavailable') {  
        data = data.filter(p => !p.available);  //show unavailable products only
      }  
      //if neither are selected then all products will show

      //constructing the product table
      const list = document.getElementById('product-list');
      list.innerHTML = `
        <table class="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th class="center-header">Availability</th>
              <th class="center-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(product => `
              <tr>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td class="badge-cell">
                <div class="badge-wrapper">
                  <span class="badge ${product.available ? 'badge-available' : 'badge-unavailable'}">
                    ${product.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                </td>

                <td class="actions">
                <!-- class action buttons -->
                  <button class="action-btn edit" data-id="${product.id}">Edit</button>
                  <button class="action-btn delete" data-id="${product.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      //attaching event listeners to buttons
      //edit buttons
      document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          editProduct(id);
        });
      });
      //delete buttons
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          deleteProduct(id);
        });
      });
    });
}

//adding a product by sending a post request
function createProduct() {
  const product = collectFormData();
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product }),
  })
    .then(() => {
      alert('Product added!');  //let user know product successfully added
      resetForm();  //reset form
      loadProducts();  //reload product list
    });
}

//to edit a product
function updateProduct(id) {
  const product = collectFormData();
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',  
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product }),  //send product data
  })
    .then(() => {
      alert('Product updated!');   //let user know update was a success
      resetForm();  //reset form
      loadProducts();   //reload product iist
    });
}

//to delete a product by id
function deleteProduct(id) {
  fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
    .then(() => {
      alert('Product deleted!');   //let user know deletion was a success
      loadProducts();  //reload product list
    });
}

//to populate editing form using product data of selected id
function editProduct(id) {
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())   //convert to json
    .then(product => {
      document.getElementById('product-id').value = product.id;
      document.getElementById('name').value = product.name;
      document.getElementById('description').value = product.description;
      document.getElementById('price').value = product.price;
      document.getElementById('available').checked = product.available;

      //update heading and button to visually indicate edit mode
      document.querySelector('h2').textContent = 'Edit Product';
      document.querySelector('#product-form button').textContent = 'Update Product';

      //highlight form
      document.querySelector('.form-card').classList.add('editing');

      //scroll form into view. smoothly :)
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    });
}

//to collect form data into object
function collectFormData() {
  return {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    available: document.getElementById('available').checked,
  };
}

//to reset form to default state
function resetForm() {
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';

  //eeset heading and button to original Add 
  document.querySelector('h2').textContent = 'Add Product';
  document.querySelector('#product-form button').textContent = 'Save Product';

  // Remove highlight when out of editing mode
  document.querySelector('.form-card').classList.remove('editing');
}

//only for tests, so the browser won't care
if (typeof module !== 'undefined' && module.exports) {
 module.exports = { collectFormData, resetForm };
}

