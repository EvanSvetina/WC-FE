/**
 * profile.js — Poway Woman's Club
 *
 * Auth gate: checks sessionStorage for a logged-in user object.
 * If present, renders the profile; otherwise shows the gate screen.
 *
 * SESSION CONTRACT (set by your login page):
 *   sessionStorage.setItem('pwc_user', JSON.stringify({
 *     username: 'jdoe',
 *     firstName: 'Jane',
 *     lastName:  'Doe',
 *     email:     'jane@example.com',
 *     bio:       '',
 *     languages: [],   // array of strings
 *     interests: []    // array of strings
 *   }));
 *
 * Profile edits are saved back to sessionStorage AND to
 * localStorage under the key `pwc_profile_<username>` so
 * they survive page refreshes.
 */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem('pwc_user')); }
    catch (_) { return null; }
  }

  function saveSession(user) {
    sessionStorage.setItem('pwc_user', JSON.stringify(user));
    // persist per-user profile across refreshes
    localStorage.setItem('pwc_profile_' + user.username, JSON.stringify(user));
  }

  function loadSavedProfile(username) {
    try { return JSON.parse(localStorage.getItem('pwc_profile_' + username)); }
    catch (_) { return null; }
  }

  function el(id) { return document.getElementById(id); }

  function showMsg(msgEl, text, isError) {
    msgEl.textContent = text;
    msgEl.className = 'pwc-save-msg visible' + (isError ? ' error' : '');
    setTimeout(function () { msgEl.className = 'pwc-save-msg'; }, 3000);
  }

  /* ── Auth check ───────────────────────────────────────────── */

  var user = getSession();

  if (!user) {
    // Show auth gate, hide profile
    el('pwc-auth-gate').style.display = '';
    el('pwc-profile-app').style.display = 'none';
    return;
  }

  // Merge any previously saved profile fields on top of session
  var saved = loadSavedProfile(user.username);
  if (saved) { user = Object.assign({}, user, saved); }

  el('pwc-auth-gate').style.display = 'none';
  el('pwc-profile-app').style.display = 'grid';

  /* ── Populate UI ──────────────────────────────────────────── */

  function getInitials(u) {
    var f = (u.firstName || '').charAt(0).toUpperCase();
    var l = (u.lastName  || '').charAt(0).toUpperCase();
    return f + l || '?';
  }

  function renderOverview() {
    el('avatarInitials').textContent = getInitials(user);
    el('sidebarName').textContent    = (user.firstName + ' ' + user.lastName).trim() || user.username;
    el('sidebarEmail').textContent   = user.email || '';

    el('ov-name').textContent  = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || '—';
    el('ov-email').textContent = user.email || '—';
    el('ov-bio').textContent   = user.bio   || '—';

    renderTagList('ov-languages', user.languages || [], false);
    renderTagList('ov-interests', user.interests  || [], true);
  }

  function renderTagList(containerId, items, useRose) {
    var container = el(containerId);
    container.innerHTML = '';
    if (!items.length) {
      container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">None added yet</span>';
      return;
    }
    items.forEach(function (item) {
      var span = document.createElement('span');
      span.className = 'pwc-tag' + (useRose ? ' pwc-tag--rose' : '');
      span.textContent = item;
      container.appendChild(span);
    });
  }

  /* ── Fill edit form ───────────────────────────────────────── */

  function fillEditForm() {
    el('firstName').value = user.firstName || '';
    el('lastName').value  = user.lastName  || '';
    el('email').value     = user.email     || '';
    el('bio').value       = user.bio       || '';

    renderChips('langChips',     langTags,      false);
    renderChips('interestChips', interestTags,  true);
  }

  /* ── Tag chip state ───────────────────────────────────────── */

  var langTags     = (user.languages || []).slice();
  var interestTags = (user.interests  || []).slice();

  function renderChips(containerId, tags, useRose) {
    var container = el(containerId);
    container.innerHTML = '';
    tags.forEach(function (tag, i) {
      var chip = document.createElement('span');
      chip.className = 'pwc-chip' + (useRose ? ' pwc-chip--rose' : '');

      var label = document.createElement('span');
      label.textContent = tag;

      var btn = document.createElement('button');
      btn.className = 'pwc-chip-remove';
      btn.textContent = '×';
      btn.setAttribute('aria-label', 'Remove ' + tag);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', (function (idx, arr, cId, rose) {
        return function () {
          arr.splice(idx, 1);
          renderChips(cId, arr, rose);
        };
      })(i, tags, containerId, useRose));

      chip.appendChild(label);
      chip.appendChild(btn);
      container.appendChild(chip);
    });
  }

  function bindTagInput(inputId, tags, chipsId, useRose) {
    var input = el(inputId);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        var val = input.value.trim().replace(/,$/, '');
        if (val && !tags.includes(val)) {
          tags.push(val);
          renderChips(chipsId, tags, useRose);
        }
        input.value = '';
      }
      // allow backspace to remove last chip when input empty
      if (e.key === 'Backspace' && input.value === '' && tags.length) {
        tags.pop();
        renderChips(chipsId, tags, useRose);
      }
    });
  }

  bindTagInput('langInput',     langTags,     'langChips',     false);
  bindTagInput('interestInput', interestTags, 'interestChips', true);

  /* ── Save profile ─────────────────────────────────────────── */

  el('saveBtn').addEventListener('click', function () {
    var fn = el('firstName').value.trim();
    var ln = el('lastName').value.trim();
    var em = el('email').value.trim();

    if (!fn || !ln) {
      showMsg(el('saveMsg'), 'First and last name are required.', true);
      return;
    }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      showMsg(el('saveMsg'), 'Please enter a valid email address.', true);
      return;
    }

    user.firstName = fn;
    user.lastName  = ln;
    user.email     = em;
    user.bio       = el('bio').value.trim();
    user.languages = langTags.slice();
    user.interests = interestTags.slice();

    saveSession(user);
    renderOverview();
    showMsg(el('saveMsg'), '✓ Profile saved.', false);
  });

  /* ── Password change (stub) ───────────────────────────────── */

  el('changePwBtn').addEventListener('click', function () {
    var cur = el('currentPw').value;
    var nw  = el('newPw').value;
    var cf  = el('confirmPw').value;
    var msg = el('pwMsg');

    if (!cur || !nw || !cf) {
      showMsg(msg, 'All fields are required.', true); return;
    }
    if (nw.length < 8) {
      showMsg(msg, 'New password must be at least 8 characters.', true); return;
    }
    if (nw !== cf) {
      showMsg(msg, 'Passwords do not match.', true); return;
    }

    // TODO: wire to your actual auth/backend
    el('currentPw').value = '';
    el('newPw').value = '';
    el('confirmPw').value = '';
    showMsg(msg, '✓ Password updated.', false);
  });

  /* ── Logout ───────────────────────────────────────────────── */

  el('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('pwc_user');
    window.location.href = window.location.origin + (window.PWC_BASE || '') + '/navigation/login';
  });

  /* ── Tab switching ────────────────────────────────────────── */

  var navBtns = document.querySelectorAll('.pwc-sidenav-btn');
  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      navBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      document.querySelectorAll('.pwc-tab').forEach(function (tab) {
        tab.classList.remove('active');
      });
      el('tab-' + target).classList.add('active');

      // Sync edit form when switching to it
      if (target === 'edit') { fillEditForm(); }
    });
  });

  /* ── Init ─────────────────────────────────────────────────── */

  renderOverview();
  fillEditForm();

})();