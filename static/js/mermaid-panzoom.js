// Adds zoom/pan controls to Mermaid diagrams using svg-pan-zoom.
(function () {
  const cdnSrc = 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js';

  function loadSvgPanZoom() {
    if (window.svgPanZoom) return Promise.resolve(window.svgPanZoom);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = cdnSrc;
      script.async = true;
      script.onload = () => resolve(window.svgPanZoom);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function attachPanZoom() {
    const instances = window.__mermaidPanZoomInstances || (window.__mermaidPanZoomInstances = new Set());
    const diagrams = document.querySelectorAll('.mermaid svg');
    diagrams.forEach(svg => {
      if (svg.dataset.panzoomAttached === 'true') return;
      try {
        // Ensure the SVG can grow to fit its content instead of clipping
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';

        // Keep numeric width/height attrs to avoid NaN inside svg-pan-zoom
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
          return;
        }

        svg.setAttribute('width', vbW);
        svg.setAttribute('height', vbH);

        const instance = window.svgPanZoom(svg, {
          controlIconsEnabled: false,
          fit: true,
          center: true,
          zoomScaleSensitivity: 0.4,
          minZoom: 0.5,
          maxZoom: 10,
          beforePan: function(oldPan, newPan) {
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

        // Immediately resize/fit/center to avoid partially clipped diagrams
        instance.resize();
        instance.fit();
        instance.center();
        instances.add(instance);

      // Add custom toolbar (since built-in icons aren't present in this build)
      const host = svg.parentElement;
      if (host) {
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

        svg.dataset.panzoomAttached = 'true';
      } catch (err) {
        console.error('svg-pan-zoom init failed for mermaid diagram', err);
      }
    });

    // Keep diagrams fitting on viewport resize
    if (!window.__mermaidPanZoomResizeBound) {
      window.addEventListener('resize', () => {
        instances.forEach(inst => {
          inst.resize();
          inst.fit();
          inst.center();
        });
      });
      window.__mermaidPanZoomResizeBound = true;
    }
  }

  async function enableMermaidPanZoom() {
    try {
      await loadSvgPanZoom();
      attachPanZoom();
    } catch (err) {
      console.error('svg-pan-zoom failed to load', err);
    }
  }

  window.enableMermaidPanZoom = enableMermaidPanZoom;

  // Observe Mermaid renders that happen after this script loads
  function watchMermaidSvg() {
    if (window.__mermaidPanZoomObserver) return;
    const observer = new MutationObserver(mutations => {
      let shouldAttach = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches && node.matches('.mermaid svg')) shouldAttach = true;
          if (!shouldAttach && node.querySelector && node.querySelector('.mermaid svg')) shouldAttach = true;
          if (!shouldAttach && node.classList && node.classList.contains('mermaid') && node.querySelector('svg')) shouldAttach = true;
        });
      });
      if (shouldAttach) enableMermaidPanZoom();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.__mermaidPanZoomObserver = observer;
  }

  // Run on initial load and whenever mermaid render event fires.
  const onReady = () => enableMermaidPanZoom();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  watchMermaidSvg();
  document.addEventListener('mermaid:rendered', enableMermaidPanZoom);
})();
