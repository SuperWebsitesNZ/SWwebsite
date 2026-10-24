// Super Websites v1.8.0 | Cost calculator arithmetic; no DOM, no network.
import assert from 'node:assert/strict';
import {calculate, money, summary} from '../cost-calculator-v1.8.0.js';

const gbp = {price: 175, includedInFive: true}, gallery = {price: 200, includedInFive: true}, blog = {price: 350, from: true};

// One page, four updates a year, against a NZ$31/month builder.
let r = calculate({packagePrice: 1500, updates: 4, monthly: 31});
assert.deepEqual(r, {build: 1500, ours: 2500, theirs: 1860, difference: -640, from: false});
assert.match(summary(r), /monthly option works out NZ\$640 cheaper/);

// Five-page package already includes GBP setup and the gallery, so they are not charged twice.
r = calculate({packagePrice: 2950, fivePage: true, addons: [gbp, gallery], updates: 0, monthly: 79});
assert.equal(r.build, 2950);
assert.equal(r.theirs, 4740);
assert.match(summary(r), /Super Websites works out NZ\$1,790 cheaper/);

// One page with paid extras and a "from" price.
r = calculate({packagePrice: 1500, extraPages: 2, addons: [gbp, blog], updates: 0, monthly: 0});
assert.equal(r.build, 1500 + 600 + 175 + 350);
assert.equal(r.from, true);

// Inputs are clamped to whole, non-negative numbers.
r = calculate({packagePrice: 1500, extraPages: -3, updates: 'abc', monthly: 2.9, otherBuild: 1e9});
assert.equal(r.build, 1500);
assert.equal(r.ours, 1500);
assert.equal(r.theirs, 50000 + 2 * 60);

assert.equal(money(4740), 'NZ$4,740');
assert.match(summary({build: 1500, ours: 1500, theirs: 1500, difference: 0}), /about the same/);
console.log('Cost calculator checks passed: packages, included extras, from prices, clamping and summaries.');
