/**
 * Every SCF field group, in one place. `build-acf-json.mjs` turns this into
 * the JSON SCF loads; `check-acf-json.mjs` validates the output. Each field
 * carries a label, instructions and a suggested length, because the editor
 * sees these instead of a page builder.
 *
 * Field names are read by inc/options.php (site settings) and by the front
 * end through src/lib/wp/types.ts (services, testimonials, FAQs). Rename one
 * here and the reader has to change with it; the checker holds the list.
 */

const wrapper = (width = '') => ({ width, class: '', id: '' })

function base(group, name, label, type, instructions, extra = {}) {
  return {
    key: `field_${group}_${name}`,
    label,
    name,
    'aria-label': '',
    type,
    instructions,
    required: 0,
    conditional_logic: 0,
    wrapper: wrapper(extra.width),
    ...extra.props,
  }
}

export const f = {
  tab: (group, name, label) => base(group, `tab_${name}`, label, 'tab', '', { props: { name: '', placement: 'top', endpoint: 0, selected: 0 } }),
  text: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'text', instructions, {
      width: o.width,
      props: { required: o.required ? 1 : 0, default_value: o.default ?? '', maxlength: o.maxlength ?? '', placeholder: o.placeholder ?? '', prepend: '', append: '' },
    }),
  textarea: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'textarea', instructions, {
      width: o.width,
      props: { required: o.required ? 1 : 0, default_value: o.default ?? '', maxlength: o.maxlength ?? '', rows: o.rows ?? 3, placeholder: '', new_lines: '' },
    }),
  email: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'email', instructions, { width: o.width, props: { required: o.required ? 1 : 0, default_value: '', placeholder: '', prepend: '', append: '' } }),
  url: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'url', instructions, { width: o.width, props: { required: o.required ? 1 : 0, default_value: '', placeholder: o.placeholder ?? '' } }),
  image: (group, name, label, instructions) =>
    base(group, name, label, 'image', instructions, {
      props: { return_format: 'array', library: 'all', preview_size: 'medium', min_width: '', min_height: '', min_size: '', max_width: '', max_height: '', max_size: '', mime_types: '', uploader: '' },
    }),
  trueFalse: (group, name, label, instructions, message) =>
    base(group, name, label, 'true_false', instructions, { props: { message, default_value: 0, ui: 1, ui_on_text: '', ui_off_text: '' } }),
  select: (group, name, label, instructions, choices, o = {}) =>
    base(group, name, label, 'select', instructions, {
      width: o.width,
      props: { required: o.required ? 1 : 0, choices, default_value: o.allowNull ? '' : o.default ?? Object.keys(choices)[0], allow_null: o.allowNull ? 1 : 0, multiple: 0, ui: 0, return_format: 'value', ajax: 0, placeholder: o.placeholder ?? '' },
    }),
  checkbox: (group, name, label, instructions, choices, o = {}) =>
    base(group, name, label, 'checkbox', instructions, {
      width: o.width,
      props: { required: o.required ? 1 : 0, choices, layout: 'horizontal', return_format: 'value', default_value: [], allow_custom: 0, save_custom: 0, toggle: 0 },
    }),
  time: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'time_picker', instructions, { width: o.width, props: { display_format: 'g:i a', return_format: 'H:i', default_value: '', conditional_logic: o.conditional ?? 0 } }),
  repeater: (group, name, label, instructions, subFields, o = {}) =>
    base(group, name, label, 'repeater', instructions, {
      props: { layout: o.layout ?? 'row', pagination: 0, min: o.min ?? 0, max: o.max ?? 0, collapsed: '', button_label: o.button ?? 'Add row', rows_per_page: 20, sub_fields: subFields },
    }),
  group: (group, name, label, instructions, subFields) =>
    base(group, name, label, 'group', instructions, { props: { layout: 'block', sub_fields: subFields } }),
  wysiwyg: (group, name, label, instructions) =>
    base(group, name, label, 'wysiwyg', instructions, { props: { default_value: '', tabs: 'all', toolbar: 'full', media_upload: 0, delay: 0 } }),
  file: (group, name, label, instructions, o = {}) =>
    base(group, name, label, 'file', instructions, { props: { return_format: 'url', library: 'all', min_size: '', max_size: o.maxSize ?? '', mime_types: o.mime ?? '' } }),
  relationship: (group, name, label, instructions, postType, o = {}) =>
    base(group, name, label, 'relationship', instructions, {
      props: { post_type: [postType], taxonomy: [], post_status: ['publish'], filters: ['search'], return_format: 'id', min: '', max: o.max ?? '', elements: '', bidirectional: 0, bidirectional_target: [] },
    }),
}

