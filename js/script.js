document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("orderForm");
  const response = document.getElementById("response");
  const ordersList = document.getElementById("orders-list");

  // Submit new order
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const cake = document.getElementById("cake").value;
    const quantity = document.getElementById("quantity").value;

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cake, quantity })
      });

      const data = await res.json();
      response.textContent = data.message;
      form.reset();
      loadOrders(); // refresh recent orders
    } catch (err) {
      response.textContent = "Error submitting order.";
      console.error(err);
    }
  });

  // Load recent orders
  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      ordersList.innerHTML = "";
      data.orders.forEach(o => {
        const li = document.createElement("li");
        li.textContent = `${o.name} ordered ${o.quantity} ${o.cake}(s)`;
        ordersList.appendChild(li);
      });
    } catch (err) {
      ordersList.textContent = "Failed to load orders.";
    }
  }

  loadOrders();
});