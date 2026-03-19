/*
  VK iframe helper
  - Adds support for VK.VideoPlayer JS API (https://vk.com/js/api/videoplayer.js)
  - Lets us STOP playback slightly before the end to avoid VK end-screen recommendations

  Usage:
    VK_EMBED_HELPER.bindStopBeforeEnd(iframe)

  Note:
    The iframe src must contain js_api=1 for VK.VideoPlayer to work.
*/
(function(){
  const VK_SCRIPT = 'https://vk.com/js/api/videoplayer.js';
  let __vkReady = null;

  function isVkIframe(el){
    const src = (el && el.getAttribute && el.getAttribute('src')) ? el.getAttribute('src') : '';
    return /vk\.com/i.test(src) && /video_ext\.php/i.test(src);
  }

  function ensureVkApi(){
    if(__vkReady) return __vkReady;
    __vkReady = new Promise((resolve)=>{
      if(window.VK && window.VK.VideoPlayer){
        resolve(true);
        return;
      }

      const s = document.createElement('script');
      s.src = VK_SCRIPT;
      s.async = true;
      s.onload = ()=> resolve(true);
      s.onerror = ()=> resolve(false);
      document.head.appendChild(s);
    });
    return __vkReady;
  }

  async function bindStopBeforeEnd(iframe, opts){
    if(!iframe || !isVkIframe(iframe)) return;

    // Prevent double-binding for the same element
    if(iframe.dataset && iframe.dataset.vkBound === '1') return;
    if(iframe.dataset) iframe.dataset.vkBound = '1';

    const ok = await ensureVkApi();
    if(!ok || !(window.VK && window.VK.VideoPlayer)) return;

    const STOP_BEFORE = (opts && typeof opts.stopBeforeEnd === 'number') ? opts.stopBeforeEnd : 0.35;
    let stopped = false;

    try{
      const player = VK.VideoPlayer(iframe);

      // We DON'T wait for ENDED. Instead we stop slightly before it, so VK won't show recommendations.
      player.on(VK.VideoPlayer.Events.TIMEUPDATE, (st)=>{
        if(stopped) return;
        const dur = st?.duration || 0;
        const time = st?.time || 0;
        if(!dur) return;

        if(time >= dur - STOP_BEFORE){
          stopped = true;
          try{ player.pause(); }catch(_){ }
          try{ player.seek(Math.max(dur - 0.8, 0)); }catch(_){ }
        }
      });
    }catch(e){
      // Silent fail — the iframe still works as a normal embed.
    }
  }

  window.VK_EMBED_HELPER = {
    isVkIframe,
    ensureVkApi,
    bindStopBeforeEnd,
  };
})();
