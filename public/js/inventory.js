"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.getElementById("classification");

  if (classificationList) {
    classificationList.addEventListener("change", function () {
      const classificationId = classificationList.value;
      console.log(`classification_id is: ${classificationId}`);

      const classIdURL = `/inv/getInventory/${classificationId}`;

      fetch(classIdURL)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not OK");
        })
        .then((data) => {
          console.log("Fetched data:", data);
          buildInventoryList(data);
        })
        .catch((error) => {
          console.error("There was a problem:", error.message);
        });
    });
  }
});

function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!inventoryDisplay) return;

  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
  dataTable += "</thead><tbody>";

  data.forEach((inventory) => {
    const id = inventory.inventory_id;
    if (!id) {
      console.warn("⚠️ Missing inventory ID for element:", inventory);
      return;
    }

    dataTable += `<tr><td>${inventory.make} ${inventory.model}</td>`;
    dataTable += `<td><a href='/inv/edit/${id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${id}' title='Click to delete'>Delete</a></td></tr>`;
  });

  dataTable += "</tbody>";

  inventoryDisplay.innerHTML = dataTable;
}
