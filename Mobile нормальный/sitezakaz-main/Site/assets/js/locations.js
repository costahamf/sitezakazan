/* Locations page (city -> branches) + Yandex constructor maps
   - No external map libs needed
   - Data source: window.SITE_DATA.locations
*/

(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function uniq(arr){
    return Array.from(new Set(arr));
  }

  function safeText(v){
    return (v ?? '').toString();
  }

  function buildOption(value, label){
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    return opt;
  }

  function setLocked(isLocked){
    const wrap = $('#mapWrap');
    if (!wrap) return;
    wrap.classList.toggle('is-locked', isLocked);
  }

  function showCityMap(city){
    const nsk = $('#ymap-nsk');
    const tlt = $('#ymap-tlt');
    if (!nsk || !tlt) return;

    const isNsk = city === 'Новосибирск';
    nsk.classList.toggle('d-none', !isNsk);
    tlt.classList.toggle('d-none', isNsk);
  }

  function renderList(listEl, items){
    if (!listEl) return;
    if (!items.length){
      listEl.innerHTML = '<div class="muted small">Нет локаций по выбранным фильтрам.</div>';
      return;
    }

    listEl.innerHTML = items.map(loc => {
      const branch = safeText(loc.title || 'Филиал');
      const addr = safeText(loc.address || loc.addr || '');
      const area = safeText(loc.area || '');
      const city = safeText(loc.city || '');

      return `
        <div class="location-item">
          <div class="location-title">${branch}</div>
          <div class="location-meta">
            <div><i class="bi bi-geo-alt-fill" style="color:var(--accent-3)"></i> ${addr || branch}</div>
            ${area ? `<div class="mt-1"><span class="badge-soft">${area}</span></div>` : ''}
          </div>
          <div class="mt-3 d-flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-outline-accent" data-bs-toggle="modal" data-bs-target="#signupModal" data-pref-city="${city}" data-pref-branch="${branch}" data-pref-area="${area}">Записаться</button>
          </div>
        </div>
      `;
    }).join('');

    // Wire the "Записаться" buttons to prefill signup modal (if present)
    $$('.location-item button[data-pref-city]').forEach(btn => {
      btn.addEventListener('click', () => {
        try{
          const citySel = $('#signupCity');
          const areaSel = $('#signupDistrict');
          const branchSel = $('#signupBranch');

          const city = btn.getAttribute('data-pref-city') || '';
          const area = btn.getAttribute('data-pref-area') || '';
          const branch = btn.getAttribute('data-pref-branch') || '';

          if (citySel){
            citySel.value = city;
            citySel.dispatchEvent(new Event('change', {bubbles:true}));
          }
          setTimeout(()=>{
            if (areaSel && area){
              areaSel.value = area;
              areaSel.dispatchEvent(new Event('change', {bubbles:true}));
            }
            if (branchSel && branch) branchSel.value = branch;
          }, 0);
        }catch(e){ /* no-op */ }
      });
    });
  }

  function init(){
    const data = (window.SITE_DATA && Array.isArray(window.SITE_DATA.locations)) ? window.SITE_DATA.locations : [];

    const citySelect = $('#locCitySelect');
    const branchSelect = $('#locBranchSelect');
    const listEl = $('#locationsList');

    if (!citySelect || !branchSelect) return;

    // Build city options
    const cities = uniq(data.map(d => d.city).filter(Boolean)).sort((a,b)=>a.localeCompare(b,'ru'));
    // keep first placeholder option
    citySelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    cities.forEach(city => citySelect.appendChild(buildOption(city, city)));

    function resetBranch(){
      branchSelect.innerHTML = '';
      branchSelect.appendChild(buildOption('', 'Сначала выберите город'));
      branchSelect.disabled = true;
    }

    function populateBranches(city){
      const branches = uniq(data.filter(d=>d.city===city).map(d=>d.title).filter(Boolean));
      branchSelect.innerHTML = '';
      branchSelect.appendChild(buildOption('', 'Все филиалы'));
      branches.forEach(br => branchSelect.appendChild(buildOption(br, br)));
      branchSelect.disabled = false;
    }

    function applyFilters(){
      const city = citySelect.value;
      const branch = branchSelect.value;

      if (!city){
        renderList(listEl, []);
        setLocked(true);
        showCityMap('Новосибирск'); // silhouette under the matte overlay
        return;
      }

      setLocked(false);
      showCityMap(city);

      let filtered = data.filter(d => d.city === city);
      if (branch) filtered = filtered.filter(d => (d.title) === branch);

      renderList(listEl, filtered);
    }

    // Initial state
    resetBranch();
    setLocked(true);
    showCityMap('Новосибирск');
    renderList(listEl, []);

    citySelect.addEventListener('change', () => {
      const city = citySelect.value;
      if (!city){
        resetBranch();
      } else {
        populateBranches(city);
      }
      applyFilters();
    });

    branchSelect.addEventListener('change', applyFilters);

    // Prefill signup modal when opened from this page (if form has city/district)
    document.addEventListener('show.bs.modal', (evt) => {
      const target = evt.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.id !== 'signupModal') return;

      const city = citySelect.value;
      const branch = branchSelect.value;

      const citySel = $('#signupCity');
      const branchSel = $('#signupBranch');
      if (citySel && city) {
        citySel.value = city;
        citySel.dispatchEvent(new Event('change', {bubbles:true}));
      }
      if (branchSel && branch) branchSel.value = branch;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
