const Util = {};

/* ************************
 * Build classification grid HTML
 ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

/* ************************
 * Build navigation bar HTML (with logo and white links)
 ************************** */
Util.getNav = async function () {
  const invModel = require("../models/inventoryModel");
  let data = await invModel.getClassifications();
  
  let nav = `
  <div class="nav-container">
    <div class="nav-logo">
      <a href="/" title="Return to home page">
        <img src="/images/upgrades/flame.jpg" alt="CSE Motors Logo">
      </a>
    </div>
    <ul class="nav-links">
      <li><a href="/" title="Home page">Home</a></li>
  `;

  data.rows.forEach(row => {
    nav += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });

  nav += `
    </ul>
  </div>
  `;
  return nav;
};

module.exports = Util;
