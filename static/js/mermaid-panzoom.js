// Adds zoom/pan controls to static SVG diagrams using svg-pan-zoom.
(function () {
  const cdnSrc = 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js';
  const instances = window.__svgPanZoomInstances || (window.__svgPanZoomInstances = new Set());
  let libraryPromise = null;

  function loadSvgPanZoom() {
    if (window.svgPanZoom) return Promise.resolve(window.svgPanZoom);
    if (libraryPromise) return libraryPromise;

    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = cdnSrc;
      script.async = true;
      script.onload = () => resolve(window.svgPanZoom);
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return libraryPromise;
  }

  function normalizeSvg(svg) {
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';

    const viewBoxParts = (svg.getAttribute('viewBox') || '').trim().split(/\s+/);
    let vbW = parseFloat(viewBoxParts[2]);
    let vbH = parseFloat(viewBoxParts[3]);

    if (!Number.isFinite(vbW) || !Number.isFinite(vbH)) {
      const widthAttr = parseFloat(svg.getAttribute('width'));
      const heightAttr = parseFloat(svg.getAttribute('height'));
      if (Number.isFinite(widthAttr) && Number.isFinite(heightAttr)) {
        vbW = widthAttr;
        vbH = heightAttr;
      } else if (svg.getBBox) {
        const box = svg.getBBox();
        if (box && Number.isFinite(box.width) && Number.isFinite(box.height)) {
          vbW = box.width;
          vbH = box.height;
        }
      }
    }

    if (!svg.getAttribute('viewBox') && Number.isFinite(vbW) && Number.isFinite(vbH)) {
      svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
    }

    if (!Number.isFinite(vbW) || !Number.isFinite(vbH) || vbW === 0 || vbH === 0) {
      console.warn('Skip svg-pan-zoom attach due to invalid dimensions', { vbW, vbH });
      return false;
    }

    svg.setAttribute('width', vbW);
    svg.setAttribute('height', vbH);
    return true;
  }

  function addToolbar(svg, instance) {
    const host = svg.parentElement;
    if (!host) return;

    if (!host.style.position || host.style.position === 'static') {
      host.style.position = 'relative';
    }
    if (!host.style.overflow) {
      host.style.overflow = 'hidden';
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'mermaid-panzoom-toolbar';
    toolbar.innerHTML = `
      <button type="button" data-action="zoom-in" aria-label="Zoom in">+</button>
      <button type="button" data-action="zoom-out" aria-label="Zoom out">−</button>
      <button type="button" data-action="reset" aria-label="Reset view">⟳</button>
    `;

    Object.assign(toolbar.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      gap: '6px',
      background: 'rgba(0,0,0,0.35)',
      color: '#fff',
      padding: '4px 6px',
      borderRadius: '6px',
      backdropFilter: 'blur(4px)',
      zIndex: 5,
      fontSize: '12px'
    });

    toolbar.querySelectorAll('button').forEach(btn => {
      Object.assign(btn.style, {
        background: 'rgba(255,255,255,0.2)',
        color: 'inherit',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '4px',
        width: '28px',
        height: '24px',
        cursor: 'pointer'
      });
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'zoom-in') instance.zoomIn();
        if (action === 'zoom-out') instance.zoomOut();
        if (action === 'reset') instance.reset();
      });
    });

    host.appendChild(toolbar);
  }

  function attachPanZoom(svg) {
    if (svg.dataset.panzoomAttached === 'true') return;
    if (!normalizeSvg(svg)) return;

    try {
      const instance = window.svgPanZoom(svg, {
        controlIconsEnabled: false,
        fit: true,
        center: true,
        zoomScaleSensitivity: 0.4,
        minZoom: 0.5,
        maxZoom: 10,
        beforePan: function (oldPan, newPan) {
          const gutterWidth = 100;
          const gutterHeight = 100;
          const sizes = this.getSizes();
          const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
          const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
          const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
          const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);
          return {
            x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
            y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
          };
        }
      });

      instance.resize();
      instance.fit();
      instance.center();
      instances.add(instance);
      addToolbar(svg, instance);
      svg.dataset.panzoomAttached = 'true';
    } catch (err) {
      console.error('svg-pan-zoom init failed for diagram', err);
    }
  }

  async function inlineSvgImage(img) {
    if (img.dataset.panzoomProcessed === 'true') return null;
    const src = img.currentSrc || img.getAttribute('src');
    if (!src || !src.endsWith('.svg')) return null;

    try {
      const response = await fetch(src, { mode: 'cors' });
      if (!response.ok) {
        console.warn('Unable to load SVG for pan/zoom', src);
        return null;
      }
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svg = doc.documentElement;
      const alt = img.getAttribute('alt') || 'Diagram';

      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', alt);
      svg.dataset.panzoomSource = src;

      const wrapper = document.createElement('div');
      wrapper.className = 'svg-panzoom-shell';
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'block';

      img.replaceWith(wrapper);
      wrapper.appendChild(svg);
      img.dataset.panzoomProcessed = 'true';
      return svg;
    } catch (err) {
      console.error('Failed to inline SVG for pan/zoom', err);
      return null;
    }
  }

  async function collectTargets() {
    const imgTargets = Array.from(document.querySelectorAll('img[data-panzoom="svg"], img.svg-panzoom'));
    const inlineTargets = Array.from(document.querySelectorAll('svg[data-panzoom="svg"], svg.svg-panzoom'));
    const inlined = await Promise.all(imgTargets.map(inlineSvgImage));
    return [...inlineTargets, ...inlined.filter(Boolean)];
  }

  async function initPanZoom() {
    try {
      const targets = await collectTargets();
      if (!targets.length) return;
      await loadSvgPanZoom();
      targets.forEach(attachPanZoom);
    } catch (err) {
      console.error('svg-pan-zoom failed to initialize', err);
    }
  }

  function bindResize() {
    if (window.__svgPanZoomResizeBound) return;
    window.addEventListener('resize', () => {
      instances.forEach(inst => {
        inst.resize();
        inst.fit();
        inst.center();
      });
    });
    window.__svgPanZoomResizeBound = true;
  }

  function watchForNewTargets() {
    if (window.__svgPanZoomObserver) return;
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches && (node.matches('img[data-panzoom="svg"], svg[data-panzoom="svg"], img.svg-panzoom, svg.svg-panzoom'))) {
            initPanZoom();
            return;
          }
          if (node.querySelector && node.querySelector('img[data-panzoom="svg"], svg[data-panzoom="svg"], img.svg-panzoom, svg.svg-panzoom')) {
            initPanZoom();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.__svgPanZoomObserver = observer;
  }

  const onReady = () => {
    initPanZoom();
    bindResize();
    watchForNewTargets();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  window.enableSvgPanZoom = initPanZoom;
})();
