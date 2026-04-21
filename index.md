---
layout: default
title: Poway Woman's Club
hide: true
show_reading_time: false
---

<!-- Daily rotating banner -->
<div class="pwc-banner">
  <span class="pwc-banner-label" id="bannerLabel"></span>
  <div class="pwc-banner-divider"></div>
  <span class="pwc-banner-text" id="bannerText"></span>
  <span class="pwc-banner-attr" id="bannerAttr"></span>
</div>

<div class="pwc-hero">
  <span class="pwc-hero-kicker">At a glance</span>
  <h1>Poway Woman's Club</h1>
  <p>Scholarships, arts, civic programs, and youth leadership in Poway since 1960. Explore featured stories below, visit a meeting, or connect with members through the member portal.</p>
  <div class="pwc-hero-links">
    <a href="{{ site.baseurl }}/navigation/about" class="pwc-btn pwc-btn-fill">About Us</a>
    <a href="{{ site.baseurl }}/navigation/social" class="pwc-btn pwc-btn-border">Member Portal</a>
  </div>
</div>

<div id="pwc-home-announcements" class="pwc-home-announcements" hidden>
  <div class="pwc-home-announcements-card">
    <h2>Announcements</h2>
    <div id="pwc-home-announcements-list"></div>
    <p class="pwc-home-announcements-hint">Pinned posts on the club blog appear here — officers pin updates for everyone to see.</p>
  </div>
</div>

<div class="pwc-section" id="what-we-do">
  <h2>What we do</h2>
  <hr class="pwc-rule">
  <p class="pwc-home-hint">These links come from live blog posts whose titles begin with <strong>What we do:</strong>. Officers and members with access can publish or edit posts; anyone signed in can comment on each story.</p>
  <p class="pwc-home-hint pwc-home-logged-in-only">You are signed in — open any story below to read details and join the conversation.</p>
  <div id="pwc-home-whatwedo">
    <p class="pwc-home-feed-msg">Loading featured posts…</p>
  </div>
  <div class="pwc-home-feed-actions">
    <a href="{{ site.baseurl }}/navigation/blog" class="pwc-btn pwc-btn-fill">Open club blog</a>
    <a href="{{ site.baseurl }}/navigation/login" class="pwc-btn pwc-btn-border">Sign in to comment</a>
  </div>
</div>

<div class="pwc-section" id="contact">
  <h2>Contact &amp; visits</h2>
  <hr class="pwc-rule">
  <p style="margin-top:0;">Reach us by mail, attend an open meeting, or use the member messaging tools after you sign in.</p>
  <div class="pwc-cards">
    <div class="pwc-card">
      <h3>Mailing address</h3>
      <p>Poway Woman's Club<br>P.O. Box 1356<br>Poway, CA 92074-1356</p>
    </div>
    <div class="pwc-card">
      <h3>General meetings</h3>
      <p>2nd Tuesday of every month, September through June<br><strong>10:00 AM</strong> — Templars Hall, Old Poway Park<br>Visitors welcome. No RSVP needed.</p>
    </div>
    <div class="pwc-card">
      <h3>Member messaging</h3>
      <p>Logged-in members can use the built-in message system in the member portal to contact friends and groupmates — the same account you use for the blog and calendar.</p>
      <p style="margin-top:0.75rem;"><a href="{{ site.baseurl }}/navigation/social" class="pwc-btn pwc-btn-fill" style="display:inline-block;">Go to member portal</a></p>
    </div>
    <div class="pwc-card">
      <h3>New to the club?</h3>
      <p>Come to a meeting or create an account for the website to explore groups, events, and conversations.</p>
    </div>
  </div>
</div>

<div class="pwc-cta">
  <h2>Interested in joining?</h2>
  <p>Come to a meeting — visitors are always welcome. No RSVP needed.</p>
  <a href="{{ site.baseurl }}/navigation/login" class="pwc-btn pwc-btn-white">Sign In / Register</a>
</div>

<script>
(function () {
  var ITEMS = [
    { type: 'quote', text: 'Well-behaved women seldom make history.', attr: 'Laurel Thatcher Ulrich' },
    { type: 'quote', text: 'I am no longer accepting the things I cannot change. I am changing the things I cannot accept.', attr: 'Angela Davis' },
    { type: 'quote', text: 'The most courageous act is still to think for yourself. Aloud.', attr: 'Coco Chanel' },
    { type: 'quote', text: 'You may encounter many defeats, but you must not be defeated.', attr: 'Maya Angelou' },
    { type: 'quote', text: 'There is no limit to what we, as women, can accomplish.', attr: 'Michelle Obama' },
    { type: 'quote', text: 'Alone we can do so little; together we can do so much.', attr: 'Helen Keller' },
    { type: 'quote', text: 'No one can make you feel inferior without your consent.', attr: 'Eleanor Roosevelt' },
    { type: 'quote', text: 'I raise up my voice — not so that I can shout, but so that those without a voice can be heard.', attr: 'Malala Yousafzai' },
    { type: 'quote', text: 'Think like a queen. A queen is not afraid to fail.', attr: 'Oprah Winfrey' },
    { type: 'quote', text: 'I never dreamed about success. I worked for it.', attr: 'Estée Lauder' },
    { type: 'fact', text: 'The General Federation of Women\'s Clubs, founded in 1890, is one of the oldest nonpartisan women\'s service organizations in the world.', attr: null },
    { type: 'fact', text: 'Women\'s clubs in the early 1900s helped establish public libraries, parks, and schools across the United States.', attr: null },
    { type: 'fact', text: 'Poway\'s name is believed to derive from a Native American word meaning "meeting of the valleys."', attr: null },
    { type: 'fact', text: 'The GFWC has more than 100,000 members in clubs across the United States and worldwide.', attr: null },
    { type: 'fact', text: 'The Hugh O\'Brian Youth Leadership program has inspired young leaders in over 100 countries since 1958.', attr: null },
    { type: 'tip',  text: 'The Poway Community Library offers free museum passes for cardholders — explore San Diego County culture at no cost.', attr: null },
    { type: 'tip',  text: 'Old Poway Park hosts a Farmers Market every Saturday morning with fresh local produce and crafts.', attr: null },
    { type: 'tip',  text: 'The Poway Center for the Performing Arts hosts free community events throughout the year.', attr: null },
  ];

  var LABELS = { quote: 'Quote of the Day', fact: 'Fun Fact', tip: 'Community Tip' };
  var day  = Math.floor(Date.now() / 86400000);
  var item = ITEMS[day % ITEMS.length];

  document.getElementById('bannerLabel').textContent = LABELS[item.type];
  document.getElementById('bannerText').textContent  = item.text;
  document.getElementById('bannerAttr').textContent  = item.attr ? '\u2014 ' + item.attr : '';
})();
</script>

<script>
var API = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "{{ site.events_api_local_url | default: 'http://localhost:8327' | escape }}"
  : "{{ site.events_api_base_url | escape }}";
window.PWC_API_BASE_URL = API;
</script>
<script src="{{ '/assets/js/home-feeds.js' | relative_url }}"></script>
