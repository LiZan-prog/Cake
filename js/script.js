document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const response = document.getElementById("response");
  const ordersList = document.getElementById("orders-list");
  const submitBtn = form?.querySelector('button[type="submit"]');

  const setStatus = (message, type = "success") => {
    if (!response) return;
    response.textContent = message;
    response.className = `mt-6 font-medium ${type === "error" ? "text-red-600" : "text-green-600"}`;
  };

  const setLoadingOrders = () => {
    if (!ordersList) return;
    ordersList.innerHTML = "<p class='text-center text-gray-500'>Loading recent orders…</p>";
  };

  const renderOrders = (orders = []) => {
    if (!ordersList) return;

    if (!orders.length) {
      ordersList.innerHTML = "<p class='text-center text-gray-500'>No orders yet — be the first!</p>";
      return;
    }

    ordersList.innerHTML = "";
    orders.forEach((o) => {
      const li = document.createElement("div");
      li.className = "bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow";
      li.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-gray-800">${o.name}</p>
            <p class="text-sm text-gray-500">Ordered <span class="font-medium">${o.quantity}</span> <span class="font-medium">${o.cake}</span></p>
          </div>
          <span class="text-xs text-gray-400">${new Date(o.createdAt || o.timestamp || Date.now()).toLocaleDateString()}</span>
        </div>
      `;
      ordersList.appendChild(li);
    });
  };

  const loadOrders = async () => {
    if (!ordersList) return;
    setLoadingOrders();

    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      renderOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      ordersList.innerHTML = "<p class='text-center text-red-500'>Failed to load orders. Please try again later.</p>";
    }
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const cake = document.getElementById("cake")?.value;
      const quantity = Number(document.getElementById("quantity")?.value);

      if (!name || !cake || !quantity) {
        setStatus("Please fill out all fields.", "error");
        return;
      }

      submitBtn?.setAttribute("disabled", "disabled");
      setStatus("Placing your order…");

      try {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, cake, quantity }),
        });

        const data = await res.json();
        setStatus(data.message || "Order placed!", res.ok ? "success" : "error");
        form.reset();
        loadOrders();
      } catch (err) {
        console.error(err);
        setStatus("Error submitting order. Please try again.", "error");
      } finally {
        submitBtn?.removeAttribute("disabled");
      }
    });
  }

  // Smooth-anchor scroll (for nav links)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (evt) => {
      const targetId = anchor.getAttribute("href")?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      evt.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  loadOrders();
});