/** Sub-fields are written with a prefix so their keys stay unique, then the prefix comes off the name. */
const unprefix = (prefix) => (field) => ({ ...field, name: field.name.replace(prefix, '') })

/** A step or list row: title and body. */
const stepRows = (group, prefix) => [
  f.text(group, 'title', 'Title', 'A few words. Aim for under 40 characters.', { required: true, maxlength: 60 }),
  f.textarea(group, 'body', 'Text', 'One or two sentences. Aim for under 200 characters.', { required: true, rows: 3, maxlength: 300 }),
].map((field) => ({ ...field, key: `field_${group}_${prefix}_${field.name}` }))

/** A one-line row in a list repeater, named `text`. */
const lineRow = (group, prefix, instructions, maxlength) =>
  [f.text(group, `${prefix}_text`, 'Line', instructions, { required: true, maxlength })].map(unprefix(`${prefix}_`))

const location = (param, value) => [[{ param, operator: '==', value }]]

function group(key, title, fields, loc, o = {}) {
  return {
    key: `group_${key}`,
    title,
    fields,
    location: loc,
    menu_order: o.order ?? 0,
    position: 'normal',
    style: 'default',
    label_placement: 'top',
    instruction_placement: 'label',
    hide_on_screen: o.hide ?? '',
    active: true,
    description: o.description ?? '',
    show_in_rest: 1,
    modified: 1790000000,
  }
}

const DAYS = Object.fromEntries(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => [d, d]))
const FAQ_GROUPS = { booking: 'Booking (New Patient page)', naturopathic: 'Naturopathic', acupuncture: 'Acupuncture', 'iv-therapy': 'I.V. therapy' }
const PHOTO_NOTE = 'Leave empty if the photo does not exist yet: the site shows a labelled placeholder instead of a broken image.'
const VERBATIM = 'Paste the clinic\'s text as written. Headings, lists and bold come through; nothing is rewritten on the website.'
/** The crop instructions, with the shape the photo is shown at. */
const cropNote = (shape) => `Where the photo is cropped from, as two percentages: "50% 50%" is the centre, "20% 50%" keeps the left side. Shown at ${shape}.`

/* Site settings: every name here is read by inc/options.php. */

