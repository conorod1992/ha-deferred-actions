const Ze = globalThis, qi = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ui = /* @__PURE__ */ Symbol(), Ji = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(i, n, o) {
    if (this._$cssResult$ = !0, o !== Ui) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = n;
  }
  get styleSheet() {
    let i = this.o;
    const n = this.t;
    if (qi && i === void 0) {
      const o = n !== void 0 && n.length === 1;
      o && (i = Ji.get(n)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), o && Ji.set(n, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const tn = (t) => new Rt(typeof t == "string" ? t : t + "", void 0, Ui), nn = (t, ...i) => {
  const n = t.length === 1 ? t[0] : i.reduce((o, l, s) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(l) + t[s + 1], t[0]);
  return new Rt(n, t, Ui);
}, rn = (t, i) => {
  if (qi) t.adoptedStyleSheets = i.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of i) {
    const o = document.createElement("style"), l = Ze.litNonce;
    l !== void 0 && o.setAttribute("nonce", l), o.textContent = n.cssText, t.appendChild(o);
  }
}, Wi = qi ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((i) => {
  let n = "";
  for (const o of i.cssRules) n += o.cssText;
  return tn(n);
})(t) : t;
const { is: on, defineProperty: ln, getOwnPropertyDescriptor: sn, getOwnPropertyNames: an, getOwnPropertySymbols: cn, getPrototypeOf: un } = Object, ii = globalThis, Vi = ii.trustedTypes, dn = Vi ? Vi.emptyScript : "", pn = ii.reactiveElementPolyfillSupport, Ee = (t, i) => t, Xe = { toAttribute(t, i) {
  switch (i) {
    case Boolean:
      t = t ? dn : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, i) {
  let n = t;
  switch (i) {
    case Boolean:
      n = t !== null;
      break;
    case Number:
      n = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(t);
      } catch {
        n = null;
      }
  }
  return n;
} }, Yi = (t, i) => !on(t, i), Gi = { attribute: !0, type: String, converter: Xe, reflect: !1, useDefault: !1, hasChanged: Yi };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ii.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let me = class extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ??= []).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, n = Gi) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(i) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(i, n), !n.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), l = this.getPropertyDescriptor(i, o, n);
      l !== void 0 && ln(this.prototype, i, l);
    }
  }
  static getPropertyDescriptor(i, n, o) {
    const { get: l, set: s } = sn(this.prototype, i) ?? { get() {
      return this[n];
    }, set(a) {
      this[n] = a;
    } };
    return { get: l, set(a) {
      const p = l?.call(this);
      s?.call(this, a), this.requestUpdate(i, p, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? Gi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ee("elementProperties"))) return;
    const i = un(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ee("properties"))) {
      const n = this.properties, o = [...an(n), ...cn(n)];
      for (const l of o) this.createProperty(l, n[l]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const n = litPropertyMetadata.get(i);
      if (n !== void 0) for (const [o, l] of n) this.elementProperties.set(o, l);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, o] of this.elementProperties) {
      const l = this._$Eu(n, o);
      l !== void 0 && this._$Eh.set(l, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const n = [];
    if (Array.isArray(i)) {
      const o = new Set(i.flat(1 / 0).reverse());
      for (const l of o) n.unshift(Wi(l));
    } else i !== void 0 && n.push(Wi(i));
    return n;
  }
  static _$Eu(i, n) {
    const o = n.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof i == "string" ? i.toLowerCase() : void 0;
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
    for (const o of n.keys()) this.hasOwnProperty(o) && (i.set(o, this[o]), delete this[o]);
    i.size > 0 && (this._$Ep = i);
  }
  createRenderRoot() {
    const i = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return rn(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((i) => i.hostConnected?.());
  }
  enableUpdating(i) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((i) => i.hostDisconnected?.());
  }
  attributeChangedCallback(i, n, o) {
    this._$AK(i, o);
  }
  _$ET(i, n) {
    const o = this.constructor.elementProperties.get(i), l = this.constructor._$Eu(i, o);
    if (l !== void 0 && o.reflect === !0) {
      const s = (o.converter?.toAttribute !== void 0 ? o.converter : Xe).toAttribute(n, o.type);
      this._$Em = i, s == null ? this.removeAttribute(l) : this.setAttribute(l, s), this._$Em = null;
    }
  }
  _$AK(i, n) {
    const o = this.constructor, l = o._$Eh.get(i);
    if (l !== void 0 && this._$Em !== l) {
      const s = o.getPropertyOptions(l), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Xe;
      this._$Em = l;
      const p = a.fromAttribute(n, s.type);
      this[l] = p ?? this._$Ej?.get(l) ?? p, this._$Em = null;
    }
  }
  requestUpdate(i, n, o, l = !1, s) {
    if (i !== void 0) {
      const a = this.constructor;
      if (l === !1 && (s = this[i]), o ??= a.getPropertyOptions(i), !((o.hasChanged ?? Yi)(s, n) || o.useDefault && o.reflect && s === this._$Ej?.get(i) && !this.hasAttribute(a._$Eu(i, o)))) return;
      this.C(i, n, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(i, n, { useDefault: o, reflect: l, wrapped: s }, a) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(i) && (this._$Ej.set(i, a ?? n ?? this[i]), s !== !0 || a !== void 0) || (this._$AL.has(i) || (this.hasUpdated || o || (n = void 0), this._$AL.set(i, n)), l === !0 && this._$Em !== i && (this._$Eq ??= /* @__PURE__ */ new Set()).add(i));
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
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [l, s] of o) {
        const { wrapped: a } = s, p = this[l];
        a !== !0 || this._$AL.has(l) || p === void 0 || this.C(l, void 0, s, p);
      }
    }
    let i = !1;
    const n = this._$AL;
    try {
      i = this.shouldUpdate(n), i ? (this.willUpdate(n), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(n)) : this._$EM();
    } catch (o) {
      throw i = !1, this._$EM(), o;
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
me.elementStyles = [], me.shadowRootOptions = { mode: "open" }, me[Ee("elementProperties")] = /* @__PURE__ */ new Map(), me[Ee("finalized")] = /* @__PURE__ */ new Map(), pn?.({ ReactiveElement: me }), (ii.reactiveElementVersions ??= []).push("2.1.2");
const Hi = globalThis, Qi = (t) => t, ei = Hi.trustedTypes, Zi = ei ? ei.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Nt = "$lit$", re = `lit$${Math.random().toFixed(9).slice(2)}$`, It = "?" + re, hn = `<${It}>`, ce = document, Oe = () => ce.createComment(""), Me = (t) => t === null || typeof t != "object" && typeof t != "function", Bi = Array.isArray, fn = (t) => Bi(t) || typeof t?.[Symbol.iterator] == "function", hi = `[ 	
\f\r]`, Se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Xi = /-->/g, et = />/g, se = RegExp(`>|${hi}(?:([^\\s"'>=/]+)(${hi}*=${hi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, tt = /"/g, Lt = /^(?:script|style|textarea|title)$/i, mn = (t) => (i, ...n) => ({ _$litType$: t, strings: i, values: n }), O = mn(1), ye = /* @__PURE__ */ Symbol.for("lit-noChange"), R = /* @__PURE__ */ Symbol.for("lit-nothing"), nt = /* @__PURE__ */ new WeakMap(), ae = ce.createTreeWalker(ce, 129);
function Dt(t, i) {
  if (!Bi(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Zi !== void 0 ? Zi.createHTML(i) : i;
}
const gn = (t, i) => {
  const n = t.length - 1, o = [];
  let l, s = i === 2 ? "<svg>" : i === 3 ? "<math>" : "", a = Se;
  for (let p = 0; p < n; p++) {
    const m = t[p];
    let u, h, _ = -1, T = 0;
    for (; T < m.length && (a.lastIndex = T, h = a.exec(m), h !== null); ) T = a.lastIndex, a === Se ? h[1] === "!--" ? a = Xi : h[1] !== void 0 ? a = et : h[2] !== void 0 ? (Lt.test(h[2]) && (l = RegExp("</" + h[2], "g")), a = se) : h[3] !== void 0 && (a = se) : a === se ? h[0] === ">" ? (a = l ?? Se, _ = -1) : h[1] === void 0 ? _ = -2 : (_ = a.lastIndex - h[2].length, u = h[1], a = h[3] === void 0 ? se : h[3] === '"' ? tt : it) : a === tt || a === it ? a = se : a === Xi || a === et ? a = Se : (a = se, l = void 0);
    const N = a === se && t[p + 1].startsWith("/>") ? " " : "";
    s += a === Se ? m + hn : _ >= 0 ? (o.push(u), m.slice(0, _) + Nt + m.slice(_) + re + N) : m + re + (_ === -2 ? p : N);
  }
  return [Dt(t, s + (t[n] || "<?>") + (i === 2 ? "</svg>" : i === 3 ? "</math>" : "")), o];
};
class Re {
  constructor({ strings: i, _$litType$: n }, o) {
    let l;
    this.parts = [];
    let s = 0, a = 0;
    const p = i.length - 1, m = this.parts, [u, h] = gn(i, n);
    if (this.el = Re.createElement(u, o), ae.currentNode = this.el.content, n === 2 || n === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (l = ae.nextNode()) !== null && m.length < p; ) {
      if (l.nodeType === 1) {
        if (l.hasAttributes()) for (const _ of l.getAttributeNames()) if (_.endsWith(Nt)) {
          const T = h[a++], N = l.getAttribute(_).split(re), J = /([.?@])?(.*)/.exec(T);
          m.push({ type: 1, index: s, name: J[2], strings: N, ctor: J[1] === "." ? vn : J[1] === "?" ? bn : J[1] === "@" ? _n : ti }), l.removeAttribute(_);
        } else _.startsWith(re) && (m.push({ type: 6, index: s }), l.removeAttribute(_));
        if (Lt.test(l.tagName)) {
          const _ = l.textContent.split(re), T = _.length - 1;
          if (T > 0) {
            l.textContent = ei ? ei.emptyScript : "";
            for (let N = 0; N < T; N++) l.append(_[N], Oe()), ae.nextNode(), m.push({ type: 2, index: ++s });
            l.append(_[T], Oe());
          }
        }
      } else if (l.nodeType === 8) if (l.data === It) m.push({ type: 2, index: s });
      else {
        let _ = -1;
        for (; (_ = l.data.indexOf(re, _ + 1)) !== -1; ) m.push({ type: 7, index: s }), _ += re.length - 1;
      }
      s++;
    }
  }
  static createElement(i, n) {
    const o = ce.createElement("template");
    return o.innerHTML = i, o;
  }
}
function ve(t, i, n = t, o) {
  if (i === ye) return i;
  let l = o !== void 0 ? n._$Co?.[o] : n._$Cl;
  const s = Me(i) ? void 0 : i._$litDirective$;
  return l?.constructor !== s && (l?._$AO?.(!1), s === void 0 ? l = void 0 : (l = new s(t), l._$AT(t, n, o)), o !== void 0 ? (n._$Co ??= [])[o] = l : n._$Cl = l), l !== void 0 && (i = ve(t, l._$AS(t, i.values), l, o)), i;
}
class yn {
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
    const { el: { content: n }, parts: o } = this._$AD, l = (i?.creationScope ?? ce).importNode(n, !0);
    ae.currentNode = l;
    let s = ae.nextNode(), a = 0, p = 0, m = o[0];
    for (; m !== void 0; ) {
      if (a === m.index) {
        let u;
        m.type === 2 ? u = new Ne(s, s.nextSibling, this, i) : m.type === 1 ? u = new m.ctor(s, m.name, m.strings, this, i) : m.type === 6 && (u = new An(s, this, i)), this._$AV.push(u), m = o[++p];
      }
      a !== m?.index && (s = ae.nextNode(), a++);
    }
    return ae.currentNode = ce, l;
  }
  p(i) {
    let n = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(i, o, n), n += o.strings.length - 2) : o._$AI(i[n])), n++;
  }
}
class Ne {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(i, n, o, l) {
    this.type = 2, this._$AH = R, this._$AN = void 0, this._$AA = i, this._$AB = n, this._$AM = o, this.options = l, this._$Cv = l?.isConnected ?? !0;
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
    i = ve(this, i, n), Me(i) ? i === R || i == null || i === "" ? (this._$AH !== R && this._$AR(), this._$AH = R) : i !== this._$AH && i !== ye && this._(i) : i._$litType$ !== void 0 ? this.$(i) : i.nodeType !== void 0 ? this.T(i) : fn(i) ? this.k(i) : this._(i);
  }
  O(i) {
    return this._$AA.parentNode.insertBefore(i, this._$AB);
  }
  T(i) {
    this._$AH !== i && (this._$AR(), this._$AH = this.O(i));
  }
  _(i) {
    this._$AH !== R && Me(this._$AH) ? this._$AA.nextSibling.data = i : this.T(ce.createTextNode(i)), this._$AH = i;
  }
  $(i) {
    const { values: n, _$litType$: o } = i, l = typeof o == "number" ? this._$AC(i) : (o.el === void 0 && (o.el = Re.createElement(Dt(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === l) this._$AH.p(n);
    else {
      const s = new yn(l, this), a = s.u(this.options);
      s.p(n), this.T(a), this._$AH = s;
    }
  }
  _$AC(i) {
    let n = nt.get(i.strings);
    return n === void 0 && nt.set(i.strings, n = new Re(i)), n;
  }
  k(i) {
    Bi(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let o, l = 0;
    for (const s of i) l === n.length ? n.push(o = new Ne(this.O(Oe()), this.O(Oe()), this, this.options)) : o = n[l], o._$AI(s), l++;
    l < n.length && (this._$AR(o && o._$AB.nextSibling, l), n.length = l);
  }
  _$AR(i = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); i !== this._$AB; ) {
      const o = Qi(i).nextSibling;
      Qi(i).remove(), i = o;
    }
  }
  setConnected(i) {
    this._$AM === void 0 && (this._$Cv = i, this._$AP?.(i));
  }
}
class ti {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(i, n, o, l, s) {
    this.type = 1, this._$AH = R, this._$AN = void 0, this.element = i, this.name = n, this._$AM = l, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = R;
  }
  _$AI(i, n = this, o, l) {
    const s = this.strings;
    let a = !1;
    if (s === void 0) i = ve(this, i, n, 0), a = !Me(i) || i !== this._$AH && i !== ye, a && (this._$AH = i);
    else {
      const p = i;
      let m, u;
      for (i = s[0], m = 0; m < s.length - 1; m++) u = ve(this, p[o + m], n, m), u === ye && (u = this._$AH[m]), a ||= !Me(u) || u !== this._$AH[m], u === R ? i = R : i !== R && (i += (u ?? "") + s[m + 1]), this._$AH[m] = u;
    }
    a && !l && this.j(i);
  }
  j(i) {
    i === R ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, i ?? "");
  }
}
class vn extends ti {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(i) {
    this.element[this.name] = i === R ? void 0 : i;
  }
}
class bn extends ti {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(i) {
    this.element.toggleAttribute(this.name, !!i && i !== R);
  }
}
class _n extends ti {
  constructor(i, n, o, l, s) {
    super(i, n, o, l, s), this.type = 5;
  }
  _$AI(i, n = this) {
    if ((i = ve(this, i, n, 0) ?? R) === ye) return;
    const o = this._$AH, l = i === R && o !== R || i.capture !== o.capture || i.once !== o.once || i.passive !== o.passive, s = i !== R && (o === R || l);
    l && this.element.removeEventListener(this.name, this, o), s && this.element.addEventListener(this.name, this, i), this._$AH = i;
  }
  handleEvent(i) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, i) : this._$AH.handleEvent(i);
  }
}
class An {
  constructor(i, n, o) {
    this.element = i, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(i) {
    ve(this, i);
  }
}
const $n = Hi.litHtmlPolyfillSupport;
$n?.(Re, Ne), (Hi.litHtmlVersions ??= []).push("3.3.3");
const xn = (t, i, n) => {
  const o = n?.renderBefore ?? i;
  let l = o._$litPart$;
  if (l === void 0) {
    const s = n?.renderBefore ?? null;
    o._$litPart$ = l = new Ne(i.insertBefore(Oe(), s), s, void 0, n ?? {});
  }
  return l._$AI(t), l;
};
const ji = globalThis;
class Te extends me {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const i = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= i.firstChild, i;
  }
  update(i) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(i), this._$Do = xn(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ye;
  }
}
Te._$litElement$ = !0, Te.finalized = !0, ji.litElementHydrateSupport?.({ LitElement: Te });
const wn = ji.litElementPolyfillSupport;
wn?.({ LitElement: Te });
(ji.litElementVersions ??= []).push("4.2.2");
const kn = (t) => (i, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(t, i);
  }) : customElements.define(t, i);
};
const Sn = { attribute: !0, type: String, converter: Xe, reflect: !1, hasChanged: Yi }, Cn = (t = Sn, i, n) => {
  const { kind: o, metadata: l } = n;
  let s = globalThis.litPropertyMetadata.get(l);
  if (s === void 0 && globalThis.litPropertyMetadata.set(l, s = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(n.name, t), o === "accessor") {
    const { name: a } = n;
    return { set(p) {
      const m = i.get.call(this);
      i.set.call(this, p), this.requestUpdate(a, m, t, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(a, void 0, t, p), p;
    } };
  }
  if (o === "setter") {
    const { name: a } = n;
    return function(p) {
      const m = this[a];
      i.call(this, p), this.requestUpdate(a, m, t, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Ft(t) {
  return (i, n) => typeof n == "object" ? Cn(t, i, n) : ((o, l, s) => {
    const a = l.hasOwnProperty(s);
    return l.constructor.createProperty(s, o), a ? Object.getOwnPropertyDescriptor(l, s) : void 0;
  })(t, i, n);
}
function P(t) {
  return Ft({ ...t, state: !0, attribute: !1 });
}
function En(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var B = {}, Ve = {}, ne = {}, rt;
function Ie() {
  if (rt) return ne;
  rt = 1;
  function t(a) {
    return typeof a > "u" || a === null;
  }
  function i(a) {
    return typeof a == "object" && a !== null;
  }
  function n(a) {
    return Array.isArray(a) ? a : t(a) ? [] : [a];
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
  return ne.isNothing = t, ne.isObject = i, ne.toArray = n, ne.repeat = l, ne.isNegativeZero = s, ne.extend = o, ne;
}
var fi, ot;
function Le() {
  if (ot) return fi;
  ot = 1;
  function t(n, o) {
    let l = "";
    const s = n.reason || "(unknown reason)";
    return n.mark ? (n.mark.name && (l += 'in "' + n.mark.name + '" '), l += "(" + (n.mark.line + 1) + ":" + (n.mark.column + 1) + ")", !o && n.mark.snippet && (l += `

` + n.mark.snippet), s + " " + l) : s;
  }
  function i(n, o) {
    Error.call(this), this.name = "YAMLException", this.reason = n, this.mark = o, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return i.prototype = Object.create(Error.prototype), i.prototype.constructor = i, i.prototype.toString = function(o) {
    return this.name + ": " + t(this, o);
  }, fi = i, fi;
}
var mi, lt;
function Tn() {
  if (lt) return mi;
  lt = 1;
  const t = Ie();
  function i(l, s, a, p, m) {
    let u = "", h = "";
    const _ = Math.floor(m / 2) - 1;
    return p - s > _ && (u = " ... ", s = p - _ + u.length), a - p > _ && (h = " ...", a = p + _ - h.length), {
      str: u + l.slice(s, a).replace(/\t/g, "→") + h,
      pos: p - s + u.length
      // relative position
    };
  }
  function n(l, s) {
    return t.repeat(" ", s - l.length) + l;
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
    const T = Math.min(l.line + s.linesAfter, m.length).toString().length, N = s.maxLength - (s.indent + T + 3);
    for (let q = 1; q <= s.linesBefore && !(h - q < 0); q++) {
      const V = i(
        l.buffer,
        p[h - q],
        m[h - q],
        l.position - (p[h] - p[h - q]),
        N
      );
      _ = t.repeat(" ", s.indent) + n((l.line - q + 1).toString(), T) + " | " + V.str + `
` + _;
    }
    const J = i(l.buffer, p[h], m[h], l.position, N);
    _ += t.repeat(" ", s.indent) + n((l.line + 1).toString(), T) + " | " + J.str + `
`, _ += t.repeat("-", s.indent + T + 3 + J.pos) + `^
`;
    for (let q = 1; q <= s.linesAfter && !(h + q >= m.length); q++) {
      const V = i(
        l.buffer,
        p[h + q],
        m[h + q],
        l.position - (p[h] - p[h + q]),
        N
      );
      _ += t.repeat(" ", s.indent) + n((l.line + q + 1).toString(), T) + " | " + V.str + `
`;
    }
    return _.replace(/\n$/, "");
  }
  return mi = o, mi;
}
var gi, st;
function j() {
  if (st) return gi;
  st = 1;
  const t = Le(), i = [
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
      if (i.indexOf(p) === -1)
        throw new t('Unknown option "' + p + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = a, this.tag = s, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(p) {
      return p;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = o(a.styleAliases || null), n.indexOf(this.kind) === -1)
      throw new t('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return gi = l, gi;
}
var yi, at;
function Pt() {
  if (at) return yi;
  at = 1;
  const t = Le(), i = j();
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
    if (a instanceof i)
      m.push(a);
    else if (Array.isArray(a))
      m = m.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (p = p.concat(a.implicit)), a.explicit && (m = m.concat(a.explicit));
    else
      throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    p.forEach(function(h) {
      if (!(h instanceof i))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), m.forEach(function(h) {
      if (!(h instanceof i))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const u = Object.create(l.prototype);
    return u.implicit = (this.implicit || []).concat(p), u.explicit = (this.explicit || []).concat(m), u.compiledImplicit = n(u, "implicit"), u.compiledExplicit = n(u, "explicit"), u.compiledTypeMap = o(u.compiledImplicit, u.compiledExplicit), u;
  }, yi = l, yi;
}
var vi, ct;
function qt() {
  if (ct) return vi;
  ct = 1;
  const t = j();
  return vi = new t("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(i) {
      return i !== null ? i : "";
    }
  }), vi;
}
var bi, ut;
function Ut() {
  if (ut) return bi;
  ut = 1;
  const t = j();
  return bi = new t("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(i) {
      return i !== null ? i : [];
    }
  }), bi;
}
var _i, dt;
function Yt() {
  if (dt) return _i;
  dt = 1;
  const t = j();
  return _i = new t("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(i) {
      return i !== null ? i : {};
    }
  }), _i;
}
var Ai, pt;
function Ht() {
  if (pt) return Ai;
  pt = 1;
  const t = Pt();
  return Ai = new t({
    explicit: [
      qt(),
      Ut(),
      Yt()
    ]
  }), Ai;
}
var $i, ht;
function Bt() {
  if (ht) return $i;
  ht = 1;
  const t = j();
  function i(l) {
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
  return $i = new t("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: i,
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
  }), $i;
}
var xi, ft;
function jt() {
  if (ft) return xi;
  ft = 1;
  const t = j();
  function i(l) {
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
  return xi = new t("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: i,
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
  }), xi;
}
var wi, mt;
function Kt() {
  if (mt) return wi;
  mt = 1;
  const t = Ie(), i = j();
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
    let _ = 0, T = !1;
    if (!h) return !1;
    let N = u[_];
    if ((N === "-" || N === "+") && (N = u[++_]), N === "0") {
      if (_ + 1 === h) return !0;
      if (N = u[++_], N === "b") {
        for (_++; _ < h; _++) {
          if (N = u[_], N !== "0" && N !== "1") return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
      if (N === "x") {
        for (_++; _ < h; _++) {
          if (!n(u.charCodeAt(_))) return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
      if (N === "o") {
        for (_++; _ < h; _++) {
          if (!o(u.charCodeAt(_))) return !1;
          T = !0;
        }
        return T && isFinite(a(u));
      }
    }
    for (; _ < h; _++) {
      if (!l(u.charCodeAt(_)))
        return !1;
      T = !0;
    }
    return T ? isFinite(a(u)) : !1;
  }
  function a(u) {
    let h = u, _ = 1, T = h[0];
    if ((T === "-" || T === "+") && (T === "-" && (_ = -1), h = h.slice(1), T = h[0]), h === "0") return 0;
    if (T === "0") {
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
    return Object.prototype.toString.call(u) === "[object Number]" && u % 1 === 0 && !t.isNegativeZero(u);
  }
  return wi = new i("tag:yaml.org,2002:int", {
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
  }), wi;
}
var ki, gt;
function zt() {
  if (gt) return ki;
  gt = 1;
  const t = Ie(), i = j(), n = new RegExp(
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
    else if (t.isNegativeZero(u))
      return "-0.0";
    const _ = u.toString(10);
    return a.test(_) ? _.replace("e", ".e") : _;
  }
  function m(u) {
    return Object.prototype.toString.call(u) === "[object Number]" && (u % 1 !== 0 || t.isNegativeZero(u));
  }
  return ki = new i("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: l,
    construct: s,
    predicate: m,
    represent: p,
    defaultStyle: "lowercase"
  }), ki;
}
var Si, yt;
function Jt() {
  return yt || (yt = 1, Si = Ht().extend({
    implicit: [
      Bt(),
      jt(),
      Kt(),
      zt()
    ]
  })), Si;
}
var Ci, vt;
function Wt() {
  return vt || (vt = 1, Ci = Jt()), Ci;
}
var Ei, bt;
function Vt() {
  if (bt) return Ei;
  bt = 1;
  const t = j(), i = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), n = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function o(a) {
    return a === null ? !1 : i.exec(a) !== null || n.exec(a) !== null;
  }
  function l(a) {
    let p = 0, m = null, u = i.exec(a);
    if (u === null && (u = n.exec(a)), u === null) throw new Error("Date resolve error");
    const h = +u[1], _ = +u[2] - 1, T = +u[3];
    if (!u[4])
      return new Date(Date.UTC(h, _, T));
    const N = +u[4], J = +u[5], q = +u[6];
    if (u[7]) {
      for (p = u[7].slice(0, 3); p.length < 3; )
        p += "0";
      p = +p;
    }
    if (u[9]) {
      const oe = +u[10], K = +(u[11] || 0);
      m = (oe * 60 + K) * 6e4, u[9] === "-" && (m = -m);
    }
    const V = new Date(Date.UTC(h, _, T, N, J, q, p));
    return m && V.setTime(V.getTime() - m), V;
  }
  function s(a) {
    return a.toISOString();
  }
  return Ei = new t("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: o,
    construct: l,
    instanceOf: Date,
    represent: s
  }), Ei;
}
var Ti, _t;
function Gt() {
  if (_t) return Ti;
  _t = 1;
  const t = j();
  function i(n) {
    return n === "<<" || n === null;
  }
  return Ti = new t("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: i
  }), Ti;
}
var Oi, At;
function Qt() {
  if (At) return Oi;
  At = 1;
  const t = j(), i = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function n(a) {
    if (a === null) return !1;
    let p = 0;
    const m = a.length, u = i;
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
    const p = a.replace(/[\r\n=]/g, ""), m = p.length, u = i;
    let h = 0;
    const _ = [];
    for (let N = 0; N < m; N++)
      N % 4 === 0 && N && (_.push(h >> 16 & 255), _.push(h >> 8 & 255), _.push(h & 255)), h = h << 6 | u.indexOf(p.charAt(N));
    const T = m % 4 * 6;
    return T === 0 ? (_.push(h >> 16 & 255), _.push(h >> 8 & 255), _.push(h & 255)) : T === 18 ? (_.push(h >> 10 & 255), _.push(h >> 2 & 255)) : T === 12 && _.push(h >> 4 & 255), new Uint8Array(_);
  }
  function l(a) {
    let p = "", m = 0;
    const u = a.length, h = i;
    for (let T = 0; T < u; T++)
      T % 3 === 0 && T && (p += h[m >> 18 & 63], p += h[m >> 12 & 63], p += h[m >> 6 & 63], p += h[m & 63]), m = (m << 8) + a[T];
    const _ = u % 3;
    return _ === 0 ? (p += h[m >> 18 & 63], p += h[m >> 12 & 63], p += h[m >> 6 & 63], p += h[m & 63]) : _ === 2 ? (p += h[m >> 10 & 63], p += h[m >> 4 & 63], p += h[m << 2 & 63], p += h[64]) : _ === 1 && (p += h[m >> 2 & 63], p += h[m << 4 & 63], p += h[64], p += h[64]), p;
  }
  function s(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return Oi = new t("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: n,
    construct: o,
    predicate: s,
    represent: l
  }), Oi;
}
var Mi, $t;
function Zt() {
  if ($t) return Mi;
  $t = 1;
  const t = j(), i = Object.prototype.hasOwnProperty, n = Object.prototype.toString;
  function o(s) {
    if (s === null) return !0;
    const a = {}, p = s;
    for (let m = 0, u = p.length; m < u; m += 1) {
      const h = p[m];
      let _ = !1;
      if (n.call(h) !== "[object Object]") return !1;
      let T;
      for (T in h)
        if (i.call(h, T))
          if (!_) _ = !0;
          else return !1;
      if (!_ || i.call(a, T)) return !1;
      Object.defineProperty(a, T, { value: !0 });
    }
    return !0;
  }
  function l(s) {
    return s !== null ? s : [];
  }
  return Mi = new t("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: o,
    construct: l
  }), Mi;
}
var Ri, xt;
function Xt() {
  if (xt) return Ri;
  xt = 1;
  const t = j(), i = Object.prototype.toString;
  function n(l) {
    if (l === null) return !0;
    const s = l, a = new Array(s.length);
    for (let p = 0, m = s.length; p < m; p += 1) {
      const u = s[p];
      if (i.call(u) !== "[object Object]") return !1;
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
  return Ri = new t("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: n,
    construct: o
  }), Ri;
}
var Ni, wt;
function en() {
  if (wt) return Ni;
  wt = 1;
  const t = j(), i = Object.prototype.hasOwnProperty;
  function n(l) {
    if (l === null) return !0;
    const s = l;
    for (const a in s)
      if (i.call(s, a) && s[a] !== null)
        return !1;
    return !0;
  }
  function o(l) {
    return l !== null ? l : {};
  }
  return Ni = new t("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: n,
    construct: o
  }), Ni;
}
var Ii, kt;
function Ki() {
  return kt || (kt = 1, Ii = Wt().extend({
    implicit: [
      Vt(),
      Gt()
    ],
    explicit: [
      Qt(),
      Zt(),
      Xt(),
      en()
    ]
  })), Ii;
}
var St;
function On() {
  if (St) return Ve;
  St = 1;
  const t = Ie(), i = Le(), n = Tn(), o = Ki(), l = Object.prototype.hasOwnProperty, s = 1, a = 2, p = 3, m = 4, u = 1, h = 2, _ = 3, T = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, N = /[\x85\u2028\u2029]/, J = /[,\[\]{}]/, q = /^(?:!|!!|![0-9A-Za-z-]+!)$/, V = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function oe(e) {
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
  function ri(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const c = e | 32;
    return c >= 97 && c <= 102 ? c - 97 + 10 : -1;
  }
  function oi(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function De(e) {
    return e >= 48 && e <= 57 ? e - 48 : -1;
  }
  function be(e) {
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
  function li(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function _e(e, c, g) {
    c === "__proto__" ? Object.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: g
    }) : e[c] = g;
  }
  const Fe = new Array(256), Ae = new Array(256);
  for (let e = 0; e < 256; e++)
    Fe[e] = be(e) ? 1 : 0, Ae[e] = be(e);
  function Y(e, c) {
    this.input = e, this.filename = c.filename || null, this.schema = c.schema || o, this.onWarning = c.onWarning || null, this.legacy = c.legacy || !1, this.json = c.json || !1, this.listener = c.listener || null, this.maxDepth = typeof c.maxDepth == "number" ? c.maxDepth : 100, this.maxTotalMergeKeys = typeof c.maxTotalMergeKeys == "number" ? c.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function Pe(e, c) {
    const g = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return g.snippet = n(g), new i(c, g);
  }
  function C(e, c) {
    throw Pe(e, c);
  }
  function ue(e, c) {
    e.onWarning && e.onWarning.call(null, Pe(e, c));
  }
  function G(e, c, g) {
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
  function si(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function le(e) {
    const c = e.anchorMapTransactions.pop(), g = e.anchorMapTransactions;
    if (g.length === 0) return;
    const b = g[g.length - 1], f = Object.keys(c);
    for (let w = 0, r = f.length; w < r; w += 1) {
      const d = f[w];
      l.call(b, d) || (b[d] = c[d]);
    }
  }
  function ai(e) {
    const c = e.anchorMapTransactions.pop(), g = Object.keys(c);
    for (let b = g.length - 1; b >= 0; b -= 1) {
      const f = c[g[b]];
      f.existed ? e.anchorMap[g[b]] = f.value : delete e.anchorMap[g[b]];
    }
  }
  function $e(e) {
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
  function de(e, c) {
    e.position = c.position, e.line = c.line, e.lineStart = c.lineStart, e.lineIndent = c.lineIndent, e.firstTabInLine = c.firstTabInLine, e.tag = c.tag, e.anchor = c.anchor, e.kind = c.kind, e.result = c.result;
  }
  const qe = {
    YAML: function(c, g, b) {
      c.version !== null && C(c, "duplication of %YAML directive"), b.length !== 1 && C(c, "YAML directive accepts exactly one argument");
      const f = /^([0-9]+)\.([0-9]+)$/.exec(b[0]);
      f === null && C(c, "ill-formed argument of the YAML directive");
      const w = parseInt(f[1], 10), r = parseInt(f[2], 10);
      w !== 1 && C(c, "unacceptable YAML version of the document"), c.version = b[0], c.checkLineBreaks = r < 2, r !== 1 && r !== 2 && ue(c, "unsupported YAML version of the document");
    },
    TAG: function(c, g, b) {
      let f;
      b.length !== 2 && C(c, "TAG directive accepts exactly two arguments");
      const w = b[0];
      f = b[1], q.test(w) || C(c, "ill-formed tag handle (first argument) of the TAG directive"), l.call(c.tagMap, w) && C(c, 'there is a previously declared suffix for "' + w + '" tag handle'), V.test(f) || C(c, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        f = decodeURIComponent(f);
      } catch {
        C(c, "tag prefix is malformed: " + f);
      }
      c.tagMap[w] = f;
    }
  };
  function W(e, c, g, b) {
    if (c < g) {
      const f = e.input.slice(c, g);
      if (b)
        for (let w = 0, r = f.length; w < r; w += 1) {
          const d = f.charCodeAt(w);
          d === 9 || d >= 32 && d <= 1114111 || C(e, "expected valid JSON character");
        }
      else T.test(f) && C(e, "the stream contains non-printable characters");
      e.result += f;
    }
  }
  function te(e, c, g, b) {
    t.isObject(g) || C(e, "cannot merge mappings; the provided source object is unacceptable");
    const f = Object.keys(g);
    for (let w = 0, r = f.length; w < r; w += 1) {
      const d = f[w];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && C(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), l.call(c, d) || (_e(c, d, g[d]), b[d] = !0);
    }
  }
  function Q(e, c, g, b, f, w, r, d, $) {
    if (Array.isArray(f)) {
      f = Array.prototype.slice.call(f);
      for (let y = 0, v = f.length; y < v; y += 1)
        Array.isArray(f[y]) && C(e, "nested arrays are not supported inside keys"), typeof f == "object" && oe(f[y]) === "[object Object]" && (f[y] = "[object Object]");
    }
    if (typeof f == "object" && oe(f) === "[object Object]" && (f = "[object Object]"), f = String(f), c === null && (c = {}), b === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let y = 0, v = w.length; y < v; y += 1)
          te(e, c, w[y], g);
      else
        te(e, c, w, g);
    else
      !e.json && !l.call(g, f) && l.call(c, f) && (e.line = r || e.line, e.lineStart = d || e.lineStart, e.position = $ || e.position, C(e, "duplicated mapping key")), _e(c, f, w), delete g[f];
    return c;
  }
  function pe(e) {
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
        for (pe(e), f = e.input.charCodeAt(e.position), b++, e.lineIndent = 0; f === 32; )
          e.lineIndent++, f = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return g !== -1 && b !== 0 && e.lineIndent < g && ue(e, "deficient indentation"), b;
  }
  function he(e) {
    let c = e.position, g = e.input.charCodeAt(c);
    return !!((g === 45 || g === 46) && g === e.input.charCodeAt(c + 1) && g === e.input.charCodeAt(c + 2) && (c += 3, g = e.input.charCodeAt(c), g === 0 || H(g)));
  }
  function Z(e, c) {
    c === 1 ? e.result += " " : c > 1 && (e.result += t.repeat(`
`, c - 1));
  }
  function Ue(e, c, g) {
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
        if (e.position === e.lineStart && he(e) || g && ie(x))
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
      w && (W(e, b, f, !1), Z(e, e.line - r), b = f = e.position, w = !1), z(x) || (f = e.position + 1), x = e.input.charCodeAt(++e.position);
    }
    return W(e, b, f, !1), e.result ? !0 : (e.kind = y, e.result = v, !1);
  }
  function Ye(e, c) {
    let g, b, f = e.input.charCodeAt(e.position);
    if (f !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, g = b = e.position; (f = e.input.charCodeAt(e.position)) !== 0; )
      if (f === 39)
        if (W(e, g, e.position, !0), f = e.input.charCodeAt(++e.position), f === 39)
          g = e.position, e.position++, b = e.position;
        else
          return !0;
      else K(f) ? (W(e, g, b, !0), Z(e, U(e, !1, c)), g = b = e.position) : e.position === e.lineStart && he(e) ? C(e, "unexpected end of the document within a single quoted scalar") : (e.position++, z(f) || (b = e.position));
    C(e, "unexpected end of the stream within a single quoted scalar");
  }
  function xe(e, c) {
    let g, b, f, w = e.input.charCodeAt(e.position);
    if (w !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, g = b = e.position; (w = e.input.charCodeAt(e.position)) !== 0; ) {
      if (w === 34)
        return W(e, g, e.position, !0), e.position++, !0;
      if (w === 92) {
        if (W(e, g, e.position, !0), w = e.input.charCodeAt(++e.position), K(w))
          U(e, !1, c);
        else if (w < 256 && Fe[w])
          e.result += Ae[w], e.position++;
        else if ((f = oi(w)) > 0) {
          let r = f, d = 0;
          for (; r > 0; r--)
            w = e.input.charCodeAt(++e.position), (f = ri(w)) >= 0 ? d = (d << 4) + f : C(e, "expected hexadecimal character");
          e.result += li(d), e.position++;
        } else
          C(e, "unknown escape sequence");
        g = b = e.position;
      } else K(w) ? (W(e, g, b, !0), Z(e, U(e, !1, c)), g = b = e.position) : e.position === e.lineStart && he(e) ? C(e, "unexpected end of the document within a double quoted scalar") : (e.position++, z(w) || (b = e.position));
    }
    C(e, "unexpected end of the stream within a double quoted scalar");
  }
  function He(e, c) {
    let g = !0, b, f, w;
    const r = e.tag;
    let d;
    const $ = e.anchor;
    let y, v, x, A;
    const S = /* @__PURE__ */ Object.create(null);
    let k, E, M, I = e.input.charCodeAt(e.position);
    if (I === 91)
      y = 93, A = !1, d = [];
    else if (I === 123)
      y = 125, A = !0, d = {};
    else
      return !1;
    for (e.anchor !== null && G(e, e.anchor, d), I = e.input.charCodeAt(++e.position); I !== 0; ) {
      if (U(e, !0, c), I = e.input.charCodeAt(e.position), I === y)
        return e.position++, e.tag = r, e.anchor = $, e.kind = A ? "mapping" : "sequence", e.result = d, !0;
      if (g ? I === 44 && C(e, "expected the node content, but found ','") : C(e, "missed comma between flow collection entries"), E = k = M = null, v = x = !1, I === 63) {
        const F = e.input.charCodeAt(e.position + 1);
        H(F) && (v = x = !0, e.position++, U(e, !0, c));
      }
      b = e.line, f = e.lineStart, w = e.position, ee(e, c, s, !1, !0), E = e.tag, k = e.result, U(e, !0, c), I = e.input.charCodeAt(e.position), (x || e.line === b) && I === 58 && (v = !0, I = e.input.charCodeAt(++e.position), U(e, !0, c), ee(e, c, s, !1, !0), M = e.result), A ? Q(e, d, S, E, k, M, b, f, w) : v ? d.push(Q(e, null, S, E, k, M, b, f, w)) : d.push(k), U(e, !0, c), I = e.input.charCodeAt(e.position), I === 44 ? (g = !0, I = e.input.charCodeAt(++e.position)) : g = !1;
    }
    C(e, "unexpected end of the stream within a flow collection");
  }
  function Be(e, c) {
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
      else if ((y = De(v)) >= 0)
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
      for (pe(e), e.lineIndent = 0, v = e.input.charCodeAt(e.position); (!w || e.lineIndent < r) && v === 32; )
        e.lineIndent++, v = e.input.charCodeAt(++e.position);
      if (!w && e.lineIndent > r && (r = e.lineIndent), K(v)) {
        d++;
        continue;
      }
      if (!w && r === 0 && C(e, "missing indentation for block scalar"), e.lineIndent < r) {
        b === _ ? e.result += t.repeat(`
`, f ? 1 + d : d) : b === u && f && (e.result += `
`);
        break;
      }
      g ? z(v) ? ($ = !0, e.result += t.repeat(`
`, f ? 1 + d : d)) : $ ? ($ = !1, e.result += t.repeat(`
`, d + 1)) : d === 0 ? f && (e.result += " ") : e.result += t.repeat(`
`, d) : e.result += t.repeat(`
`, f ? 1 + d : d), f = !0, w = !0, d = 0;
      const x = e.position;
      for (; !K(v) && v !== 0; )
        v = e.input.charCodeAt(++e.position);
      W(e, x, e.position, !1);
    }
    return !0;
  }
  function X(e, c) {
    const g = e.tag, b = e.anchor, f = [];
    let w = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && G(e, e.anchor, f);
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
      if (ee(e, c, p, !1, !0), f.push(e.result), U(e, !0, -1), r = e.input.charCodeAt(e.position), (e.line === $ || e.lineIndent > c) && r !== 0)
        C(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < c)
        break;
    }
    return w ? (e.tag = g, e.anchor = b, e.kind = "sequence", e.result = f, !0) : !1;
  }
  function je(e, c, g) {
    let b, f, w, r;
    const d = e.tag, $ = e.anchor, y = {}, v = /* @__PURE__ */ Object.create(null);
    let x = null, A = null, S = null, k = !1, E = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && G(e, e.anchor, y);
    let M = e.input.charCodeAt(e.position);
    for (; M !== 0; ) {
      !k && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, C(e, "tab characters must not be used in indentation"));
      const I = e.input.charCodeAt(e.position + 1), F = e.line;
      if ((M === 63 || M === 58) && H(I))
        M === 63 ? (k && (Q(e, y, v, x, A, null, f, w, r), x = A = S = null), E = !0, k = !0, b = !0) : k ? (k = !1, b = !0) : C(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, M = I;
      else {
        if (f = e.line, w = e.lineStart, r = e.position, !ee(e, g, a, !1, !0))
          break;
        if (e.line === F) {
          for (M = e.input.charCodeAt(e.position); z(M); )
            M = e.input.charCodeAt(++e.position);
          if (M === 58)
            M = e.input.charCodeAt(++e.position), H(M) || C(e, "a whitespace character is expected after the key-value separator within a block mapping"), k && (Q(e, y, v, x, A, null, f, w, r), x = A = S = null), E = !0, k = !1, b = !1, x = e.tag, A = e.result;
          else if (E)
            C(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = d, e.anchor = $, !0;
        } else if (E)
          C(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = d, e.anchor = $, !0;
      }
      if ((e.line === F || e.lineIndent > c) && (k && (f = e.line, w = e.lineStart, r = e.position), ee(e, c, m, !0, b) && (k ? A = e.result : S = e.result), k || (Q(e, y, v, x, A, S, f, w, r), x = A = S = null), U(e, !0, -1), M = e.input.charCodeAt(e.position)), (e.line === F || e.lineIndent > c) && M !== 0)
        C(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < c)
        break;
    }
    return k && Q(e, y, v, x, A, null, f, w, r), E && (e.tag = d, e.anchor = $, e.kind = "mapping", e.result = y), E;
  }
  function ci(e) {
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
      f = e.input.slice(r, e.position), J.test(f) && C(e, "tag suffix cannot contain flow indicator characters");
    }
    f && !V.test(f) && C(e, "tag name cannot contain such characters: " + f);
    try {
      f = decodeURIComponent(f);
    } catch {
      C(e, "tag name is malformed: " + f);
    }
    return c ? e.tag = f : l.call(e.tagMap, b) ? e.tag = e.tagMap[b] + f : b === "!" ? e.tag = "!" + f : b === "!!" ? e.tag = "tag:yaml.org,2002:" + f : C(e, 'undeclared tag handle "' + b + '"'), !0;
  }
  function Ke(e) {
    let c = e.input.charCodeAt(e.position);
    if (c !== 38) return !1;
    e.anchor !== null && C(e, "duplication of an anchor property"), c = e.input.charCodeAt(++e.position);
    const g = e.position;
    for (; c !== 0 && !H(c) && !ie(c); )
      c = e.input.charCodeAt(++e.position);
    return e.position === g && C(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(g, e.position), !0;
  }
  function ze(e) {
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
  function ui(e, c, g, b) {
    const f = $e(e);
    return si(e), de(e, c), e.tag = null, e.anchor = null, e.kind = null, e.result = null, je(e, g, b) && e.kind === "mapping" ? (le(e), !0) : (ai(e), de(e, f), !1);
  }
  function ee(e, c, g, b, f) {
    let w, r, d = 1, $ = !1, y = !1, v = null, x, A, S;
    e.depth >= e.maxDepth && C(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const k = w = r = m === g || p === g;
    if (b && U(e, !0, -1) && ($ = !0, e.lineIndent > c ? d = 1 : e.lineIndent === c ? d = 0 : e.lineIndent < c && (d = -1)), d === 1)
      for (; ; ) {
        const E = e.input.charCodeAt(e.position), M = $e(e);
        if ($ && (E === 33 && e.tag !== null || E === 38 && e.anchor !== null) || !ci(e) && !Ke(e))
          break;
        v === null && (v = M), U(e, !0, -1) ? ($ = !0, r = k, e.lineIndent > c ? d = 1 : e.lineIndent === c ? d = 0 : e.lineIndent < c && (d = -1)) : r = !1;
      }
    if (r && (r = $ || f), d === 1 || m === g)
      if (s === g || a === g ? A = c : A = c + 1, S = e.position - e.lineStart, d === 1)
        if (r && (X(e, S) || je(e, S, A)) || He(e, A))
          y = !0;
        else {
          const E = e.input.charCodeAt(e.position);
          v !== null && k && !r && E !== 124 && E !== 62 && ui(
            e,
            v,
            v.position - v.lineStart,
            A
          ) || w && Be(e, A) || Ye(e, A) || xe(e, A) ? y = !0 : ze(e) ? (y = !0, (e.tag !== null || e.anchor !== null) && C(e, "alias node should not have any properties")) : Ue(e, A, s === g) && (y = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && G(e, e.anchor, e.result);
        }
      else d === 0 && (y = r && X(e, S));
    if (e.tag === null)
      e.anchor !== null && G(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && C(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let E = 0, M = e.implicitTypes.length; E < M; E += 1)
        if (x = e.implicitTypes[E], x.resolve(e.result)) {
          e.result = x.construct(e.result), e.tag = x.tag, e.anchor !== null && G(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (l.call(e.typeMap[e.kind || "fallback"], e.tag))
        x = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        x = null;
        const E = e.typeMap.multi[e.kind || "fallback"];
        for (let M = 0, I = E.length; M < I; M += 1)
          if (e.tag.slice(0, E[M].tag.length) === E[M].tag) {
            x = E[M];
            break;
          }
      }
      x || C(e, "unknown tag !<" + e.tag + ">"), e.result !== null && x.kind !== e.kind && C(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + x.kind + '", not "' + e.kind + '"'), x.resolve(e.result, e.tag) ? (e.result = x.construct(e.result, e.tag), e.anchor !== null && G(e, e.anchor, e.result)) : C(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || y;
  }
  function di(e) {
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
      b !== 0 && pe(e), l.call(qe, w) ? qe[w](e, w, r) : ue(e, 'unknown document directive "' + w + '"');
    }
    if (U(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, U(e, !0, -1)) : g && C(e, "directives end mark is expected"), ee(e, e.lineIndent - 1, m, !1, !0), U(e, !0, -1), e.checkLineBreaks && N.test(e.input.slice(c, e.position)) && ue(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && he(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, U(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && C(e, "end of the stream or a document separator is expected");
  }
  function Je(e, c) {
    e = String(e), c = c || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const g = new Y(e, c), b = e.indexOf("\0");
    for (b !== -1 && (g.position = b, C(g, "null byte is not allowed in input")), g.input += "\0"; g.input.charCodeAt(g.position) === 32; )
      g.lineIndent += 1, g.position += 1;
    for (; g.position < g.length - 1; )
      di(g);
    return g.documents;
  }
  function We(e, c, g) {
    c !== null && typeof c == "object" && typeof g > "u" && (g = c, c = null);
    const b = Je(e, g);
    if (typeof c != "function")
      return b;
    for (let f = 0, w = b.length; f < w; f += 1)
      c(b[f]);
  }
  function pi(e, c) {
    const g = Je(e, c);
    if (g.length !== 0) {
      if (g.length === 1)
        return g[0];
      throw new i("expected a single document in the stream, but found more");
    }
  }
  return Ve.loadAll = We, Ve.load = pi, Ve;
}
var Li = {}, Ct;
function Mn() {
  if (Ct) return Li;
  Ct = 1;
  const t = Ie(), i = Le(), n = Ki(), o = Object.prototype.toString, l = Object.prototype.hasOwnProperty, s = 65279, a = 9, p = 10, m = 13, u = 32, h = 33, _ = 34, T = 35, N = 37, J = 38, q = 39, V = 42, oe = 44, K = 45, z = 58, H = 61, ie = 62, ri = 63, oi = 64, De = 91, be = 93, li = 96, _e = 123, Fe = 124, Ae = 125, Y = {};
  Y[0] = "\\0", Y[7] = "\\a", Y[8] = "\\b", Y[9] = "\\t", Y[10] = "\\n", Y[11] = "\\v", Y[12] = "\\f", Y[13] = "\\r", Y[27] = "\\e", Y[34] = '\\"', Y[92] = "\\\\", Y[133] = "\\N", Y[160] = "\\_", Y[8232] = "\\L", Y[8233] = "\\P";
  const Pe = [
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
  function ue(r, d) {
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
  function G(r) {
    let d, $;
    const y = r.toString(16).toUpperCase();
    if (r <= 255)
      d = "x", $ = 2;
    else if (r <= 65535)
      d = "u", $ = 4;
    else if (r <= 4294967295)
      d = "U", $ = 8;
    else
      throw new i("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + d + t.repeat("0", $ - y.length) + y;
  }
  const si = 1, le = 2;
  function ai(r) {
    this.schema = r.schema || n, this.indent = Math.max(1, r.indent || 2), this.noArrayIndent = r.noArrayIndent || !1, this.skipInvalid = r.skipInvalid || !1, this.flowLevel = t.isNothing(r.flowLevel) ? -1 : r.flowLevel, this.styleMap = ue(this.schema, r.styles || null), this.sortKeys = r.sortKeys || !1, this.lineWidth = r.lineWidth || 80, this.noRefs = r.noRefs || !1, this.noCompatMode = r.noCompatMode || !1, this.condenseFlow = r.condenseFlow || !1, this.quotingType = r.quotingType === '"' ? le : si, this.forceQuotes = r.forceQuotes || !1, this.replacer = typeof r.replacer == "function" ? r.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function $e(r, d) {
    const $ = t.repeat(" ", d);
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
  function de(r, d) {
    return `
` + t.repeat(" ", r.indent * d);
  }
  function qe(r, d) {
    for (let $ = 0, y = r.implicitTypes.length; $ < y; $ += 1)
      if (r.implicitTypes[$].resolve(d))
        return !0;
    return !1;
  }
  function W(r) {
    return r === u || r === a;
  }
  function te(r) {
    return r >= 32 && r <= 126 || r >= 161 && r <= 55295 && r !== 8232 && r !== 8233 || r >= 57344 && r <= 65533 && r !== s || r >= 65536 && r <= 1114111;
  }
  function Q(r) {
    return te(r) && r !== s && // - b-char
    r !== m && r !== p;
  }
  function pe(r, d, $) {
    const y = Q(r), v = y && !W(r);
    return (
      // ns-plain-safe
      ($ ? y : y && // - c-flow-indicator
      r !== oe && r !== De && r !== be && r !== _e && r !== Ae) && // ns-plain-char
      r !== T && // false on '#'
      !(d === z && !v) || // false on ': '
      Q(d) && !W(d) && r === T || // change to true on '[^ ]#'
      d === z && v
    );
  }
  function U(r) {
    return te(r) && r !== s && !W(r) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    r !== K && r !== ri && r !== z && r !== oe && r !== De && r !== be && r !== _e && r !== Ae && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    r !== T && r !== J && r !== V && r !== h && r !== Fe && r !== H && r !== ie && r !== q && r !== _ && // | “%” | “@” | “`”)
    r !== N && r !== oi && r !== li;
  }
  function he(r) {
    return !W(r) && r !== z;
  }
  function Z(r, d) {
    const $ = r.charCodeAt(d);
    let y;
    return $ >= 55296 && $ <= 56319 && d + 1 < r.length && (y = r.charCodeAt(d + 1), y >= 56320 && y <= 57343) ? ($ - 55296) * 1024 + y - 56320 + 65536 : $;
  }
  function Ue(r) {
    return /^\n* /.test(r);
  }
  const Ye = 1, xe = 2, He = 3, Be = 4, X = 5;
  function je(r, d, $, y, v, x, A, S) {
    let k, E = 0, M = null, I = !1, F = !1;
    const zi = y !== -1;
    let we = -1, ke = U(Z(r, 0)) && he(Z(r, r.length - 1));
    if (d || A)
      for (k = 0; k < r.length; E >= 65536 ? k += 2 : k++) {
        if (E = Z(r, k), !te(E))
          return X;
        ke = ke && pe(E, M, S), M = E;
      }
    else {
      for (k = 0; k < r.length; E >= 65536 ? k += 2 : k++) {
        if (E = Z(r, k), E === p)
          I = !0, zi && (F = F || // Foldable line = too long, and not more-indented.
          k - we - 1 > y && r[we + 1] !== " ", we = k);
        else if (!te(E))
          return X;
        ke = ke && pe(E, M, S), M = E;
      }
      F = F || zi && k - we - 1 > y && r[we + 1] !== " ";
    }
    return !I && !F ? ke && !A && !v(r) ? Ye : x === le ? X : xe : $ > 9 && Ue(r) ? X : A ? x === le ? X : xe : F ? Be : He;
  }
  function ci(r, d, $, y, v) {
    r.dump = (function() {
      if (d.length === 0)
        return r.quotingType === le ? '""' : "''";
      if (!r.noCompatMode && (Pe.indexOf(d) !== -1 || C.test(d)))
        return r.quotingType === le ? '"' + d + '"' : "'" + d + "'";
      const x = r.indent * Math.max(1, $), A = r.lineWidth === -1 ? -1 : Math.max(Math.min(r.lineWidth, 40), r.lineWidth - x), S = y || // No block styles in flow mode.
      r.flowLevel > -1 && $ >= r.flowLevel;
      function k(E) {
        return qe(r, E);
      }
      switch (je(
        d,
        S,
        r.indent,
        A,
        k,
        r.quotingType,
        r.forceQuotes && !y,
        v
      )) {
        case Ye:
          return d;
        case xe:
          return "'" + d.replace(/'/g, "''") + "'";
        case He:
          return "|" + Ke(d, r.indent) + ze($e(d, x));
        case Be:
          return ">" + Ke(d, r.indent) + ze($e(ui(d, A), x));
        case X:
          return '"' + di(d) + '"';
        default:
          throw new i("impossible error: invalid scalar style");
      }
    })();
  }
  function Ke(r, d) {
    const $ = Ue(r) ? String(d) : "", y = r[r.length - 1] === `
`, x = y && (r[r.length - 2] === `
` || r === `
`) ? "+" : y ? "" : "-";
    return $ + x + `
`;
  }
  function ze(r) {
    return r[r.length - 1] === `
` ? r.slice(0, -1) : r;
  }
  function ui(r, d) {
    const $ = /(\n+)([^\n]*)/g;
    let y = (function() {
      let S = r.indexOf(`
`);
      return S = S !== -1 ? S : r.length, $.lastIndex = S, ee(r.slice(0, S), d);
    })(), v = r[0] === `
` || r[0] === " ", x, A;
    for (; A = $.exec(r); ) {
      const S = A[1], k = A[2];
      x = k[0] === " ", y += S + (!v && !x && k !== "" ? `
` : "") + ee(k, d), v = x;
    }
    return y;
  }
  function ee(r, d) {
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
  function di(r) {
    let d = "", $ = 0;
    for (let y = 0; y < r.length; $ >= 65536 ? y += 2 : y++) {
      $ = Z(r, y);
      const v = Y[$];
      !v && te($) ? (d += r[y], $ >= 65536 && (d += r[y + 1])) : d += v || G($);
    }
    return d;
  }
  function Je(r, d, $) {
    let y = "";
    const v = r.tag;
    for (let x = 0, A = $.length; x < A; x += 1) {
      let S = $[x];
      r.replacer && (S = r.replacer.call($, String(x), S)), (g(r, d, S, !1, !1) || typeof S > "u" && g(r, d, null, !1, !1)) && (y !== "" && (y += "," + (r.condenseFlow ? "" : " ")), y += r.dump);
    }
    r.tag = v, r.dump = "[" + y + "]";
  }
  function We(r, d, $, y) {
    let v = "";
    const x = r.tag;
    for (let A = 0, S = $.length; A < S; A += 1) {
      let k = $[A];
      r.replacer && (k = r.replacer.call($, String(A), k)), (g(r, d + 1, k, !0, !0, !1, !0) || typeof k > "u" && g(r, d + 1, null, !0, !0, !1, !0)) && ((!y || v !== "") && (v += de(r, d)), r.dump && p === r.dump.charCodeAt(0) ? v += "-" : v += "- ", v += r.dump);
    }
    r.tag = x, r.dump = v || "[]";
  }
  function pi(r, d, $) {
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
      throw new i("sortKeys must be a boolean or a function");
    for (let S = 0, k = A.length; S < k; S += 1) {
      let E = "";
      (!y || v !== "") && (E += de(r, d));
      const M = A[S];
      let I = $[M];
      if (r.replacer && (I = r.replacer.call($, M, I)), !g(r, d + 1, M, !0, !0, !0))
        continue;
      const F = r.tag !== null && r.tag !== "?" || r.dump && r.dump.length > 1024;
      F && (r.dump && p === r.dump.charCodeAt(0) ? E += "?" : E += "? "), E += r.dump, F && (E += de(r, d)), g(r, d + 1, I, !0, F) && (r.dump && p === r.dump.charCodeAt(0) ? E += ":" : E += ": ", E += r.dump, v += E);
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
            throw new i("!<" + A.tag + '> tag resolver accepts not "' + S + '" style');
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
    let M, I;
    if (E && (M = r.duplicates.indexOf($), I = M !== -1), (r.tag !== null && r.tag !== "?" || I || r.indent !== 2 && d > 0) && (v = !1), I && r.usedDuplicates[M])
      r.dump = "*ref_" + M;
    else {
      if (E && I && !r.usedDuplicates[M] && (r.usedDuplicates[M] = !0), S === "[object Object]")
        y && Object.keys(r.dump).length !== 0 ? (e(r, d, r.dump, v), I && (r.dump = "&ref_" + M + r.dump)) : (pi(r, d, r.dump), I && (r.dump = "&ref_" + M + " " + r.dump));
      else if (S === "[object Array]")
        y && r.dump.length !== 0 ? (r.noArrayIndent && !A && d > 0 ? We(r, d - 1, r.dump, v) : We(r, d, r.dump, v), I && (r.dump = "&ref_" + M + r.dump)) : (Je(r, d, r.dump), I && (r.dump = "&ref_" + M + " " + r.dump));
      else if (S === "[object String]")
        r.tag !== "?" && ci(r, r.dump, d, x, k);
      else {
        if (S === "[object Undefined]")
          return !1;
        if (r.skipInvalid) return !1;
        throw new i("unacceptable kind of an object to dump " + S);
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
    const $ = new ai(d);
    $.noRefs || b(r, $);
    let y = r;
    return $.replacer && (y = $.replacer.call({ "": y }, "", y)), g($, 0, y, !0, !0) ? $.dump + `
` : "";
  }
  return Li.dump = w, Li;
}
var Et;
function Rn() {
  if (Et) return B;
  Et = 1;
  const t = On(), i = Mn();
  function n(o, l) {
    return function() {
      throw new Error("Function yaml." + o + " is removed in js-yaml 4. Use yaml." + l + " instead, which is now safe by default.");
    };
  }
  return B.Type = j(), B.Schema = Pt(), B.FAILSAFE_SCHEMA = Ht(), B.JSON_SCHEMA = Jt(), B.CORE_SCHEMA = Wt(), B.DEFAULT_SCHEMA = Ki(), B.load = t.load, B.loadAll = t.loadAll, B.dump = i.dump, B.YAMLException = Le(), B.types = {
    binary: Qt(),
    float: zt(),
    map: Yt(),
    null: Bt(),
    pairs: Xt(),
    set: en(),
    timestamp: Vt(),
    bool: jt(),
    int: Kt(),
    merge: Gt(),
    omap: Zt(),
    seq: Ut(),
    str: qt()
  }, B.safeLoad = n("safeLoad", "load"), B.safeLoadAll = n("safeLoadAll", "loadAll"), B.safeDump = n("safeDump", "dump"), B;
}
var Nn = Rn();
const In = /* @__PURE__ */ En(Nn), {
  Type: Zn,
  Schema: Xn,
  FAILSAFE_SCHEMA: er,
  JSON_SCHEMA: ir,
  CORE_SCHEMA: tr,
  DEFAULT_SCHEMA: nr,
  load: Ge,
  loadAll: rr,
  dump: fe,
  YAMLException: or,
  types: lr,
  safeLoad: sr,
  safeLoadAll: ar,
  safeDump: cr
} = In, ni = (t, i, n = {}) => t.callWS({ type: `deferred_actions/${i}`, data: n }), Ln = (t) => ni(t, "list", { limit: 1e3 }), Dn = (t, i) => ni(t, "create", i), Fn = (t, i) => t.callService("deferred_actions", "run_for", i, void 0, !0, !0), Pn = (t, i) => ni(t, "update", i), qn = (t, i, n, o = {}) => ni(t, i, { job_id: n, ...o }), Un = (t, i) => t.connection.subscribeMessage(i, { type: "deferred_actions/subscribe" }), Pi = (t) => {
  if (t !== void 0) {
    if (typeof t == "string") return [t];
    if (Array.isArray(t) && t.every((i) => typeof i == "string")) return [...t];
  }
}, ge = (t, i) => Object.keys(t).every((n) => i.includes(n)), Tt = (t) => {
  const i = [];
  for (const n of t) {
    if (!n || typeof n != "object" || Array.isArray(n) || !ge(n, ["action", "service", "target", "data"])) return;
    const o = typeof n.action == "string" ? n.action : typeof n.service == "string" ? n.service : void 0;
    if (!o || n.action !== void 0 && n.service !== void 0) return;
    const l = n.target ?? {};
    if (!l || typeof l != "object" || Array.isArray(l)) return;
    const s = l;
    if (!ge(s, ["entity_id", "device_id", "area_id", "floor_id", "label_id"])) return;
    const a = {};
    for (const h of ["entity_id", "device_id", "area_id", "floor_id", "label_id"]) {
      const _ = Pi(s[h]);
      if (s[h] !== void 0 && !_) return;
      _?.length && (a[h] = _);
    }
    const p = n.data ?? {};
    if (!p || typeof p != "object" || Array.isArray(p)) return;
    const m = Object.entries(p);
    if (m.some(([, h]) => h !== null && !["string", "number", "boolean"].includes(typeof h))) return;
    const u = ["entity_id", "device_id", "area_id", "floor_id", "label_id"].filter((h) => typeof s[h] == "string");
    i.push({ action: o, syntax: n.service !== void 0 ? "service" : "action", target: a, scalarTargets: u, data: m.map(([h, _]) => ({ key: h, value: _ })) });
  }
  return i;
}, Qe = (t) => t.map((i) => {
  const n = Object.fromEntries(Object.entries(i.target).filter(([, l]) => l?.length).map(([l, s]) => [l, i.scalarTargets?.includes(l) && Array.isArray(s) && s.length === 1 ? s[0] : s])), o = Object.fromEntries(i.data.filter((l) => l.key.trim()).map((l) => [l.key.trim(), l.value]));
  return {
    [i.syntax ?? "action"]: i.action,
    ...Object.keys(n).length ? { target: n } : {},
    ...Object.keys(o).length ? { data: o } : {}
  };
}), Yn = (t) => {
  if (t.condition === "state" && ge(t, ["condition", "entity_id", "state"]) && typeof t.entity_id == "string" && typeof t.state == "string")
    return { type: "state", entity_id: t.entity_id, state: t.state };
  if (t.condition === "numeric_state" && ge(t, ["condition", "entity_id", "above", "below"]) && typeof t.entity_id == "string")
    return t.above !== void 0 && typeof t.above != "number" || t.below !== void 0 && typeof t.below != "number" ? void 0 : { type: "numeric_state", entity_id: t.entity_id, above: t.above === void 0 ? "" : String(t.above), below: t.below === void 0 ? "" : String(t.below) };
  if (t.condition === "time" && ge(t, ["condition", "after", "before", "weekday"])) {
    if (t.after !== void 0 && typeof t.after != "string" || t.before !== void 0 && typeof t.before != "string") return;
    const i = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
    if ([t.after, t.before].some((o) => typeof o == "string" && !i.test(o))) return;
    const n = Pi(t.weekday) ?? [];
    return t.weekday !== void 0 && !Pi(t.weekday) ? void 0 : { type: "time", after: String(t.after ?? ""), before: String(t.before ?? ""), weekdays: n, weekdayScalar: typeof t.weekday == "string" };
  }
}, Ot = (t) => {
  let i = "and", n = t, o = !1;
  if (t.length === 1 && ["and", "or"].includes(String(t[0]?.condition))) {
    const s = t[0];
    if (!ge(s, ["condition", "conditions"]) || !Array.isArray(s.conditions) || s.conditions.length === 0) return;
    i = s.condition, o = !0, n = s.conditions;
  }
  const l = n.map(Yn);
  return l.every(Boolean) ? { operator: i, items: l, grouped: o } : void 0;
}, Mt = (t) => {
  const i = t.items.map((n) => n.type === "state" ? { condition: "state", entity_id: n.entity_id, state: n.state } : n.type === "numeric_state" ? {
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
  return (t.operator === "or" || t.grouped) && i.length ? [{ condition: t.operator, conditions: i }] : i;
}, Hn = (t) => {
  const i = t.trim();
  return i === "true" ? !0 : i === "false" ? !1 : i === "null" ? null : i !== "" && Number.isFinite(Number(i)) ? Number(i) : t;
}, Bn = (t) => {
  const i = t instanceof Error ? t.message : String(t), n = i.toLowerCase();
  return n.includes("expected_revision") || n.includes("revision") || n.includes("conflict") ? { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details: i } : n.includes("permission") || n.includes("unauthorized") || n.includes("admin") ? { message: "You need administrator access to manage deferred actions.", details: i } : n.includes("valid_until") ? { message: "‘Don’t run after’ must be later than the scheduled time.", details: i } : n.includes("condition") ? { message: "One or more conditions are incomplete or invalid.", details: i } : n.includes("sequence") || n.includes("action") ? { message: "The action sequence is incomplete or invalid.", details: i } : { message: "Home Assistant couldn’t save this deferred action.", details: i };
};
function Di(t, i = Date.now()) {
  const n = Math.round((new Date(t).getTime() - i) / 1e3), o = Math.abs(n), [l, s] = o >= 86400 ? [Math.round(o / 86400), "day"] : o >= 3600 ? [Math.round(o / 3600), "hour"] : o >= 60 ? [Math.round(o / 60), "minute"] : [o, "second"];
  return `${n < 0 ? "overdue by" : "in"} ${l} ${s}${l === 1 ? "" : "s"}`;
}
const Ce = (t) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short"
}).format(new Date(t)), jn = [5, 15, 30, 60], Fi = (t) => t?.explicit_target_entities ?? [], Kn = (t) => ["completed", "cancelled", "missed", "skipped", "expired"].includes(t), zn = (t) => {
  const i = t.overdue_policy ? "job override" : "inherited";
  return t.effective_overdue_policy === "execute_within_grace" ? `Run only if less than ${t.effective_overdue_grace_minutes} minutes late (${i})` : `${t.effective_overdue_policy === "execute" ? "Run when Home Assistant comes back" : "Don’t run"} (${i})`;
};
var Jn = Object.defineProperty, Wn = Object.getOwnPropertyDescriptor, D = (t, i, n, o) => {
  for (var l = o > 1 ? void 0 : o ? Wn(i, n) : i, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (l = (o ? a(i, n, l) : a(l)) || l);
  return o && l && Jn(i, n, l), l;
};
const Vn = {
  "light.turn_on": "light.turn_off",
  "switch.turn_on": "switch.turn_off",
  "fan.turn_on": "fan.turn_off",
  "input_boolean.turn_on": "input_boolean.turn_off",
  "media_player.media_play": "media_player.media_pause"
};
let L = class extends Te {
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
    await this.refresh(), this.unsubscribe = await Un(this.hass, (t) => this.handlePush(t));
  }
  async refresh() {
    try {
      const t = await Ln(this.hass);
      this.jobs = t.jobs, this.recalculate();
    } catch (t) {
      this.setError(t);
    }
  }
  handlePush(t) {
    if (t.event === "queue_summary" && t.summary && (this.summary = t.summary), t.event === "job_deleted" && t.job_id) this.jobs = this.jobs.filter((i) => i.id !== t.job_id);
    else if (t.job) {
      const i = this.jobs.findIndex((n) => n.id === t.job?.id);
      this.jobs = i < 0 ? [...this.jobs, t.job] : this.jobs.map((n) => n.id === t.job?.id ? t.job : n), this.selected?.id === t.job.id && (this.selected = t.job);
    }
    this.recalculate();
  }
  recalculate() {
    const t = this.jobs.filter((i) => i.status === "pending").sort((i, n) => i.execute_at.localeCompare(n.execute_at));
    this.summary = {
      pending: t.length,
      paused: this.jobs.filter((i) => i.status === "paused").length,
      failed: this.jobs.filter((i) => i.status === "failed").length,
      next_job_name: t[0]?.name,
      next_execution_local: t[0]?.execute_at_local
    };
  }
  visibleJobs() {
    return this.jobs.filter((t) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(t.status) || this.tab === "Paused" && t.status === "paused" || this.tab === "Failed" && t.status === "failed" || this.tab === "History" && Kn(t.status)).sort((t, i) => t.execute_at.localeCompare(i.execute_at));
  }
  async operate(t, i, n = {}) {
    if (this.menuJobId = void 0, ["cancel", "delete", "execute_now"].includes(t)) {
      this.confirmAction = { operation: t, job: i };
      return;
    }
    await this.performOperation(t, i, n);
  }
  async performOperation(t, i, n = {}) {
    this.busy = !0, this.error = void 0, this.errorDetails = void 0;
    try {
      await qn(this.hass, t, i.id, n), t === "delete" && (this.selected = void 0);
    } catch (o) {
      this.setError(o);
    } finally {
      this.busy = !1;
    }
  }
  setError(t) {
    const i = Bn(t);
    this.error = i.message, this.errorDetails = i.details === i.message ? void 0 : i.details;
  }
  openEditor(t) {
    const i = t?.sequence ?? [{ action: "light.turn_off", target: {} }], n = Tt(i);
    this.visualActions = n ?? [], this.actionYaml = fe(i, { noRefs: !0 });
    const o = Ot(t?.conditions ?? []);
    this.visualConditions = o ?? { operator: "and", items: [] }, this.conditionMode = o ? "visual" : "yaml", this.conditionsYaml = t?.conditions.length ? fe(t.conditions, { noRefs: !0 }) : "", this.scheduleMode = "delay", this.creationKind = "later", this.jobKey = t?.job_key ?? "", this.previewDelay = 20, this.previewUnit = "minutes", this.editor = { job: t, mode: n ? "visual" : "yaml" }, this.menuJobId = void 0, this.error = void 0, this.errorDetails = void 0;
  }
  openRunFor() {
    this.openEditor(), this.creationKind = "run_for";
  }
  primaryOperation(t) {
    if (t.status === "pending") return { label: "Pause", icon: "mdi:pause", operation: "pause" };
    if (t.status === "paused") return { label: "Resume", icon: "mdi:play", operation: "resume" };
    if (["failed", "missed"].includes(t.status)) return { label: "Run now", icon: "mdi:play", operation: "execute_now" };
    if (["completed", "cancelled", "skipped", "expired"].includes(t.status)) return { label: "Duplicate", icon: "mdi:content-copy", operation: "duplicate" };
  }
  renderMenu(t) {
    return this.menuJobId !== t.id ? R : O`<div class="menu" @click=${(i) => i.stopPropagation()}>
      <button @click=${() => {
      this.selected = t, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:information-outline"></ha-icon>View details</button>
      ${["pending", "paused"].includes(t.status) ? O`
        <button @click=${() => this.openEditor(t)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit</button>
        <button @click=${() => {
      this.quickDialog = { job: t, kind: "reschedule" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:calendar-clock"></ha-icon>Reschedule</button>
        ${t.status === "pending" ? O`<button @click=${() => {
      this.quickDialog = { job: t, kind: "snooze" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Snooze</button>` : O`<button @click=${() => {
      this.quickDialog = { job: t, kind: "extend" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Extend</button>`}` : R}
      ${["pending", "paused", "failed", "missed"].includes(t.status) ? O`<button @click=${() => this.operate("execute_now", t)}><ha-icon icon="mdi:play"></ha-icon>Run now</button>` : R}
      <button @click=${() => {
      this.quickDialog = { job: t, kind: "duplicate" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:content-copy"></ha-icon>Duplicate</button>
      ${["pending", "paused"].includes(t.status) ? O`<button class="warning" @click=${() => this.operate("cancel", t)}><ha-icon icon="mdi:cancel"></ha-icon>Cancel</button>` : R}
      ${t.status !== "executing" ? O`<button class="danger" @click=${() => this.operate("delete", t)}><ha-icon icon="mdi:delete-outline"></ha-icon>Delete</button>` : R}
    </div>`;
  }
  renderJob(t) {
    const i = this.primaryOperation(t);
    return O`<article class="job" @click=${() => {
      this.selected = t;
    }}>
      <div class="job-icon"><ha-icon icon=${t.status === "failed" ? "mdi:alert-circle-outline" : "mdi:clock-outline"}></ha-icon></div>
      <div class="job-body">
        <div class="job-head"><h3>${t.name}</h3>${t.status !== "pending" ? O`<span class="status ${t.status}">${t.status}</span>` : R}</div>
        <div class="time">${Ce(t.execute_at_local)} · ${Di(t.execute_at)}</div>
        <p>${t.action_summary}</p>
        ${t.terminal_reason ? O`<p class="compact">${t.terminal_reason}</p>` : R}
        ${t.last_error ? O`<div class="error compact">${t.last_error}</div>` : R}
      </div>
      <div class="row-actions" @click=${(n) => n.stopPropagation()}>
        ${i ? O`<button class="quiet" @click=${() => i.operation === "duplicate" ? this.quickDialog = { job: t, kind: "duplicate" } : this.operate(i.operation, t)}><ha-icon icon=${i.icon}></ha-icon>${i.label}</button>` : R}
        <div class="menu-wrap"><button class="icon" title="More actions" @click=${() => {
      this.menuJobId = this.menuJobId === t.id ? void 0 : t.id;
    }}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>${this.renderMenu(t)}</div>
      </div>
    </article>`;
  }
  renderDetails(t) {
    return O`<div class="overlay" @click=${() => {
      this.selected = void 0;
    }}><section class="dialog wide" @click=${(i) => i.stopPropagation()}>
      <header><div><h2>${t.name}</h2><span class="status ${t.status}">${t.status}</span></div><button class="icon" title="Close" @click=${() => {
      this.selected = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <section class="detail-summary"><div><span>Scheduled</span><strong>${Ce(t.execute_at_local)}</strong><small>${Di(t.execute_at)}</small></div><div><span>Action</span><strong>${t.action_summary}</strong></div></section>
      ${t.description ? O`<p>${t.description}</p>` : R}
      <div class="detail-actions">
        ${["pending", "paused"].includes(t.status) ? O`<button class="primary" @click=${() => this.openEditor(t)}>Edit action</button><button @click=${() => {
      this.quickDialog = { job: t, kind: "reschedule" };
    }}>Change time</button>` : R}
      </div>
      ${t.status === "pending" ? O`<div class="snooze"><span>Snooze</span><div class="chips">${jn.map((i) => O`<button @click=${() => this.operate("snooze", t, { duration: { minutes: i } })}>+${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => {
      this.quickDialog = { job: t, kind: "snooze" };
    }}>Custom</button></div>` : R}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
      "Job ID": t.id,
      Status: t.status,
      "Scheduled UTC": t.execute_at,
      "Don’t run after": t.valid_until_local ? `${Ce(t.valid_until_local)} (${t.valid_until})` : "—",
      Conditions: t.has_conditions ? `Yes — ${t.condition_failure === "skip" ? "skip this run" : t.condition_failure === "cancel" ? "cancel the action" : "mark as failed"} if not met` : "None",
      "Overdue behavior": zn(t),
      Created: t.created_at,
      Modified: t.modified_at,
      Completed: t.completed_at || "—",
      Source: t.source,
      "Job key": t.job_key || "—",
      Tags: t.tags.join(", ") || "—",
      "Resolved targets": t.target_entities.join(", ") || "—",
      "Resolution hints": Fi(t).join(", ") || "—",
      Revision: String(t.revision),
      "Terminal reason": t.terminal_reason || "—",
      "Last error": t.last_error || "—"
    }).map(([i, n]) => O`<dt>${i}</dt><dd>${n}</dd>`)}
      </dl></details>
      <details><summary>Action sequence YAML</summary><pre>${fe(t.sequence, { noRefs: !0 })}</pre></details>
      ${t.has_conditions ? O`<details><summary>Execution conditions YAML</summary><pre>${fe(t.conditions, { noRefs: !0 })}</pre></details>` : R}
      <details><summary>Attribution and diagnostics</summary><pre>${JSON.stringify(t.attribution, null, 2)}</pre>${Object.keys(t.linkage).length ? O`<pre>${JSON.stringify(t.linkage, null, 2)}</pre>` : R}</details>
    </section></div>`;
  }
  renderEditor() {
    const t = this.editor?.job, i = !t && this.creationKind === "run_for";
    return O`<div class="overlay"><form class="dialog wide" @submit=${(n) => this.saveEditor(n)}>
      <header><h2>${t ? "Edit deferred action" : i ? "Run something for a while" : "Do something later"}</h2><button type="button" class="icon" title="Close" @click=${() => {
      this.editor = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${t ? R : O`<div class="segmented creation-kind"><button type="button" class=${this.creationKind === "later" ? "active" : ""} @click=${() => {
      this.creationKind = "later";
    }}>Do something later</button><button type="button" class=${i ? "active" : ""} @click=${() => {
      this.creationKind = "run_for";
    }}>Run something for a while</button></div>`}
      <label>Name<input name="name" required .value=${t?.name ?? ""} placeholder="Turn off office heater"></label>
      ${i ? this.renderRunForFields() : O`
        ${t ? R : this.renderScheduleFields()}
        <section class="action-editor"><div class="section-head"><h3>Actions</h3><button type="button" class="link" @click=${() => this.switchActionMode()}>${this.editor?.mode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
          ${this.editor?.mode === "visual" ? this.renderVisualActions() : O`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(n) => {
      this.actionYaml = n.currentTarget.value;
    }}></textarea><small>Advanced sequences such as choose, repeat, parallel, waits, and templates stay here.</small></label>`}
        </section>
        ${this.renderNormalOptions(t)}
      `}
      <details class="advanced"><summary>Developer and automation options</summary>
        <label>Job key<input name="job_key" .value=${this.jobKey} @input=${(n) => {
      this.jobKey = n.currentTarget.value;
    }}><small>Optional stable identifier for automations.</small></label>
        ${!t && this.jobKey.trim() ? O`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>` : R}
        <label>Tags<input name="tags" .value=${t?.tags.join(", ") ?? ""} placeholder="heating, office"><small>Separate tags with commas.</small></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${Fi(t)[0] ?? ""} .allowCustomEntity=${!0} @value-changed=${(n) => {
      const o = n.currentTarget.parentElement?.querySelector("input[name=target_entities]");
      o && (o.value = n.detail.value);
    }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${Fi(t).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
      </details>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>Preview</strong><span>${this.editorPreview(t)}</span></div></section>
      <footer><button type="button" @click=${() => {
      this.editor = void 0;
    }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${t ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }
  renderScheduleFields() {
    return O`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => {
      this.scheduleMode = "delay";
    }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => {
      this.scheduleMode = "absolute";
    }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? O`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(t) => {
      this.previewDelay = Number(t.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(t) => {
      this.previewUnit = t.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5, 15, 30, 60].map((t) => O`<button type="button" @click=${() => {
      this.previewDelay = t, this.previewUnit = "minutes";
    }}>${t < 60 ? `${t} min` : "1 hour"}</button>`)}</div>` : O`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </fieldset>`;
  }
  renderRunForFields() {
    return O`<fieldset><legend>Run For</legend>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(t) => {
      this.runForTarget = t.detail.value;
    }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(t) => {
      this.runForStart = t.detail.value, this.runForEnd = Vn[t.detail.value] ?? "";
    }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(t) => {
      this.runForEnd = t.detail.value;
    }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(t) => {
      this.previewDelay = Number(t.currentTarget.value);
    }}><select name="delay_unit" .value=${this.previewUnit} @change=${(t) => {
      this.previewUnit = t.currentTarget.value;
    }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </fieldset>`;
  }
  renderVisualActions() {
    return O`${this.visualActions.map((t, i) => O`<article class="visual-card">
      <div class="section-head"><strong>Action ${i + 1}</strong>${this.visualActions.length > 1 ? O`<button type="button" class="link danger" @click=${() => {
      this.visualActions = this.visualActions.filter((n, o) => o !== i);
    }}>Remove</button>` : R}</div>
      <label>Service<ha-service-picker .hass=${this.hass} .value=${t.action} @value-changed=${(n) => this.updateAction(i, { action: n.detail.value })}></ha-service-picker></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${t.target} @value-changed=${(n) => this.updateAction(i, { target: n.detail.value })}></ha-target-picker><small>Choose entities, devices, or areas. Leave empty for services that do not need a target.</small></label>
      <div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => this.updateAction(i, { data: [...t.data, { key: "", value: "" }] })}>Add field</button></div>
      ${t.data.map((n, o) => O`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${n.key} @input=${(l) => this.updateData(i, o, { key: l.currentTarget.value })}><input aria-label="Data value" placeholder="60 or message text" .value=${String(n.value ?? "")} @input=${(l) => this.updateData(i, o, { value: Hn(l.currentTarget.value) })}><button type="button" class="icon" title="Remove data field" @click=${() => this.updateAction(i, { data: t.data.filter((l, s) => s !== o) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`)}
    </article>`)}<button type="button" @click=${() => {
      this.visualActions = [...this.visualActions, { action: "", target: {}, data: [] }];
    }}><ha-icon icon="mdi:plus"></ha-icon>Add another action</button>`;
  }
  renderNormalOptions(t) {
    return O`<section class="normal-options"><h3>Optional settings</h3>
      <label>Description<textarea name="description">${t?.description ?? ""}</textarea></label>
      <div class="section-head"><h3>Only run this action if…</h3><button type="button" class="link" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
      ${this.conditionMode === "visual" ? this.renderVisualConditions() : O`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(i) => {
      this.conditionsYaml = i.currentTarget.value;
    }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
      <label>If the conditions aren’t met<select name="condition_failure"><option value="skip" ?selected=${!t || t.condition_failure === "skip"}>Skip this run and keep it in history</option><option value="cancel" ?selected=${t?.condition_failure === "cancel"}>Cancel the action</option><option value="fail" ?selected=${t?.condition_failure === "fail"}>Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${t?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy"><option value="" ?selected=${!t?.overdue_policy}>Use the integration default</option><option value="execute" ?selected=${t?.overdue_policy === "execute"}>Run it when Home Assistant comes back</option><option value="execute_within_grace" ?selected=${t?.overdue_policy === "execute_within_grace"}>Run it only if it is less than the grace period late</option><option value="skip" ?selected=${t?.overdue_policy === "skip"}>Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${t?.overdue_grace ? String(t.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
    </section>`;
  }
  renderVisualConditions() {
    const t = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return O`<div class="condition-builder">${this.visualConditions.items.length > 1 ? O`<label>Match<select .value=${this.visualConditions.operator} @change=${(i) => {
      this.visualConditions = { ...this.visualConditions, operator: i.currentTarget.value };
    }}><option value="and">All conditions (AND)</option><option value="or">Any condition (OR)</option></select></label>` : R}
      ${this.visualConditions.items.map((i, n) => O`<article class="visual-card"><div class="section-head"><select aria-label="Condition type" .value=${i.type} @change=${(o) => this.changeConditionType(n, o.currentTarget.value)}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option></select><button type="button" class="link danger" @click=${() => {
      this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.filter((o, l) => l !== n) };
    }}>Remove</button></div>
        ${i.type === "state" ? O`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${i.entity_id} .allowCustomEntity=${!0} @value-changed=${(o) => this.updateCondition(n, { ...i, entity_id: o.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${i.state} @input=${(o) => this.updateCondition(n, { ...i, state: o.currentTarget.value })}></label>` : R}
        ${i.type === "numeric_state" ? O`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${i.entity_id} .allowCustomEntity=${!0} @value-changed=${(o) => this.updateCondition(n, { ...i, entity_id: o.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${i.above} @input=${(o) => this.updateCondition(n, { ...i, above: o.currentTarget.value })}></label><label>Below<input type="number" step="any" .value=${i.below} @input=${(o) => this.updateCondition(n, { ...i, below: o.currentTarget.value })}></label></div>` : R}
        ${i.type === "time" ? O`<div class="two"><label>After<input type="time" step="1" .value=${i.after} @input=${(o) => this.updateCondition(n, { ...i, after: o.currentTarget.value })}></label><label>Before<input type="time" step="1" .value=${i.before} @input=${(o) => this.updateCondition(n, { ...i, before: o.currentTarget.value })}></label></div><div class="weekdays">${t.map(([o, l]) => O`<label><input type="checkbox" .checked=${i.weekdays.includes(o)} @change=${(s) => this.toggleWeekday(n, i, o, s.currentTarget.checked)}>${l}</label>`)}</div>` : R}
      </article>`)}<button type="button" @click=${() => {
      this.visualConditions = { ...this.visualConditions, items: [...this.visualConditions.items, { type: "state", entity_id: "", state: "" }] };
    }}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
  }
  async saveEditor(t) {
    t.preventDefault();
    const i = t.currentTarget, n = new FormData(i);
    try {
      if (!this.editor?.job && this.creationKind === "run_for") {
        const a = Number(n.get("delay_value")), p = String(n.get("delay_unit"));
        if (!Number.isFinite(a) || a <= 0) throw new Error("Duration must be greater than zero");
        if (!this.runForStart || !this.runForEnd || !Object.values(this.runForTarget).some((m) => m?.length)) throw new Error("Choose a target, start action, and end action");
        this.busy = !0, await Fn(this.hass, {
          name: String(n.get("name")),
          description: String(n.get("description") ?? "") || void 0,
          duration: { [p]: a },
          start_sequence: Qe([{ action: this.runForStart, target: this.runForTarget, data: [] }]),
          end_sequence: Qe([{ action: this.runForEnd, target: this.runForTarget, data: [] }]),
          job_key: String(n.get("job_key") ?? "") || void 0,
          tags: String(n.get("tags") ?? "").split(",").map((m) => m.trim()).filter(Boolean),
          conflict_mode: String(n.get("conflict_mode") ?? "keep_all")
        }), await this.refresh(), this.editor = void 0;
        return;
      }
      const o = this.editor?.mode === "visual" ? Qe(this.visualActions) : Ge(this.actionYaml);
      if (!Array.isArray(o)) throw new Error("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || this.visualActions.some((a) => !a.action))) throw new Error("Choose a service for every action");
      const l = this.conditionMode === "visual" ? Mt(this.visualConditions) : this.conditionsYaml.trim() ? Ge(this.conditionsYaml) : [];
      if (this.conditionMode === "visual" && this.visualConditions.items.some((a) => a.type === "state" ? !a.entity_id || !a.state : a.type === "numeric_state" ? !a.entity_id || !a.above.trim() && !a.below.trim() : !a.after && !a.before && a.weekdays.length === 0)) throw new Error("Complete or remove each condition");
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
      if (!Array.isArray(s.conditions)) throw new Error("Conditions YAML must be a list");
      if (this.busy = !0, this.editor?.job) await Pn(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...s });
      else {
        let a;
        if (this.scheduleMode === "absolute") {
          const p = String(n.get("date")), m = String(n.get("time")), u = /* @__PURE__ */ new Date(`${p}T${m}`);
          if (Number.isNaN(u.getTime())) throw new Error("Choose a valid date and time");
          a = { execute_at: u.toISOString() };
        } else {
          const p = Number(n.get("delay_value")), m = String(n.get("delay_unit"));
          if (!Number.isFinite(p) || p <= 0) throw new Error("Delay must be greater than zero");
          a = { delay: { [m]: p } };
        }
        await Dn(this.hass, { ...s, ...a, conflict_mode: String(n.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = void 0;
    } catch (o) {
      this.setError(o);
    } finally {
      this.busy = !1;
    }
  }
  updateAction(t, i) {
    this.visualActions = this.visualActions.map((n, o) => o === t ? { ...n, ...i } : n);
  }
  updateData(t, i, n) {
    const o = this.visualActions[t];
    o && this.updateAction(t, { data: o.data.map((l, s) => s === i ? { ...l, ...n } : l) });
  }
  updateCondition(t, i) {
    this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.map((n, o) => o === t ? i : n) };
  }
  changeConditionType(t, i) {
    const n = i === "state" ? { type: i, entity_id: "", state: "" } : i === "numeric_state" ? { type: i, entity_id: "", above: "", below: "" } : { type: i, after: "", before: "", weekdays: [] };
    this.updateCondition(t, n);
  }
  toggleWeekday(t, i, n, o) {
    this.updateCondition(t, { ...i, weekdays: o ? [...i.weekdays, n] : i.weekdays.filter((l) => l !== n) });
  }
  switchActionMode() {
    if (this.editor?.mode === "visual") {
      this.actionYaml = fe(Qe(this.visualActions), { noRefs: !0 }), this.editor = { ...this.editor, mode: "yaml" };
      return;
    }
    try {
      const t = Ge(this.actionYaml);
      if (!Array.isArray(t)) throw new Error("Action YAML must be a list");
      const i = Tt(t);
      if (!i) throw new Error("This sequence uses advanced features that the visual editor cannot represent safely.");
      this.visualActions = i, this.editor = { ...this.editor, mode: "visual" };
    } catch (t) {
      this.setError(t);
    }
  }
  switchConditionMode() {
    if (this.conditionMode === "visual") {
      this.conditionsYaml = fe(Mt(this.visualConditions), { noRefs: !0 }), this.conditionMode = "yaml";
      return;
    }
    try {
      const t = this.conditionsYaml.trim() ? Ge(this.conditionsYaml) : [];
      if (!Array.isArray(t)) throw new Error("Conditions YAML must be a list");
      const i = Ot(t);
      if (!i) throw new Error("These conditions use advanced options that the visual editor cannot represent safely.");
      this.visualConditions = i, this.conditionMode = "visual";
    } catch (t) {
      this.setError(t);
    }
  }
  actionLabel(t, i) {
    const n = t.split(".").pop()?.replaceAll("_", " ") ?? "Run action", o = i.entity_id ?? i.device_id ?? i.area_id ?? i.floor_id ?? i.label_id, s = (Array.isArray(o) ? o[0] : o)?.split(".").pop()?.replaceAll("_", " ");
    return `${n.charAt(0).toUpperCase()}${n.slice(1)}${s ? ` ${s}` : ""}`;
  }
  editorPreview(t) {
    if (t) return `${this.visualActions[0] ? this.actionLabel(this.visualActions[0].action, this.visualActions[0].target) : t.action_summary}; scheduled for ${Ce(t.execute_at_local)}`;
    if (this.creationKind === "run_for") return `${this.actionLabel(this.runForStart, this.runForTarget)} now, then ${this.actionLabel(this.runForEnd, this.runForTarget).toLowerCase()} in ${this.previewDelay} ${this.previewUnit}`;
    const i = this.visualActions[0], n = i ? this.actionLabel(i.action, i.target) : "Run the configured action";
    return this.scheduleMode === "delay" ? `${n} in ${this.previewDelay} ${this.previewUnit}` : `${n} at the selected date and time`;
  }
  renderQuickDialog() {
    const t = this.quickDialog;
    return t ? O`<div class="overlay"><form class="dialog small" @submit=${(n) => this.submitQuickDialog(n)}><header><h2>${{ reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: "Duplicate action" }[t.kind]}</h2><button type="button" class="icon" @click=${() => {
      this.quickDialog = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${t.kind === "reschedule" ? O`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : O`<label>${t.kind === "extend" ? "Minutes to add (negative reduces time)" : t.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${t.kind === "extend" ? R : "1"} .value=${t.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => {
      this.quickDialog = void 0;
    }}>Cancel</button><button class="primary">${t.kind === "duplicate" ? "Duplicate" : "Apply"}</button></footer></form></div>` : R;
  }
  async submitQuickDialog(t) {
    t.preventDefault();
    const i = this.quickDialog;
    if (!i) return;
    const n = new FormData(t.currentTarget);
    if (i.kind === "reschedule") {
      const o = /* @__PURE__ */ new Date(`${String(n.get("date"))}T${String(n.get("time"))}`);
      if (Number.isNaN(o.getTime())) {
        this.error = "Choose a valid date and time";
        return;
      }
      await this.operate("reschedule", i.job, { execute_at: o.toISOString() });
    } else {
      const o = Number(n.get("minutes"));
      if (!Number.isFinite(o) || (["duplicate", "snooze"].includes(i.kind) ? o <= 0 : o === 0)) {
        this.error = "Enter a valid number of minutes";
        return;
      }
      await this.operate(i.kind, i.job, ["extend", "snooze"].includes(i.kind) ? { duration: { minutes: o } } : { delay: { minutes: o } });
    }
    this.quickDialog = void 0;
  }
  renderConfirmation() {
    const t = this.confirmAction;
    if (!t) return R;
    const i = t.operation === "delete", n = t.operation === "cancel", o = i ? "Delete this record permanently?" : n ? "Cancel this deferred action?" : "Run this action now?", l = i ? "This permanently removes the record and its history. This cannot be undone." : n ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay and starts the action now.";
    return O`<div class="overlay" @click=${() => {
      this.confirmAction = void 0;
    }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(s) => s.stopPropagation()}>
      <header><h2>${o}</h2><button class="icon" title="Close" @click=${() => {
      this.confirmAction = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${t.job.name}</strong></p><p>${l}</p>
      <footer><button @click=${() => {
      this.confirmAction = void 0;
    }}>Keep it</button><button class=${i ? "danger" : n ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => {
      const s = this.confirmAction;
      this.confirmAction = void 0, s && await this.performOperation(s.operation, s.job);
    }}>${i ? "Delete permanently" : n ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }
  render() {
    const t = this.visibleJobs();
    return O`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? O`<div class="banner"><div>${this.error}${this.errorDetails ? O`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : R}</div><button class="icon" @click=${() => {
      this.error = void 0, this.errorDetails = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : R}
      <nav>${["Pending", "Paused", "Failed", "History"].map((i) => O`<button class=${this.tab === i ? "active" : ""} @click=${() => {
      this.tab = i;
    }}>${i}<span>${i === "Pending" ? this.summary.pending : i === "Paused" ? this.summary.paused : i === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => {
      this.tab = "All";
    }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? O`<small>${Ce(this.summary.next_execution_local)} · ${Di(this.summary.next_execution_local)}</small>` : R}</section>
      <main>${t.length ? t.map((i) => this.renderJob(i)) : O`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : R}${this.editor ? this.renderEditor() : R}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }
};
L.styles = nn`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.data-row{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin:8px 0}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input+input{grid-column:1}.data-row button{grid-column:2;grid-row:1/3}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
D([
  Ft({ attribute: !1 })
], L.prototype, "hass", 2);
D([
  P()
], L.prototype, "jobs", 2);
D([
  P()
], L.prototype, "summary", 2);
D([
  P()
], L.prototype, "tab", 2);
D([
  P()
], L.prototype, "selected", 2);
D([
  P()
], L.prototype, "editor", 2);
D([
  P()
], L.prototype, "creationKind", 2);
D([
  P()
], L.prototype, "scheduleMode", 2);
D([
  P()
], L.prototype, "visualActions", 2);
D([
  P()
], L.prototype, "actionYaml", 2);
D([
  P()
], L.prototype, "conditionMode", 2);
D([
  P()
], L.prototype, "visualConditions", 2);
D([
  P()
], L.prototype, "conditionsYaml", 2);
D([
  P()
], L.prototype, "runForTarget", 2);
D([
  P()
], L.prototype, "runForStart", 2);
D([
  P()
], L.prototype, "runForEnd", 2);
D([
  P()
], L.prototype, "jobKey", 2);
D([
  P()
], L.prototype, "previewDelay", 2);
D([
  P()
], L.prototype, "previewUnit", 2);
D([
  P()
], L.prototype, "confirmAction", 2);
D([
  P()
], L.prototype, "errorDetails", 2);
D([
  P()
], L.prototype, "menuJobId", 2);
D([
  P()
], L.prototype, "quickDialog", 2);
D([
  P()
], L.prototype, "error", 2);
D([
  P()
], L.prototype, "busy", 2);
L = D([
  kn("deferred-actions-panel")
], L);
export {
  L as DeferredActionsPanel
};
