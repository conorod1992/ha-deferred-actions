const We = globalThis, In = We.ShadowRoot && (We.ShadyCSS === void 0 || We.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Mn = /* @__PURE__ */ Symbol(), Un = /* @__PURE__ */ new WeakMap();
let Si = class {
  constructor(n, r, l) {
    if (this._$cssResult$ = !0, l !== Mn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = n, this.t = r;
  }
  get styleSheet() {
    let n = this.o;
    const r = this.t;
    if (In && n === void 0) {
      const l = r !== void 0 && r.length === 1;
      l && (n = Un.get(r)), n === void 0 && ((this.o = n = new CSSStyleSheet()).replaceSync(this.cssText), l && Un.set(r, n));
    }
    return n;
  }
  toString() {
    return this.cssText;
  }
};
const Gi = (t) => new Si(typeof t == "string" ? t : t + "", void 0, Mn), Ji = (t, ...n) => {
  const r = t.length === 1 ? t[0] : n.reduce((l, o, s) => l + ((c) => {
    if (c._$cssResult$ === !0) return c.cssText;
    if (typeof c == "number") return c;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + c + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new Si(r, t, Mn);
}, Vi = (t, n) => {
  if (In) t.adoptedStyleSheets = n.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of n) {
    const l = document.createElement("style"), o = We.litNonce;
    o !== void 0 && l.setAttribute("nonce", o), l.textContent = r.cssText, t.appendChild(l);
  }
}, Hn = In ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((n) => {
  let r = "";
  for (const l of n.cssRules) r += l.cssText;
  return Gi(r);
})(t) : t;
const { is: Qi, defineProperty: Zi, getOwnPropertyDescriptor: Xi, getOwnPropertyNames: et, getOwnPropertySymbols: nt, getPrototypeOf: it } = Object, Ve = globalThis, Yn = Ve.trustedTypes, tt = Yn ? Yn.emptyScript : "", rt = Ve.reactiveElementPolyfillSupport, Se = (t, n) => t, Ge = { toAttribute(t, n) {
  switch (n) {
    case Boolean:
      t = t ? tt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, n) {
  let r = t;
  switch (n) {
    case Boolean:
      r = t !== null;
      break;
    case Number:
      r = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(t);
      } catch {
        r = null;
      }
  }
  return r;
} }, Ln = (t, n) => !Qi(t, n), jn = { attribute: !0, type: String, converter: Ge, reflect: !1, useDefault: !1, hasChanged: Ln };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Ve.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let he = class extends HTMLElement {
  static addInitializer(n) {
    this._$Ei(), (this.l ??= []).push(n);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(n, r = jn) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(n) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(n, r), !r.noAccessor) {
      const l = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(n, l, r);
      o !== void 0 && Zi(this.prototype, n, o);
    }
  }
  static getPropertyDescriptor(n, r, l) {
    const { get: o, set: s } = Xi(this.prototype, n) ?? { get() {
      return this[r];
    }, set(c) {
      this[r] = c;
    } };
    return { get: o, set(c) {
      const d = o?.call(this);
      s?.call(this, c), this.requestUpdate(n, d, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(n) {
    return this.elementProperties.get(n) ?? jn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Se("elementProperties"))) return;
    const n = it(this);
    n.finalize(), n.l !== void 0 && (this.l = [...n.l]), this.elementProperties = new Map(n.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Se("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Se("properties"))) {
      const r = this.properties, l = [...et(r), ...nt(r)];
      for (const o of l) this.createProperty(o, r[o]);
    }
    const n = this[Symbol.metadata];
    if (n !== null) {
      const r = litPropertyMetadata.get(n);
      if (r !== void 0) for (const [l, o] of r) this.elementProperties.set(l, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, l] of this.elementProperties) {
      const o = this._$Eu(r, l);
      o !== void 0 && this._$Eh.set(o, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(n) {
    const r = [];
    if (Array.isArray(n)) {
      const l = new Set(n.flat(1 / 0).reverse());
      for (const o of l) r.unshift(Hn(o));
    } else n !== void 0 && r.push(Hn(n));
    return r;
  }
  static _$Eu(n, r) {
    const l = r.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof n == "string" ? n.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((n) => n(this));
  }
  addController(n) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(n), this.renderRoot !== void 0 && this.isConnected && n.hostConnected?.();
  }
  removeController(n) {
    this._$EO?.delete(n);
  }
  _$E_() {
    const n = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const l of r.keys()) this.hasOwnProperty(l) && (n.set(l, this[l]), delete this[l]);
    n.size > 0 && (this._$Ep = n);
  }
  createRenderRoot() {
    const n = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Vi(n, this.constructor.elementStyles), n;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((n) => n.hostConnected?.());
  }
  enableUpdating(n) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((n) => n.hostDisconnected?.());
  }
  attributeChangedCallback(n, r, l) {
    this._$AK(n, l);
  }
  _$ET(n, r) {
    const l = this.constructor.elementProperties.get(n), o = this.constructor._$Eu(n, l);
    if (o !== void 0 && l.reflect === !0) {
      const s = (l.converter?.toAttribute !== void 0 ? l.converter : Ge).toAttribute(r, l.type);
      this._$Em = n, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(n, r) {
    const l = this.constructor, o = l._$Eh.get(n);
    if (o !== void 0 && this._$Em !== o) {
      const s = l.getPropertyOptions(o), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Ge;
      this._$Em = o;
      const d = c.fromAttribute(r, s.type);
      this[o] = d ?? this._$Ej?.get(o) ?? d, this._$Em = null;
    }
  }
  requestUpdate(n, r, l, o = !1, s) {
    if (n !== void 0) {
      const c = this.constructor;
      if (o === !1 && (s = this[n]), l ??= c.getPropertyOptions(n), !((l.hasChanged ?? Ln)(s, r) || l.useDefault && l.reflect && s === this._$Ej?.get(n) && !this.hasAttribute(c._$Eu(n, l)))) return;
      this.C(n, r, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(n, r, { useDefault: l, reflect: o, wrapped: s }, c) {
    l && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(n) && (this._$Ej.set(n, c ?? r ?? this[n]), s !== !0 || c !== void 0) || (this._$AL.has(n) || (this.hasUpdated || l || (r = void 0), this._$AL.set(n, r)), o === !0 && this._$Em !== n && (this._$Eq ??= /* @__PURE__ */ new Set()).add(n));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const n = this.scheduleUpdate();
    return n != null && await n, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const l = this.constructor.elementProperties;
      if (l.size > 0) for (const [o, s] of l) {
        const { wrapped: c } = s, d = this[o];
        c !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, s, d);
      }
    }
    let n = !1;
    const r = this._$AL;
    try {
      n = this.shouldUpdate(r), n ? (this.willUpdate(r), this._$EO?.forEach((l) => l.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (l) {
      throw n = !1, this._$EM(), l;
    }
    n && this._$AE(r);
  }
  willUpdate(n) {
  }
  _$AE(n) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(n)), this.updated(n);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(n) {
    return !0;
  }
  update(n) {
    this._$Eq &&= this._$Eq.forEach((r) => this._$ET(r, this[r])), this._$EM();
  }
  updated(n) {
  }
  firstUpdated(n) {
  }
};
he.elementStyles = [], he.shadowRootOptions = { mode: "open" }, he[Se("elementProperties")] = /* @__PURE__ */ new Map(), he[Se("finalized")] = /* @__PURE__ */ new Map(), rt?.({ ReactiveElement: he }), (Ve.reactiveElementVersions ??= []).push("2.1.2");
const Rn = globalThis, Bn = (t) => t, Je = Rn.trustedTypes, Kn = Je ? Je.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ci = "$lit$", te = `lit$${Math.random().toFixed(9).slice(2)}$`, Ei = "?" + te, ot = `<${Ei}>`, ce = document, Ee = () => ce.createComment(""), Te = (t) => t === null || typeof t != "object" && typeof t != "function", Pn = Array.isArray, lt = (t) => Pn(t) || typeof t?.[Symbol.iterator] == "function", un = `[ 	
\f\r]`, we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zn = /-->/g, Wn = />/g, le = RegExp(`>|${un}(?:([^\\s"'>=/]+)(${un}*=${un}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Gn = /'/g, Jn = /"/g, Ti = /^(?:script|style|textarea|title)$/i, st = (t) => (n, ...r) => ({ _$litType$: t, strings: n, values: r }), R = st(1), me = /* @__PURE__ */ Symbol.for("lit-noChange"), M = /* @__PURE__ */ Symbol.for("lit-nothing"), Vn = /* @__PURE__ */ new WeakMap(), se = ce.createTreeWalker(ce, 129);
function ki(t, n) {
  if (!Pn(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Kn !== void 0 ? Kn.createHTML(n) : n;
}
const ct = (t, n) => {
  const r = t.length - 1, l = [];
  let o, s = n === 2 ? "<svg>" : n === 3 ? "<math>" : "", c = we;
  for (let d = 0; d < r; d++) {
    const g = t[d];
    let p, f, _ = -1, k = 0;
    for (; k < g.length && (c.lastIndex = k, f = c.exec(g), f !== null); ) k = c.lastIndex, c === we ? f[1] === "!--" ? c = zn : f[1] !== void 0 ? c = Wn : f[2] !== void 0 ? (Ti.test(f[2]) && (o = RegExp("</" + f[2], "g")), c = le) : f[3] !== void 0 && (c = le) : c === le ? f[0] === ">" ? (c = o ?? we, _ = -1) : f[1] === void 0 ? _ = -2 : (_ = c.lastIndex - f[2].length, p = f[1], c = f[3] === void 0 ? le : f[3] === '"' ? Jn : Gn) : c === Jn || c === Gn ? c = le : c === zn || c === Wn ? c = we : (c = le, o = void 0);
    const N = c === le && t[d + 1].startsWith("/>") ? " " : "";
    s += c === we ? g + ot : _ >= 0 ? (l.push(p), g.slice(0, _) + Ci + g.slice(_) + te + N) : g + te + (_ === -2 ? d : N);
  }
  return [ki(t, s + (t[r] || "<?>") + (n === 2 ? "</svg>" : n === 3 ? "</math>" : "")), l];
};
class ke {
  constructor({ strings: n, _$litType$: r }, l) {
    let o;
    this.parts = [];
    let s = 0, c = 0;
    const d = n.length - 1, g = this.parts, [p, f] = ct(n, r);
    if (this.el = ke.createElement(p, l), se.currentNode = this.el.content, r === 2 || r === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (o = se.nextNode()) !== null && g.length < d; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const _ of o.getAttributeNames()) if (_.endsWith(Ci)) {
          const k = f[c++], N = o.getAttribute(_).split(te), B = /([.?@])?(.*)/.exec(k);
          g.push({ type: 1, index: s, name: B[2], strings: N, ctor: B[1] === "." ? at : B[1] === "?" ? pt : B[1] === "@" ? dt : Qe }), o.removeAttribute(_);
        } else _.startsWith(te) && (g.push({ type: 6, index: s }), o.removeAttribute(_));
        if (Ti.test(o.tagName)) {
          const _ = o.textContent.split(te), k = _.length - 1;
          if (k > 0) {
            o.textContent = Je ? Je.emptyScript : "";
            for (let N = 0; N < k; N++) o.append(_[N], Ee()), se.nextNode(), g.push({ type: 2, index: ++s });
            o.append(_[k], Ee());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ei) g.push({ type: 2, index: s });
      else {
        let _ = -1;
        for (; (_ = o.data.indexOf(te, _ + 1)) !== -1; ) g.push({ type: 7, index: s }), _ += te.length - 1;
      }
      s++;
    }
  }
  static createElement(n, r) {
    const l = ce.createElement("template");
    return l.innerHTML = n, l;
  }
}
function ge(t, n, r = t, l) {
  if (n === me) return n;
  let o = l !== void 0 ? r._$Co?.[l] : r._$Cl;
  const s = Te(n) ? void 0 : n._$litDirective$;
  return o?.constructor !== s && (o?._$AO?.(!1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, r, l)), l !== void 0 ? (r._$Co ??= [])[l] = o : r._$Cl = o), o !== void 0 && (n = ge(t, o._$AS(t, n.values), o, l)), n;
}
class ut {
  constructor(n, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = n, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(n) {
    const { el: { content: r }, parts: l } = this._$AD, o = (n?.creationScope ?? ce).importNode(r, !0);
    se.currentNode = o;
    let s = se.nextNode(), c = 0, d = 0, g = l[0];
    for (; g !== void 0; ) {
      if (c === g.index) {
        let p;
        g.type === 2 ? p = new Oe(s, s.nextSibling, this, n) : g.type === 1 ? p = new g.ctor(s, g.name, g.strings, this, n) : g.type === 6 && (p = new ft(s, this, n)), this._$AV.push(p), g = l[++d];
      }
      c !== g?.index && (s = se.nextNode(), c++);
    }
    return se.currentNode = ce, o;
  }
  p(n) {
    let r = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(n, l, r), r += l.strings.length - 2) : l._$AI(n[r])), r++;
  }
}
class Oe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(n, r, l, o) {
    this.type = 2, this._$AH = M, this._$AN = void 0, this._$AA = n, this._$AB = r, this._$AM = l, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let n = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && n?.nodeType === 11 && (n = r.parentNode), n;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(n, r = this) {
    n = ge(this, n, r), Te(n) ? n === M || n == null || n === "" ? (this._$AH !== M && this._$AR(), this._$AH = M) : n !== this._$AH && n !== me && this._(n) : n._$litType$ !== void 0 ? this.$(n) : n.nodeType !== void 0 ? this.T(n) : lt(n) ? this.k(n) : this._(n);
  }
  O(n) {
    return this._$AA.parentNode.insertBefore(n, this._$AB);
  }
  T(n) {
    this._$AH !== n && (this._$AR(), this._$AH = this.O(n));
  }
  _(n) {
    this._$AH !== M && Te(this._$AH) ? this._$AA.nextSibling.data = n : this.T(ce.createTextNode(n)), this._$AH = n;
  }
  $(n) {
    const { values: r, _$litType$: l } = n, o = typeof l == "number" ? this._$AC(n) : (l.el === void 0 && (l.el = ke.createElement(ki(l.h, l.h[0]), this.options)), l);
    if (this._$AH?._$AD === o) this._$AH.p(r);
    else {
      const s = new ut(o, this), c = s.u(this.options);
      s.p(r), this.T(c), this._$AH = s;
    }
  }
  _$AC(n) {
    let r = Vn.get(n.strings);
    return r === void 0 && Vn.set(n.strings, r = new ke(n)), r;
  }
  k(n) {
    Pn(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let l, o = 0;
    for (const s of n) o === r.length ? r.push(l = new Oe(this.O(Ee()), this.O(Ee()), this, this.options)) : l = r[o], l._$AI(s), o++;
    o < r.length && (this._$AR(l && l._$AB.nextSibling, o), r.length = o);
  }
  _$AR(n = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); n !== this._$AB; ) {
      const l = Bn(n).nextSibling;
      Bn(n).remove(), n = l;
    }
  }
  setConnected(n) {
    this._$AM === void 0 && (this._$Cv = n, this._$AP?.(n));
  }
}
class Qe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(n, r, l, o, s) {
    this.type = 1, this._$AH = M, this._$AN = void 0, this.element = n, this.name = r, this._$AM = o, this.options = s, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = M;
  }
  _$AI(n, r = this, l, o) {
    const s = this.strings;
    let c = !1;
    if (s === void 0) n = ge(this, n, r, 0), c = !Te(n) || n !== this._$AH && n !== me, c && (this._$AH = n);
    else {
      const d = n;
      let g, p;
      for (n = s[0], g = 0; g < s.length - 1; g++) p = ge(this, d[l + g], r, g), p === me && (p = this._$AH[g]), c ||= !Te(p) || p !== this._$AH[g], p === M ? n = M : n !== M && (n += (p ?? "") + s[g + 1]), this._$AH[g] = p;
    }
    c && !o && this.j(n);
  }
  j(n) {
    n === M ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, n ?? "");
  }
}
class at extends Qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(n) {
    this.element[this.name] = n === M ? void 0 : n;
  }
}
class pt extends Qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(n) {
    this.element.toggleAttribute(this.name, !!n && n !== M);
  }
}
class dt extends Qe {
  constructor(n, r, l, o, s) {
    super(n, r, l, o, s), this.type = 5;
  }
  _$AI(n, r = this) {
    if ((n = ge(this, n, r, 0) ?? M) === me) return;
    const l = this._$AH, o = n === M && l !== M || n.capture !== l.capture || n.once !== l.once || n.passive !== l.passive, s = n !== M && (l === M || o);
    o && this.element.removeEventListener(this.name, this, l), s && this.element.addEventListener(this.name, this, n), this._$AH = n;
  }
  handleEvent(n) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, n) : this._$AH.handleEvent(n);
  }
}
class ft {
  constructor(n, r, l) {
    this.element = n, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(n) {
    ge(this, n);
  }
}
const ht = Rn.litHtmlPolyfillSupport;
ht?.(ke, Oe), (Rn.litHtmlVersions ??= []).push("3.3.3");
const mt = (t, n, r) => {
  const l = r?.renderBefore ?? n;
  let o = l._$litPart$;
  if (o === void 0) {
    const s = r?.renderBefore ?? null;
    l._$litPart$ = o = new Oe(n.insertBefore(Ee(), s), s, void 0, r ?? {});
  }
  return o._$AI(t), o;
};
const Dn = globalThis;
class Ce extends he {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const n = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= n.firstChild, n;
  }
  update(n) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(n), this._$Do = mt(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return me;
  }
}
Ce._$litElement$ = !0, Ce.finalized = !0, Dn.litElementHydrateSupport?.({ LitElement: Ce });
const gt = Dn.litElementPolyfillSupport;
gt?.({ LitElement: Ce });
(Dn.litElementVersions ??= []).push("4.2.2");
const yt = (t) => (n, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, n);
  }) : customElements.define(t, n);
};
const bt = { attribute: !0, type: String, converter: Ge, reflect: !1, hasChanged: Ln }, At = (t = bt, n, r) => {
  const { kind: l, metadata: o } = r;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), l === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), l === "accessor") {
    const { name: c } = r;
    return { set(d) {
      const g = n.get.call(this);
      n.set.call(this, d), this.requestUpdate(c, g, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(c, void 0, t, d), d;
    } };
  }
  if (l === "setter") {
    const { name: c } = r;
    return function(d) {
      const g = this[c];
      n.call(this, d), this.requestUpdate(c, g, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + l);
};
function Oi(t) {
  return (n, r) => typeof r == "object" ? At(t, n, r) : ((l, o, s) => {
    const c = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, l), c ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, n, r);
}
function ue(t) {
  return Oi({ ...t, state: !0, attribute: !1 });
}
function _t(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var U = {}, ze = {}, ie = {}, Qn;
function Ne() {
  if (Qn) return ie;
  Qn = 1;
  function t(c) {
    return typeof c > "u" || c === null;
  }
  function n(c) {
    return typeof c == "object" && c !== null;
  }
  function r(c) {
    return Array.isArray(c) ? c : t(c) ? [] : [c];
  }
  function l(c, d) {
    if (d) {
      const g = Object.keys(d);
      for (let p = 0, f = g.length; p < f; p += 1) {
        const _ = g[p];
        c[_] = d[_];
      }
    }
    return c;
  }
  function o(c, d) {
    let g = "";
    for (let p = 0; p < d; p += 1)
      g += c;
    return g;
  }
  function s(c) {
    return c === 0 && Number.NEGATIVE_INFINITY === 1 / c;
  }
  return ie.isNothing = t, ie.isObject = n, ie.toArray = r, ie.repeat = o, ie.isNegativeZero = s, ie.extend = l, ie;
}
var an, Zn;
function Ie() {
  if (Zn) return an;
  Zn = 1;
  function t(r, l) {
    let o = "";
    const s = r.reason || "(unknown reason)";
    return r.mark ? (r.mark.name && (o += 'in "' + r.mark.name + '" '), o += "(" + (r.mark.line + 1) + ":" + (r.mark.column + 1) + ")", !l && r.mark.snippet && (o += `

` + r.mark.snippet), s + " " + o) : s;
  }
  function n(r, l) {
    Error.call(this), this.name = "YAMLException", this.reason = r, this.mark = l, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n.prototype.toString = function(l) {
    return this.name + ": " + t(this, l);
  }, an = n, an;
}
var pn, Xn;
function xt() {
  if (Xn) return pn;
  Xn = 1;
  const t = Ne();
  function n(o, s, c, d, g) {
    let p = "", f = "";
    const _ = Math.floor(g / 2) - 1;
    return d - s > _ && (p = " ... ", s = d - _ + p.length), c - d > _ && (f = " ...", c = d + _ - f.length), {
      str: p + o.slice(s, c).replace(/\t/g, "→") + f,
      pos: d - s + p.length
      // relative position
    };
  }
  function r(o, s) {
    return t.repeat(" ", s - o.length) + o;
  }
  function l(o, s) {
    if (s = Object.create(s || null), !o.buffer) return null;
    s.maxLength || (s.maxLength = 79), typeof s.indent != "number" && (s.indent = 1), typeof s.linesBefore != "number" && (s.linesBefore = 3), typeof s.linesAfter != "number" && (s.linesAfter = 2);
    const c = /\r?\n|\r|\0/g, d = [0], g = [];
    let p, f = -1;
    for (; p = c.exec(o.buffer); )
      g.push(p.index), d.push(p.index + p[0].length), o.position <= p.index && f < 0 && (f = d.length - 2);
    f < 0 && (f = d.length - 1);
    let _ = "";
    const k = Math.min(o.line + s.linesAfter, g.length).toString().length, N = s.maxLength - (s.indent + k + 3);
    for (let P = 1; P <= s.linesBefore && !(f - P < 0); P++) {
      const z = n(
        o.buffer,
        d[f - P],
        g[f - P],
        o.position - (d[f] - d[f - P]),
        N
      );
      _ = t.repeat(" ", s.indent) + r((o.line - P + 1).toString(), k) + " | " + z.str + `
` + _;
    }
    const B = n(o.buffer, d[f], g[f], o.position, N);
    _ += t.repeat(" ", s.indent) + r((o.line + 1).toString(), k) + " | " + B.str + `
`, _ += t.repeat("-", s.indent + k + 3 + B.pos) + `^
`;
    for (let P = 1; P <= s.linesAfter && !(f + P >= g.length); P++) {
      const z = n(
        o.buffer,
        d[f + P],
        g[f + P],
        o.position - (d[f] - d[f + P]),
        N
      );
      _ += t.repeat(" ", s.indent) + r((o.line + P + 1).toString(), k) + " | " + z.str + `
`;
    }
    return _.replace(/\n$/, "");
  }
  return pn = l, pn;
}
var dn, ei;
function H() {
  if (ei) return dn;
  ei = 1;
  const t = Ie(), n = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], r = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function l(s) {
    const c = {};
    return s !== null && Object.keys(s).forEach(function(d) {
      s[d].forEach(function(g) {
        c[String(g)] = d;
      });
    }), c;
  }
  function o(s, c) {
    if (c = c || {}, Object.keys(c).forEach(function(d) {
      if (n.indexOf(d) === -1)
        throw new t('Unknown option "' + d + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = c, this.tag = s, this.kind = c.kind || null, this.resolve = c.resolve || function() {
      return !0;
    }, this.construct = c.construct || function(d) {
      return d;
    }, this.instanceOf = c.instanceOf || null, this.predicate = c.predicate || null, this.represent = c.represent || null, this.representName = c.representName || null, this.defaultStyle = c.defaultStyle || null, this.multi = c.multi || !1, this.styleAliases = l(c.styleAliases || null), r.indexOf(this.kind) === -1)
      throw new t('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return dn = o, dn;
}
var fn, ni;
function Ni() {
  if (ni) return fn;
  ni = 1;
  const t = Ie(), n = H();
  function r(s, c) {
    const d = [];
    return s[c].forEach(function(g) {
      let p = d.length;
      d.forEach(function(f, _) {
        f.tag === g.tag && f.kind === g.kind && f.multi === g.multi && (p = _);
      }), d[p] = g;
    }), d;
  }
  function l() {
    const s = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    };
    function c(d) {
      d.multi ? (s.multi[d.kind].push(d), s.multi.fallback.push(d)) : s[d.kind][d.tag] = s.fallback[d.tag] = d;
    }
    for (let d = 0, g = arguments.length; d < g; d += 1)
      arguments[d].forEach(c);
    return s;
  }
  function o(s) {
    return this.extend(s);
  }
  return o.prototype.extend = function(c) {
    let d = [], g = [];
    if (c instanceof n)
      g.push(c);
    else if (Array.isArray(c))
      g = g.concat(c);
    else if (c && (Array.isArray(c.implicit) || Array.isArray(c.explicit)))
      c.implicit && (d = d.concat(c.implicit)), c.explicit && (g = g.concat(c.explicit));
    else
      throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    d.forEach(function(f) {
      if (!(f instanceof n))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (f.loadKind && f.loadKind !== "scalar")
        throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (f.multi)
        throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), g.forEach(function(f) {
      if (!(f instanceof n))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const p = Object.create(o.prototype);
    return p.implicit = (this.implicit || []).concat(d), p.explicit = (this.explicit || []).concat(g), p.compiledImplicit = r(p, "implicit"), p.compiledExplicit = r(p, "explicit"), p.compiledTypeMap = l(p.compiledImplicit, p.compiledExplicit), p;
  }, fn = o, fn;
}
var hn, ii;
function Ii() {
  if (ii) return hn;
  ii = 1;
  const t = H();
  return hn = new t("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(n) {
      return n !== null ? n : "";
    }
  }), hn;
}
var mn, ti;
function Mi() {
  if (ti) return mn;
  ti = 1;
  const t = H();
  return mn = new t("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(n) {
      return n !== null ? n : [];
    }
  }), mn;
}
var gn, ri;
function Li() {
  if (ri) return gn;
  ri = 1;
  const t = H();
  return gn = new t("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(n) {
      return n !== null ? n : {};
    }
  }), gn;
}
var yn, oi;
function Ri() {
  if (oi) return yn;
  oi = 1;
  const t = Ni();
  return yn = new t({
    explicit: [
      Ii(),
      Mi(),
      Li()
    ]
  }), yn;
}
var bn, li;
function Pi() {
  if (li) return bn;
  li = 1;
  const t = H();
  function n(o) {
    if (o === null) return !0;
    const s = o.length;
    return s === 1 && o === "~" || s === 4 && (o === "null" || o === "Null" || o === "NULL");
  }
  function r() {
    return null;
  }
  function l(o) {
    return o === null;
  }
  return bn = new t("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: n,
    construct: r,
    predicate: l,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), bn;
}
var An, si;
function Di() {
  if (si) return An;
  si = 1;
  const t = H();
  function n(o) {
    if (o === null) return !1;
    const s = o.length;
    return s === 4 && (o === "true" || o === "True" || o === "TRUE") || s === 5 && (o === "false" || o === "False" || o === "FALSE");
  }
  function r(o) {
    return o === "true" || o === "True" || o === "TRUE";
  }
  function l(o) {
    return Object.prototype.toString.call(o) === "[object Boolean]";
  }
  return An = new t("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: n,
    construct: r,
    predicate: l,
    represent: {
      lowercase: function(o) {
        return o ? "true" : "false";
      },
      uppercase: function(o) {
        return o ? "TRUE" : "FALSE";
      },
      camelcase: function(o) {
        return o ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), An;
}
var _n, ci;
function Fi() {
  if (ci) return _n;
  ci = 1;
  const t = Ne(), n = H();
  function r(p) {
    return p >= 48 && p <= 57 || p >= 65 && p <= 70 || p >= 97 && p <= 102;
  }
  function l(p) {
    return p >= 48 && p <= 55;
  }
  function o(p) {
    return p >= 48 && p <= 57;
  }
  function s(p) {
    if (p === null) return !1;
    const f = p.length;
    let _ = 0, k = !1;
    if (!f) return !1;
    let N = p[_];
    if ((N === "-" || N === "+") && (N = p[++_]), N === "0") {
      if (_ + 1 === f) return !0;
      if (N = p[++_], N === "b") {
        for (_++; _ < f; _++) {
          if (N = p[_], N !== "0" && N !== "1") return !1;
          k = !0;
        }
        return k && isFinite(c(p));
      }
      if (N === "x") {
        for (_++; _ < f; _++) {
          if (!r(p.charCodeAt(_))) return !1;
          k = !0;
        }
        return k && isFinite(c(p));
      }
      if (N === "o") {
        for (_++; _ < f; _++) {
          if (!l(p.charCodeAt(_))) return !1;
          k = !0;
        }
        return k && isFinite(c(p));
      }
    }
    for (; _ < f; _++) {
      if (!o(p.charCodeAt(_)))
        return !1;
      k = !0;
    }
    return k ? isFinite(c(p)) : !1;
  }
  function c(p) {
    let f = p, _ = 1, k = f[0];
    if ((k === "-" || k === "+") && (k === "-" && (_ = -1), f = f.slice(1), k = f[0]), f === "0") return 0;
    if (k === "0") {
      if (f[1] === "b") return _ * parseInt(f.slice(2), 2);
      if (f[1] === "x") return _ * parseInt(f.slice(2), 16);
      if (f[1] === "o") return _ * parseInt(f.slice(2), 8);
    }
    return _ * parseInt(f, 10);
  }
  function d(p) {
    return c(p);
  }
  function g(p) {
    return Object.prototype.toString.call(p) === "[object Number]" && p % 1 === 0 && !t.isNegativeZero(p);
  }
  return _n = new n("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: s,
    construct: d,
    predicate: g,
    represent: {
      binary: function(p) {
        return p >= 0 ? "0b" + p.toString(2) : "-0b" + p.toString(2).slice(1);
      },
      octal: function(p) {
        return p >= 0 ? "0o" + p.toString(8) : "-0o" + p.toString(8).slice(1);
      },
      decimal: function(p) {
        return p.toString(10);
      },
      hexadecimal: function(p) {
        return p >= 0 ? "0x" + p.toString(16).toUpperCase() : "-0x" + p.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), _n;
}
var xn, ui;
function qi() {
  if (ui) return xn;
  ui = 1;
  const t = Ne(), n = H(), r = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), l = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function o(p) {
    return p === null || !r.test(p) ? !1 : isFinite(parseFloat(p, 10)) ? !0 : l.test(p);
  }
  function s(p) {
    let f = p.toLowerCase();
    const _ = f[0] === "-" ? -1 : 1;
    return "+-".indexOf(f[0]) >= 0 && (f = f.slice(1)), f === ".inf" ? _ === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : f === ".nan" ? NaN : _ * parseFloat(f, 10);
  }
  const c = /^[-+]?[0-9]+e/;
  function d(p, f) {
    if (isNaN(p))
      switch (f) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === p)
      switch (f) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === p)
      switch (f) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (t.isNegativeZero(p))
      return "-0.0";
    const _ = p.toString(10);
    return c.test(_) ? _.replace("e", ".e") : _;
  }
  function g(p) {
    return Object.prototype.toString.call(p) === "[object Number]" && (p % 1 !== 0 || t.isNegativeZero(p));
  }
  return xn = new n("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: o,
    construct: s,
    predicate: g,
    represent: d,
    defaultStyle: "lowercase"
  }), xn;
}
var vn, ai;
function Ui() {
  return ai || (ai = 1, vn = Ri().extend({
    implicit: [
      Pi(),
      Di(),
      Fi(),
      qi()
    ]
  })), vn;
}
var $n, pi;
function Hi() {
  return pi || (pi = 1, $n = Ui()), $n;
}
var wn, di;
function Yi() {
  if (di) return wn;
  di = 1;
  const t = H(), n = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), r = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function l(c) {
    return c === null ? !1 : n.exec(c) !== null || r.exec(c) !== null;
  }
  function o(c) {
    let d = 0, g = null, p = n.exec(c);
    if (p === null && (p = r.exec(c)), p === null) throw new Error("Date resolve error");
    const f = +p[1], _ = +p[2] - 1, k = +p[3];
    if (!p[4])
      return new Date(Date.UTC(f, _, k));
    const N = +p[4], B = +p[5], P = +p[6];
    if (p[7]) {
      for (d = p[7].slice(0, 3); d.length < 3; )
        d += "0";
      d = +d;
    }
    if (p[9]) {
      const re = +p[10], Y = +(p[11] || 0);
      g = (re * 60 + Y) * 6e4, p[9] === "-" && (g = -g);
    }
    const z = new Date(Date.UTC(f, _, k, N, B, P, d));
    return g && z.setTime(z.getTime() - g), z;
  }
  function s(c) {
    return c.toISOString();
  }
  return wn = new t("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: l,
    construct: o,
    instanceOf: Date,
    represent: s
  }), wn;
}
var Sn, fi;
function ji() {
  if (fi) return Sn;
  fi = 1;
  const t = H();
  function n(r) {
    return r === "<<" || r === null;
  }
  return Sn = new t("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: n
  }), Sn;
}
var Cn, hi;
function Bi() {
  if (hi) return Cn;
  hi = 1;
  const t = H(), n = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(c) {
    if (c === null) return !1;
    let d = 0;
    const g = c.length, p = n;
    for (let f = 0; f < g; f++) {
      const _ = p.indexOf(c.charAt(f));
      if (!(_ > 64)) {
        if (_ < 0) return !1;
        d += 6;
      }
    }
    return d % 8 === 0;
  }
  function l(c) {
    const d = c.replace(/[\r\n=]/g, ""), g = d.length, p = n;
    let f = 0;
    const _ = [];
    for (let N = 0; N < g; N++)
      N % 4 === 0 && N && (_.push(f >> 16 & 255), _.push(f >> 8 & 255), _.push(f & 255)), f = f << 6 | p.indexOf(d.charAt(N));
    const k = g % 4 * 6;
    return k === 0 ? (_.push(f >> 16 & 255), _.push(f >> 8 & 255), _.push(f & 255)) : k === 18 ? (_.push(f >> 10 & 255), _.push(f >> 2 & 255)) : k === 12 && _.push(f >> 4 & 255), new Uint8Array(_);
  }
  function o(c) {
    let d = "", g = 0;
    const p = c.length, f = n;
    for (let k = 0; k < p; k++)
      k % 3 === 0 && k && (d += f[g >> 18 & 63], d += f[g >> 12 & 63], d += f[g >> 6 & 63], d += f[g & 63]), g = (g << 8) + c[k];
    const _ = p % 3;
    return _ === 0 ? (d += f[g >> 18 & 63], d += f[g >> 12 & 63], d += f[g >> 6 & 63], d += f[g & 63]) : _ === 2 ? (d += f[g >> 10 & 63], d += f[g >> 4 & 63], d += f[g << 2 & 63], d += f[64]) : _ === 1 && (d += f[g >> 2 & 63], d += f[g << 4 & 63], d += f[64], d += f[64]), d;
  }
  function s(c) {
    return Object.prototype.toString.call(c) === "[object Uint8Array]";
  }
  return Cn = new t("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: l,
    predicate: s,
    represent: o
  }), Cn;
}
var En, mi;
function Ki() {
  if (mi) return En;
  mi = 1;
  const t = H(), n = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function l(s) {
    if (s === null) return !0;
    const c = {}, d = s;
    for (let g = 0, p = d.length; g < p; g += 1) {
      const f = d[g];
      let _ = !1;
      if (r.call(f) !== "[object Object]") return !1;
      let k;
      for (k in f)
        if (n.call(f, k))
          if (!_) _ = !0;
          else return !1;
      if (!_ || n.call(c, k)) return !1;
      Object.defineProperty(c, k, { value: !0 });
    }
    return !0;
  }
  function o(s) {
    return s !== null ? s : [];
  }
  return En = new t("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: l,
    construct: o
  }), En;
}
var Tn, gi;
function zi() {
  if (gi) return Tn;
  gi = 1;
  const t = H(), n = Object.prototype.toString;
  function r(o) {
    if (o === null) return !0;
    const s = o, c = new Array(s.length);
    for (let d = 0, g = s.length; d < g; d += 1) {
      const p = s[d];
      if (n.call(p) !== "[object Object]") return !1;
      const f = Object.keys(p);
      if (f.length !== 1) return !1;
      c[d] = [f[0], p[f[0]]];
    }
    return !0;
  }
  function l(o) {
    if (o === null) return [];
    const s = o, c = new Array(s.length);
    for (let d = 0, g = s.length; d < g; d += 1) {
      const p = s[d], f = Object.keys(p);
      c[d] = [f[0], p[f[0]]];
    }
    return c;
  }
  return Tn = new t("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: l
  }), Tn;
}
var kn, yi;
function Wi() {
  if (yi) return kn;
  yi = 1;
  const t = H(), n = Object.prototype.hasOwnProperty;
  function r(o) {
    if (o === null) return !0;
    const s = o;
    for (const c in s)
      if (n.call(s, c) && s[c] !== null)
        return !1;
    return !0;
  }
  function l(o) {
    return o !== null ? o : {};
  }
  return kn = new t("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: l
  }), kn;
}
var On, bi;
function Fn() {
  return bi || (bi = 1, On = Hi().extend({
    implicit: [
      Yi(),
      ji()
    ],
    explicit: [
      Bi(),
      Ki(),
      zi(),
      Wi()
    ]
  })), On;
}
var Ai;
function vt() {
  if (Ai) return ze;
  Ai = 1;
  const t = Ne(), n = Ie(), r = xt(), l = Fn(), o = Object.prototype.hasOwnProperty, s = 1, c = 2, d = 3, g = 4, p = 1, f = 2, _ = 3, k = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, N = /[\x85\u2028\u2029]/, B = /[,\[\]{}]/, P = /^(?:!|!!|![0-9A-Za-z-]+!)$/, z = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function re(e) {
    return Object.prototype.toString.call(e);
  }
  function Y(e) {
    return e === 10 || e === 13;
  }
  function j(e) {
    return e === 9 || e === 32;
  }
  function q(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function ee(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function Xe(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const u = e | 32;
    return u >= 97 && u <= 102 ? u - 97 + 10 : -1;
  }
  function en(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function Me(e) {
    return e >= 48 && e <= 57 ? e - 48 : -1;
  }
  function ye(e) {
    switch (e) {
      case 48:
        return "\0";
      case 97:
        return "\x07";
      case 98:
        return "\b";
      case 116:
        return "	";
      case 9:
        return "	";
      case 110:
        return `
`;
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 114:
        return "\r";
      case 101:
        return "\x1B";
      case 32:
        return " ";
      case 34:
        return '"';
      case 47:
        return "/";
      case 92:
        return "\\";
      case 78:
        return "";
      case 95:
        return " ";
      case 76:
        return "\u2028";
      case 80:
        return "\u2029";
      default:
        return "";
    }
  }
  function nn(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function be(e, u, m) {
    u === "__proto__" ? Object.defineProperty(e, u, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: m
    }) : e[u] = m;
  }
  const Le = new Array(256), Ae = new Array(256);
  for (let e = 0; e < 256; e++)
    Le[e] = ye(e) ? 1 : 0, Ae[e] = ye(e);
  function F(e, u) {
    this.input = e, this.filename = u.filename || null, this.schema = u.schema || l, this.onWarning = u.onWarning || null, this.legacy = u.legacy || !1, this.json = u.json || !1, this.listener = u.listener || null, this.maxDepth = typeof u.maxDepth == "number" ? u.maxDepth : 100, this.maxTotalMergeKeys = typeof u.maxTotalMergeKeys == "number" ? u.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function Re(e, u) {
    const m = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return m.snippet = r(m), new n(u, m);
  }
  function E(e, u) {
    throw Re(e, u);
  }
  function ae(e, u) {
    e.onWarning && e.onWarning.call(null, Re(e, u));
  }
  function G(e, u, m) {
    const A = e.anchorMapTransactions;
    if (A.length !== 0) {
      const h = A[A.length - 1];
      o.call(h, u) || (h[u] = {
        existed: o.call(e.anchorMap, u),
        value: e.anchorMap[u]
      });
    }
    e.anchorMap[u] = m;
  }
  function tn(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function oe(e) {
    const u = e.anchorMapTransactions.pop(), m = e.anchorMapTransactions;
    if (m.length === 0) return;
    const A = m[m.length - 1], h = Object.keys(u);
    for (let w = 0, i = h.length; w < i; w += 1) {
      const a = h[w];
      o.call(A, a) || (A[a] = u[a]);
    }
  }
  function rn(e) {
    const u = e.anchorMapTransactions.pop(), m = Object.keys(u);
    for (let A = m.length - 1; A >= 0; A -= 1) {
      const h = u[m[A]];
      h.existed ? e.anchorMap[m[A]] = h.value : delete e.anchorMap[m[A]];
    }
  }
  function _e(e) {
    return {
      position: e.position,
      line: e.line,
      lineStart: e.lineStart,
      lineIndent: e.lineIndent,
      firstTabInLine: e.firstTabInLine,
      tag: e.tag,
      anchor: e.anchor,
      kind: e.kind,
      result: e.result
    };
  }
  function pe(e, u) {
    e.position = u.position, e.line = u.line, e.lineStart = u.lineStart, e.lineIndent = u.lineIndent, e.firstTabInLine = u.firstTabInLine, e.tag = u.tag, e.anchor = u.anchor, e.kind = u.kind, e.result = u.result;
  }
  const Pe = {
    YAML: function(u, m, A) {
      u.version !== null && E(u, "duplication of %YAML directive"), A.length !== 1 && E(u, "YAML directive accepts exactly one argument");
      const h = /^([0-9]+)\.([0-9]+)$/.exec(A[0]);
      h === null && E(u, "ill-formed argument of the YAML directive");
      const w = parseInt(h[1], 10), i = parseInt(h[2], 10);
      w !== 1 && E(u, "unacceptable YAML version of the document"), u.version = A[0], u.checkLineBreaks = i < 2, i !== 1 && i !== 2 && ae(u, "unsupported YAML version of the document");
    },
    TAG: function(u, m, A) {
      let h;
      A.length !== 2 && E(u, "TAG directive accepts exactly two arguments");
      const w = A[0];
      h = A[1], P.test(w) || E(u, "ill-formed tag handle (first argument) of the TAG directive"), o.call(u.tagMap, w) && E(u, 'there is a previously declared suffix for "' + w + '" tag handle'), z.test(h) || E(u, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        h = decodeURIComponent(h);
      } catch {
        E(u, "tag prefix is malformed: " + h);
      }
      u.tagMap[w] = h;
    }
  };
  function K(e, u, m, A) {
    if (u < m) {
      const h = e.input.slice(u, m);
      if (A)
        for (let w = 0, i = h.length; w < i; w += 1) {
          const a = h.charCodeAt(w);
          a === 9 || a >= 32 && a <= 1114111 || E(e, "expected valid JSON character");
        }
      else k.test(h) && E(e, "the stream contains non-printable characters");
      e.result += h;
    }
  }
  function ne(e, u, m, A) {
    t.isObject(m) || E(e, "cannot merge mappings; the provided source object is unacceptable");
    const h = Object.keys(m);
    for (let w = 0, i = h.length; w < i; w += 1) {
      const a = h[w];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && E(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), o.call(u, a) || (be(u, a, m[a]), A[a] = !0);
    }
  }
  function J(e, u, m, A, h, w, i, a, v) {
    if (Array.isArray(h)) {
      h = Array.prototype.slice.call(h);
      for (let y = 0, b = h.length; y < b; y += 1)
        Array.isArray(h[y]) && E(e, "nested arrays are not supported inside keys"), typeof h == "object" && re(h[y]) === "[object Object]" && (h[y] = "[object Object]");
    }
    if (typeof h == "object" && re(h) === "[object Object]" && (h = "[object Object]"), h = String(h), u === null && (u = {}), A === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let y = 0, b = w.length; y < b; y += 1)
          ne(e, u, w[y], m);
      else
        ne(e, u, w, m);
    else
      !e.json && !o.call(m, h) && o.call(u, h) && (e.line = i || e.line, e.lineStart = a || e.lineStart, e.position = v || e.position, E(e, "duplicated mapping key")), be(u, h, w), delete m[h];
    return u;
  }
  function de(e) {
    const u = e.input.charCodeAt(e.position);
    u === 10 ? e.position++ : u === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : E(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function D(e, u, m) {
    let A = 0, h = e.input.charCodeAt(e.position);
    for (; h !== 0; ) {
      for (; j(h); )
        h === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), h = e.input.charCodeAt(++e.position);
      if (u && h === 35)
        do
          h = e.input.charCodeAt(++e.position);
        while (h !== 10 && h !== 13 && h !== 0);
      if (Y(h))
        for (de(e), h = e.input.charCodeAt(e.position), A++, e.lineIndent = 0; h === 32; )
          e.lineIndent++, h = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return m !== -1 && A !== 0 && e.lineIndent < m && ae(e, "deficient indentation"), A;
  }
  function fe(e) {
    let u = e.position, m = e.input.charCodeAt(u);
    return !!((m === 45 || m === 46) && m === e.input.charCodeAt(u + 1) && m === e.input.charCodeAt(u + 2) && (u += 3, m = e.input.charCodeAt(u), m === 0 || q(m)));
  }
  function V(e, u) {
    u === 1 ? e.result += " " : u > 1 && (e.result += t.repeat(`
`, u - 1));
  }
  function De(e, u, m) {
    let A, h, w, i, a, v;
    const y = e.kind, b = e.result;
    let $ = e.input.charCodeAt(e.position);
    if (q($) || ee($) || $ === 35 || $ === 38 || $ === 42 || $ === 33 || $ === 124 || $ === 62 || $ === 39 || $ === 34 || $ === 37 || $ === 64 || $ === 96)
      return !1;
    if ($ === 63 || $ === 45) {
      const x = e.input.charCodeAt(e.position + 1);
      if (q(x) || m && ee(x))
        return !1;
    }
    for (e.kind = "scalar", e.result = "", A = h = e.position, w = !1; $ !== 0; ) {
      if ($ === 58) {
        const x = e.input.charCodeAt(e.position + 1);
        if (q(x) || m && ee(x))
          break;
      } else if ($ === 35) {
        const x = e.input.charCodeAt(e.position - 1);
        if (q(x))
          break;
      } else {
        if (e.position === e.lineStart && fe(e) || m && ee($))
          break;
        if (Y($))
          if (i = e.line, a = e.lineStart, v = e.lineIndent, D(e, !1, -1), e.lineIndent >= u) {
            w = !0, $ = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = h, e.line = i, e.lineStart = a, e.lineIndent = v;
            break;
          }
      }
      w && (K(e, A, h, !1), V(e, e.line - i), A = h = e.position, w = !1), j($) || (h = e.position + 1), $ = e.input.charCodeAt(++e.position);
    }
    return K(e, A, h, !1), e.result ? !0 : (e.kind = y, e.result = b, !1);
  }
  function Fe(e, u) {
    let m, A, h = e.input.charCodeAt(e.position);
    if (h !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, m = A = e.position; (h = e.input.charCodeAt(e.position)) !== 0; )
      if (h === 39)
        if (K(e, m, e.position, !0), h = e.input.charCodeAt(++e.position), h === 39)
          m = e.position, e.position++, A = e.position;
        else
          return !0;
      else Y(h) ? (K(e, m, A, !0), V(e, D(e, !1, u)), m = A = e.position) : e.position === e.lineStart && fe(e) ? E(e, "unexpected end of the document within a single quoted scalar") : (e.position++, j(h) || (A = e.position));
    E(e, "unexpected end of the stream within a single quoted scalar");
  }
  function xe(e, u) {
    let m, A, h, w = e.input.charCodeAt(e.position);
    if (w !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, m = A = e.position; (w = e.input.charCodeAt(e.position)) !== 0; ) {
      if (w === 34)
        return K(e, m, e.position, !0), e.position++, !0;
      if (w === 92) {
        if (K(e, m, e.position, !0), w = e.input.charCodeAt(++e.position), Y(w))
          D(e, !1, u);
        else if (w < 256 && Le[w])
          e.result += Ae[w], e.position++;
        else if ((h = en(w)) > 0) {
          let i = h, a = 0;
          for (; i > 0; i--)
            w = e.input.charCodeAt(++e.position), (h = Xe(w)) >= 0 ? a = (a << 4) + h : E(e, "expected hexadecimal character");
          e.result += nn(a), e.position++;
        } else
          E(e, "unknown escape sequence");
        m = A = e.position;
      } else Y(w) ? (K(e, m, A, !0), V(e, D(e, !1, u)), m = A = e.position) : e.position === e.lineStart && fe(e) ? E(e, "unexpected end of the document within a double quoted scalar") : (e.position++, j(w) || (A = e.position));
    }
    E(e, "unexpected end of the stream within a double quoted scalar");
  }
  function qe(e, u) {
    let m = !0, A, h, w;
    const i = e.tag;
    let a;
    const v = e.anchor;
    let y, b, $, x;
    const C = /* @__PURE__ */ Object.create(null);
    let S, T, O, I = e.input.charCodeAt(e.position);
    if (I === 91)
      y = 93, x = !1, a = [];
    else if (I === 123)
      y = 125, x = !0, a = {};
    else
      return !1;
    for (e.anchor !== null && G(e, e.anchor, a), I = e.input.charCodeAt(++e.position); I !== 0; ) {
      if (D(e, !0, u), I = e.input.charCodeAt(e.position), I === y)
        return e.position++, e.tag = i, e.anchor = v, e.kind = x ? "mapping" : "sequence", e.result = a, !0;
      if (m ? I === 44 && E(e, "expected the node content, but found ','") : E(e, "missed comma between flow collection entries"), T = S = O = null, b = $ = !1, I === 63) {
        const L = e.input.charCodeAt(e.position + 1);
        q(L) && (b = $ = !0, e.position++, D(e, !0, u));
      }
      A = e.line, h = e.lineStart, w = e.position, Z(e, u, s, !1, !0), T = e.tag, S = e.result, D(e, !0, u), I = e.input.charCodeAt(e.position), ($ || e.line === A) && I === 58 && (b = !0, I = e.input.charCodeAt(++e.position), D(e, !0, u), Z(e, u, s, !1, !0), O = e.result), x ? J(e, a, C, T, S, O, A, h, w) : b ? a.push(J(e, null, C, T, S, O, A, h, w)) : a.push(S), D(e, !0, u), I = e.input.charCodeAt(e.position), I === 44 ? (m = !0, I = e.input.charCodeAt(++e.position)) : m = !1;
    }
    E(e, "unexpected end of the stream within a flow collection");
  }
  function Ue(e, u) {
    let m, A = p, h = !1, w = !1, i = u, a = 0, v = !1, y, b = e.input.charCodeAt(e.position);
    if (b === 124)
      m = !1;
    else if (b === 62)
      m = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; b !== 0; )
      if (b = e.input.charCodeAt(++e.position), b === 43 || b === 45)
        p === A ? A = b === 43 ? _ : f : E(e, "repeat of a chomping mode identifier");
      else if ((y = Me(b)) >= 0)
        y === 0 ? E(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : w ? E(e, "repeat of an indentation width identifier") : (i = u + y - 1, w = !0);
      else
        break;
    if (j(b)) {
      do
        b = e.input.charCodeAt(++e.position);
      while (j(b));
      if (b === 35)
        do
          b = e.input.charCodeAt(++e.position);
        while (!Y(b) && b !== 0);
    }
    for (; b !== 0; ) {
      for (de(e), e.lineIndent = 0, b = e.input.charCodeAt(e.position); (!w || e.lineIndent < i) && b === 32; )
        e.lineIndent++, b = e.input.charCodeAt(++e.position);
      if (!w && e.lineIndent > i && (i = e.lineIndent), Y(b)) {
        a++;
        continue;
      }
      if (!w && i === 0 && E(e, "missing indentation for block scalar"), e.lineIndent < i) {
        A === _ ? e.result += t.repeat(`
`, h ? 1 + a : a) : A === p && h && (e.result += `
`);
        break;
      }
      m ? j(b) ? (v = !0, e.result += t.repeat(`
`, h ? 1 + a : a)) : v ? (v = !1, e.result += t.repeat(`
`, a + 1)) : a === 0 ? h && (e.result += " ") : e.result += t.repeat(`
`, a) : e.result += t.repeat(`
`, h ? 1 + a : a), h = !0, w = !0, a = 0;
      const $ = e.position;
      for (; !Y(b) && b !== 0; )
        b = e.input.charCodeAt(++e.position);
      K(e, $, e.position, !1);
    }
    return !0;
  }
  function Q(e, u) {
    const m = e.tag, A = e.anchor, h = [];
    let w = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && G(e, e.anchor, h);
    let i = e.input.charCodeAt(e.position);
    for (; i !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation")), i === 45); ) {
      const a = e.input.charCodeAt(e.position + 1);
      if (!q(a))
        break;
      if (w = !0, e.position++, D(e, !0, -1) && e.lineIndent <= u) {
        h.push(null), i = e.input.charCodeAt(e.position);
        continue;
      }
      const v = e.line;
      if (Z(e, u, d, !1, !0), h.push(e.result), D(e, !0, -1), i = e.input.charCodeAt(e.position), (e.line === v || e.lineIndent > u) && i !== 0)
        E(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < u)
        break;
    }
    return w ? (e.tag = m, e.anchor = A, e.kind = "sequence", e.result = h, !0) : !1;
  }
  function He(e, u, m) {
    let A, h, w, i;
    const a = e.tag, v = e.anchor, y = {}, b = /* @__PURE__ */ Object.create(null);
    let $ = null, x = null, C = null, S = !1, T = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && G(e, e.anchor, y);
    let O = e.input.charCodeAt(e.position);
    for (; O !== 0; ) {
      !S && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation"));
      const I = e.input.charCodeAt(e.position + 1), L = e.line;
      if ((O === 63 || O === 58) && q(I))
        O === 63 ? (S && (J(e, y, b, $, x, null, h, w, i), $ = x = C = null), T = !0, S = !0, A = !0) : S ? (S = !1, A = !0) : E(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, O = I;
      else {
        if (h = e.line, w = e.lineStart, i = e.position, !Z(e, m, c, !1, !0))
          break;
        if (e.line === L) {
          for (O = e.input.charCodeAt(e.position); j(O); )
            O = e.input.charCodeAt(++e.position);
          if (O === 58)
            O = e.input.charCodeAt(++e.position), q(O) || E(e, "a whitespace character is expected after the key-value separator within a block mapping"), S && (J(e, y, b, $, x, null, h, w, i), $ = x = C = null), T = !0, S = !1, A = !1, $ = e.tag, x = e.result;
          else if (T)
            E(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = a, e.anchor = v, !0;
        } else if (T)
          E(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = a, e.anchor = v, !0;
      }
      if ((e.line === L || e.lineIndent > u) && (S && (h = e.line, w = e.lineStart, i = e.position), Z(e, u, g, !0, A) && (S ? x = e.result : C = e.result), S || (J(e, y, b, $, x, C, h, w, i), $ = x = C = null), D(e, !0, -1), O = e.input.charCodeAt(e.position)), (e.line === L || e.lineIndent > u) && O !== 0)
        E(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < u)
        break;
    }
    return S && J(e, y, b, $, x, null, h, w, i), T && (e.tag = a, e.anchor = v, e.kind = "mapping", e.result = y), T;
  }
  function on(e) {
    let u = !1, m = !1, A, h, w = e.input.charCodeAt(e.position);
    if (w !== 33) return !1;
    e.tag !== null && E(e, "duplication of a tag property"), w = e.input.charCodeAt(++e.position), w === 60 ? (u = !0, w = e.input.charCodeAt(++e.position)) : w === 33 ? (m = !0, A = "!!", w = e.input.charCodeAt(++e.position)) : A = "!";
    let i = e.position;
    if (u) {
      do
        w = e.input.charCodeAt(++e.position);
      while (w !== 0 && w !== 62);
      e.position < e.length ? (h = e.input.slice(i, e.position), w = e.input.charCodeAt(++e.position)) : E(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; w !== 0 && !q(w); )
        w === 33 && (m ? E(e, "tag suffix cannot contain exclamation marks") : (A = e.input.slice(i - 1, e.position + 1), P.test(A) || E(e, "named tag handle cannot contain such characters"), m = !0, i = e.position + 1)), w = e.input.charCodeAt(++e.position);
      h = e.input.slice(i, e.position), B.test(h) && E(e, "tag suffix cannot contain flow indicator characters");
    }
    h && !z.test(h) && E(e, "tag name cannot contain such characters: " + h);
    try {
      h = decodeURIComponent(h);
    } catch {
      E(e, "tag name is malformed: " + h);
    }
    return u ? e.tag = h : o.call(e.tagMap, A) ? e.tag = e.tagMap[A] + h : A === "!" ? e.tag = "!" + h : A === "!!" ? e.tag = "tag:yaml.org,2002:" + h : E(e, 'undeclared tag handle "' + A + '"'), !0;
  }
  function Ye(e) {
    let u = e.input.charCodeAt(e.position);
    if (u !== 38) return !1;
    e.anchor !== null && E(e, "duplication of an anchor property"), u = e.input.charCodeAt(++e.position);
    const m = e.position;
    for (; u !== 0 && !q(u) && !ee(u); )
      u = e.input.charCodeAt(++e.position);
    return e.position === m && E(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(m, e.position), !0;
  }
  function je(e) {
    let u = e.input.charCodeAt(e.position);
    if (u !== 42) return !1;
    u = e.input.charCodeAt(++e.position);
    const m = e.position;
    for (; u !== 0 && !q(u) && !ee(u); )
      u = e.input.charCodeAt(++e.position);
    e.position === m && E(e, "name of an alias node must contain at least one character");
    const A = e.input.slice(m, e.position);
    return o.call(e.anchorMap, A) || E(e, 'unidentified alias "' + A + '"'), e.result = e.anchorMap[A], D(e, !0, -1), !0;
  }
  function ln(e, u, m, A) {
    const h = _e(e);
    return tn(e), pe(e, u), e.tag = null, e.anchor = null, e.kind = null, e.result = null, He(e, m, A) && e.kind === "mapping" ? (oe(e), !0) : (rn(e), pe(e, h), !1);
  }
  function Z(e, u, m, A, h) {
    let w, i, a = 1, v = !1, y = !1, b = null, $, x, C;
    e.depth >= e.maxDepth && E(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const S = w = i = g === m || d === m;
    if (A && D(e, !0, -1) && (v = !0, e.lineIndent > u ? a = 1 : e.lineIndent === u ? a = 0 : e.lineIndent < u && (a = -1)), a === 1)
      for (; ; ) {
        const T = e.input.charCodeAt(e.position), O = _e(e);
        if (v && (T === 33 && e.tag !== null || T === 38 && e.anchor !== null) || !on(e) && !Ye(e))
          break;
        b === null && (b = O), D(e, !0, -1) ? (v = !0, i = S, e.lineIndent > u ? a = 1 : e.lineIndent === u ? a = 0 : e.lineIndent < u && (a = -1)) : i = !1;
      }
    if (i && (i = v || h), a === 1 || g === m)
      if (s === m || c === m ? x = u : x = u + 1, C = e.position - e.lineStart, a === 1)
        if (i && (Q(e, C) || He(e, C, x)) || qe(e, x))
          y = !0;
        else {
          const T = e.input.charCodeAt(e.position);
          b !== null && S && !i && T !== 124 && T !== 62 && ln(
            e,
            b,
            b.position - b.lineStart,
            x
          ) || w && Ue(e, x) || Fe(e, x) || xe(e, x) ? y = !0 : je(e) ? (y = !0, (e.tag !== null || e.anchor !== null) && E(e, "alias node should not have any properties")) : De(e, x, s === m) && (y = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && G(e, e.anchor, e.result);
        }
      else a === 0 && (y = i && Q(e, C));
    if (e.tag === null)
      e.anchor !== null && G(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && E(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let T = 0, O = e.implicitTypes.length; T < O; T += 1)
        if ($ = e.implicitTypes[T], $.resolve(e.result)) {
          e.result = $.construct(e.result), e.tag = $.tag, e.anchor !== null && G(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (o.call(e.typeMap[e.kind || "fallback"], e.tag))
        $ = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        $ = null;
        const T = e.typeMap.multi[e.kind || "fallback"];
        for (let O = 0, I = T.length; O < I; O += 1)
          if (e.tag.slice(0, T[O].tag.length) === T[O].tag) {
            $ = T[O];
            break;
          }
      }
      $ || E(e, "unknown tag !<" + e.tag + ">"), e.result !== null && $.kind !== e.kind && E(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + $.kind + '", not "' + e.kind + '"'), $.resolve(e.result, e.tag) ? (e.result = $.construct(e.result, e.tag), e.anchor !== null && G(e, e.anchor, e.result)) : E(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || y;
  }
  function sn(e) {
    const u = e.position;
    let m = !1, A;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (A = e.input.charCodeAt(e.position)) !== 0 && (D(e, !0, -1), A = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || A !== 37)); ) {
      m = !0, A = e.input.charCodeAt(++e.position);
      let h = e.position;
      for (; A !== 0 && !q(A); )
        A = e.input.charCodeAt(++e.position);
      const w = e.input.slice(h, e.position), i = [];
      for (w.length < 1 && E(e, "directive name must not be less than one character in length"); A !== 0; ) {
        for (; j(A); )
          A = e.input.charCodeAt(++e.position);
        if (A === 35) {
          do
            A = e.input.charCodeAt(++e.position);
          while (A !== 0 && !Y(A));
          break;
        }
        if (Y(A)) break;
        for (h = e.position; A !== 0 && !q(A); )
          A = e.input.charCodeAt(++e.position);
        i.push(e.input.slice(h, e.position));
      }
      A !== 0 && de(e), o.call(Pe, w) ? Pe[w](e, w, i) : ae(e, 'unknown document directive "' + w + '"');
    }
    if (D(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, D(e, !0, -1)) : m && E(e, "directives end mark is expected"), Z(e, e.lineIndent - 1, g, !1, !0), D(e, !0, -1), e.checkLineBreaks && N.test(e.input.slice(u, e.position)) && ae(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && fe(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, D(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && E(e, "end of the stream or a document separator is expected");
  }
  function Be(e, u) {
    e = String(e), u = u || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const m = new F(e, u), A = e.indexOf("\0");
    for (A !== -1 && (m.position = A, E(m, "null byte is not allowed in input")), m.input += "\0"; m.input.charCodeAt(m.position) === 32; )
      m.lineIndent += 1, m.position += 1;
    for (; m.position < m.length - 1; )
      sn(m);
    return m.documents;
  }
  function Ke(e, u, m) {
    u !== null && typeof u == "object" && typeof m > "u" && (m = u, u = null);
    const A = Be(e, m);
    if (typeof u != "function")
      return A;
    for (let h = 0, w = A.length; h < w; h += 1)
      u(A[h]);
  }
  function cn(e, u) {
    const m = Be(e, u);
    if (m.length !== 0) {
      if (m.length === 1)
        return m[0];
      throw new n("expected a single document in the stream, but found more");
    }
  }
  return ze.loadAll = Ke, ze.load = cn, ze;
}
var Nn = {}, _i;
function $t() {
  if (_i) return Nn;
  _i = 1;
  const t = Ne(), n = Ie(), r = Fn(), l = Object.prototype.toString, o = Object.prototype.hasOwnProperty, s = 65279, c = 9, d = 10, g = 13, p = 32, f = 33, _ = 34, k = 35, N = 37, B = 38, P = 39, z = 42, re = 44, Y = 45, j = 58, q = 61, ee = 62, Xe = 63, en = 64, Me = 91, ye = 93, nn = 96, be = 123, Le = 124, Ae = 125, F = {};
  F[0] = "\\0", F[7] = "\\a", F[8] = "\\b", F[9] = "\\t", F[10] = "\\n", F[11] = "\\v", F[12] = "\\f", F[13] = "\\r", F[27] = "\\e", F[34] = '\\"', F[92] = "\\\\", F[133] = "\\N", F[160] = "\\_", F[8232] = "\\L", F[8233] = "\\P";
  const Re = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], E = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function ae(i, a) {
    if (a === null) return {};
    const v = {}, y = Object.keys(a);
    for (let b = 0, $ = y.length; b < $; b += 1) {
      let x = y[b], C = String(a[x]);
      x.slice(0, 2) === "!!" && (x = "tag:yaml.org,2002:" + x.slice(2));
      const S = i.compiledTypeMap.fallback[x];
      S && o.call(S.styleAliases, C) && (C = S.styleAliases[C]), v[x] = C;
    }
    return v;
  }
  function G(i) {
    let a, v;
    const y = i.toString(16).toUpperCase();
    if (i <= 255)
      a = "x", v = 2;
    else if (i <= 65535)
      a = "u", v = 4;
    else if (i <= 4294967295)
      a = "U", v = 8;
    else
      throw new n("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + a + t.repeat("0", v - y.length) + y;
  }
  const tn = 1, oe = 2;
  function rn(i) {
    this.schema = i.schema || r, this.indent = Math.max(1, i.indent || 2), this.noArrayIndent = i.noArrayIndent || !1, this.skipInvalid = i.skipInvalid || !1, this.flowLevel = t.isNothing(i.flowLevel) ? -1 : i.flowLevel, this.styleMap = ae(this.schema, i.styles || null), this.sortKeys = i.sortKeys || !1, this.lineWidth = i.lineWidth || 80, this.noRefs = i.noRefs || !1, this.noCompatMode = i.noCompatMode || !1, this.condenseFlow = i.condenseFlow || !1, this.quotingType = i.quotingType === '"' ? oe : tn, this.forceQuotes = i.forceQuotes || !1, this.replacer = typeof i.replacer == "function" ? i.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function _e(i, a) {
    const v = t.repeat(" ", a);
    let y = 0, b = "";
    const $ = i.length;
    for (; y < $; ) {
      let x;
      const C = i.indexOf(`
`, y);
      C === -1 ? (x = i.slice(y), y = $) : (x = i.slice(y, C + 1), y = C + 1), x.length && x !== `
` && (b += v), b += x;
    }
    return b;
  }
  function pe(i, a) {
    return `
` + t.repeat(" ", i.indent * a);
  }
  function Pe(i, a) {
    for (let v = 0, y = i.implicitTypes.length; v < y; v += 1)
      if (i.implicitTypes[v].resolve(a))
        return !0;
    return !1;
  }
  function K(i) {
    return i === p || i === c;
  }
  function ne(i) {
    return i >= 32 && i <= 126 || i >= 161 && i <= 55295 && i !== 8232 && i !== 8233 || i >= 57344 && i <= 65533 && i !== s || i >= 65536 && i <= 1114111;
  }
  function J(i) {
    return ne(i) && i !== s && // - b-char
    i !== g && i !== d;
  }
  function de(i, a, v) {
    const y = J(i), b = y && !K(i);
    return (
      // ns-plain-safe
      (v ? y : y && // - c-flow-indicator
      i !== re && i !== Me && i !== ye && i !== be && i !== Ae) && // ns-plain-char
      i !== k && // false on '#'
      !(a === j && !b) || // false on ': '
      J(a) && !K(a) && i === k || // change to true on '[^ ]#'
      a === j && b
    );
  }
  function D(i) {
    return ne(i) && i !== s && !K(i) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    i !== Y && i !== Xe && i !== j && i !== re && i !== Me && i !== ye && i !== be && i !== Ae && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    i !== k && i !== B && i !== z && i !== f && i !== Le && i !== q && i !== ee && i !== P && i !== _ && // | “%” | “@” | “`”)
    i !== N && i !== en && i !== nn;
  }
  function fe(i) {
    return !K(i) && i !== j;
  }
  function V(i, a) {
    const v = i.charCodeAt(a);
    let y;
    return v >= 55296 && v <= 56319 && a + 1 < i.length && (y = i.charCodeAt(a + 1), y >= 56320 && y <= 57343) ? (v - 55296) * 1024 + y - 56320 + 65536 : v;
  }
  function De(i) {
    return /^\n* /.test(i);
  }
  const Fe = 1, xe = 2, qe = 3, Ue = 4, Q = 5;
  function He(i, a, v, y, b, $, x, C) {
    let S, T = 0, O = null, I = !1, L = !1;
    const qn = y !== -1;
    let ve = -1, $e = D(V(i, 0)) && fe(V(i, i.length - 1));
    if (a || x)
      for (S = 0; S < i.length; T >= 65536 ? S += 2 : S++) {
        if (T = V(i, S), !ne(T))
          return Q;
        $e = $e && de(T, O, C), O = T;
      }
    else {
      for (S = 0; S < i.length; T >= 65536 ? S += 2 : S++) {
        if (T = V(i, S), T === d)
          I = !0, qn && (L = L || // Foldable line = too long, and not more-indented.
          S - ve - 1 > y && i[ve + 1] !== " ", ve = S);
        else if (!ne(T))
          return Q;
        $e = $e && de(T, O, C), O = T;
      }
      L = L || qn && S - ve - 1 > y && i[ve + 1] !== " ";
    }
    return !I && !L ? $e && !x && !b(i) ? Fe : $ === oe ? Q : xe : v > 9 && De(i) ? Q : x ? $ === oe ? Q : xe : L ? Ue : qe;
  }
  function on(i, a, v, y, b) {
    i.dump = (function() {
      if (a.length === 0)
        return i.quotingType === oe ? '""' : "''";
      if (!i.noCompatMode && (Re.indexOf(a) !== -1 || E.test(a)))
        return i.quotingType === oe ? '"' + a + '"' : "'" + a + "'";
      const $ = i.indent * Math.max(1, v), x = i.lineWidth === -1 ? -1 : Math.max(Math.min(i.lineWidth, 40), i.lineWidth - $), C = y || // No block styles in flow mode.
      i.flowLevel > -1 && v >= i.flowLevel;
      function S(T) {
        return Pe(i, T);
      }
      switch (He(
        a,
        C,
        i.indent,
        x,
        S,
        i.quotingType,
        i.forceQuotes && !y,
        b
      )) {
        case Fe:
          return a;
        case xe:
          return "'" + a.replace(/'/g, "''") + "'";
        case qe:
          return "|" + Ye(a, i.indent) + je(_e(a, $));
        case Ue:
          return ">" + Ye(a, i.indent) + je(_e(ln(a, x), $));
        case Q:
          return '"' + sn(a) + '"';
        default:
          throw new n("impossible error: invalid scalar style");
      }
    })();
  }
  function Ye(i, a) {
    const v = De(i) ? String(a) : "", y = i[i.length - 1] === `
`, $ = y && (i[i.length - 2] === `
` || i === `
`) ? "+" : y ? "" : "-";
    return v + $ + `
`;
  }
  function je(i) {
    return i[i.length - 1] === `
` ? i.slice(0, -1) : i;
  }
  function ln(i, a) {
    const v = /(\n+)([^\n]*)/g;
    let y = (function() {
      let C = i.indexOf(`
`);
      return C = C !== -1 ? C : i.length, v.lastIndex = C, Z(i.slice(0, C), a);
    })(), b = i[0] === `
` || i[0] === " ", $, x;
    for (; x = v.exec(i); ) {
      const C = x[1], S = x[2];
      $ = S[0] === " ", y += C + (!b && !$ && S !== "" ? `
` : "") + Z(S, a), b = $;
    }
    return y;
  }
  function Z(i, a) {
    if (i === "" || i[0] === " ") return i;
    const v = / [^ ]/g;
    let y, b = 0, $, x = 0, C = 0, S = "";
    for (; y = v.exec(i); )
      C = y.index, C - b > a && ($ = x > b ? x : C, S += `
` + i.slice(b, $), b = $ + 1), x = C;
    return S += `
`, i.length - b > a && x > b ? S += i.slice(b, x) + `
` + i.slice(x + 1) : S += i.slice(b), S.slice(1);
  }
  function sn(i) {
    let a = "", v = 0;
    for (let y = 0; y < i.length; v >= 65536 ? y += 2 : y++) {
      v = V(i, y);
      const b = F[v];
      !b && ne(v) ? (a += i[y], v >= 65536 && (a += i[y + 1])) : a += b || G(v);
    }
    return a;
  }
  function Be(i, a, v) {
    let y = "";
    const b = i.tag;
    for (let $ = 0, x = v.length; $ < x; $ += 1) {
      let C = v[$];
      i.replacer && (C = i.replacer.call(v, String($), C)), (m(i, a, C, !1, !1) || typeof C > "u" && m(i, a, null, !1, !1)) && (y !== "" && (y += "," + (i.condenseFlow ? "" : " ")), y += i.dump);
    }
    i.tag = b, i.dump = "[" + y + "]";
  }
  function Ke(i, a, v, y) {
    let b = "";
    const $ = i.tag;
    for (let x = 0, C = v.length; x < C; x += 1) {
      let S = v[x];
      i.replacer && (S = i.replacer.call(v, String(x), S)), (m(i, a + 1, S, !0, !0, !1, !0) || typeof S > "u" && m(i, a + 1, null, !0, !0, !1, !0)) && ((!y || b !== "") && (b += pe(i, a)), i.dump && d === i.dump.charCodeAt(0) ? b += "-" : b += "- ", b += i.dump);
    }
    i.tag = $, i.dump = b || "[]";
  }
  function cn(i, a, v) {
    let y = "";
    const b = i.tag, $ = Object.keys(v);
    for (let x = 0, C = $.length; x < C; x += 1) {
      let S = "";
      y !== "" && (S += ", "), i.condenseFlow && (S += '"');
      const T = $[x];
      let O = v[T];
      i.replacer && (O = i.replacer.call(v, T, O)), m(i, a, T, !1, !1) && (i.dump.length > 1024 && (S += "? "), S += i.dump + (i.condenseFlow ? '"' : "") + ":" + (i.condenseFlow ? "" : " "), m(i, a, O, !1, !1) && (S += i.dump, y += S));
    }
    i.tag = b, i.dump = "{" + y + "}";
  }
  function e(i, a, v, y) {
    let b = "";
    const $ = i.tag, x = Object.keys(v);
    if (i.sortKeys === !0)
      x.sort();
    else if (typeof i.sortKeys == "function")
      x.sort(i.sortKeys);
    else if (i.sortKeys)
      throw new n("sortKeys must be a boolean or a function");
    for (let C = 0, S = x.length; C < S; C += 1) {
      let T = "";
      (!y || b !== "") && (T += pe(i, a));
      const O = x[C];
      let I = v[O];
      if (i.replacer && (I = i.replacer.call(v, O, I)), !m(i, a + 1, O, !0, !0, !0))
        continue;
      const L = i.tag !== null && i.tag !== "?" || i.dump && i.dump.length > 1024;
      L && (i.dump && d === i.dump.charCodeAt(0) ? T += "?" : T += "? "), T += i.dump, L && (T += pe(i, a)), m(i, a + 1, I, !0, L) && (i.dump && d === i.dump.charCodeAt(0) ? T += ":" : T += ": ", T += i.dump, b += T);
    }
    i.tag = $, i.dump = b || "{}";
  }
  function u(i, a, v) {
    const y = v ? i.explicitTypes : i.implicitTypes;
    for (let b = 0, $ = y.length; b < $; b += 1) {
      const x = y[b];
      if ((x.instanceOf || x.predicate) && (!x.instanceOf || typeof a == "object" && a instanceof x.instanceOf) && (!x.predicate || x.predicate(a))) {
        if (v ? x.multi && x.representName ? i.tag = x.representName(a) : i.tag = x.tag : i.tag = "?", x.represent) {
          const C = i.styleMap[x.tag] || x.defaultStyle;
          let S;
          if (l.call(x.represent) === "[object Function]")
            S = x.represent(a, C);
          else if (o.call(x.represent, C))
            S = x.represent[C](a, C);
          else
            throw new n("!<" + x.tag + '> tag resolver accepts not "' + C + '" style');
          i.dump = S;
        }
        return !0;
      }
    }
    return !1;
  }
  function m(i, a, v, y, b, $, x) {
    i.tag = null, i.dump = v, u(i, v, !1) || u(i, v, !0);
    const C = l.call(i.dump), S = y;
    y && (y = i.flowLevel < 0 || i.flowLevel > a);
    const T = C === "[object Object]" || C === "[object Array]";
    let O, I;
    if (T && (O = i.duplicates.indexOf(v), I = O !== -1), (i.tag !== null && i.tag !== "?" || I || i.indent !== 2 && a > 0) && (b = !1), I && i.usedDuplicates[O])
      i.dump = "*ref_" + O;
    else {
      if (T && I && !i.usedDuplicates[O] && (i.usedDuplicates[O] = !0), C === "[object Object]")
        y && Object.keys(i.dump).length !== 0 ? (e(i, a, i.dump, b), I && (i.dump = "&ref_" + O + i.dump)) : (cn(i, a, i.dump), I && (i.dump = "&ref_" + O + " " + i.dump));
      else if (C === "[object Array]")
        y && i.dump.length !== 0 ? (i.noArrayIndent && !x && a > 0 ? Ke(i, a - 1, i.dump, b) : Ke(i, a, i.dump, b), I && (i.dump = "&ref_" + O + i.dump)) : (Be(i, a, i.dump), I && (i.dump = "&ref_" + O + " " + i.dump));
      else if (C === "[object String]")
        i.tag !== "?" && on(i, i.dump, a, $, S);
      else {
        if (C === "[object Undefined]")
          return !1;
        if (i.skipInvalid) return !1;
        throw new n("unacceptable kind of an object to dump " + C);
      }
      if (i.tag !== null && i.tag !== "?") {
        let L = encodeURI(
          i.tag[0] === "!" ? i.tag.slice(1) : i.tag
        ).replace(/!/g, "%21");
        i.tag[0] === "!" ? L = "!" + L : L.slice(0, 18) === "tag:yaml.org,2002:" ? L = "!!" + L.slice(18) : L = "!<" + L + ">", i.dump = L + " " + i.dump;
      }
    }
    return !0;
  }
  function A(i, a) {
    const v = [], y = [];
    h(i, v, y);
    const b = y.length;
    for (let $ = 0; $ < b; $ += 1)
      a.duplicates.push(v[y[$]]);
    a.usedDuplicates = new Array(b);
  }
  function h(i, a, v) {
    if (i !== null && typeof i == "object") {
      const y = a.indexOf(i);
      if (y !== -1)
        v.indexOf(y) === -1 && v.push(y);
      else if (a.push(i), Array.isArray(i))
        for (let b = 0, $ = i.length; b < $; b += 1)
          h(i[b], a, v);
      else {
        const b = Object.keys(i);
        for (let $ = 0, x = b.length; $ < x; $ += 1)
          h(i[b[$]], a, v);
      }
    }
  }
  function w(i, a) {
    a = a || {};
    const v = new rn(a);
    v.noRefs || A(i, v);
    let y = i;
    return v.replacer && (y = v.replacer.call({ "": y }, "", y)), m(v, 0, y, !0, !0) ? v.dump + `
` : "";
  }
  return Nn.dump = w, Nn;
}
var xi;
function wt() {
  if (xi) return U;
  xi = 1;
  const t = vt(), n = $t();
  function r(l, o) {
    return function() {
      throw new Error("Function yaml." + l + " is removed in js-yaml 4. Use yaml." + o + " instead, which is now safe by default.");
    };
  }
  return U.Type = H(), U.Schema = Ni(), U.FAILSAFE_SCHEMA = Ri(), U.JSON_SCHEMA = Ui(), U.CORE_SCHEMA = Hi(), U.DEFAULT_SCHEMA = Fn(), U.load = t.load, U.loadAll = t.loadAll, U.dump = n.dump, U.YAMLException = Ie(), U.types = {
    binary: Bi(),
    float: qi(),
    map: Li(),
    null: Pi(),
    pairs: zi(),
    set: Wi(),
    timestamp: Yi(),
    bool: Di(),
    int: Fi(),
    merge: ji(),
    omap: Ki(),
    seq: Mi(),
    str: Ii()
  }, U.safeLoad = r("safeLoad", "load"), U.safeLoadAll = r("safeLoadAll", "loadAll"), U.safeDump = r("safeDump", "dump"), U;
}
var St = wt();
const Ct = /* @__PURE__ */ _t(St), {
  Type: Dt,
  Schema: Ft,
  FAILSAFE_SCHEMA: qt,
  JSON_SCHEMA: Ut,
  CORE_SCHEMA: Ht,
  DEFAULT_SCHEMA: Yt,
  load: Et,
  loadAll: jt,
  dump: vi,
  YAMLException: Bt,
  types: Kt,
  safeLoad: zt,
  safeLoadAll: Wt,
  safeDump: Gt
} = Ct, Ze = (t, n, r = {}) => t.callWS({ type: `deferred_actions/${n}`, data: r }), Tt = (t) => Ze(t, "list", { limit: 1e3 }), kt = (t, n) => Ze(t, "create", n), Ot = (t, n) => Ze(t, "update", n), Nt = (t, n, r, l = {}) => Ze(t, n, { job_id: r, ...l }), It = (t, n) => t.connection.subscribeMessage(n, { type: "deferred_actions/subscribe" });
function $i(t, n = Date.now()) {
  const r = Math.round((new Date(t).getTime() - n) / 1e3), l = Math.abs(r), [o, s] = l >= 86400 ? [Math.round(l / 86400), "day"] : l >= 3600 ? [Math.round(l / 3600), "hour"] : l >= 60 ? [Math.round(l / 60), "minute"] : [l, "second"];
  return `${r < 0 ? "overdue by" : "in"} ${o} ${s}${o === 1 ? "" : "s"}`;
}
const wi = (t) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short"
}).format(new Date(t));
var Mt = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, X = (t, n, r, l) => {
  for (var o = l > 1 ? void 0 : l ? Lt(n, r) : n, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (o = (l ? c(n, r, o) : c(o)) || o);
  return l && o && Mt(n, r, o), o;
};
let W = class extends Ce {
  constructor() {
    super(...arguments), this.jobs = [], this.summary = { pending: 0, paused: 0, failed: 0 }, this.tab = "Pending", this.busy = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.clock = window.setInterval(() => this.requestUpdate(), 1e3);
  }
  disconnectedCallback() {
    this.unsubscribe?.(), this.clock && window.clearInterval(this.clock), super.disconnectedCallback();
  }
  firstUpdated() {
    this.initialize();
  }
  async initialize() {
    await this.refresh(), this.unsubscribe = await It(this.hass, (t) => this.handlePush(t));
  }
  async refresh() {
    try {
      const t = await Tt(this.hass);
      this.jobs = t.jobs, this.recalculate();
    } catch (t) {
      this.error = String(t);
    }
  }
  handlePush(t) {
    if (t.event === "queue_summary" && t.summary && (this.summary = t.summary), t.event === "job_deleted" && t.job_id) this.jobs = this.jobs.filter((n) => n.id !== t.job_id);
    else if (t.job) {
      const n = this.jobs.findIndex((r) => r.id === t.job?.id);
      this.jobs = n < 0 ? [...this.jobs, t.job] : this.jobs.map((r) => r.id === t.job?.id ? t.job : r);
    }
    this.recalculate();
  }
  recalculate() {
    const t = this.jobs.filter((n) => n.status === "pending").sort((n, r) => n.execute_at.localeCompare(r.execute_at));
    this.summary = {
      pending: t.length,
      paused: this.jobs.filter((n) => n.status === "paused").length,
      failed: this.jobs.filter((n) => n.status === "failed").length,
      next_job_name: t[0]?.name,
      next_execution_local: t[0]?.execute_at_local
    };
  }
  visibleJobs() {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled", "missed"]);
    return this.jobs.filter((n) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(n.status) || this.tab === "Paused" && n.status === "paused" || this.tab === "Failed" && n.status === "failed" || this.tab === "History" && t.has(n.status)).sort((n, r) => n.execute_at.localeCompare(r.execute_at));
  }
  async operate(t, n, r = {}) {
    if (!(["cancel", "delete", "execute_now"].includes(t) && !window.confirm(`${t.replace("_", " ")} “${n.name}”?`))) {
      this.busy = !0, this.error = void 0;
      try {
        await Nt(this.hass, t, n.id, r), t === "delete" && (this.selected = void 0);
      } catch (l) {
        this.error = String(l);
      } finally {
        this.busy = !1;
      }
    }
  }
  reschedule(t) {
    const n = window.prompt("New offset-aware ISO date and time", t.execute_at_local);
    n && this.operate("reschedule", t, { execute_at: n });
  }
  extend(t) {
    const n = window.prompt("Minutes to add (use a negative number to reduce)", "15");
    n !== null && Number.isFinite(Number(n)) && Number(n) !== 0 && this.operate("extend", t, { duration: { minutes: Number(n) } });
  }
  duplicate(t) {
    const n = window.prompt("Run the copy in how many minutes?", "20");
    n !== null && Number(n) > 0 && this.operate("duplicate", t, { delay: { minutes: Number(n) } });
  }
  renderControls(t) {
    return R`<div class="controls">
      <button @click=${() => {
      this.selected = t;
    }}>View</button>
      ${["pending", "paused"].includes(t.status) ? R`<button @click=${() => {
      this.editor = { job: t, mode: "advanced" };
    }}>Edit</button>` : M}
      ${["pending", "paused"].includes(t.status) ? R`<button @click=${() => this.reschedule(t)}>Reschedule</button><button @click=${() => this.extend(t)}>Extend</button>` : M}
      ${t.status === "pending" ? R`<button @click=${() => this.operate("pause", t)}>Pause</button>` : M}
      ${t.status === "paused" ? R`<button @click=${() => this.operate("resume", t)}>Resume</button>` : M}
      ${["pending", "paused", "failed", "missed"].includes(t.status) ? R`<button @click=${() => this.operate("execute_now", t)}>Execute now</button>` : M}
      ${["pending", "paused"].includes(t.status) ? R`<button class="warning" @click=${() => this.operate("cancel", t)}>Cancel</button>` : M}
      <button @click=${() => this.duplicate(t)}>Duplicate</button>
      ${t.status !== "executing" ? R`<button class="danger" @click=${() => this.operate("delete", t)}>Delete</button>` : M}
    </div>`;
  }
  renderJob(t) {
    return R`<article class="job" @click=${() => {
      this.selected = t;
    }}>
      <div class="job-head"><h3>${t.name}</h3><span class="status ${t.status}">${t.status}</span></div>
      <div class="time">${wi(t.execute_at_local)} · ${$i(t.execute_at)}</div>
      <p>${t.action_summary}</p>
      <div class="meta">${t.job_key ? R`<code>${t.job_key}</code>` : M}${t.tags.map((n) => R`<span class="tag">${n}</span>`)}<span>${t.source}</span></div>
      ${t.last_error ? R`<div class="error">${t.last_error}</div>` : M}
      <div @click=${(n) => n.stopPropagation()}>${this.renderControls(t)}</div>
    </article>`;
  }
  renderDetails(t) {
    return R`<div class="overlay" @click=${() => {
      this.selected = void 0;
    }}><section class="dialog wide" @click=${(n) => n.stopPropagation()}>
      <header><h2>${t.name}</h2><button @click=${() => {
      this.selected = void 0;
    }}>✕</button></header>
      <dl>
        ${Object.entries({
      "Job ID": t.id,
      Status: t.status,
      Description: t.description || "—",
      "Scheduled UTC": t.execute_at,
      "Scheduled local": t.execute_at_local,
      Created: t.created_at,
      Modified: t.modified_at,
      Completed: t.completed_at || "—",
      Source: t.source,
      "Job key": t.job_key || "—",
      Tags: t.tags.join(", ") || "—",
      "Target hints": t.target_entities.join(", ") || "—",
      Overdue: new Date(t.execute_at).getTime() < Date.now() && ["pending", "paused"].includes(t.status) ? "Yes" : "No",
      Revision: String(t.revision),
      "Last error": t.last_error || "—"
    }).map(([n, r]) => R`<dt>${n}</dt><dd>${r}</dd>`)}
      </dl>
      <h3>Action sequence</h3><pre>${vi(t.sequence, { noRefs: !0 })}</pre>
      <h3>Attribution</h3><pre>${JSON.stringify(t.attribution, null, 2)}</pre>
      ${Object.keys(t.linkage).length ? R`<h3>Run-for / linkage</h3><pre>${JSON.stringify(t.linkage, null, 2)}</pre>` : M}
      ${this.renderControls(t)}
    </section></div>`;
  }
  renderEditor() {
    const t = this.editor?.job;
    return R`<div class="overlay"><form class="dialog" @submit=${(n) => this.saveEditor(n)}>
      <header><h2>${t ? "Edit deferred action" : "Add deferred action"}</h2><button type="button" @click=${() => {
      this.editor = void 0;
    }}>✕</button></header>
      <label>Name<input name="name" required .value=${t?.name ?? ""}></label>
      <label>Description<textarea name="description">${t?.description ?? ""}</textarea></label>
      ${t ? M : R`<label>Absolute execution time (optional, ISO 8601 with UTC offset)<input name="execute_at" placeholder="2026-08-02T21:00:00+01:00"></label><div class="two"><label>Or delay hours<input name="hours" type="number" min="0" value="0"></label><label>Delay minutes<input name="minutes" type="number" min="0" value="20"></label></div>`}
      <label>Job key<input name="job_key" .value=${t?.job_key ?? ""}></label>
      <label>Tags (comma separated)<input name="tags" .value=${t?.tags.join(", ") ?? ""}></label>
      <label>Target entity hints (comma separated)<input name="target_entities" .value=${t?.target_entities.join(", ") ?? ""}></label>
      ${t ? M : R`<label>Conflict mode<select name="conflict_mode"><option>keep_all</option><option>replace_same_key</option><option>cancel_same_key</option><option>reject_same_key</option></select></label>`}
      <div class="mode"><button type="button" class=${this.editor?.mode === "simple" ? "active" : ""} @click=${() => {
      this.editor = { ...this.editor, mode: "simple" };
    }}>Simple action</button><button type="button" class=${this.editor?.mode === "advanced" ? "active" : ""} @click=${() => {
      this.editor = { ...this.editor, mode: "advanced" };
    }}>Advanced YAML</button></div>
      ${this.editor?.mode === "simple" ? R`<label>Action<input name="action" placeholder="light.turn_off"></label><label>Entity ID<input name="entity_id" placeholder="light.porch"></label>` : R`<label>Action sequence YAML<textarea class="yaml" name="yaml" required>${vi(t?.sequence ?? [{ action: "light.turn_off", target: { entity_id: "light.porch" } }], { noRefs: !0 })}</textarea></label>`}
      <footer><button type="button" @click=${() => {
      this.editor = void 0;
    }}>Cancel</button><button class="primary" ?disabled=${this.busy}>Save</button></footer>
    </form></div>`;
  }
  async saveEditor(t) {
    t.preventDefault();
    const n = new FormData(t.currentTarget);
    try {
      const r = this.editor?.mode === "simple" ? [{ action: String(n.get("action")), target: { entity_id: String(n.get("entity_id")) } }] : Et(String(n.get("yaml")));
      if (!Array.isArray(r)) throw new Error("Advanced YAML must be a list of actions");
      const l = {
        name: String(n.get("name")),
        description: String(n.get("description")) || void 0,
        job_key: String(n.get("job_key")) || void 0,
        tags: String(n.get("tags")).split(",").map((o) => o.trim()).filter(Boolean),
        target_entities: String(n.get("target_entities")).split(",").map((o) => o.trim()).filter(Boolean),
        sequence: r
      };
      if (this.busy = !0, this.editor?.job) await Ot(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...l });
      else {
        const o = String(n.get("execute_at") ?? "").trim();
        await kt(this.hass, {
          ...l,
          ...o ? { execute_at: o } : { delay: { hours: Number(n.get("hours")), minutes: Number(n.get("minutes")) } },
          conflict_mode: String(n.get("conflict_mode"))
        });
      }
      this.editor = void 0;
    } catch (r) {
      this.error = String(r);
    } finally {
      this.busy = !1;
    }
  }
  render() {
    return R`<ha-card>
      <header class="top"><div><h1>Deferred Actions</h1><p>Persistent one-off action scheduling</p></div><button class="primary" @click=${() => {
      this.editor = { mode: "simple" };
    }}>＋ Add deferred action</button></header>
      ${this.error ? R`<div class="banner">${this.error}<button @click=${() => {
      this.error = void 0;
    }}>✕</button></div>` : M}
      <section class="summary"><div><strong>${this.summary.pending}</strong><span>Pending</span></div><div><strong>${this.summary.paused}</strong><span>Paused</span></div><div><strong>${this.summary.failed}</strong><span>Failed</span></div><div class="next"><span>Next action</span><strong>${this.summary.next_job_name ?? "None"}</strong><small>${this.summary.next_execution_local ? `${wi(this.summary.next_execution_local)} · ${$i(this.summary.next_execution_local)}` : "No pending actions"}</small></div></section>
      <nav>${["Pending", "Paused", "Failed", "History", "All"].map((t) => R`<button class=${this.tab === t ? "active" : ""} @click=${() => {
      this.tab = t;
    }}>${t}</button>`)}</nav>
      <main>${this.visibleJobs().length ? this.visibleJobs().map((t) => this.renderJob(t)) : R`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : M}${this.editor ? this.renderEditor() : M}
    </ha-card>`;
  }
};
W.styles = Ji`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:1180px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.top p{margin:4px 0;color:var(--secondary-text-color)}button{border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button:disabled{opacity:.5}.summary{display:grid;grid-template-columns:repeat(3,minmax(90px,1fr)) minmax(260px,2fr);gap:12px;margin:24px 0}.summary>div{display:flex;flex-direction:column;padding:16px;border:1px solid var(--divider-color);border-radius:14px}.summary strong{font-size:24px}.summary span,.summary small,.time,.meta{color:var(--secondary-text-color)}.summary .next strong{font-size:16px;margin:4px 0}nav{display:flex;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-bottom:16px}nav button{border:0;background:none;border-radius:0}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}.job{padding:16px;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);cursor:pointer}.job:hover{box-shadow:var(--ha-card-box-shadow,0 2px 8px rgba(0,0,0,.14))}.job-head{display:flex;justify-content:space-between;gap:8px}.job h3{margin:0}.status,.tag{font-size:12px;border-radius:999px;padding:4px 8px;background:var(--secondary-background-color)}.status.failed{color:var(--error-color)}.status.pending{color:var(--primary-color)}.meta,.controls{display:flex;flex-wrap:wrap;gap:7px;align-items:center}.controls{margin-top:14px}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.banner{display:flex;justify-content:space-between;margin:12px 0}.empty{grid-column:1/-1;text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(850px,100%)}.dialog header,.dialog footer{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mode{display:flex;gap:6px}.mode .active{border-color:var(--primary-color);color:var(--primary-color)}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.summary{grid-template-columns:repeat(3,1fr)}.summary .next{grid-column:1/-1}main{grid-template-columns:1fr}.controls button{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two{grid-template-columns:1fr}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
X([
  Oi({ attribute: !1 })
], W.prototype, "hass", 2);
X([
  ue()
], W.prototype, "jobs", 2);
X([
  ue()
], W.prototype, "summary", 2);
X([
  ue()
], W.prototype, "tab", 2);
X([
  ue()
], W.prototype, "selected", 2);
X([
  ue()
], W.prototype, "editor", 2);
X([
  ue()
], W.prototype, "error", 2);
X([
  ue()
], W.prototype, "busy", 2);
W = X([
  yt("deferred-actions-panel")
], W);
export {
  W as DeferredActionsPanel
};
