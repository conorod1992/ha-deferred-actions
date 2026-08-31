const rt = globalThis, Jt = rt.ShadowRoot && (rt.ShadyCSS === void 0 || rt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Zt = /* @__PURE__ */ Symbol(), ri = /* @__PURE__ */ new WeakMap();
let Gi = class {
  constructor(i, n, r) {
    if (this._$cssResult$ = !0, r !== Zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = n;
  }
  get styleSheet() {
    let i = this.o;
    const n = this.t;
    if (Jt && i === void 0) {
      const r = n !== void 0 && n.length === 1;
      r && (i = ri.get(n)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), r && ri.set(n, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const $n = (e) => new Gi(typeof e == "string" ? e : e + "", void 0, Zt), An = (e, ...i) => {
  const n = e.length === 1 ? e[0] : i.reduce((r, l, s) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(l) + e[s + 1], e[0]);
  return new Gi(n, e, Zt);
}, xn = (e, i) => {
  if (Jt) e.adoptedStyleSheets = i.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of i) {
    const r = document.createElement("style"), l = rt.litNonce;
    l !== void 0 && r.setAttribute("nonce", l), r.textContent = n.cssText, e.appendChild(r);
  }
}, oi = Jt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((i) => {
  let n = "";
  for (const r of i.cssRules) n += r.cssText;
  return $n(n);
})(e) : e;
const { is: wn, defineProperty: kn, getOwnPropertyDescriptor: Sn, getOwnPropertyNames: Cn, getOwnPropertySymbols: Tn, getPrototypeOf: En } = Object, at = globalThis, si = at.trustedTypes, On = si ? si.emptyScript : "", Mn = at.reactiveElementPolyfillSupport, Ie = (e, i) => e, st = { toAttribute(e, i) {
  switch (i) {
    case Boolean:
      e = e ? On : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, i) {
  let n = e;
  switch (i) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, Qt = (e, i) => !wn(e, i), li = { attribute: !0, type: String, converter: st, reflect: !1, useDefault: !1, hasChanged: Qt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), at.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let xe = class extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ??= []).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, n = li) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(i) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(i, n), !n.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), l = this.getPropertyDescriptor(i, r, n);
      l !== void 0 && kn(this.prototype, i, l);
    }
  }
  static getPropertyDescriptor(i, n, r) {
    const { get: l, set: s } = Sn(this.prototype, i) ?? { get() {
      return this[n];
    }, set(a) {
      this[n] = a;
    } };
    return { get: l, set(a) {
      const c = l?.call(this);
      s?.call(this, a), this.requestUpdate(i, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? li;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ie("elementProperties"))) return;
    const i = En(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
      const n = this.properties, r = [...Cn(n), ...Tn(n)];
      for (const l of r) this.createProperty(l, n[l]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const n = litPropertyMetadata.get(i);
      if (n !== void 0) for (const [r, l] of n) this.elementProperties.set(r, l);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, r] of this.elementProperties) {
      const l = this._$Eu(n, r);
      l !== void 0 && this._$Eh.set(l, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const n = [];
    if (Array.isArray(i)) {
      const r = new Set(i.flat(1 / 0).reverse());
      for (const l of r) n.unshift(oi(l));
    } else i !== void 0 && n.push(oi(i));
    return n;
  }
  static _$Eu(i, n) {
    const r = n.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof i == "string" ? i.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((i) => i(this));
  }
  addController(i) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(i), this.renderRoot !== void 0 && this.isConnected && i.hostConnected?.();
  }
  removeController(i) {
    this._$EO?.delete(i);
  }
  _$E_() {
    const i = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const r of n.keys()) this.hasOwnProperty(r) && (i.set(r, this[r]), delete this[r]);
    i.size > 0 && (this._$Ep = i);
  }
  createRenderRoot() {
    const i = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xn(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((i) => i.hostConnected?.());
  }
  enableUpdating(i) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((i) => i.hostDisconnected?.());
  }
  attributeChangedCallback(i, n, r) {
    this._$AK(i, r);
  }
  _$ET(i, n) {
    const r = this.constructor.elementProperties.get(i), l = this.constructor._$Eu(i, r);
    if (l !== void 0 && r.reflect === !0) {
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : st).toAttribute(n, r.type);
      this._$Em = i, s == null ? this.removeAttribute(l) : this.setAttribute(l, s), this._$Em = null;
    }
  }
  _$AK(i, n) {
    const r = this.constructor, l = r._$Eh.get(i);
    if (l !== void 0 && this._$Em !== l) {
      const s = r.getPropertyOptions(l), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : st;
      this._$Em = l;
      const c = a.fromAttribute(n, s.type);
      this[l] = c ?? this._$Ej?.get(l) ?? c, this._$Em = null;
    }
  }
  requestUpdate(i, n, r, l = !1, s) {
    if (i !== void 0) {
      const a = this.constructor;
      if (l === !1 && (s = this[i]), r ??= a.getPropertyOptions(i), !((r.hasChanged ?? Qt)(s, n) || r.useDefault && r.reflect && s === this._$Ej?.get(i) && !this.hasAttribute(a._$Eu(i, r)))) return;
      this.C(i, n, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(i, n, { useDefault: r, reflect: l, wrapped: s }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(i) && (this._$Ej.set(i, a ?? n ?? this[i]), s !== !0 || a !== void 0) || (this._$AL.has(i) || (this.hasUpdated || r || (n = void 0), this._$AL.set(i, n)), l === !0 && this._$Em !== i && (this._$Eq ??= /* @__PURE__ */ new Set()).add(i));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const i = this.scheduleUpdate();
    return i != null && await i, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [l, s] of this._$Ep) this[l] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [l, s] of r) {
        const { wrapped: a } = s, c = this[l];
        a !== !0 || this._$AL.has(l) || c === void 0 || this.C(l, void 0, s, c);
      }
    }
    let i = !1;
    const n = this._$AL;
    try {
      i = this.shouldUpdate(n), i ? (this.willUpdate(n), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(n)) : this._$EM();
    } catch (r) {
      throw i = !1, this._$EM(), r;
    }
    i && this._$AE(n);
  }
  willUpdate(i) {
  }
  _$AE(i) {
    this._$EO?.forEach((n) => n.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(i)), this.updated(i);
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
  shouldUpdate(i) {
    return !0;
  }
  update(i) {
    this._$Eq &&= this._$Eq.forEach((n) => this._$ET(n, this[n])), this._$EM();
  }
  updated(i) {
  }
  firstUpdated(i) {
  }
};
xe.elementStyles = [], xe.shadowRootOptions = { mode: "open" }, xe[Ie("elementProperties")] = /* @__PURE__ */ new Map(), xe[Ie("finalized")] = /* @__PURE__ */ new Map(), Mn?.({ ReactiveElement: xe }), (at.reactiveElementVersions ??= []).push("2.1.2");
const Xt = globalThis, ai = (e) => e, lt = Xt.trustedTypes, ci = lt ? lt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Vi = "$lit$", de = `lit$${Math.random().toFixed(9).slice(2)}$`, Ji = "?" + de, Rn = `<${Ji}>`, ye = document, Fe = () => ye.createComment(""), De = (e) => e === null || typeof e != "object" && typeof e != "function", ei = Array.isArray, qn = (e) => ei(e) || typeof e?.[Symbol.iterator] == "function", _t = `[ \t
\f\r]`, qe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ui = /-->/g, di = />/g, fe = RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ \t
\f\r"'\`<>=]|("|')|))|$)`, "g"), pi = /'/g, hi = /"/g, Zi = /^(?:script|style|textarea|title)$/i, In = (e) => (i, ...n) => ({ _$litType$: e, strings: i, values: n }), k = In(1), we = /* @__PURE__ */ Symbol.for("lit-noChange"), O = /* @__PURE__ */ Symbol.for("lit-nothing"), fi = /* @__PURE__ */ new WeakMap(), ge = ye.createTreeWalker(ye, 129);
function Qi(e, i) {
  if (!ei(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ci !== void 0 ? ci.createHTML(i) : i;
}
const Ln = (e, i) => {
  const n = e.length - 1, r = [];
  let l, s = i === 2 ? "<svg>" : i === 3 ? "<math>" : "", a = qe;
  for (let c = 0; c < n; c++) {
    const h = e[c];
    let u, f, y = -1, T = 0;
    for (; T < h.length && (a.lastIndex = T, f = a.exec(h), f !== null); ) T = a.lastIndex, a === qe ? f[1] === "!--" ? a = ui : f[1] !== void 0 ? a = di : f[2] !== void 0 ? (Zi.test(f[2]) && (l = RegExp("</" + f[2], "g")), a = fe) : f[3] !== void 0 && (a = fe) : a === fe ? f[0] === ">" ? (a = l ?? qe, y = -1) : f[1] === void 0 ? y = -2 : (y = a.lastIndex - f[2].length, u = f[1], a = f[3] === void 0 ? fe : f[3] === '"' ? hi : pi) : a === hi || a === pi ? a = fe : a === ui || a === di ? a = qe : (a = fe, l = void 0);
    const q = a === fe && e[c + 1].startsWith("/>") ? " " : "";
    s += a === qe ? h + Rn : y >= 0 ? (r.push(u), h.slice(0, y) + Vi + h.slice(y) + de + q) : h + de + (y === -2 ? c : q);
  }
  return [Qi(e, s + (e[n] || "<?>") + (i === 2 ? "</svg>" : i === 3 ? "</math>" : "")), r];
};
class Pe {
  constructor({ strings: i, _$litType$: n }, r) {
    let l;
    this.parts = [];
    let s = 0, a = 0;
    const c = i.length - 1, h = this.parts, [u, f] = Ln(i, n);
    if (this.el = Pe.createElement(u, r), ge.currentNode = this.el.content, n === 2 || n === 3) {
      const y = this.el.content.firstChild;
      y.replaceWith(...y.childNodes);
    }
    for (; (l = ge.nextNode()) !== null && h.length < c; ) {
      if (l.nodeType === 1) {
        if (l.hasAttributes()) for (const y of l.getAttributeNames()) if (y.endsWith(Vi)) {
          const T = f[a++], q = l.getAttribute(y).split(de), H = /([.?@])?(.*)/.exec(T);
          h.push({ type: 1, index: s, name: H[2], strings: q, ctor: H[1] === "." ? Fn : H[1] === "?" ? Dn : H[1] === "@" ? Pn : ct }), l.removeAttribute(y);
        } else y.startsWith(de) && (h.push({ type: 6, index: s }), l.removeAttribute(y));
        if (Zi.test(l.tagName)) {
          const y = l.textContent.split(de), T = y.length - 1;
          if (T > 0) {
            l.textContent = lt ? lt.emptyScript : "";
            for (let q = 0; q < T; q++) l.append(y[q], Fe()), ge.nextNode(), h.push({ type: 2, index: ++s });
            l.append(y[T], Fe());
          }
        }
      } else if (l.nodeType === 8) if (l.data === Ji) h.push({ type: 2, index: s });
      else {
        let y = -1;
        for (; (y = l.data.indexOf(de, y + 1)) !== -1; ) h.push({ type: 7, index: s }), y += de.length - 1;
      }
      s++;
    }
  }
  static createElement(i, n) {
    const r = ye.createElement("template");
    return r.innerHTML = i, r;
  }
}
function ke(e, i, n = e, r) {
  if (i === we) return i;
  let l = r !== void 0 ? n._$Co?.[r] : n._$Cl;
  const s = De(i) ? void 0 : i._$litDirective$;
  return l?.constructor !== s && (l?._$AO?.(!1), s === void 0 ? l = void 0 : (l = new s(e), l._$AT(e, n, r)), r !== void 0 ? (n._$Co ??= [])[r] = l : n._$Cl = l), l !== void 0 && (i = ke(e, l._$AS(e, i.values), l, r)), i;
}
class Nn {
  constructor(i, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = i, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(i) {
    const { el: { content: n }, parts: r } = this._$AD, l = (i?.creationScope ?? ye).importNode(n, !0);
    ge.currentNode = l;
    let s = ge.nextNode(), a = 0, c = 0, h = r[0];
    for (; h !== void 0; ) {
      if (a === h.index) {
        let u;
        h.type === 2 ? u = new Ue(s, s.nextSibling, this, i) : h.type === 1 ? u = new h.ctor(s, h.name, h.strings, this, i) : h.type === 6 && (u = new Un(s, this, i)), this._$AV.push(u), h = r[++c];
      }
      a !== h?.index && (s = ge.nextNode(), a++);
    }
    return ge.currentNode = ye, l;
  }
  p(i) {
    let n = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(i, r, n), n += r.strings.length - 2) : r._$AI(i[n])), n++;
  }
}
class Ue {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(i, n, r, l) {
    this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = i, this._$AB = n, this._$AM = r, this.options = l, this._$Cv = l?.isConnected ?? !0;
  }
  get parentNode() {
    let i = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && i?.nodeType === 11 && (i = n.parentNode), i;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(i, n = this) {
    i = ke(this, i, n), De(i) ? i === O || i == null || i === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : i !== this._$AH && i !== we && this._(i) : i._$litType$ !== void 0 ? this.$(i) : i.nodeType !== void 0 ? this.T(i) : qn(i) ? this.k(i) : this._(i);
  }
  O(i) {
    return this._$AA.parentNode.insertBefore(i, this._$AB);
  }
  T(i) {
    this._$AH !== i && (this._$AR(), this._$AH = this.O(i));
  }
  _(i) {
    this._$AH !== O && De(this._$AH) ? this._$AA.nextSibling.data = i : this.T(ye.createTextNode(i)), this._$AH = i;
  }
  $(i) {
    const { values: n, _$litType$: r } = i, l = typeof r == "number" ? this._$AC(i) : (r.el === void 0 && (r.el = Pe.createElement(Qi(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === l) this._$AH.p(n);
    else {
      const s = new Nn(l, this), a = s.u(this.options);
      s.p(n), this.T(a), this._$AH = s;
    }
  }
  _$AC(i) {
    let n = fi.get(i.strings);
    return n === void 0 && fi.set(i.strings, n = new Pe(i)), n;
  }
  k(i) {
    ei(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let r, l = 0;
    for (const s of i) l === n.length ? n.push(r = new Ue(this.O(Fe()), this.O(Fe()), this, this.options)) : r = n[l], r._$AI(s), l++;
    l < n.length && (this._$AR(r && r._$AB.nextSibling, l), n.length = l);
  }
  _$AR(i = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); i !== this._$AB; ) {
      const r = ai(i).nextSibling;
      ai(i).remove(), i = r;
    }
  }
  setConnected(i) {
    this._$AM === void 0 && (this._$Cv = i, this._$AP?.(i));
  }
}
class ct {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(i, n, r, l, s) {
    this.type = 1, this._$AH = O, this._$AN = void 0, this.element = i, this.name = n, this._$AM = l, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = O;
  }
  _$AI(i, n = this, r, l) {
    const s = this.strings;
    let a = !1;
    if (s === void 0) i = ke(this, i, n, 0), a = !De(i) || i !== this._$AH && i !== we, a && (this._$AH = i);
    else {
      const c = i;
      let h, u;
      for (i = s[0], h = 0; h < s.length - 1; h++) u = ke(this, c[r + h], n, h), u === we && (u = this._$AH[h]), a ||= !De(u) || u !== this._$AH[h], u === O ? i = O : i !== O && (i += (u ?? "") + s[h + 1]), this._$AH[h] = u;
    }
    a && !l && this.j(i);
  }
  j(i) {
    i === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, i ?? "");
  }
}
class Fn extends ct {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(i) {
    this.element[this.name] = i === O ? void 0 : i;
  }
}
class Dn extends ct {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(i) {
    this.element.toggleAttribute(this.name, !!i && i !== O);
  }
}
class Pn extends ct {
  constructor(i, n, r, l, s) {
    super(i, n, r, l, s), this.type = 5;
  }
  _$AI(i, n = this) {
    if ((i = ke(this, i, n, 0) ?? O) === we) return;
    const r = this._$AH, l = i === O && r !== O || i.capture !== r.capture || i.once !== r.once || i.passive !== r.passive, s = i !== O && (r === O || l);
    l && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, i), this._$AH = i;
  }
  handleEvent(i) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, i) : this._$AH.handleEvent(i);
  }
}
class Un {
  constructor(i, n, r) {
    this.element = i, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(i) {
    ke(this, i);
  }
}
const Yn = Xt.litHtmlPolyfillSupport;
Yn?.(Pe, Ue), (Xt.litHtmlVersions ??= []).push("3.3.3");
const Hn = (e, i, n) => {
  const r = n?.renderBefore ?? i;
  let l = r._$litPart$;
  if (l === void 0) {
    const s = n?.renderBefore ?? null;
    r._$litPart$ = l = new Ue(i.insertBefore(Fe(), s), s, void 0, n ?? {});
  }
  return l._$AI(e), l;
};
const ti = globalThis;
class Le extends xe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const i = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= i.firstChild, i;
  }
  update(i) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(i), this._$Do = Hn(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return we;
  }
}
Le._$litElement$ = !0, Le.finalized = !0, ti.litElementHydrateSupport?.({ LitElement: Le });
const Bn = ti.litElementPolyfillSupport;
Bn?.({ LitElement: Le });
(ti.litElementVersions ??= []).push("4.2.2");
const zn = (e) => (i, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(e, i);
  }) : customElements.define(e, i);
};
const Kn = { attribute: !0, type: String, converter: st, reflect: !1, hasChanged: Qt }, jn = (e = Kn, i, n) => {
  const { kind: r, metadata: l } = n;
  let s = globalThis.litPropertyMetadata.get(l);
  if (s === void 0 && globalThis.litPropertyMetadata.set(l, s = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), s.set(n.name, e), r === "accessor") {
    const { name: a } = n;
    return { set(c) {
      const h = i.get.call(this);
      i.set.call(this, c), this.requestUpdate(a, h, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, e, c), c;
    } };
  }
  if (r === "setter") {
    const { name: a } = n;
    return function(c) {
      const h = this[a];
      i.call(this, c), this.requestUpdate(a, h, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Xi(e) {
  return (i, n) => typeof n == "object" ? jn(e, i, n) : ((r, l, s) => {
    const a = l.hasOwnProperty(s);
    return l.constructor.createProperty(s, r), a ? Object.getOwnPropertyDescriptor(l, s) : void 0;
  })(e, i, n);
}
function F(e) {
  return Xi({ ...e, state: !0, attribute: !1 });
}
function Wn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var z = {}, it = {}, le = {}, mi;
function Ye() {
  if (mi) return le;
  mi = 1;
  function e(a) {
    return typeof a > "u" || a === null;
  }
  function i(a) {
    return typeof a == "object" && a !== null;
  }
  function n(a) {
    return Array.isArray(a) ? a : e(a) ? [] : [a];
  }
  function r(a, c) {
    if (c) {
      const h = Object.keys(c);
      for (let u = 0, f = h.length; u < f; u += 1) {
        const y = h[u];
        a[y] = c[y];
      }
    }
    return a;
  }
  function l(a, c) {
    let h = "";
    for (let u = 0; u < c; u += 1)
      h += a;
    return h;
  }
  function s(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return le.isNothing = e, le.isObject = i, le.toArray = n, le.repeat = l, le.isNegativeZero = s, le.extend = r, le;
}
var $t, gi;
function He() {
  if (gi) return $t;
  gi = 1;
  function e(n, r) {
    let l = "";
    const s = n.reason || "(unknown reason)";
    return n.mark ? (n.mark.name && (l += 'in "' + n.mark.name + '" '), l += "(" + (n.mark.line + 1) + ":" + (n.mark.column + 1) + ")", !r && n.mark.snippet && (l += `

` + n.mark.snippet), s + " " + l) : s;
  }
  function i(n, r) {
    Error.call(this), this.name = "YAMLException", this.reason = n, this.mark = r, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return i.prototype = Object.create(Error.prototype), i.prototype.constructor = i, i.prototype.toString = function(r) {
    return this.name + ": " + e(this, r);
  }, $t = i, $t;
}
var At, yi;
function Gn() {
  if (yi) return At;
  yi = 1;
  const e = Ye();
  function i(l, s, a, c, h) {
    let u = "", f = "";
    const y = Math.floor(h / 2) - 1;
    return c - s > y && (u = " ... ", s = c - y + u.length), a - c > y && (f = " ...", a = c + y - f.length), {
      str: u + l.slice(s, a).replace(/\t/g, "→") + f,
      pos: c - s + u.length
      // relative position
    };
  }
  function n(l, s) {
    return e.repeat(" ", s - l.length) + l;
  }
  function r(l, s) {
    if (s = Object.create(s || null), !l.buffer) return null;
    s.maxLength || (s.maxLength = 79), typeof s.indent != "number" && (s.indent = 1), typeof s.linesBefore != "number" && (s.linesBefore = 3), typeof s.linesAfter != "number" && (s.linesAfter = 2);
    const a = /\r?\n|\r|\0/g, c = [0], h = [];
    let u, f = -1;
    for (; u = a.exec(l.buffer); )
      h.push(u.index), c.push(u.index + u[0].length), l.position <= u.index && f < 0 && (f = c.length - 2);
    f < 0 && (f = c.length - 1);
    let y = "";
    const T = Math.min(l.line + s.linesAfter, h.length).toString().length, q = s.maxLength - (s.indent + T + 3);
    for (let P = 1; P <= s.linesBefore && !(f - P < 0); P++) {
      const J = i(
        l.buffer,
        c[f - P],
        h[f - P],
        l.position - (c[f] - c[f - P]),
        q
      );
      y = e.repeat(" ", s.indent) + n((l.line - P + 1).toString(), T) + " | " + J.str + `
` + y;
    }
    const H = i(l.buffer, c[f], h[f], l.position, q);
    y += e.repeat(" ", s.indent) + n((l.line + 1).toString(), T) + " | " + H.str + `
`, y += e.repeat("-", s.indent + T + 3 + H.pos) + `^
`;
    for (let P = 1; P <= s.linesAfter && !(f + P >= h.length); P++) {
      const J = i(
        l.buffer,
        c[f + P],
        h[f + P],
        l.position - (c[f] - c[f + P]),
        q
      );
      y += e.repeat(" ", s.indent) + n((l.line + P + 1).toString(), T) + " | " + J.str + `
`;
    }
    return y.replace(/\n$/, "");
  }
  return At = r, At;
}
var xt, vi;
function j() {
  if (vi) return xt;
  vi = 1;
  const e = He(), i = [
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
  ], n = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function r(s) {
    const a = {};
    return s !== null && Object.keys(s).forEach(function(c) {
      s[c].forEach(function(h) {
        a[String(h)] = c;
      });
    }), a;
  }
  function l(s, a) {
    if (a = a || {}, Object.keys(a).forEach(function(c) {
      if (i.indexOf(c) === -1)
        throw new e('Unknown option "' + c + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = a, this.tag = s, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(c) {
      return c;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = r(a.styleAliases || null), n.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return xt = l, xt;
}
var wt, bi;
function en() {
  if (bi) return wt;
  bi = 1;
  const e = He(), i = j();
  function n(s, a) {
    const c = [];
    return s[a].forEach(function(h) {
      let u = c.length;
      c.forEach(function(f, y) {
        f.tag === h.tag && f.kind === h.kind && f.multi === h.multi && (u = y);
      }), c[u] = h;
    }), c;
  }
  function r() {
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
    function a(c) {
      c.multi ? (s.multi[c.kind].push(c), s.multi.fallback.push(c)) : s[c.kind][c.tag] = s.fallback[c.tag] = c;
    }
    for (let c = 0, h = arguments.length; c < h; c += 1)
      arguments[c].forEach(a);
    return s;
  }
  function l(s) {
    return this.extend(s);
  }
  return l.prototype.extend = function(a) {
    let c = [], h = [];
    if (a instanceof i)
      h.push(a);
    else if (Array.isArray(a))
      h = h.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (c = c.concat(a.implicit)), a.explicit && (h = h.concat(a.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    c.forEach(function(f) {
      if (!(f instanceof i))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (f.loadKind && f.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (f.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), h.forEach(function(f) {
      if (!(f instanceof i))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const u = Object.create(l.prototype);
    return u.implicit = (this.implicit || []).concat(c), u.explicit = (this.explicit || []).concat(h), u.compiledImplicit = n(u, "implicit"), u.compiledExplicit = n(u, "explicit"), u.compiledTypeMap = r(u.compiledImplicit, u.compiledExplicit), u;
  }, wt = l, wt;
}
var kt, _i;
function tn() {
  if (_i) return kt;
  _i = 1;
  const e = j();
  return kt = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(i) {
      return i !== null ? i : "";
    }
  }), kt;
}
var St, $i;
function nn() {
  if ($i) return St;
  $i = 1;
  const e = j();
  return St = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(i) {
      return i !== null ? i : [];
    }
  }), St;
}
var Ct, Ai;
function rn() {
  if (Ai) return Ct;
  Ai = 1;
  const e = j();
  return Ct = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(i) {
      return i !== null ? i : {};
    }
  }), Ct;
}
var Tt, xi;
function on() {
  if (xi) return Tt;
  xi = 1;
  const e = en();
  return Tt = new e({
    explicit: [
      tn(),
      nn(),
      rn()
    ]
  }), Tt;
}
var Et, wi;
function sn() {
  if (wi) return Et;
  wi = 1;
  const e = j();
  function i(l) {
    if (l === null) return !0;
    const s = l.length;
    return s === 1 && l === "~" || s === 4 && (l === "null" || l === "Null" || l === "NULL");
  }
  function n() {
    return null;
  }
  function r(l) {
    return l === null;
  }
  return Et = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: i,
    construct: n,
    predicate: r,
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
  }), Et;
}
var Ot, ki;
function ln() {
  if (ki) return Ot;
  ki = 1;
  const e = j();
  function i(l) {
    if (l === null) return !1;
    const s = l.length;
    return s === 4 && (l === "true" || l === "True" || l === "TRUE") || s === 5 && (l === "false" || l === "False" || l === "FALSE");
  }
  function n(l) {
    return l === "true" || l === "True" || l === "TRUE";
  }
  function r(l) {
    return Object.prototype.toString.call(l) === "[object Boolean]";
  }
  return Ot = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: i,
    construct: n,
    predicate: r,
    represent: {
      lowercase: function(l) {
        return l ? "true" : "false";
      },
      uppercase: function(l) {
        return l ? "TRUE" : "FALSE";
      },
      camelcase: function(l) {
        return l ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Ot;
}
var Mt, Si;
function an() {
  if (Si) return Mt;
  Si = 1;
  const e = Ye(), i = j();
  function n(u) {
    return u >= 48 && u <= 57 || u >= 65 && u <= 70 || u >= 97 && u <= 102;
  }
  function r(u) {
    return u >= 48 && u <= 55;
  }
  function l(u) {
    return u >= 48 && u <= 57;
  }
  function s(u) {
    if (u === null) return !1;
    const f = u.length;
    let y = 0, T = !1;
    if (!f) return !1;
    let q = u[y];
    if ((q === "-" || q === "+") && (q = u[++y]), q === "0") {
      if (y + 1 === f) return !0;
      if (q = u[++y], q === "b") {
        for (y++; y < f; y++) {
          if (q = u[y], q !== "0" && q !== "1") return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
      if (q === "x") {
        for (y++; y < f; y++) {
          if (!n(u.charCodeAt(y))) return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
      if (q === "o") {
        for (y++; y < f; y++) {
          if (!r(u.charCodeAt(y))) return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
    }
    for (; y < f; y++) {
      if (!l(u.charCodeAt(y)))
        return !1;
      T = !0;
    }
    return T ? isFinite(a(u)) : !1;
  }
  function a(u) {
    let f = u, y = 1, T = f[0];
    if ((T === "-" || T === "+") && (T === "-" && (y = -1), f = f.slice(1), T = f[0]), f === "0") return 0;
    if (T === "0") {
      if (f[1] === "b") return y * parseInt(f.slice(2), 2);
      if (f[1] === "x") return y * parseInt(f.slice(2), 16);
      if (f[1] === "o") return y * parseInt(f.slice(2), 8);
    }
    return y * parseInt(f, 10);
  }
  function c(u) {
    return a(u);
  }
  function h(u) {
    return Object.prototype.toString.call(u) === "[object Number]" && u % 1 === 0 && !e.isNegativeZero(u);
  }
  return Mt = new i("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: s,
    construct: c,
    predicate: h,
    represent: {
      binary: function(u) {
        return u >= 0 ? "0b" + u.toString(2) : "-0b" + u.toString(2).slice(1);
      },
      octal: function(u) {
        return u >= 0 ? "0o" + u.toString(8) : "-0o" + u.toString(8).slice(1);
      },
      decimal: function(u) {
        return u.toString(10);
      },
      hexadecimal: function(u) {
        return u >= 0 ? "0x" + u.toString(16).toUpperCase() : "-0x" + u.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Mt;
}
var Rt, Ci;
function cn() {
  if (Ci) return Rt;
  Ci = 1;
  const e = Ye(), i = j(), n = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), r = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function l(u) {
    return u === null || !n.test(u) ? !1 : isFinite(parseFloat(u, 10)) ? !0 : r.test(u);
  }
  function s(u) {
    let f = u.toLowerCase();
    const y = f[0] === "-" ? -1 : 1;
    return "+-".indexOf(f[0]) >= 0 && (f = f.slice(1)), f === ".inf" ? y === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : f === ".nan" ? NaN : y * parseFloat(f, 10);
  }
  const a = /^[-+]?[0-9]+e/;
  function c(u, f) {
    if (isNaN(u))
      switch (f) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === u)
      switch (f) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === u)
      switch (f) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(u))
      return "-0.0";
    const y = u.toString(10);
    return a.test(y) ? y.replace("e", ".e") : y;
  }
  function h(u) {
    return Object.prototype.toString.call(u) === "[object Number]" && (u % 1 !== 0 || e.isNegativeZero(u));
  }
  return Rt = new i("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: l,
    construct: s,
    predicate: h,
    represent: c,
    defaultStyle: "lowercase"
  }), Rt;
}
var qt, Ti;
function un() {
  return Ti || (Ti = 1, qt = on().extend({
    implicit: [
      sn(),
      ln(),
      an(),
      cn()
    ]
  })), qt;
}
var It, Ei;
function dn() {
  return Ei || (Ei = 1, It = un()), It;
}
var Lt, Oi;
function pn() {
  if (Oi) return Lt;
  Oi = 1;
  const e = j(), i = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), n = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function r(a) {
    return a === null ? !1 : i.exec(a) !== null || n.exec(a) !== null;
  }
  function l(a) {
    let c = 0, h = null, u = i.exec(a);
    if (u === null && (u = n.exec(a)), u === null) throw new Error("Date resolve error");
    const f = +u[1], y = +u[2] - 1, T = +u[3];
    if (!u[4])
      return new Date(Date.UTC(f, y, T));
    const q = +u[4], H = +u[5], P = +u[6];
    if (u[7]) {
      for (c = u[7].slice(0, 3); c.length < 3; )
        c += "0";
      c = +c;
    }
    if (u[9]) {
      const pe = +u[10], W = +(u[11] || 0);
      h = (pe * 60 + W) * 6e4, u[9] === "-" && (h = -h);
    }
    const J = new Date(Date.UTC(f, y, T, q, H, P, c));
    return h && J.setTime(J.getTime() - h), J;
  }
  function s(a) {
    return a.toISOString();
  }
  return Lt = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: r,
    construct: l,
    instanceOf: Date,
    represent: s
  }), Lt;
}
var Nt, Mi;
function hn() {
  if (Mi) return Nt;
  Mi = 1;
  const e = j();
  function i(n) {
    return n === "<<" || n === null;
  }
  return Nt = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: i
  }), Nt;
}
var Ft, Ri;
function fn() {
  if (Ri) return Ft;
  Ri = 1;
  const e = j(), i = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function n(a) {
    if (a === null) return !1;
    let c = 0;
    const h = a.length, u = i;
    for (let f = 0; f < h; f++) {
      const y = u.indexOf(a.charAt(f));
      if (!(y > 64)) {
        if (y < 0) return !1;
        c += 6;
      }
    }
    return c % 8 === 0;
  }
  function r(a) {
    const c = a.replace(/[\r\n=]/g, ""), h = c.length, u = i;
    let f = 0;
    const y = [];
    for (let q = 0; q < h; q++)
      q % 4 === 0 && q && (y.push(f >> 16 & 255), y.push(f >> 8 & 255), y.push(f & 255)), f = f << 6 | u.indexOf(c.charAt(q));
    const T = h % 4 * 6;
    return T === 0 ? (y.push(f >> 16 & 255), y.push(f >> 8 & 255), y.push(f & 255)) : T === 18 ? (y.push(f >> 10 & 255), y.push(f >> 2 & 255)) : T === 12 && y.push(f >> 4 & 255), new Uint8Array(y);
  }
  function l(a) {
    let c = "", h = 0;
    const u = a.length, f = i;
    for (let T = 0; T < u; T++)
      T % 3 === 0 && T && (c += f[h >> 18 & 63], c += f[h >> 12 & 63], c += f[h >> 6 & 63], c += f[h & 63]), h = (h << 8) + a[T];
    const y = u % 3;
    return y === 0 ? (c += f[h >> 18 & 63], c += f[h >> 12 & 63], c += f[h >> 6 & 63], c += f[h & 63]) : y === 2 ? (c += f[h >> 10 & 63], c += f[h >> 4 & 63], c += f[h << 2 & 63], c += f[64]) : y === 1 && (c += f[h >> 2 & 63], c += f[h << 4 & 63], c += f[64], c += f[64]), c;
  }
  function s(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return Ft = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: n,
    construct: r,
    predicate: s,
    represent: l
  }), Ft;
}
var Dt, qi;
function mn() {
  if (qi) return Dt;
  qi = 1;
  const e = j(), i = Object.prototype.hasOwnProperty, n = Object.prototype.toString;
  function r(s) {
    if (s === null) return !0;
    const a = {}, c = s;
    for (let h = 0, u = c.length; h < u; h += 1) {
      const f = c[h];
      let y = !1;
      if (n.call(f) !== "[object Object]") return !1;
      let T;
      for (T in f)
        if (i.call(f, T))
          if (!y) y = !0;
          else return !1;
      if (!y || i.call(a, T)) return !1;
      Object.defineProperty(a, T, { value: !0 });
    }
    return !0;
  }
  function l(s) {
    return s !== null ? s : [];
  }
  return Dt = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: r,
    construct: l
  }), Dt;
}
var Pt, Ii;
function gn() {
  if (Ii) return Pt;
  Ii = 1;
  const e = j(), i = Object.prototype.toString;
  function n(l) {
    if (l === null) return !0;
    const s = l, a = new Array(s.length);
    for (let c = 0, h = s.length; c < h; c += 1) {
      const u = s[c];
      if (i.call(u) !== "[object Object]") return !1;
      const f = Object.keys(u);
      if (f.length !== 1) return !1;
      a[c] = [f[0], u[f[0]]];
    }
    return !0;
  }
  function r(l) {
    if (l === null) return [];
    const s = l, a = new Array(s.length);
    for (let c = 0, h = s.length; c < h; c += 1) {
      const u = s[c], f = Object.keys(u);
      a[c] = [f[0], u[f[0]]];
    }
    return a;
  }
  return Pt = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: n,
    construct: r
  }), Pt;
}
var Ut, Li;
function yn() {
  if (Li) return Ut;
  Li = 1;
  const e = j(), i = Object.prototype.hasOwnProperty;
  function n(l) {
    if (l === null) return !0;
    const s = l;
    for (const a in s)
      if (i.call(s, a) && s[a] !== null)
        return !1;
    return !0;
  }
  function r(l) {
    return l !== null ? l : {};
  }
  return Ut = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: n,
    construct: r
  }), Ut;
}
var Yt, Ni;
function ii() {
  return Ni || (Ni = 1, Yt = dn().extend({
    implicit: [
      pn(),
      hn()
    ],
    explicit: [
      fn(),
      mn(),
      gn(),
      yn()
    ]
  })), Yt;
}
var Fi;
function Vn() {
  if (Fi) return it;
  Fi = 1;
  const e = Ye(), i = He(), n = Gn(), r = ii(), l = Object.prototype.hasOwnProperty, s = 1, a = 2, c = 3, h = 4, u = 1, f = 2, y = 3, T = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, q = /[\x85\u2028\u2029]/, H = /[,\[\]{}]/, P = /^(?:!|!!|![0-9A-Za-z-]+!)$/, J = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function pe(t) {
    return Object.prototype.toString.call(t);
  }
  function W(t) {
    return t === 10 || t === 13;
  }
  function G(t) {
    return t === 9 || t === 32;
  }
  function B(t) {
    return t === 9 || t === 32 || t === 10 || t === 13;
  }
  function oe(t) {
    return t === 44 || t === 91 || t === 93 || t === 123 || t === 125;
  }
  function dt(t) {
    if (t >= 48 && t <= 57)
      return t - 48;
    const d = t | 32;
    return d >= 97 && d <= 102 ? d - 97 + 10 : -1;
  }
  function pt(t) {
    return t === 120 ? 2 : t === 117 ? 4 : t === 85 ? 8 : 0;
  }
  function Be(t) {
    return t >= 48 && t <= 57 ? t - 48 : -1;
  }
  function Se(t) {
    switch (t) {
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
  function ht(t) {
    return t <= 65535 ? String.fromCharCode(t) : String.fromCharCode(
      (t - 65536 >> 10) + 55296,
      (t - 65536 & 1023) + 56320
    );
  }
  function Ce(t, d, g) {
    d === "__proto__" ? Object.defineProperty(t, d, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: g
    }) : t[d] = g;
  }
  const ze = new Array(256), Te = new Array(256);
  for (let t = 0; t < 256; t++)
    ze[t] = Se(t) ? 1 : 0, Te[t] = Se(t);
  function Y(t, d) {
    this.input = t, this.filename = d.filename || null, this.schema = d.schema || r, this.onWarning = d.onWarning || null, this.legacy = d.legacy || !1, this.json = d.json || !1, this.listener = d.listener || null, this.maxDepth = typeof d.maxDepth == "number" ? d.maxDepth : 100, this.maxTotalMergeKeys = typeof d.maxTotalMergeKeys == "number" ? d.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = t.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function Ke(t, d) {
    const g = {
      name: t.filename,
      buffer: t.input.slice(0, -1),
      // omit trailing \0
      position: t.position,
      line: t.line,
      column: t.position - t.lineStart
    };
    return g.snippet = n(g), new i(d, g);
  }
  function E(t, d) {
    throw Ke(t, d);
  }
  function ve(t, d) {
    t.onWarning && t.onWarning.call(null, Ke(t, d));
  }
  function X(t, d, g) {
    const _ = t.anchorMapTransactions;
    if (_.length !== 0) {
      const m = _[_.length - 1];
      l.call(m, d) || (m[d] = {
        existed: l.call(t.anchorMap, d),
        value: t.anchorMap[d]
      });
    }
    t.anchorMap[d] = g;
  }
  function ft(t) {
    t.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function he(t) {
    const d = t.anchorMapTransactions.pop(), g = t.anchorMapTransactions;
    if (g.length === 0) return;
    const _ = g[g.length - 1], m = Object.keys(d);
    for (let w = 0, o = m.length; w < o; w += 1) {
      const p = m[w];
      l.call(_, p) || (_[p] = d[p]);
    }
  }
  function mt(t) {
    const d = t.anchorMapTransactions.pop(), g = Object.keys(d);
    for (let _ = g.length - 1; _ >= 0; _ -= 1) {
      const m = d[g[_]];
      m.existed ? t.anchorMap[g[_]] = m.value : delete t.anchorMap[g[_]];
    }
  }
  function Ee(t) {
    return {
      position: t.position,
      line: t.line,
      lineStart: t.lineStart,
      lineIndent: t.lineIndent,
      firstTabInLine: t.firstTabInLine,
      tag: t.tag,
      anchor: t.anchor,
      kind: t.kind,
      result: t.result
    };
  }
  function be(t, d) {
    t.position = d.position, t.line = d.line, t.lineStart = d.lineStart, t.lineIndent = d.lineIndent, t.firstTabInLine = d.firstTabInLine, t.tag = d.tag, t.anchor = d.anchor, t.kind = d.kind, t.result = d.result;
  }
  const je = {
    YAML: function(d, g, _) {
      d.version !== null && E(d, "duplication of %YAML directive"), _.length !== 1 && E(d, "YAML directive accepts exactly one argument");
      const m = /^([0-9]+)\.([0-9]+)$/.exec(_[0]);
      m === null && E(d, "ill-formed argument of the YAML directive");
      const w = parseInt(m[1], 10), o = parseInt(m[2], 10);
      w !== 1 && E(d, "unacceptable YAML version of the document"), d.version = _[0], d.checkLineBreaks = o < 2, o !== 1 && o !== 2 && ve(d, "unsupported YAML version of the document");
    },
    TAG: function(d, g, _) {
      let m;
      _.length !== 2 && E(d, "TAG directive accepts exactly two arguments");
      const w = _[0];
      m = _[1], P.test(w) || E(d, "ill-formed tag handle (first argument) of the TAG directive"), l.call(d.tagMap, w) && E(d, 'there is a previously declared suffix for "' + w + '" tag handle'), J.test(m) || E(d, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        m = decodeURIComponent(m);
      } catch {
        E(d, "tag prefix is malformed: " + m);
      }
      d.tagMap[w] = m;
    }
  };
  function V(t, d, g, _) {
    if (d < g) {
      const m = t.input.slice(d, g);
      if (_)
        for (let w = 0, o = m.length; w < o; w += 1) {
          const p = m.charCodeAt(w);
          p === 9 || p >= 32 && p <= 1114111 || E(t, "expected valid JSON character");
        }
      else T.test(m) && E(t, "the stream contains non-printable characters");
      t.result += m;
    }
  }
  function se(t, d, g, _) {
    e.isObject(g) || E(t, "cannot merge mappings; the provided source object is unacceptable");
    const m = Object.keys(g);
    for (let w = 0, o = m.length; w < o; w += 1) {
      const p = m[w];
      t.maxTotalMergeKeys !== -1 && ++t.totalMergeKeys > t.maxTotalMergeKeys && E(t, "merge keys exceeded maxTotalMergeKeys (" + t.maxTotalMergeKeys + ")"), l.call(d, p) || (Ce(d, p, g[p]), _[p] = !0);
    }
  }
  function ee(t, d, g, _, m, w, o, p, A) {
    if (Array.isArray(m)) {
      m = Array.prototype.slice.call(m);
      for (let v = 0, b = m.length; v < b; v += 1)
        Array.isArray(m[v]) && E(t, "nested arrays are not supported inside keys"), typeof m == "object" && pe(m[v]) === "[object Object]" && (m[v] = "[object Object]");
    }
    if (typeof m == "object" && pe(m) === "[object Object]" && (m = "[object Object]"), m = String(m), d === null && (d = {}), _ === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let v = 0, b = w.length; v < b; v += 1)
          se(t, d, w[v], g);
      else
        se(t, d, w, g);
    else
      !t.json && !l.call(g, m) && l.call(d, m) && (t.line = o || t.line, t.lineStart = p || t.lineStart, t.position = A || t.position, E(t, "duplicated mapping key")), Ce(d, m, w), delete g[m];
    return d;
  }
  function _e(t) {
    const d = t.input.charCodeAt(t.position);
    d === 10 ? t.position++ : d === 13 ? (t.position++, t.input.charCodeAt(t.position) === 10 && t.position++) : E(t, "a line break is expected"), t.line += 1, t.lineStart = t.position, t.firstTabInLine = -1;
  }
  function U(t, d, g) {
    let _ = 0, m = t.input.charCodeAt(t.position);
    for (; m !== 0; ) {
      for (; G(m); )
        m === 9 && t.firstTabInLine === -1 && (t.firstTabInLine = t.position), m = t.input.charCodeAt(++t.position);
      if (d && m === 35)
        do
          m = t.input.charCodeAt(++t.position);
        while (m !== 10 && m !== 13 && m !== 0);
      if (W(m))
        for (_e(t), m = t.input.charCodeAt(t.position), _++, t.lineIndent = 0; m === 32; )
          t.lineIndent++, m = t.input.charCodeAt(++t.position);
      else
        break;
    }
    return g !== -1 && _ !== 0 && t.lineIndent < g && ve(t, "deficient indentation"), _;
  }
  function $e(t) {
    let d = t.position, g = t.input.charCodeAt(d);
    return !!((g === 45 || g === 46) && g === t.input.charCodeAt(d + 1) && g === t.input.charCodeAt(d + 2) && (d += 3, g = t.input.charCodeAt(d), g === 0 || B(g)));
  }
  function te(t, d) {
    d === 1 ? t.result += " " : d > 1 && (t.result += e.repeat(`
`, d - 1));
  }
  function We(t, d, g) {
    let _, m, w, o, p, A;
    const v = t.kind, b = t.result;
    let x = t.input.charCodeAt(t.position);
    if (B(x) || oe(x) || x === 35 || x === 38 || x === 42 || x === 33 || x === 124 || x === 62 || x === 39 || x === 34 || x === 37 || x === 64 || x === 96)
      return !1;
    if (x === 63 || x === 45) {
      const $ = t.input.charCodeAt(t.position + 1);
      if (B($) || g && oe($))
        return !1;
    }
    for (t.kind = "scalar", t.result = "", _ = m = t.position, w = !1; x !== 0; ) {
      if (x === 58) {
        const $ = t.input.charCodeAt(t.position + 1);
        if (B($) || g && oe($))
          break;
      } else if (x === 35) {
        const $ = t.input.charCodeAt(t.position - 1);
        if (B($))
          break;
      } else {
        if (t.position === t.lineStart && $e(t) || g && oe(x))
          break;
        if (W(x))
          if (o = t.line, p = t.lineStart, A = t.lineIndent, U(t, !1, -1), t.lineIndent >= d) {
            w = !0, x = t.input.charCodeAt(t.position);
            continue;
          } else {
            t.position = m, t.line = o, t.lineStart = p, t.lineIndent = A;
            break;
          }
      }
      w && (V(t, _, m, !1), te(t, t.line - o), _ = m = t.position, w = !1), G(x) || (m = t.position + 1), x = t.input.charCodeAt(++t.position);
    }
    return V(t, _, m, !1), t.result ? !0 : (t.kind = v, t.result = b, !1);
  }
  function Ge(t, d) {
    let g, _, m = t.input.charCodeAt(t.position);
    if (m !== 39)
      return !1;
    for (t.kind = "scalar", t.result = "", t.position++, g = _ = t.position; (m = t.input.charCodeAt(t.position)) !== 0; )
      if (m === 39)
        if (V(t, g, t.position, !0), m = t.input.charCodeAt(++t.position), m === 39)
          g = t.position, t.position++, _ = t.position;
        else
          return !0;
      else W(m) ? (V(t, g, _, !0), te(t, U(t, !1, d)), g = _ = t.position) : t.position === t.lineStart && $e(t) ? E(t, "unexpected end of the document within a single quoted scalar") : (t.position++, G(m) || (_ = t.position));
    E(t, "unexpected end of the stream within a single quoted scalar");
  }
  function Oe(t, d) {
    let g, _, m, w = t.input.charCodeAt(t.position);
    if (w !== 34)
      return !1;
    for (t.kind = "scalar", t.result = "", t.position++, g = _ = t.position; (w = t.input.charCodeAt(t.position)) !== 0; ) {
      if (w === 34)
        return V(t, g, t.position, !0), t.position++, !0;
      if (w === 92) {
        if (V(t, g, t.position, !0), w = t.input.charCodeAt(++t.position), W(w))
          U(t, !1, d);
        else if (w < 256 && ze[w])
          t.result += Te[w], t.position++;
        else if ((m = pt(w)) > 0) {
          let o = m, p = 0;
          for (; o > 0; o--)
            w = t.input.charCodeAt(++t.position), (m = dt(w)) >= 0 ? p = (p << 4) + m : E(t, "expected hexadecimal character");
          t.result += ht(p), t.position++;
        } else
          E(t, "unknown escape sequence");
        g = _ = t.position;
      } else W(w) ? (V(t, g, _, !0), te(t, U(t, !1, d)), g = _ = t.position) : t.position === t.lineStart && $e(t) ? E(t, "unexpected end of the document within a double quoted scalar") : (t.position++, G(w) || (_ = t.position));
    }
    E(t, "unexpected end of the stream within a double quoted scalar");
  }
  function Ve(t, d) {
    let g = !0, _, m, w;
    const o = t.tag;
    let p;
    const A = t.anchor;
    let v, b, x, $;
    const C = /* @__PURE__ */ Object.create(null);
    let S, M, R, I = t.input.charCodeAt(t.position);
    if (I === 91)
      v = 93, $ = !1, p = [];
    else if (I === 123)
      v = 125, $ = !0, p = {};
    else
      return !1;
    for (t.anchor !== null && X(t, t.anchor, p), I = t.input.charCodeAt(++t.position); I !== 0; ) {
      if (U(t, !0, d), I = t.input.charCodeAt(t.position), I === v)
        return t.position++, t.tag = o, t.anchor = A, t.kind = $ ? "mapping" : "sequence", t.result = p, !0;
      if (g ? I === 44 && E(t, "expected the node content, but found ','") : E(t, "missed comma between flow collection entries"), M = S = R = null, b = x = !1, I === 63) {
        const D = t.input.charCodeAt(t.position + 1);
        B(D) && (b = x = !0, t.position++, U(t, !0, d));
      }
      _ = t.line, m = t.lineStart, w = t.position, ne(t, d, s, !1, !0), M = t.tag, S = t.result, U(t, !0, d), I = t.input.charCodeAt(t.position), (x || t.line === _) && I === 58 && (b = !0, I = t.input.charCodeAt(++t.position), U(t, !0, d), ne(t, d, s, !1, !0), R = t.result), $ ? ee(t, p, C, M, S, R, _, m, w) : b ? p.push(ee(t, null, C, M, S, R, _, m, w)) : p.push(S), U(t, !0, d), I = t.input.charCodeAt(t.position), I === 44 ? (g = !0, I = t.input.charCodeAt(++t.position)) : g = !1;
    }
    E(t, "unexpected end of the stream within a flow collection");
  }
  function Je(t, d) {
    let g, _ = u, m = !1, w = !1, o = d, p = 0, A = !1, v, b = t.input.charCodeAt(t.position);
    if (b === 124)
      g = !1;
    else if (b === 62)
      g = !0;
    else
      return !1;
    for (t.kind = "scalar", t.result = ""; b !== 0; )
      if (b = t.input.charCodeAt(++t.position), b === 43 || b === 45)
        u === _ ? _ = b === 43 ? y : f : E(t, "repeat of a chomping mode identifier");
      else if ((v = Be(b)) >= 0)
        v === 0 ? E(t, "bad explicit indentation width of a block scalar; it cannot be less than one") : w ? E(t, "repeat of an indentation width identifier") : (o = d + v - 1, w = !0);
      else
        break;
    if (G(b)) {
      do
        b = t.input.charCodeAt(++t.position);
      while (G(b));
      if (b === 35)
        do
          b = t.input.charCodeAt(++t.position);
        while (!W(b) && b !== 0);
    }
    for (; b !== 0; ) {
      for (_e(t), t.lineIndent = 0, b = t.input.charCodeAt(t.position); (!w || t.lineIndent < o) && b === 32; )
        t.lineIndent++, b = t.input.charCodeAt(++t.position);
      if (!w && t.lineIndent > o && (o = t.lineIndent), W(b)) {
        p++;
        continue;
      }
      if (!w && o === 0 && E(t, "missing indentation for block scalar"), t.lineIndent < o) {
        _ === y ? t.result += e.repeat(`
`, m ? 1 + p : p) : _ === u && m && (t.result += `
`);
        break;
      }
      g ? G(b) ? (A = !0, t.result += e.repeat(`
`, m ? 1 + p : p)) : A ? (A = !1, t.result += e.repeat(`
`, p + 1)) : p === 0 ? m && (t.result += " ") : t.result += e.repeat(`
`, p) : t.result += e.repeat(`
`, m ? 1 + p : p), m = !0, w = !0, p = 0;
      const x = t.position;
      for (; !W(b) && b !== 0; )
        b = t.input.charCodeAt(++t.position);
      V(t, x, t.position, !1);
    }
    return !0;
  }
  function ie(t, d) {
    const g = t.tag, _ = t.anchor, m = [];
    let w = !1;
    if (t.firstTabInLine !== -1) return !1;
    t.anchor !== null && X(t, t.anchor, m);
    let o = t.input.charCodeAt(t.position);
    for (; o !== 0 && (t.firstTabInLine !== -1 && (t.position = t.firstTabInLine, E(t, "tab characters must not be used in indentation")), o === 45); ) {
      const p = t.input.charCodeAt(t.position + 1);
      if (!B(p))
        break;
      if (w = !0, t.position++, U(t, !0, -1) && t.lineIndent <= d) {
        m.push(null), o = t.input.charCodeAt(t.position);
        continue;
      }
      const A = t.line;
      if (ne(t, d, c, !1, !0), m.push(t.result), U(t, !0, -1), o = t.input.charCodeAt(t.position), (t.line === A || t.lineIndent > d) && o !== 0)
        E(t, "bad indentation of a sequence entry");
      else if (t.lineIndent < d)
        break;
    }
    return w ? (t.tag = g, t.anchor = _, t.kind = "sequence", t.result = m, !0) : !1;
  }
  function Ze(t, d, g) {
    let _, m, w, o;
    const p = t.tag, A = t.anchor, v = {}, b = /* @__PURE__ */ Object.create(null);
    let x = null, $ = null, C = null, S = !1, M = !1;
    if (t.firstTabInLine !== -1) return !1;
    t.anchor !== null && X(t, t.anchor, v);
    let R = t.input.charCodeAt(t.position);
    for (; R !== 0; ) {
      !S && t.firstTabInLine !== -1 && (t.position = t.firstTabInLine, E(t, "tab characters must not be used in indentation"));
      const I = t.input.charCodeAt(t.position + 1), D = t.line;
      if ((R === 63 || R === 58) && B(I))
        R === 63 ? (S && (ee(t, v, b, x, $, null, m, w, o), x = $ = C = null), M = !0, S = !0, _ = !0) : S ? (S = !1, _ = !0) : E(t, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), t.position += 1, R = I;
      else {
        if (m = t.line, w = t.lineStart, o = t.position, !ne(t, g, a, !1, !0))
          break;
        if (t.line === D) {
          for (R = t.input.charCodeAt(t.position); G(R); )
            R = t.input.charCodeAt(++t.position);
          if (R === 58)
            R = t.input.charCodeAt(++t.position), B(R) || E(t, "a whitespace character is expected after the key-value separator within a block mapping"), S && (ee(t, v, b, x, $, null, m, w, o), x = $ = C = null), M = !0, S = !1, _ = !1, x = t.tag, $ = t.result;
          else if (M)
            E(t, "can not read an implicit mapping pair; a colon is missed");
          else
            return t.tag = p, t.anchor = A, !0;
        } else if (M)
          E(t, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return t.tag = p, t.anchor = A, !0;
      }
      if ((t.line === D || t.lineIndent > d) && (S && (m = t.line, w = t.lineStart, o = t.position), ne(t, d, h, !0, _) && (S ? $ = t.result : C = t.result), S || (ee(t, v, b, x, $, C, m, w, o), x = $ = C = null), U(t, !0, -1), R = t.input.charCodeAt(t.position)), (t.line === D || t.lineIndent > d) && R !== 0)
        E(t, "bad indentation of a mapping entry");
      else if (t.lineIndent < d)
        break;
    }
    return S && ee(t, v, b, x, $, null, m, w, o), M && (t.tag = p, t.anchor = A, t.kind = "mapping", t.result = v), M;
  }
  function gt(t) {
    let d = !1, g = !1, _, m, w = t.input.charCodeAt(t.position);
    if (w !== 33) return !1;
    t.tag !== null && E(t, "duplication of a tag property"), w = t.input.charCodeAt(++t.position), w === 60 ? (d = !0, w = t.input.charCodeAt(++t.position)) : w === 33 ? (g = !0, _ = "!!", w = t.input.charCodeAt(++t.position)) : _ = "!";
    let o = t.position;
    if (d) {
      do
        w = t.input.charCodeAt(++t.position);
      while (w !== 0 && w !== 62);
      t.position < t.length ? (m = t.input.slice(o, t.position), w = t.input.charCodeAt(++t.position)) : E(t, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; w !== 0 && !B(w); )
        w === 33 && (g ? E(t, "tag suffix cannot contain exclamation marks") : (_ = t.input.slice(o - 1, t.position + 1), P.test(_) || E(t, "named tag handle cannot contain such characters"), g = !0, o = t.position + 1)), w = t.input.charCodeAt(++t.position);
      m = t.input.slice(o, t.position), H.test(m) && E(t, "tag suffix cannot contain flow indicator characters");
    }
    m && !J.test(m) && E(t, "tag name cannot contain such characters: " + m);
    try {
      m = decodeURIComponent(m);
    } catch {
      E(t, "tag name is malformed: " + m);
    }
    return d ? t.tag = m : l.call(t.tagMap, _) ? t.tag = t.tagMap[_] + m : _ === "!" ? t.tag = "!" + m : _ === "!!" ? t.tag = "tag:yaml.org,2002:" + m : E(t, 'undeclared tag handle "' + _ + '"'), !0;
  }
  function Qe(t) {
    let d = t.input.charCodeAt(t.position);
    if (d !== 38) return !1;
    t.anchor !== null && E(t, "duplication of an anchor property"), d = t.input.charCodeAt(++t.position);
    const g = t.position;
    for (; d !== 0 && !B(d) && !oe(d); )
      d = t.input.charCodeAt(++t.position);
    return t.position === g && E(t, "name of an anchor node must contain at least one character"), t.anchor = t.input.slice(g, t.position), !0;
  }
  function Xe(t) {
    let d = t.input.charCodeAt(t.position);
    if (d !== 42) return !1;
    d = t.input.charCodeAt(++t.position);
    const g = t.position;
    for (; d !== 0 && !B(d) && !oe(d); )
      d = t.input.charCodeAt(++t.position);
    t.position === g && E(t, "name of an alias node must contain at least one character");
    const _ = t.input.slice(g, t.position);
    return l.call(t.anchorMap, _) || E(t, 'unidentified alias "' + _ + '"'), t.result = t.anchorMap[_], U(t, !0, -1), !0;
  }
  function yt(t, d, g, _) {
    const m = Ee(t);
    return ft(t), be(t, d), t.tag = null, t.anchor = null, t.kind = null, t.result = null, Ze(t, g, _) && t.kind === "mapping" ? (he(t), !0) : (mt(t), be(t, m), !1);
  }
  function ne(t, d, g, _, m) {
    let w, o, p = 1, A = !1, v = !1, b = null, x, $, C;
    t.depth >= t.maxDepth && E(t, "nesting exceeded maxDepth (" + t.maxDepth + ")"), t.depth += 1, t.listener !== null && t.listener("open", t), t.tag = null, t.anchor = null, t.kind = null, t.result = null;
    const S = w = o = h === g || c === g;
    if (_ && U(t, !0, -1) && (A = !0, t.lineIndent > d ? p = 1 : t.lineIndent === d ? p = 0 : t.lineIndent < d && (p = -1)), p === 1)
      for (; ; ) {
        const M = t.input.charCodeAt(t.position), R = Ee(t);
        if (A && (M === 33 && t.tag !== null || M === 38 && t.anchor !== null) || !gt(t) && !Qe(t))
          break;
        b === null && (b = R), U(t, !0, -1) ? (A = !0, o = S, t.lineIndent > d ? p = 1 : t.lineIndent === d ? p = 0 : t.lineIndent < d && (p = -1)) : o = !1;
      }
    if (o && (o = A || m), p === 1 || h === g)
      if (s === g || a === g ? $ = d : $ = d + 1, C = t.position - t.lineStart, p === 1)
        if (o && (ie(t, C) || Ze(t, C, $)) || Ve(t, $))
          v = !0;
        else {
          const M = t.input.charCodeAt(t.position);
          b !== null && S && !o && M !== 124 && M !== 62 && yt(
            t,
            b,
            b.position - b.lineStart,
            $
          ) || w && Je(t, $) || Ge(t, $) || Oe(t, $) ? v = !0 : Xe(t) ? (v = !0, (t.tag !== null || t.anchor !== null) && E(t, "alias node should not have any properties")) : We(t, $, s === g) && (v = !0, t.tag === null && (t.tag = "?")), t.anchor !== null && X(t, t.anchor, t.result);
        }
      else p === 0 && (v = o && ie(t, C));
    if (t.tag === null)
      t.anchor !== null && X(t, t.anchor, t.result);
    else if (t.tag === "?") {
      t.result !== null && t.kind !== "scalar" && E(t, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + t.kind + '"');
      for (let M = 0, R = t.implicitTypes.length; M < R; M += 1)
        if (x = t.implicitTypes[M], x.resolve(t.result)) {
          t.result = x.construct(t.result), t.tag = x.tag, t.anchor !== null && X(t, t.anchor, t.result);
          break;
        }
    } else if (t.tag !== "!") {
      if (l.call(t.typeMap[t.kind || "fallback"], t.tag))
        x = t.typeMap[t.kind || "fallback"][t.tag];
      else {
        x = null;
        const M = t.typeMap.multi[t.kind || "fallback"];
        for (let R = 0, I = M.length; R < I; R += 1)
          if (t.tag.slice(0, M[R].tag.length) === M[R].tag) {
            x = M[R];
            break;
          }
      }
      x || E(t, "unknown tag !<" + t.tag + ">"), t.result !== null && x.kind !== t.kind && E(t, "unacceptable node kind for !<" + t.tag + '> tag; it should be "' + x.kind + '", not "' + t.kind + '"'), x.resolve(t.result, t.tag) ? (t.result = x.construct(t.result, t.tag), t.anchor !== null && X(t, t.anchor, t.result)) : E(t, "cannot resolve a node with !<" + t.tag + "> explicit tag");
    }
    return t.listener !== null && t.listener("close", t), t.depth -= 1, t.tag !== null || t.anchor !== null || v;
  }
  function vt(t) {
    const d = t.position;
    let g = !1, _;
    for (t.version = null, t.checkLineBreaks = t.legacy, t.tagMap = /* @__PURE__ */ Object.create(null), t.anchorMap = /* @__PURE__ */ Object.create(null); (_ = t.input.charCodeAt(t.position)) !== 0 && (U(t, !0, -1), _ = t.input.charCodeAt(t.position), !(t.lineIndent > 0 || _ !== 37)); ) {
      g = !0, _ = t.input.charCodeAt(++t.position);
      let m = t.position;
      for (; _ !== 0 && !B(_); )
        _ = t.input.charCodeAt(++t.position);
      const w = t.input.slice(m, t.position), o = [];
      for (w.length < 1 && E(t, "directive name must not be less than one character in length"); _ !== 0; ) {
        for (; G(_); )
          _ = t.input.charCodeAt(++t.position);
        if (_ === 35) {
          do
            _ = t.input.charCodeAt(++t.position);
          while (_ !== 0 && !W(_));
          break;
        }
        if (W(_)) break;
        for (m = t.position; _ !== 0 && !B(_); )
          _ = t.input.charCodeAt(++t.position);
        o.push(t.input.slice(m, t.position));
      }
      _ !== 0 && _e(t), l.call(je, w) ? je[w](t, w, o) : ve(t, 'unknown document directive "' + w + '"');
    }
    if (U(t, !0, -1), t.lineIndent === 0 && t.input.charCodeAt(t.position) === 45 && t.input.charCodeAt(t.position + 1) === 45 && t.input.charCodeAt(t.position + 2) === 45 ? (t.position += 3, U(t, !0, -1)) : g && E(t, "directives end mark is expected"), ne(t, t.lineIndent - 1, h, !1, !0), U(t, !0, -1), t.checkLineBreaks && q.test(t.input.slice(d, t.position)) && ve(t, "non-ASCII line breaks are interpreted as content"), t.documents.push(t.result), t.position === t.lineStart && $e(t)) {
      t.input.charCodeAt(t.position) === 46 && (t.position += 3, U(t, !0, -1));
      return;
    }
    t.position < t.length - 1 && E(t, "end of the stream or a document separator is expected");
  }
  function et(t, d) {
    t = String(t), d = d || {}, t.length !== 0 && (t.charCodeAt(t.length - 1) !== 10 && t.charCodeAt(t.length - 1) !== 13 && (t += `
`), t.charCodeAt(0) === 65279 && (t = t.slice(1)));
    const g = new Y(t, d), _ = t.indexOf("\0");
    for (_ !== -1 && (g.position = _, E(g, "null byte is not allowed in input")), g.input += "\0"; g.input.charCodeAt(g.position) === 32; )
      g.lineIndent += 1, g.position += 1;
    for (; g.position < g.length - 1; )
      vt(g);
    return g.documents;
  }
  function tt(t, d, g) {
    d !== null && typeof d == "object" && typeof g > "u" && (g = d, d = null);
    const _ = et(t, g);
    if (typeof d != "function")
      return _;
    for (let m = 0, w = _.length; m < w; m += 1)
      d(_[m]);
  }
  function bt(t, d) {
    const g = et(t, d);
    if (g.length !== 0) {
      if (g.length === 1)
        return g[0];
      throw new i("expected a single document in the stream, but found more");
    }
  }
  return it.loadAll = tt, it.load = bt, it;
}
var Ht = {}, Di;
function Jn() {
  if (Di) return Ht;
  Di = 1;
  const e = Ye(), i = He(), n = ii(), r = Object.prototype.toString, l = Object.prototype.hasOwnProperty, s = 65279, a = 9, c = 10, h = 13, u = 32, f = 33, y = 34, T = 35, q = 37, H = 38, P = 39, J = 42, pe = 44, W = 45, G = 58, B = 61, oe = 62, dt = 63, pt = 64, Be = 91, Se = 93, ht = 96, Ce = 123, ze = 124, Te = 125, Y = {};
  Y[0] = "\\0", Y[7] = "\\a", Y[8] = "\\b", Y[9] = "\\t", Y[10] = "\\n", Y[11] = "\\v", Y[12] = "\\f", Y[13] = "\\r", Y[27] = "\\e", Y[34] = '\\"', Y[92] = "\\\\", Y[133] = "\\N", Y[160] = "\\_", Y[8232] = "\\L", Y[8233] = "\\P";
  const Ke = [
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
  function ve(o, p) {
    if (p === null) return {};
    const A = {}, v = Object.keys(p);
    for (let b = 0, x = v.length; b < x; b += 1) {
      let $ = v[b], C = String(p[$]);
      $.slice(0, 2) === "!!" && ($ = "tag:yaml.org,2002:" + $.slice(2));
      const S = o.compiledTypeMap.fallback[$];
      S && l.call(S.styleAliases, C) && (C = S.styleAliases[C]), A[$] = C;
    }
    return A;
  }
  function X(o) {
    let p, A;
    const v = o.toString(16).toUpperCase();
    if (o <= 255)
      p = "x", A = 2;
    else if (o <= 65535)
      p = "u", A = 4;
    else if (o <= 4294967295)
      p = "U", A = 8;
    else
      throw new i("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + p + e.repeat("0", A - v.length) + v;
  }
  const ft = 1, he = 2;
  function mt(o) {
    this.schema = o.schema || n, this.indent = Math.max(1, o.indent || 2), this.noArrayIndent = o.noArrayIndent || !1, this.skipInvalid = o.skipInvalid || !1, this.flowLevel = e.isNothing(o.flowLevel) ? -1 : o.flowLevel, this.styleMap = ve(this.schema, o.styles || null), this.sortKeys = o.sortKeys || !1, this.lineWidth = o.lineWidth || 80, this.noRefs = o.noRefs || !1, this.noCompatMode = o.noCompatMode || !1, this.condenseFlow = o.condenseFlow || !1, this.quotingType = o.quotingType === '"' ? he : ft, this.forceQuotes = o.forceQuotes || !1, this.replacer = typeof o.replacer == "function" ? o.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function Ee(o, p) {
    const A = e.repeat(" ", p);
    let v = 0, b = "";
    const x = o.length;
    for (; v < x; ) {
      let $;
      const C = o.indexOf(`
`, v);
      C === -1 ? ($ = o.slice(v), v = x) : ($ = o.slice(v, C + 1), v = C + 1), $.length && $ !== `
` && (b += A), b += $;
    }
    return b;
  }
  function be(o, p) {
    return `
` + e.repeat(" ", o.indent * p);
  }
  function je(o, p) {
    for (let A = 0, v = o.implicitTypes.length; A < v; A += 1)
      if (o.implicitTypes[A].resolve(p))
        return !0;
    return !1;
  }
  function V(o) {
    return o === u || o === a;
  }
  function se(o) {
    return o >= 32 && o <= 126 || o >= 161 && o <= 55295 && o !== 8232 && o !== 8233 || o >= 57344 && o <= 65533 && o !== s || o >= 65536 && o <= 1114111;
  }
  function ee(o) {
    return se(o) && o !== s && // - b-char
    o !== h && o !== c;
  }
  function _e(o, p, A) {
    const v = ee(o), b = v && !V(o);
    return (
      // ns-plain-safe
      (A ? v : v && // - c-flow-indicator
      o !== pe && o !== Be && o !== Se && o !== Ce && o !== Te) && // ns-plain-char
      o !== T && // false on '#'
      !(p === G && !b) || // false on ': '
      ee(p) && !V(p) && o === T || // change to true on '[^ ]#'
      p === G && b
    );
  }
  function U(o) {
    return se(o) && o !== s && !V(o) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    o !== W && o !== dt && o !== G && o !== pe && o !== Be && o !== Se && o !== Ce && o !== Te && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    o !== T && o !== H && o !== J && o !== f && o !== ze && o !== B && o !== oe && o !== P && o !== y && // | “%” | “@” | “`”)
    o !== q && o !== pt && o !== ht;
  }
  function $e(o) {
    return !V(o) && o !== G;
  }
  function te(o, p) {
    const A = o.charCodeAt(p);
    let v;
    return A >= 55296 && A <= 56319 && p + 1 < o.length && (v = o.charCodeAt(p + 1), v >= 56320 && v <= 57343) ? (A - 55296) * 1024 + v - 56320 + 65536 : A;
  }
  function We(o) {
    return /^\n* /.test(o);
  }
  const Ge = 1, Oe = 2, Ve = 3, Je = 4, ie = 5;
  function Ze(o, p, A, v, b, x, $, C) {
    let S, M = 0, R = null, I = !1, D = !1;
    const ni = v !== -1;
    let Me = -1, Re = U(te(o, 0)) && $e(te(o, o.length - 1));
    if (p || $)
      for (S = 0; S < o.length; M >= 65536 ? S += 2 : S++) {
        if (M = te(o, S), !se(M))
          return ie;
        Re = Re && _e(M, R, C), R = M;
      }
    else {
      for (S = 0; S < o.length; M >= 65536 ? S += 2 : S++) {
        if (M = te(o, S), M === c)
          I = !0, ni && (D = D || // Foldable line = too long, and not more-indented.
          S - Me - 1 > v && o[Me + 1] !== " ", Me = S);
        else if (!se(M))
          return ie;
        Re = Re && _e(M, R, C), R = M;
      }
      D = D || ni && S - Me - 1 > v && o[Me + 1] !== " ";
    }
    return !I && !D ? Re && !$ && !b(o) ? Ge : x === he ? ie : Oe : A > 9 && We(o) ? ie : $ ? x === he ? ie : Oe : D ? Je : Ve;
  }
  function gt(o, p, A, v, b) {
    o.dump = (function() {
      if (p.length === 0)
        return o.quotingType === he ? '""' : "''";
      if (!o.noCompatMode && (Ke.indexOf(p) !== -1 || E.test(p)))
        return o.quotingType === he ? '"' + p + '"' : "'" + p + "'";
      const x = o.indent * Math.max(1, A), $ = o.lineWidth === -1 ? -1 : Math.max(Math.min(o.lineWidth, 40), o.lineWidth - x), C = v || // No block styles in flow mode.
      o.flowLevel > -1 && A >= o.flowLevel;
      function S(M) {
        return je(o, M);
      }
      switch (Ze(
        p,
        C,
        o.indent,
        $,
        S,
        o.quotingType,
        o.forceQuotes && !v,
        b
      )) {
        case Ge:
          return p;
        case Oe:
          return "'" + p.replace(/'/g, "''") + "'";
        case Ve:
          return "|" + Qe(p, o.indent) + Xe(Ee(p, x));
        case Je:
          return ">" + Qe(p, o.indent) + Xe(Ee(yt(p, $), x));
        case ie:
          return '"' + vt(p) + '"';
        default:
          throw new i("impossible error: invalid scalar style");
      }
    })();
  }
  function Qe(o, p) {
    const A = We(o) ? String(p) : "", v = o[o.length - 1] === `
`, x = v && (o[o.length - 2] === `
` || o === `
`) ? "+" : v ? "" : "-";
    return A + x + `
`;
  }
  function Xe(o) {
    return o[o.length - 1] === `
` ? o.slice(0, -1) : o;
  }
  function yt(o, p) {
    const A = /(\n+)([^\n]*)/g;
    let v = (function() {
      let C = o.indexOf(`
`);
      return C = C !== -1 ? C : o.length, A.lastIndex = C, ne(o.slice(0, C), p);
    })(), b = o[0] === `
` || o[0] === " ", x, $;
    for (; $ = A.exec(o); ) {
      const C = $[1], S = $[2];
      x = S[0] === " ", v += C + (!b && !x && S !== "" ? `
` : "") + ne(S, p), b = x;
    }
    return v;
  }
  function ne(o, p) {
    if (o === "" || o[0] === " ") return o;
    const A = / [^ ]/g;
    let v, b = 0, x, $ = 0, C = 0, S = "";
    for (; v = A.exec(o); )
      C = v.index, C - b > p && (x = $ > b ? $ : C, S += `
` + o.slice(b, x), b = x + 1), $ = C;
    return S += `
`, o.length - b > p && $ > b ? S += o.slice(b, $) + `
` + o.slice($ + 1) : S += o.slice(b), S.slice(1);
  }
  function vt(o) {
    let p = "", A = 0;
    for (let v = 0; v < o.length; A >= 65536 ? v += 2 : v++) {
      A = te(o, v);
      const b = Y[A];
      !b && se(A) ? (p += o[v], A >= 65536 && (p += o[v + 1])) : p += b || X(A);
    }
    return p;
  }
  function et(o, p, A) {
    let v = "";
    const b = o.tag;
    for (let x = 0, $ = A.length; x < $; x += 1) {
      let C = A[x];
      o.replacer && (C = o.replacer.call(A, String(x), C)), (g(o, p, C, !1, !1) || typeof C > "u" && g(o, p, null, !1, !1)) && (v !== "" && (v += "," + (o.condenseFlow ? "" : " ")), v += o.dump);
    }
    o.tag = b, o.dump = "[" + v + "]";
  }
  function tt(o, p, A, v) {
    let b = "";
    const x = o.tag;
    for (let $ = 0, C = A.length; $ < C; $ += 1) {
      let S = A[$];
      o.replacer && (S = o.replacer.call(A, String($), S)), (g(o, p + 1, S, !0, !0, !1, !0) || typeof S > "u" && g(o, p + 1, null, !0, !0, !1, !0)) && ((!v || b !== "") && (b += be(o, p)), o.dump && c === o.dump.charCodeAt(0) ? b += "-" : b += "- ", b += o.dump);
    }
    o.tag = x, o.dump = b || "[]";
  }
  function bt(o, p, A) {
    let v = "";
    const b = o.tag, x = Object.keys(A);
    for (let $ = 0, C = x.length; $ < C; $ += 1) {
      let S = "";
      v !== "" && (S += ", "), o.condenseFlow && (S += '"');
      const M = x[$];
      let R = A[M];
      o.replacer && (R = o.replacer.call(A, M, R)), g(o, p, M, !1, !1) && (o.dump.length > 1024 && (S += "? "), S += o.dump + (o.condenseFlow ? '"' : "") + ":" + (o.condenseFlow ? "" : " "), g(o, p, R, !1, !1) && (S += o.dump, v += S));
    }
    o.tag = b, o.dump = "{" + v + "}";
  }
  function t(o, p, A, v) {
    let b = "";
    const x = o.tag, $ = Object.keys(A);
    if (o.sortKeys === !0)
      $.sort();
    else if (typeof o.sortKeys == "function")
      $.sort(o.sortKeys);
    else if (o.sortKeys)
      throw new i("sortKeys must be a boolean or a function");
    for (let C = 0, S = $.length; C < S; C += 1) {
      let M = "";
      (!v || b !== "") && (M += be(o, p));
      const R = $[C];
      let I = A[R];
      if (o.replacer && (I = o.replacer.call(A, R, I)), !g(o, p + 1, R, !0, !0, !0))
        continue;
      const D = o.tag !== null && o.tag !== "?" || o.dump && o.dump.length > 1024;
      D && (o.dump && c === o.dump.charCodeAt(0) ? M += "?" : M += "? "), M += o.dump, D && (M += be(o, p)), g(o, p + 1, I, !0, D) && (o.dump && c === o.dump.charCodeAt(0) ? M += ":" : M += ": ", M += o.dump, b += M);
    }
    o.tag = x, o.dump = b || "{}";
  }
  function d(o, p, A) {
    const v = A ? o.explicitTypes : o.implicitTypes;
    for (let b = 0, x = v.length; b < x; b += 1) {
      const $ = v[b];
      if (($.instanceOf || $.predicate) && (!$.instanceOf || typeof p == "object" && p instanceof $.instanceOf) && (!$.predicate || $.predicate(p))) {
        if (A ? $.multi && $.representName ? o.tag = $.representName(p) : o.tag = $.tag : o.tag = "?", $.represent) {
          const C = o.styleMap[$.tag] || $.defaultStyle;
          let S;
          if (r.call($.represent) === "[object Function]")
            S = $.represent(p, C);
          else if (l.call($.represent, C))
            S = $.represent[C](p, C);
          else
            throw new i("!<" + $.tag + '> tag resolver accepts not "' + C + '" style');
          o.dump = S;
        }
        return !0;
      }
    }
    return !1;
  }
  function g(o, p, A, v, b, x, $) {
    o.tag = null, o.dump = A, d(o, A, !1) || d(o, A, !0);
    const C = r.call(o.dump), S = v;
    v && (v = o.flowLevel < 0 || o.flowLevel > p);
    const M = C === "[object Object]" || C === "[object Array]";
    let R, I;
    if (M && (R = o.duplicates.indexOf(A), I = R !== -1), (o.tag !== null && o.tag !== "?" || I || o.indent !== 2 && p > 0) && (b = !1), I && o.usedDuplicates[R])
      o.dump = "*ref_" + R;
    else {
      if (M && I && !o.usedDuplicates[R] && (o.usedDuplicates[R] = !0), C === "[object Object]")
        v && Object.keys(o.dump).length !== 0 ? (t(o, p, o.dump, b), I && (o.dump = "&ref_" + R + o.dump)) : (bt(o, p, o.dump), I && (o.dump = "&ref_" + R + " " + o.dump));
      else if (C === "[object Array]")
        v && o.dump.length !== 0 ? (o.noArrayIndent && !$ && p > 0 ? tt(o, p - 1, o.dump, b) : tt(o, p, o.dump, b), I && (o.dump = "&ref_" + R + o.dump)) : (et(o, p, o.dump), I && (o.dump = "&ref_" + R + " " + o.dump));
      else if (C === "[object String]")
        o.tag !== "?" && gt(o, o.dump, p, x, S);
      else {
        if (C === "[object Undefined]")
          return !1;
        if (o.skipInvalid) return !1;
        throw new i("unacceptable kind of an object to dump " + C);
      }
      if (o.tag !== null && o.tag !== "?") {
        let D = encodeURI(
          o.tag[0] === "!" ? o.tag.slice(1) : o.tag
        ).replace(/!/g, "%21");
        o.tag[0] === "!" ? D = "!" + D : D.slice(0, 18) === "tag:yaml.org,2002:" ? D = "!!" + D.slice(18) : D = "!<" + D + ">", o.dump = D + " " + o.dump;
      }
    }
    return !0;
  }
  function _(o, p) {
    const A = [], v = [];
    m(o, A, v);
    const b = v.length;
    for (let x = 0; x < b; x += 1)
      p.duplicates.push(A[v[x]]);
    p.usedDuplicates = new Array(b);
  }
  function m(o, p, A) {
    if (o !== null && typeof o == "object") {
      const v = p.indexOf(o);
      if (v !== -1)
        A.indexOf(v) === -1 && A.push(v);
      else if (p.push(o), Array.isArray(o))
        for (let b = 0, x = o.length; b < x; b += 1)
          m(o[b], p, A);
      else {
        const b = Object.keys(o);
        for (let x = 0, $ = b.length; x < $; x += 1)
          m(o[b[x]], p, A);
      }
    }
  }
  function w(o, p) {
    p = p || {};
    const A = new mt(p);
    A.noRefs || _(o, A);
    let v = o;
    return A.replacer && (v = A.replacer.call({ "": v }, "", v)), g(A, 0, v, !0, !0) ? A.dump + `
` : "";
  }
  return Ht.dump = w, Ht;
}
var Pi;
function Zn() {
  if (Pi) return z;
  Pi = 1;
  const e = Vn(), i = Jn();
  function n(r, l) {
    return function() {
      throw new Error("Function yaml." + r + " is removed in js-yaml 4. Use yaml." + l + " instead, which is now safe by default.");
    };
  }
  return z.Type = j(), z.Schema = en(), z.FAILSAFE_SCHEMA = on(), z.JSON_SCHEMA = un(), z.CORE_SCHEMA = dn(), z.DEFAULT_SCHEMA = ii(), z.load = e.load, z.loadAll = e.loadAll, z.dump = i.dump, z.YAMLException = He(), z.types = {
    binary: fn(),
    float: cn(),
    map: rn(),
    null: sn(),
    pairs: gn(),
    set: yn(),
    timestamp: pn(),
    bool: ln(),
    int: an(),
    merge: hn(),
    omap: mn(),
    seq: nn(),
    str: tn()
  }, z.safeLoad = n("safeLoad", "load"), z.safeLoadAll = n("safeLoadAll", "loadAll"), z.safeDump = n("safeDump", "dump"), z;
}
var Qn = Zn();
const Xn = /* @__PURE__ */ Wn(Qn), {
  Type: Rr,
  Schema: qr,
  FAILSAFE_SCHEMA: Ir,
  JSON_SCHEMA: Lr,
  CORE_SCHEMA: Nr,
  DEFAULT_SCHEMA: Fr,
  load: Ae,
  loadAll: Dr,
  dump: re,
  YAMLException: Pr,
  types: Ur,
  safeLoad: Yr,
  safeLoadAll: Hr,
  safeDump: Br
} = Xn, ut = (e, i, n = {}) => e.callWS({ type: `deferred_actions/${i}`, data: n }), er = (e) => ut(e, "list", { limit: null }), tr = (e, i) => ut(e, "create", i), ir = (e, i) => e.callService("deferred_actions", "run_for", i, void 0, !0, !0), nr = (e, i) => ut(e, "update", i), rr = (e, i, n, r = {}) => ut(e, i, { job_id: n, ...r }), or = (e, i) => e.connection.subscribeMessage(i, { type: "deferred_actions/subscribe" }), ce = (e) => !!e && typeof e == "object" && !Array.isArray(e), vn = (e) => typeof e == "string" ? [e] : Array.isArray(e) && e.every((i) => typeof i == "string") ? [...e] : void 0, Z = (e, i, n = ["alias", "description", "enabled", "continue_on_error"]) => {
  const r = /* @__PURE__ */ new Set([...i, ...n]);
  return Object.keys(e).some((l) => !r.has(l)) ? void 0 : Object.fromEntries(Object.entries(e).filter(([l]) => n.includes(l)));
}, ot = (e) => Array.isArray(e) ? e.map((i) => ce(i) ? Wt(i) : { type: "unsupported", raw: { value: i } }) : void 0, bn = (e) => {
  const i = typeof e.action == "string" ? e.action : typeof e.service == "string" ? e.service : void 0;
  if (i && !(e.action !== void 0 && e.service !== void 0)) {
    const n = Z(e, ["action", "service", "target", "data"]), r = e.target ?? {}, l = e.data ?? {};
    if (n && ce(r) && ce(l) && Object.keys(r).every((s) => ["entity_id", "device_id", "area_id", "floor_id", "label_id"].includes(s))) {
      const s = {};
      for (const c of ["entity_id", "device_id", "area_id", "floor_id", "label_id"]) {
        const h = vn(r[c]);
        if (r[c] !== void 0 && !h) return { kind: "unsupported", raw: e };
        h?.length && (s[c] = h);
      }
      const a = Object.entries(l);
      if (a.every(([, c]) => c === null || ["string", "number", "boolean"].includes(typeof c))) return { kind: "service", action: i, syntax: e.service !== void 0 ? "service" : "action", target: s, scalarTargets: ["entity_id", "device_id", "area_id", "floor_id", "label_id"].filter((c) => typeof r[c] == "string"), data: a.map(([c, h]) => Gt(c, h)), metadata: n };
    }
  }
  if (Array.isArray(e.if) && Array.isArray(e.then)) {
    const n = Z(e, ["if", "then", "else"]), r = ot(e.if);
    if (n && r && (e.else === void 0 || Array.isArray(e.else))) return { kind: "if", conditions: r, then: ue(e.then), ...Array.isArray(e.else) ? { else: ue(e.else) } : {}, metadata: n };
  }
  if (Array.isArray(e.choose)) {
    const n = Z(e, ["choose", "default"]);
    if (n && (e.default === void 0 || Array.isArray(e.default))) {
      const r = [];
      for (const l of e.choose) {
        if (!ce(l) || !Array.isArray(l.conditions) || !Array.isArray(l.sequence)) return { kind: "unsupported", raw: e };
        const s = Z(l, ["conditions", "sequence"], ["alias"]), a = ot(l.conditions);
        if (!s || !a) return { kind: "unsupported", raw: e };
        r.push({ conditions: a, sequence: ue(l.sequence), metadata: s });
      }
      return { kind: "choose", choices: r, ...Array.isArray(e.default) ? { default: ue(e.default) } : {}, metadata: n };
    }
  }
  if (ce(e.repeat) && Array.isArray(e.repeat.sequence)) {
    const n = e.repeat, r = Z(e, ["repeat"]), l = Z(n, ["count", "while", "until", "for_each", "sequence"], []);
    if (r && l) {
      const s = ["count", "while", "until", "for_each"].filter((a) => n[a] !== void 0);
      if (s.length === 1) {
        const a = s[0], c = a === "while" || a === "until" ? ot(n[a]) : void 0;
        if (a !== "while" && a !== "until" || c) return { kind: "repeat", mode: a, ...c ? { conditions: c } : { value: n[a] }, sequence: ue(n.sequence), metadata: r };
      }
    }
  }
  if (Array.isArray(e.parallel)) {
    const n = Z(e, ["parallel"]);
    if (n) return { kind: "parallel", branches: e.parallel.map((r) => ce(r) && Array.isArray(r.sequence) && Z(r, ["sequence"], ["alias"]) ? { wrapped: !0, sequence: ue(r.sequence), metadata: Z(r, ["sequence"], ["alias"]) } : ce(r) ? { wrapped: !1, sequence: [bn(r)], metadata: {} } : { wrapped: !1, sequence: [{ kind: "unsupported", raw: { value: r } }], metadata: {} }), metadata: n };
  }
  if (e.delay !== void 0) {
    const n = Z(e, ["delay"]);
    if (n) return { kind: "delay", value: e.delay, metadata: n };
  }
  if (typeof e.wait_template == "string") {
    const n = Z(e, ["wait_template", "timeout", "continue_on_timeout"]);
    if (n && (e.continue_on_timeout === void 0 || typeof e.continue_on_timeout == "boolean")) return { kind: "wait_template", template: e.wait_template, ...e.timeout !== void 0 ? { timeout: e.timeout } : {}, ...typeof e.continue_on_timeout == "boolean" ? { continueOnTimeout: e.continue_on_timeout } : {}, metadata: n };
  }
  return { kind: "unsupported", raw: e };
}, ue = (e) => e.map((i) => ce(i) ? bn(i) : { kind: "unsupported", raw: { value: i } }), sr = (e) => {
  if (e.kind === "unsupported") return e.raw;
  if (e.kind === "service") {
    const i = Object.fromEntries(Object.entries(e.target).filter(([, r]) => r?.length).map(([r, l]) => [r, e.scalarTargets?.includes(r) && Array.isArray(l) && l.length === 1 ? l[0] : l])), n = Object.fromEntries(e.data.filter((r) => r.key.trim()).map((r) => [r.key.trim(), ar(r)]));
    return { ...e.metadata, [e.syntax ?? "action"]: e.action, ...Object.keys(i).length ? { target: i } : {}, ...Object.keys(n).length ? { data: n } : {} };
  }
  return e.kind === "if" ? { ...e.metadata, if: e.conditions.map(Ne), then: Q(e.then), ...e.else ? { else: Q(e.else) } : {} } : e.kind === "choose" ? { ...e.metadata, choose: e.choices.map((i) => ({ ...i.metadata, conditions: i.conditions.map(Ne), sequence: Q(i.sequence) })), ...e.default ? { default: Q(e.default) } : {} } : e.kind === "repeat" ? { ...e.metadata, repeat: { [e.mode]: e.conditions ? e.conditions.map(Ne) : e.value, sequence: Q(e.sequence) } } : e.kind === "parallel" ? { ...e.metadata, parallel: e.branches.map((i) => i.wrapped ? { ...i.metadata, sequence: Q(i.sequence) } : Q(i.sequence)[0]) } : e.kind === "delay" ? { ...e.metadata, delay: e.value } : { ...e.metadata, wait_template: e.template, ...e.timeout !== void 0 ? { timeout: e.timeout } : {}, ...e.continueOnTimeout !== void 0 ? { continue_on_timeout: e.continueOnTimeout } : {} };
}, Q = (e) => e.map(sr), Wt = (e) => {
  const i = typeof e.alias == "string" ? e.alias : void 0, n = (r) => Z(e, r, ["alias", "enabled"]);
  if (e.condition === "state" && n(["condition", "entity_id", "state"]) && typeof e.entity_id == "string" && typeof e.state == "string") return { type: "state", entity_id: e.entity_id, state: e.state, alias: i, metadata: n(["condition", "entity_id", "state"]) };
  if (e.condition === "numeric_state" && n(["condition", "entity_id", "above", "below"]) && typeof e.entity_id == "string" && [e.above, e.below].every((r) => r === void 0 || typeof r == "number")) return { type: "numeric_state", entity_id: e.entity_id, above: e.above === void 0 ? "" : String(e.above), below: e.below === void 0 ? "" : String(e.below), alias: i, metadata: n(["condition", "entity_id", "above", "below"]) };
  if (e.condition === "time" && n(["condition", "after", "before", "weekday"]) && [e.after, e.before].every((r) => r === void 0 || typeof r == "string")) {
    const r = vn(e.weekday);
    if (e.weekday === void 0 || r) return { type: "time", after: String(e.after ?? ""), before: String(e.before ?? ""), weekdays: r ?? [], weekdayScalar: typeof e.weekday == "string", alias: i, metadata: n(["condition", "after", "before", "weekday"]) };
  }
  return e.condition === "zone" && n(["condition", "entity_id", "zone"]) && typeof e.entity_id == "string" && typeof e.zone == "string" ? { type: "zone", entity_id: e.entity_id, zone: e.zone, alias: i, metadata: n(["condition", "entity_id", "zone"]) } : e.condition === "sun" && n(["condition", "after", "before", "after_offset", "before_offset"]) && [e.after, e.before, e.after_offset, e.before_offset].every((r) => r === void 0 || typeof r == "string") ? { type: "sun", after: String(e.after ?? ""), before: String(e.before ?? ""), after_offset: String(e.after_offset ?? ""), before_offset: String(e.before_offset ?? ""), alias: i, metadata: n(["condition", "after", "before", "after_offset", "before_offset"]) } : ["and", "or", "not"].includes(String(e.condition)) && Array.isArray(e.conditions) && n(["condition", "conditions"]) ? { type: e.condition, conditions: ot(e.conditions), alias: i, metadata: n(["condition", "conditions"]) } : { type: "unsupported", raw: e };
}, Ne = (e) => {
  if (e.type === "unsupported") return e.raw;
  const i = e.metadata;
  return e.type === "state" ? { ...i, condition: "state", entity_id: e.entity_id, state: e.state } : e.type === "numeric_state" ? { ...i, condition: "numeric_state", entity_id: e.entity_id, ...e.above.trim() ? { above: Number(e.above) } : {}, ...e.below.trim() ? { below: Number(e.below) } : {} } : e.type === "time" ? { ...i, condition: "time", ...e.after ? { after: e.after } : {}, ...e.before ? { before: e.before } : {}, ...e.weekdays.length ? { weekday: e.weekdayScalar && e.weekdays.length === 1 ? e.weekdays[0] : e.weekdays } : {} } : e.type === "zone" ? { ...i, condition: "zone", entity_id: e.entity_id, zone: e.zone } : e.type === "sun" ? { ...i, condition: "sun", ...e.after ? { after: e.after } : {}, ...e.before ? { before: e.before } : {}, ...e.after_offset ? { after_offset: e.after_offset } : {}, ...e.before_offset ? { before_offset: e.before_offset } : {} } : { ...i, condition: e.type, conditions: e.conditions.map(Ne) };
}, Ui = (e) => {
  if (e.length === 1 && ["and", "or"].includes(String(e[0]?.condition)) && Array.isArray(e[0]?.conditions)) {
    const i = Wt(e[0]);
    if (i.type === "and" || i.type === "or") return { operator: i.type, items: i.conditions, grouped: !0, metadata: i.metadata };
  }
  return { operator: "and", items: e.map(Wt) };
}, Bt = (e) => {
  const i = e.items.map(Ne);
  return (e.operator === "or" || e.grouped) && i.length ? [{ ...e.metadata ?? {}, condition: e.operator, conditions: i }] : i;
}, Yi = (e) => e === "service" ? { kind: e, action: "", target: {}, data: [], metadata: {} } : e === "if" ? { kind: e, conditions: [], then: [], metadata: {} } : e === "choose" ? { kind: e, choices: [{ conditions: [], sequence: [], metadata: {} }], metadata: {} } : e === "repeat" ? { kind: e, mode: "count", value: 1, sequence: [], metadata: {} } : e === "parallel" ? { kind: e, branches: [{ wrapped: !0, sequence: [], metadata: {} }, { wrapped: !0, sequence: [], metadata: {} }], metadata: {} } : e === "delay" ? { kind: e, value: { seconds: 1 }, metadata: {} } : e === "wait_template" ? { kind: e, template: "", metadata: {} } : { kind: "unsupported", raw: {} };
class K extends Error {
}
const lr = (e) => e === null ? "null" : typeof e == "number" ? "number" : typeof e == "boolean" ? "boolean" : "text", Gt = (e, i) => ({ key: e, type: lr(i), value: i, ...typeof i == "string" || typeof i == "number" ? { raw: String(i) } : {} }), ar = (e) => {
  if (e.type === "null") return null;
  if (e.type === "boolean") return e.value === !0;
  if (e.type === "text") return e.raw ?? String(e.value ?? "");
  const i = Number(e.raw ?? e.value);
  if (!Number.isFinite(i)) throw new K(`Enter a finite number for “${e.key || "this data field"}”.`);
  return i;
}, cr = (e, i) => {
  const n = e.raw ?? String(e.value ?? "");
  return i === "text" ? { ...e, type: i, value: n, raw: n } : i === "number" ? { ...e, type: i, raw: n } : i === "boolean" ? { ...e, type: i, value: e.value === !0 || n === "true" } : { ...e, type: i, value: null, raw: void 0 };
}, ur = (e) => {
  const i = e instanceof Error ? e.message : String(e), n = i.toLowerCase();
  return n.includes("expected_revision") || n.includes("revision") || n.includes("conflict") ? { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details: i } : n.includes("permission") || n.includes("unauthorized") || n.includes("admin") ? { message: "You need administrator access to manage deferred actions.", details: i } : n.includes("valid_until") ? { message: "‘Don’t run after’ must be later than the scheduled time.", details: i } : n.includes("condition") ? { message: "One or more conditions are incomplete or invalid.", details: i } : n.includes("sequence") || n.includes("action") ? { message: "The action sequence is incomplete or invalid.", details: i } : { message: "Home Assistant couldn’t save this deferred action.", details: i };
}, dr = (e) => {
  if (e instanceof K) return { message: e.message };
  const i = ur(e);
  return { message: i.message, ...i.details === i.message ? {} : { details: i.details } };
};
function zt(e, i = Date.now()) {
  const n = Math.round((new Date(e).getTime() - i) / 1e3), r = Math.abs(n), [l, s] = r >= 86400 ? [Math.round(r / 86400), "day"] : r >= 3600 ? [Math.round(r / 3600), "hour"] : r >= 60 ? [Math.round(r / 60), "minute"] : [r, "second"];
  return `${n < 0 ? "overdue by" : "in"} ${l} ${s}${l === 1 ? "" : "s"}`;
}
const ae = (e, i) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short",
  ...i ? { timeZone: i } : {}
}).format(new Date(e)), Hi = (e, i) => {
  const n = new Intl.DateTimeFormat("en-CA", { timeZone: i, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(e), r = (l) => n.find((s) => s.type === l)?.value ?? "";
  return `${r("year")}-${r("month")}-${r("day")}`;
}, pr = (e, i = /* @__PURE__ */ new Date(), n = "UTC") => {
  const r = [...e].sort((y, T) => y.execute_at.localeCompare(T.execute_at)), l = Hi(i, n), [s, a, c] = l.split("-").map(Number), h = new Date(Date.UTC(s, a - 1, c + 1)).toISOString().slice(0, 10);
  let u = !1;
  const f = /* @__PURE__ */ new Map();
  for (const y of r) {
    const T = new Date(y.execute_at);
    let q;
    if (y.status === "paused") q = "Paused";
    else if (T.getTime() < i.getTime()) q = "Overdue";
    else if (!u)
      q = "Next", u = !0;
    else {
      const H = Hi(T, n);
      q = H === l ? "Later today" : H === h ? "Tomorrow" : "Later";
    }
    f.set(q, [...f.get(q) ?? [], y]);
  }
  return ["Paused", "Overdue", "Next", "Later today", "Tomorrow", "Later"].flatMap((y) => f.has(y) ? [{ label: y, jobs: f.get(y) }] : []);
}, hr = (e, i) => {
  const n = i.trim().toLocaleLowerCase();
  return n ? [e.name, e.description, e.job_key, ...e.tags, ...e.target_entities, ...e.explicit_target_entities].filter(Boolean).some((r) => String(r).toLocaleLowerCase().includes(n)) : !0;
}, Bi = (e) => e.status === "completed" ? "Completed successfully" : e.status === "cancelled" ? /replac/i.test(e.terminal_reason ?? "") ? "Replaced by another scheduled action" : "Cancelled before it ran" : e.status === "missed" ? "Missed while Home Assistant was unavailable" : e.status === "skipped" ? /condition/i.test(e.terminal_reason ?? "") ? "Skipped because conditions were not met" : "Skipped by its overdue policy" : e.status === "expired" ? "Expired after its ‘don’t run after’ time" : e.status === "failed" ? /interrupt|restart|shutdown/i.test(`${e.terminal_reason ?? ""} ${e.last_error ?? ""}`) ? "Interrupted while running" : "Failed while running" : e.status, zi = (e) => typeof e.action == "string" || typeof e.service == "string" ? "service call" : e.if ? "If / Then" : e.choose ? "Choose" : e.repeat ? "Repeat" : e.parallel ? "Parallel" : e.delay !== void 0 ? "Delay" : e.wait_template ? "Wait for template" : "advanced action", fr = (e) => {
  if (!e.length) return "No actions configured";
  if (e.length === 1) {
    const n = e[0], r = n.action ?? n.service;
    return typeof r == "string" ? `Run ${r}` : `Run ${zi(n)} block`;
  }
  const i = e.map(zi);
  return `Run ${e.length} steps (${i.slice(0, 3).join(", ")}${i.length > 3 ? ", …" : ""}) in order`;
}, Kt = (e) => {
  const i = e.runFor ? `Run ${e.runFor.start}, then ${e.runFor.end} after ${e.runFor.duration}` : fr(e.sequence), n = e.hasConditions ? ` Conditions are checked at run time; if unmet, ${e.conditionFailure === "fail" ? "the job fails" : e.conditionFailure === "cancel" ? "the job is cancelled" : "this run is skipped"}.` : "", r = `${e.overdue ? ` ${e.overdue}.` : ""}${e.validUntil ? ` It will not run after ${e.validUntil}.` : ""}`;
  return `${e.when}: ${i}.${n}${r}`;
}, mr = [5, 15, 30, 60], jt = (e) => e?.explicit_target_entities ?? [], me = (e) => ["completed", "cancelled", "missed", "skipped", "expired"].includes(e), Ki = (e) => {
  const i = e.overdue_policy ? "job override" : "inherited";
  return e.effective_overdue_policy === "execute_within_grace" ? `Run only if less than ${e.effective_overdue_grace_minutes} minutes late (${i})` : `${e.effective_overdue_policy === "execute" ? "Run when Home Assistant comes back" : "Don’t run"} (${i})`;
}, gr = (e) => {
  if (!e) return !1;
  const i = Object.keys(e);
  if (i.length !== 1) return !1;
  const n = i[0];
  if (!n || !["number", "boolean", "select", "text", "time", "date", "datetime"].includes(n)) return !1;
  if (n === "select") {
    const r = e.select;
    if (r && typeof r == "object" && !Array.isArray(r) && r.multiple === !0) return !1;
  }
  return !0;
}, yr = (e, i) => {
  const [n, r, ...l] = i.split(".");
  return !n || !r || l.length ? {} : e.services?.[n]?.[r]?.fields ?? {};
}, _n = (e, i) => Object.entries(yr(e, i)).filter(([, n]) => gr(n.selector)).map(([n, r]) => ({ ...r, key: n, selector: r.selector })), vr = (e, i, n) => _n(e, i).find((r) => r.key === n), br = (e, i) => i === null || ["string", "number", "boolean"].includes(typeof i) ? i : Object.prototype.hasOwnProperty.call(e, "boolean") ? !1 : "", _r = (e) => {
  if (e.type === "null") return null;
  if (e.type === "boolean") return e.value === !0;
  if (e.type === "number") {
    const i = Number(e.raw ?? e.value);
    return Number.isFinite(i) ? i : void 0;
  }
  return e.raw ?? String(e.value ?? "");
}, $r = (e) => new Intl.DateTimeFormat("en-GB", {
  timeZone: e,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
}), Vt = (e, i) => {
  const n = $r(i).formatToParts(e), r = (l) => Number(n.find((s) => s.type === l)?.value);
  return { year: r("year"), month: r("month"), day: r("day"), hour: r("hour"), minute: r("minute"), second: r("second") };
}, Ar = (e) => {
  const i = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(e);
  if (!i) throw new RangeError("Invalid local date/time");
  const n = { year: Number(i[1]), month: Number(i[2]), day: Number(i[3]), hour: Number(i[4]), minute: Number(i[5]), second: Number(i[6] ?? 0) }, r = new Date(Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second));
  if (r.getUTCFullYear() !== n.year || r.getUTCMonth() + 1 !== n.month || r.getUTCDate() !== n.day || r.getUTCHours() !== n.hour || r.getUTCMinutes() !== n.minute || r.getUTCSeconds() !== n.second) throw new RangeError("Invalid local date/time");
  return n;
}, xr = (e, i) => e.year === i.year && e.month === i.month && e.day === i.day && e.hour === i.hour && e.minute === i.minute && e.second === i.second, ji = (e) => Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute, e.second), nt = (e) => String(e).padStart(2, "0"), wr = 3600 * 1e3, kr = (e, i) => {
  const n = ji(e), r = /* @__PURE__ */ new Set();
  for (let l = -48; l <= 48; l += 6) {
    const s = n + l * wr;
    r.add(ji(Vt(new Date(s), i)) - s);
  }
  return [...new Set([...r].map((l) => n - l).filter((l) => xr(Vt(new Date(l), i), e)))].sort((l, s) => l - s);
}, Sr = (e, i) => {
  const n = new Date(e);
  if (Number.isNaN(n.getTime())) throw new RangeError("Invalid timestamp");
  const r = Vt(n, i);
  return `${r.year}-${nt(r.month)}-${nt(r.day)}T${nt(r.hour)}:${nt(r.minute)}`;
}, Wi = (e, i) => {
  const n = kr(Ar(e), i);
  if (!n.length) throw new RangeError("This wall-clock time does not exist in the selected timezone");
  if (n.length > 1) throw new RangeError("This wall-clock time occurs twice because the clocks change; use an explicit-offset API timestamp to choose the intended occurrence");
  return new Date(n[0]).toISOString();
};
var Cr = Object.defineProperty, Tr = Object.getOwnPropertyDescriptor, N = (e, i, n, r) => {
  for (var l = r > 1 ? void 0 : r ? Tr(i, n) : i, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (l = (r ? a(i, n, l) : a(l)) || l);
  return r && l && Cr(i, n, l), l;
};
const Er = {
  "light.turn_on": "light.turn_off",
  "switch.turn_on": "switch.turn_off",
  "fan.turn_on": "fan.turn_off",
  "input_boolean.turn_on": "input_boolean.turn_off",
  "media_player.media_play": "media_player.media_pause"
};
let L = class extends Le {
  constructor() {
    super(...arguments), this.jobs = [], this.summary = { pending: 0, paused: 0, failed: 0 }, this.tab = "Pending", this.creationKind = "later", this.scheduleMode = "delay", this.visualActions = [], this.actionYaml = "", this.conditionMode = "visual", this.visualConditions = { operator: "and", items: [] }, this.conditionsYaml = "", this.conditionFailure = "skip", this.overduePolicy = "", this.overdueGraceMinutes = "", this.validUntil = "", this.runForTarget = {}, this.runForStart = "light.turn_on", this.runForEnd = "light.turn_off", this.jobKey = "", this.previewDelay = 20, this.previewUnit = "minutes", this.busy = !1, this.search = "", this.tagFilter = "", this.connectionGeneration = 0, this.refreshing = !1, this.bufferedPush = [];
  }
  connectedCallback() {
    super.connectedCallback();
    const e = ++this.connectionGeneration;
    this.clock = window.setInterval(() => this.requestUpdate(), 1e3), this.hasUpdated && this.initialize(e);
  }
  disconnectedCallback() {
    this.connectionGeneration += 1, this.unsubscribe?.(), this.unsubscribe = void 0, this.clock && window.clearInterval(this.clock), this.clock = void 0, super.disconnectedCallback();
  }
  firstUpdated() {
    this.initialize(this.connectionGeneration);
  }
  async initialize(e) {
    if (!(!this.isConnected || this.unsubscribe)) {
      try {
        const i = await or(this.hass, (n) => this.handlePush(n));
        if (!this.isConnected || e !== this.connectionGeneration) {
          i();
          return;
        }
        this.unsubscribe = i;
      } catch (i) {
        this.isConnected && e === this.connectionGeneration && this.setError(i);
      }
      this.isConnected && e === this.connectionGeneration && await this.refresh();
    }
  }
  async refresh() {
    if (!this.refreshing) {
      this.refreshing = !0;
      try {
        const e = await er(this.hass);
        this.jobs = e.jobs, this.recalculate();
      } catch (e) {
        this.setError(e);
      } finally {
        this.refreshing = !1, this.bufferedPush.splice(0).forEach((i) => this.applyPush(i));
      }
    }
  }
  handlePush(e) {
    if (this.refreshing) {
      this.bufferedPush.push(e);
      return;
    }
    this.applyPush(e);
  }
  applyPush(e) {
    if (e.event === "history_cleaned") {
      this.refresh();
      return;
    }
    if (e.event === "queue_summary" && e.summary) {
      this.summary = e.summary;
      return;
    }
    if (e.event === "job_deleted" && e.job_id) this.jobs = this.jobs.filter((i) => i.id !== e.job_id);
    else if (e.job) {
      const i = this.jobs.findIndex((n) => n.id === e.job?.id);
      this.jobs = i < 0 ? [...this.jobs, e.job] : this.jobs.map((n) => n.id === e.job?.id ? e.job : n), this.selected?.id === e.job.id && (this.selected = e.job);
    }
    this.recalculate();
  }
  recalculate() {
    const e = this.jobs.filter((i) => i.status === "pending").sort((i, n) => i.execute_at.localeCompare(n.execute_at));
    this.summary = {
      pending: e.length,
      paused: this.jobs.filter((i) => i.status === "paused").length,
      failed: this.jobs.filter((i) => i.status === "failed").length,
      next_job_name: e[0]?.name,
      next_execution_local: e[0]?.execute_at_local
    };
  }
  visibleJobs() {
    return this.jobs.filter((e) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(e.status) || this.tab === "Paused" && e.status === "paused" || this.tab === "Failed" && e.status === "failed" || this.tab === "History" && me(e.status)).filter((e) => hr(e, this.search)).filter((e) => !this.tagFilter || e.tags.includes(this.tagFilter)).sort((e, i) => e.execute_at.localeCompare(i.execute_at));
  }
  get timeZone() {
    return this.hass?.config?.time_zone ?? "UTC";
  }
  async operate(e, i, n = {}) {
    if (this.menuJobId = void 0, ["cancel", "delete", "execute_now"].includes(e)) {
      this.confirmAction = { operation: e, job: i };
      return;
    }
    await this.performOperation(e, i, n);
  }
  async performOperation(e, i, n = {}) {
    this.busy = !0, this.error = void 0, this.errorDetails = void 0;
    try {
      await rr(this.hass, e, i.id, n), e === "delete" && (this.selected = void 0);
    } catch (r) {
      this.setError(r);
    } finally {
      this.busy = !1;
    }
  }
  setError(e) {
    const i = dr(e);
    this.error = i.message, this.errorDetails = i.details;
  }
  openEditor(e) {
    const i = e?.sequence ?? [{ action: "light.turn_off", target: {} }], n = ue(i);
    this.visualActions = n, this.actionYaml = re(i, { noRefs: !0 });
    const r = Ui(e?.conditions ?? []);
    this.visualConditions = r, this.conditionMode = "visual", this.conditionsYaml = e?.conditions.length ? re(e.conditions, { noRefs: !0 }) : "", this.conditionFailure = e?.condition_failure ?? "skip", this.overduePolicy = e?.overdue_policy ?? "", this.overdueGraceMinutes = e?.overdue_grace ? String(e.effective_overdue_grace_minutes) : "", this.validUntil = e?.valid_until ? Sr(e.valid_until, this.timeZone) : "", this.scheduleMode = "delay", this.creationKind = "later", this.jobKey = e?.job_key ?? "", this.previewDelay = 20, this.previewUnit = "minutes", this.editor = { job: e, mode: "visual" }, this.menuJobId = void 0, this.error = void 0, this.errorDetails = void 0;
  }
  openRunFor() {
    this.openEditor(), this.creationKind = "run_for";
  }
  primaryOperation(e) {
    if (e.status === "pending") return { label: "Pause", icon: "mdi:pause", operation: "pause" };
    if (e.status === "paused") return { label: "Resume", icon: "mdi:play", operation: "resume" };
    if (["failed", "missed"].includes(e.status)) return { label: "Run now", icon: "mdi:play", operation: "execute_now" };
    if (["completed", "cancelled", "skipped", "expired"].includes(e.status)) return { label: "Schedule again", icon: "mdi:calendar-plus", operation: "duplicate" };
  }
  renderMenu(e) {
    return this.menuJobId !== e.id ? O : k`<div class="menu" @click=${(i) => i.stopPropagation()}>
      <button @click=${() => {
      this.selected = e, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:information-outline"></ha-icon>View details</button>
      ${["pending", "paused"].includes(e.status) ? k`
        <button @click=${() => this.openEditor(e)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit</button>
        <button @click=${() => {
      this.quickDialog = { job: e, kind: "reschedule" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:calendar-clock"></ha-icon>Reschedule</button>
        ${e.status === "pending" ? k`<button @click=${() => {
      this.quickDialog = { job: e, kind: "snooze" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Snooze</button>` : k`<button @click=${() => {
      this.quickDialog = { job: e, kind: "extend" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Extend</button>`}` : O}
      ${["pending", "paused", "failed", "missed"].includes(e.status) ? k`<button @click=${() => this.operate("execute_now", e)}><ha-icon icon="mdi:play"></ha-icon>Run now</button>` : O}
      <button @click=${() => {
      this.quickDialog = { job: e, kind: "duplicate" }, this.menuJobId = void 0;
    }}><ha-icon icon=${me(e.status) ? "mdi:calendar-plus" : "mdi:content-copy"}></ha-icon>${me(e.status) ? "Schedule again" : "Duplicate"}</button>
      ${["pending", "paused"].includes(e.status) ? k`<button class="warning" @click=${() => this.operate("cancel", e)}><ha-icon icon="mdi:cancel"></ha-icon>Cancel</button>` : O}
      ${e.status !== "executing" ? k`<button class="danger" @click=${() => this.operate("delete", e)}><ha-icon icon="mdi:delete-outline"></ha-icon>Delete</button>` : O}
    </div>`;
  }
  renderJob(e) {
    const i = this.primaryOperation(e);
    return k`<article class="job" @click=${() => {
      this.selected = e;
    }}>
      <div class="job-icon"><ha-icon icon=${e.status === "failed" ? "mdi:alert-circle-outline" : "mdi:clock-outline"}></ha-icon></div>
      <div class="job-body">
        <div class="job-head"><h3>${e.name}</h3>${e.status !== "pending" ? k`<span class="status ${e.status}">${e.status}</span>` : O}</div>
        <div class="time">${ae(e.execute_at, this.timeZone)} · ${zt(e.execute_at)}</div>
        <p>${e.action_summary}</p>
        ${me(e.status) || e.status === "failed" ? k`<p class="compact outcome">${Bi(e)}</p>` : e.terminal_reason ? k`<p class="compact">${e.terminal_reason}</p>` : O}
        ${e.last_error ? k`<div class="error compact">${e.last_error}</div>` : O}
      </div>
      <div class="row-actions" @click=${(n) => n.stopPropagation()}>
        ${i ? k`<button class="quiet" @click=${() => i.operation === "duplicate" ? this.quickDialog = { job: e, kind: "duplicate" } : this.operate(i.operation, e)}><ha-icon icon=${i.icon}></ha-icon>${i.label}</button>` : O}
        <div class="menu-wrap"><button class="icon" title="More actions" @click=${() => {
      this.menuJobId = this.menuJobId === e.id ? void 0 : e.id;
    }}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>${this.renderMenu(e)}</div>
      </div>
    </article>`;
  }
  renderDetails(e) {
    return k`<div class="overlay" @click=${() => {
      this.selected = void 0;
    }}><section class="dialog wide" @click=${(i) => i.stopPropagation()}>
      <header><div><h2>${e.name}</h2><span class="status ${e.status}">${e.status}</span></div><button class="icon" title="Close" @click=${() => {
      this.selected = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <section class="detail-summary"><div><span>Scheduled</span><strong>${ae(e.execute_at, this.timeZone)}</strong><small>${zt(e.execute_at)}</small></div><div><span>Outcome / action</span><strong>${me(e.status) || e.status === "failed" ? Bi(e) : e.action_summary}</strong></div></section>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>What will happen</strong><span>${Kt({ sequence: e.sequence, when: `At ${ae(e.execute_at, this.timeZone)}`, hasConditions: e.has_conditions, conditionFailure: e.condition_failure, overdue: Ki(e), validUntil: e.valid_until ? ae(e.valid_until, this.timeZone) : void 0 })}</span></div></section>
      ${e.description ? k`<p>${e.description}</p>` : O}
      <div class="detail-actions">
        ${["pending", "paused"].includes(e.status) ? k`<button class="primary" @click=${() => this.openEditor(e)}>Edit action</button><button @click=${() => {
      this.quickDialog = { job: e, kind: "reschedule" };
    }}>Change time</button>` : O}
      </div>
      ${e.status === "pending" ? k`<div class="snooze"><span>Snooze</span><div class="chips">${mr.map((i) => k`<button @click=${() => this.operate("snooze", e, { duration: { minutes: i } })}>+${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => {
      this.quickDialog = { job: e, kind: "snooze" };
    }}>Custom</button></div>` : O}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
      "Job ID": e.id,
      Status: e.status,
      "Scheduled UTC": e.execute_at,
      "Don’t run after": e.valid_until ? `${ae(e.valid_until, this.timeZone)} (${e.valid_until})` : "—",
      Conditions: e.has_conditions ? `Yes — ${e.condition_failure === "skip" ? "skip this run" : e.condition_failure === "cancel" ? "cancel the action" : "mark as failed"} if not met` : "None",
      "Overdue behavior": Ki(e),
      Created: e.created_at,
      Modified: e.modified_at,
      Completed: e.completed_at || "—",
      Source: e.source,
      "Job key": e.job_key || "—",
      Tags: e.tags.join(", ") || "—",
      "Resolved targets": e.target_entities.join(", ") || "—",
      "Resolution hints": jt(e).join(", ") || "—",
      Revision: String(e.revision),
      "Terminal reason": e.terminal_reason || "—",
      "Last error": e.last_error || "—"
    }).map(([i, n]) => k`<dt>${i}</dt><dd>${n}</dd>`)}
      </dl></details>
      <details><summary>Action sequence YAML</summary><pre>${re(e.sequence, { noRefs: !0 })}</pre></details>
      ${e.has_conditions ? k`<details><summary>Execution conditions YAML</summary><pre>${re(e.conditions, { noRefs: !0 })}</pre></details>` : O}
      <details><summary>Attribution and diagnostics</summary><pre>${JSON.stringify(e.attribution, null, 2)}</pre>${Object.keys(e.linkage).length ? k`<pre>${JSON.stringify(e.linkage, null, 2)}</pre>` : O}</details>
    </section></div>`;
  }
  renderEditor() {
    const e = this.editor?.job, i = !e && this.creationKind === "run_for";
    return k`<div class="overlay"><form class="dialog wide" @submit=${(n) => this.saveEditor(n)}>
      <header><h2>${e ? "Edit deferred action" : i ? "Run something for a while" : "Do something later"}</h2><button type="button" class="icon" title="Close" @click=${() => {
      this.editor = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${e ? O : k`<div class="segmented creation-kind"><button type="button" class=${this.creationKind === "later" ? "active" : ""} @click=${() => {
      this.creationKind = "later";
    }}>Do something later</button><button type="button" class=${i ? "active" : ""} @click=${() => {
      this.creationKind = "run_for";
    }}>Run something for a while</button></div>`}
      <label>Name<input name="name" required .value=${e?.name ?? ""} placeholder="Turn off office heater"></label>
      ${i ? this.renderRunForFields() : k`
        ${e ? O : this.renderScheduleFields()}
        <section class="action-editor"><div class="section-head"><h3>Actions</h3><button type="button" class="link" @click=${() => this.switchActionMode()}>${this.editor?.mode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
          ${this.editor?.mode === "visual" ? this.renderVisualActions() : k`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(n) => {
      this.actionYaml = n.currentTarget.value;
    }}></textarea><small>Switch back to render supported blocks visually. Unsupported nodes are preserved unchanged.</small></label>`}
        </section>
        ${this.renderNormalOptions(e)}
      `}
      <details class="advanced"><summary>Developer and automation options</summary>
        <label>Job key<input name="job_key" .value=${this.jobKey} @input=${(n) => {
      this.jobKey = n.currentTarget.value;
    }}><small>Optional stable identifier for automations.</small></label>
        ${!e && this.jobKey.trim() ? k`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>` : O}
        <label>Tags<input name="tags" .value=${e?.tags.join(", ") ?? ""} placeholder="heating, office"><small>Separate tags with commas.</small></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${jt(e)[0] ?? ""} .allowCustomEntity=${!0} @value-changed=${(n) => {
      const r = n.currentTarget.parentElement?.querySelector("input[name=target_entities]");
      r && (r.value = n.detail.value);
    }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${jt(e).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
      </details>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>Preview</strong><span>${this.editorPreview(e)}</span></div></section>
      <footer><button type="button" @click=${() => {
      this.editor = void 0;
    }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${e ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }
  renderScheduleFields() {
    return k`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => {
      this.scheduleMode = "delay";
    }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => {
      this.scheduleMode = "absolute";
    }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? k`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(e) => {
      this.previewDelay = Number(e.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(e) => {
      this.previewUnit = e.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5, 15, 30, 60].map((e) => k`<button type="button" @click=${() => {
      this.previewDelay = e, this.previewUnit = "minutes";
    }}>${e < 60 ? `${e} min` : "1 hour"}</button>`)}</div>` : k`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </fieldset>`;
  }
  renderRunForFields() {
    return k`<fieldset><legend>Run For</legend>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(e) => {
      this.runForTarget = e.detail.value;
    }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(e) => {
      this.runForStart = e.detail.value, this.runForEnd = Er[e.detail.value] ?? "";
    }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(e) => {
      this.runForEnd = e.detail.value;
    }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(e) => {
      this.previewDelay = Number(e.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(e) => {
      this.previewUnit = e.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </fieldset>`;
  }
  renderVisualActions() {
    return this.renderSequence(this.visualActions, (e) => {
      this.visualActions = e;
    });
  }
  renderSequence(e, i, n = 0) {
    const r = (l, s) => i(e.map((a, c) => c === l ? s : a));
    return k`<div class="sequence depth-${Math.min(n, 3)}">${e.map((l, s) => k`<article class="visual-card block ${l.kind}">
      <div class="section-head"><select aria-label="Action type" .value=${l.kind} ?disabled=${l.kind === "unsupported"} @change=${(a) => r(s, Yi(a.currentTarget.value))}><option value="service">Call service</option><option value="if">If / Then / Else</option><option value="choose">Choose</option><option value="repeat">Repeat</option><option value="parallel">Parallel</option><option value="delay">Delay</option><option value="wait_template">Wait for template</option>${l.kind === "unsupported" ? k`<option value="unsupported">YAML required</option>` : O}</select><span><button type="button" class="icon" title="Move up" ?disabled=${s === 0} @click=${() => {
      const a = [...e];
      [a[s - 1], a[s]] = [a[s], a[s - 1]], i(a);
    }}><ha-icon icon="mdi:arrow-up"></ha-icon></button><button type="button" class="icon" title="Move down" ?disabled=${s === e.length - 1} @click=${() => {
      const a = [...e];
      [a[s], a[s + 1]] = [a[s + 1], a[s]], i(a);
    }}><ha-icon icon="mdi:arrow-down"></ha-icon></button><button type="button" class="link danger" @click=${() => i(e.filter((a, c) => c !== s))}>Remove</button></span></div>
      ${this.renderActionBlock(l, (a) => r(s, a), n)}
    </article>`)}<button type="button" @click=${() => i([...e, Yi("service")])}><ha-icon icon="mdi:plus"></ha-icon>Add action</button></div>`;
  }
  renderActionBlock(e, i, n) {
    return e.kind === "unsupported" ? k`<div class="yaml-required"><strong>YAML required</strong><p>This action cannot be edited visually without risking data loss. It will be kept exactly as-is.</p><pre>${re(e.raw, { noRefs: !0 })}</pre><button type="button" class="link" @click=${() => this.switchActionMode()}>Edit the full sequence in YAML</button></div>` : e.kind === "service" ? k`<label>Service<ha-service-picker .hass=${this.hass} .value=${e.action} @value-changed=${(r) => i({ ...e, action: r.detail.value })}></ha-service-picker></label><label>Target<ha-target-picker .hass=${this.hass} .value=${e.target} @value-changed=${(r) => i({ ...e, target: r.detail.value })}></ha-target-picker><small>Leave empty when the service needs no target.</small></label>${this.renderActionData(e, i)}` : e.kind === "if" ? k`<h4>If</h4>${this.renderConditionList(e.conditions, (r) => i({ ...e, conditions: r }), n + 1)}<h4>Then</h4>${this.renderSequence(e.then, (r) => i({ ...e, then: r }), n + 1)}<div class="section-head"><h4>Else</h4>${e.else ? k`<button type="button" class="link danger" @click=${() => {
      const { else: r, ...l } = e;
      i(l);
    }}>Remove Else</button>` : k`<button type="button" class="link" @click=${() => i({ ...e, else: [] })}>Add Else</button>`}</div>${e.else ? this.renderSequence(e.else, (r) => i({ ...e, else: r }), n + 1) : O}` : e.kind === "choose" ? k`${e.choices.map((r, l) => k`<section class="branch"><div class="section-head"><h4>Option ${l + 1}</h4><button type="button" class="link danger" @click=${() => i({ ...e, choices: e.choices.filter((s, a) => a !== l) })}>Remove option</button></div><strong>When</strong>${this.renderConditionList(r.conditions, (s) => i({ ...e, choices: e.choices.map((a, c) => c === l ? { ...a, conditions: s } : a) }), n + 1)}<strong>Do</strong>${this.renderSequence(r.sequence, (s) => i({ ...e, choices: e.choices.map((a, c) => c === l ? { ...a, sequence: s } : a) }), n + 1)}</section>`)}<button type="button" class="link" @click=${() => i({ ...e, choices: [...e.choices, { conditions: [], sequence: [], metadata: {} }] })}>Add option</button><div class="section-head"><h4>Otherwise</h4>${e.default ? k`<button type="button" class="link danger" @click=${() => {
      const { default: r, ...l } = e;
      i(l);
    }}>Remove</button>` : k`<button type="button" class="link" @click=${() => i({ ...e, default: [] })}>Add fallback</button>`}</div>${e.default ? this.renderSequence(e.default, (r) => i({ ...e, default: r }), n + 1) : O}` : e.kind === "repeat" ? k`<label>Repeat mode<select .value=${e.mode} @change=${(r) => {
      const l = r.currentTarget.value;
      i({ ...e, mode: l, ...l === "while" || l === "until" ? { conditions: [], value: void 0 } : { value: l === "count" ? 1 : [], conditions: void 0 } });
    }}><option value="count">Count</option><option value="while">While conditions pass</option><option value="until">Until conditions pass</option><option value="for_each">For each item</option></select></label>${e.mode === "while" || e.mode === "until" ? this.renderConditionList(e.conditions ?? [], (r) => i({ ...e, conditions: r }), n + 1) : this.renderYamlValue(e.mode === "count" ? "Count or template" : "Items or template", e.value, (r) => i({ ...e, value: r }))}<h4>Sequence</h4>${this.renderSequence(e.sequence, (r) => i({ ...e, sequence: r }), n + 1)}` : e.kind === "parallel" ? k`<p class="hint">Branches start together. Actions inside each branch still run in order.</p>${e.branches.map((r, l) => k`<section class="branch"><div class="section-head"><h4>Branch ${l + 1}</h4><button type="button" class="link danger" @click=${() => i({ ...e, branches: e.branches.filter((s, a) => a !== l) })}>Remove</button></div>${this.renderSequence(r.sequence, (s) => i({ ...e, branches: e.branches.map((a, c) => c === l ? { ...a, wrapped: !0, sequence: s } : a) }), n + 1)}</section>`)}<button type="button" class="link" @click=${() => i({ ...e, branches: [...e.branches, { wrapped: !0, sequence: [], metadata: {} }] })}>Add branch</button>` : e.kind === "delay" ? this.renderYamlValue("Duration (HA duration or template)", e.value, (r) => i({ ...e, value: r })) : k`<label>Wait template<textarea .value=${e.template} @input=${(r) => i({ ...e, template: r.currentTarget.value })}></textarea></label>${this.renderYamlValue("Timeout (optional)", e.timeout, (r) => i({ ...e, timeout: r }))}<label class="checkbox"><input type="checkbox" .checked=${e.continueOnTimeout !== !1} @change=${(r) => i({ ...e, continueOnTimeout: r.currentTarget.checked })}>Continue after timeout</label>`;
  }
  renderYamlValue(e, i, n) {
    return k`<label>${e}<textarea class="typed-yaml" .value=${i === void 0 ? "" : re(i, { noRefs: !0 }).trim()} @change=${(r) => {
      const l = r.currentTarget.value;
      try {
        n(l.trim() ? Ae(l) : void 0);
      } catch (s) {
        this.setError(s);
      }
    }}></textarea><small>Typed YAML value; strings, numbers, lists, mappings, and templates keep their type.</small></label>`;
  }
  renderActionData(e, i) {
    const n = (a, c) => i({ ...e, data: e.data.map((h, u) => u === a ? { ...h, ...c } : h) }), r = _n(this.hass, e.action), l = r.filter((a) => !e.data.some((c) => c.key === a.key)), s = (a) => {
      const c = a.currentTarget, h = r.find((u) => u.key === c.value);
      h && (i({ ...e, data: [...e.data, Gt(h.key, br(h.selector, h.default))] }), c.value = "");
    };
    return k`<div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => i({ ...e, data: [...e.data, { key: "", type: "text", value: "", raw: "" }] })}>Add custom field</button></div>
      ${l.length ? k`<label>Add Home Assistant field<select aria-label="Add Home Assistant field" @change=${s}><option value="">Choose a field…</option>${l.map((a) => k`<option value=${a.key}>${a.name ?? a.key}${a.required ? " (required)" : ""}</option>`)}</select><small>Fields advertised by Home Assistant use their native selector. Custom or unsupported values still use the typed fallback below.</small></label>` : O}
      ${e.data.map((a, c) => {
      const h = vr(this.hass, e.action, a.key);
      return k`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${a.key} @input=${(u) => n(c, { key: u.currentTarget.value })}>${h ? k`<span class="null-value">Home Assistant</span>` : k`<select aria-label="Data value type" .value=${a.type} @change=${(u) => n(c, cr(a, u.currentTarget.value))}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>`}${h ? k`<div><ha-selector .hass=${this.hass} .selector=${h.selector} .value=${_r(a)} .label=${h.name ?? a.key} @value-changed=${(u) => {
        const f = u.detail.value;
        f === null || ["string", "number", "boolean"].includes(typeof f) ? i({ ...e, data: e.data.map((y, T) => T === c ? Gt(a.key, f) : y) }) : this.setError(new K("This Home Assistant field returned a structured value. Use a custom field or YAML for this action."));
      }}></ha-selector>${h.description ? k`<small>${h.description}</small>` : O}</div>` : this.renderDataValue(a, (u) => n(c, u))}<button type="button" class="icon" title="Remove data field" @click=${() => i({ ...e, data: e.data.filter((u, f) => f !== c) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`;
    })}`;
  }
  renderDataValue(e, i) {
    return e.type === "null" ? k`<span class="null-value">No value</span>` : e.type === "boolean" ? k`<select aria-label="Boolean value" .value=${e.value === !0 ? "true" : "false"} @change=${(n) => i({ value: n.currentTarget.value === "true" })}><option value="true">True</option><option value="false">False</option></select>` : k`<input aria-label="Data value" type=${e.type === "number" ? "number" : "text"} step=${e.type === "number" ? "any" : ""} placeholder=${e.type === "number" ? "42" : "Message text"} .value=${e.raw ?? String(e.value ?? "")} @input=${(n) => i({ raw: n.currentTarget.value })}>`;
  }
  renderNormalOptions(e) {
    return k`<section class="normal-options"><h3>Optional settings</h3>
      <label>Description<textarea name="description">${e?.description ?? ""}</textarea></label>
      <div class="section-head"><h3>Only run this action if…</h3><button type="button" class="link" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
      ${this.conditionMode === "visual" ? this.renderVisualConditions() : k`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(i) => {
      this.conditionsYaml = i.currentTarget.value;
    }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
      <label>If the conditions aren’t met<select name="condition_failure" .value=${this.conditionFailure} @change=${(i) => {
      this.conditionFailure = i.currentTarget.value;
    }}><option value="skip">Skip this run and keep it in history</option><option value="cancel">Cancel the action</option><option value="fail">Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${this.validUntil} @input=${(i) => {
      this.validUntil = i.currentTarget.value;
    }}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy" .value=${this.overduePolicy} @change=${(i) => {
      this.overduePolicy = i.currentTarget.value;
    }}><option value="">Use the integration default</option><option value="execute">Run it when Home Assistant comes back</option><option value="execute_within_grace">Run it only if it is less than the grace period late</option><option value="skip">Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${this.overdueGraceMinutes} @input=${(i) => {
      this.overdueGraceMinutes = i.currentTarget.value;
    }} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
    </section>`;
  }
  renderVisualConditions() {
    return k`<div class="condition-builder">${this.visualConditions.items.length > 1 ? k`<label>Match<select .value=${this.visualConditions.operator} @change=${(e) => {
      this.visualConditions = { ...this.visualConditions, operator: e.currentTarget.value };
    }}><option value="and">All conditions (AND)</option><option value="or">Any condition (OR)</option></select></label>` : O}
      ${this.renderConditionList(this.visualConditions.items, (e) => {
      this.visualConditions = { ...this.visualConditions, items: e };
    })}</div>`;
  }
  newCondition(e) {
    return e === "state" ? { type: e, entity_id: "", state: "", metadata: {} } : e === "numeric_state" ? { type: e, entity_id: "", above: "", below: "", metadata: {} } : e === "time" ? { type: e, after: "", before: "", weekdays: [], metadata: {} } : e === "zone" ? { type: e, entity_id: "", zone: "", metadata: {} } : e === "sun" ? { type: e, after: "", before: "", after_offset: "", before_offset: "", metadata: {} } : { type: e, conditions: [], metadata: {} };
  }
  renderConditionList(e, i, n = 0) {
    const r = (s, a) => i(e.map((c, h) => h === s ? a : c)), l = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return k`<div class="conditions depth-${Math.min(n, 3)}">${e.map((s, a) => k`<article class="visual-card condition"><div class="section-head"><select aria-label="Condition type" .value=${s.type} ?disabled=${s.type === "unsupported"} @change=${(c) => r(a, this.newCondition(c.currentTarget.value))}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option><option value="zone">Zone</option><option value="sun">Sun</option><option value="and">AND group</option><option value="or">OR group</option><option value="not">NOT group</option>${s.type === "unsupported" ? k`<option value="unsupported">YAML required</option>` : O}</select><button type="button" class="link danger" @click=${() => i(e.filter((c, h) => h !== a))}>Remove</button></div>
      ${s.type === "unsupported" ? k`<div class="yaml-required"><strong>YAML required</strong><p>This condition is preserved exactly.</p><pre>${re(s.raw, { noRefs: !0 })}</pre></div>` : O}
      ${s.type !== "unsupported" ? k`<label>Alias (optional)<input .value=${s.alias ?? ""} @input=${(c) => r(a, { ...s, alias: c.currentTarget.value, metadata: { ...s.metadata, alias: c.currentTarget.value || void 0 } })}></label>` : O}
      ${s.type === "state" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${s.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => r(a, { ...s, entity_id: c.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${s.state} @input=${(c) => r(a, { ...s, state: c.currentTarget.value })}></label>` : O}
      ${s.type === "numeric_state" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${s.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => r(a, { ...s, entity_id: c.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${s.above} @input=${(c) => r(a, { ...s, above: c.currentTarget.value })}></label><label>Below<input type="number" step="any" .value=${s.below} @input=${(c) => r(a, { ...s, below: c.currentTarget.value })}></label></div>` : O}
      ${s.type === "time" ? k`<div class="two"><label>After<input type="time" step="1" .value=${s.after} @input=${(c) => r(a, { ...s, after: c.currentTarget.value })}></label><label>Before<input type="time" step="1" .value=${s.before} @input=${(c) => r(a, { ...s, before: c.currentTarget.value })}></label></div><div class="weekdays">${l.map(([c, h]) => k`<label><input type="checkbox" .checked=${s.weekdays.includes(c)} @change=${(u) => r(a, { ...s, weekdays: u.currentTarget.checked ? [...s.weekdays, c] : s.weekdays.filter((f) => f !== c) })}>${h}</label>`)}</div>` : O}
      ${s.type === "zone" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${s.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => r(a, { ...s, entity_id: c.detail.value })}></ha-entity-picker></label><label>Zone<ha-entity-picker .hass=${this.hass} .value=${s.zone} .includeDomains=${["zone"]} .allowCustomEntity=${!0} @value-changed=${(c) => r(a, { ...s, zone: c.detail.value })}></ha-entity-picker></label>` : O}
      ${s.type === "sun" ? k`<div class="two"><label>After<select .value=${s.after} @change=${(c) => r(a, { ...s, after: c.currentTarget.value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>Before<select .value=${s.before} @change=${(c) => r(a, { ...s, before: c.currentTarget.value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>After offset<input placeholder="-01:00:00" .value=${s.after_offset} @input=${(c) => r(a, { ...s, after_offset: c.currentTarget.value })}></label><label>Before offset<input placeholder="00:30:00" .value=${s.before_offset} @input=${(c) => r(a, { ...s, before_offset: c.currentTarget.value })}></label></div>` : O}
      ${s.type === "and" || s.type === "or" || s.type === "not" ? this.renderConditionList(s.conditions, (c) => r(a, { ...s, conditions: c }), n + 1) : O}
    </article>`)}<button type="button" @click=${() => i([...e, this.newCondition("state")])}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
  }
  async saveEditor(e) {
    e.preventDefault();
    const i = e.currentTarget, n = new FormData(i);
    try {
      if (!this.editor?.job && this.creationKind === "run_for") {
        const a = Number(n.get("delay_value")), c = String(n.get("delay_unit"));
        if (!Number.isFinite(a) || a <= 0) throw new K("Duration must be greater than zero");
        if (!this.runForStart || !this.runForEnd || !Object.values(this.runForTarget).some((h) => h?.length)) throw new K("Choose a target, start action, and end action");
        this.busy = !0, await ir(this.hass, {
          name: String(n.get("name")),
          description: String(n.get("description") ?? "") || void 0,
          duration: { [c]: a },
          start_sequence: Q([{ kind: "service", action: this.runForStart, target: this.runForTarget, data: [], metadata: {} }]),
          end_sequence: Q([{ kind: "service", action: this.runForEnd, target: this.runForTarget, data: [], metadata: {} }]),
          job_key: String(n.get("job_key") ?? "") || void 0,
          tags: String(n.get("tags") ?? "").split(",").map((h) => h.trim()).filter(Boolean),
          conflict_mode: String(n.get("conflict_mode") ?? "keep_all")
        }), await this.refresh(), this.editor = void 0;
        return;
      }
      const r = this.editor?.mode === "visual" ? Q(this.visualActions) : Ae(this.actionYaml);
      if (!Array.isArray(r)) throw new K("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || !this.sequenceIsComplete(this.visualActions))) throw new K("Complete every visual action block");
      const l = this.conditionMode === "visual" ? Bt(this.visualConditions) : this.conditionsYaml.trim() ? Ae(this.conditionsYaml) : [];
      if (this.conditionMode === "visual" && !this.conditionsAreComplete(this.visualConditions.items)) throw new K("Complete or remove each condition");
      const s = {
        name: String(n.get("name")),
        description: String(n.get("description") ?? "") || void 0,
        job_key: String(n.get("job_key") ?? "") || void 0,
        tags: String(n.get("tags") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        target_entities: String(n.get("target_entities") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        sequence: r,
        conditions: l,
        condition_failure: String(n.get("condition_failure") ?? "skip"),
        overdue_policy: String(n.get("overdue_policy") ?? "") || null,
        overdue_grace: String(n.get("overdue_grace_minutes") ?? "") ? { minutes: Number(n.get("overdue_grace_minutes")) } : null,
        valid_until: this.validUntil ? this.localWallTimeToIso(this.validUntil) : null
      };
      if (!Array.isArray(s.conditions)) throw new K("Conditions YAML must be a list");
      if (this.busy = !0, this.editor?.job) await nr(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...s });
      else {
        let a;
        if (this.scheduleMode === "absolute") {
          const c = String(n.get("date")), h = String(n.get("time"));
          a = { execute_at: this.localWallTimeToIso(`${c}T${h}`) };
        } else {
          const c = Number(n.get("delay_value")), h = String(n.get("delay_unit"));
          if (!Number.isFinite(c) || c <= 0) throw new K("Delay must be greater than zero");
          a = { delay: { [h]: c } };
        }
        await tr(this.hass, { ...s, ...a, conflict_mode: String(n.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = void 0;
    } catch (r) {
      this.setError(r);
    } finally {
      this.busy = !1;
    }
  }
  sequenceIsComplete(e) {
    return e.every((i) => i.kind === "unsupported" || i.kind === "service" ? i.kind === "unsupported" || !!i.action : i.kind === "if" ? this.conditionsAreComplete(i.conditions) && i.then.length > 0 && this.sequenceIsComplete(i.then) && (!i.else || this.sequenceIsComplete(i.else)) : i.kind === "choose" ? i.choices.length > 0 && i.choices.every((n) => this.conditionsAreComplete(n.conditions) && n.sequence.length > 0 && this.sequenceIsComplete(n.sequence)) && (!i.default || this.sequenceIsComplete(i.default)) : i.kind === "repeat" ? i.sequence.length > 0 && this.sequenceIsComplete(i.sequence) && (i.conditions ? this.conditionsAreComplete(i.conditions) : i.value !== void 0) : i.kind === "parallel" ? i.branches.length > 0 && i.branches.every((n) => n.sequence.length > 0 && this.sequenceIsComplete(n.sequence)) : i.kind === "wait_template" ? !!i.template.trim() : i.value !== void 0);
  }
  conditionsAreComplete(e) {
    return e.every((i) => i.type === "unsupported" || i.type === "state" ? i.type === "unsupported" || !!i.entity_id && !!i.state : i.type === "numeric_state" ? !!i.entity_id && (!!i.above.trim() || !!i.below.trim()) : i.type === "time" ? !!i.after || !!i.before || i.weekdays.length > 0 : i.type === "zone" ? !!i.entity_id && !!i.zone : i.type === "sun" ? !!i.after || !!i.before : i.conditions.length > 0 && this.conditionsAreComplete(i.conditions));
  }
  switchActionMode() {
    if (this.editor?.mode === "visual") {
      this.actionYaml = re(Q(this.visualActions), { noRefs: !0 }), this.editor = { ...this.editor, mode: "yaml" };
      return;
    }
    try {
      const e = Ae(this.actionYaml);
      if (!Array.isArray(e)) throw new K("Action YAML must be a list");
      const i = ue(e);
      if (!i) throw new K("This sequence uses advanced features that the visual editor cannot represent safely.");
      this.visualActions = i, this.editor = { ...this.editor, mode: "visual" };
    } catch (e) {
      this.setError(e);
    }
  }
  switchConditionMode() {
    if (this.conditionMode === "visual") {
      this.conditionsYaml = re(Bt(this.visualConditions), { noRefs: !0 }), this.conditionMode = "yaml";
      return;
    }
    try {
      const e = this.conditionsYaml.trim() ? Ae(this.conditionsYaml) : [];
      if (!Array.isArray(e)) throw new K("Conditions YAML must be a list");
      const i = Ui(e);
      if (!i) throw new K("These conditions use advanced options that the visual editor cannot represent safely.");
      this.visualConditions = i, this.conditionMode = "visual";
    } catch (e) {
      this.setError(e);
    }
  }
  actionLabel(e, i) {
    const n = e.split(".").pop()?.replaceAll("_", " ") ?? "Run action", r = i.entity_id ?? i.device_id ?? i.area_id ?? i.floor_id ?? i.label_id, s = (Array.isArray(r) ? r[0] : r)?.split(".").pop()?.replaceAll("_", " ");
    return `${n.charAt(0).toUpperCase()}${n.slice(1)}${s ? ` ${s}` : ""}`;
  }
  editorPreview(e) {
    const i = this.editor?.mode === "visual" ? Q(this.visualActions) : this.previewYamlList(this.actionYaml);
    if (this.creationKind === "run_for" && !e) return Kt({ sequence: [], when: "Now", runFor: { start: this.runForStart, end: this.runForEnd, duration: `${this.previewDelay} ${this.previewUnit}` } });
    if (!i) return "Preview unavailable until the action YAML is a valid list.";
    const n = this.conditionMode === "visual" ? Bt(this.visualConditions) : this.previewYamlList(this.conditionsYaml);
    return n ? Kt({
      sequence: i,
      when: e ? `Scheduled for ${ae(e.execute_at, this.timeZone)}` : this.scheduleMode === "delay" ? `In ${this.previewDelay} ${this.previewUnit}` : "At the selected date and time",
      hasConditions: n.length > 0,
      conditionFailure: this.conditionFailure,
      overdue: this.previewOverdueLabel(),
      validUntil: this.validUntil ? this.previewValidUntil() : void 0
    }) : "Preview unavailable until the conditions YAML is a valid list.";
  }
  previewYamlList(e) {
    try {
      const i = e.trim() ? Ae(e) : [];
      return Array.isArray(i) ? i : void 0;
    } catch {
      return;
    }
  }
  previewOverdueLabel() {
    return this.overduePolicy ? this.overduePolicy === "execute" ? "Run when Home Assistant comes back" : this.overduePolicy === "skip" ? "Don’t run when Home Assistant comes back" : this.overdueGraceMinutes ? `Run only if less than ${this.overdueGraceMinutes} minutes late` : "Run only within the configured grace period" : "Offline handling follows the integration default";
  }
  localWallTimeToIso(e) {
    try {
      return Wi(e, this.timeZone);
    } catch {
      throw new K(`Choose a valid date and time in the Home Assistant timezone (${this.timeZone}).`);
    }
  }
  previewValidUntil() {
    try {
      return ae(Wi(this.validUntil, this.timeZone), this.timeZone);
    } catch {
      return;
    }
  }
  renderQuickDialog() {
    const e = this.quickDialog;
    if (!e) return O;
    const i = { reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: me(e.job.status) ? "Schedule action again" : "Duplicate action" };
    return k`<div class="overlay"><form class="dialog small" @submit=${(n) => this.submitQuickDialog(n)}><header><h2>${i[e.kind]}</h2><button type="button" class="icon" @click=${() => {
      this.quickDialog = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${e.kind === "reschedule" ? k`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : k`<label>${e.kind === "extend" ? "Minutes to add (negative reduces time)" : e.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${e.kind === "extend" ? O : "1"} .value=${e.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => {
      this.quickDialog = void 0;
    }}>Cancel</button><button class="primary">${e.kind === "duplicate" ? me(e.job.status) ? "Schedule again" : "Duplicate" : "Apply"}</button></footer></form></div>`;
  }
  async submitQuickDialog(e) {
    e.preventDefault();
    const i = this.quickDialog;
    if (!i) return;
    const n = new FormData(e.currentTarget);
    if (i.kind === "reschedule")
      try {
        const r = this.localWallTimeToIso(`${String(n.get("date"))}T${String(n.get("time"))}`);
        await this.operate("reschedule", i.job, { execute_at: r });
      } catch (r) {
        this.setError(r);
        return;
      }
    else {
      const r = Number(n.get("minutes"));
      if (!Number.isFinite(r) || (["duplicate", "snooze"].includes(i.kind) ? r <= 0 : r === 0)) {
        this.error = "Enter a valid number of minutes";
        return;
      }
      await this.operate(i.kind, i.job, ["extend", "snooze"].includes(i.kind) ? { duration: { minutes: r } } : { delay: { minutes: r } });
    }
    this.quickDialog = void 0;
  }
  renderConfirmation() {
    const e = this.confirmAction;
    if (!e) return O;
    const i = e.operation === "delete", n = e.operation === "cancel", r = i ? "Delete this record permanently?" : n ? "Cancel this deferred action?" : "Run this action now?", l = i ? "This permanently removes the record and its history. This cannot be undone." : n ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay. Conditions are checked again at run time; Run now does not bypass them.";
    return k`<div class="overlay" @click=${() => {
      this.confirmAction = void 0;
    }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(s) => s.stopPropagation()}>
      <header><h2>${r}</h2><button class="icon" title="Close" @click=${() => {
      this.confirmAction = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${e.job.name}</strong></p><p>${l}</p>
      <footer><button @click=${() => {
      this.confirmAction = void 0;
    }}>Keep it</button><button class=${i ? "danger" : n ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => {
      const s = this.confirmAction;
      this.confirmAction = void 0, s && await this.performOperation(s.operation, s.job);
    }}>${i ? "Delete permanently" : n ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }
  render() {
    const e = this.visibleJobs(), i = e.filter((s) => ["pending", "paused", "executing"].includes(s.status)), n = e.filter((s) => !["pending", "paused", "executing"].includes(s.status)), r = pr(i, /* @__PURE__ */ new Date(), this.timeZone), l = [...new Set(this.jobs.flatMap((s) => s.tags))].sort();
    return k`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? k`<div class="banner"><div>${this.error}${this.errorDetails ? k`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : O}</div><button class="icon" @click=${() => {
      this.error = void 0, this.errorDetails = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : O}
      <nav>${["Pending", "Paused", "Failed", "History"].map((s) => k`<button class=${this.tab === s ? "active" : ""} @click=${() => {
      this.tab = s;
    }}>${s}<span>${s === "Pending" ? this.summary.pending : s === "Paused" ? this.summary.paused : s === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => {
      this.tab = "All";
    }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? k`<small>${ae(this.summary.next_execution_local, this.timeZone)} · ${zt(this.summary.next_execution_local)}</small>` : O}</section>
      <section class="queue-tools"><label><ha-icon icon="mdi:magnify"></ha-icon><input type="search" placeholder="Search name, key, tags, or targets" .value=${this.search} @input=${(s) => {
      this.search = s.currentTarget.value;
    }}></label><select aria-label="Filter by tag" .value=${this.tagFilter} @change=${(s) => {
      this.tagFilter = s.currentTarget.value;
    }}><option value="">All tags</option>${l.map((s) => k`<option value=${s}>${s}</option>`)}</select></section>
      <main>${e.length ? k`${r.map((s) => k`<section class="queue-group"><h2>${s.label}<span>${s.jobs.length}</span></h2>${s.jobs.map((a) => this.renderJob(a))}</section>`)}${n.length ? k`<section class="queue-group">${i.length ? k`<h2>${this.tab === "History" ? "History" : "Other"}<span>${n.length}</span></h2>` : O}${n.map((s) => this.renderJob(s))}</section>` : O}` : k`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No matching ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : O}${this.editor ? this.renderEditor() : O}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }
};
L.styles = An`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.job p.outcome{color:var(--primary-text-color);font-weight:500}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.queue-tools{display:flex;gap:10px;margin:4px 0 12px}.queue-tools label{display:flex;align-items:center;gap:8px;flex:1;border:1px solid var(--divider-color);border-radius:10px;padding:0 10px}.queue-tools input,.queue-tools select{font:inherit;color:var(--primary-text-color);background:transparent;border:0;padding:10px;min-width:0}.queue-tools select{border:1px solid var(--divider-color);border-radius:10px}.queue-group>h2{display:flex;gap:8px;align-items:center;margin:18px 4px 4px;font-size:14px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.04em}.queue-group>h2 span{font-size:11px;border-radius:999px;padding:2px 6px;background:var(--secondary-background-color)}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog label.checkbox{flex-direction:row;align-items:center}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog textarea.typed-yaml{min-height:48px;font-family:monospace}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.sequence.depth-1,.conditions.depth-1,.sequence.depth-2,.conditions.depth-2,.sequence.depth-3,.conditions.depth-3{border-left:3px solid color-mix(in srgb,var(--primary-color) 35%,var(--divider-color));padding-left:10px}.branch{border:1px dashed var(--divider-color);border-radius:10px;padding:10px;margin:10px 0}.branch h4,.block h4{margin:8px 0}.yaml-required{border-radius:8px;padding:10px;background:color-mix(in srgb,var(--warning-color) 9%,transparent)}.yaml-required p,.hint{color:var(--secondary-text-color)}.yaml-required pre{max-height:180px}.data-row{display:grid;grid-template-columns:minmax(120px,1fr) 110px minmax(140px,1fr) auto;gap:8px;align-items:center;margin:8px 0}.null-value{padding:10px;color:var(--secondary-text-color);font-style:italic}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.queue-tools{flex-direction:column}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input,.data-row select,.data-row .null-value{grid-column:1}.data-row button{grid-column:2;grid-row:1/4}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
N([
  Xi({ attribute: !1 })
], L.prototype, "hass", 2);
N([
  F()
], L.prototype, "jobs", 2);
N([
  F()
], L.prototype, "summary", 2);
N([
  F()
], L.prototype, "tab", 2);
N([
  F()
], L.prototype, "selected", 2);
N([
  F()
], L.prototype, "editor", 2);
N([
  F()
], L.prototype, "creationKind", 2);
N([
  F()
], L.prototype, "scheduleMode", 2);
N([
  F()
], L.prototype, "visualActions", 2);
N([
  F()
], L.prototype, "actionYaml", 2);
N([
  F()
], L.prototype, "conditionMode", 2);
N([
  F()
], L.prototype, "visualConditions", 2);
N([
  F()
], L.prototype, "conditionsYaml", 2);
N([
  F()
], L.prototype, "conditionFailure", 2);
N([
  F()
], L.prototype, "overduePolicy", 2);
N([
  F()
], L.prototype, "overdueGraceMinutes", 2);
N([
  F()
], L.prototype, "validUntil", 2);
N([
  F()
], L.prototype, "runForTarget", 2);
N([
  F()
], L.prototype, "runForStart", 2);
N([
  F()
], L.prototype, "runForEnd", 2);
N([
  F()
], L.prototype, "jobKey", 2);
N([
  F()
], L.prototype, "previewDelay", 2);
N([
  F()
], L.prototype, "previewUnit", 2);
N([
  F()
], L.prototype, "confirmAction", 2);
N([
  F()
], L.prototype, "errorDetails", 2);
N([
  F()
], L.prototype, "menuJobId", 2);
N([
  F()
], L.prototype, "quickDialog", 2);
N([
  F()
], L.prototype, "error", 2);
N([
  F()
], L.prototype, "busy", 2);
N([
  F()
], L.prototype, "search", 2);
N([
  F()
], L.prototype, "tagFilter", 2);
L = N([
  zn("deferred-actions-panel")
], L);
export {
  L as DeferredActionsPanel
};
