// Importing necessary modules and data
import { menuArray } from './data.js'; // Importing an array of menu items from a data file
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; // Importing the UUID module

// Initializing variables
const orders = []; // Array to store the selected menu items
const payBtn = document.getElementById('submitform-btn'); // Button for submitting payment
const totalPriceElement = document.getElementById('totalPrice'); // Element to display the total price
const paymentModal = document.getElementById('paymentModal'); // Modal for payment

// Attaching event listeners
payBtn.addEventListener('click', handlePayButtonClick); // Listening for click events on the pay button
document.addEventListener('click', handleMenuButtonClick); // Listening for click events on the menu

// Initial rendering when the DOM is loaded
document.addEventListener('DOMContentLoaded', render); // Rendering the initial menu and order list

// Event handler for the pay button click
function handlePayButtonClick(e) {
  e.preventDefault(); // Preventing the default form submission behavior
  const form = document.getElementById('paymentForm'); // Getting the payment form

  if (form.checkValidity()) {
    // Custom validation for credit card number and CVV
    const creditCardInput = form.elements['creditcard']; // Getting the credit card input element
    const cvvInput = form.elements['cvv']; // Getting the CVV input element
    const creditCardValue = creditCardInput.value.trim(); // Getting the trimmed value of the credit card input
    const cvvValue = cvvInput.value.trim(); // Getting the trimmed value of the CVV input

    // Checking if the credit card number is not 16 digits or contains non-digit characters
    if (creditCardValue.length !== 16 || /\D/.test(creditCardValue)) {
      creditCardInput.setCustomValidity('Credit card number must be exactly 16 digits'); // Setting a custom validation message
      form.reportValidity(); // Displaying the validation message
      return;
    }

    // Checking if CVV is 3 digits
    if (cvvValue.length !== 3 || !/^\d{3}$/.test(cvvValue)) {
      cvvInput.setCustomValidity('CVV must be 3 digits'); // Setting a custom validation message
      form.reportValidity(); // Displaying the validation message
      return;
    }

    // Form is valid, continue with the payment process
    const customerName = form.elements['name'].value; // Getting the customer name from the form
    showOrderConfirmation(customerName); // Showing the order confirmation message

    // Remove event listeners from credit card and CVV inputs
    creditCardInput.removeEventListener('input', handleInput);
    cvvInput.removeEventListener('input', handleInput);
  } else {
    // Reset the custom validation messages
    const creditCardInput = form.elements['creditcard'];
    const cvvInput = form.elements['cvv'];
    creditCardInput.setCustomValidity('');
    cvvInput.setCustomValidity('');

    // Form is invalid, display the default error messages
    form.reportValidity();
  }
}

// Event handler for input changes
function handleInput() {
  this.setCustomValidity(''); // Resetting the custom validation message
}

// Attaching event listeners to credit card and CVV inputs
creditCardInput.addEventListener('input', handleInput);
cvvInput.addEventListener('input', handleInput);

// Show order confirmation message and hide payment modal
function showOrderConfirmation(customerName) {
  paymentModal.style.display = 'none'; // Hiding the payment modal

  // Clear the orders array once the order is confirmed
  orders.length = 0;
  render(); // Rendering the updated menu and order list

  totalPriceElement.innerHTML = `
    <div class="confirmMsg">
      <p>Thanks ${customerName}, your order is on its way!</p>
    </div>
  `;
}

// Event handler for menu button clicks
function handleMenuButtonClick(e) {
  const menuBtn = e.target.dataset.menubtn;
  const removeBtn = e.target.dataset.removebtn;
  const completeBtn = e.target.dataset.completebtn;

  if (menuBtn) {
    // Handling menu item selection
    const menu = menuArray.find(item => item.uuid === menuBtn);
    if (menu) {
      orders.push(menu); // Adding the selected menu item to the orders array
      render(); // Rendering the updated menu and order list
    }
  } else if (removeBtn) {
    // Handling order item removal
    const index = orders.findIndex(item => item.uuid === removeBtn);
    if (index !== -1) {
      orders.splice(index, 1); // Removing the order item from the orders array
      render(); // Rendering the updated menu and order list
    }
  } else if (completeBtn) {
    // Handling order completion
    paymentModal.style.display = 'block'; // Displaying the payment modal
  }
}

// Generate HTML for a menu item
function getMenuHtml(menu) {
  return `
    <div class="poop">
      <p class="emoji">${menu.emoji}</p>
      <div class="menu-details">
        <p class="name"><b>${menu.name}</b></p>
        <p class="ingredients">${menu.ingredients}</p>
        <p class="price"> <b> $${menu.price} </b></p>
      </div>
      <button class="menu-btn" data-menubtn=${menu.uuid}>+</button>
    </div>
    <div class="line"></div>
  `;
}

// Generate HTML for an order item
function getOrderItemHtml(order) {
  return `
    <div class="order-item">
      <p class="order-name">${order.name}</p>
      <button class="remove-btn" data-removebtn=${order.uuid}>Remove</button>
      <p class="order-price">$${order.price}</p>
    </div>
  `;
}

// Generate HTML for the total price and order list
function gettotalPriceHtml() {
  let totalPrice = 0;
  let orderHtml = '';

  orders.forEach(order => {
    totalPrice += order.price; // Calculating the total price
    orderHtml += getOrderItemHtml(order); // Generating HTML for each order item
  });

  return `
    <div>
      <p class="yourorder1">Your Order</p>
    </div>
    <div class="yourorderlist">
      ${orderHtml}
      <div class="order-line"></div>
      <div class="order-item total-price-item">
        <p class="order-font">Total Price:</p>
        <p class="order-price total-price">$${totalPrice}</p>
      </div>
    </div>
    <button class="confirm-btn" data-completebtn="">Complete order</button>
  `;
}

// ...

// Rendering the menu and order list
function render() {
  const feedElement = document.getElementById('feed');
  feedElement.innerHTML = menuArray.map(getMenuHtml).join(''); // Generating HTML for each menu item and joining them

  if (orders.length > 0) {
    // Rendering the order list and total price
    totalPriceElement.innerHTML = gettotalPriceHtml();
    const completeBtn = document.querySelector('[data-completebtn]');
    const closeModalBtn = document.getElementById('close-icon');

    completeBtn.addEventListener('click', () => {
      paymentModal.style.display = 'block'; // Displaying the payment modal when the complete order button is clicked
    });

    closeModalBtn.addEventListener('click', () => {
      paymentModal.style.display = 'none'; // Hiding the payment modal when the close icon is clicked
    });
  } else {
    totalPriceElement.innerHTML = ''; // Clearing the total price if there are no orders
  }
}
