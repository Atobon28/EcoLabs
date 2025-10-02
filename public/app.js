(function () {
  const outputEl = document.getElementById("output");
  const statusEl = document.getElementById("status");

  const setStatus = (text, kind = "muted") => {
    statusEl.textContent = text;
    statusEl.className = `chip ${kind}`;
  };

  const show = (data) => {
    const json = JSON.stringify(data, null, 2);
    outputEl.textContent = json;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputEl.textContent || "");
      setStatus("Copiado al portapapeles", "success");
    } catch (e) {
      setStatus("No se pudo copiar", "error");
    }
  };

  const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    return await res.json();
  };

  const preferredOrFallback = async ({ preferredUrl, fallbackBaseUrl, clientProcessor }) => {
    try {
      return await fetchJson(preferredUrl);
    } catch (e) {
      try {
        const baseData = await fetchJson(fallbackBaseUrl);
        return typeof clientProcessor === "function" ? clientProcessor(baseData) : baseData;
      } catch (err) {
        throw e; // surface original preferred error
      }
    }
  };

  // Event helpers
  const on = (id, event, handler) => document.getElementById(id)?.addEventListener(event, handler);

  // Buttons
  on("btn-clear", "click", () => { outputEl.textContent = ""; setStatus("Listo"); });
  on("btn-copy", "click", () => { copy(); });

  // 1) Traer todos los products  
  on("btn-products-all", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/products");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

    // 2) Products con price < 50
  on("btn-products-lt50", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/products/cheap");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 3) Solo username y email de users
  on("btn-users-fields", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/users/basic");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 4) Órdenes por fecha ↓
  on("btn-orders-sorted", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await preferredOrFallback({
        preferredUrl: "/orders?sort=-created_at",
        fallbackBaseUrl: "/orders",
        clientProcessor: (items) => {
          const copy = Array.isArray(items) ? [...items] : [];
          copy.sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
          return copy;
        },
      });
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 5) Products > 30 y category=Electronics
  on("btn-products-adv", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/products/electronics");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 6) Posts con 'tutorial' en title
  on("btn-posts-like", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/posts/search?title=tutorial");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 7) Primeros 10 products
  on("btn-products-first10", "click", async () => {
    setStatus("Cargando…");
    try {
      const data = await fetchJson("/products/page/1");
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  // 8) Products del usuario
  on("btn-products-by-user", "click", async () => {
    const userIdRaw = document.getElementById("input-user-id").value.trim();
    if (!userIdRaw) { setStatus("Ingresa un user_id", "error"); return; }
    const userId = encodeURIComponent(userIdRaw);
    setStatus("Cargando…");
    try {
      const data = await preferredOrFallback({
        preferredUrl: `/users/${userId}/products`,
        fallbackBaseUrl: "/products",
        clientProcessor: (items) => items.filter((p) => {
          const uid = p?.user_id ?? p?.userId;
          return String(uid) === String(userIdRaw);
        }),
      });
      show(data);
      setStatus("OK", "success");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });
})(); 