/* ==========================================================================
   Blog — list, search, filter, read, compose, comment, admin pin/delete
   ========================================================================== */

var Blog = (function () {
  "use strict";

  var API_BASE = (typeof API !== "undefined" ? API : "http://localhost:5001") + "/api/blog";
  var currentUser = null;
  var currentPage = 1;
  var currentSearch = "";
  var currentAuthor = "";
  var pinnedOnly = false;
  var debounceTimer = null;
  var authors = [];

  /* ── Init ────────────────────────────────────────────────────────────── */

  function init() {
    /* Try session first, then validate with backend */
    var stored = sessionStorage.getItem("pwc_user");
    if (stored) {
      try { currentUser = JSON.parse(stored); } catch (_) { currentUser = null; }
    }

    /* Always validate session with backend */
    fetch((typeof API !== "undefined" ? API : "http://localhost:5001") + "/api/auth/me", { credentials: "include" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (u) {
          currentUser = u;
          sessionStorage.setItem("pwc_user", JSON.stringify(u));
        } else {
          currentUser = null;
        }
        applyUserUI();
      })
      .catch(function () { applyUserUI(); });

    /* Wire search & filters */
    var searchInput = document.getElementById("blog-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          currentSearch = searchInput.value;
          currentPage = 1;
          loadPosts();
        }, 300);
      });
    }

    var authorSelect = document.getElementById("blog-filter-author");
    if (authorSelect) {
      authorSelect.addEventListener("change", function () {
        currentAuthor = authorSelect.value;
        currentPage = 1;
        loadPosts();
      });
    }

    var pinnedBtn = document.getElementById("blog-filter-pinned");
    if (pinnedBtn) {
      pinnedBtn.addEventListener("click", function () {
        pinnedOnly = !pinnedOnly;
        pinnedBtn.classList.toggle("active", pinnedOnly);
        currentPage = 1;
        loadPosts();
      });
    }

    loadPosts();
  }

  function applyUserUI() {
    var newBtn = document.getElementById("blog-new-btn");
    if (newBtn) {
      newBtn.style.display = currentUser ? "" : "none";
    }
  }

  /* ── Load Posts ──────────────────────────────────────────────────────── */

  function loadPosts() {
    var params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("per_page", "10");
    if (currentSearch) params.set("search", currentSearch);
    if (currentAuthor) params.set("author", currentAuthor);
    if (pinnedOnly) params.set("pinned", "true");

    var container = document.getElementById("blog-posts");
    container.innerHTML = '<div class="pwc-blog-loading">Loading...</div>';

    fetch(API_BASE + "/posts?" + params.toString())
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load posts");
        return r.json();
      })
      .then(function (data) {
        renderPosts(data.posts, data.total);
        renderPagination(data.page, data.pages, data.total);
        collectAuthors(data.posts);
      })
      .catch(function (err) {
        container.innerHTML = '<div class="pwc-blog-empty">Could not load posts. Is the backend running?</div>';
      });
  }

  function collectAuthors(posts) {
    posts.forEach(function (p) {
      if (p.author && authors.indexOf(p.author) === -1) {
        authors.push(p.author);
      }
    });
    var sel = document.getElementById("blog-filter-author");
    if (!sel) return;
    var current = sel.value;
    /* keep existing options, add new ones */
    var existing = [];
    for (var i = 0; i < sel.options.length; i++) existing.push(sel.options[i].value);
    authors.forEach(function (a) {
      if (existing.indexOf(a) === -1) {
        var opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        sel.appendChild(opt);
      }
    });
    sel.value = current;
  }

  /* ── Render Post Cards ──────────────────────────────────────────────── */

  function renderPosts(posts, total) {
    var container = document.getElementById("blog-posts");
    if (!posts || posts.length === 0) {
      container.innerHTML = '<div class="pwc-blog-empty">No posts found.</div>';
      return;
    }

    var html = "";
    posts.forEach(function (p) {
      var pinBadge = p.is_pinned
        ? '<span class="pwc-blog-pin-badge">📌 Pinned</span>'
        : '';
      var preview = p.body.length > 200 ? p.body.substring(0, 200) + "..." : p.body;
      var date = formatDate(p.created_at);
      var adminBtns = "";
      if (currentUser && currentUser.role === "admin") {
        if (p.is_pinned) {
          adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.unpinPost(' + p.id + ')" title="Unpin">Unpin</button>';
        } else {
          adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.showPinModal(' + p.id + ')" title="Pin">Pin</button>';
        }
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Blog.deletePost(' + p.id + ')" title="Delete">Delete</button>';
      } else if (currentUser && currentUser.id === p.author_id) {
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Blog.deletePost(' + p.id + ')" title="Delete">Delete</button>';
      }

      var editBtn = "";
      if (currentUser && (currentUser.id === p.author_id || currentUser.role === "admin")) {
        editBtn = '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.showEdit(' + p.id + ')" title="Edit">Edit</button>';
      }

      html += '<article class="pwc-blog-card' + (p.is_pinned ? ' pwc-blog-card--pinned' : '') + '" onclick="Blog.openPost(' + p.id + ')">'
        + '<div class="pwc-blog-card-top">'
        +   pinBadge
        +   '<div class="pwc-blog-card-admin">' + editBtn + adminBtns + '</div>'
        + '</div>'
        + '<h2 class="pwc-blog-card-title">' + escapeHtml(p.title) + '</h2>'
        + '<p class="pwc-blog-card-preview">' + escapeHtml(preview) + '</p>'
        + '<div class="pwc-blog-card-meta">'
        +   '<span class="pwc-blog-card-author">' + escapeHtml(p.author || "Unknown") + '</span>'
        +   '<span class="pwc-blog-card-date">' + date + '</span>'
        +   '<span class="pwc-blog-card-comments">' + p.comment_count + ' comment' + (p.comment_count !== 1 ? 's' : '') + '</span>'
        + '</div>'
        + '</article>';
    });

    container.innerHTML = html;
  }

  /* ── Pagination ─────────────────────────────────────────────────────── */

  function renderPagination(page, pages, total) {
    var container = document.getElementById("blog-pagination");
    if (pages <= 1) { container.style.display = "none"; return; }
    container.style.display = "";

    var html = "";
    if (page > 1) {
      html += '<button class="pwc-blog-page-btn" onclick="Blog.goPage(' + (page - 1) + ')">← Prev</button>';
    }
    for (var i = 1; i <= pages; i++) {
      html += '<button class="pwc-blog-page-btn' + (i === page ? ' active' : '') + '" onclick="Blog.goPage(' + i + ')">' + i + '</button>';
    }
    if (page < pages) {
      html += '<button class="pwc-blog-page-btn" onclick="Blog.goPage(' + (page + 1) + ')">Next →</button>';
    }
    container.innerHTML = html;
  }

  function goPage(p) {
    currentPage = p;
    loadPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Open Single Post ───────────────────────────────────────────────── */

  function openPost(id) {
    var overlay = document.getElementById("blog-detail-overlay");
    var content = document.getElementById("blog-detail-content");
    content.innerHTML = '<div class="pwc-blog-loading">Loading...</div>';
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    fetch(API_BASE + "/posts/" + id, { credentials: "include" })
      .then(function (r) {
        if (!r.ok) throw new Error("Post not found");
        return r.json();
      })
      .then(function (post) {
        renderDetail(post);
      })
      .catch(function () {
        content.innerHTML = '<div class="pwc-blog-empty">Could not load post.</div>';
      });
  }

  function renderDetail(post) {
    var content = document.getElementById("blog-detail-content");
    var date = formatDate(post.created_at);
    var pinLabel = post.is_pinned ? '<span class="pwc-blog-pin-badge">📌 Pinned</span>' : '';

    var bodyHtml = escapeHtml(post.body).replace(/\n/g, "<br>");

    var html = '<article class="pwc-blog-detail">'
      + pinLabel
      + '<h1>' + escapeHtml(post.title) + '</h1>'
      + '<div class="pwc-blog-detail-meta">'
      +   '<span>By <strong>' + escapeHtml(post.author || "Unknown") + '</strong></span>'
      +   '<span>' + date + '</span>'
      + '</div>'
      + '<div class="pwc-blog-detail-body">' + bodyHtml + '</div>'
      + '</article>';

    /* Comments */
    html += '<section class="pwc-blog-comments">'
      + '<h3>' + (post.comments ? post.comments.length : 0) + ' Comment' + ((post.comments && post.comments.length !== 1) ? 's' : '') + '</h3>';

    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(function (c) {
        var canDelete = currentUser && (currentUser.id === c.author_id || currentUser.role === "admin");
        html += '<div class="pwc-blog-comment">'
          + '<div class="pwc-blog-comment-header">'
          +   '<strong>' + escapeHtml(c.author || "Unknown") + '</strong>'
          +   '<span>' + formatDate(c.created_at) + '</span>'
          +   (canDelete ? '<button class="pwc-blog-comment-del" onclick="Blog.deleteComment(' + c.id + ', ' + post.id + ')" title="Delete comment">&times;</button>' : '')
          + '</div>'
          + '<p>' + escapeHtml(c.body) + '</p>'
          + '</div>';
      });
    } else {
      html += '<p class="pwc-blog-no-comments">No comments yet. Be the first!</p>';
    }

    /* Comment form */
    if (currentUser) {
      html += '<form class="pwc-blog-comment-form" onsubmit="Blog.submitComment(event, ' + post.id + ')">'
        + '<textarea id="blog-comment-body" placeholder="Write a comment..." required rows="3"></textarea>'
        + '<button type="submit" class="pwc-btn pwc-btn-sage">Post Comment</button>'
        + '</form>';
    } else {
      html += '<p class="pwc-blog-login-prompt"><a href="' + baseUrl() + '/navigation/login">Log in</a> to leave a comment.</p>';
    }

    html += '</section>';
    content.innerHTML = html;
  }

  function hideDetail() {
    document.getElementById("blog-detail-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  /* ── Compose / Edit ─────────────────────────────────────────────────── */

  function showCompose() {
    document.getElementById("blog-compose-title").textContent = "New Post";
    document.getElementById("blog-edit-id").value = "";
    document.getElementById("blog-post-title").value = "";
    document.getElementById("blog-post-body").value = "";
    document.getElementById("blog-submit-btn").textContent = "Publish";
    document.getElementById("blog-compose-overlay").style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("blog-post-title").focus();
  }

  function showEdit(postId) {
    fetch(API_BASE + "/posts/" + postId, { credentials: "include" })
      .then(function (r) { return r.json(); })
      .then(function (post) {
        document.getElementById("blog-compose-title").textContent = "Edit Post";
        document.getElementById("blog-edit-id").value = post.id;
        document.getElementById("blog-post-title").value = post.title;
        document.getElementById("blog-post-body").value = post.body;
        document.getElementById("blog-submit-btn").textContent = "Save Changes";
        document.getElementById("blog-compose-overlay").style.display = "flex";
        document.body.style.overflow = "hidden";
      });
  }

  function hideCompose() {
    document.getElementById("blog-compose-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  function submitPost(e) {
    e.preventDefault();
    var editId = document.getElementById("blog-edit-id").value;
    var title = document.getElementById("blog-post-title").value.trim();
    var body = document.getElementById("blog-post-body").value.trim();
    if (!title || !body) return;

    var btn = document.getElementById("blog-submit-btn");
    btn.disabled = true;
    btn.textContent = "Saving...";

    var url = editId ? API_BASE + "/posts/" + editId : API_BASE + "/posts";
    var method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, body: body }),
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
        return r.json();
      })
      .then(function () {
        hideCompose();
        loadPosts();
      })
      .catch(function (err) {
        alert(err.message);
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = editId ? "Save Changes" : "Publish";
      });
  }

  /* ── Comments ───────────────────────────────────────────────────────── */

  function submitComment(e, postId) {
    e.preventDefault();
    var textarea = document.getElementById("blog-comment-body");
    var body = textarea.value.trim();
    if (!body) return;

    fetch(API_BASE + "/posts/" + postId + "/comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body }),
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
        return r.json();
      })
      .then(function () { openPost(postId); })
      .catch(function (err) { alert(err.message); });
  }

  function deleteComment(commentId, postId) {
    if (!confirm("Delete this comment?")) return;
    fetch((typeof API !== "undefined" ? API : "http://localhost:5001") + "/api/blog/comments/" + commentId, {
      method: "DELETE",
      credentials: "include",
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to delete");
        openPost(postId);
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Admin: Pin / Unpin / Delete ────────────────────────────────────── */

  function showPinModal(postId) {
    document.getElementById("blog-pin-post-id").value = postId;
    document.getElementById("blog-pin-overlay").style.display = "flex";
  }

  function hidePinModal() {
    document.getElementById("blog-pin-overlay").style.display = "none";
  }

  function pinPost(days) {
    var postId = document.getElementById("blog-pin-post-id").value;
    fetch(API_BASE + "/posts/" + postId + "/pin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: days || 0 }),
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
        hidePinModal();
        loadPosts();
      })
      .catch(function (err) { alert(err.message); });
  }

  function unpinPost(postId) {
    fetch(API_BASE + "/posts/" + postId + "/pin", {
      method: "DELETE",
      credentials: "include",
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed");
        loadPosts();
      })
      .catch(function (err) { alert(err.message); });
  }

  function deletePost(postId) {
    if (!confirm("Delete this post and all its comments?")) return;
    fetch(API_BASE + "/posts/" + postId, {
      method: "DELETE",
      credentials: "include",
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed");
        /* If detail is open, close it */
        var detail = document.getElementById("blog-detail-overlay");
        if (detail.style.display !== "none") hideDetail();
        loadPosts();
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Helpers ────────────────────────────────────────────────────────── */

  function formatDate(iso) {
    var d = new Date(iso);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function baseUrl() {
    /* Jekyll baseurl */
    var base = document.querySelector('link[rel="canonical"]');
    if (base) {
      var u = new URL(base.href);
      return u.pathname.replace(/\/navigation\/blog\/?$/, "");
    }
    return "/wc-FE";
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Public API */
  return {
    openPost: openPost,
    hideDetail: hideDetail,
    showCompose: showCompose,
    showEdit: showEdit,
    hideCompose: hideCompose,
    submitPost: submitPost,
    submitComment: submitComment,
    deleteComment: deleteComment,
    showPinModal: showPinModal,
    hidePinModal: hidePinModal,
    pinPost: pinPost,
    unpinPost: unpinPost,
    deletePost: deletePost,
    goPage: goPage,
  };

})();
