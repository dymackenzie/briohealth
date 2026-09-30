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
      props: { required: o.required ? 1 : 0, choices, default_value: o.default ?? Object.keys(choices)[0], allow_null: 0, multiple: 0, ui: 0, return_format: 'value', ajax: 0, placeholder: '' },
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
const FAQ_GROUPS = { general: 'General', naturopathic: 'Naturopathic', acupuncture: 'Acupuncture', 'iv-therapy': 'I.V. therapy' }
const FEE_KINDS = { initial: 'Initial assessment', 'follow-up': 'Follow-up', treatment: 'Treatment' }
const PHOTO_NOTE = 'Leave empty if the photo does not exist yet: the site shows a labelled placeholder instead of a broken image.'
const CROP_NOTE = 'Where the photo is cropped from, as two percentages: "50% 50%" is the centre, "20% 50%" keeps the left side. Photos show at 4:5.'

/* Site settings: every name here is read by inc/options.php. */

const s = 'settings'
const settings = group('brio_settings', 'Site settings', [
  f.tab(s, 'contact', 'Contact'),
  f.text(s, 'phone', 'Phone', 'As it should read on the page, e.g. (604) 271-9355. Under 20 characters.', { required: true, width: '50', maxlength: 30 }),
  f.email(s, 'email', 'Email', 'Where the contact form sends messages and the footer points.', { required: true, width: '50' }),
  f.text(s, 'address_street', 'Street', 'Unit and street, e.g. 2168-3779 Sexsmith Road. Under 60 characters.', { required: true, width: '50', maxlength: 80 }),
  f.text(s, 'address_locality', 'City', 'e.g. Richmond.', { width: '50', default: 'Richmond', maxlength: 40 }),
  f.text(s, 'address_region', 'Province', 'Two letters, e.g. BC.', { width: '25', default: 'BC', maxlength: 2 }),
  f.text(s, 'address_postal', 'Postal code', 'e.g. V6X 3Z9.', { width: '25', maxlength: 7 }),
  f.text(s, 'address_country', 'Country', 'Two letters, e.g. CA.', { width: '25', default: 'CA', maxlength: 2 }),
  f.url(s, 'map_url', 'Map link', 'A Google Maps link for the address. The "Get directions" link opens it.', { width: '25' }),
  f.tab(s, 'hours', 'Hours'),
  f.repeater(s, 'hours', 'Opening hours', 'These show on the site and tell Google when the clinic is open. Group days that share the same hours onto one row. Days left off every row read as closed.', [
    f.checkbox(s, 'hours_days', 'Days', 'Days the clinic is physically open. These feed Google, so leave the remote Saturday off and use the Saturday note instead.', DAYS, { required: true, width: '40' }),
    f.trueFalse(s, 'hours_closed', 'Closed', 'Switch on to list these days as closed.', 'Closed all day'),
    f.time(s, 'hours_opens', 'Opens', 'Opening time for these days.', { width: '25', conditional: [[{ field: 'field_settings_hours_closed', operator: '!=', value: '1' }]] }),
    f.time(s, 'hours_closes', 'Closes', 'Closing time for these days.', { width: '25', conditional: [[{ field: 'field_settings_hours_closed', operator: '!=', value: '1' }]] }),
  ].map(unprefix('hours_')), { layout: 'table', button: 'Add hours' }),
  f.text(s, 'saturday_note', 'Saturday note', 'Shown under the hours, never sent to Google. e.g. "Remote appointments every other Saturday. Ask when you book." Under 120 characters.', { maxlength: 120 }),
  f.tab(s, 'booking', 'Booking'),
  f.url(s, 'booking_url', 'Jane booking link', 'Every booking button on the site points here.', { required: true }),
  f.text(s, 'cta_label', 'Booking button label', 'The one label used on every booking button. Keep it to three words, under 30 characters.', { default: 'Book a consultation', maxlength: 30 }),
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
    f.text(h('hero'), 'heading', 'Heading', 'Aim for under 28 characters; longer headings show smaller. e.g. "Feel like yourself again."', { maxlength: 60 }),
    f.textarea(h('hero'), 'sentence', 'One sentence', 'Twenty words at most, under 160 characters.', { rows: 2, maxlength: 160 }),
    f.image(h('hero'), 'image', 'Photo', `A patient, not the doctor. ${PHOTO_NOTE}`),
    f.text(h('hero'), 'image_position', 'Photo crop', CROP_NOTE, { default: '50% 50%', maxlength: 20 }),
    f.text(h('hero'), 'award', 'Award line', 'Sits beside the photo. e.g. "Voted Best Naturopath, Best of Richmond 2025, Richmond News." Under 90 characters.', { maxlength: 90 }),
  ], front, { order: 0 }),
  group('brio_home_stakes', 'Home: sound familiar?', [
    f.text(h('stakes'), 'statement', 'Statement', 'One big line. Aim for under 50 characters.', { maxlength: 80 }),
    f.repeater(h('stakes'), 'items', 'Symptoms', 'Five short lines, in the patient\'s words.', lineRow(h('stakes'), 'items', 'One symptom. Under 70 characters.', 90), { layout: 'table', max: 6, button: 'Add line' }),
  ], front, { order: 1 }),
  group('brio_home_guide', 'Home: your guide', [
    f.text(h('guide'), 'heading', 'Heading', 'Aim for under 40 characters.', { maxlength: 60 }),
    f.textarea(h('guide'), 'quote', 'Quote', "In Dr. Lee's own words. Under 140 characters.", { rows: 3, maxlength: 160 }),
    f.text(h('guide'), 'attribution', 'Attribution', 'Who said the quote, e.g. Dr. Jeffrey Lee, N.D., R.Ac. Under 40 characters.', { maxlength: 60 }),
    f.textarea(h('guide'), 'credentials', 'Credentials', 'One sentence, under 200 characters.', { rows: 2, maxlength: 220 }),
    f.text(h('guide'), 'award', 'Award line', 'e.g. "Voted Best Naturopath in Best of Richmond 2025, by Richmond News." Under 90 characters.', { maxlength: 120 }),
    f.image(h('guide'), 'portrait', 'Portrait', `The one photo of Dr. Lee on the home page. ${PHOTO_NOTE}`),
    f.text(h('guide'), 'portrait_position', 'Portrait crop', CROP_NOTE, { default: '50% 30%', maxlength: 20 }),
  ], front, { order: 2 }),
  group('brio_home_services', 'Home: how we help', [
    f.text(h('services'), 'heading', 'Heading', 'Aim for under 20 characters.', { default: 'How we help', maxlength: 40 }),
    f.relationship(h('services'), 'services', 'Services, in order', 'Drag to reorder. Three is the layout.', 'service', { max: 3 }),
  ], front, { order: 3 }),
  group('brio_home_plan', 'Home: the plan', [
    f.text(h('plan'), 'heading', 'Heading', 'Aim for under 30 characters.', { maxlength: 50 }),
    f.textarea(h('plan'), 'intro', 'Intro', 'One sentence under the heading, under 120 characters.', { rows: 2, maxlength: 160 }),
    f.repeater(h('plan'), 'steps', 'Steps', 'Exactly three, in order. They are numbered on the page.', stepRows(h('plan'), 'steps'), { min: 3, max: 3, button: 'Add step' }),
  ], front, { order: 4 }),
  // Fees are edited once, on the service. This section reads its fee figure
  // from `fee_service`'s Initial assessment row and never types an amount.
  group('brio_home_first_visit', 'Home: your first visit', [
    f.text(h('first_visit'), 'heading', 'Heading', 'Aim for under 20 characters.', { default: 'Your first visit', maxlength: 40 }),
    f.relationship(h('first_visit'), 'fee_service', 'Fee from which service', 'The first big figure is this service\'s Initial assessment fee, read from the service itself, so a fee is only ever typed in one place. Empty uses Naturopathic Medicine.', 'service', { max: 1 }),
    f.repeater(h('first_visit'), 'figures', 'Other big figures', 'Shown after the fee. Never a price: prices live on the services. One at most, and only what the clinic states, e.g. "30 min" and "Virtual, from wherever you are".', [
      f.text(h('first_visit'), 'figures_value', 'Figure', 'Short. e.g. 30 min. Under 10 characters.', { required: true, width: '30', maxlength: 12 }),
      f.text(h('first_visit'), 'figures_label', 'Label', 'What the figure means. e.g. Virtual, from wherever you are. Under 40 characters.', { required: true, width: '70', maxlength: 50 }),
    ].map(unprefix('figures_')), { layout: 'table', max: 1, button: 'Add figure' }),
    f.repeater(h('first_visit'), 'happens', 'What happens', 'Three short lines, in order. They are numbered on the page.', lineRow(h('first_visit'), 'happens', 'One step of the first visit. Under 120 characters.', 160), { layout: 'table', max: 4, button: 'Add line' }),
    f.text(h('first_visit'), 'leave_with_heading', 'What you leave with: heading', 'Aim for under 30 characters.', { default: 'What you leave with', maxlength: 40 }),
    f.textarea(h('first_visit'), 'leave_with', 'What you leave with', 'One sentence, under 160 characters.', { rows: 2, maxlength: 200 }),
  ], front, { order: 5 }),
  group('brio_home_proof', 'Home: what patients say', [
    f.text(h('proof'), 'heading', 'Heading', 'Aim for under 25 characters.', { default: 'What patients say', maxlength: 40 }),
    f.relationship(h('proof'), 'testimonials', 'Reviews to show', 'The first is shown large, the next two small.', 'testimonial', { max: 3 }),
  ], front, { order: 6 }),
  group('brio_home_questions', 'Home: questions', [
    f.text(h('questions'), 'heading', 'Heading', 'Aim for under 25 characters.', { default: 'Before you book', maxlength: 40 }),
    f.text(h('questions'), 'aside', 'Line under the heading', 'One short line. Under 60 characters.', { default: 'Something else on your mind? Call us and ask.', maxlength: 80 }),
    f.relationship(h('questions'), 'faqs', 'Questions to show', 'Five or six, in the order they should appear.', 'faq', { max: 8 }),
  ], front, { order: 7 }),
  group('brio_home_close', 'Home: close', [
    f.text(h('close'), 'heading', 'Heading', 'Aim for under 30 characters.', { default: 'Ready when you are.', maxlength: 50 }),
    f.textarea(h('close'), 'sentence', 'One sentence', 'Under the heading, above the booking button. Under 120 characters.', { rows: 2, maxlength: 160 }),
  ], front, { order: 8 }),
]

