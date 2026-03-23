/**
 * Forms: "demo" or "webhook/formspree"
 * Important: do NOT put Telegram tokens in frontend.
 * Use serverless functions from /integrations.
 */
(function(){
  function serializeForm(form){
    const data = new FormData(form);
    const obj = {};
    data.forEach((v,k)=> obj[k] = String(v));
    // Enrich: district (Район)
    try{
      const raw = obj.district || obj.location_id || "";
      if(raw) obj.district = raw;
      // backwards compat fields
      if(obj.location_id) delete obj.location_id;
      if(obj.location_title) delete obj.location_title;
    }catch(_){}
    obj.page = location.pathname.split("/").pop() || "index.html";
    obj.timestamp = new Date().toISOString();
    return obj;
  }

  async function postJSON(url, payload){
    const res = await fetch(url, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const txt = await res.text().catch(()=> "");
      throw new Error(`HTTP ${res.status}: ${txt}`.slice(0, 300));
    }
    return res.json().catch(()=> ({}));
  }


  function wireSignupCityDistrict(form){
    const citySel = form.querySelector("#signupCity");
    const distSel = form.querySelector("#signupDistrict");
    if(!citySel || !distSel) return null;

    const map = (window.SITE_DATA && window.SITE_DATA.districtsByCity) ? window.SITE_DATA.districtsByCity : {};

    const sync = () => {
      const city = (citySel.value || "").trim();
      if(!city){
        distSel.disabled = true;
        distSel.innerHTML = `<option value="" selected disabled>Сначала выберите город</option>`;
        return;
      }

      const districts = (map[city] || []).filter(Boolean);
      distSel.disabled = false;
      distSel.innerHTML =
        `<option value="" selected disabled>Выберите район</option>` +
        districts.map(d => `<option value="${d}">${d}</option>`).join("");
    };

    citySel.addEventListener("change", () => {
      // reset district selection whenever city changes
      distSel.value = "";
      sync();
    });

    sync();
    return sync;
  }

  function attach(){
    const form = document.getElementById("signupForm");
    if(!form) return;

    // City → District dependency inside the signup modal
    const syncCityDistrict = wireSignupCityDistrict(form);

    form.addEventListener("submit", async (e)=>{
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const old = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправляем...';

      try{
        const payload = serializeForm(form);
        const mode = SITE_CONFIG.forms.mode;

        if(mode === "webhook" || mode === "formspree"){
          await postJSON(SITE_CONFIG.forms.endpoint, payload);
        }else{
          // demo: simulate latency
          await new Promise(r=>setTimeout(r, 700));
        }

        btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Заявка отправлена';
        btn.classList.remove("btn-accent");
        btn.classList.add("btn-outline-accent");

        await new Promise(r=>setTimeout(r, 800));

        // close modal if present
        const modalEl = document.getElementById("signupModal");
        if(modalEl && window.bootstrap){
          const modal = bootstrap.Modal.getInstance(modalEl);
          if(modal) modal.hide();
        }

        // redirect (optional)
        if(SITE_CONFIG.forms.successRedirect){
          location.href = SITE_CONFIG.forms.successRedirect;
          return;
        }

        // reset UI
        form.reset();
        if(syncCityDistrict) syncCityDistrict();
        btn.disabled = false;
        btn.classList.remove("btn-outline-accent");
        btn.classList.add("btn-accent");
        btn.innerHTML = old;

      }catch(err){
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = old;
        alert("Не удалось отправить. Проверь endpoint в config.js или попробуй позже.");
      }
    });
  }

  // Delay so modal gets injected
  setTimeout(attach, 50);
})();