const s = 'settings'
const settings = group('brio_settings', 'Site settings', [
  f.tab(s, 'contact', 'Contact'),
  f.text(s, 'phone', 'Phone', 'As it should read on the page, e.g. (604) 271-9355. The top bar shows a ten-digit number as 604-271-9355. Under 20 characters.', { required: true, width: '50', maxlength: 30 }),
  f.email(s, 'email', 'Email', 'Where the contact form sends messages and the footer points.', { required: true, width: '50' }),
  f.text(s, 'address_street', 'Street', 'Unit and street, e.g. 2168-3779 Sexsmith Road. Under 60 characters.', { required: true, width: '50', maxlength: 80 }),
  f.text(s, 'address_locality', 'City', 'e.g. Richmond.', { width: '50', default: 'Richmond', maxlength: 40 }),
  f.text(s, 'address_region', 'Province', 'Two letters, e.g. BC.', { width: '25', default: 'BC', maxlength: 2 }),
  f.text(s, 'address_postal', 'Postal code', 'e.g. V6X 3Z9.', { width: '25', maxlength: 7 }),
  f.text(s, 'address_country', 'Country', 'Two letters, e.g. CA.', { width: '25', default: 'CA', maxlength: 2 }),
  f.tab(s, 'hours', 'Hours'),
  f.repeater(s, 'hours', 'Opening hours', 'These show on the site and tell Google when the clinic is open. Group days that share the same hours onto one row. Days left off every row read as closed.', [
    f.checkbox(s, 'hours_days', 'Days', 'Days the clinic is physically open. These feed Google, so leave the remote Saturday off and use the Saturday note instead.', DAYS, { required: true, width: '40' }),
    f.trueFalse(s, 'hours_closed', 'Closed', 'Switch on to list these days as closed.', 'Closed all day'),
    f.time(s, 'hours_opens', 'Opens', 'Opening time for these days.', { width: '25', conditional: [[{ field: 'field_settings_hours_closed', operator: '!=', value: '1' }]] }),
    f.time(s, 'hours_closes', 'Closes', 'Closing time for these days.', { width: '25', conditional: [[{ field: 'field_settings_hours_closed', operator: '!=', value: '1' }]] }),
  ].map(unprefix('hours_')), { layout: 'table', button: 'Add hours' }),
  f.text(s, 'saturday_note', 'Saturday note', 'Shown under the hours, never sent to Google. e.g. "Remote appointments every other Saturday. Ask when you book." Under 120 characters.', { maxlength: 120 }),
  f.tab(s, 'booking', 'Booking'),
  f.url(s, 'booking_url', 'Jane booking link', 'Where the New Patient page\'s "Get Started" button and its "Returning patient? Book directly" link go. Every other booking button goes to the New Patient page.', { required: true }),
  f.text(s, 'cta_label', 'Booking button label', 'The one label used on every booking button. Keep it to three words, under 30 characters.', { default: 'Book Appointment', maxlength: 30 }),
  f.tab(s, 'social', 'Social'),
  f.repeater(s, 'social', 'Profiles', 'The clinic\'s social profiles, shown as links in the footer. Rows without a link are skipped.', [
    f.select(s, 'social_label', 'Network', 'Which network the link goes to.', { Instagram: 'Instagram', Facebook: 'Facebook', X: 'X', LinkedIn: 'LinkedIn', YouTube: 'YouTube' }, { width: '30' }),
    f.url(s, 'social_url', 'Link', 'The full address of the profile, starting with https://.', { width: '70' }),
  ].map(unprefix('social_')), { layout: 'table', button: 'Add profile' }),
  f.tab(s, 'announcement', 'Announcement bar'),
  f.group(s, 'announcement', 'Announcement', 'A strip across the top of every page. It only shows when it is switched on and has text.', [
    f.trueFalse(s, 'ann_enabled', 'Show the bar', 'Switch off to hide the bar without losing the text.', 'Show a strip across the top of every page'),
    f.text(s, 'ann_text', 'Text', 'One line: holiday hours, a closure, a new service. Under 90 characters.', { maxlength: 90 }),
    f.url(s, 'ann_url', 'Link', 'Optional. Where the bar goes when it is clicked.'),
  ].map(unprefix('ann_'))),
  f.tab(s, 'sharing', 'Sharing'),
  f.image(s, 'og_image', 'Default share image', 'Used when a page is shared and has no image of its own. 1200 by 630 pixels.'),
], location('options_page', 'brio-settings'), { description: 'Site-wide details. Changing anything here updates it everywhere on the website.' })

/* Homepage: one group per section, all on the front page. */

const front = location('page_type', 'front_page')
const h = (section) => `home_${section}`