/* Custom post types: names match WPService, WPTestimonial and WPFaq in src/lib/wp/types.ts. */

const sv = 'service'
const service = group('brio_service', 'Service', [
  f.textarea(sv, 'summary', 'Summary', 'One or two sentences for the service page. Under 220 characters.', { required: true, rows: 3, maxlength: 220 }),
  f.text(sv, 'who_for', 'Who it is for', 'One line for the lists. e.g. "For when pain, stress or poor sleep is wearing you down." Under 120 characters.', { required: true, maxlength: 120 }),
  f.text(sv, 'lead', 'Lead line', 'Under the heading on the service page. Under 80 characters.', { maxlength: 80 }),
  f.repeater(sv, 'helps_with', 'This is for you if', 'Five or six lines, written to the reader.', lineRow(sv, 'helps_with', 'One line, e.g. "You can\'t sleep, or you\'re dealing with fatigue". Under 100 characters.', 120), { layout: 'table', max: 8, button: 'Add line' }),
  f.repeater(sv, 'steps', 'What a visit involves', 'Three steps, in order. They are numbered on the page.', stepRows(sv, 'steps'), { min: 1, max: 4, button: 'Add step' }),
  f.repeater(sv, 'fees', 'Fees', 'Edited once here; shown on the home page, the services list, this service and the book page. Exactly one row per service must be the Initial assessment: the home page and the services list look for it.', [
    f.select(sv, 'fee_kind', 'Kind', 'What this fee is for. Pick Initial assessment on exactly one row.', FEE_KINDS, { required: true, width: '20' }),
    f.text(sv, 'fee_label', 'Label', 'As it reads on the page, e.g. Initial assessment. Under 30 characters.', { required: true, width: '30', maxlength: 40 }),
    f.text(sv, 'fee_note', 'Note', 'Optional. e.g. 30 minutes, virtual. Under 30 characters.', { width: '30', maxlength: 40 }),
    f.text(sv, 'fee_amount', 'Amount', 'e.g. $150, or a range with a hyphen: $115-$250.', { required: true, width: '20', maxlength: 20 }),
  ].map(unprefix('fee_')), { layout: 'table', button: 'Add fee' }),
  f.text(sv, 'fees_note', 'Fees note', 'One line under the fees. Under 60 characters.', { default: 'Fees subject to change.', maxlength: 80 }),
  f.image(sv, 'image', 'Photo', `The patient, never the doctor. ${PHOTO_NOTE}`),
  f.text(sv, 'image_position', 'Photo crop', CROP_NOTE, { default: '50% 50%', maxlength: 20 }),
  f.relationship(sv, 'faqs', 'Questions for this service', 'Shown on this service\'s page, in this order.', 'faq'),
], location('post_type', 'service'), { hide: ['discussion', 'comments'] })

