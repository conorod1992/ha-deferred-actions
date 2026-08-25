const Xe = globalThis, Ut = Xe.ShadowRoot && (Xe.ShadyCSS === void 0 || Xe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Yt = /* @__PURE__ */ Symbol(), Wt = /* @__PURE__ */ new WeakMap();
let Ni = class {
  constructor(t, n, o) {
    if (this._$cssResult$ = !0, o !== Yt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Ut && t === void 0) {
      const o = n !== void 0 && n.length === 1;
      o && (t = Wt.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Wt.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const nn = (i) => new Ni(typeof i == "string" ? i : i + "", void 0, Yt), rn = (i, ...t) => {
  const n = i.length === 1 ? i[0] : t.reduce((o, l, s) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(l) + i[s + 1], i[0]);
  return new Ni(n, i, Yt);
}, on = (i, t) => {
  if (Ut) i.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const o = document.createElement("style"), l = Xe.litNonce;
    l !== void 0 && o.setAttribute("nonce", l), o.textContent = n.cssText, i.appendChild(o);
  }
}, Vt = Ut ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const o of t.cssRules) n += o.cssText;
  return nn(n);
})(i) : i;
const { is: ln, defineProperty: sn, getOwnPropertyDescriptor: an, getOwnPropertyNames: cn, getOwnPropertySymbols: un, getPrototypeOf: dn } = Object, it = globalThis, Gt = it.trustedTypes, pn = Gt ? Gt.emptyScript : "", hn = it.reactiveElementPolyfillSupport, Te = (i, t) => i, et = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? pn : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let n = i;
  switch (t) {
    case Boolean:
      n = i !== null;
      break;
    case Number:
      n = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(i);
      } catch {
        n = null;
      }
  }
  return n;
} }, Ht = (i, t) => !ln(i, t), Qt = { attribute: !0, type: String, converter: et, reflect: !1, useDefault: !1, hasChanged: Ht };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), it.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ge = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Qt) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), l = this.getPropertyDescriptor(t, o, n);
      l !== void 0 && sn(this.prototype, t, l);
    }
  }
  static getPropertyDescriptor(t, n, o) {
    const { get: l, set: s } = an(this.prototype, t) ?? { get() {
      return this[n];
    }, set(a) {
      this[n] = a;
    } };
    return { get: l, set(a) {
      const p = l?.call(this);
      s?.call(this, a), this.requestUpdate(t, p, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Qt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Te("elementProperties"))) return;
    const t = dn(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Te("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Te("properties"))) {
      const n = this.properties, o = [...cn(n), ...un(n)];
      for (const l of o) this.createProperty(l, n[l]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0) for (const [o, l] of n) this.elementProperties.set(o, l);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, o] of this.elementProperties) {
      const l = this._$Eu(n, o);
      l !== void 0 && this._$Eh.set(l, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const l of o) n.unshift(Vt(l));
    } else t !== void 0 && n.push(Vt(t));
    return n;
  }
  static _$Eu(t, n) {
    const o = n.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const o of n.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return on(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, n, o) {
    this._$AK(t, o);
  }
  _$ET(t, n) {
    const o = this.constructor.elementProperties.get(t), l = this.constructor._$Eu(t, o);
    if (l !== void 0 && o.reflect === !0) {
      const s = (o.converter?.toAttribute !== void 0 ? o.converter : et).toAttribute(n, o.type);
      this._$Em = t, s == null ? this.removeAttribute(l) : this.setAttribute(l, s), this._$Em = null;
    }
  }
  _$AK(t, n) {
    const o = this.constructor, l = o._$Eh.get(t);
    if (l !== void 0 && this._$Em !== l) {
      const s = o.getPropertyOptions(l), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : et;
      this._$Em = l;
      const p = a.fromAttribute(n, s.type);
      this[l] = p ?? this._$Ej?.get(l) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, n, o, l = !1, s) {
    if (t !== void 0) {
      const a = this.constructor;
      if (l === !1 && (s = this[t]), o ??= a.getPropertyOptions(t), !((o.hasChanged ?? Ht)(s, n) || o.useDefault && o.reflect && s === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, o)))) return;
      this.C(t, n, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, n, { useDefault: o, reflect: l, wrapped: s }, a) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? n ?? this[t]), s !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (n = void 0), this._$AL.set(t, n)), l === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [l, s] of o) {
        const { wrapped: a } = s, p = this[l];
        a !== !0 || this._$AL.has(l) || p === void 0 || this.C(l, void 0, s, p);
      }
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(n)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((n) => n.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((n) => this._$ET(n, this[n])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Te("elementProperties")] = /* @__PURE__ */ new Map(), ge[Te("finalized")] = /* @__PURE__ */ new Map(), hn?.({ ReactiveElement: ge }), (it.reactiveElementVersions ??= []).push("2.1.2");
const Bt = globalThis, Zt = (i) => i, tt = Bt.trustedTypes, Xt = tt ? tt.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Li = "$lit$", oe = `lit$${Math.random().toFixed(9).slice(2)}$`, Ii = "?" + oe, fn = `<${Ii}>`, ue = document, Me = () => ue.createComment(""), Re = (i) => i === null || typeof i != "object" && typeof i != "function", jt = Array.isArray, mn = (i) => jt(i) || typeof i?.[Symbol.iterator] == "function", ft = `[ 	
\f\r]`, Ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ei = /-->/g, ti = />/g, ae = RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ii = /'/g, ni = /"/g, Di = /^(?:script|style|textarea|title)$/i, gn = (i) => (t, ...n) => ({ _$litType$: i, strings: t, values: n }), T = gn(1), ve = /* @__PURE__ */ Symbol.for("lit-noChange"), R = /* @__PURE__ */ Symbol.for("lit-nothing"), ri = /* @__PURE__ */ new WeakMap(), ce = ue.createTreeWalker(ue, 129);
function Fi(i, t) {
  if (!jt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Xt !== void 0 ? Xt.createHTML(t) : t;
}
const yn = (i, t) => {
  const n = i.length - 1, o = [];
  let l, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Ce;
  for (let p = 0; p < n; p++) {
    const m = i[p];
    let u, h, _ = -1, O = 0;
    for (; O < m.length && (a.lastIndex = O, h = a.exec(m), h !== null); ) O = a.lastIndex, a === Ce ? h[1] === "!--" ? a = ei : h[1] !== void 0 ? a = ti : h[2] !== void 0 ? (Di.test(h[2]) && (l = RegExp("</" + h[2], "g")), a = ae) : h[3] !== void 0 && (a = ae) : a === ae ? h[0] === ">" ? (a = l ?? Ce, _ = -1) : h[1] === void 0 ? _ = -2 : (_ = a.lastIndex - h[2].length, u = h[1], a = h[3] === void 0 ? ae : h[3] === '"' ? ni : ii) : a === ni || a === ii ? a = ae : a === ei || a === ti ? a = Ce : (a = ae, l = void 0);
    const N = a === ae && i[p + 1].startsWith("/>") ? " " : "";
    s += a === Ce ? m + fn : _ >= 0 ? (o.push(u), m.slice(0, _) + Li + m.slice(_) + oe + N) : m + oe + (_ === -2 ? p : N);
  }
  return [Fi(i, s + (i[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class Ne {
  constructor({ strings: t, _$litType$: n }, o) {
    let l;
    this.parts = [];
    let s = 0, a = 0;
    const p = t.length - 1, m = this.parts, [u, h] = yn(t, n);
    if (this.el = Ne.createElement(u, o), ce.currentNode = this.el.content, n === 2 || n === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (l = ce.nextNode()) !== null && m.length < p; ) {
      if (l.nodeType === 1) {
        if (l.hasAttributes()) for (const _ of l.getAttributeNames()) if (_.endsWith(Li)) {
          const O = h[a++], N = l.getAttribute(_).split(oe), W = /([.?@])?(.*)/.exec(O);
          m.push({ type: 1, index: s, name: W[2], strings: N, ctor: W[1] === "." ? bn : W[1] === "?" ? _n : W[1] === "@" ? An : nt }), l.removeAttribute(_);
        } else _.startsWith(oe) && (m.push({ type: 6, index: s }), l.removeAttribute(_));
        if (Di.test(l.tagName)) {
          const _ = l.textContent.split(oe), O = _.length - 1;
          if (O > 0) {
            l.textContent = tt ? tt.emptyScript : "";
            for (let N = 0; N < O; N++) l.append(_[N], Me()), ce.nextNode(), m.push({ type: 2, index: ++s });
            l.append(_[O], Me());
          }
        }
      } else if (l.nodeType === 8) if (l.data === Ii) m.push({ type: 2, index: s });
      else {
        let _ = -1;
        for (; (_ = l.data.indexOf(oe, _ + 1)) !== -1; ) m.push({ type: 7, index: s }), _ += oe.length - 1;
      }
      s++;
    }
  }
  static createElement(t, n) {
    const o = ue.createElement("template");
    return o.innerHTML = t, o;
  }
}
function be(i, t, n = i, o) {
  if (t === ve) return t;
  let l = o !== void 0 ? n._$Co?.[o] : n._$Cl;
  const s = Re(t) ? void 0 : t._$litDirective$;
  return l?.constructor !== s && (l?._$AO?.(!1), s === void 0 ? l = void 0 : (l = new s(i), l._$AT(i, n, o)), o !== void 0 ? (n._$Co ??= [])[o] = l : n._$Cl = l), l !== void 0 && (t = be(i, l._$AS(i, t.values), l, o)), t;
}
class vn {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: o } = this._$AD, l = (t?.creationScope ?? ue).importNode(n, !0);
    ce.currentNode = l;
    let s = ce.nextNode(), a = 0, p = 0, m = o[0];
    for (; m !== void 0; ) {
      if (a === m.index) {
        let u;
        m.type === 2 ? u = new Le(s, s.nextSibling, this, t) : m.type === 1 ? u = new m.ctor(s, m.name, m.strings, this, t) : m.type === 6 && (u = new $n(s, this, t)), this._$AV.push(u), m = o[++p];
      }
      a !== m?.index && (s = ce.nextNode(), a++);
    }
    return ce.currentNode = ue, l;
  }
  p(t) {
    let n = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, n), n += o.strings.length - 2) : o._$AI(t[n])), n++;
  }
}
class Le {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, n, o, l) {
    this.type = 2, this._$AH = R, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = o, this.options = l, this._$Cv = l?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && t?.nodeType === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = be(this, t, n), Re(t) ? t === R || t == null || t === "" ? (this._$AH !== R && this._$AR(), this._$AH = R) : t !== this._$AH && t !== ve && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : mn(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== R && Re(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ue.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: n, _$litType$: o } = t, l = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = Ne.createElement(Fi(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === l) this._$AH.p(n);
    else {
      const s = new vn(l, this), a = s.u(this.options);
      s.p(n), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let n = ri.get(t.strings);
    return n === void 0 && ri.set(t.strings, n = new Ne(t)), n;
  }
  k(t) {
    jt(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let o, l = 0;
    for (const s of t) l === n.length ? n.push(o = new Le(this.O(Me()), this.O(Me()), this, this.options)) : o = n[l], o._$AI(s), l++;
    l < n.length && (this._$AR(o && o._$AB.nextSibling, l), n.length = l);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); t !== this._$AB; ) {
      const o = Zt(t).nextSibling;
      Zt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, o, l, s) {
    this.type = 1, this._$AH = R, this._$AN = void 0, this.element = t, this.name = n, this._$AM = l, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = R;
  }
  _$AI(t, n = this, o, l) {
    const s = this.strings;
    let a = !1;
    if (s === void 0) t = be(this, t, n, 0), a = !Re(t) || t !== this._$AH && t !== ve, a && (this._$AH = t);
    else {
      const p = t;
      let m, u;
      for (t = s[0], m = 0; m < s.length - 1; m++) u = be(this, p[o + m], n, m), u === ve && (u = this._$AH[m]), a ||= !Re(u) || u !== this._$AH[m], u === R ? t = R : t !== R && (t += (u ?? "") + s[m + 1]), this._$AH[m] = u;
    }
    a && !l && this.j(t);
  }
  j(t) {
    t === R ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class bn extends nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === R ? void 0 : t;
  }
}
class _n extends nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== R);
  }
}
class An extends nt {
  constructor(t, n, o, l, s) {
    super(t, n, o, l, s), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = be(this, t, n, 0) ?? R) === ve) return;
    const o = this._$AH, l = t === R && o !== R || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, s = t !== R && (o === R || l);
    l && this.element.removeEventListener(this.name, this, o), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class $n {
  constructor(t, n, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    be(this, t);
  }
}
const xn = Bt.litHtmlPolyfillSupport;
xn?.(Ne, Le), (Bt.litHtmlVersions ??= []).push("3.3.3");
const wn = (i, t, n) => {
  const o = n?.renderBefore ?? t;
  let l = o._$litPart$;
  if (l === void 0) {
    const s = n?.renderBefore ?? null;
    o._$litPart$ = l = new Le(t.insertBefore(Me(), s), s, void 0, n ?? {});
  }
  return l._$AI(i), l;
};
const Kt = globalThis;
class Oe extends ge {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = wn(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ve;
  }
}
Oe._$litElement$ = !0, Oe.finalized = !0, Kt.litElementHydrateSupport?.({ LitElement: Oe });
const kn = Kt.litElementPolyfillSupport;
kn?.({ LitElement: Oe });
(Kt.litElementVersions ??= []).push("4.2.2");
const Sn = (i) => (t, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const Cn = { attribute: !0, type: String, converter: et, reflect: !1, hasChanged: Ht }, En = (i = Cn, t, n) => {
  const { kind: o, metadata: l } = n;
  let s = globalThis.litPropertyMetadata.get(l);
  if (s === void 0 && globalThis.litPropertyMetadata.set(l, s = /* @__PURE__ */ new Map()), o === "setter" && ((i = Object.create(i)).wrapped = !0), s.set(n.name, i), o === "accessor") {
    const { name: a } = n;
    return { set(p) {
      const m = t.get.call(this);
      t.set.call(this, p), this.requestUpdate(a, m, i, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(a, void 0, i, p), p;
    } };
  }
  if (o === "setter") {
    const { name: a } = n;
    return function(p) {
      const m = this[a];
      t.call(this, p), this.requestUpdate(a, m, i, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Pi(i) {
  return (t, n) => typeof n == "object" ? En(i, t, n) : ((o, l, s) => {
    const a = l.hasOwnProperty(s);
    return l.constructor.createProperty(s, o), a ? Object.getOwnPropertyDescriptor(l, s) : void 0;
  })(i, t, n);
}
function P(i) {
  return Pi({ ...i, state: !0, attribute: !1 });
}
function Tn(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var B = {}, Ge = {}, re = {}, oi;
function Ie() {
  if (oi) return re;
  oi = 1;
  function i(a) {
    return typeof a > "u" || a === null;
  }
  function t(a) {
    return typeof a == "object" && a !== null;
  }
  function n(a) {
    return Array.isArray(a) ? a : i(a) ? [] : [a];
  }
  function o(a, p) {
    if (p) {
      const m = Object.keys(p);
      for (let u = 0, h = m.length; u < h; u += 1) {
        const _ = m[u];
        a[_] = p[_];
      }
    }
    return a;
  }
  function l(a, p) {
    let m = "";
    for (let u = 0; u < p; u += 1)
      m += a;
    return m;
  }
  function s(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return re.isNothing = i, re.isObject = t, re.toArray = n, re.repeat = l, re.isNegativeZero = s, re.extend = o, re;
}
var mt, li;
function De() {
  if (li) return mt;
  li = 1;
  function i(n, o) {
    let l = "";
    const s = n.reason || "(unknown reason)";
    return n.mark ? (n.mark.name && (l += 'in "' + n.mark.name + '" '), l += "(" + (n.mark.line + 1) + ":" + (n.mark.column + 1) + ")", !o && n.mark.snippet && (l += `

` + n.mark.snippet), s + " " + l) : s;
  }
  function t(n, o) {
    Error.call(this), this.name = "YAMLException", this.reason = n, this.mark = o, this.message = i(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = function(o) {
    return this.name + ": " + i(this, o);
  }, mt = t, mt;
}
var gt, si;
function On() {
  if (si) return gt;
  si = 1;
  const i = Ie();
  function t(l, s, a, p, m) {
    let u = "", h = "";
    const _ = Math.floor(m / 2) - 1;
    return p - s > _ && (u = " ... ", s = p - _ + u.length), a - p > _ && (h = " ...", a = p + _ - h.length), {
      str: u + l.slice(s, a).replace(/\t/g, "→") + h,
      pos: p - s + u.length
      // relative position
    };
  }
  function n(l, s) {
    return i.repeat(" ", s - l.length) + l;
  }
  function o(l, s) {
    if (s = Object.create(s || null), !l.buffer) return null;
    s.maxLength || (s.maxLength = 79), typeof s.indent != "number" && (s.indent = 1), typeof s.linesBefore != "number" && (s.linesBefore = 3), typeof s.linesAfter != "number" && (s.linesAfter = 2);
    const a = /\r?\n|\r|\0/g, p = [0], m = [];
    let u, h = -1;
    for (; u = a.exec(l.buffer); )
      m.push(u.index), p.push(u.index + u[0].length), l.position <= u.index && h < 0 && (h = p.length - 2);
    h < 0 && (h = p.length - 1);
    let _ = "";
    const O = Math.min(l.line + s.linesAfter, m.length).toString().length, N = s.maxLength - (s.indent + O + 3);
    for (let q = 1; q <= s.linesBefore && !(h - q < 0); q++) {
      const G = t(
        l.buffer,
        p[h - q],
        m[h - q],
        l.position - (p[h] - p[h - q]),
        N
      );
      _ = i.repeat(" ", s.indent) + n((l.line - q + 1).toString(), O) + " | " + G.str + `
` + _;
    }
    const W = t(l.buffer, p[h], m[h], l.position, N);
    _ += i.repeat(" ", s.indent) + n((l.line + 1).toString(), O) + " | " + W.str + `
`, _ += i.repeat("-", s.indent + O + 3 + W.pos) + `^
`;
    for (let q = 1; q <= s.linesAfter && !(h + q >= m.length); q++) {
      const G = t(
        l.buffer,
        p[h + q],
        m[h + q],
        l.position - (p[h] - p[h + q]),
        N
      );
      _ += i.repeat(" ", s.indent) + n((l.line + q + 1).toString(), O) + " | " + G.str + `
`;
    }
    return _.replace(/\n$/, "");
  }
  return gt = o, gt;
}
var yt, ai;
function j() {
  if (ai) return yt;
  ai = 1;
  const i = De(), t = [
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
  function o(s) {
    const a = {};
    return s !== null && Object.keys(s).forEach(function(p) {
      s[p].forEach(function(m) {
        a[String(m)] = p;
      });
    }), a;
  }
  function l(s, a) {
    if (a = a || {}, Object.keys(a).forEach(function(p) {
      if (t.indexOf(p) === -1)
        throw new i('Unknown option "' + p + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = a, this.tag = s, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(p) {
      return p;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = o(a.styleAliases || null), n.indexOf(this.kind) === -1)
      throw new i('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return yt = l, yt;
}
var vt, ci;
function qi() {
  if (ci) return vt;
  ci = 1;
  const i = De(), t = j();
  function n(s, a) {
    const p = [];
    return s[a].forEach(function(m) {
      let u = p.length;
      p.forEach(function(h, _) {
        h.tag === m.tag && h.kind === m.kind && h.multi === m.multi && (u = _);
      }), p[u] = m;
    }), p;
  }
  function o() {
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
    function a(p) {
      p.multi ? (s.multi[p.kind].push(p), s.multi.fallback.push(p)) : s[p.kind][p.tag] = s.fallback[p.tag] = p;
    }
    for (let p = 0, m = arguments.length; p < m; p += 1)
      arguments[p].forEach(a);
    return s;
  }
  function l(s) {
    return this.extend(s);
  }
  return l.prototype.extend = function(a) {
    let p = [], m = [];
    if (a instanceof t)
      m.push(a);
    else if (Array.isArray(a))
      m = m.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (p = p.concat(a.implicit)), a.explicit && (m = m.concat(a.explicit));
    else
      throw new i("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    p.forEach(function(h) {
      if (!(h instanceof t))
        throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new i("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new i("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), m.forEach(function(h) {
      if (!(h instanceof t))
        throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const u = Object.create(l.prototype);
    return u.implicit = (this.implicit || []).concat(p), u.explicit = (this.explicit || []).concat(m), u.compiledImplicit = n(u, "implicit"), u.compiledExplicit = n(u, "explicit"), u.compiledTypeMap = o(u.compiledImplicit, u.compiledExplicit), u;
  }, vt = l, vt;
}
var bt, ui;
function Ui() {
  if (ui) return bt;
  ui = 1;
  const i = j();
  return bt = new i("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(t) {
      return t !== null ? t : "";
    }
  }), bt;
}
var _t, di;
function Yi() {
  if (di) return _t;
  di = 1;
  const i = j();
  return _t = new i("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(t) {
      return t !== null ? t : [];
    }
  }), _t;
}
var At, pi;
function Hi() {
  if (pi) return At;
  pi = 1;
  const i = j();
  return At = new i("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(t) {
      return t !== null ? t : {};
    }
  }), At;
}
var $t, hi;
function Bi() {
  if (hi) return $t;
  hi = 1;
  const i = qi();
  return $t = new i({
    explicit: [
      Ui(),
      Yi(),
      Hi()
    ]
  }), $t;
}
var xt, fi;
function ji() {
  if (fi) return xt;
  fi = 1;
  const i = j();
  function t(l) {
    if (l === null) return !0;
    const s = l.length;
    return s === 1 && l === "~" || s === 4 && (l === "null" || l === "Null" || l === "NULL");
  }
  function n() {
    return null;
  }
  function o(l) {
    return l === null;
  }
  return xt = new i("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: n,
    predicate: o,
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
  }), xt;
}
var wt, mi;
function Ki() {
  if (mi) return wt;
  mi = 1;
  const i = j();
  function t(l) {
    if (l === null) return !1;
    const s = l.length;
    return s === 4 && (l === "true" || l === "True" || l === "TRUE") || s === 5 && (l === "false" || l === "False" || l === "FALSE");
  }
  function n(l) {
    return l === "true" || l === "True" || l === "TRUE";
  }
  function o(l) {
    return Object.prototype.toString.call(l) === "[object Boolean]";
  }
  return wt = new i("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: n,
    predicate: o,
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
  }), wt;
}
var kt, gi;
function zi() {
  if (gi) return kt;
  gi = 1;
  const i = Ie(), t = j();
  function n(u) {
    return u >= 48 && u <= 57 || u >= 65 && u <= 70 || u >= 97 && u <= 102;
  }
  function o(u) {
    return u >= 48 && u <= 55;
  }
  function l(u) {
    return u >= 48 && u <= 57;
  }
  function s(u) {
    if (u === null) return !1;
    const h = u.length;
    let _ = 0, O = !1;
    if (!h) return !1;
    let N = u[_];
    if ((N === "-" || N === "+") && (N = u[++_]), N === "0") {
      if (_ + 1 === h) return !0;
      if (N = u[++_], N === "b") {
        for (_++; _ < h; _++) {
          if (N = u[_], N !== "0" && N !== "1") return !1;
          O = !0;
        }
        return O && isFinite(a(u));
      }
      if (N === "x") {
        for (_++; _ < h; _++) {
          if (!n(u.charCodeAt(_))) return !1;
          O = !0;
        }
        return O && isFinite(a(u));
      }
      if (N === "o") {
        for (_++; _ < h; _++) {
          if (!o(u.charCodeAt(_))) return !1;
          O = !0;
        }
        return O && isFinite(a(u));
      }
    }
    for (; _ < h; _++) {
      if (!l(u.charCodeAt(_)))
        return !1;
      O = !0;
    }
    return O ? isFinite(a(u)) : !1;
  }
  function a(u) {
    let h = u, _ = 1, O = h[0];
    if ((O === "-" || O === "+") && (O === "-" && (_ = -1), h = h.slice(1), O = h[0]), h === "0") return 0;
    if (O === "0") {
      if (h[1] === "b") return _ * parseInt(h.slice(2), 2);
      if (h[1] === "x") return _ * parseInt(h.slice(2), 16);
      if (h[1] === "o") return _ * parseInt(h.slice(2), 8);
    }
    return _ * parseInt(h, 10);
  }
  function p(u) {
    return a(u);
  }
  function m(u) {
    return Object.prototype.toString.call(u) === "[object Number]" && u % 1 === 0 && !i.isNegativeZero(u);
  }
  return kt = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: s,
    construct: p,
    predicate: m,
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
  }), kt;
}
var St, yi;
function Ji() {
  if (yi) return St;
  yi = 1;
  const i = Ie(), t = j(), n = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), o = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function l(u) {
    return u === null || !n.test(u) ? !1 : isFinite(parseFloat(u, 10)) ? !0 : o.test(u);
  }
  function s(u) {
    let h = u.toLowerCase();
    const _ = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? _ === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : _ * parseFloat(h, 10);
  }
  const a = /^[-+]?[0-9]+e/;
  function p(u, h) {
    if (isNaN(u))
      switch (h) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === u)
      switch (h) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === u)
      switch (h) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (i.isNegativeZero(u))
      return "-0.0";
    const _ = u.toString(10);
    return a.test(_) ? _.replace("e", ".e") : _;
  }
  function m(u) {
    return Object.prototype.toString.call(u) === "[object Number]" && (u % 1 !== 0 || i.isNegativeZero(u));
  }
  return St = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: l,
    construct: s,
    predicate: m,
    represent: p,
    defaultStyle: "lowercase"
  }), St;
}
var Ct, vi;
function Wi() {
  return vi || (vi = 1, Ct = Bi().extend({
    implicit: [
      ji(),
      Ki(),
      zi(),
      Ji()
    ]
  })), Ct;
}
var Et, bi;
function Vi() {
  return bi || (bi = 1, Et = Wi()), Et;
}
var Tt, _i;
function Gi() {
  if (_i) return Tt;
  _i = 1;
  const i = j(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), n = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function o(a) {
    return a === null ? !1 : t.exec(a) !== null || n.exec(a) !== null;
  }
  function l(a) {
    let p = 0, m = null, u = t.exec(a);
    if (u === null && (u = n.exec(a)), u === null) throw new Error("Date resolve error");
    const h = +u[1], _ = +u[2] - 1, O = +u[3];
    if (!u[4])
      return new Date(Date.UTC(h, _, O));
    const N = +u[4], W = +u[5], q = +u[6];
    if (u[7]) {
      for (p = u[7].slice(0, 3); p.length < 3; )
        p += "0";
      p = +p;
    }
    if (u[9]) {
      const le = +u[10], K = +(u[11] || 0);
      m = (le * 60 + K) * 6e4, u[9] === "-" && (m = -m);
    }
    const G = new Date(Date.UTC(h, _, O, N, W, q, p));
    return m && G.setTime(G.getTime() - m), G;
  }
  function s(a) {
    return a.toISOString();
  }
  return Tt = new i("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: o,
    construct: l,
    instanceOf: Date,
    represent: s
  }), Tt;
}
var Ot, Ai;
function Qi() {
  if (Ai) return Ot;
  Ai = 1;
  const i = j();
  function t(n) {
    return n === "<<" || n === null;
  }
  return Ot = new i("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), Ot;
}
var Mt, $i;
function Zi() {
  if ($i) return Mt;
  $i = 1;
  const i = j(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function n(a) {
    if (a === null) return !1;
    let p = 0;
    const m = a.length, u = t;
    for (let h = 0; h < m; h++) {
      const _ = u.indexOf(a.charAt(h));
      if (!(_ > 64)) {
        if (_ < 0) return !1;
        p += 6;
      }
    }
    return p % 8 === 0;
  }
  function o(a) {
    const p = a.replace(/[\r\n=]/g, ""), m = p.length, u = t;
    let h = 0;
    const _ = [];
    for (let N = 0; N < m; N++)
      N % 4 === 0 && N && (_.push(h >> 16 & 255), _.push(h >> 8 & 255), _.push(h & 255)), h = h << 6 | u.indexOf(p.charAt(N));
    const O = m % 4 * 6;
    return O === 0 ? (_.push(h >> 16 & 255), _.push(h >> 8 & 255), _.push(h & 255)) : O === 18 ? (_.push(h >> 10 & 255), _.push(h >> 2 & 255)) : O === 12 && _.push(h >> 4 & 255), new Uint8Array(_);
  }
  function l(a) {
    let p = "", m = 0;
    const u = a.length, h = t;
    for (let O = 0; O < u; O++)
      O % 3 === 0 && O && (p += h[m >> 18 & 63], p += h[m >> 12 & 63], p += h[m >> 6 & 63], p += h[m & 63]), m = (m << 8) + a[O];
    const _ = u % 3;
    return _ === 0 ? (p += h[m >> 18 & 63], p += h[m >> 12 & 63], p += h[m >> 6 & 63], p += h[m & 63]) : _ === 2 ? (p += h[m >> 10 & 63], p += h[m >> 4 & 63], p += h[m << 2 & 63], p += h[64]) : _ === 1 && (p += h[m >> 2 & 63], p += h[m << 4 & 63], p += h[64], p += h[64]), p;
  }
  function s(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return Mt = new i("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: n,
    construct: o,
    predicate: s,
    represent: l
  }), Mt;
}
var Rt, xi;
function Xi() {
  if (xi) return Rt;
  xi = 1;
  const i = j(), t = Object.prototype.hasOwnProperty, n = Object.prototype.toString;
  function o(s) {
    if (s === null) return !0;
    const a = {}, p = s;
    for (let m = 0, u = p.length; m < u; m += 1) {
      const h = p[m];
      let _ = !1;
      if (n.call(h) !== "[object Object]") return !1;
      let O;
      for (O in h)
        if (t.call(h, O))
          if (!_) _ = !0;
          else return !1;
      if (!_ || t.call(a, O)) return !1;
      Object.defineProperty(a, O, { value: !0 });
    }
    return !0;
  }
  function l(s) {
    return s !== null ? s : [];
  }
  return Rt = new i("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: o,
    construct: l
  }), Rt;
}
var Nt, wi;
function en() {
  if (wi) return Nt;
  wi = 1;
  const i = j(), t = Object.prototype.toString;
  function n(l) {
    if (l === null) return !0;
    const s = l, a = new Array(s.length);
    for (let p = 0, m = s.length; p < m; p += 1) {
      const u = s[p];
      if (t.call(u) !== "[object Object]") return !1;
      const h = Object.keys(u);
      if (h.length !== 1) return !1;
      a[p] = [h[0], u[h[0]]];
    }
    return !0;
  }
  function o(l) {
    if (l === null) return [];
    const s = l, a = new Array(s.length);
    for (let p = 0, m = s.length; p < m; p += 1) {
      const u = s[p], h = Object.keys(u);
      a[p] = [h[0], u[h[0]]];
    }
    return a;
  }
  return Nt = new i("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: n,
    construct: o
  }), Nt;
}
var Lt, ki;
function tn() {
  if (ki) return Lt;
  ki = 1;
  const i = j(), t = Object.prototype.hasOwnProperty;
  function n(l) {
    if (l === null) return !0;
    const s = l;
    for (const a in s)
      if (t.call(s, a) && s[a] !== null)
        return !1;
    return !0;
  }
  function o(l) {
    return l !== null ? l : {};
  }
  return Lt = new i("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: n,
    construct: o
  }), Lt;
}
var It, Si;
function zt() {
  return Si || (Si = 1, It = Vi().extend({
    implicit: [
      Gi(),
      Qi()
    ],
    explicit: [
      Zi(),
      Xi(),
      en(),
      tn()
    ]
  })), It;
}
var Ci;
function Mn() {
  if (Ci) return Ge;
  Ci = 1;
  const i = Ie(), t = De(), n = On(), o = zt(), l = Object.prototype.hasOwnProperty, s = 1, a = 2, p = 3, m = 4, u = 1, h = 2, _ = 3, O = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, N = /[\x85\u2028\u2029]/, W = /[,\[\]{}]/, q = /^(?:!|!!|![0-9A-Za-z-]+!)$/, G = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function le(e) {
    return Object.prototype.toString.call(e);
  }
  function K(e) {
    return e === 10 || e === 13;
  }
  function z(e) {
    return e === 9 || e === 32;
  }
  function H(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function ie(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function ot(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const c = e | 32;
    return c >= 97 && c <= 102 ? c - 97 + 10 : -1;
  }
  function lt(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function Fe(e) {
    return e >= 48 && e <= 57 ? e - 48 : -1;
  }
  function _e(e) {
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
  function st(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function Ae(e, c, g) {
    c === "__proto__" ? Object.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: g
    }) : e[c] = g;
  }
  const Pe = new Array(256), $e = new Array(256);
  for (let e = 0; e < 256; e++)
    Pe[e] = _e(e) ? 1 : 0, $e[e] = _e(e);
  function Y(e, c) {
    this.input = e, this.filename = c.filename || null, this.schema = c.schema || o, this.onWarning = c.onWarning || null, this.legacy = c.legacy || !1, this.json = c.json || !1, this.listener = c.listener || null, this.maxDepth = typeof c.maxDepth == "number" ? c.maxDepth : 100, this.maxTotalMergeKeys = typeof c.maxTotalMergeKeys == "number" ? c.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function qe(e, c) {
    const g = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return g.snippet = n(g), new t(c, g);
  }
  function C(e, c) {
    throw qe(e, c);
  }
  function de(e, c) {
    e.onWarning && e.onWarning.call(null, qe(e, c));
  }
  function Q(e, c, g) {
    const b = e.anchorMapTransactions;
    if (b.length !== 0) {
      const f = b[b.length - 1];
      l.call(f, c) || (f[c] = {
        existed: l.call(e.anchorMap, c),
        value: e.anchorMap[c]
      });
    }
    e.anchorMap[c] = g;
  }
  function at(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function se(e) {
    const c = e.anchorMapTransactions.pop(), g = e.anchorMapTransactions;
    if (g.length === 0) return;
    const b = g[g.length - 1], f = Object.keys(c);
    for (let w = 0, r = f.length; w < r; w += 1) {
      const d = f[w];
      l.call(b, d) || (b[d] = c[d]);
    }
  }
  function ct(e) {
    const c = e.anchorMapTransactions.pop(), g = Object.keys(c);
    for (let b = g.length - 1; b >= 0; b -= 1) {
      const f = c[g[b]];
      f.existed ? e.anchorMap[g[b]] = f.value : delete e.anchorMap[g[b]];
    }
  }
  function xe(e) {
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
  function pe(e, c) {
    e.position = c.position, e.line = c.line, e.lineStart = c.lineStart, e.lineIndent = c.lineIndent, e.firstTabInLine = c.firstTabInLine, e.tag = c.tag, e.anchor = c.anchor, e.kind = c.kind, e.result = c.result;
  }
  const Ue = {
    YAML: function(c, g, b) {
      c.version !== null && C(c, "duplication of %YAML directive"), b.length !== 1 && C(c, "YAML directive accepts exactly one argument");
      const f = /^([0-9]+)\.([0-9]+)$/.exec(b[0]);
      f === null && C(c, "ill-formed argument of the YAML directive");
      const w = parseInt(f[1], 10), r = parseInt(f[2], 10);
      w !== 1 && C(c, "unacceptable YAML version of the document"), c.version = b[0], c.checkLineBreaks = r < 2, r !== 1 && r !== 2 && de(c, "unsupported YAML version of the document");
    },
    TAG: function(c, g, b) {
      let f;
      b.length !== 2 && C(c, "TAG directive accepts exactly two arguments");
      const w = b[0];
      f = b[1], q.test(w) || C(c, "ill-formed tag handle (first argument) of the TAG directive"), l.call(c.tagMap, w) && C(c, 'there is a previously declared suffix for "' + w + '" tag handle'), G.test(f) || C(c, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        f = decodeURIComponent(f);
      } catch {
        C(c, "tag prefix is malformed: " + f);
      }
      c.tagMap[w] = f;
    }
  };
  function V(e, c, g, b) {
    if (c < g) {
      const f = e.input.slice(c, g);
      if (b)
        for (let w = 0, r = f.length; w < r; w += 1) {
          const d = f.charCodeAt(w);
          d === 9 || d >= 32 && d <= 1114111 || C(e, "expected valid JSON character");
        }
      else O.test(f) && C(e, "the stream contains non-printable characters");
      e.result += f;
    }
  }
  function ne(e, c, g, b) {
    i.isObject(g) || C(e, "cannot merge mappings; the provided source object is unacceptable");
    const f = Object.keys(g);
    for (let w = 0, r = f.length; w < r; w += 1) {
      const d = f[w];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && C(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), l.call(c, d) || (Ae(c, d, g[d]), b[d] = !0);
    }
  }
  function Z(e, c, g, b, f, w, r, d, $) {
    if (Array.isArray(f)) {
      f = Array.prototype.slice.call(f);
      for (let y = 0, v = f.length; y < v; y += 1)
        Array.isArray(f[y]) && C(e, "nested arrays are not supported inside keys"), typeof f == "object" && le(f[y]) === "[object Object]" && (f[y] = "[object Object]");
    }
    if (typeof f == "object" && le(f) === "[object Object]" && (f = "[object Object]"), f = String(f), c === null && (c = {}), b === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let y = 0, v = w.length; y < v; y += 1)
          ne(e, c, w[y], g);
      else
        ne(e, c, w, g);
    else
      !e.json && !l.call(g, f) && l.call(c, f) && (e.line = r || e.line, e.lineStart = d || e.lineStart, e.position = $ || e.position, C(e, "duplicated mapping key")), Ae(c, f, w), delete g[f];
    return c;
  }
  function he(e) {
    const c = e.input.charCodeAt(e.position);
    c === 10 ? e.position++ : c === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : C(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function U(e, c, g) {
    let b = 0, f = e.input.charCodeAt(e.position);
    for (; f !== 0; ) {
      for (; z(f); )
        f === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), f = e.input.charCodeAt(++e.position);
      if (c && f === 35)
        do
          f = e.input.charCodeAt(++e.position);
        while (f !== 10 && f !== 13 && f !== 0);
      if (K(f))
        for (he(e), f = e.input.charCodeAt(e.position), b++, e.lineIndent = 0; f === 32; )
          e.lineIndent++, f = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return g !== -1 && b !== 0 && e.lineIndent < g && de(e, "deficient indentation"), b;
  }
  function fe(e) {
    let c = e.position, g = e.input.charCodeAt(c);
    return !!((g === 45 || g === 46) && g === e.input.charCodeAt(c + 1) && g === e.input.charCodeAt(c + 2) && (c += 3, g = e.input.charCodeAt(c), g === 0 || H(g)));
  }
  function X(e, c) {
    c === 1 ? e.result += " " : c > 1 && (e.result += i.repeat(`
`, c - 1));
  }
  function Ye(e, c, g) {
    let b, f, w, r, d, $;
    const y = e.kind, v = e.result;
    let x = e.input.charCodeAt(e.position);
    if (H(x) || ie(x) || x === 35 || x === 38 || x === 42 || x === 33 || x === 124 || x === 62 || x === 39 || x === 34 || x === 37 || x === 64 || x === 96)
      return !1;
    if (x === 63 || x === 45) {
      const A = e.input.charCodeAt(e.position + 1);
      if (H(A) || g && ie(A))
        return !1;
    }
    for (e.kind = "scalar", e.result = "", b = f = e.position, w = !1; x !== 0; ) {
      if (x === 58) {
        const A = e.input.charCodeAt(e.position + 1);
        if (H(A) || g && ie(A))
          break;
      } else if (x === 35) {
        const A = e.input.charCodeAt(e.position - 1);
        if (H(A))
          break;
      } else {
        if (e.position === e.lineStart && fe(e) || g && ie(x))
          break;
        if (K(x))
          if (r = e.line, d = e.lineStart, $ = e.lineIndent, U(e, !1, -1), e.lineIndent >= c) {
            w = !0, x = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = f, e.line = r, e.lineStart = d, e.lineIndent = $;
            break;
          }
      }
      w && (V(e, b, f, !1), X(e, e.line - r), b = f = e.position, w = !1), z(x) || (f = e.position + 1), x = e.input.charCodeAt(++e.position);
    }
    return V(e, b, f, !1), e.result ? !0 : (e.kind = y, e.result = v, !1);
  }
  function He(e, c) {
    let g, b, f = e.input.charCodeAt(e.position);
    if (f !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, g = b = e.position; (f = e.input.charCodeAt(e.position)) !== 0; )
      if (f === 39)
        if (V(e, g, e.position, !0), f = e.input.charCodeAt(++e.position), f === 39)
          g = e.position, e.position++, b = e.position;
        else
          return !0;
      else K(f) ? (V(e, g, b, !0), X(e, U(e, !1, c)), g = b = e.position) : e.position === e.lineStart && fe(e) ? C(e, "unexpected end of the document within a single quoted scalar") : (e.position++, z(f) || (b = e.position));
    C(e, "unexpected end of the stream within a single quoted scalar");
  }
  function we(e, c) {
    let g, b, f, w = e.input.charCodeAt(e.position);
    if (w !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, g = b = e.position; (w = e.input.charCodeAt(e.position)) !== 0; ) {
      if (w === 34)
        return V(e, g, e.position, !0), e.position++, !0;
      if (w === 92) {
        if (V(e, g, e.position, !0), w = e.input.charCodeAt(++e.position), K(w))
          U(e, !1, c);
        else if (w < 256 && Pe[w])
          e.result += $e[w], e.position++;
        else if ((f = lt(w)) > 0) {
          let r = f, d = 0;
          for (; r > 0; r--)
            w = e.input.charCodeAt(++e.position), (f = ot(w)) >= 0 ? d = (d << 4) + f : C(e, "expected hexadecimal character");
          e.result += st(d), e.position++;
        } else
          C(e, "unknown escape sequence");
        g = b = e.position;
      } else K(w) ? (V(e, g, b, !0), X(e, U(e, !1, c)), g = b = e.position) : e.position === e.lineStart && fe(e) ? C(e, "unexpected end of the document within a double quoted scalar") : (e.position++, z(w) || (b = e.position));
    }
    C(e, "unexpected end of the stream within a double quoted scalar");
  }
  function Be(e, c) {
    let g = !0, b, f, w;
    const r = e.tag;
    let d;
    const $ = e.anchor;
    let y, v, x, A;
    const S = /* @__PURE__ */ Object.create(null);
    let k, E, M, L = e.input.charCodeAt(e.position);
    if (L === 91)
      y = 93, A = !1, d = [];
    else if (L === 123)
      y = 125, A = !0, d = {};
    else
      return !1;
    for (e.anchor !== null && Q(e, e.anchor, d), L = e.input.charCodeAt(++e.position); L !== 0; ) {
      if (U(e, !0, c), L = e.input.charCodeAt(e.position), L === y)
        return e.position++, e.tag = r, e.anchor = $, e.kind = A ? "mapping" : "sequence", e.result = d, !0;
      if (g ? L === 44 && C(e, "expected the node content, but found ','") : C(e, "missed comma between flow collection entries"), E = k = M = null, v = x = !1, L === 63) {
        const F = e.input.charCodeAt(e.position + 1);
        H(F) && (v = x = !0, e.position++, U(e, !0, c));
      }
      b = e.line, f = e.lineStart, w = e.position, te(e, c, s, !1, !0), E = e.tag, k = e.result, U(e, !0, c), L = e.input.charCodeAt(e.position), (x || e.line === b) && L === 58 && (v = !0, L = e.input.charCodeAt(++e.position), U(e, !0, c), te(e, c, s, !1, !0), M = e.result), A ? Z(e, d, S, E, k, M, b, f, w) : v ? d.push(Z(e, null, S, E, k, M, b, f, w)) : d.push(k), U(e, !0, c), L = e.input.charCodeAt(e.position), L === 44 ? (g = !0, L = e.input.charCodeAt(++e.position)) : g = !1;
    }
    C(e, "unexpected end of the stream within a flow collection");
  }
  function je(e, c) {
    let g, b = u, f = !1, w = !1, r = c, d = 0, $ = !1, y, v = e.input.charCodeAt(e.position);
    if (v === 124)
      g = !1;
    else if (v === 62)
      g = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; v !== 0; )
      if (v = e.input.charCodeAt(++e.position), v === 43 || v === 45)
        u === b ? b = v === 43 ? _ : h : C(e, "repeat of a chomping mode identifier");
      else if ((y = Fe(v)) >= 0)
        y === 0 ? C(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : w ? C(e, "repeat of an indentation width identifier") : (r = c + y - 1, w = !0);
      else
        break;
    if (z(v)) {
      do
        v = e.input.charCodeAt(++e.position);
      while (z(v));
      if (v === 35)
        do
          v = e.input.charCodeAt(++e.position);
        while (!K(v) && v !== 0);
    }
    for (; v !== 0; ) {
      for (he(e), e.lineIndent = 0, v = e.input.charCodeAt(e.position); (!w || e.lineIndent < r) && v === 32; )
        e.lineIndent++, v = e.input.charCodeAt(++e.position);
      if (!w && e.lineIndent > r && (r = e.lineIndent), K(v)) {
        d++;
        continue;
      }
      if (!w && r === 0 && C(e, "missing indentation for block scalar"), e.lineIndent < r) {
        b === _ ? e.result += i.repeat(`
`, f ? 1 + d : d) : b === u && f && (e.result += `
`);
        break;
      }
      g ? z(v) ? ($ = !0, e.result += i.repeat(`
`, f ? 1 + d : d)) : $ ? ($ = !1, e.result += i.repeat(`
`, d + 1)) : d === 0 ? f && (e.result += " ") : e.result += i.repeat(`
`, d) : e.result += i.repeat(`
`, f ? 1 + d : d), f = !0, w = !0, d = 0;
      const x = e.position;
      for (; !K(v) && v !== 0; )
        v = e.input.charCodeAt(++e.position);
      V(e, x, e.position, !1);
    }
    return !0;
  }
  function ee(e, c) {
    const g = e.tag, b = e.anchor, f = [];
    let w = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && Q(e, e.anchor, f);
    let r = e.input.charCodeAt(e.position);
    for (; r !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, C(e, "tab characters must not be used in indentation")), r === 45); ) {
      const d = e.input.charCodeAt(e.position + 1);
      if (!H(d))
        break;
      if (w = !0, e.position++, U(e, !0, -1) && e.lineIndent <= c) {
        f.push(null), r = e.input.charCodeAt(e.position);
        continue;
      }
      const $ = e.line;
      if (te(e, c, p, !1, !0), f.push(e.result), U(e, !0, -1), r = e.input.charCodeAt(e.position), (e.line === $ || e.lineIndent > c) && r !== 0)
        C(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < c)
        break;
    }
    return w ? (e.tag = g, e.anchor = b, e.kind = "sequence", e.result = f, !0) : !1;
  }
  function Ke(e, c, g) {
    let b, f, w, r;
    const d = e.tag, $ = e.anchor, y = {}, v = /* @__PURE__ */ Object.create(null);
    let x = null, A = null, S = null, k = !1, E = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && Q(e, e.anchor, y);
    let M = e.input.charCodeAt(e.position);
    for (; M !== 0; ) {
      !k && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, C(e, "tab characters must not be used in indentation"));
      const L = e.input.charCodeAt(e.position + 1), F = e.line;
      if ((M === 63 || M === 58) && H(L))
        M === 63 ? (k && (Z(e, y, v, x, A, null, f, w, r), x = A = S = null), E = !0, k = !0, b = !0) : k ? (k = !1, b = !0) : C(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, M = L;
      else {
        if (f = e.line, w = e.lineStart, r = e.position, !te(e, g, a, !1, !0))
          break;
        if (e.line === F) {
          for (M = e.input.charCodeAt(e.position); z(M); )
            M = e.input.charCodeAt(++e.position);
          if (M === 58)
            M = e.input.charCodeAt(++e.position), H(M) || C(e, "a whitespace character is expected after the key-value separator within a block mapping"), k && (Z(e, y, v, x, A, null, f, w, r), x = A = S = null), E = !0, k = !1, b = !1, x = e.tag, A = e.result;
          else if (E)
            C(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = d, e.anchor = $, !0;
        } else if (E)
          C(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = d, e.anchor = $, !0;
      }
      if ((e.line === F || e.lineIndent > c) && (k && (f = e.line, w = e.lineStart, r = e.position), te(e, c, m, !0, b) && (k ? A = e.result : S = e.result), k || (Z(e, y, v, x, A, S, f, w, r), x = A = S = null), U(e, !0, -1), M = e.input.charCodeAt(e.position)), (e.line === F || e.lineIndent > c) && M !== 0)
        C(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < c)
        break;
    }
    return k && Z(e, y, v, x, A, null, f, w, r), E && (e.tag = d, e.anchor = $, e.kind = "mapping", e.result = y), E;
  }
  function ut(e) {
    let c = !1, g = !1, b, f, w = e.input.charCodeAt(e.position);
    if (w !== 33) return !1;
    e.tag !== null && C(e, "duplication of a tag property"), w = e.input.charCodeAt(++e.position), w === 60 ? (c = !0, w = e.input.charCodeAt(++e.position)) : w === 33 ? (g = !0, b = "!!", w = e.input.charCodeAt(++e.position)) : b = "!";
    let r = e.position;
    if (c) {
      do
        w = e.input.charCodeAt(++e.position);
      while (w !== 0 && w !== 62);
      e.position < e.length ? (f = e.input.slice(r, e.position), w = e.input.charCodeAt(++e.position)) : C(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; w !== 0 && !H(w); )
        w === 33 && (g ? C(e, "tag suffix cannot contain exclamation marks") : (b = e.input.slice(r - 1, e.position + 1), q.test(b) || C(e, "named tag handle cannot contain such characters"), g = !0, r = e.position + 1)), w = e.input.charCodeAt(++e.position);
      f = e.input.slice(r, e.position), W.test(f) && C(e, "tag suffix cannot contain flow indicator characters");
    }
    f && !G.test(f) && C(e, "tag name cannot contain such characters: " + f);
    try {
      f = decodeURIComponent(f);
    } catch {
      C(e, "tag name is malformed: " + f);
    }
    return c ? e.tag = f : l.call(e.tagMap, b) ? e.tag = e.tagMap[b] + f : b === "!" ? e.tag = "!" + f : b === "!!" ? e.tag = "tag:yaml.org,2002:" + f : C(e, 'undeclared tag handle "' + b + '"'), !0;
  }
  function ze(e) {
    let c = e.input.charCodeAt(e.position);
    if (c !== 38) return !1;
    e.anchor !== null && C(e, "duplication of an anchor property"), c = e.input.charCodeAt(++e.position);
    const g = e.position;
    for (; c !== 0 && !H(c) && !ie(c); )
      c = e.input.charCodeAt(++e.position);
    return e.position === g && C(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(g, e.position), !0;
  }
  function Je(e) {
    let c = e.input.charCodeAt(e.position);
    if (c !== 42) return !1;
    c = e.input.charCodeAt(++e.position);
    const g = e.position;
    for (; c !== 0 && !H(c) && !ie(c); )
      c = e.input.charCodeAt(++e.position);
    e.position === g && C(e, "name of an alias node must contain at least one character");
    const b = e.input.slice(g, e.position);
    return l.call(e.anchorMap, b) || C(e, 'unidentified alias "' + b + '"'), e.result = e.anchorMap[b], U(e, !0, -1), !0;
  }
  function dt(e, c, g, b) {
    const f = xe(e);
    return at(e), pe(e, c), e.tag = null, e.anchor = null, e.kind = null, e.result = null, Ke(e, g, b) && e.kind === "mapping" ? (se(e), !0) : (ct(e), pe(e, f), !1);
  }
  function te(e, c, g, b, f) {
    let w, r, d = 1, $ = !1, y = !1, v = null, x, A, S;
    e.depth >= e.maxDepth && C(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const k = w = r = m === g || p === g;
    if (b && U(e, !0, -1) && ($ = !0, e.lineIndent > c ? d = 1 : e.lineIndent === c ? d = 0 : e.lineIndent < c && (d = -1)), d === 1)
      for (; ; ) {
        const E = e.input.charCodeAt(e.position), M = xe(e);
        if ($ && (E === 33 && e.tag !== null || E === 38 && e.anchor !== null) || !ut(e) && !ze(e))
          break;
        v === null && (v = M), U(e, !0, -1) ? ($ = !0, r = k, e.lineIndent > c ? d = 1 : e.lineIndent === c ? d = 0 : e.lineIndent < c && (d = -1)) : r = !1;
      }
    if (r && (r = $ || f), d === 1 || m === g)
      if (s === g || a === g ? A = c : A = c + 1, S = e.position - e.lineStart, d === 1)
        if (r && (ee(e, S) || Ke(e, S, A)) || Be(e, A))
          y = !0;
        else {
          const E = e.input.charCodeAt(e.position);
          v !== null && k && !r && E !== 124 && E !== 62 && dt(
            e,
            v,
            v.position - v.lineStart,
            A
          ) || w && je(e, A) || He(e, A) || we(e, A) ? y = !0 : Je(e) ? (y = !0, (e.tag !== null || e.anchor !== null) && C(e, "alias node should not have any properties")) : Ye(e, A, s === g) && (y = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && Q(e, e.anchor, e.result);
        }
      else d === 0 && (y = r && ee(e, S));
    if (e.tag === null)
      e.anchor !== null && Q(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && C(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let E = 0, M = e.implicitTypes.length; E < M; E += 1)
        if (x = e.implicitTypes[E], x.resolve(e.result)) {
          e.result = x.construct(e.result), e.tag = x.tag, e.anchor !== null && Q(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (l.call(e.typeMap[e.kind || "fallback"], e.tag))
        x = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        x = null;
        const E = e.typeMap.multi[e.kind || "fallback"];
        for (let M = 0, L = E.length; M < L; M += 1)
          if (e.tag.slice(0, E[M].tag.length) === E[M].tag) {
            x = E[M];
            break;
          }
      }
      x || C(e, "unknown tag !<" + e.tag + ">"), e.result !== null && x.kind !== e.kind && C(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + x.kind + '", not "' + e.kind + '"'), x.resolve(e.result, e.tag) ? (e.result = x.construct(e.result, e.tag), e.anchor !== null && Q(e, e.anchor, e.result)) : C(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || y;
  }
  function pt(e) {
    const c = e.position;
    let g = !1, b;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (b = e.input.charCodeAt(e.position)) !== 0 && (U(e, !0, -1), b = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || b !== 37)); ) {
      g = !0, b = e.input.charCodeAt(++e.position);
      let f = e.position;
      for (; b !== 0 && !H(b); )
        b = e.input.charCodeAt(++e.position);
      const w = e.input.slice(f, e.position), r = [];
      for (w.length < 1 && C(e, "directive name must not be less than one character in length"); b !== 0; ) {
        for (; z(b); )
          b = e.input.charCodeAt(++e.position);
        if (b === 35) {
          do
            b = e.input.charCodeAt(++e.position);
          while (b !== 0 && !K(b));
          break;
        }
        if (K(b)) break;
        for (f = e.position; b !== 0 && !H(b); )
          b = e.input.charCodeAt(++e.position);
        r.push(e.input.slice(f, e.position));
      }
      b !== 0 && he(e), l.call(Ue, w) ? Ue[w](e, w, r) : de(e, 'unknown document directive "' + w + '"');
    }
    if (U(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, U(e, !0, -1)) : g && C(e, "directives end mark is expected"), te(e, e.lineIndent - 1, m, !1, !0), U(e, !0, -1), e.checkLineBreaks && N.test(e.input.slice(c, e.position)) && de(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && fe(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, U(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && C(e, "end of the stream or a document separator is expected");
  }
  function We(e, c) {
    e = String(e), c = c || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const g = new Y(e, c), b = e.indexOf("\0");
    for (b !== -1 && (g.position = b, C(g, "null byte is not allowed in input")), g.input += "\0"; g.input.charCodeAt(g.position) === 32; )
      g.lineIndent += 1, g.position += 1;
    for (; g.position < g.length - 1; )
      pt(g);
    return g.documents;
  }
  function Ve(e, c, g) {
    c !== null && typeof c == "object" && typeof g > "u" && (g = c, c = null);
    const b = We(e, g);
    if (typeof c != "function")
      return b;
    for (let f = 0, w = b.length; f < w; f += 1)
      c(b[f]);
  }
  function ht(e, c) {
    const g = We(e, c);
    if (g.length !== 0) {
      if (g.length === 1)
        return g[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return Ge.loadAll = Ve, Ge.load = ht, Ge;
}
var Dt = {}, Ei;
function Rn() {
  if (Ei) return Dt;
  Ei = 1;
  const i = Ie(), t = De(), n = zt(), o = Object.prototype.toString, l = Object.prototype.hasOwnProperty, s = 65279, a = 9, p = 10, m = 13, u = 32, h = 33, _ = 34, O = 35, N = 37, W = 38, q = 39, G = 42, le = 44, K = 45, z = 58, H = 61, ie = 62, ot = 63, lt = 64, Fe = 91, _e = 93, st = 96, Ae = 123, Pe = 124, $e = 125, Y = {};
  Y[0] = "\\0", Y[7] = "\\a", Y[8] = "\\b", Y[9] = "\\t", Y[10] = "\\n", Y[11] = "\\v", Y[12] = "\\f", Y[13] = "\\r", Y[27] = "\\e", Y[34] = '\\"', Y[92] = "\\\\", Y[133] = "\\N", Y[160] = "\\_", Y[8232] = "\\L", Y[8233] = "\\P";
  const qe = [
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
  ], C = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function de(r, d) {
    if (d === null) return {};
    const $ = {}, y = Object.keys(d);
    for (let v = 0, x = y.length; v < x; v += 1) {
      let A = y[v], S = String(d[A]);
      A.slice(0, 2) === "!!" && (A = "tag:yaml.org,2002:" + A.slice(2));
      const k = r.compiledTypeMap.fallback[A];
      k && l.call(k.styleAliases, S) && (S = k.styleAliases[S]), $[A] = S;
    }
    return $;
  }
  function Q(r) {
    let d, $;
    const y = r.toString(16).toUpperCase();
    if (r <= 255)
      d = "x", $ = 2;
    else if (r <= 65535)
      d = "u", $ = 4;
    else if (r <= 4294967295)
      d = "U", $ = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + d + i.repeat("0", $ - y.length) + y;
  }
  const at = 1, se = 2;
  function ct(r) {
    this.schema = r.schema || n, this.indent = Math.max(1, r.indent || 2), this.noArrayIndent = r.noArrayIndent || !1, this.skipInvalid = r.skipInvalid || !1, this.flowLevel = i.isNothing(r.flowLevel) ? -1 : r.flowLevel, this.styleMap = de(this.schema, r.styles || null), this.sortKeys = r.sortKeys || !1, this.lineWidth = r.lineWidth || 80, this.noRefs = r.noRefs || !1, this.noCompatMode = r.noCompatMode || !1, this.condenseFlow = r.condenseFlow || !1, this.quotingType = r.quotingType === '"' ? se : at, this.forceQuotes = r.forceQuotes || !1, this.replacer = typeof r.replacer == "function" ? r.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function xe(r, d) {
    const $ = i.repeat(" ", d);
    let y = 0, v = "";
    const x = r.length;
    for (; y < x; ) {
      let A;
      const S = r.indexOf(`
`, y);
      S === -1 ? (A = r.slice(y), y = x) : (A = r.slice(y, S + 1), y = S + 1), A.length && A !== `
` && (v += $), v += A;
    }
    return v;
  }
  function pe(r, d) {
    return `
` + i.repeat(" ", r.indent * d);
  }
  function Ue(r, d) {
    for (let $ = 0, y = r.implicitTypes.length; $ < y; $ += 1)
      if (r.implicitTypes[$].resolve(d))
        return !0;
    return !1;
  }
  function V(r) {
    return r === u || r === a;
  }
  function ne(r) {
    return r >= 32 && r <= 126 || r >= 161 && r <= 55295 && r !== 8232 && r !== 8233 || r >= 57344 && r <= 65533 && r !== s || r >= 65536 && r <= 1114111;
  }
  function Z(r) {
    return ne(r) && r !== s && // - b-char
    r !== m && r !== p;
  }
  function he(r, d, $) {
    const y = Z(r), v = y && !V(r);
    return (
      // ns-plain-safe
      ($ ? y : y && // - c-flow-indicator
      r !== le && r !== Fe && r !== _e && r !== Ae && r !== $e) && // ns-plain-char
      r !== O && // false on '#'
      !(d === z && !v) || // false on ': '
      Z(d) && !V(d) && r === O || // change to true on '[^ ]#'
      d === z && v
    );
  }
  function U(r) {
    return ne(r) && r !== s && !V(r) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    r !== K && r !== ot && r !== z && r !== le && r !== Fe && r !== _e && r !== Ae && r !== $e && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    r !== O && r !== W && r !== G && r !== h && r !== Pe && r !== H && r !== ie && r !== q && r !== _ && // | “%” | “@” | “`”)
    r !== N && r !== lt && r !== st;
  }
  function fe(r) {
    return !V(r) && r !== z;
  }
  function X(r, d) {
    const $ = r.charCodeAt(d);
    let y;
    return $ >= 55296 && $ <= 56319 && d + 1 < r.length && (y = r.charCodeAt(d + 1), y >= 56320 && y <= 57343) ? ($ - 55296) * 1024 + y - 56320 + 65536 : $;
  }
  function Ye(r) {
    return /^\n* /.test(r);
  }
  const He = 1, we = 2, Be = 3, je = 4, ee = 5;
  function Ke(r, d, $, y, v, x, A, S) {
    let k, E = 0, M = null, L = !1, F = !1;
    const Jt = y !== -1;
    let ke = -1, Se = U(X(r, 0)) && fe(X(r, r.length - 1));
    if (d || A)
      for (k = 0; k < r.length; E >= 65536 ? k += 2 : k++) {
        if (E = X(r, k), !ne(E))
          return ee;
        Se = Se && he(E, M, S), M = E;
      }
    else {
      for (k = 0; k < r.length; E >= 65536 ? k += 2 : k++) {
        if (E = X(r, k), E === p)
          L = !0, Jt && (F = F || // Foldable line = too long, and not more-indented.
          k - ke - 1 > y && r[ke + 1] !== " ", ke = k);
        else if (!ne(E))
          return ee;
        Se = Se && he(E, M, S), M = E;
      }
      F = F || Jt && k - ke - 1 > y && r[ke + 1] !== " ";
    }
    return !L && !F ? Se && !A && !v(r) ? He : x === se ? ee : we : $ > 9 && Ye(r) ? ee : A ? x === se ? ee : we : F ? je : Be;
  }
  function ut(r, d, $, y, v) {
    r.dump = (function() {
      if (d.length === 0)
        return r.quotingType === se ? '""' : "''";
      if (!r.noCompatMode && (qe.indexOf(d) !== -1 || C.test(d)))
        return r.quotingType === se ? '"' + d + '"' : "'" + d + "'";
      const x = r.indent * Math.max(1, $), A = r.lineWidth === -1 ? -1 : Math.max(Math.min(r.lineWidth, 40), r.lineWidth - x), S = y || // No block styles in flow mode.
      r.flowLevel > -1 && $ >= r.flowLevel;
      function k(E) {
        return Ue(r, E);
      }
      switch (Ke(
        d,
        S,
        r.indent,
        A,
        k,
        r.quotingType,
        r.forceQuotes && !y,
        v
      )) {
        case He:
          return d;
        case we:
          return "'" + d.replace(/'/g, "''") + "'";
        case Be:
          return "|" + ze(d, r.indent) + Je(xe(d, x));
        case je:
          return ">" + ze(d, r.indent) + Je(xe(dt(d, A), x));
        case ee:
          return '"' + pt(d) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  function ze(r, d) {
    const $ = Ye(r) ? String(d) : "", y = r[r.length - 1] === `
`, x = y && (r[r.length - 2] === `
` || r === `
`) ? "+" : y ? "" : "-";
    return $ + x + `
`;
  }
  function Je(r) {
    return r[r.length - 1] === `
` ? r.slice(0, -1) : r;
  }
  function dt(r, d) {
    const $ = /(\n+)([^\n]*)/g;
    let y = (function() {
      let S = r.indexOf(`
`);
      return S = S !== -1 ? S : r.length, $.lastIndex = S, te(r.slice(0, S), d);
    })(), v = r[0] === `
` || r[0] === " ", x, A;
    for (; A = $.exec(r); ) {
      const S = A[1], k = A[2];
      x = k[0] === " ", y += S + (!v && !x && k !== "" ? `
` : "") + te(k, d), v = x;
    }
    return y;
  }
  function te(r, d) {
    if (r === "" || r[0] === " ") return r;
    const $ = / [^ ]/g;
    let y, v = 0, x, A = 0, S = 0, k = "";
    for (; y = $.exec(r); )
      S = y.index, S - v > d && (x = A > v ? A : S, k += `
` + r.slice(v, x), v = x + 1), A = S;
    return k += `
`, r.length - v > d && A > v ? k += r.slice(v, A) + `
` + r.slice(A + 1) : k += r.slice(v), k.slice(1);
  }
  function pt(r) {
    let d = "", $ = 0;
    for (let y = 0; y < r.length; $ >= 65536 ? y += 2 : y++) {
      $ = X(r, y);
      const v = Y[$];
      !v && ne($) ? (d += r[y], $ >= 65536 && (d += r[y + 1])) : d += v || Q($);
    }
    return d;
  }
  function We(r, d, $) {
    let y = "";
    const v = r.tag;
    for (let x = 0, A = $.length; x < A; x += 1) {
      let S = $[x];
      r.replacer && (S = r.replacer.call($, String(x), S)), (g(r, d, S, !1, !1) || typeof S > "u" && g(r, d, null, !1, !1)) && (y !== "" && (y += "," + (r.condenseFlow ? "" : " ")), y += r.dump);
    }
    r.tag = v, r.dump = "[" + y + "]";
  }
  function Ve(r, d, $, y) {
    let v = "";
    const x = r.tag;
    for (let A = 0, S = $.length; A < S; A += 1) {
      let k = $[A];
      r.replacer && (k = r.replacer.call($, String(A), k)), (g(r, d + 1, k, !0, !0, !1, !0) || typeof k > "u" && g(r, d + 1, null, !0, !0, !1, !0)) && ((!y || v !== "") && (v += pe(r, d)), r.dump && p === r.dump.charCodeAt(0) ? v += "-" : v += "- ", v += r.dump);
    }
    r.tag = x, r.dump = v || "[]";
  }
  function ht(r, d, $) {
    let y = "";
    const v = r.tag, x = Object.keys($);
    for (let A = 0, S = x.length; A < S; A += 1) {
      let k = "";
      y !== "" && (k += ", "), r.condenseFlow && (k += '"');
      const E = x[A];
      let M = $[E];
      r.replacer && (M = r.replacer.call($, E, M)), g(r, d, E, !1, !1) && (r.dump.length > 1024 && (k += "? "), k += r.dump + (r.condenseFlow ? '"' : "") + ":" + (r.condenseFlow ? "" : " "), g(r, d, M, !1, !1) && (k += r.dump, y += k));
    }
    r.tag = v, r.dump = "{" + y + "}";
  }
  function e(r, d, $, y) {
    let v = "";
    const x = r.tag, A = Object.keys($);
    if (r.sortKeys === !0)
      A.sort();
    else if (typeof r.sortKeys == "function")
      A.sort(r.sortKeys);
    else if (r.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (let S = 0, k = A.length; S < k; S += 1) {
      let E = "";
      (!y || v !== "") && (E += pe(r, d));
      const M = A[S];
      let L = $[M];
      if (r.replacer && (L = r.replacer.call($, M, L)), !g(r, d + 1, M, !0, !0, !0))
        continue;
      const F = r.tag !== null && r.tag !== "?" || r.dump && r.dump.length > 1024;
      F && (r.dump && p === r.dump.charCodeAt(0) ? E += "?" : E += "? "), E += r.dump, F && (E += pe(r, d)), g(r, d + 1, L, !0, F) && (r.dump && p === r.dump.charCodeAt(0) ? E += ":" : E += ": ", E += r.dump, v += E);
    }
    r.tag = x, r.dump = v || "{}";
  }
  function c(r, d, $) {
    const y = $ ? r.explicitTypes : r.implicitTypes;
    for (let v = 0, x = y.length; v < x; v += 1) {
      const A = y[v];
      if ((A.instanceOf || A.predicate) && (!A.instanceOf || typeof d == "object" && d instanceof A.instanceOf) && (!A.predicate || A.predicate(d))) {
        if ($ ? A.multi && A.representName ? r.tag = A.representName(d) : r.tag = A.tag : r.tag = "?", A.represent) {
          const S = r.styleMap[A.tag] || A.defaultStyle;
          let k;
          if (o.call(A.represent) === "[object Function]")
            k = A.represent(d, S);
          else if (l.call(A.represent, S))
            k = A.represent[S](d, S);
          else
            throw new t("!<" + A.tag + '> tag resolver accepts not "' + S + '" style');
          r.dump = k;
        }
        return !0;
      }
    }
    return !1;
  }
  function g(r, d, $, y, v, x, A) {
    r.tag = null, r.dump = $, c(r, $, !1) || c(r, $, !0);
    const S = o.call(r.dump), k = y;
    y && (y = r.flowLevel < 0 || r.flowLevel > d);
    const E = S === "[object Object]" || S === "[object Array]";
    let M, L;
    if (E && (M = r.duplicates.indexOf($), L = M !== -1), (r.tag !== null && r.tag !== "?" || L || r.indent !== 2 && d > 0) && (v = !1), L && r.usedDuplicates[M])
      r.dump = "*ref_" + M;
    else {
      if (E && L && !r.usedDuplicates[M] && (r.usedDuplicates[M] = !0), S === "[object Object]")
        y && Object.keys(r.dump).length !== 0 ? (e(r, d, r.dump, v), L && (r.dump = "&ref_" + M + r.dump)) : (ht(r, d, r.dump), L && (r.dump = "&ref_" + M + " " + r.dump));
      else if (S === "[object Array]")
        y && r.dump.length !== 0 ? (r.noArrayIndent && !A && d > 0 ? Ve(r, d - 1, r.dump, v) : Ve(r, d, r.dump, v), L && (r.dump = "&ref_" + M + r.dump)) : (We(r, d, r.dump), L && (r.dump = "&ref_" + M + " " + r.dump));
      else if (S === "[object String]")
        r.tag !== "?" && ut(r, r.dump, d, x, k);
      else {
        if (S === "[object Undefined]")
          return !1;
        if (r.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + S);
      }
      if (r.tag !== null && r.tag !== "?") {
        let F = encodeURI(
          r.tag[0] === "!" ? r.tag.slice(1) : r.tag
        ).replace(/!/g, "%21");
        r.tag[0] === "!" ? F = "!" + F : F.slice(0, 18) === "tag:yaml.org,2002:" ? F = "!!" + F.slice(18) : F = "!<" + F + ">", r.dump = F + " " + r.dump;
      }
    }
    return !0;
  }
  function b(r, d) {
    const $ = [], y = [];
    f(r, $, y);
    const v = y.length;
    for (let x = 0; x < v; x += 1)
      d.duplicates.push($[y[x]]);
    d.usedDuplicates = new Array(v);
  }
  function f(r, d, $) {
    if (r !== null && typeof r == "object") {
      const y = d.indexOf(r);
      if (y !== -1)
        $.indexOf(y) === -1 && $.push(y);
      else if (d.push(r), Array.isArray(r))
        for (let v = 0, x = r.length; v < x; v += 1)
          f(r[v], d, $);
      else {
        const v = Object.keys(r);
        for (let x = 0, A = v.length; x < A; x += 1)
          f(r[v[x]], d, $);
      }
    }
  }
  function w(r, d) {
    d = d || {};
    const $ = new ct(d);
    $.noRefs || b(r, $);
    let y = r;
    return $.replacer && (y = $.replacer.call({ "": y }, "", y)), g($, 0, y, !0, !0) ? $.dump + `
` : "";
  }
  return Dt.dump = w, Dt;
}
var Ti;
function Nn() {
  if (Ti) return B;
  Ti = 1;
  const i = Mn(), t = Rn();
  function n(o, l) {
    return function() {
      throw new Error("Function yaml." + o + " is removed in js-yaml 4. Use yaml." + l + " instead, which is now safe by default.");
    };
  }
  return B.Type = j(), B.Schema = qi(), B.FAILSAFE_SCHEMA = Bi(), B.JSON_SCHEMA = Wi(), B.CORE_SCHEMA = Vi(), B.DEFAULT_SCHEMA = zt(), B.load = i.load, B.loadAll = i.loadAll, B.dump = t.dump, B.YAMLException = De(), B.types = {
    binary: Zi(),
    float: Ji(),
    map: Hi(),
    null: ji(),
    pairs: en(),
    set: tn(),
    timestamp: Gi(),
    bool: Ki(),
    int: zi(),
    merge: Qi(),
    omap: Xi(),
    seq: Yi(),
    str: Ui()
  }, B.safeLoad = n("safeLoad", "load"), B.safeLoadAll = n("safeLoadAll", "loadAll"), B.safeDump = n("safeDump", "dump"), B;
}
var Ln = Nn();
const In = /* @__PURE__ */ Tn(Ln), {
  Type: nr,
  Schema: rr,
  FAILSAFE_SCHEMA: or,
  JSON_SCHEMA: lr,
  CORE_SCHEMA: sr,
  DEFAULT_SCHEMA: ar,
  load: Qe,
  loadAll: cr,
  dump: me,
  YAMLException: ur,
  types: dr,
  safeLoad: pr,
  safeLoadAll: hr,
  safeDump: fr
} = In, rt = (i, t, n = {}) => i.callWS({ type: `deferred_actions/${t}`, data: n }), Dn = (i) => rt(i, "list", { limit: 1e3 }), Fn = (i, t) => rt(i, "create", t), Pn = (i, t) => i.callService("deferred_actions", "run_for", t, void 0, !0, !0), qn = (i, t) => rt(i, "update", t), Un = (i, t, n, o = {}) => rt(i, t, { job_id: n, ...o }), Yn = (i, t) => i.connection.subscribeMessage(t, { type: "deferred_actions/subscribe" }), qt = (i) => {
  if (i !== void 0) {
    if (typeof i == "string") return [i];
    if (Array.isArray(i) && i.every((t) => typeof t == "string")) return [...i];
  }
}, ye = (i, t) => Object.keys(i).every((n) => t.includes(n)), Oi = (i) => {
  const t = [];
  for (const n of i) {
    if (!n || typeof n != "object" || Array.isArray(n) || !ye(n, ["action", "service", "target", "data"])) return;
    const o = typeof n.action == "string" ? n.action : typeof n.service == "string" ? n.service : void 0;
    if (!o || n.action !== void 0 && n.service !== void 0) return;
    const l = n.target ?? {};
    if (!l || typeof l != "object" || Array.isArray(l)) return;
    const s = l;
    if (!ye(s, ["entity_id", "device_id", "area_id", "floor_id", "label_id"])) return;
    const a = {};
    for (const h of ["entity_id", "device_id", "area_id", "floor_id", "label_id"]) {
      const _ = qt(s[h]);
      if (s[h] !== void 0 && !_) return;
      _?.length && (a[h] = _);
    }
    const p = n.data ?? {};
    if (!p || typeof p != "object" || Array.isArray(p)) return;
    const m = Object.entries(p);
    if (m.some(([, h]) => h !== null && !["string", "number", "boolean"].includes(typeof h))) return;
    const u = ["entity_id", "device_id", "area_id", "floor_id", "label_id"].filter((h) => typeof s[h] == "string");
    t.push({ action: o, syntax: n.service !== void 0 ? "service" : "action", target: a, scalarTargets: u, data: m.map(([h, _]) => jn(h, _)) });
  }
  return t;
}, Ze = (i) => i.map((t) => {
  const n = Object.fromEntries(Object.entries(t.target).filter(([, l]) => l?.length).map(([l, s]) => [l, t.scalarTargets?.includes(l) && Array.isArray(s) && s.length === 1 ? s[0] : s])), o = Object.fromEntries(t.data.filter((l) => l.key.trim()).map((l) => [l.key.trim(), Kn(l)]));
  return {
    [t.syntax ?? "action"]: t.action,
    ...Object.keys(n).length ? { target: n } : {},
    ...Object.keys(o).length ? { data: o } : {}
  };
}), Hn = (i) => {
  if (i.condition === "state" && ye(i, ["condition", "entity_id", "state"]) && typeof i.entity_id == "string" && typeof i.state == "string")
    return { type: "state", entity_id: i.entity_id, state: i.state };
  if (i.condition === "numeric_state" && ye(i, ["condition", "entity_id", "above", "below"]) && typeof i.entity_id == "string")
    return i.above !== void 0 && typeof i.above != "number" || i.below !== void 0 && typeof i.below != "number" ? void 0 : { type: "numeric_state", entity_id: i.entity_id, above: i.above === void 0 ? "" : String(i.above), below: i.below === void 0 ? "" : String(i.below) };
  if (i.condition === "time" && ye(i, ["condition", "after", "before", "weekday"])) {
    if (i.after !== void 0 && typeof i.after != "string" || i.before !== void 0 && typeof i.before != "string") return;
    const t = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
    if ([i.after, i.before].some((o) => typeof o == "string" && !t.test(o))) return;
    const n = qt(i.weekday) ?? [];
    return i.weekday !== void 0 && !qt(i.weekday) ? void 0 : { type: "time", after: String(i.after ?? ""), before: String(i.before ?? ""), weekdays: n, weekdayScalar: typeof i.weekday == "string" };
  }
}, Mi = (i) => {
  let t = "and", n = i, o = !1;
  if (i.length === 1 && ["and", "or"].includes(String(i[0]?.condition))) {
    const s = i[0];
    if (!ye(s, ["condition", "conditions"]) || !Array.isArray(s.conditions) || s.conditions.length === 0) return;
    t = s.condition, o = !0, n = s.conditions;
  }
  const l = n.map(Hn);
  return l.every(Boolean) ? { operator: t, items: l, grouped: o } : void 0;
}, Ri = (i) => {
  const t = i.items.map((n) => n.type === "state" ? { condition: "state", entity_id: n.entity_id, state: n.state } : n.type === "numeric_state" ? {
    condition: "numeric_state",
    entity_id: n.entity_id,
    ...n.above.trim() ? { above: Number(n.above) } : {},
    ...n.below.trim() ? { below: Number(n.below) } : {}
  } : {
    condition: "time",
    ...n.after ? { after: n.after } : {},
    ...n.before ? { before: n.before } : {},
    ...n.weekdays.length ? { weekday: n.weekdayScalar && n.weekdays.length === 1 ? n.weekdays[0] : n.weekdays } : {}
  });
  return (i.operator === "or" || i.grouped) && t.length ? [{ condition: i.operator, conditions: t }] : t;
};
class J extends Error {
}
const Bn = (i) => i === null ? "null" : typeof i == "number" ? "number" : typeof i == "boolean" ? "boolean" : "text", jn = (i, t) => ({
  key: i,
  type: Bn(t),
  value: t,
  ...typeof t == "string" || typeof t == "number" ? { raw: String(t) } : {}
}), Kn = (i) => {
  if (i.type === "null") return null;
  if (i.type === "boolean") return i.value === !0;
  if (i.type === "text") return i.raw ?? String(i.value ?? "");
  const t = Number(i.raw ?? i.value);
  if (!Number.isFinite(t)) throw new J(`Enter a finite number for “${i.key || "this data field"}”.`);
  return t;
}, zn = (i, t) => {
  const n = i.raw ?? String(i.value ?? "");
  return t === "text" ? { ...i, type: t, value: n, raw: n } : t === "number" ? { ...i, type: t, raw: n } : t === "boolean" ? { ...i, type: t, value: i.value === !0 || n === "true" } : { ...i, type: t, value: null, raw: void 0 };
}, Jn = (i) => {
  const t = i instanceof Error ? i.message : String(i), n = t.toLowerCase();
  return n.includes("expected_revision") || n.includes("revision") || n.includes("conflict") ? { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details: t } : n.includes("permission") || n.includes("unauthorized") || n.includes("admin") ? { message: "You need administrator access to manage deferred actions.", details: t } : n.includes("valid_until") ? { message: "‘Don’t run after’ must be later than the scheduled time.", details: t } : n.includes("condition") ? { message: "One or more conditions are incomplete or invalid.", details: t } : n.includes("sequence") || n.includes("action") ? { message: "The action sequence is incomplete or invalid.", details: t } : { message: "Home Assistant couldn’t save this deferred action.", details: t };
}, Wn = (i) => {
  if (i instanceof J) return { message: i.message };
  const t = Jn(i);
  return { message: t.message, ...t.details === t.message ? {} : { details: t.details } };
};
function Ft(i, t = Date.now()) {
  const n = Math.round((new Date(i).getTime() - t) / 1e3), o = Math.abs(n), [l, s] = o >= 86400 ? [Math.round(o / 86400), "day"] : o >= 3600 ? [Math.round(o / 3600), "hour"] : o >= 60 ? [Math.round(o / 60), "minute"] : [o, "second"];
  return `${n < 0 ? "overdue by" : "in"} ${l} ${s}${l === 1 ? "" : "s"}`;
}
const Ee = (i) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short"
}).format(new Date(i)), Vn = [5, 15, 30, 60], Pt = (i) => i?.explicit_target_entities ?? [], Gn = (i) => ["completed", "cancelled", "missed", "skipped", "expired"].includes(i), Qn = (i) => {
  const t = i.overdue_policy ? "job override" : "inherited";
  return i.effective_overdue_policy === "execute_within_grace" ? `Run only if less than ${i.effective_overdue_grace_minutes} minutes late (${t})` : `${i.effective_overdue_policy === "execute" ? "Run when Home Assistant comes back" : "Don’t run"} (${t})`;
};
var Zn = Object.defineProperty, Xn = Object.getOwnPropertyDescriptor, D = (i, t, n, o) => {
  for (var l = o > 1 ? void 0 : o ? Xn(t, n) : t, s = i.length - 1, a; s >= 0; s--)
    (a = i[s]) && (l = (o ? a(t, n, l) : a(l)) || l);
  return o && l && Zn(t, n, l), l;
};
const er = {
  "light.turn_on": "light.turn_off",
  "switch.turn_on": "switch.turn_off",
  "fan.turn_on": "fan.turn_off",
  "input_boolean.turn_on": "input_boolean.turn_off",
  "media_player.media_play": "media_player.media_pause"
};
let I = class extends Oe {
  constructor() {
    super(...arguments), this.jobs = [], this.summary = { pending: 0, paused: 0, failed: 0 }, this.tab = "Pending", this.creationKind = "later", this.scheduleMode = "delay", this.visualActions = [], this.actionYaml = "", this.conditionMode = "visual", this.visualConditions = { operator: "and", items: [] }, this.conditionsYaml = "", this.runForTarget = {}, this.runForStart = "light.turn_on", this.runForEnd = "light.turn_off", this.jobKey = "", this.previewDelay = 20, this.previewUnit = "minutes", this.busy = !1;
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
    await this.refresh(), this.unsubscribe = await Yn(this.hass, (i) => this.handlePush(i));
  }
  async refresh() {
    try {
      const i = await Dn(this.hass);
      this.jobs = i.jobs, this.recalculate();
    } catch (i) {
      this.setError(i);
    }
  }
  handlePush(i) {
    if (i.event === "queue_summary" && i.summary && (this.summary = i.summary), i.event === "job_deleted" && i.job_id) this.jobs = this.jobs.filter((t) => t.id !== i.job_id);
    else if (i.job) {
      const t = this.jobs.findIndex((n) => n.id === i.job?.id);
      this.jobs = t < 0 ? [...this.jobs, i.job] : this.jobs.map((n) => n.id === i.job?.id ? i.job : n), this.selected?.id === i.job.id && (this.selected = i.job);
    }
    this.recalculate();
  }
  recalculate() {
    const i = this.jobs.filter((t) => t.status === "pending").sort((t, n) => t.execute_at.localeCompare(n.execute_at));
    this.summary = {
      pending: i.length,
      paused: this.jobs.filter((t) => t.status === "paused").length,
      failed: this.jobs.filter((t) => t.status === "failed").length,
      next_job_name: i[0]?.name,
      next_execution_local: i[0]?.execute_at_local
    };
  }
  visibleJobs() {
    return this.jobs.filter((i) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(i.status) || this.tab === "Paused" && i.status === "paused" || this.tab === "Failed" && i.status === "failed" || this.tab === "History" && Gn(i.status)).sort((i, t) => i.execute_at.localeCompare(t.execute_at));
  }
  async operate(i, t, n = {}) {
    if (this.menuJobId = void 0, ["cancel", "delete", "execute_now"].includes(i)) {
      this.confirmAction = { operation: i, job: t };
      return;
    }
    await this.performOperation(i, t, n);
  }
  async performOperation(i, t, n = {}) {
    this.busy = !0, this.error = void 0, this.errorDetails = void 0;
    try {
      await Un(this.hass, i, t.id, n), i === "delete" && (this.selected = void 0);
    } catch (o) {
      this.setError(o);
    } finally {
      this.busy = !1;
    }
  }
  setError(i) {
    const t = Wn(i);
    this.error = t.message, this.errorDetails = t.details;
  }
  openEditor(i) {
    const t = i?.sequence ?? [{ action: "light.turn_off", target: {} }], n = Oi(t);
    this.visualActions = n ?? [], this.actionYaml = me(t, { noRefs: !0 });
    const o = Mi(i?.conditions ?? []);
    this.visualConditions = o ?? { operator: "and", items: [] }, this.conditionMode = o ? "visual" : "yaml", this.conditionsYaml = i?.conditions.length ? me(i.conditions, { noRefs: !0 }) : "", this.scheduleMode = "delay", this.creationKind = "later", this.jobKey = i?.job_key ?? "", this.previewDelay = 20, this.previewUnit = "minutes", this.editor = { job: i, mode: n ? "visual" : "yaml" }, this.menuJobId = void 0, this.error = void 0, this.errorDetails = void 0;
  }
  openRunFor() {
    this.openEditor(), this.creationKind = "run_for";
  }
  primaryOperation(i) {
    if (i.status === "pending") return { label: "Pause", icon: "mdi:pause", operation: "pause" };
    if (i.status === "paused") return { label: "Resume", icon: "mdi:play", operation: "resume" };
    if (["failed", "missed"].includes(i.status)) return { label: "Run now", icon: "mdi:play", operation: "execute_now" };
    if (["completed", "cancelled", "skipped", "expired"].includes(i.status)) return { label: "Duplicate", icon: "mdi:content-copy", operation: "duplicate" };
  }
  renderMenu(i) {
    return this.menuJobId !== i.id ? R : T`<div class="menu" @click=${(t) => t.stopPropagation()}>
      <button @click=${() => {
      this.selected = i, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:information-outline"></ha-icon>View details</button>
      ${["pending", "paused"].includes(i.status) ? T`
        <button @click=${() => this.openEditor(i)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit</button>
        <button @click=${() => {
      this.quickDialog = { job: i, kind: "reschedule" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:calendar-clock"></ha-icon>Reschedule</button>
        ${i.status === "pending" ? T`<button @click=${() => {
      this.quickDialog = { job: i, kind: "snooze" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Snooze</button>` : T`<button @click=${() => {
      this.quickDialog = { job: i, kind: "extend" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Extend</button>`}` : R}
      ${["pending", "paused", "failed", "missed"].includes(i.status) ? T`<button @click=${() => this.operate("execute_now", i)}><ha-icon icon="mdi:play"></ha-icon>Run now</button>` : R}
      <button @click=${() => {
      this.quickDialog = { job: i, kind: "duplicate" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:content-copy"></ha-icon>Duplicate</button>
      ${["pending", "paused"].includes(i.status) ? T`<button class="warning" @click=${() => this.operate("cancel", i)}><ha-icon icon="mdi:cancel"></ha-icon>Cancel</button>` : R}
      ${i.status !== "executing" ? T`<button class="danger" @click=${() => this.operate("delete", i)}><ha-icon icon="mdi:delete-outline"></ha-icon>Delete</button>` : R}
    </div>`;
  }
  renderJob(i) {
    const t = this.primaryOperation(i);
    return T`<article class="job" @click=${() => {
      this.selected = i;
    }}>
      <div class="job-icon"><ha-icon icon=${i.status === "failed" ? "mdi:alert-circle-outline" : "mdi:clock-outline"}></ha-icon></div>
      <div class="job-body">
        <div class="job-head"><h3>${i.name}</h3>${i.status !== "pending" ? T`<span class="status ${i.status}">${i.status}</span>` : R}</div>
        <div class="time">${Ee(i.execute_at_local)} · ${Ft(i.execute_at)}</div>
        <p>${i.action_summary}</p>
        ${i.terminal_reason ? T`<p class="compact">${i.terminal_reason}</p>` : R}
        ${i.last_error ? T`<div class="error compact">${i.last_error}</div>` : R}
      </div>
      <div class="row-actions" @click=${(n) => n.stopPropagation()}>
        ${t ? T`<button class="quiet" @click=${() => t.operation === "duplicate" ? this.quickDialog = { job: i, kind: "duplicate" } : this.operate(t.operation, i)}><ha-icon icon=${t.icon}></ha-icon>${t.label}</button>` : R}
        <div class="menu-wrap"><button class="icon" title="More actions" @click=${() => {
      this.menuJobId = this.menuJobId === i.id ? void 0 : i.id;
    }}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>${this.renderMenu(i)}</div>
      </div>
    </article>`;
  }
  renderDetails(i) {
    return T`<div class="overlay" @click=${() => {
      this.selected = void 0;
    }}><section class="dialog wide" @click=${(t) => t.stopPropagation()}>
      <header><div><h2>${i.name}</h2><span class="status ${i.status}">${i.status}</span></div><button class="icon" title="Close" @click=${() => {
      this.selected = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <section class="detail-summary"><div><span>Scheduled</span><strong>${Ee(i.execute_at_local)}</strong><small>${Ft(i.execute_at)}</small></div><div><span>Action</span><strong>${i.action_summary}</strong></div></section>
      ${i.description ? T`<p>${i.description}</p>` : R}
      <div class="detail-actions">
        ${["pending", "paused"].includes(i.status) ? T`<button class="primary" @click=${() => this.openEditor(i)}>Edit action</button><button @click=${() => {
      this.quickDialog = { job: i, kind: "reschedule" };
    }}>Change time</button>` : R}
      </div>
      ${i.status === "pending" ? T`<div class="snooze"><span>Snooze</span><div class="chips">${Vn.map((t) => T`<button @click=${() => this.operate("snooze", i, { duration: { minutes: t } })}>+${t < 60 ? `${t} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => {
      this.quickDialog = { job: i, kind: "snooze" };
    }}>Custom</button></div>` : R}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
      "Job ID": i.id,
      Status: i.status,
      "Scheduled UTC": i.execute_at,
      "Don’t run after": i.valid_until_local ? `${Ee(i.valid_until_local)} (${i.valid_until})` : "—",
      Conditions: i.has_conditions ? `Yes — ${i.condition_failure === "skip" ? "skip this run" : i.condition_failure === "cancel" ? "cancel the action" : "mark as failed"} if not met` : "None",
      "Overdue behavior": Qn(i),
      Created: i.created_at,
      Modified: i.modified_at,
      Completed: i.completed_at || "—",
      Source: i.source,
      "Job key": i.job_key || "—",
      Tags: i.tags.join(", ") || "—",
      "Resolved targets": i.target_entities.join(", ") || "—",
      "Resolution hints": Pt(i).join(", ") || "—",
      Revision: String(i.revision),
      "Terminal reason": i.terminal_reason || "—",
      "Last error": i.last_error || "—"
    }).map(([t, n]) => T`<dt>${t}</dt><dd>${n}</dd>`)}
      </dl></details>
      <details><summary>Action sequence YAML</summary><pre>${me(i.sequence, { noRefs: !0 })}</pre></details>
      ${i.has_conditions ? T`<details><summary>Execution conditions YAML</summary><pre>${me(i.conditions, { noRefs: !0 })}</pre></details>` : R}
      <details><summary>Attribution and diagnostics</summary><pre>${JSON.stringify(i.attribution, null, 2)}</pre>${Object.keys(i.linkage).length ? T`<pre>${JSON.stringify(i.linkage, null, 2)}</pre>` : R}</details>
    </section></div>`;
  }
  renderEditor() {
    const i = this.editor?.job, t = !i && this.creationKind === "run_for";
    return T`<div class="overlay"><form class="dialog wide" @submit=${(n) => this.saveEditor(n)}>
      <header><h2>${i ? "Edit deferred action" : t ? "Run something for a while" : "Do something later"}</h2><button type="button" class="icon" title="Close" @click=${() => {
      this.editor = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${i ? R : T`<div class="segmented creation-kind"><button type="button" class=${this.creationKind === "later" ? "active" : ""} @click=${() => {
      this.creationKind = "later";
    }}>Do something later</button><button type="button" class=${t ? "active" : ""} @click=${() => {
      this.creationKind = "run_for";
    }}>Run something for a while</button></div>`}
      <label>Name<input name="name" required .value=${i?.name ?? ""} placeholder="Turn off office heater"></label>
      ${t ? this.renderRunForFields() : T`
        ${i ? R : this.renderScheduleFields()}
        <section class="action-editor"><div class="section-head"><h3>Actions</h3><button type="button" class="link" @click=${() => this.switchActionMode()}>${this.editor?.mode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
          ${this.editor?.mode === "visual" ? this.renderVisualActions() : T`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(n) => {
      this.actionYaml = n.currentTarget.value;
    }}></textarea><small>Advanced sequences such as choose, repeat, parallel, waits, and templates stay here.</small></label>`}
        </section>
        ${this.renderNormalOptions(i)}
      `}
      <details class="advanced"><summary>Developer and automation options</summary>
        <label>Job key<input name="job_key" .value=${this.jobKey} @input=${(n) => {
      this.jobKey = n.currentTarget.value;
    }}><small>Optional stable identifier for automations.</small></label>
        ${!i && this.jobKey.trim() ? T`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>` : R}
        <label>Tags<input name="tags" .value=${i?.tags.join(", ") ?? ""} placeholder="heating, office"><small>Separate tags with commas.</small></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${Pt(i)[0] ?? ""} .allowCustomEntity=${!0} @value-changed=${(n) => {
      const o = n.currentTarget.parentElement?.querySelector("input[name=target_entities]");
      o && (o.value = n.detail.value);
    }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${Pt(i).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
      </details>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>Preview</strong><span>${this.editorPreview(i)}</span></div></section>
      <footer><button type="button" @click=${() => {
      this.editor = void 0;
    }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${i ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }
  renderScheduleFields() {
    return T`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => {
      this.scheduleMode = "delay";
    }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => {
      this.scheduleMode = "absolute";
    }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? T`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(i) => {
      this.previewDelay = Number(i.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(i) => {
      this.previewUnit = i.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5, 15, 30, 60].map((i) => T`<button type="button" @click=${() => {
      this.previewDelay = i, this.previewUnit = "minutes";
    }}>${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div>` : T`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </fieldset>`;
  }
  renderRunForFields() {
    return T`<fieldset><legend>Run For</legend>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(i) => {
      this.runForTarget = i.detail.value;
    }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(i) => {
      this.runForStart = i.detail.value, this.runForEnd = er[i.detail.value] ?? "";
    }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(i) => {
      this.runForEnd = i.detail.value;
    }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(i) => {
      this.previewDelay = Number(i.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(i) => {
      this.previewUnit = i.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </fieldset>`;
  }
  renderVisualActions() {
    return T`${this.visualActions.map((i, t) => T`<article class="visual-card">
      <div class="section-head"><strong>Action ${t + 1}</strong>${this.visualActions.length > 1 ? T`<button type="button" class="link danger" @click=${() => {
      this.visualActions = this.visualActions.filter((n, o) => o !== t);
    }}>Remove</button>` : R}</div>
      <label>Service<ha-service-picker .hass=${this.hass} .value=${i.action} @value-changed=${(n) => this.updateAction(t, { action: n.detail.value })}></ha-service-picker></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${i.target} @value-changed=${(n) => this.updateAction(t, { target: n.detail.value })}></ha-target-picker><small>Choose entities, devices, or areas. Leave empty for services that do not need a target.</small></label>
      <div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => this.updateAction(t, { data: [...i.data, { key: "", type: "text", value: "", raw: "" }] })}>Add field</button></div>
      ${i.data.map((n, o) => T`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${n.key} @input=${(l) => this.updateData(t, o, { key: l.currentTarget.value })}><select aria-label="Data value type" .value=${n.type} @change=${(l) => this.setDataType(t, o, l.currentTarget.value)}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>${this.renderDataValue(t, o, n)}<button type="button" class="icon" title="Remove data field" @click=${() => this.updateAction(t, { data: i.data.filter((l, s) => s !== o) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`)}
    </article>`)}<button type="button" @click=${() => {
      this.visualActions = [...this.visualActions, { action: "", target: {}, data: [] }];
    }}><ha-icon icon="mdi:plus"></ha-icon>Add another action</button>`;
  }
  renderDataValue(i, t, n) {
    return n.type === "null" ? T`<span class="null-value">No value</span>` : n.type === "boolean" ? T`<select aria-label="Boolean value" .value=${n.value === !0 ? "true" : "false"} @change=${(o) => this.updateData(i, t, { value: o.currentTarget.value === "true" })}><option value="true">True</option><option value="false">False</option></select>` : T`<input aria-label="Data value" type=${n.type === "number" ? "number" : "text"} step=${n.type === "number" ? "any" : ""} placeholder=${n.type === "number" ? "42" : "Message text"} .value=${n.raw ?? String(n.value ?? "")} @input=${(o) => this.updateData(i, t, { raw: o.currentTarget.value })}>`;
  }
  renderNormalOptions(i) {
    return T`<section class="normal-options"><h3>Optional settings</h3>
      <label>Description<textarea name="description">${i?.description ?? ""}</textarea></label>
      <div class="section-head"><h3>Only run this action if…</h3><button type="button" class="link" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
      ${this.conditionMode === "visual" ? this.renderVisualConditions() : T`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(t) => {
      this.conditionsYaml = t.currentTarget.value;
    }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
      <label>If the conditions aren’t met<select name="condition_failure"><option value="skip" ?selected=${!i || i.condition_failure === "skip"}>Skip this run and keep it in history</option><option value="cancel" ?selected=${i?.condition_failure === "cancel"}>Cancel the action</option><option value="fail" ?selected=${i?.condition_failure === "fail"}>Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${i?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy"><option value="" ?selected=${!i?.overdue_policy}>Use the integration default</option><option value="execute" ?selected=${i?.overdue_policy === "execute"}>Run it when Home Assistant comes back</option><option value="execute_within_grace" ?selected=${i?.overdue_policy === "execute_within_grace"}>Run it only if it is less than the grace period late</option><option value="skip" ?selected=${i?.overdue_policy === "skip"}>Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${i?.overdue_grace ? String(i.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
    </section>`;
  }
  renderVisualConditions() {
    const i = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return T`<div class="condition-builder">${this.visualConditions.items.length > 1 ? T`<label>Match<select .value=${this.visualConditions.operator} @change=${(t) => {
      this.visualConditions = { ...this.visualConditions, operator: t.currentTarget.value };
    }}><option value="and">All conditions (AND)</option><option value="or">Any condition (OR)</option></select></label>` : R}
      ${this.visualConditions.items.map((t, n) => T`<article class="visual-card"><div class="section-head"><select aria-label="Condition type" .value=${t.type} @change=${(o) => this.changeConditionType(n, o.currentTarget.value)}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option></select><button type="button" class="link danger" @click=${() => {
      this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.filter((o, l) => l !== n) };
    }}>Remove</button></div>
        ${t.type === "state" ? T`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${t.entity_id} .allowCustomEntity=${!0} @value-changed=${(o) => this.updateCondition(n, { ...t, entity_id: o.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${t.state} @input=${(o) => this.updateCondition(n, { ...t, state: o.currentTarget.value })}></label>` : R}
        ${t.type === "numeric_state" ? T`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${t.entity_id} .allowCustomEntity=${!0} @value-changed=${(o) => this.updateCondition(n, { ...t, entity_id: o.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${t.above} @input=${(o) => this.updateCondition(n, { ...t, above: o.currentTarget.value })}></label><label>Below<input type="number" step="any" .value=${t.below} @input=${(o) => this.updateCondition(n, { ...t, below: o.currentTarget.value })}></label></div>` : R}
        ${t.type === "time" ? T`<div class="two"><label>After<input type="time" step="1" .value=${t.after} @input=${(o) => this.updateCondition(n, { ...t, after: o.currentTarget.value })}></label><label>Before<input type="time" step="1" .value=${t.before} @input=${(o) => this.updateCondition(n, { ...t, before: o.currentTarget.value })}></label></div><div class="weekdays">${i.map(([o, l]) => T`<label><input type="checkbox" .checked=${t.weekdays.includes(o)} @change=${(s) => this.toggleWeekday(n, t, o, s.currentTarget.checked)}>${l}</label>`)}</div>` : R}
      </article>`)}<button type="button" @click=${() => {
      this.visualConditions = { ...this.visualConditions, items: [...this.visualConditions.items, { type: "state", entity_id: "", state: "" }] };
    }}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
  }
  async saveEditor(i) {
    i.preventDefault();
    const t = i.currentTarget, n = new FormData(t);
    try {
      if (!this.editor?.job && this.creationKind === "run_for") {
        const a = Number(n.get("delay_value")), p = String(n.get("delay_unit"));
        if (!Number.isFinite(a) || a <= 0) throw new J("Duration must be greater than zero");
        if (!this.runForStart || !this.runForEnd || !Object.values(this.runForTarget).some((m) => m?.length)) throw new J("Choose a target, start action, and end action");
        this.busy = !0, await Pn(this.hass, {
          name: String(n.get("name")),
          description: String(n.get("description") ?? "") || void 0,
          duration: { [p]: a },
          start_sequence: Ze([{ action: this.runForStart, target: this.runForTarget, data: [] }]),
          end_sequence: Ze([{ action: this.runForEnd, target: this.runForTarget, data: [] }]),
          job_key: String(n.get("job_key") ?? "") || void 0,
          tags: String(n.get("tags") ?? "").split(",").map((m) => m.trim()).filter(Boolean),
          conflict_mode: String(n.get("conflict_mode") ?? "keep_all")
        }), await this.refresh(), this.editor = void 0;
        return;
      }
      const o = this.editor?.mode === "visual" ? Ze(this.visualActions) : Qe(this.actionYaml);
      if (!Array.isArray(o)) throw new J("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || this.visualActions.some((a) => !a.action))) throw new J("Choose a service for every action");
      const l = this.conditionMode === "visual" ? Ri(this.visualConditions) : this.conditionsYaml.trim() ? Qe(this.conditionsYaml) : [];
      if (this.conditionMode === "visual" && this.visualConditions.items.some((a) => a.type === "state" ? !a.entity_id || !a.state : a.type === "numeric_state" ? !a.entity_id || !a.above.trim() && !a.below.trim() : !a.after && !a.before && a.weekdays.length === 0)) throw new J("Complete or remove each condition");
      const s = {
        name: String(n.get("name")),
        description: String(n.get("description") ?? "") || void 0,
        job_key: String(n.get("job_key") ?? "") || void 0,
        tags: String(n.get("tags") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        target_entities: String(n.get("target_entities") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        sequence: o,
        conditions: l,
        condition_failure: String(n.get("condition_failure") ?? "skip"),
        overdue_policy: String(n.get("overdue_policy") ?? "") || null,
        overdue_grace: String(n.get("overdue_grace_minutes") ?? "") ? { minutes: Number(n.get("overdue_grace_minutes")) } : null,
        valid_until: String(n.get("valid_until") ?? "") ? new Date(String(n.get("valid_until"))).toISOString() : null
      };
      if (!Array.isArray(s.conditions)) throw new J("Conditions YAML must be a list");
      if (this.busy = !0, this.editor?.job) await qn(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...s });
      else {
        let a;
        if (this.scheduleMode === "absolute") {
          const p = String(n.get("date")), m = String(n.get("time")), u = /* @__PURE__ */ new Date(`${p}T${m}`);
          if (Number.isNaN(u.getTime())) throw new J("Choose a valid date and time");
          a = { execute_at: u.toISOString() };
        } else {
          const p = Number(n.get("delay_value")), m = String(n.get("delay_unit"));
          if (!Number.isFinite(p) || p <= 0) throw new J("Delay must be greater than zero");
          a = { delay: { [m]: p } };
        }
        await Fn(this.hass, { ...s, ...a, conflict_mode: String(n.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = void 0;
    } catch (o) {
      this.setError(o);
    } finally {
      this.busy = !1;
    }
  }
  updateAction(i, t) {
    this.visualActions = this.visualActions.map((n, o) => o === i ? { ...n, ...t } : n);
  }
  updateData(i, t, n) {
    const o = this.visualActions[i];
    o && this.updateAction(i, { data: o.data.map((l, s) => s === t ? { ...l, ...n } : l) });
  }
  setDataType(i, t, n) {
    const o = this.visualActions[i]?.data[t];
    o && this.updateData(i, t, zn(o, n));
  }
  updateCondition(i, t) {
    this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.map((n, o) => o === i ? t : n) };
  }
  changeConditionType(i, t) {
    const n = t === "state" ? { type: t, entity_id: "", state: "" } : t === "numeric_state" ? { type: t, entity_id: "", above: "", below: "" } : { type: t, after: "", before: "", weekdays: [] };
    this.updateCondition(i, n);
  }
  toggleWeekday(i, t, n, o) {
    this.updateCondition(i, { ...t, weekdays: o ? [...t.weekdays, n] : t.weekdays.filter((l) => l !== n) });
  }
  switchActionMode() {
    if (this.editor?.mode === "visual") {
      this.actionYaml = me(Ze(this.visualActions), { noRefs: !0 }), this.editor = { ...this.editor, mode: "yaml" };
      return;
    }
    try {
      const i = Qe(this.actionYaml);
      if (!Array.isArray(i)) throw new J("Action YAML must be a list");
      const t = Oi(i);
      if (!t) throw new J("This sequence uses advanced features that the visual editor cannot represent safely.");
      this.visualActions = t, this.editor = { ...this.editor, mode: "visual" };
    } catch (i) {
      this.setError(i);
    }
  }
  switchConditionMode() {
    if (this.conditionMode === "visual") {
      this.conditionsYaml = me(Ri(this.visualConditions), { noRefs: !0 }), this.conditionMode = "yaml";
      return;
    }
    try {
      const i = this.conditionsYaml.trim() ? Qe(this.conditionsYaml) : [];
      if (!Array.isArray(i)) throw new J("Conditions YAML must be a list");
      const t = Mi(i);
      if (!t) throw new J("These conditions use advanced options that the visual editor cannot represent safely.");
      this.visualConditions = t, this.conditionMode = "visual";
    } catch (i) {
      this.setError(i);
    }
  }
  actionLabel(i, t) {
    const n = i.split(".").pop()?.replaceAll("_", " ") ?? "Run action", o = t.entity_id ?? t.device_id ?? t.area_id ?? t.floor_id ?? t.label_id, s = (Array.isArray(o) ? o[0] : o)?.split(".").pop()?.replaceAll("_", " ");
    return `${n.charAt(0).toUpperCase()}${n.slice(1)}${s ? ` ${s}` : ""}`;
  }
  editorPreview(i) {
    if (i) return `${this.visualActions[0] ? this.actionLabel(this.visualActions[0].action, this.visualActions[0].target) : i.action_summary}; scheduled for ${Ee(i.execute_at_local)}`;
    if (this.creationKind === "run_for") return `${this.actionLabel(this.runForStart, this.runForTarget)} now, then ${this.actionLabel(this.runForEnd, this.runForTarget).toLowerCase()} in ${this.previewDelay} ${this.previewUnit}`;
    const t = this.visualActions[0], n = t ? this.actionLabel(t.action, t.target) : "Run the configured action";
    return this.scheduleMode === "delay" ? `${n} in ${this.previewDelay} ${this.previewUnit}` : `${n} at the selected date and time`;
  }
  renderQuickDialog() {
    const i = this.quickDialog;
    return i ? T`<div class="overlay"><form class="dialog small" @submit=${(n) => this.submitQuickDialog(n)}><header><h2>${{ reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: "Duplicate action" }[i.kind]}</h2><button type="button" class="icon" @click=${() => {
      this.quickDialog = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${i.kind === "reschedule" ? T`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : T`<label>${i.kind === "extend" ? "Minutes to add (negative reduces time)" : i.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${i.kind === "extend" ? R : "1"} .value=${i.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => {
      this.quickDialog = void 0;
    }}>Cancel</button><button class="primary">${i.kind === "duplicate" ? "Duplicate" : "Apply"}</button></footer></form></div>` : R;
  }
  async submitQuickDialog(i) {
    i.preventDefault();
    const t = this.quickDialog;
    if (!t) return;
    const n = new FormData(i.currentTarget);
    if (t.kind === "reschedule") {
      const o = /* @__PURE__ */ new Date(`${String(n.get("date"))}T${String(n.get("time"))}`);
      if (Number.isNaN(o.getTime())) {
        this.error = "Choose a valid date and time";
        return;
      }
      await this.operate("reschedule", t.job, { execute_at: o.toISOString() });
    } else {
      const o = Number(n.get("minutes"));
      if (!Number.isFinite(o) || (["duplicate", "snooze"].includes(t.kind) ? o <= 0 : o === 0)) {
        this.error = "Enter a valid number of minutes";
        return;
      }
      await this.operate(t.kind, t.job, ["extend", "snooze"].includes(t.kind) ? { duration: { minutes: o } } : { delay: { minutes: o } });
    }
    this.quickDialog = void 0;
  }
  renderConfirmation() {
    const i = this.confirmAction;
    if (!i) return R;
    const t = i.operation === "delete", n = i.operation === "cancel", o = t ? "Delete this record permanently?" : n ? "Cancel this deferred action?" : "Run this action now?", l = t ? "This permanently removes the record and its history. This cannot be undone." : n ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay and starts the action now.";
    return T`<div class="overlay" @click=${() => {
      this.confirmAction = void 0;
    }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(s) => s.stopPropagation()}>
      <header><h2>${o}</h2><button class="icon" title="Close" @click=${() => {
      this.confirmAction = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${i.job.name}</strong></p><p>${l}</p>
      <footer><button @click=${() => {
      this.confirmAction = void 0;
    }}>Keep it</button><button class=${t ? "danger" : n ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => {
      const s = this.confirmAction;
      this.confirmAction = void 0, s && await this.performOperation(s.operation, s.job);
    }}>${t ? "Delete permanently" : n ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }
  render() {
    const i = this.visibleJobs();
    return T`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? T`<div class="banner"><div>${this.error}${this.errorDetails ? T`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : R}</div><button class="icon" @click=${() => {
      this.error = void 0, this.errorDetails = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : R}
      <nav>${["Pending", "Paused", "Failed", "History"].map((t) => T`<button class=${this.tab === t ? "active" : ""} @click=${() => {
      this.tab = t;
    }}>${t}<span>${t === "Pending" ? this.summary.pending : t === "Paused" ? this.summary.paused : t === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => {
      this.tab = "All";
    }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? T`<small>${Ee(this.summary.next_execution_local)} · ${Ft(this.summary.next_execution_local)}</small>` : R}</section>
      <main>${i.length ? i.map((t) => this.renderJob(t)) : T`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : R}${this.editor ? this.renderEditor() : R}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }
};
I.styles = rn`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.data-row{display:grid;grid-template-columns:minmax(120px,1fr) 110px minmax(140px,1fr) auto;gap:8px;align-items:center;margin:8px 0}.null-value{padding:10px;color:var(--secondary-text-color);font-style:italic}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input,.data-row select,.data-row .null-value{grid-column:1}.data-row button{grid-column:2;grid-row:1/4}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
D([
  Pi({ attribute: !1 })
], I.prototype, "hass", 2);
D([
  P()
], I.prototype, "jobs", 2);
D([
  P()
], I.prototype, "summary", 2);
D([
  P()
], I.prototype, "tab", 2);
D([
  P()
], I.prototype, "selected", 2);
D([
  P()
], I.prototype, "editor", 2);
D([
  P()
], I.prototype, "creationKind", 2);
D([
  P()
], I.prototype, "scheduleMode", 2);
D([
  P()
], I.prototype, "visualActions", 2);
D([
  P()
], I.prototype, "actionYaml", 2);
D([
  P()
], I.prototype, "conditionMode", 2);
D([
  P()
], I.prototype, "visualConditions", 2);
D([
  P()
], I.prototype, "conditionsYaml", 2);
D([
  P()
], I.prototype, "runForTarget", 2);
D([
  P()
], I.prototype, "runForStart", 2);
D([
  P()
], I.prototype, "runForEnd", 2);
D([
  P()
], I.prototype, "jobKey", 2);
D([
  P()
], I.prototype, "previewDelay", 2);
D([
  P()
], I.prototype, "previewUnit", 2);
D([
  P()
], I.prototype, "confirmAction", 2);
D([
  P()
], I.prototype, "errorDetails", 2);
D([
  P()
], I.prototype, "menuJobId", 2);
D([
  P()
], I.prototype, "quickDialog", 2);
D([
  P()
], I.prototype, "error", 2);
D([
  P()
], I.prototype, "busy", 2);
I = D([
  Sn("deferred-actions-panel")
], I);
export {
  I as DeferredActionsPanel
};