const homeGroups = [
  group('brio_home_hero', 'Home: hero', [
    f.text(h('hero'), 'heading', 'Heading', 'Dr. Jeff\'s headline, e.g. "Transform Your Health, Regain Your Life:". Under 60 characters.', { maxlength: 60 }),
    f.textarea(h('hero'), 'sentence', 'One sentence', 'Under the heading, e.g. "A Natural Approach to Building Vitality and Increasing Energy". Under 120 characters.', { rows: 2, maxlength: 120 }),
  ], front, { order: 0 }),
  group('brio_home_stakes', 'Home: stakes', [
    f.text(h('stakes'), 'heading', 'Heading', 'e.g. "Have you been frustrated with your level of health?" Under 80 characters.', { maxlength: 80 }),
    f.repeater(h('stakes'), 'questions', 'Questions', 'Four short questions, in order.', lineRow(h('stakes'), 'questions', 'One question. Under 70 characters.', 90), { layout: 'table', max: 6, button: 'Add question' }),
    f.repeater(h('stakes'), 'paragraphs', 'Paragraphs', 'The two paragraphs after the questions, as written.', [
      f.textarea(h('stakes'), 'paragraphs_text', 'Paragraph', 'One paragraph. Under 400 characters.', { required: true, rows: 3, maxlength: 400 }),
    ].map(unprefix('paragraphs_')), { max: 3, button: 'Add paragraph' }),
  ], front, { order: 1 }),
  group('brio_home_services', 'Home: services', [
    f.relationship(h('services'), 'services', 'Services, in order', 'Drag to reorder. Three tiles is the layout.', 'service', { max: 3 }),
  ], front, { order: 2 }),
  group('brio_home_trust', 'Home: trust', [
    f.repeater(h('trust'), 'stats', 'Three statements', 'Short lines with an icon, e.g. "Serving Richmond Since 2006".', [
      f.select(h('trust'), 'stats_icon', 'Icon', 'The icon beside the line.', { certificate: 'Certificate', 'map-pin': 'Map pin', users: 'People' }, { width: '30' }),
      f.text(h('trust'), 'stats_text', 'Line', 'Under 40 characters.', { required: true, width: '70', maxlength: 40 }),
    ].map(unprefix('stats_')), { layout: 'table', min: 3, max: 3, button: 'Add line' }),
    f.image(h('trust'), 'badge', 'Award badge', `The Best of Richmond badge. ${PHOTO_NOTE}`),
    f.text(h('trust'), 'badge_heading', 'Award line', 'e.g. the Best of Richmond sentence from the current homepage. Under 160 characters.', { maxlength: 160 }),
    f.text(h('trust'), 'badge_thanks', 'Second line', 'e.g. "Thank you, Richmond!" Under 60 characters.', { maxlength: 60 }),
    f.relationship(h('trust'), 'testimonials', 'Testimonials to show', 'Two, in order.', 'testimonial', { max: 2 }),
  ], front, { order: 3 }),
  group('brio_home_plan', 'Home: how it works', [
    f.text(h('plan'), 'heading', 'Heading', 'e.g. "Here\'s How It Works". Under 50 characters.', { maxlength: 50 }),
    f.repeater(h('plan'), 'steps', 'Steps', 'Exactly three, in order. They are numbered on the page.', stepRows(h('plan'), 'steps'), { min: 3, max: 3, button: 'Add step' }),
  ], front, { order: 4 }),
  group('brio_home_explain', 'Home: the explanatory paragraph', [
    f.text(h('explain'), 'heading', 'Heading', 'e.g. "At Brio Health we know you want to be healthy, vibrant and full of energy." Under 120 characters.', { maxlength: 120 }),
    f.repeater(h('explain'), 'paragraphs', 'Paragraphs', 'In order, as written.', [
      f.textarea(h('explain'), 'paragraphs_text', 'Paragraph', 'One paragraph. Under 500 characters.', { required: true, rows: 3, maxlength: 500 }),
    ].map(unprefix('paragraphs_')), { max: 6, button: 'Add paragraph' }),
    f.text(h('explain'), 'steps_intro', 'Line before the steps', 'e.g. "Here are the steps to transform your health:". Under 80 characters.', { maxlength: 80 }),
    f.repeater(h('explain'), 'steps', 'Steps', 'Three, in order; the page adds "Step 1:" and so on.', stepRows(h('explain'), 'steps'), { min: 3, max: 3, button: 'Add step' }),
    f.textarea(h('explain'), 'closing', 'Closing line', 'The sentence above the booking button. Under 300 characters.', { rows: 2, maxlength: 300 }),
  ], front, { order: 5 }),
]

/* Custom post types: names match WPService, WPTestimonial and WPFaq in src/lib/wp/types.ts. */