const t = 'testimonial'
const testimonial = group('brio_testimonial', 'Testimonial', [
  f.textarea(t, 'quote', 'Full quote', "The patient's own words, pasted in full from the review.", { required: true, rows: 5, maxlength: 2000 }),
  f.textarea(t, 'short_quote', 'Short quote', 'What the site shows: three lines at most, under 160 characters, trimmed from the full quote.', { required: true, rows: 3, maxlength: 160 }),
  f.text(t, 'name', 'Name', 'First name and last initial, e.g. Diane C. Under 30 characters.', { required: true, width: '40', maxlength: 40 }),
  f.text(t, 'source', 'Source', 'Where the review was posted, e.g. Google review.', { default: 'Google review', width: '30', maxlength: 30 }),
  f.text(t, 'date', 'When', 'Month and year, e.g. November 2024.', { width: '30', maxlength: 30 }),
  f.relationship(t, 'service', 'About which service', 'Optional. Lets the review show on that service\'s page.', 'service', { max: 1 }),
], location('post_type', 'testimonial'), {
  hide: ['the_content', 'excerpt', 'discussion', 'comments', 'featured_image'],
  description: 'The title is only a label for this list; it never appears on the website.',
})

const q = 'faq'
const faq = group('brio_faq', 'FAQ', [
  f.text(q, 'question', 'Question', 'As the patient would ask it. Under 80 characters.', { required: true, maxlength: 80 }),
  f.textarea(q, 'answer', 'Answer', 'Two or three sentences. Plain text, under 400 characters.', { required: true, rows: 4, maxlength: 400 }),
  f.select(q, 'faq_group', 'Where it belongs', 'General questions can show anywhere; the others belong with their service.', FAQ_GROUPS),
], location('post_type', 'faq'), { hide: ['the_content', 'excerpt', 'discussion', 'comments', 'featured_image'] })

