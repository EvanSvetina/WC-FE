---
layout: page
title: Events
permalink: /navigation/events/
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&display=swap');

  :root {
    --pwc-cream: #fbf8f6;
    --pwc-sage: #7a8e6b;
    --pwc-sage-dark: #5c6e50;
    --pwc-sage-light: #dde6d5;
    --pwc-rose: #c4788a;
    --pwc-rose-dark: #a25d6e;
    --pwc-rose-light: #f2dce2;
    --pwc-warm: #c9a070;
    --pwc-charcoal: #342e30;
    --pwc-text: #504a4c;
    --pwc-muted: #928a8c;
    --pwc-border: #e8dfe2;
    --pwc-white: #ffffff;
  }

  /* Match the main page: the Minima theme sets a dark body background,
     so override it for this events page only. */
  body {
    background-color: #f2dce2 !important;
  }

  /* Events page should feel more "full width" like the homepage. */
  main .wrapper {
    width: 100% !important;
    max-width: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .pwc-hero,
  .pwc-section {
    width: 100%;
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }

  .pwc-hero {
    padding: 4rem 2rem 3rem;
    text-align: center;
    background: linear-gradient(135deg, var(--pwc-sage-light) 0%, var(--pwc-cream) 40%, var(--pwc-rose-light) 100%);
    border-bottom: 2px solid var(--pwc-border);
  }

  .pwc-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--pwc-charcoal);
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }

  .pwc-hero p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--pwc-text);
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .pwc-section {
    padding: 3rem 2rem;
    max-width: none;
    margin: 0;
    background: rgba(251, 248, 246, 0.92);
    border: 1px solid rgba(232, 223, 226, 0.95);
    border-radius: 14px;
    box-shadow: 0 10px 28px rgba(0,0,0,0.08);
    box-sizing: border-box;
  }

  .pwc-section h2,
  .pwc-section h3 {
    font-family: 'Playfair Display', serif;
    color: var(--pwc-charcoal);
    margin-bottom: 0.75rem;
  }

  .pwc-section h2 { font-size: 1.8rem; }
  .pwc-section h3 { font-size: 1.35rem; margin-top: 2rem; }

  .pwc-section p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--pwc-text);
    line-height: 1.7;
  }

  .pwc-rule {
    width: 40px;
    height: 2px;
    background: var(--pwc-warm);
    border: none;
    margin: 0 0 1.5rem;
  }

  .pwc-btn {
    display: inline-block;
    padding: 0.65rem 1.5rem;
    border-radius: 6px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .pwc-btn-fill {
    background: linear-gradient(135deg, var(--pwc-sage), var(--pwc-rose));
    color: var(--pwc-white);
  }

  .pwc-btn-fill:hover {
    background: linear-gradient(135deg, var(--pwc-sage-dark), var(--pwc-rose-dark));
  }

  .pwc-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .pwc-form-grid .pwc-span-2 { grid-column: 1 / -1; }

  @media (max-width: 720px) { .pwc-form-grid { grid-template-columns: 1fr; } }

  #pwc-events-calendar {
    max-width: none;
    width: 100%;
    margin: 1.5rem 0 0;
    padding: 1rem 1rem 0.75rem;
    border-radius: 14px;
    border: 1px solid rgba(232,223,226,0.95);
    background: rgba(221,230,213,0.25);
    min-height: 700px;
    box-sizing: border-box;
  }

  /* FullCalendar overrides to match the club theme */
  #pwc-events-calendar .fc {
    background: transparent;
    font-family: 'Nunito Sans', sans-serif;
    color: var(--pwc-text);
  }

  #pwc-events-calendar .fc-toolbar-title {
    font-family: 'Playfair Display', serif;
    color: var(--pwc-charcoal);
    font-size: 1.45rem;
  }

  #pwc-events-calendar .fc .fc-button {
    background: transparent;
    border: 1px solid var(--pwc-border);
    color: var(--pwc-charcoal);
    font-weight: 700;
    box-shadow: none;
  }

  #pwc-events-calendar .fc .fc-button:hover {
    background: var(--pwc-rose-light);
    border-color: var(--pwc-rose-light);
  }

  #pwc-events-calendar .fc .fc-button-primary {
    background: var(--pwc-rose-light);
    border-color: var(--pwc-rose-light);
    color: var(--pwc-charcoal);
  }

  #pwc-events-calendar .fc .fc-col-header-cell-cushion,
  #pwc-events-calendar .fc .fc-daygrid-day-number {
    color: var(--pwc-charcoal);
  }

  #pwc-events-calendar .fc .fc-daygrid-day {
    background: rgba(255,255,255,0.35);
    border: 1px solid rgba(232,223,226,0.65);
  }

  #pwc-events-calendar .fc-scrollgrid {
    border-radius: 12px;
    overflow: visible;
  }

  #pwc-events-calendar .fc .fc-daygrid-day-frame {
    border-radius: 10px;
    overflow: visible;
  }

  /* Prevent FullCalendar from constraining height in this embedded layout */
  #pwc-events-calendar .fc .fc-view-harness {
    height: auto !important;
    min-height: 650px;
    overflow: visible !important;
  }

  #pwc-events-calendar .fc-scroller,
  #pwc-events-calendar .fc-scroller-harness,
  #pwc-events-calendar .fc-view-harness-active {
    height: auto !important;
    overflow: visible !important;
  }

  #pwc-events-calendar .fc .fc-daygrid-day-number {
    font-weight: 700;
  }

  #pwc-events-calendar .fc .fc-event {
    border-radius: 10px !important;
    padding: 2px 6px;
  }

  @media (prefers-color-scheme: dark) {
    .pwc-hero {
      background: linear-gradient(135deg, #252e22 0%, #1e1a1b 40%, #2e2228 100%);
      border-color: #3a3438;
    }
    .pwc-hero h1 { color: #eae8e6; }
    .pwc-hero p { color: #b8b2b4; }
    .pwc-section {
      background: rgba(38, 36, 42, 0.75);
      border-color: rgba(58, 52, 56, 0.95);
      box-shadow: none;
    }
    .pwc-section h2, .pwc-section h3 { color: #eae8e6; }
    .pwc-section p { color: #b8b2b4; }
    #pwc-events-calendar .fc { color: #b8b2b4; }
    #pwc-events-calendar .fc-toolbar-title { color: #eae8e6; }
    #pwc-events-calendar {
      border-color: #3a3438;
      background: rgba(24, 24, 24, 0.18);
    }
    #pwc-events-calendar .fc .fc-button { border-color: #3a3438; color: #eae8e6; }
    #pwc-events-calendar .fc .fc-button-primary { background: var(--pwc-rose-light); border-color: var(--pwc-rose-light); color: #342e30; }
    #pwc-events-calendar .fc .fc-col-header-cell-cushion,
    #pwc-events-calendar .fc .fc-daygrid-day-number { color: #eae8e6; }
    #pwc-events-calendar .fc .fc-daygrid-day { background: rgba(38,36,42,0.85); border-color: #3a3438; }
  }

  .pwc-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 1000;
  }

  .pwc-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
    width: min(720px, calc(100vw - 2rem));
    background: #111;
    color: #eee;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.35);
    padding: 1rem 1.25rem 1.25rem;
  }

  .pwc-modal[hidden] { display: none; }

  .pwc-modal-close {
    appearance: none;
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 1.5rem;
    line-height: 1;
    position: absolute;
    right: 1rem;
    top: 0.75rem;
    cursor: pointer;
  }

  .pwc-modal h3 { margin: 0 0 0.35rem; }
  .pwc-modal p { margin: 0 0 0.75rem; color: rgba(255,255,255,0.82); }

  #pwc-rsvp-modal label { font-size: 0.95rem; }
  #pwc-rsvp-modal input,
  #pwc-rsvp-modal select,
  #pwc-rsvp-modal textarea {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.55rem 0.6rem;
    background: rgba(255,255,255,0.06);
    color: #eee;
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px;
    outline: none;
  }

  #pwc-meeting-request-form input,
  #pwc-meeting-request-form select,
  #pwc-meeting-request-form textarea {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.55rem 0.6rem;
    background: rgba(255,255,255,0.6);
    color: var(--pwc-charcoal);
    border: 1px solid rgba(232,223,226,0.95);
    border-radius: 8px;
    outline: none;
    font-family: 'Nunito Sans', sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    #pwc-meeting-request-form input,
    #pwc-meeting-request-form select,
    #pwc-meeting-request-form textarea {
      background: rgba(255,255,255,0.06);
      color: #eee;
      border-color: #3a3438;
    }
  }

  /* Meeting scheduling modal form inputs */
  #pwc-meeting-modal-form input,
  #pwc-meeting-modal-form select,
  #pwc-meeting-modal-form textarea {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.55rem 0.6rem;
    background: rgba(255,255,255,0.6);
    color: var(--pwc-charcoal);
    border: 1px solid rgba(232,223,226,0.95);
    border-radius: 8px;
    outline: none;
    font-family: 'Nunito Sans', sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    #pwc-meeting-modal-form input,
    #pwc-meeting-modal-form select,
    #pwc-meeting-modal-form textarea {
      background: rgba(255,255,255,0.06);
      color: #eee;
      border-color: #3a3438;
    }
  }

  .pwc-alert {
    margin: 0.75rem 0 0;
    padding: 0.75rem 0.9rem;
    border-radius: 8px;
    background: rgba(196, 120, 138, 0.20);
    border: 1px solid rgba(196, 120, 138, 0.35);
    color: rgba(255,255,255,0.9);
    font-size: 0.95rem;
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

<div class="pwc-hero">
  <h1>Events</h1>
  <p>Regular meetings and community events. Click an event to RSVP.</p>
</div>

<div class="pwc-section">
  <h2>Upcoming Events</h2>
  <hr class="pwc-rule" />
  <p>Interactive calendar for Regular Meetings. Click an event to RSVP. Click a date to schedule a meeting.</p>

  <div id="pwc-events-calendar" aria-label="Events calendar"></div>

<div id="pwc-rsvp-backdrop" class="pwc-modal-backdrop" hidden></div>
<div id="pwc-rsvp-modal" class="pwc-modal" role="dialog" aria-modal="true" aria-labelledby="pwc-rsvp-title" tabindex="-1" hidden>
  <button type="button" class="pwc-modal-close" aria-label="Close RSVP dialog" id="pwc-rsvp-close">×</button>
  <h3 id="pwc-rsvp-title">RSVP</h3>
  <p id="pwc-rsvp-meta"></p>
  <div id="pwc-admin-attendees" hidden>
    <p style="margin: 0.5rem 0 0; font-weight: 700;">Attendees (admin)</p>
    <div id="pwc-admin-attendees-count" style="margin-bottom: 0.5rem; color: rgba(255,255,255,0.85);"></div>
    <div id="pwc-admin-attendees-groups"></div>
  </div>

  <form id="pwc-rsvp-form" method="POST" action="#">
    <input type="hidden" name="event_id" id="pwc-rsvp-event-id" value="">
    <input type="hidden" name="event_title" id="pwc-rsvp-event-title" value="">
    <input type="hidden" name="event_datetime" id="pwc-rsvp-event-datetime" value="">

    <div class="pwc-form-grid">
      <label>
        Your name
        <input type="text" name="name" autocomplete="name" required>
      </label>
      <label>
        Email
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label class="pwc-span-2">
        Are you attending?
        <select name="attendance" required>
          <option value="yes">Yes, I will attend</option>
          <option value="no">No, I can’t attend</option>
          <option value="maybe">Maybe / I’m not sure yet</option>
        </select>
      </label>
      <label class="pwc-span-2">
        Notes (optional)
        <textarea name="notes" rows="3"></textarea>
      </label>
    </div>

    <button type="submit" class="pwc-btn pwc-btn-fill" style="margin-top: 0.85rem;">Submit RSVP</button>
    <div id="pwc-rsvp-feedback" class="pwc-alert" hidden></div>
    <div id="pwc-rsvp-missing-config" class="pwc-alert" hidden>
      RSVP API is not configured yet. Set <code>events_api_base_url</code> in <code>_config.yml</code>.
    </div>
  </form>
</div>

<div id="pwc-meeting-modal-backdrop" class="pwc-modal-backdrop" hidden></div>
<div id="pwc-meeting-modal" class="pwc-modal" role="dialog" aria-modal="true" aria-labelledby="pwc-meeting-modal-title" tabindex="-1" hidden>
  <button type="button" class="pwc-modal-close" aria-label="Close meeting scheduling dialog" id="pwc-meeting-modal-close">×</button>
  <h3 id="pwc-meeting-modal-title">Schedule a Meeting</h3>
  <p id="pwc-meeting-modal-meta"></p>

  <form id="pwc-meeting-modal-form" method="POST" action="#">
    <div class="pwc-form-grid">
      <label>
        Your name
        <input type="text" name="name" autocomplete="name" required>
      </label>
      <label>
        Email
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label>
        Start (date/time)
        <input type="datetime-local" name="preferred_datetime" required>
      </label>
      <label>
        End (date/time)
        <input type="datetime-local" name="preferred_end_datetime" required>
      </label>
      <label class="pwc-span-2">
        Topic / meeting type
        <input type="text" name="topic" required>
      </label>
      <label class="pwc-span-2">
        Description
        <textarea name="description" rows="4" required></textarea>
      </label>
    </div>

    <button type="submit" class="pwc-btn pwc-btn-fill" style="margin-top: 0.85rem;">Submit Meeting Request</button>
    <div id="pwc-meeting-modal-feedback" class="pwc-alert" hidden></div>
    <div id="pwc-meeting-modal-missing-config" class="pwc-alert" hidden>
      Meeting scheduling API is not configured yet. Set <code>events_api_base_url</code> in <code>_config.yml</code>.
    </div>
  </form>
</div>

<hr class="pwc-rule" />





<hr class="pwc-rule" />


 </div>
<script>
  (function () {
    var API_BASE_URL = "{{ site.events_api_base_url | default: '' | escape }}";
    var calendarInstance = null;

    function $(id) { return document.getElementById(id); }

    function formatLocalDateTime(d) {
      try {
        return d.toLocaleString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        });
      } catch (e) {
        return d.toString();
      }
    }

    function formatLocalDate(d) {
      try {
        return d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        });
      } catch (e) {
        return d.toString();
      }
    }

    function pad2(n) {
      return String(n).padStart(2, "0");
    }

    function toDatetimeLocalValue(d) {
      // datetime-local expects: YYYY-MM-DDTHH:MM (local time, no timezone suffix)
      return (
        d.getFullYear() +
        "-" + pad2(d.getMonth() + 1) +
        "-" + pad2(d.getDate()) +
        "T" + pad2(d.getHours()) +
        ":" + pad2(d.getMinutes())
      );
    }

    function secondTuesday(year, monthIndex) {
      // monthIndex: 0=Jan ... 11=Dec
      // second Tuesday = first Tuesday + 7 days
      var first = new Date(year, monthIndex, 1);
      var firstDay = first.getDay(); // 0=Sun ... 2=Tue
      var offsetToTuesday = (2 - firstDay + 7) % 7;
      var firstTuesdayDate = 1 + offsetToTuesday;
      return new Date(year, monthIndex, firstTuesdayDate + 7);
    }

    function buildRegularMeetings() {
      var now = new Date();
      var startYear = now.getFullYear();
      var endYear = startYear + 1; // covers current season through next June

      var meetings = [];

      for (var y = startYear; y <= endYear; y++) {
        for (var m = 0; m < 12; m++) {
          // Meetings happen September through June (skip July/Aug)
          if (!(m >= 8 || m <= 5)) continue;

          var dt = secondTuesday(y, m);
          dt.setHours(10, 0, 0, 0); // 10:00 AM

          if (dt < now) continue;

          var end = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // 2-hour window

          var monthName = dt.toLocaleString(undefined, { month: "long" });
          var title = "General Meeting — " + monthName;

          meetings.push({
            title: title,
            start: dt,
            end: end,
            allDay: false,
            backgroundColor: "rgba(196, 120, 138, 0.30)",
            borderColor: "rgba(196, 120, 138, 0.90)",
            textColor: "#fbf8f6",
            extendedProps: {
              // No backend Event row for recurring meetings (we still allow public RSVP).
              backendEventId: "",
              location: "Templars Hall, Old Poway Park"
            }
          });
        }
      }

      return meetings;
    }

    function apiUrl(path) {
      if (!API_BASE_URL) return "";
      return API_BASE_URL.replace(/\/$/, "") + path;
    }

    var authCache = { status: "unknown", user: null };

    async function getCurrentUser() {
      if (!API_BASE_URL) return null;
      if (authCache.status === "done") return authCache.user;

      try {
        var resp = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
        if (!resp.ok) {
          authCache.user = null;
          authCache.status = "done";
          return null;
        }
        var data = await resp.json();
        // Backend returns the user object directly (or {user:null}) on failure.
        authCache.user = data && (data.username || data.email || data.role) ? data : null;
        authCache.status = "done";
        return authCache.user;
      } catch (e) {
        authCache.user = null;
        authCache.status = "done";
        return null;
      }
    }

    function isAdminUser(u) {
      return !!(u && u.role && String(u.role).toLowerCase() === "admin");
    }

    async function loadEventAttendingCount(eventId) {
      if (!API_BASE_URL) return null;
      if (!eventId) return null;
      try {
        var resp = await fetch(apiUrl("/api/events/" + eventId + "/attending-count"), { credentials: "omit" });
        if (!resp.ok) return null;
        var data = await resp.json();
        if (data && typeof data.attending === "number") return data.attending;
        return null;
      } catch (e) {
        return null;
      }
    }

    async function loadEventAttendeesAdmin(eventId) {
      if (!API_BASE_URL) return null;
      if (!eventId) return null;

      // Only admins can view the list (backend enforces this).
      var me = await getCurrentUser();
      if (!isAdminUser(me)) return null;

      try {
        var resp = await fetch(apiUrl("/api/events/" + eventId + "/attendees"), { credentials: "include" });
        if (!resp.ok) return null;
        return await resp.json();
      } catch (e) {
        return null;
      }
    }

    async function loadPublicAttendeesAdmin(eventTitle, eventDatetimeIso) {
      if (!API_BASE_URL) return null;
      if (!eventTitle || !eventDatetimeIso) return null;

      var me = await getCurrentUser();
      if (!isAdminUser(me)) return null;

      try {
        var qs = "?event_title=" + encodeURIComponent(eventTitle) + "&event_datetime=" + encodeURIComponent(eventDatetimeIso);
        var resp = await fetch(apiUrl("/api/events/public-rsvp-attendees" + qs), { credentials: "include" });
        if (!resp.ok) return null;
        return await resp.json();
      } catch (e) {
        return null;
      }
    }

    async function loadBackendEvents() {
      if (!API_BASE_URL) return [];

      try {
        // Show both past + future so users see scheduled meetings on the calendar
        var resp = await fetch(apiUrl("/api/events/?upcoming=false"), { credentials: "omit" });
        if (!resp.ok) return [];
        var list = await resp.json();
        if (!Array.isArray(list)) return [];

        return list.map(function (e) {
          return {
            id: e.id,
            title: e.title,
            start: e.start_time,
            end: e.end_time,
            allDay: false,
            backgroundColor: "rgba(122, 142, 107, 0.28)",
            borderColor: "rgba(122, 142, 107, 0.85)",
            textColor: "#fbf8f6",
            extendedProps: {
              backendEventId: e.id,
              location: e.location || ""
            }
          };
        });
      } catch (err) {
        return [];
      }
    }

    function setHiddenValue(id, value) {
      var el = $(id);
      if (el) el.value = value;
    }

    function openRsvpModal(fcEvent) {
      var backdrop = $("pwc-rsvp-backdrop");
      var modal = $("pwc-rsvp-modal");
      if (!backdrop || !modal || !fcEvent) return;

      var start = fcEvent.start;
      var meta = "";
      if (start) meta = formatLocalDateTime(start);

      var loc = (fcEvent.extendedProps && fcEvent.extendedProps.location) ? fcEvent.extendedProps.location : "";
      if (loc) meta = meta + " — " + loc;

      $("pwc-rsvp-title").textContent = "RSVP: " + (fcEvent.title || "Meeting");
      var baseMeta = meta;
      $("pwc-rsvp-meta").textContent = baseMeta;
      var metaEl = $("pwc-rsvp-meta");
      if (metaEl) metaEl.dataset.baseMeta = baseMeta;

      var backendEventId = (fcEvent.extendedProps && fcEvent.extendedProps.backendEventId) ? fcEvent.extendedProps.backendEventId : "";
      setHiddenValue("pwc-rsvp-event-id", backendEventId);
      setHiddenValue("pwc-rsvp-event-title", fcEvent.title || "");
      setHiddenValue("pwc-rsvp-event-datetime", start ? start.toISOString() : "");

      var rsvpForm = $("pwc-rsvp-form");
      if (rsvpForm) rsvpForm.dataset.location = loc;

      backdrop.hidden = false;
      modal.hidden = false;
      modal.focus();

      // Attendance count + (if admin) attendee list.
      var adminPanel = $("pwc-admin-attendees");
      var adminGroups = $("pwc-admin-attendees-groups");
      var adminCountEl = $("pwc-admin-attendees-count");
      if (adminPanel) adminPanel.hidden = true;

      var backendId = backendEventId || "";
      if (backendId && start) {
        loadEventAttendingCount(backendId).then(function (count) {
          if (typeof count === "number") {
            $("pwc-rsvp-meta").textContent = baseMeta + " — " + count + " attending";
          }
        });

        loadEventAttendeesAdmin(backendId).then(function (payload) {
          if (!payload) return;
          if (!adminPanel || !adminGroups || !adminCountEl) return;

          adminPanel.hidden = false;
          adminCountEl.textContent = (payload.counts && payload.counts.attending_total !== undefined)
            ? ("Total attending: " + payload.counts.attending_total)
            : "Total attending: —";

          var groupsHtml = "";
          if (payload.attendees) {
            var loggedIn = payload.attendees.logged_in || [];
            var pub = payload.attendees.public || [];

            groupsHtml += "<div style='margin-top:0.75rem;'><strong>Logged-in RSVPs</strong></div>";
            if (!loggedIn.length) groupsHtml += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
            loggedIn.forEach(function (u) {
              groupsHtml += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (u.username || "—") + " — " + (u.email || "—")
                + "</div>";
            });

            groupsHtml += "<div style='margin-top:0.75rem;'><strong>Public RSVPs</strong></div>";
            if (!pub.length) groupsHtml += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
            pub.forEach(function (r) {
              groupsHtml += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (r.name || "—") + " (" + (r.attendance || "—") + ") — " + (r.email || "—")
                + "</div>";
            });
          }

          adminGroups.innerHTML = groupsHtml;
        });
      } else if (start && fcEvent.title) {
        loadAttendingCount(fcEvent.title, start.toISOString()).then(function (count) {
          if (typeof count === "number") {
            $("pwc-rsvp-meta").textContent = baseMeta + " — " + count + " attending";
          }
        });

        loadPublicAttendeesAdmin(fcEvent.title, start.toISOString()).then(function (payload) {
          if (!payload) return;
          if (!adminPanel || !adminGroups || !adminCountEl) return;

          adminPanel.hidden = false;
          adminCountEl.textContent = "Total attending: " + (payload.attending !== undefined ? payload.attending : "—");

          var groupsHtml2 = "";
          groupsHtml2 += "<div style='margin-top:0.75rem;'><strong>Public RSVPs</strong></div>";
          var list = payload.attendees || [];
          if (!list.length) {
            groupsHtml2 += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
          } else {
            list.forEach(function (r) {
              groupsHtml2 += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (r.name || "—") + " (" + (r.attendance || "—") + ") — " + (r.email || "—")
                + "</div>";
            });
          }
          adminGroups.innerHTML = groupsHtml2;
        });
      }
    }

    function closeRsvpModal() {
      var backdrop = $("pwc-rsvp-backdrop");
      var modal = $("pwc-rsvp-modal");
      if (!backdrop || !modal) return;
      backdrop.hidden = true;
      modal.hidden = true;
    }

    function openMeetingModal(selectedDate) {
      var backdrop = $("pwc-meeting-modal-backdrop");
      var modal = $("pwc-meeting-modal");
      if (!backdrop || !modal) return;

      var meta = selectedDate ? formatLocalDate(selectedDate) : "";
      $("pwc-meeting-modal-meta").textContent = meta ? ("Selected: " + meta) : "";

      // Prefill time to 10:00 AM (user can change it).
      var dt = selectedDate ? new Date(selectedDate) : new Date();
      dt.setHours(10, 0, 0, 0);
      var dtEnd = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // default: 2-hour window

      var form = $("pwc-meeting-modal-form");
      if (form && form.elements["preferred_datetime"] && form.elements["preferred_end_datetime"]) {
        form.elements["preferred_datetime"].value = toDatetimeLocalValue(dt);
        form.elements["preferred_end_datetime"].value = toDatetimeLocalValue(dtEnd);
      }

      var missing = $("pwc-meeting-modal-missing-config");
      var feedback = $("pwc-meeting-modal-feedback");
      if (missing) missing.hidden = true;
      if (feedback) { feedback.hidden = true; feedback.textContent = ""; }

      backdrop.hidden = false;
      modal.hidden = false;
      modal.focus();
    }

    function closeMeetingModal() {
      var backdrop = $("pwc-meeting-modal-backdrop");
      var modal = $("pwc-meeting-modal");
      if (!backdrop || !modal) return;
      backdrop.hidden = true;
      modal.hidden = true;
    }

    function clearRsvpFeedback() {
      var el = $("pwc-rsvp-feedback");
      if (el) {
        el.textContent = "";
        el.hidden = true;
      }
    }

    function showRsvpFeedback(msg, isError) {
      var el = $("pwc-rsvp-feedback");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
      if (isError) {
        el.style.background = "rgba(196,120,138,0.25)";
        el.style.borderColor = "rgba(196,120,138,0.55)";
      }
    }

    async function submitRsvp(payload) {
      if (!API_BASE_URL) {
        showRsvpFeedback("RSVP API is not configured yet. Set events_api_base_url in _config.yml.", true);
        return;
      }

      var resp = await fetch(apiUrl("/api/events/public-rsvp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      var data = {};
      try { data = await resp.json(); } catch (e) { data = {}; }

      if (!resp.ok) {
        showRsvpFeedback((data && data.error) ? data.error : "Failed to submit RSVP.", true);
        return;
      }

      showRsvpFeedback("Thanks! Your RSVP was submitted.", false);
    }

    async function loadAttendingCount(eventTitle, eventDatetimeIso) {
      if (!API_BASE_URL) return null;
      if (!eventTitle || !eventDatetimeIso) return null;

      try {
        var qs = "?event_title=" + encodeURIComponent(eventTitle) + "&event_datetime=" + encodeURIComponent(eventDatetimeIso);
        var resp = await fetch(apiUrl("/api/events/public-rsvp-count" + qs), { credentials: "omit" });
        if (!resp.ok) return null;
        var data = await resp.json();
        if (data && typeof data.attending === "number") return data.attending;
        return null;
      } catch (e) {
        return null;
      }
    }

    function initForms() {
      var rsvpForm = $("pwc-rsvp-form");
      var rsvpMissing = $("pwc-rsvp-missing-config");

      var meetingForm = $("pwc-meeting-request-form");
      var meetingMissing = $("pwc-meeting-request-missing-config");
      var meetingFeedback = $("pwc-meeting-feedback");

      if (rsvpForm) {
        rsvpForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          clearRsvpFeedback();
          if (rsvpMissing) rsvpMissing.hidden = true;

          if (!API_BASE_URL) {
            if (rsvpMissing) rsvpMissing.hidden = false;
            showRsvpFeedback("RSVP API is not configured yet.", true);
            return;
          }

          var backendIdVal = $("pwc-rsvp-event-id").value || "";
          var attendance = rsvpForm.elements["attendance"].value;

          // Prefer logged-in RSVP for backend events with a real event id.
          if (backendIdVal) {
            var me = await getCurrentUser();
            if (me) {
              try {
                var endpointBase = apiUrl("/api/events/" + backendIdVal + "/rsvp");
                var resp = null;
                if (attendance === "yes") {
                  resp = await fetch(endpointBase, { method: "POST", credentials: "include" });
                } else {
                  resp = await fetch(endpointBase, { method: "DELETE", credentials: "include" });
                }

                var data = {};
                try { data = await resp.json(); } catch (_) {}

                if (!resp.ok) {
                  showRsvpFeedback((data && data.error) ? data.error : "Failed to submit RSVP.", true);
                  return;
                }

                // Update feedback + counts.
                showRsvpFeedback("Thanks! Your RSVP was submitted.", false);
                if (backendIdVal) {
                  var count = await loadEventAttendingCount(backendIdVal);
                  var metaEl2 = $("pwc-rsvp-meta");
                  if (metaEl2 && metaEl2.dataset && metaEl2.dataset.baseMeta && typeof count === "number") {
                    metaEl2.textContent = metaEl2.dataset.baseMeta + " — " + count + " attending";
                  }
                }
                // Refresh admin panel if open.
                if (me && me.role === "admin") {
                  var adminPayload = await loadEventAttendeesAdmin(backendIdVal);
                  // openRsvpModal already renders; we only update the count+list if needed.
                  if (adminPayload && $("pwc-admin-attendees")) {
                    $("pwc-admin-attendees").hidden = false;
                    $("pwc-admin-attendees-count").textContent =
                      (adminPayload.counts && adminPayload.counts.attending_total !== undefined)
                        ? ("Total attending: " + adminPayload.counts.attending_total)
                        : "Total attending: —";
                  }
                }

                return;
              } catch (err) {
                showRsvpFeedback((err && err.message) ? err.message : "Failed to submit RSVP.", true);
                return;
              }
            }
          }

          // Public fallback for recurring/client-generated events or anonymous users.
          var payload = {
            event_id: $("pwc-rsvp-event-id").value || null,
            event_title: $("pwc-rsvp-event-title").value || "",
            event_datetime: $("pwc-rsvp-event-datetime").value || "",
            name: rsvpForm.elements["name"].value,
            email: rsvpForm.elements["email"].value,
            attendance: rsvpForm.elements["attendance"].value,
            notes: rsvpForm.elements["notes"].value || null,
            event_location: rsvpForm.dataset.location || null
          };

          await submitRsvp(payload);
        });
      }

      if (meetingForm) {
        meetingForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          if (meetingMissing) meetingMissing.hidden = true;
          if (meetingFeedback) {
            meetingFeedback.textContent = "";
            meetingFeedback.hidden = true;
          }

          if (!API_BASE_URL) {
            if (meetingMissing) meetingMissing.hidden = false;
            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              meetingFeedback.textContent = "Meeting request API is not configured yet.";
            }
            return;
          }

          var payload = {
            name: meetingForm.elements["name"].value,
            email: meetingForm.elements["email"].value,
            preferred_datetime: meetingForm.elements["preferred_datetime"].value || null,
            topic: meetingForm.elements["topic"].value,
            description: meetingForm.elements["description"].value
          };

          try {
            var resp = await fetch(apiUrl("/api/events/meeting-request"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            var data = {};
            try { data = await resp.json(); } catch (err) { data = {}; }

            if (!resp.ok) {
              var msg = (data && data.error) ? data.error : "Failed to submit meeting request.";
              if (meetingFeedback) {
                meetingFeedback.hidden = false;
                meetingFeedback.textContent = msg;
              }
              return;
            }

            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              meetingFeedback.textContent = "Thanks! Your meeting request was submitted.";
            }
            meetingForm.reset();
          } catch (err) {
            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              var msg = (err && err.message) ? err.message : String(err);
              var endpoint2 = "";
              try { endpoint2 = apiUrl("/api/events/meeting-request"); } catch (e3) { endpoint2 = ""; }
              meetingFeedback.textContent = "Network error submitting meeting request: " + msg + (endpoint2 ? (" (" + endpoint2 + ")") : "");
              try { console.error("Meeting request submit failed:", err); } catch (e) { /* no-op */ }
            }
          }
        });
      }

      var meetingModalForm = $("pwc-meeting-modal-form");
      var meetingModalMissing = $("pwc-meeting-modal-missing-config");
      var meetingModalFeedback = $("pwc-meeting-modal-feedback");
      if (meetingModalForm) {
        meetingModalForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          if (meetingModalMissing) meetingModalMissing.hidden = true;
          if (meetingModalFeedback) {
            meetingModalFeedback.textContent = "";
            meetingModalFeedback.hidden = true;
          }

          if (!API_BASE_URL) {
            if (meetingModalMissing) meetingModalMissing.hidden = false;
            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              meetingModalFeedback.textContent = "Meeting scheduling API is not configured yet.";
            }
            return;
          }

          var payload = {
            name: meetingModalForm.elements["name"].value,
            email: meetingModalForm.elements["email"].value,
            preferred_datetime: meetingModalForm.elements["preferred_datetime"].value || null,
            preferred_end_datetime: meetingModalForm.elements["preferred_end_datetime"].value || null,
            topic: meetingModalForm.elements["topic"].value,
            description: meetingModalForm.elements["description"].value
          };

          try {
            var resp = await fetch(apiUrl("/api/events/meeting-request"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            var data = {};
            try { data = await resp.json(); } catch (err) { data = {}; }

            if (!resp.ok) {
              var msg = (data && data.error) ? data.error : "Failed to submit meeting request.";
              if (meetingModalFeedback) {
                meetingModalFeedback.hidden = false;
                meetingModalFeedback.textContent = msg;
              }
              return;
            }

            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              meetingModalFeedback.textContent = "Thanks! Your meeting request was submitted.";
            }
            meetingModalForm.reset();
            closeMeetingModal();

            // Make the newly created event visible immediately.
            if (calendarInstance && calendarInstance.refetchEvents) {
              calendarInstance.refetchEvents();
            }
          } catch (err) {
            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              var msg = (err && err.message) ? err.message : String(err);
              var endpoint = "";
              try { endpoint = apiUrl("/api/events/meeting-request"); } catch (e2) { endpoint = ""; }
              meetingModalFeedback.textContent = "Network error submitting meeting request: " + msg + (endpoint ? (" (" + endpoint + ")") : "");
              try { console.error("Meeting request submit failed:", err); } catch (e) { /* no-op */ }
            }
          }
        });
      }
    }

    function initModal() {
      var closeBtn = $("pwc-rsvp-close");
      var backdrop = $("pwc-rsvp-backdrop");
      if (closeBtn) closeBtn.addEventListener("click", closeRsvpModal);
      if (backdrop) backdrop.addEventListener("click", closeRsvpModal);

      var meetingCloseBtn = $("pwc-meeting-modal-close");
      var meetingBackdrop = $("pwc-meeting-modal-backdrop");
      if (meetingCloseBtn) meetingCloseBtn.addEventListener("click", closeMeetingModal);
      if (meetingBackdrop) meetingBackdrop.addEventListener("click", closeMeetingModal);

      document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        // Close the top-most modal first (meeting modal).
        var meetingModal = $("pwc-meeting-modal");
        if (meetingModal && !meetingModal.hidden) {
          closeMeetingModal();
          return;
        }
        closeRsvpModal();
      });
    }

    function initCalendar() {
      var el = $("pwc-events-calendar");
      if (!el || !window.FullCalendar) return;

      var calendar = new FullCalendar.Calendar(el, {
        initialView: "dayGridMonth",
        height: "auto",
        contentHeight: "auto",
        expandRows: true,
        fixedWeekCount: false,
        dayMaxEventRows: 2,
        headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
        selectable: false,
        editable: false,
        eventTimeFormat: { hour: "numeric", minute: "2-digit" },
        dateClick: function (info) {
          openMeetingModal(info.date);
        },
        eventClick: function (info) {
          info.jsEvent.preventDefault();
          openRsvpModal(info.event);
        },
        events: function (info, successCallback, failureCallback) {
          var base = buildRegularMeetings();
          loadBackendEvents()
            .then(function (apiEvents) {
              successCallback(base.concat(apiEvents));
            })
            .catch(function () {
              successCallback(base);
            });
        }
      });

      calendar.render();
      calendarInstance = calendar;
    }

    function init() {
      initForms();
      initModal();
      initCalendar();
    }

    window.addEventListener("load", init);
  })();
</script>