const sv = 'service'
const service = group('brio_service', 'Service', [
  f.wysiwyg(sv, 'body', 'Page text', `The service page, top to bottom, up to the booking button. ${VERBATIM}`),
  f.wysiwyg(sv, 'closing', 'Closing block', `The "... at Brio Health" block shown after the FAQs. Leave empty if the page has none. ${VERBATIM}`),
  f.file(sv, 'video_loop', 'Background loop', 'An 8 to 15 second MP4, 1280x720, no sound, under 3 MB. It plays muted on the home page tile and behind the service page title. See wp/README.md, "Service videos".', { maxSize: 3, mime: 'mp4' }),
  f.image(sv, 'video_poster', 'Loop still', 'A frame from the loop, JPG, 1600 pixels wide. Shown until the loop plays, and instead of it for people who prefer less motion.'),
  f.url(sv, 'video_youtube', 'Narrated video', 'The YouTube link to the full video (unlisted is fine). Adds a "Watch the video" button.', { placeholder: 'https://youtu.be/...' }),
  f.image(sv, 'image', 'Photo', `Used on the service tiles (4:5, home page and Services) only, when there is no loop still. The service page title sits over the loop still, never this photo. The patient, never the doctor. ${PHOTO_NOTE}`),
  f.text(sv, 'image_position', 'Photo crop', cropNote('4:5 on the service tiles'), { default: '50% 50%', maxlength: 20 }),
  f.text(sv, 'faq_heading', 'FAQ heading', 'Above this service\'s questions, e.g. "FAQ’s". Under 40 characters.', { default: 'FAQ’s', maxlength: 40 }),
  f.relationship(sv, 'faqs', 'Questions for this service', 'Shown on this service\'s page, in this order.', 'faq'),
], location('post_type', 'service'), { hide: ['discussion', 'comments'] })

const t = 'testimonial'
const testimonial = group('brio_testimonial', 'Testimonial', [
  f.textarea(t, 'quote', 'Quote', 'The patient\'s words, as written. Under 600 characters.', { required: true, rows: 5, maxlength: 600 }),
  f.text(t, 'name', 'Name', 'First name and last initial, e.g. April B. Under 30 characters.', { required: true, width: '50', maxlength: 40 }),
  f.relationship(t, 'service', 'About which service', 'Optional.', 'service', { max: 1 }),
], location('post_type', 'testimonial'), {
  hide: ['the_content', 'excerpt', 'discussion', 'comments', 'featured_image'],
  description: 'The title is only a label for this list; it never appears on the website.',
})

const q = 'faq'
const faq = group('brio_faq', 'FAQ', [
  f.text(q, 'question', 'Question', 'As it reads on the page. Under 120 characters.', { required: true, maxlength: 120 }),
  f.textarea(q, 'answer', 'Answer', 'As written. Line breaks are kept. Under 600 characters.', { required: true, rows: 5, maxlength: 600 }),
  f.select(q, 'faq_group', 'Which page', 'Booking questions show on the New Patient page; the others on their service page.', FAQ_GROUPS),
], location('post_type', 'faq'), { hide: ['the_content', 'excerpt', 'discussion', 'comments', 'featured_image'] })

const seo = group('brio_seo', 'Search and sharing', [
  f.text('seo', 'seo_title', 'Search title', 'What Google shows as the link. Around 60 characters. Empty uses the page title.', { maxlength: 70 }),
  f.textarea('seo', 'seo_description', 'Search description', 'The grey text under the link. Around 155 characters. Leave empty and one is written from the opening text.', { rows: 2, maxlength: 170 }),
  f.image('seo', 'seo_image', 'Share image', 'Shown when the page is posted or sent in a chat. 1200 by 630 pixels. Falls back to the featured image, then the site default.'),
  f.trueFalse('seo', 'seo_noindex', 'Hide from search engines', 'Only for pages that should not turn up in Google, such as a thank-you page.', 'Ask Google not to list this page'),
], [...location('post_type', 'post'), ...location('post_type', 'page'), ...location('post_type', 'service')], {
  order: 100,
  description: 'There is no Yoast on this install, so these are the SEO fields. All optional.',
})

/* Page templates: bound to the template-*.php stubs, not page IDs, so they survive the staging clone. */

const pageGroup = (key, title, template, fields) =>
  group(key, title, fields, location('page_template', template), { hide: ['discussion', 'comments'] })

/** The page title block. New Patient and Pickleball have no lead line, so they take the heading alone. */
const headingField = (g) =>
  f.text(g, 'heading', 'Heading', 'The title as it reads on the page. Under 40 characters. Empty uses the page title.', { maxlength: 60 })
const heroFields = (g) => [
  headingField(g),
  f.textarea(g, 'lead', 'Lead', 'The line under the heading. Under 200 characters.', { rows: 2, maxlength: 200 }),
]

