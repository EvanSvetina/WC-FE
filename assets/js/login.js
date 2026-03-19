/**
 * login.js — Poway Woman's Club
 *
 * On successful login, writes the user object to sessionStorage.
 * profile.js reads this on the profile page to gate access and
 * pre-populate all fields.
 *
 * SESSION CONTRACT (must match profile.js):
 *   sessionStorage.setItem('pwc_user', JSON.stringify({
 *     username, firstName, lastName, email,
 *     bio, languages[], interests[]
 *   }));
 *
 * ── DEMO MODE ──────────────────────────────────────────────────
 * Two hardcoded users are included so you can test end-to-end
 * without a backend. Replace attemptLogin() with a real fetch()
 * call when your auth API is ready.
 * ───────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */

  // Base URL — matches _config.yml baseurl
  var BASE = '/wc-FE';

  // Backend API base URL (Flask server)
  var API_BASE_URL = (window.PWC_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');

  // Where to send the user after a successful login
  var REDIRECT_AFTER_LOGIN = BASE + '/navigation/profile';

  /* ── Demo users (replace with real API call) ─────────────────── */
  var DEMO_USERS = {
    'member': {
      username:  'member',
      password:  'password123',
      firstName: 'Jane',
      lastName:  'Doe',
      email:     'jane.doe@example.com',
      bio:       '',
      languages: ['English'],
      interests: []
    },
    'admin': {
      username:  'admin',
      password:  'admin123',
      firstName: 'Club',
      lastName:  'Admin',
      email:     'admin@powaywoman.org',
      bio:       'Club administrator.',
      languages: ['English', 'Spanish'],
      interests: ['Arts', 'Civic Engagement']
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function showAlert(msg) {
    var a = el('loginAlert');
    a.textContent = msg;
    a.classList.add('visible');
  }

  function hideAlert() {
    var a = el('loginAlert');
    a.textContent = '';
    a.classList.remove('visible');
  }

  function setLoading(on) {
    var btn = el('loginBtn');
    btn.disabled = on;
    btn.textContent = on ? 'Signing in…' : 'Sign In';
  }

  /* ── Auth ────────────────────────────────────────────────────── */

  /**
   * attemptLogin(username, password)
   * Returns a Promise that resolves with the user object on success,
   * or rejects with an error message string on failure.
   *
   * SWAP THIS FUNCTION for a real fetch() when your backend is ready:
   *
   *   return fetch('/api/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ username, password })
   *   }).then(function(res) {
   *     if (!res.ok) throw new Error('Invalid username or password.');
   *     return res.json();
   *   });
   */
  function attemptLogin(username, password) {
    return fetch(API_BASE_URL + '/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = {};
        try { data = t ? JSON.parse(t) : {}; } catch (_) {}
        if (!res.ok) {
          var msg = (data && data.error) ? data.error : 'Invalid username or password.';
          throw new Error(msg);
        }
        // Backend returns {id, username, email, role, ...}
        var user = data || {};
        var u = String(user.username || username || '');
        var firstName = u;
        var lastName = '';
        if (u && u !== 'admin') {
          var segs = u.split(/[\\._-]/);
          firstName = segs[0] || u;
          lastName = segs[1] || '';
        }

        // Map into the shape profile.js expects.
        return {
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: firstName,
          lastName: lastName,
          bio: user.bio || '',
          languages: [],
          interests: []
        };
      });
    });
  }

  function doLogin() {
    var username = el('username').value.trim();
    var password = el('password').value;

    hideAlert();

    if (!username || !password) {
      showAlert('Please enter your username and password.');
      return;
    }

    setLoading(true);

    attemptLogin(username, password)
      .then(function (user) {
        // Merge any previously saved profile data (languages, interests, bio, etc.)
        var saved = null;
        try { saved = JSON.parse(localStorage.getItem('pwc_profile_' + user.username)); }
        catch (_) {}
        if (saved) { user = Object.assign({}, user, saved); }

        // Write to sessionStorage — profile.js reads this
        sessionStorage.setItem('pwc_user', JSON.stringify(user));

        // Redirect to profile
        window.location.href = REDIRECT_AFTER_LOGIN;
      })
      .catch(function (msg) {
        setLoading(false);
        showAlert(msg);
        el('password').value = '';
        el('password').focus();
      });
  }

  /* ── Password show/hide ──────────────────────────────────────── */

  function bindPasswordToggle() {
    var toggle = el('pwToggle');
    var input  = el('password');
    if (!toggle || !input) return;

    toggle.addEventListener('click', function () {
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      toggle.textContent = isHidden ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password'); toggle.style.fontSize = '0.75rem'; toggle.style.fontWeight = '700';
    });
  }

  /* ── has-content class for input styling ─────────────────────── */

  function bindInputStyling() {
    ['username', 'password'].forEach(function (id) {
      var input = el(id);
      if (!input) return;
      input.addEventListener('input', function () {
        input.classList.toggle('has-content', input.value.length > 0);
      });
    });
  }

  /* ── Enter key support ───────────────────────────────────────── */

  function bindEnterKey() {
    ['username', 'password'].forEach(function (id) {
      var input = el(id);
      if (!input) return;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { doLogin(); }
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────── */

  // If already logged in, skip straight to profile
  try {
    if (sessionStorage.getItem('pwc_user')) {
      window.location.href = REDIRECT_AFTER_LOGIN;
    }
  } catch (_) {}

  el('loginBtn').addEventListener('click', doLogin);
  bindPasswordToggle();
  bindInputStyling();
  bindEnterKey();

  // Focus username field on load
  var uField = el('username');
  if (uField) { uField.focus(); }

})();