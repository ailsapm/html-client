//mock product object to compare against form data
const mockProduct = {
    name: 'Test',
    description: 'Description',
    price: 10,
    available: true,
  };
  
  //test - collectFormData returns expected object
  test('collectFormData returns expected object', () => {
    //mimic HTML structure of form inputs
    document.body.innerHTML = `
      <input id="name" value="Test">
      <input id="description" value="Description">
      <input id="price" value="10">
      <input type="checkbox" id="available" checked>
    `;
    //the function being tested
    const data = collectFormData();
    //assert that the result matches the expected mock product
    expect(data).toEqual(mockProduct);
  });

/**
 * @jest-environment jsdom
 * Tells Jest to simulate a browser-like environment using jsdom.
 * Allows for interaction with DOM elements in the tests.
 * Ref thanks to https://stephencharlesweiss.com/jest-test-environments/
 */

  //the functions to be tested from the app script
  const { collectFormData, resetForm } = require('../js/app');

//grouping of tests related to form behaviour
describe('Product Form Behavior', () => {
  //setup - before each test, reset the HTML form structure
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="form-card editing"> 
        <h2></h2>
        <form id="product-form">
          <input type="hidden" id="product-id" />
          <input id="name" value="" />
          <input id="description" value="" />
          <input id="price" type="number" value="" />
          <input type="checkbox" id="available" />
          <button></button>
        </form>
      </div>
    `;
  });

  //test - collectFormData returns correct object when form is filled
  test('collectFormData() returns correct data object', () => {
    //mimic user input
    document.getElementById('name').value = 'Test Product';
    document.getElementById('description').value = 'A test product.';
    document.getElementById('price').value = '9.99';
    document.getElementById('available').checked = true;

    //call the function to test
    const data = collectFormData();

    //check that the returned object matches expected data
    expect(data).toEqual({
      name: 'Test Product',
      description: 'A test product.',
      price: 9.99,
      available: true,
    });
  });

  //test - resetForm clears all fields in the form
  test('resetForm() clears inputs and ID field', () => {
    // mimic user entering values
    document.getElementById('name').value = 'Test Product';
    document.getElementById('description').value = 'A test product.';
    document.getElementById('price').value = '9.99';
    document.getElementById('available').checked = true;
    document.getElementById('product-id').value = '123';

    //call the function
    resetForm();
    //assert expected values
    expect(document.getElementById('name').value).toBe('');
    expect(document.getElementById('description').value).toBe('');
    expect(document.getElementById('price').value).toBe('');
    expect(document.getElementById('available').checked).toBe(false);
    expect(document.getElementById('product-id').value).toBe('');
  });
});
