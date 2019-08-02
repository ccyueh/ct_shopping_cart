// add header and switch between "pages"
function loadHeader(response) {
  $('header').html(response);

  $('#checkout').click(function(e) {
    e.preventDefault();
    $('#products').hide();
    $('#checkout-table').removeClass('col-md-3').addClass('col-md-12');
  })

  $('#home').click(function(e) {
    e.preventDefault();
    $('#checkout-table').removeClass('col-md-12').addClass('col-md-3');
    $('#products').show();
  })
}
$.get('./components/header.html', loadHeader)

// add product card for each product
function loadProducts(response) {
  let product_rows = `<div class="row extra-margin-md">`;
  for (let i in response) {
    let product = response[i];
    let product_card = `
      <div class="col-md-4">
        <div class="card">
          <img src="${product.img_url}" alt="Placeholder" class="card-img">
          <div class="card-title">${product.name}</div>
          <div class="card-subtitle">$${product.price.toFixed(2)}</div>
          <div class="card-text">${product.description}</div>
          <button class="btn btn-success btn-add" id="add-${product.id}">Add to Cart</button>
        </div>
      </div>
    `
    product_rows += product_card;
    if ( (i+1)%3 == 0 ) {
      product_rows += `</div><div class="row extra-margin-md">`;
    }
  }
  product_rows += `</div>`
  $('#products').html(product_rows);
}
$.get('../static/data/products.json', loadProducts);

// create checkout table
function displayCart(cart) {
  $.get('../static/data/products.json', function(response) {
  let products = response;
  let rows = ``;
  let cart_total = 0;
  for (let i in Object.keys(cart)) {
    let product_id = Object.keys(cart)[i];
    let product = products.filter(obj => { return obj.id === product_id})[0];
    let row = `
    <tr id="table-${product_id}">
    <td>${cart[product_id]}</td>
    <td>${product.name}</td>
    <td>$${product.price.toFixed(2)}</td>
    <td><button class="btn btn-danger btn-del" id="del-${product.id}">X</button></td>
    </tr>
    `
    rows += row;

    cart_total += cart[product_id] * product.price;
  }
  $('#nav-total').html(`Total: $${cart_total.toFixed(2)}`);

  if (Object.keys(cart).length > 0) {
    rows += `<tr>
    <td colspan="2"><b>Total:</b></td>
    <td colspan="2">$${cart_total.toFixed(2)}</td>
    </tr>`;
  }
  $('tbody').html(rows);

  $('.btn-del').click(function(e) {
    let product_id = $(this).attr('id').split('-')[1];
    $(`#table-${product_id}`).html(``);
    delete cart[product_id];
  })
})
}

function addToCart(response) {
  let cart = {};
  let products = response;

  $('.btn-add').click(function(e) {
      let product_id = $(this).attr('id').split('-')[1];

      if (!(product_id in cart)) {
        cart[product_id] = 1;
      } else {
        cart[product_id] += 1;
      }
    displayCart(cart);
  })
}
$.get('../static/data/products.json', addToCart);