const about = pageGroup('brio_about', 'About page', 'template-about.php', [
  ...heroFields('about'),
  f.wysiwyg('about', 'body', 'Story', `The pull quote and the paragraphs. ${VERBATIM}`),
  f.image('about', 'portrait', 'Portrait', `Dr. Lee. ${PHOTO_NOTE}`),
  f.text('about', 'portrait_position', 'Portrait crop', cropNote('4:5'), { default: '50% 30%', maxlength: 20 }),
  f.image('about', 'photo_clinic', 'Second photo', `Dr. Lee explaining a treatment. ${PHOTO_NOTE}`),
  f.image('about', 'photo_community', 'Third photo', `Dr. Lee in the community. ${PHOTO_NOTE}`),
])

const contact = pageGroup('brio_contact', 'Contact page', 'template-contact.php', [
  ...heroFields('contact'),
  f.text('contact', 'book_line', 'Booking line', 'Above the booking button, e.g. "If you want to book an appointment use the link below." Under 120 characters.', { maxlength: 120 }),
])

const np = 'new_patient'
const newPatient = pageGroup('brio_new_patient', 'New Patient page', 'template-new-patient.php', [
  headingField(np),
  f.url(np, 'video_url', 'Welcome video', 'The MP4 in the media library (copy its URL). Plays with controls, never by itself.'),
  f.wysiwyg(np, 'intro', 'Intro', `The paragraphs and the three booking steps above the questions. ${VERBATIM}`),
  f.text(np, 'statements_heading', 'Questions heading', 'e.g. "Step 1: Answer the 3 questions below". Under 80 characters.', { maxlength: 80 }),
  f.repeater(np, 'statements', 'The three statements', 'Each must be ticked before "Get Started" works. Exactly three.', [
    f.textarea(np, 'statements_statement', 'Statement', 'One "I understand..." statement. Under 400 characters.', { required: true, rows: 3, maxlength: 400 }),
  ].map(unprefix('statements_')), { min: 3, max: 3, button: 'Add statement' }),
  f.text(np, 'faq_heading', 'FAQ heading', 'Above the booking questions, e.g. "FAQ’s". Under 40 characters.', { maxlength: 40 }),
  f.relationship(np, 'faqs', 'Booking questions', 'Shown under the form, in this order.', 'faq'),
])

const pb = 'pickleball'
const pickleball = pageGroup('brio_pickleball', 'Pickleball page', 'template-pickleball.php', [
  headingField(pb),
  f.wysiwyg(pb, 'intro', 'Intro and coaching method', VERBATIM),
  f.url(pb, 'video_url', 'Video', 'The MP4 in the media library (copy its URL). Plays with controls.'),
  f.repeater(pb, 'photos', 'Captioned photos', 'The coaching photos with their captions, in order.', [
    f.image(pb, 'photos_image', 'Photo', PHOTO_NOTE),
    f.text(pb, 'photos_caption', 'Caption', 'As written. Under 200 characters.', { maxlength: 200 }),
  ].map(unprefix('photos_')), { max: 4, button: 'Add photo' }),
  f.wysiwyg(pb, 'services', 'Coaching services', `The services and prices block. ${VERBATIM}`),
  f.image(pb, 'photo_court', 'Court photo', `On the court. ${PHOTO_NOTE}`),
  f.text(pb, 'quotes_heading', 'Quotes heading', 'e.g. "What they are saying:". Under 60 characters.', { maxlength: 60 }),
  f.repeater(pb, 'quotes', 'What they are saying', 'Quotes with names, in order.', [
    f.textarea(pb, 'quotes_quote', 'Quote', 'As written. Under 600 characters.', { required: true, rows: 4, maxlength: 600 }),
    f.text(pb, 'quotes_name', 'Name', 'e.g. David C. Under 40 characters.', { required: true, maxlength: 40 }),
  ].map(unprefix('quotes_')), { max: 4, button: 'Add quote' }),
  f.text(pb, 'form_heading', 'Form heading', 'Above the lesson form, e.g. "Schedule a lesson". Under 60 characters.', { maxlength: 60 }),
])

export const groups = [settings, ...homeGroups, service, testimonial, faq, seo, about, contact, newPatient, pickleball]
