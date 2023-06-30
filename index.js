import { menuArray } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const orders = [];
const payBtn = document.getElementById('submitform-btn');
const totalPriceElement = document.getElementById('totalPrice');
const paymentModal = document.getElementById('paymentModal');


// Attach event listeners
payBtn.addEventListener('click', handlePayButtonClick);
document.addEventListener('click', handleMenuButtonClick);

// Initial rendering when the DOM is loaded
document.addEventListener('DOMContentLoaded', render);


// Event handler for the Pay button click
function handlePayButtonClick(e) {
  e.preventDefault();
  const form = document.getElementById('paymentForm');

  if (form.checkValidity()) {
    // Form is valid, continue with the payment process
    const customerName = form.elements['name'].value;
    showOrderConfirmation(customerName);
  } else {
    // Form is invalid, display the default error messages
    form.reportValidity();
  }
}

// Show order confirmation message and hide payment modal
function showOrderConfirmation(customerName) {
  
  paymentModal.style.display = 'none';
  
  // Clear the orders array once the order is confirmed
  orders.length = 0;
  render(); // Render the updated menu and order list

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
    const menu = menuArray.find(item => item.uuid === menuBtn);
    if (menu) {
      orders.push(menu);
      render();
    }
  } else if (removeBtn) {
    const index = orders.findIndex(item => item.uuid === removeBtn);
    if (index !== -1) {
      orders.splice(index, 1);
      render();
    }
  } else if (completeBtn) {
    paymentModal.style.display = 'block';
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
    totalPrice += order.price;
    orderHtml += getOrderItemHtml(order);
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

function render() {
  const feedElement = document.getElementById('feed');
  feedElement.innerHTML = menuArray.map(getMenuHtml).join('');

  if (orders.length > 0) {
    totalPriceElement.innerHTML = gettotalPriceHtml();
    const completeBtn = document.querySelector('[data-completebtn]');
    const closeModalBtn = document.getElementById('close-icon');

    completeBtn.addEventListener('click', () => {
      paymentModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
      paymentModal.style.display = 'none';
    });
  } else {
    totalPriceElement.innerHTML = '';
  }
}

// ...


