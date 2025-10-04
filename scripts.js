/* =======================================
   Coloring Pages Blogger Theme Script
   Handles: Image Buttons + Lazy Load + Print Fix
   ======================================= */

document.addEventListener("DOMContentLoaded", function() {

  // Add Download + Print Buttons under all post images
  document.querySelectorAll('.post-body img').forEach(function(img) {
    const container = document.createElement('div');
    container.className = 'image-buttons';
    container.innerHTML = `
      <button class="download-btn" onclick="downloadImage('${img.src}')">Download</button>
      <button class="print-btn" onclick="printImage('${img.src}')">Print</button>
    `;
    img.insertAdjacentElement('afterend', container);
  });

  // Lazy load images
  document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
  });

});

// Download specific image
function downloadImage(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'coloring-page.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Print specific image (fixed)
function printImage(url) {
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head><title>Print Coloring Page</title></head>
      <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#fff;">
        <img src="${url}" style="width:100%;height:auto;object-fit:contain;"/>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.onload = function() {
    win.print();
    win.close();
  };
}
async function loadPosts() {
  const feed = '/feeds/posts/default?alt=json&max-results=8';
  try {
    const response = await fetch(feed);
    const data = await response.json();
    const entries = data.feed.entry || [];
    const grid = document.getElementById('post-grid');
    entries.forEach(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === 'alternate').href;
      const thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s600/') : 'https://via.placeholder.com/600x800';
      const html = `
        <a href="${link}" class="post-card">
          <img src="${thumb}" alt="${title}">
          <h2>${title}</h2>
        </a>`;
      grid.insertAdjacentHTML('beforeend', html);
    });
  } catch (err) {
    console.error('Error loading posts:', err);
  }
}
document.addEventListener('DOMContentLoaded', loadPosts);
