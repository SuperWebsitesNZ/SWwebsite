// Super Websites v1.8.0 | Website cost calculator on /website-cost-nz/. Prices come from the form markup.
const YEARS = 5;
const UPDATE_PRICE = 50;
const EXTRA_PAGE_PRICE = 300;

const whole = (value, max) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
};

export function calculate({packagePrice, fivePage = false, extraPages = 0, addons = [], updates = 0, monthly = 0, otherBuild = 0}) {
  const extras = whole(extraPages, 20) * EXTRA_PAGE_PRICE;
  const chosen = addons.filter(a => !(fivePage && a.includedInFive));
  const build = whole(packagePrice, 100000) + extras + chosen.reduce((sum, a) => sum + whole(a.price, 100000), 0);
  const ours = build + whole(updates, 52) * UPDATE_PRICE * YEARS;
  const theirs = whole(otherBuild, 50000) + whole(monthly, 2000) * 12 * YEARS;
  return {build, ours, theirs, difference: theirs - ours, from: chosen.some(a => a.from)};
}

export const money = n => 'NZ$' + new Intl.NumberFormat('en-NZ', {maximumFractionDigits: 0}).format(n);

export function summary(result) {
  const prefix = result.from ? 'from ' : '';
  if (result.difference > 0) return `Over five years, Super Websites works out ${money(result.difference)} cheaper, and the website is yours.`;
  if (result.difference < 0) return `Over five years, the monthly option works out ${money(-result.difference)} cheaper on these numbers. Ownership is the difference: stop paying a plan and the site can go offline. Your Super Websites build is ${prefix}${money(result.build)} + GST and stays yours.`;
  return 'Over five years, both options cost about the same. The difference is that our website is yours.';
}

function init(form) {
  const fields = form.elements;
  const out = name => form.querySelector(`[data-out="${name}"]`);
  const update = () => {
    const pkg = form.querySelector('input[name="package"]:checked');
    const fivePage = pkg?.dataset.package === 'five';
    for (const box of form.querySelectorAll('input[name="addon"][data-included]')) {
      // Shown ticked while included; the visitor's own choice comes back if they switch to one page.
      if (fivePage && !box.disabled) { box.dataset.chosen = box.checked; box.checked = true; }
      if (!fivePage && box.disabled) box.checked = box.dataset.chosen === 'true';
      box.disabled = fivePage;
      const price = box.closest('label').querySelector('[data-price]');
      if (price) price.textContent = fivePage ? 'Included' : money(Number(box.value));
    }
    const addons = [...form.querySelectorAll('input[name="addon"]:checked')].map(box => ({
      price: Number(box.value), from: 'from' in box.dataset, includedInFive: box.dataset.included === 'five'
    }));
    const compare = form.querySelector('input[name="compare"]:checked')?.value;
    const custom = fields.customMonthly;
    custom.closest('label').hidden = compare !== 'custom';
    const result = calculate({
      packagePrice: Number(pkg?.value), fivePage, addons,
      extraPages: fields.extraPages.value, updates: fields.updates.value,
      monthly: compare === 'custom' ? custom.value : compare, otherBuild: fields.otherBuild.value
    });
    const prefix = result.from ? 'from ' : '';
    out('build').textContent = prefix + money(result.build);
    out('ours').textContent = prefix + money(result.ours);
    out('theirs').textContent = money(result.theirs);
    out('summary').textContent = summary(result);
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.hidden = false;
  update();
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('cost-calc');
  if (form) init(form);
}