const seo = group('brio_seo', 'Search and sharing', [
  f.text('seo', 'seo_title', 'Search title', 'What Google shows as the link. Around 60 characters. Empty uses the page title.', { maxlength: 70 }),
  f.textarea('seo', 'seo_description', 'Search description', 'The grey text under the link. Around 155 characters. Empty and one is written from the opening text.', { rows: 2, maxlength: 170 }),
  f.image('seo', 'seo_image', 'Share image', 'Shown when the page is posted or sent in a chat. 1200 by 630 pixels. Falls back to the featured image, then the site default.'),
  f.trueFalse('seo', 'seo_noindex', 'Hide from search engines', 'Only for pages that should not turn up in Google, such as a thank-you page.', 'Ask Google not to list this page'),
], [...location('post_type', 'post'), ...location('post_type', 'page'), ...location('post_type', 'service')], {
  order: 100,
  description: 'There is no Yoast on this install, so these are the SEO fields. All optional.',
})

/* Page templates: bound to the template-*.php stubs, not page IDs, so they survive the staging clone. */

const pageGroup = (key, title, template, fields) =>
  group(key, title, fields, location('page_template', template), { hide: ['discussion', 'comments'] })

const heroFields = (g) => [
  f.text(g, 'heading', 'Heading', 'Aim for under 28 characters; longer headings show smaller. Empty uses the page title.', { maxlength: 60 }),
  f.textarea(g, 'lead', 'Lead', 'One or two sentences under the heading. Under 200 characters.', { rows: 2, maxlength: 200 }),
]

const about = pageGroup('brio_about', 'About page', 'template-about.php', [
  ...heroFields('about'),
  f.image('about', 'portrait', 'Portrait', `Dr. Lee. ${PHOTO_NOTE}`),
  f.text('about', 'portrait_position', 'Portrait crop', CROP_NOTE, { default: '50% 30%', maxlength: 20 }),
  f.repeater('about', 'credentials', 'Credentials', 'Four short lines.', lineRow('about', 'credentials', 'One qualification or fact. Under 70 characters.', 90), { layout: 'table', max: 6, button: 'Add line' }),
  f.text('about', 'award', 'Award line', 'e.g. "Voted Best Naturopath in Best of Richmond 2025, by Richmond News." Under 90 characters.', { maxlength: 120 }),
  f.image('about', 'photo_clinic', 'Second photo', `In the clinic. ${PHOTO_NOTE}`),
  f.image('about', 'photo_community', 'Third photo', `In the community. ${PHOTO_NOTE}`),
])

const contact = pageGroup('brio_contact', 'Contact page', 'template-contact.php', [
  ...heroFields('contact'),
  f.textarea('contact', 'privacy_note', 'Note under the form', 'A reminder not to send medical details by email. Under 160 characters.', { rows: 2, maxlength: 200, default: "Please don't include medical details you wouldn't want sent by email. For anything sensitive, call us instead." }),
])

const book = pageGroup('brio_book', 'Book page', 'template-book.php', [
  ...heroFields('book'),
  f.textarea('book', 'intro', 'Intro', 'One or two sentences above the booking button. Under 200 characters.', { rows: 2, maxlength: 220 }),
  f.text('book', 'first_note', 'Note under "What happens first"', 'e.g. "For naturopathic medicine. Acupuncture and I.V. therapy each start with their own consultation." Under 120 characters.', { maxlength: 160 }),
])

const pickleball = pageGroup('brio_pickleball', 'Pickleball page', 'template-pickleball.php', [
  ...heroFields('pickleball'),
  f.image('pickleball', 'photo_court', 'Court photo', `On the court. ${PHOTO_NOTE}`),
  f.image('pickleball', 'photo_group', 'Group photo', `The group together. ${PHOTO_NOTE}`),
])

export const groups = [settings, ...homeGroups, service, testimonial, faq, seo, about, contact, book, pickleball]
