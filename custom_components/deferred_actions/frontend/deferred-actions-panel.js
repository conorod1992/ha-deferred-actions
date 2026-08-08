const Ge = globalThis, Li = Ge.ShadowRoot && (Ge.ShadyCSS === void 0 || Ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ri = /* @__PURE__ */ Symbol(), Yi = /* @__PURE__ */ new WeakMap();
let kn = class {
  constructor(i, r, l) {
    if (this._$cssResult$ = !0, l !== Ri) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = r;
  }
  get styleSheet() {
    let i = this.o;
    const r = this.t;
    if (Li && i === void 0) {
      const l = r !== void 0 && r.length === 1;
      l && (i = Yi.get(r)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), l && Yi.set(r, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const Gn = (t) => new kn(typeof t == "string" ? t : t + "", void 0, Ri), Vn = (t, ...i) => {
  const r = t.length === 1 ? t[0] : i.reduce((l, o, s) => l + ((c) => {
    if (c._$cssResult$ === !0) return c.cssText;
    if (typeof c == "number") return c;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + c + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new kn(r, t, Ri);
}, Qn = (t, i) => {
  if (Li) t.adoptedStyleSheets = i.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of i) {
    const l = document.createElement("style"), o = Ge.litNonce;
    o !== void 0 && l.setAttribute("nonce", o), l.textContent = r.cssText, t.appendChild(l);
  }
}, Bi = Li ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((i) => {
  let r = "";
  for (const l of i.cssRules) r += l.cssText;
  return Gn(r);
})(t) : t;
const { is: Zn, defineProperty: Xn, getOwnPropertyDescriptor: et, getOwnPropertyNames: it, getOwnPropertySymbols: nt, getPrototypeOf: tt } = Object, Ze = globalThis, ji = Ze.trustedTypes, rt = ji ? ji.emptyScript : "", ot = Ze.reactiveElementPolyfillSupport, Se = (t, i) => t, Ve = { toAttribute(t, i) {
  switch (i) {
    case Boolean:
      t = t ? rt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, i) {
  let r = t;
  switch (i) {
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
} }, Pi = (t, i) => !Zn(t, i), zi = { attribute: !0, type: String, converter: Ve, reflect: !1, useDefault: !1, hasChanged: Pi };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Ze.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let fe = class extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ??= []).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, r = zi) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(i) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(i, r), !r.noAccessor) {
      const l = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(i, l, r);
      o !== void 0 && Xn(this.prototype, i, o);
    }
  }
  static getPropertyDescriptor(i, r, l) {
    const { get: o, set: s } = et(this.prototype, i) ?? { get() {
      return this[r];
    }, set(c) {
      this[r] = c;
    } };
    return { get: o, set(c) {
      const p = o?.call(this);
      s?.call(this, c), this.requestUpdate(i, p, l);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? zi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Se("elementProperties"))) return;
    const i = tt(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Se("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Se("properties"))) {
      const r = this.properties, l = [...it(r), ...nt(r)];
      for (const o of l) this.createProperty(o, r[o]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const r = litPropertyMetadata.get(i);
      if (r !== void 0) for (const [l, o] of r) this.elementProperties.set(l, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, l] of this.elementProperties) {
      const o = this._$Eu(r, l);
      o !== void 0 && this._$Eh.set(o, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const r = [];
    if (Array.isArray(i)) {
      const l = new Set(i.flat(1 / 0).reverse());
      for (const o of l) r.unshift(Bi(o));
    } else i !== void 0 && r.push(Bi(i));
    return r;
  }
  static _$Eu(i, r) {
    const l = r.attribute;
    return l === !1 ? void 0 : typeof l == "string" ? l : typeof i == "string" ? i.toLowerCase() : void 0;
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
    const i = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const l of r.keys()) this.hasOwnProperty(l) && (i.set(l, this[l]), delete this[l]);
    i.size > 0 && (this._$Ep = i);
  }
  createRenderRoot() {
    const i = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qn(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((i) => i.hostConnected?.());
  }
  enableUpdating(i) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((i) => i.hostDisconnected?.());
  }
  attributeChangedCallback(i, r, l) {
    this._$AK(i, l);
  }
  _$ET(i, r) {
    const l = this.constructor.elementProperties.get(i), o = this.constructor._$Eu(i, l);
    if (o !== void 0 && l.reflect === !0) {
      const s = (l.converter?.toAttribute !== void 0 ? l.converter : Ve).toAttribute(r, l.type);
      this._$Em = i, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(i, r) {
    const l = this.constructor, o = l._$Eh.get(i);
    if (o !== void 0 && this._$Em !== o) {
      const s = l.getPropertyOptions(o), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Ve;
      this._$Em = o;
      const p = c.fromAttribute(r, s.type);
      this[o] = p ?? this._$Ej?.get(o) ?? p, this._$Em = null;
    }
  }
  requestUpdate(i, r, l, o = !1, s) {
    if (i !== void 0) {
      const c = this.constructor;
      if (o === !1 && (s = this[i]), l ??= c.getPropertyOptions(i), !((l.hasChanged ?? Pi)(s, r) || l.useDefault && l.reflect && s === this._$Ej?.get(i) && !this.hasAttribute(c._$Eu(i, l)))) return;
      this.C(i, r, l);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(i, r, { useDefault: l, reflect: o, wrapped: s }, c) {
    l && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(i) && (this._$Ej.set(i, c ?? r ?? this[i]), s !== !0 || c !== void 0) || (this._$AL.has(i) || (this.hasUpdated || l || (r = void 0), this._$AL.set(i, r)), o === !0 && this._$Em !== i && (this._$Eq ??= /* @__PURE__ */ new Set()).add(i));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
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
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const l = this.constructor.elementProperties;
      if (l.size > 0) for (const [o, s] of l) {
        const { wrapped: c } = s, p = this[o];
        c !== !0 || this._$AL.has(o) || p === void 0 || this.C(o, void 0, s, p);
      }
    }
    let i = !1;
    const r = this._$AL;
    try {
      i = this.shouldUpdate(r), i ? (this.willUpdate(r), this._$EO?.forEach((l) => l.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (l) {
      throw i = !1, this._$EM(), l;
    }
    i && this._$AE(r);
  }
  willUpdate(i) {
  }
  _$AE(i) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(i)), this.updated(i);
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
    this._$Eq &&= this._$Eq.forEach((r) => this._$ET(r, this[r])), this._$EM();
  }
  updated(i) {
  }
  firstUpdated(i) {
  }
};
fe.elementStyles = [], fe.shadowRootOptions = { mode: "open" }, fe[Se("elementProperties")] = /* @__PURE__ */ new Map(), fe[Se("finalized")] = /* @__PURE__ */ new Map(), ot?.({ ReactiveElement: fe }), (Ze.reactiveElementVersions ??= []).push("2.1.2");
const Di = globalThis, Ki = (t) => t, Qe = Di.trustedTypes, Ji = Qe ? Qe.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, En = "$lit$", re = `lit$${Math.random().toFixed(9).slice(2)}$`, Cn = "?" + re, lt = `<${Cn}>`, ae = document, Ee = () => ae.createComment(""), Ce = (t) => t === null || typeof t != "object" && typeof t != "function", qi = Array.isArray, st = (t) => qi(t) || typeof t?.[Symbol.iterator] == "function", ui = `[ 	
\f\r]`, we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Wi = /-->/g, Gi = />/g, se = RegExp(`>|${ui}(?:([^\\s"'>=/]+)(${ui}*=${ui}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Vi = /'/g, Qi = /"/g, Tn = /^(?:script|style|textarea|title)$/i, ct = (t) => (i, ...r) => ({ _$litType$: t, strings: i, values: r }), L = ct(1), me = /* @__PURE__ */ Symbol.for("lit-noChange"), I = /* @__PURE__ */ Symbol.for("lit-nothing"), Zi = /* @__PURE__ */ new WeakMap(), ce = ae.createTreeWalker(ae, 129);
function On(t, i) {
  if (!qi(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ji !== void 0 ? Ji.createHTML(i) : i;
}
const at = (t, i) => {
  const r = t.length - 1, l = [];
  let o, s = i === 2 ? "<svg>" : i === 3 ? "<math>" : "", c = we;
  for (let p = 0; p < r; p++) {
    const g = t[p];
    let d, h, v = -1, T = 0;
    for (; T < g.length && (c.lastIndex = T, h = c.exec(g), h !== null); ) T = c.lastIndex, c === we ? h[1] === "!--" ? c = Wi : h[1] !== void 0 ? c = Gi : h[2] !== void 0 ? (Tn.test(h[2]) && (o = RegExp("</" + h[2], "g")), c = se) : h[3] !== void 0 && (c = se) : c === se ? h[0] === ">" ? (c = o ?? we, v = -1) : h[1] === void 0 ? v = -2 : (v = c.lastIndex - h[2].length, d = h[1], c = h[3] === void 0 ? se : h[3] === '"' ? Qi : Vi) : c === Qi || c === Vi ? c = se : c === Wi || c === Gi ? c = we : (c = se, o = void 0);
    const M = c === se && t[p + 1].startsWith("/>") ? " " : "";
    s += c === we ? g + lt : v >= 0 ? (l.push(d), g.slice(0, v) + En + g.slice(v) + re + M) : g + re + (v === -2 ? p : M);
  }
  return [On(t, s + (t[r] || "<?>") + (i === 2 ? "</svg>" : i === 3 ? "</math>" : "")), l];
};
class Te {
  constructor({ strings: i, _$litType$: r }, l) {
    let o;
    this.parts = [];
    let s = 0, c = 0;
    const p = i.length - 1, g = this.parts, [d, h] = at(i, r);
    if (this.el = Te.createElement(d, l), ce.currentNode = this.el.content, r === 2 || r === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (o = ce.nextNode()) !== null && g.length < p; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const v of o.getAttributeNames()) if (v.endsWith(En)) {
          const T = h[c++], M = o.getAttribute(v).split(re), K = /([.?@])?(.*)/.exec(T);
          g.push({ type: 1, index: s, name: K[2], strings: M, ctor: K[1] === "." ? dt : K[1] === "?" ? pt : K[1] === "@" ? ht : Xe }), o.removeAttribute(v);
        } else v.startsWith(re) && (g.push({ type: 6, index: s }), o.removeAttribute(v));
        if (Tn.test(o.tagName)) {
          const v = o.textContent.split(re), T = v.length - 1;
          if (T > 0) {
            o.textContent = Qe ? Qe.emptyScript : "";
            for (let M = 0; M < T; M++) o.append(v[M], Ee()), ce.nextNode(), g.push({ type: 2, index: ++s });
            o.append(v[T], Ee());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Cn) g.push({ type: 2, index: s });
      else {
        let v = -1;
        for (; (v = o.data.indexOf(re, v + 1)) !== -1; ) g.push({ type: 7, index: s }), v += re.length - 1;
      }
      s++;
    }
  }
  static createElement(i, r) {
    const l = ae.createElement("template");
    return l.innerHTML = i, l;
  }
}
function ge(t, i, r = t, l) {
  if (i === me) return i;
  let o = l !== void 0 ? r._$Co?.[l] : r._$Cl;
  const s = Ce(i) ? void 0 : i._$litDirective$;
  return o?.constructor !== s && (o?._$AO?.(!1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, r, l)), l !== void 0 ? (r._$Co ??= [])[l] = o : r._$Cl = o), o !== void 0 && (i = ge(t, o._$AS(t, i.values), o, l)), i;
}
class ut {
  constructor(i, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = i, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(i) {
    const { el: { content: r }, parts: l } = this._$AD, o = (i?.creationScope ?? ae).importNode(r, !0);
    ce.currentNode = o;
    let s = ce.nextNode(), c = 0, p = 0, g = l[0];
    for (; g !== void 0; ) {
      if (c === g.index) {
        let d;
        g.type === 2 ? d = new Oe(s, s.nextSibling, this, i) : g.type === 1 ? d = new g.ctor(s, g.name, g.strings, this, i) : g.type === 6 && (d = new ft(s, this, i)), this._$AV.push(d), g = l[++p];
      }
      c !== g?.index && (s = ce.nextNode(), c++);
    }
    return ce.currentNode = ae, o;
  }
  p(i) {
    let r = 0;
    for (const l of this._$AV) l !== void 0 && (l.strings !== void 0 ? (l._$AI(i, l, r), r += l.strings.length - 2) : l._$AI(i[r])), r++;
  }
}
class Oe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(i, r, l, o) {
    this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = i, this._$AB = r, this._$AM = l, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let i = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && i?.nodeType === 11 && (i = r.parentNode), i;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(i, r = this) {
    i = ge(this, i, r), Ce(i) ? i === I || i == null || i === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : i !== this._$AH && i !== me && this._(i) : i._$litType$ !== void 0 ? this.$(i) : i.nodeType !== void 0 ? this.T(i) : st(i) ? this.k(i) : this._(i);
  }
  O(i) {
    return this._$AA.parentNode.insertBefore(i, this._$AB);
  }
  T(i) {
    this._$AH !== i && (this._$AR(), this._$AH = this.O(i));
  }
  _(i) {
    this._$AH !== I && Ce(this._$AH) ? this._$AA.nextSibling.data = i : this.T(ae.createTextNode(i)), this._$AH = i;
  }
  $(i) {
    const { values: r, _$litType$: l } = i, o = typeof l == "number" ? this._$AC(i) : (l.el === void 0 && (l.el = Te.createElement(On(l.h, l.h[0]), this.options)), l);
    if (this._$AH?._$AD === o) this._$AH.p(r);
    else {
      const s = new ut(o, this), c = s.u(this.options);
      s.p(r), this.T(c), this._$AH = s;
    }
  }
  _$AC(i) {
    let r = Zi.get(i.strings);
    return r === void 0 && Zi.set(i.strings, r = new Te(i)), r;
  }
  k(i) {
    qi(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let l, o = 0;
    for (const s of i) o === r.length ? r.push(l = new Oe(this.O(Ee()), this.O(Ee()), this, this.options)) : l = r[o], l._$AI(s), o++;
    o < r.length && (this._$AR(l && l._$AB.nextSibling, o), r.length = o);
  }
  _$AR(i = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); i !== this._$AB; ) {
      const l = Ki(i).nextSibling;
      Ki(i).remove(), i = l;
    }
  }
  setConnected(i) {
    this._$AM === void 0 && (this._$Cv = i, this._$AP?.(i));
  }
}
class Xe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(i, r, l, o, s) {
    this.type = 1, this._$AH = I, this._$AN = void 0, this.element = i, this.name = r, this._$AM = o, this.options = s, l.length > 2 || l[0] !== "" || l[1] !== "" ? (this._$AH = Array(l.length - 1).fill(new String()), this.strings = l) : this._$AH = I;
  }
  _$AI(i, r = this, l, o) {
    const s = this.strings;
    let c = !1;
    if (s === void 0) i = ge(this, i, r, 0), c = !Ce(i) || i !== this._$AH && i !== me, c && (this._$AH = i);
    else {
      const p = i;
      let g, d;
      for (i = s[0], g = 0; g < s.length - 1; g++) d = ge(this, p[l + g], r, g), d === me && (d = this._$AH[g]), c ||= !Ce(d) || d !== this._$AH[g], d === I ? i = I : i !== I && (i += (d ?? "") + s[g + 1]), this._$AH[g] = d;
    }
    c && !o && this.j(i);
  }
  j(i) {
    i === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, i ?? "");
  }
}
class dt extends Xe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(i) {
    this.element[this.name] = i === I ? void 0 : i;
  }
}
class pt extends Xe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(i) {
    this.element.toggleAttribute(this.name, !!i && i !== I);
  }
}
class ht extends Xe {
  constructor(i, r, l, o, s) {
    super(i, r, l, o, s), this.type = 5;
  }
  _$AI(i, r = this) {
    if ((i = ge(this, i, r, 0) ?? I) === me) return;
    const l = this._$AH, o = i === I && l !== I || i.capture !== l.capture || i.once !== l.once || i.passive !== l.passive, s = i !== I && (l === I || o);
    o && this.element.removeEventListener(this.name, this, l), s && this.element.addEventListener(this.name, this, i), this._$AH = i;
  }
  handleEvent(i) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, i) : this._$AH.handleEvent(i);
  }
}
class ft {
  constructor(i, r, l) {
    this.element = i, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = l;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(i) {
    ge(this, i);
  }
}
const mt = Di.litHtmlPolyfillSupport;
mt?.(Te, Oe), (Di.litHtmlVersions ??= []).push("3.3.3");
const gt = (t, i, r) => {
  const l = r?.renderBefore ?? i;
  let o = l._$litPart$;
  if (o === void 0) {
    const s = r?.renderBefore ?? null;
    l._$litPart$ = o = new Oe(i.insertBefore(Ee(), s), s, void 0, r ?? {});
  }
  return o._$AI(t), o;
};
const Fi = globalThis;
class ke extends fe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const i = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= i.firstChild, i;
  }
  update(i) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(i), this._$Do = gt(r, this.renderRoot, this.renderOptions);
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
ke._$litElement$ = !0, ke.finalized = !0, Fi.litElementHydrateSupport?.({ LitElement: ke });
const yt = Fi.litElementPolyfillSupport;
yt?.({ LitElement: ke });
(Fi.litElementVersions ??= []).push("4.2.2");
const bt = (t) => (i, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, i);
  }) : customElements.define(t, i);
};
const _t = { attribute: !0, type: String, converter: Ve, reflect: !1, hasChanged: Pi }, vt = (t = _t, i, r) => {
  const { kind: l, metadata: o } = r;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), l === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), l === "accessor") {
    const { name: c } = r;
    return { set(p) {
      const g = i.get.call(this);
      i.set.call(this, p), this.requestUpdate(c, g, t, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(c, void 0, t, p), p;
    } };
  }
  if (l === "setter") {
    const { name: c } = r;
    return function(p) {
      const g = this[c];
      i.call(this, p), this.requestUpdate(c, g, t, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + l);
};
function In(t) {
  return (i, r) => typeof r == "object" ? vt(t, i, r) : ((l, o, s) => {
    const c = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, l), c ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, i, r);
}
function W(t) {
  return In({ ...t, state: !0, attribute: !1 });
}
function At(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var H = {}, Ke = {}, te = {}, Xi;
function Ie() {
  if (Xi) return te;
  Xi = 1;
  function t(c) {
    return typeof c > "u" || c === null;
  }
  function i(c) {
    return typeof c == "object" && c !== null;
  }
  function r(c) {
    return Array.isArray(c) ? c : t(c) ? [] : [c];
  }
  function l(c, p) {
    if (p) {
      const g = Object.keys(p);
      for (let d = 0, h = g.length; d < h; d += 1) {
        const v = g[d];
        c[v] = p[v];
      }
    }
    return c;
  }
  function o(c, p) {
    let g = "";
    for (let d = 0; d < p; d += 1)
      g += c;
    return g;
  }
  function s(c) {
    return c === 0 && Number.NEGATIVE_INFINITY === 1 / c;
  }
  return te.isNothing = t, te.isObject = i, te.toArray = r, te.repeat = o, te.isNegativeZero = s, te.extend = l, te;
}
var di, en;
function Me() {
  if (en) return di;
  en = 1;
  function t(r, l) {
    let o = "";
    const s = r.reason || "(unknown reason)";
    return r.mark ? (r.mark.name && (o += 'in "' + r.mark.name + '" '), o += "(" + (r.mark.line + 1) + ":" + (r.mark.column + 1) + ")", !l && r.mark.snippet && (o += `

` + r.mark.snippet), s + " " + o) : s;
  }
  function i(r, l) {
    Error.call(this), this.name = "YAMLException", this.reason = r, this.mark = l, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return i.prototype = Object.create(Error.prototype), i.prototype.constructor = i, i.prototype.toString = function(l) {
    return this.name + ": " + t(this, l);
  }, di = i, di;
}
var pi, nn;
function xt() {
  if (nn) return pi;
  nn = 1;
  const t = Ie();
  function i(o, s, c, p, g) {
    let d = "", h = "";
    const v = Math.floor(g / 2) - 1;
    return p - s > v && (d = " ... ", s = p - v + d.length), c - p > v && (h = " ...", c = p + v - h.length), {
      str: d + o.slice(s, c).replace(/\t/g, "→") + h,
      pos: p - s + d.length
      // relative position
    };
  }
  function r(o, s) {
    return t.repeat(" ", s - o.length) + o;
  }
  function l(o, s) {
    if (s = Object.create(s || null), !o.buffer) return null;
    s.maxLength || (s.maxLength = 79), typeof s.indent != "number" && (s.indent = 1), typeof s.linesBefore != "number" && (s.linesBefore = 3), typeof s.linesAfter != "number" && (s.linesAfter = 2);
    const c = /\r?\n|\r|\0/g, p = [0], g = [];
    let d, h = -1;
    for (; d = c.exec(o.buffer); )
      g.push(d.index), p.push(d.index + d[0].length), o.position <= d.index && h < 0 && (h = p.length - 2);
    h < 0 && (h = p.length - 1);
    let v = "";
    const T = Math.min(o.line + s.linesAfter, g.length).toString().length, M = s.maxLength - (s.indent + T + 3);
    for (let P = 1; P <= s.linesBefore && !(h - P < 0); P++) {
      const G = i(
        o.buffer,
        p[h - P],
        g[h - P],
        o.position - (p[h] - p[h - P]),
        M
      );
      v = t.repeat(" ", s.indent) + r((o.line - P + 1).toString(), T) + " | " + G.str + `
` + v;
    }
    const K = i(o.buffer, p[h], g[h], o.position, M);
    v += t.repeat(" ", s.indent) + r((o.line + 1).toString(), T) + " | " + K.str + `
`, v += t.repeat("-", s.indent + T + 3 + K.pos) + `^
`;
    for (let P = 1; P <= s.linesAfter && !(h + P >= g.length); P++) {
      const G = i(
        o.buffer,
        p[h + P],
        g[h + P],
        o.position - (p[h] - p[h + P]),
        M
      );
      v += t.repeat(" ", s.indent) + r((o.line + P + 1).toString(), T) + " | " + G.str + `
`;
    }
    return v.replace(/\n$/, "");
  }
  return pi = l, pi;
}
var hi, tn;
function Y() {
  if (tn) return hi;
  tn = 1;
  const t = Me(), i = [
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
    return s !== null && Object.keys(s).forEach(function(p) {
      s[p].forEach(function(g) {
        c[String(g)] = p;
      });
    }), c;
  }
  function o(s, c) {
    if (c = c || {}, Object.keys(c).forEach(function(p) {
      if (i.indexOf(p) === -1)
        throw new t('Unknown option "' + p + '" is met in definition of "' + s + '" YAML type.');
    }), this.options = c, this.tag = s, this.kind = c.kind || null, this.resolve = c.resolve || function() {
      return !0;
    }, this.construct = c.construct || function(p) {
      return p;
    }, this.instanceOf = c.instanceOf || null, this.predicate = c.predicate || null, this.represent = c.represent || null, this.representName = c.representName || null, this.defaultStyle = c.defaultStyle || null, this.multi = c.multi || !1, this.styleAliases = l(c.styleAliases || null), r.indexOf(this.kind) === -1)
      throw new t('Unknown kind "' + this.kind + '" is specified for "' + s + '" YAML type.');
  }
  return hi = o, hi;
}
var fi, rn;
function Mn() {
  if (rn) return fi;
  rn = 1;
  const t = Me(), i = Y();
  function r(s, c) {
    const p = [];
    return s[c].forEach(function(g) {
      let d = p.length;
      p.forEach(function(h, v) {
        h.tag === g.tag && h.kind === g.kind && h.multi === g.multi && (d = v);
      }), p[d] = g;
    }), p;
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
    function c(p) {
      p.multi ? (s.multi[p.kind].push(p), s.multi.fallback.push(p)) : s[p.kind][p.tag] = s.fallback[p.tag] = p;
    }
    for (let p = 0, g = arguments.length; p < g; p += 1)
      arguments[p].forEach(c);
    return s;
  }
  function o(s) {
    return this.extend(s);
  }
  return o.prototype.extend = function(c) {
    let p = [], g = [];
    if (c instanceof i)
      g.push(c);
    else if (Array.isArray(c))
      g = g.concat(c);
    else if (c && (Array.isArray(c.implicit) || Array.isArray(c.explicit)))
      c.implicit && (p = p.concat(c.implicit)), c.explicit && (g = g.concat(c.explicit));
    else
      throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    p.forEach(function(h) {
      if (!(h instanceof i))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), g.forEach(function(h) {
      if (!(h instanceof i))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const d = Object.create(o.prototype);
    return d.implicit = (this.implicit || []).concat(p), d.explicit = (this.explicit || []).concat(g), d.compiledImplicit = r(d, "implicit"), d.compiledExplicit = r(d, "explicit"), d.compiledTypeMap = l(d.compiledImplicit, d.compiledExplicit), d;
  }, fi = o, fi;
}
var mi, on;
function Nn() {
  if (on) return mi;
  on = 1;
  const t = Y();
  return mi = new t("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(i) {
      return i !== null ? i : "";
    }
  }), mi;
}
var gi, ln;
function Ln() {
  if (ln) return gi;
  ln = 1;
  const t = Y();
  return gi = new t("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(i) {
      return i !== null ? i : [];
    }
  }), gi;
}
var yi, sn;
function Rn() {
  if (sn) return yi;
  sn = 1;
  const t = Y();
  return yi = new t("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(i) {
      return i !== null ? i : {};
    }
  }), yi;
}
var bi, cn;
function Pn() {
  if (cn) return bi;
  cn = 1;
  const t = Mn();
  return bi = new t({
    explicit: [
      Nn(),
      Ln(),
      Rn()
    ]
  }), bi;
}
var _i, an;
function Dn() {
  if (an) return _i;
  an = 1;
  const t = Y();
  function i(o) {
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
  return _i = new t("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: i,
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
  }), _i;
}
var vi, un;
function qn() {
  if (un) return vi;
  un = 1;
  const t = Y();
  function i(o) {
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
  return vi = new t("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: i,
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
  }), vi;
}
var Ai, dn;
function Fn() {
  if (dn) return Ai;
  dn = 1;
  const t = Ie(), i = Y();
  function r(d) {
    return d >= 48 && d <= 57 || d >= 65 && d <= 70 || d >= 97 && d <= 102;
  }
  function l(d) {
    return d >= 48 && d <= 55;
  }
  function o(d) {
    return d >= 48 && d <= 57;
  }
  function s(d) {
    if (d === null) return !1;
    const h = d.length;
    let v = 0, T = !1;
    if (!h) return !1;
    let M = d[v];
    if ((M === "-" || M === "+") && (M = d[++v]), M === "0") {
      if (v + 1 === h) return !0;
      if (M = d[++v], M === "b") {
        for (v++; v < h; v++) {
          if (M = d[v], M !== "0" && M !== "1") return !1;
          T = !0;
        }
        return T && isFinite(c(d));
      }
      if (M === "x") {
        for (v++; v < h; v++) {
          if (!r(d.charCodeAt(v))) return !1;
          T = !0;
        }
        return T && isFinite(c(d));
      }
      if (M === "o") {
        for (v++; v < h; v++) {
          if (!l(d.charCodeAt(v))) return !1;
          T = !0;
        }
        return T && isFinite(c(d));
      }
    }
    for (; v < h; v++) {
      if (!o(d.charCodeAt(v)))
        return !1;
      T = !0;
    }
    return T ? isFinite(c(d)) : !1;
  }
  function c(d) {
    let h = d, v = 1, T = h[0];
    if ((T === "-" || T === "+") && (T === "-" && (v = -1), h = h.slice(1), T = h[0]), h === "0") return 0;
    if (T === "0") {
      if (h[1] === "b") return v * parseInt(h.slice(2), 2);
      if (h[1] === "x") return v * parseInt(h.slice(2), 16);
      if (h[1] === "o") return v * parseInt(h.slice(2), 8);
    }
    return v * parseInt(h, 10);
  }
  function p(d) {
    return c(d);
  }
  function g(d) {
    return Object.prototype.toString.call(d) === "[object Number]" && d % 1 === 0 && !t.isNegativeZero(d);
  }
  return Ai = new i("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: s,
    construct: p,
    predicate: g,
    represent: {
      binary: function(d) {
        return d >= 0 ? "0b" + d.toString(2) : "-0b" + d.toString(2).slice(1);
      },
      octal: function(d) {
        return d >= 0 ? "0o" + d.toString(8) : "-0o" + d.toString(8).slice(1);
      },
      decimal: function(d) {
        return d.toString(10);
      },
      hexadecimal: function(d) {
        return d >= 0 ? "0x" + d.toString(16).toUpperCase() : "-0x" + d.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Ai;
}
var xi, pn;
function Un() {
  if (pn) return xi;
  pn = 1;
  const t = Ie(), i = Y(), r = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), l = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function o(d) {
    return d === null || !r.test(d) ? !1 : isFinite(parseFloat(d, 10)) ? !0 : l.test(d);
  }
  function s(d) {
    let h = d.toLowerCase();
    const v = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? v === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : v * parseFloat(h, 10);
  }
  const c = /^[-+]?[0-9]+e/;
  function p(d, h) {
    if (isNaN(d))
      switch (h) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === d)
      switch (h) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === d)
      switch (h) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (t.isNegativeZero(d))
      return "-0.0";
    const v = d.toString(10);
    return c.test(v) ? v.replace("e", ".e") : v;
  }
  function g(d) {
    return Object.prototype.toString.call(d) === "[object Number]" && (d % 1 !== 0 || t.isNegativeZero(d));
  }
  return xi = new i("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: o,
    construct: s,
    predicate: g,
    represent: p,
    defaultStyle: "lowercase"
  }), xi;
}
var $i, hn;
function Hn() {
  return hn || (hn = 1, $i = Pn().extend({
    implicit: [
      Dn(),
      qn(),
      Fn(),
      Un()
    ]
  })), $i;
}
var wi, fn;
function Yn() {
  return fn || (fn = 1, wi = Hn()), wi;
}
var Si, mn;
function Bn() {
  if (mn) return Si;
  mn = 1;
  const t = Y(), i = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), r = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function l(c) {
    return c === null ? !1 : i.exec(c) !== null || r.exec(c) !== null;
  }
  function o(c) {
    let p = 0, g = null, d = i.exec(c);
    if (d === null && (d = r.exec(c)), d === null) throw new Error("Date resolve error");
    const h = +d[1], v = +d[2] - 1, T = +d[3];
    if (!d[4])
      return new Date(Date.UTC(h, v, T));
    const M = +d[4], K = +d[5], P = +d[6];
    if (d[7]) {
      for (p = d[7].slice(0, 3); p.length < 3; )
        p += "0";
      p = +p;
    }
    if (d[9]) {
      const oe = +d[10], j = +(d[11] || 0);
      g = (oe * 60 + j) * 6e4, d[9] === "-" && (g = -g);
    }
    const G = new Date(Date.UTC(h, v, T, M, K, P, p));
    return g && G.setTime(G.getTime() - g), G;
  }
  function s(c) {
    return c.toISOString();
  }
  return Si = new t("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: l,
    construct: o,
    instanceOf: Date,
    represent: s
  }), Si;
}
var ki, gn;
function jn() {
  if (gn) return ki;
  gn = 1;
  const t = Y();
  function i(r) {
    return r === "<<" || r === null;
  }
  return ki = new t("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: i
  }), ki;
}
var Ei, yn;
function zn() {
  if (yn) return Ei;
  yn = 1;
  const t = Y(), i = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(c) {
    if (c === null) return !1;
    let p = 0;
    const g = c.length, d = i;
    for (let h = 0; h < g; h++) {
      const v = d.indexOf(c.charAt(h));
      if (!(v > 64)) {
        if (v < 0) return !1;
        p += 6;
      }
    }
    return p % 8 === 0;
  }
  function l(c) {
    const p = c.replace(/[\r\n=]/g, ""), g = p.length, d = i;
    let h = 0;
    const v = [];
    for (let M = 0; M < g; M++)
      M % 4 === 0 && M && (v.push(h >> 16 & 255), v.push(h >> 8 & 255), v.push(h & 255)), h = h << 6 | d.indexOf(p.charAt(M));
    const T = g % 4 * 6;
    return T === 0 ? (v.push(h >> 16 & 255), v.push(h >> 8 & 255), v.push(h & 255)) : T === 18 ? (v.push(h >> 10 & 255), v.push(h >> 2 & 255)) : T === 12 && v.push(h >> 4 & 255), new Uint8Array(v);
  }
  function o(c) {
    let p = "", g = 0;
    const d = c.length, h = i;
    for (let T = 0; T < d; T++)
      T % 3 === 0 && T && (p += h[g >> 18 & 63], p += h[g >> 12 & 63], p += h[g >> 6 & 63], p += h[g & 63]), g = (g << 8) + c[T];
    const v = d % 3;
    return v === 0 ? (p += h[g >> 18 & 63], p += h[g >> 12 & 63], p += h[g >> 6 & 63], p += h[g & 63]) : v === 2 ? (p += h[g >> 10 & 63], p += h[g >> 4 & 63], p += h[g << 2 & 63], p += h[64]) : v === 1 && (p += h[g >> 2 & 63], p += h[g << 4 & 63], p += h[64], p += h[64]), p;
  }
  function s(c) {
    return Object.prototype.toString.call(c) === "[object Uint8Array]";
  }
  return Ei = new t("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: l,
    predicate: s,
    represent: o
  }), Ei;
}
var Ci, bn;
function Kn() {
  if (bn) return Ci;
  bn = 1;
  const t = Y(), i = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function l(s) {
    if (s === null) return !0;
    const c = {}, p = s;
    for (let g = 0, d = p.length; g < d; g += 1) {
      const h = p[g];
      let v = !1;
      if (r.call(h) !== "[object Object]") return !1;
      let T;
      for (T in h)
        if (i.call(h, T))
          if (!v) v = !0;
          else return !1;
      if (!v || i.call(c, T)) return !1;
      Object.defineProperty(c, T, { value: !0 });
    }
    return !0;
  }
  function o(s) {
    return s !== null ? s : [];
  }
  return Ci = new t("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: l,
    construct: o
  }), Ci;
}
var Ti, _n;
function Jn() {
  if (_n) return Ti;
  _n = 1;
  const t = Y(), i = Object.prototype.toString;
  function r(o) {
    if (o === null) return !0;
    const s = o, c = new Array(s.length);
    for (let p = 0, g = s.length; p < g; p += 1) {
      const d = s[p];
      if (i.call(d) !== "[object Object]") return !1;
      const h = Object.keys(d);
      if (h.length !== 1) return !1;
      c[p] = [h[0], d[h[0]]];
    }
    return !0;
  }
  function l(o) {
    if (o === null) return [];
    const s = o, c = new Array(s.length);
    for (let p = 0, g = s.length; p < g; p += 1) {
      const d = s[p], h = Object.keys(d);
      c[p] = [h[0], d[h[0]]];
    }
    return c;
  }
  return Ti = new t("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: l
  }), Ti;
}
var Oi, vn;
function Wn() {
  if (vn) return Oi;
  vn = 1;
  const t = Y(), i = Object.prototype.hasOwnProperty;
  function r(o) {
    if (o === null) return !0;
    const s = o;
    for (const c in s)
      if (i.call(s, c) && s[c] !== null)
        return !1;
    return !0;
  }
  function l(o) {
    return o !== null ? o : {};
  }
  return Oi = new t("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: l
  }), Oi;
}
var Ii, An;
function Ui() {
  return An || (An = 1, Ii = Yn().extend({
    implicit: [
      Bn(),
      jn()
    ],
    explicit: [
      zn(),
      Kn(),
      Jn(),
      Wn()
    ]
  })), Ii;
}
var xn;
function $t() {
  if (xn) return Ke;
  xn = 1;
  const t = Ie(), i = Me(), r = xt(), l = Ui(), o = Object.prototype.hasOwnProperty, s = 1, c = 2, p = 3, g = 4, d = 1, h = 2, v = 3, T = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, M = /[\x85\u2028\u2029]/, K = /[,\[\]{}]/, P = /^(?:!|!!|![0-9A-Za-z-]+!)$/, G = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function oe(e) {
    return Object.prototype.toString.call(e);
  }
  function j(e) {
    return e === 10 || e === 13;
  }
  function z(e) {
    return e === 9 || e === 32;
  }
  function U(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function ie(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function ii(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const a = e | 32;
    return a >= 97 && a <= 102 ? a - 97 + 10 : -1;
  }
  function ni(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function Ne(e) {
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
  function ti(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function be(e, a, m) {
    a === "__proto__" ? Object.defineProperty(e, a, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: m
    }) : e[a] = m;
  }
  const Le = new Array(256), _e = new Array(256);
  for (let e = 0; e < 256; e++)
    Le[e] = ye(e) ? 1 : 0, _e[e] = ye(e);
  function q(e, a) {
    this.input = e, this.filename = a.filename || null, this.schema = a.schema || l, this.onWarning = a.onWarning || null, this.legacy = a.legacy || !1, this.json = a.json || !1, this.listener = a.listener || null, this.maxDepth = typeof a.maxDepth == "number" ? a.maxDepth : 100, this.maxTotalMergeKeys = typeof a.maxTotalMergeKeys == "number" ? a.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function Re(e, a) {
    const m = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return m.snippet = r(m), new i(a, m);
  }
  function E(e, a) {
    throw Re(e, a);
  }
  function ue(e, a) {
    e.onWarning && e.onWarning.call(null, Re(e, a));
  }
  function V(e, a, m) {
    const _ = e.anchorMapTransactions;
    if (_.length !== 0) {
      const f = _[_.length - 1];
      o.call(f, a) || (f[a] = {
        existed: o.call(e.anchorMap, a),
        value: e.anchorMap[a]
      });
    }
    e.anchorMap[a] = m;
  }
  function ri(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function le(e) {
    const a = e.anchorMapTransactions.pop(), m = e.anchorMapTransactions;
    if (m.length === 0) return;
    const _ = m[m.length - 1], f = Object.keys(a);
    for (let w = 0, n = f.length; w < n; w += 1) {
      const u = f[w];
      o.call(_, u) || (_[u] = a[u]);
    }
  }
  function oi(e) {
    const a = e.anchorMapTransactions.pop(), m = Object.keys(a);
    for (let _ = m.length - 1; _ >= 0; _ -= 1) {
      const f = a[m[_]];
      f.existed ? e.anchorMap[m[_]] = f.value : delete e.anchorMap[m[_]];
    }
  }
  function ve(e) {
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
  function de(e, a) {
    e.position = a.position, e.line = a.line, e.lineStart = a.lineStart, e.lineIndent = a.lineIndent, e.firstTabInLine = a.firstTabInLine, e.tag = a.tag, e.anchor = a.anchor, e.kind = a.kind, e.result = a.result;
  }
  const Pe = {
    YAML: function(a, m, _) {
      a.version !== null && E(a, "duplication of %YAML directive"), _.length !== 1 && E(a, "YAML directive accepts exactly one argument");
      const f = /^([0-9]+)\.([0-9]+)$/.exec(_[0]);
      f === null && E(a, "ill-formed argument of the YAML directive");
      const w = parseInt(f[1], 10), n = parseInt(f[2], 10);
      w !== 1 && E(a, "unacceptable YAML version of the document"), a.version = _[0], a.checkLineBreaks = n < 2, n !== 1 && n !== 2 && ue(a, "unsupported YAML version of the document");
    },
    TAG: function(a, m, _) {
      let f;
      _.length !== 2 && E(a, "TAG directive accepts exactly two arguments");
      const w = _[0];
      f = _[1], P.test(w) || E(a, "ill-formed tag handle (first argument) of the TAG directive"), o.call(a.tagMap, w) && E(a, 'there is a previously declared suffix for "' + w + '" tag handle'), G.test(f) || E(a, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        f = decodeURIComponent(f);
      } catch {
        E(a, "tag prefix is malformed: " + f);
      }
      a.tagMap[w] = f;
    }
  };
  function J(e, a, m, _) {
    if (a < m) {
      const f = e.input.slice(a, m);
      if (_)
        for (let w = 0, n = f.length; w < n; w += 1) {
          const u = f.charCodeAt(w);
          u === 9 || u >= 32 && u <= 1114111 || E(e, "expected valid JSON character");
        }
      else T.test(f) && E(e, "the stream contains non-printable characters");
      e.result += f;
    }
  }
  function ne(e, a, m, _) {
    t.isObject(m) || E(e, "cannot merge mappings; the provided source object is unacceptable");
    const f = Object.keys(m);
    for (let w = 0, n = f.length; w < n; w += 1) {
      const u = f[w];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && E(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), o.call(a, u) || (be(a, u, m[u]), _[u] = !0);
    }
  }
  function Q(e, a, m, _, f, w, n, u, x) {
    if (Array.isArray(f)) {
      f = Array.prototype.slice.call(f);
      for (let y = 0, b = f.length; y < b; y += 1)
        Array.isArray(f[y]) && E(e, "nested arrays are not supported inside keys"), typeof f == "object" && oe(f[y]) === "[object Object]" && (f[y] = "[object Object]");
    }
    if (typeof f == "object" && oe(f) === "[object Object]" && (f = "[object Object]"), f = String(f), a === null && (a = {}), _ === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let y = 0, b = w.length; y < b; y += 1)
          ne(e, a, w[y], m);
      else
        ne(e, a, w, m);
    else
      !e.json && !o.call(m, f) && o.call(a, f) && (e.line = n || e.line, e.lineStart = u || e.lineStart, e.position = x || e.position, E(e, "duplicated mapping key")), be(a, f, w), delete m[f];
    return a;
  }
  function pe(e) {
    const a = e.input.charCodeAt(e.position);
    a === 10 ? e.position++ : a === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : E(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function D(e, a, m) {
    let _ = 0, f = e.input.charCodeAt(e.position);
    for (; f !== 0; ) {
      for (; z(f); )
        f === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), f = e.input.charCodeAt(++e.position);
      if (a && f === 35)
        do
          f = e.input.charCodeAt(++e.position);
        while (f !== 10 && f !== 13 && f !== 0);
      if (j(f))
        for (pe(e), f = e.input.charCodeAt(e.position), _++, e.lineIndent = 0; f === 32; )
          e.lineIndent++, f = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return m !== -1 && _ !== 0 && e.lineIndent < m && ue(e, "deficient indentation"), _;
  }
  function he(e) {
    let a = e.position, m = e.input.charCodeAt(a);
    return !!((m === 45 || m === 46) && m === e.input.charCodeAt(a + 1) && m === e.input.charCodeAt(a + 2) && (a += 3, m = e.input.charCodeAt(a), m === 0 || U(m)));
  }
  function Z(e, a) {
    a === 1 ? e.result += " " : a > 1 && (e.result += t.repeat(`
`, a - 1));
  }
  function De(e, a, m) {
    let _, f, w, n, u, x;
    const y = e.kind, b = e.result;
    let $ = e.input.charCodeAt(e.position);
    if (U($) || ie($) || $ === 35 || $ === 38 || $ === 42 || $ === 33 || $ === 124 || $ === 62 || $ === 39 || $ === 34 || $ === 37 || $ === 64 || $ === 96)
      return !1;
    if ($ === 63 || $ === 45) {
      const A = e.input.charCodeAt(e.position + 1);
      if (U(A) || m && ie(A))
        return !1;
    }
    for (e.kind = "scalar", e.result = "", _ = f = e.position, w = !1; $ !== 0; ) {
      if ($ === 58) {
        const A = e.input.charCodeAt(e.position + 1);
        if (U(A) || m && ie(A))
          break;
      } else if ($ === 35) {
        const A = e.input.charCodeAt(e.position - 1);
        if (U(A))
          break;
      } else {
        if (e.position === e.lineStart && he(e) || m && ie($))
          break;
        if (j($))
          if (n = e.line, u = e.lineStart, x = e.lineIndent, D(e, !1, -1), e.lineIndent >= a) {
            w = !0, $ = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = f, e.line = n, e.lineStart = u, e.lineIndent = x;
            break;
          }
      }
      w && (J(e, _, f, !1), Z(e, e.line - n), _ = f = e.position, w = !1), z($) || (f = e.position + 1), $ = e.input.charCodeAt(++e.position);
    }
    return J(e, _, f, !1), e.result ? !0 : (e.kind = y, e.result = b, !1);
  }
  function qe(e, a) {
    let m, _, f = e.input.charCodeAt(e.position);
    if (f !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, m = _ = e.position; (f = e.input.charCodeAt(e.position)) !== 0; )
      if (f === 39)
        if (J(e, m, e.position, !0), f = e.input.charCodeAt(++e.position), f === 39)
          m = e.position, e.position++, _ = e.position;
        else
          return !0;
      else j(f) ? (J(e, m, _, !0), Z(e, D(e, !1, a)), m = _ = e.position) : e.position === e.lineStart && he(e) ? E(e, "unexpected end of the document within a single quoted scalar") : (e.position++, z(f) || (_ = e.position));
    E(e, "unexpected end of the stream within a single quoted scalar");
  }
  function Ae(e, a) {
    let m, _, f, w = e.input.charCodeAt(e.position);
    if (w !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, m = _ = e.position; (w = e.input.charCodeAt(e.position)) !== 0; ) {
      if (w === 34)
        return J(e, m, e.position, !0), e.position++, !0;
      if (w === 92) {
        if (J(e, m, e.position, !0), w = e.input.charCodeAt(++e.position), j(w))
          D(e, !1, a);
        else if (w < 256 && Le[w])
          e.result += _e[w], e.position++;
        else if ((f = ni(w)) > 0) {
          let n = f, u = 0;
          for (; n > 0; n--)
            w = e.input.charCodeAt(++e.position), (f = ii(w)) >= 0 ? u = (u << 4) + f : E(e, "expected hexadecimal character");
          e.result += ti(u), e.position++;
        } else
          E(e, "unknown escape sequence");
        m = _ = e.position;
      } else j(w) ? (J(e, m, _, !0), Z(e, D(e, !1, a)), m = _ = e.position) : e.position === e.lineStart && he(e) ? E(e, "unexpected end of the document within a double quoted scalar") : (e.position++, z(w) || (_ = e.position));
    }
    E(e, "unexpected end of the stream within a double quoted scalar");
  }
  function Fe(e, a) {
    let m = !0, _, f, w;
    const n = e.tag;
    let u;
    const x = e.anchor;
    let y, b, $, A;
    const k = /* @__PURE__ */ Object.create(null);
    let S, C, O, N = e.input.charCodeAt(e.position);
    if (N === 91)
      y = 93, A = !1, u = [];
    else if (N === 123)
      y = 125, A = !0, u = {};
    else
      return !1;
    for (e.anchor !== null && V(e, e.anchor, u), N = e.input.charCodeAt(++e.position); N !== 0; ) {
      if (D(e, !0, a), N = e.input.charCodeAt(e.position), N === y)
        return e.position++, e.tag = n, e.anchor = x, e.kind = A ? "mapping" : "sequence", e.result = u, !0;
      if (m ? N === 44 && E(e, "expected the node content, but found ','") : E(e, "missed comma between flow collection entries"), C = S = O = null, b = $ = !1, N === 63) {
        const R = e.input.charCodeAt(e.position + 1);
        U(R) && (b = $ = !0, e.position++, D(e, !0, a));
      }
      _ = e.line, f = e.lineStart, w = e.position, ee(e, a, s, !1, !0), C = e.tag, S = e.result, D(e, !0, a), N = e.input.charCodeAt(e.position), ($ || e.line === _) && N === 58 && (b = !0, N = e.input.charCodeAt(++e.position), D(e, !0, a), ee(e, a, s, !1, !0), O = e.result), A ? Q(e, u, k, C, S, O, _, f, w) : b ? u.push(Q(e, null, k, C, S, O, _, f, w)) : u.push(S), D(e, !0, a), N = e.input.charCodeAt(e.position), N === 44 ? (m = !0, N = e.input.charCodeAt(++e.position)) : m = !1;
    }
    E(e, "unexpected end of the stream within a flow collection");
  }
  function Ue(e, a) {
    let m, _ = d, f = !1, w = !1, n = a, u = 0, x = !1, y, b = e.input.charCodeAt(e.position);
    if (b === 124)
      m = !1;
    else if (b === 62)
      m = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; b !== 0; )
      if (b = e.input.charCodeAt(++e.position), b === 43 || b === 45)
        d === _ ? _ = b === 43 ? v : h : E(e, "repeat of a chomping mode identifier");
      else if ((y = Ne(b)) >= 0)
        y === 0 ? E(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : w ? E(e, "repeat of an indentation width identifier") : (n = a + y - 1, w = !0);
      else
        break;
    if (z(b)) {
      do
        b = e.input.charCodeAt(++e.position);
      while (z(b));
      if (b === 35)
        do
          b = e.input.charCodeAt(++e.position);
        while (!j(b) && b !== 0);
    }
    for (; b !== 0; ) {
      for (pe(e), e.lineIndent = 0, b = e.input.charCodeAt(e.position); (!w || e.lineIndent < n) && b === 32; )
        e.lineIndent++, b = e.input.charCodeAt(++e.position);
      if (!w && e.lineIndent > n && (n = e.lineIndent), j(b)) {
        u++;
        continue;
      }
      if (!w && n === 0 && E(e, "missing indentation for block scalar"), e.lineIndent < n) {
        _ === v ? e.result += t.repeat(`
`, f ? 1 + u : u) : _ === d && f && (e.result += `
`);
        break;
      }
      m ? z(b) ? (x = !0, e.result += t.repeat(`
`, f ? 1 + u : u)) : x ? (x = !1, e.result += t.repeat(`
`, u + 1)) : u === 0 ? f && (e.result += " ") : e.result += t.repeat(`
`, u) : e.result += t.repeat(`
`, f ? 1 + u : u), f = !0, w = !0, u = 0;
      const $ = e.position;
      for (; !j(b) && b !== 0; )
        b = e.input.charCodeAt(++e.position);
      J(e, $, e.position, !1);
    }
    return !0;
  }
  function X(e, a) {
    const m = e.tag, _ = e.anchor, f = [];
    let w = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && V(e, e.anchor, f);
    let n = e.input.charCodeAt(e.position);
    for (; n !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation")), n === 45); ) {
      const u = e.input.charCodeAt(e.position + 1);
      if (!U(u))
        break;
      if (w = !0, e.position++, D(e, !0, -1) && e.lineIndent <= a) {
        f.push(null), n = e.input.charCodeAt(e.position);
        continue;
      }
      const x = e.line;
      if (ee(e, a, p, !1, !0), f.push(e.result), D(e, !0, -1), n = e.input.charCodeAt(e.position), (e.line === x || e.lineIndent > a) && n !== 0)
        E(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < a)
        break;
    }
    return w ? (e.tag = m, e.anchor = _, e.kind = "sequence", e.result = f, !0) : !1;
  }
  function He(e, a, m) {
    let _, f, w, n;
    const u = e.tag, x = e.anchor, y = {}, b = /* @__PURE__ */ Object.create(null);
    let $ = null, A = null, k = null, S = !1, C = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && V(e, e.anchor, y);
    let O = e.input.charCodeAt(e.position);
    for (; O !== 0; ) {
      !S && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation"));
      const N = e.input.charCodeAt(e.position + 1), R = e.line;
      if ((O === 63 || O === 58) && U(N))
        O === 63 ? (S && (Q(e, y, b, $, A, null, f, w, n), $ = A = k = null), C = !0, S = !0, _ = !0) : S ? (S = !1, _ = !0) : E(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, O = N;
      else {
        if (f = e.line, w = e.lineStart, n = e.position, !ee(e, m, c, !1, !0))
          break;
        if (e.line === R) {
          for (O = e.input.charCodeAt(e.position); z(O); )
            O = e.input.charCodeAt(++e.position);
          if (O === 58)
            O = e.input.charCodeAt(++e.position), U(O) || E(e, "a whitespace character is expected after the key-value separator within a block mapping"), S && (Q(e, y, b, $, A, null, f, w, n), $ = A = k = null), C = !0, S = !1, _ = !1, $ = e.tag, A = e.result;
          else if (C)
            E(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = u, e.anchor = x, !0;
        } else if (C)
          E(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = u, e.anchor = x, !0;
      }
      if ((e.line === R || e.lineIndent > a) && (S && (f = e.line, w = e.lineStart, n = e.position), ee(e, a, g, !0, _) && (S ? A = e.result : k = e.result), S || (Q(e, y, b, $, A, k, f, w, n), $ = A = k = null), D(e, !0, -1), O = e.input.charCodeAt(e.position)), (e.line === R || e.lineIndent > a) && O !== 0)
        E(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < a)
        break;
    }
    return S && Q(e, y, b, $, A, null, f, w, n), C && (e.tag = u, e.anchor = x, e.kind = "mapping", e.result = y), C;
  }
  function li(e) {
    let a = !1, m = !1, _, f, w = e.input.charCodeAt(e.position);
    if (w !== 33) return !1;
    e.tag !== null && E(e, "duplication of a tag property"), w = e.input.charCodeAt(++e.position), w === 60 ? (a = !0, w = e.input.charCodeAt(++e.position)) : w === 33 ? (m = !0, _ = "!!", w = e.input.charCodeAt(++e.position)) : _ = "!";
    let n = e.position;
    if (a) {
      do
        w = e.input.charCodeAt(++e.position);
      while (w !== 0 && w !== 62);
      e.position < e.length ? (f = e.input.slice(n, e.position), w = e.input.charCodeAt(++e.position)) : E(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; w !== 0 && !U(w); )
        w === 33 && (m ? E(e, "tag suffix cannot contain exclamation marks") : (_ = e.input.slice(n - 1, e.position + 1), P.test(_) || E(e, "named tag handle cannot contain such characters"), m = !0, n = e.position + 1)), w = e.input.charCodeAt(++e.position);
      f = e.input.slice(n, e.position), K.test(f) && E(e, "tag suffix cannot contain flow indicator characters");
    }
    f && !G.test(f) && E(e, "tag name cannot contain such characters: " + f);
    try {
      f = decodeURIComponent(f);
    } catch {
      E(e, "tag name is malformed: " + f);
    }
    return a ? e.tag = f : o.call(e.tagMap, _) ? e.tag = e.tagMap[_] + f : _ === "!" ? e.tag = "!" + f : _ === "!!" ? e.tag = "tag:yaml.org,2002:" + f : E(e, 'undeclared tag handle "' + _ + '"'), !0;
  }
  function Ye(e) {
    let a = e.input.charCodeAt(e.position);
    if (a !== 38) return !1;
    e.anchor !== null && E(e, "duplication of an anchor property"), a = e.input.charCodeAt(++e.position);
    const m = e.position;
    for (; a !== 0 && !U(a) && !ie(a); )
      a = e.input.charCodeAt(++e.position);
    return e.position === m && E(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(m, e.position), !0;
  }
  function Be(e) {
    let a = e.input.charCodeAt(e.position);
    if (a !== 42) return !1;
    a = e.input.charCodeAt(++e.position);
    const m = e.position;
    for (; a !== 0 && !U(a) && !ie(a); )
      a = e.input.charCodeAt(++e.position);
    e.position === m && E(e, "name of an alias node must contain at least one character");
    const _ = e.input.slice(m, e.position);
    return o.call(e.anchorMap, _) || E(e, 'unidentified alias "' + _ + '"'), e.result = e.anchorMap[_], D(e, !0, -1), !0;
  }
  function si(e, a, m, _) {
    const f = ve(e);
    return ri(e), de(e, a), e.tag = null, e.anchor = null, e.kind = null, e.result = null, He(e, m, _) && e.kind === "mapping" ? (le(e), !0) : (oi(e), de(e, f), !1);
  }
  function ee(e, a, m, _, f) {
    let w, n, u = 1, x = !1, y = !1, b = null, $, A, k;
    e.depth >= e.maxDepth && E(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const S = w = n = g === m || p === m;
    if (_ && D(e, !0, -1) && (x = !0, e.lineIndent > a ? u = 1 : e.lineIndent === a ? u = 0 : e.lineIndent < a && (u = -1)), u === 1)
      for (; ; ) {
        const C = e.input.charCodeAt(e.position), O = ve(e);
        if (x && (C === 33 && e.tag !== null || C === 38 && e.anchor !== null) || !li(e) && !Ye(e))
          break;
        b === null && (b = O), D(e, !0, -1) ? (x = !0, n = S, e.lineIndent > a ? u = 1 : e.lineIndent === a ? u = 0 : e.lineIndent < a && (u = -1)) : n = !1;
      }
    if (n && (n = x || f), u === 1 || g === m)
      if (s === m || c === m ? A = a : A = a + 1, k = e.position - e.lineStart, u === 1)
        if (n && (X(e, k) || He(e, k, A)) || Fe(e, A))
          y = !0;
        else {
          const C = e.input.charCodeAt(e.position);
          b !== null && S && !n && C !== 124 && C !== 62 && si(
            e,
            b,
            b.position - b.lineStart,
            A
          ) || w && Ue(e, A) || qe(e, A) || Ae(e, A) ? y = !0 : Be(e) ? (y = !0, (e.tag !== null || e.anchor !== null) && E(e, "alias node should not have any properties")) : De(e, A, s === m) && (y = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && V(e, e.anchor, e.result);
        }
      else u === 0 && (y = n && X(e, k));
    if (e.tag === null)
      e.anchor !== null && V(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && E(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let C = 0, O = e.implicitTypes.length; C < O; C += 1)
        if ($ = e.implicitTypes[C], $.resolve(e.result)) {
          e.result = $.construct(e.result), e.tag = $.tag, e.anchor !== null && V(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (o.call(e.typeMap[e.kind || "fallback"], e.tag))
        $ = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        $ = null;
        const C = e.typeMap.multi[e.kind || "fallback"];
        for (let O = 0, N = C.length; O < N; O += 1)
          if (e.tag.slice(0, C[O].tag.length) === C[O].tag) {
            $ = C[O];
            break;
          }
      }
      $ || E(e, "unknown tag !<" + e.tag + ">"), e.result !== null && $.kind !== e.kind && E(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + $.kind + '", not "' + e.kind + '"'), $.resolve(e.result, e.tag) ? (e.result = $.construct(e.result, e.tag), e.anchor !== null && V(e, e.anchor, e.result)) : E(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || y;
  }
  function ci(e) {
    const a = e.position;
    let m = !1, _;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (_ = e.input.charCodeAt(e.position)) !== 0 && (D(e, !0, -1), _ = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || _ !== 37)); ) {
      m = !0, _ = e.input.charCodeAt(++e.position);
      let f = e.position;
      for (; _ !== 0 && !U(_); )
        _ = e.input.charCodeAt(++e.position);
      const w = e.input.slice(f, e.position), n = [];
      for (w.length < 1 && E(e, "directive name must not be less than one character in length"); _ !== 0; ) {
        for (; z(_); )
          _ = e.input.charCodeAt(++e.position);
        if (_ === 35) {
          do
            _ = e.input.charCodeAt(++e.position);
          while (_ !== 0 && !j(_));
          break;
        }
        if (j(_)) break;
        for (f = e.position; _ !== 0 && !U(_); )
          _ = e.input.charCodeAt(++e.position);
        n.push(e.input.slice(f, e.position));
      }
      _ !== 0 && pe(e), o.call(Pe, w) ? Pe[w](e, w, n) : ue(e, 'unknown document directive "' + w + '"');
    }
    if (D(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, D(e, !0, -1)) : m && E(e, "directives end mark is expected"), ee(e, e.lineIndent - 1, g, !1, !0), D(e, !0, -1), e.checkLineBreaks && M.test(e.input.slice(a, e.position)) && ue(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && he(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, D(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && E(e, "end of the stream or a document separator is expected");
  }
  function je(e, a) {
    e = String(e), a = a || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const m = new q(e, a), _ = e.indexOf("\0");
    for (_ !== -1 && (m.position = _, E(m, "null byte is not allowed in input")), m.input += "\0"; m.input.charCodeAt(m.position) === 32; )
      m.lineIndent += 1, m.position += 1;
    for (; m.position < m.length - 1; )
      ci(m);
    return m.documents;
  }
  function ze(e, a, m) {
    a !== null && typeof a == "object" && typeof m > "u" && (m = a, a = null);
    const _ = je(e, m);
    if (typeof a != "function")
      return _;
    for (let f = 0, w = _.length; f < w; f += 1)
      a(_[f]);
  }
  function ai(e, a) {
    const m = je(e, a);
    if (m.length !== 0) {
      if (m.length === 1)
        return m[0];
      throw new i("expected a single document in the stream, but found more");
    }
  }
  return Ke.loadAll = ze, Ke.load = ai, Ke;
}
var Mi = {}, $n;
function wt() {
  if ($n) return Mi;
  $n = 1;
  const t = Ie(), i = Me(), r = Ui(), l = Object.prototype.toString, o = Object.prototype.hasOwnProperty, s = 65279, c = 9, p = 10, g = 13, d = 32, h = 33, v = 34, T = 35, M = 37, K = 38, P = 39, G = 42, oe = 44, j = 45, z = 58, U = 61, ie = 62, ii = 63, ni = 64, Ne = 91, ye = 93, ti = 96, be = 123, Le = 124, _e = 125, q = {};
  q[0] = "\\0", q[7] = "\\a", q[8] = "\\b", q[9] = "\\t", q[10] = "\\n", q[11] = "\\v", q[12] = "\\f", q[13] = "\\r", q[27] = "\\e", q[34] = '\\"', q[92] = "\\\\", q[133] = "\\N", q[160] = "\\_", q[8232] = "\\L", q[8233] = "\\P";
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
  function ue(n, u) {
    if (u === null) return {};
    const x = {}, y = Object.keys(u);
    for (let b = 0, $ = y.length; b < $; b += 1) {
      let A = y[b], k = String(u[A]);
      A.slice(0, 2) === "!!" && (A = "tag:yaml.org,2002:" + A.slice(2));
      const S = n.compiledTypeMap.fallback[A];
      S && o.call(S.styleAliases, k) && (k = S.styleAliases[k]), x[A] = k;
    }
    return x;
  }
  function V(n) {
    let u, x;
    const y = n.toString(16).toUpperCase();
    if (n <= 255)
      u = "x", x = 2;
    else if (n <= 65535)
      u = "u", x = 4;
    else if (n <= 4294967295)
      u = "U", x = 8;
    else
      throw new i("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + u + t.repeat("0", x - y.length) + y;
  }
  const ri = 1, le = 2;
  function oi(n) {
    this.schema = n.schema || r, this.indent = Math.max(1, n.indent || 2), this.noArrayIndent = n.noArrayIndent || !1, this.skipInvalid = n.skipInvalid || !1, this.flowLevel = t.isNothing(n.flowLevel) ? -1 : n.flowLevel, this.styleMap = ue(this.schema, n.styles || null), this.sortKeys = n.sortKeys || !1, this.lineWidth = n.lineWidth || 80, this.noRefs = n.noRefs || !1, this.noCompatMode = n.noCompatMode || !1, this.condenseFlow = n.condenseFlow || !1, this.quotingType = n.quotingType === '"' ? le : ri, this.forceQuotes = n.forceQuotes || !1, this.replacer = typeof n.replacer == "function" ? n.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function ve(n, u) {
    const x = t.repeat(" ", u);
    let y = 0, b = "";
    const $ = n.length;
    for (; y < $; ) {
      let A;
      const k = n.indexOf(`
`, y);
      k === -1 ? (A = n.slice(y), y = $) : (A = n.slice(y, k + 1), y = k + 1), A.length && A !== `
` && (b += x), b += A;
    }
    return b;
  }
  function de(n, u) {
    return `
` + t.repeat(" ", n.indent * u);
  }
  function Pe(n, u) {
    for (let x = 0, y = n.implicitTypes.length; x < y; x += 1)
      if (n.implicitTypes[x].resolve(u))
        return !0;
    return !1;
  }
  function J(n) {
    return n === d || n === c;
  }
  function ne(n) {
    return n >= 32 && n <= 126 || n >= 161 && n <= 55295 && n !== 8232 && n !== 8233 || n >= 57344 && n <= 65533 && n !== s || n >= 65536 && n <= 1114111;
  }
  function Q(n) {
    return ne(n) && n !== s && // - b-char
    n !== g && n !== p;
  }
  function pe(n, u, x) {
    const y = Q(n), b = y && !J(n);
    return (
      // ns-plain-safe
      (x ? y : y && // - c-flow-indicator
      n !== oe && n !== Ne && n !== ye && n !== be && n !== _e) && // ns-plain-char
      n !== T && // false on '#'
      !(u === z && !b) || // false on ': '
      Q(u) && !J(u) && n === T || // change to true on '[^ ]#'
      u === z && b
    );
  }
  function D(n) {
    return ne(n) && n !== s && !J(n) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    n !== j && n !== ii && n !== z && n !== oe && n !== Ne && n !== ye && n !== be && n !== _e && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    n !== T && n !== K && n !== G && n !== h && n !== Le && n !== U && n !== ie && n !== P && n !== v && // | “%” | “@” | “`”)
    n !== M && n !== ni && n !== ti;
  }
  function he(n) {
    return !J(n) && n !== z;
  }
  function Z(n, u) {
    const x = n.charCodeAt(u);
    let y;
    return x >= 55296 && x <= 56319 && u + 1 < n.length && (y = n.charCodeAt(u + 1), y >= 56320 && y <= 57343) ? (x - 55296) * 1024 + y - 56320 + 65536 : x;
  }
  function De(n) {
    return /^\n* /.test(n);
  }
  const qe = 1, Ae = 2, Fe = 3, Ue = 4, X = 5;
  function He(n, u, x, y, b, $, A, k) {
    let S, C = 0, O = null, N = !1, R = !1;
    const Hi = y !== -1;
    let xe = -1, $e = D(Z(n, 0)) && he(Z(n, n.length - 1));
    if (u || A)
      for (S = 0; S < n.length; C >= 65536 ? S += 2 : S++) {
        if (C = Z(n, S), !ne(C))
          return X;
        $e = $e && pe(C, O, k), O = C;
      }
    else {
      for (S = 0; S < n.length; C >= 65536 ? S += 2 : S++) {
        if (C = Z(n, S), C === p)
          N = !0, Hi && (R = R || // Foldable line = too long, and not more-indented.
          S - xe - 1 > y && n[xe + 1] !== " ", xe = S);
        else if (!ne(C))
          return X;
        $e = $e && pe(C, O, k), O = C;
      }
      R = R || Hi && S - xe - 1 > y && n[xe + 1] !== " ";
    }
    return !N && !R ? $e && !A && !b(n) ? qe : $ === le ? X : Ae : x > 9 && De(n) ? X : A ? $ === le ? X : Ae : R ? Ue : Fe;
  }
  function li(n, u, x, y, b) {
    n.dump = (function() {
      if (u.length === 0)
        return n.quotingType === le ? '""' : "''";
      if (!n.noCompatMode && (Re.indexOf(u) !== -1 || E.test(u)))
        return n.quotingType === le ? '"' + u + '"' : "'" + u + "'";
      const $ = n.indent * Math.max(1, x), A = n.lineWidth === -1 ? -1 : Math.max(Math.min(n.lineWidth, 40), n.lineWidth - $), k = y || // No block styles in flow mode.
      n.flowLevel > -1 && x >= n.flowLevel;
      function S(C) {
        return Pe(n, C);
      }
      switch (He(
        u,
        k,
        n.indent,
        A,
        S,
        n.quotingType,
        n.forceQuotes && !y,
        b
      )) {
        case qe:
          return u;
        case Ae:
          return "'" + u.replace(/'/g, "''") + "'";
        case Fe:
          return "|" + Ye(u, n.indent) + Be(ve(u, $));
        case Ue:
          return ">" + Ye(u, n.indent) + Be(ve(si(u, A), $));
        case X:
          return '"' + ci(u) + '"';
        default:
          throw new i("impossible error: invalid scalar style");
      }
    })();
  }
  function Ye(n, u) {
    const x = De(n) ? String(u) : "", y = n[n.length - 1] === `
`, $ = y && (n[n.length - 2] === `
` || n === `
`) ? "+" : y ? "" : "-";
    return x + $ + `
`;
  }
  function Be(n) {
    return n[n.length - 1] === `
` ? n.slice(0, -1) : n;
  }
  function si(n, u) {
    const x = /(\n+)([^\n]*)/g;
    let y = (function() {
      let k = n.indexOf(`
`);
      return k = k !== -1 ? k : n.length, x.lastIndex = k, ee(n.slice(0, k), u);
    })(), b = n[0] === `
` || n[0] === " ", $, A;
    for (; A = x.exec(n); ) {
      const k = A[1], S = A[2];
      $ = S[0] === " ", y += k + (!b && !$ && S !== "" ? `
` : "") + ee(S, u), b = $;
    }
    return y;
  }
  function ee(n, u) {
    if (n === "" || n[0] === " ") return n;
    const x = / [^ ]/g;
    let y, b = 0, $, A = 0, k = 0, S = "";
    for (; y = x.exec(n); )
      k = y.index, k - b > u && ($ = A > b ? A : k, S += `
` + n.slice(b, $), b = $ + 1), A = k;
    return S += `
`, n.length - b > u && A > b ? S += n.slice(b, A) + `
` + n.slice(A + 1) : S += n.slice(b), S.slice(1);
  }
  function ci(n) {
    let u = "", x = 0;
    for (let y = 0; y < n.length; x >= 65536 ? y += 2 : y++) {
      x = Z(n, y);
      const b = q[x];
      !b && ne(x) ? (u += n[y], x >= 65536 && (u += n[y + 1])) : u += b || V(x);
    }
    return u;
  }
  function je(n, u, x) {
    let y = "";
    const b = n.tag;
    for (let $ = 0, A = x.length; $ < A; $ += 1) {
      let k = x[$];
      n.replacer && (k = n.replacer.call(x, String($), k)), (m(n, u, k, !1, !1) || typeof k > "u" && m(n, u, null, !1, !1)) && (y !== "" && (y += "," + (n.condenseFlow ? "" : " ")), y += n.dump);
    }
    n.tag = b, n.dump = "[" + y + "]";
  }
  function ze(n, u, x, y) {
    let b = "";
    const $ = n.tag;
    for (let A = 0, k = x.length; A < k; A += 1) {
      let S = x[A];
      n.replacer && (S = n.replacer.call(x, String(A), S)), (m(n, u + 1, S, !0, !0, !1, !0) || typeof S > "u" && m(n, u + 1, null, !0, !0, !1, !0)) && ((!y || b !== "") && (b += de(n, u)), n.dump && p === n.dump.charCodeAt(0) ? b += "-" : b += "- ", b += n.dump);
    }
    n.tag = $, n.dump = b || "[]";
  }
  function ai(n, u, x) {
    let y = "";
    const b = n.tag, $ = Object.keys(x);
    for (let A = 0, k = $.length; A < k; A += 1) {
      let S = "";
      y !== "" && (S += ", "), n.condenseFlow && (S += '"');
      const C = $[A];
      let O = x[C];
      n.replacer && (O = n.replacer.call(x, C, O)), m(n, u, C, !1, !1) && (n.dump.length > 1024 && (S += "? "), S += n.dump + (n.condenseFlow ? '"' : "") + ":" + (n.condenseFlow ? "" : " "), m(n, u, O, !1, !1) && (S += n.dump, y += S));
    }
    n.tag = b, n.dump = "{" + y + "}";
  }
  function e(n, u, x, y) {
    let b = "";
    const $ = n.tag, A = Object.keys(x);
    if (n.sortKeys === !0)
      A.sort();
    else if (typeof n.sortKeys == "function")
      A.sort(n.sortKeys);
    else if (n.sortKeys)
      throw new i("sortKeys must be a boolean or a function");
    for (let k = 0, S = A.length; k < S; k += 1) {
      let C = "";
      (!y || b !== "") && (C += de(n, u));
      const O = A[k];
      let N = x[O];
      if (n.replacer && (N = n.replacer.call(x, O, N)), !m(n, u + 1, O, !0, !0, !0))
        continue;
      const R = n.tag !== null && n.tag !== "?" || n.dump && n.dump.length > 1024;
      R && (n.dump && p === n.dump.charCodeAt(0) ? C += "?" : C += "? "), C += n.dump, R && (C += de(n, u)), m(n, u + 1, N, !0, R) && (n.dump && p === n.dump.charCodeAt(0) ? C += ":" : C += ": ", C += n.dump, b += C);
    }
    n.tag = $, n.dump = b || "{}";
  }
  function a(n, u, x) {
    const y = x ? n.explicitTypes : n.implicitTypes;
    for (let b = 0, $ = y.length; b < $; b += 1) {
      const A = y[b];
      if ((A.instanceOf || A.predicate) && (!A.instanceOf || typeof u == "object" && u instanceof A.instanceOf) && (!A.predicate || A.predicate(u))) {
        if (x ? A.multi && A.representName ? n.tag = A.representName(u) : n.tag = A.tag : n.tag = "?", A.represent) {
          const k = n.styleMap[A.tag] || A.defaultStyle;
          let S;
          if (l.call(A.represent) === "[object Function]")
            S = A.represent(u, k);
          else if (o.call(A.represent, k))
            S = A.represent[k](u, k);
          else
            throw new i("!<" + A.tag + '> tag resolver accepts not "' + k + '" style');
          n.dump = S;
        }
        return !0;
      }
    }
    return !1;
  }
  function m(n, u, x, y, b, $, A) {
    n.tag = null, n.dump = x, a(n, x, !1) || a(n, x, !0);
    const k = l.call(n.dump), S = y;
    y && (y = n.flowLevel < 0 || n.flowLevel > u);
    const C = k === "[object Object]" || k === "[object Array]";
    let O, N;
    if (C && (O = n.duplicates.indexOf(x), N = O !== -1), (n.tag !== null && n.tag !== "?" || N || n.indent !== 2 && u > 0) && (b = !1), N && n.usedDuplicates[O])
      n.dump = "*ref_" + O;
    else {
      if (C && N && !n.usedDuplicates[O] && (n.usedDuplicates[O] = !0), k === "[object Object]")
        y && Object.keys(n.dump).length !== 0 ? (e(n, u, n.dump, b), N && (n.dump = "&ref_" + O + n.dump)) : (ai(n, u, n.dump), N && (n.dump = "&ref_" + O + " " + n.dump));
      else if (k === "[object Array]")
        y && n.dump.length !== 0 ? (n.noArrayIndent && !A && u > 0 ? ze(n, u - 1, n.dump, b) : ze(n, u, n.dump, b), N && (n.dump = "&ref_" + O + n.dump)) : (je(n, u, n.dump), N && (n.dump = "&ref_" + O + " " + n.dump));
      else if (k === "[object String]")
        n.tag !== "?" && li(n, n.dump, u, $, S);
      else {
        if (k === "[object Undefined]")
          return !1;
        if (n.skipInvalid) return !1;
        throw new i("unacceptable kind of an object to dump " + k);
      }
      if (n.tag !== null && n.tag !== "?") {
        let R = encodeURI(
          n.tag[0] === "!" ? n.tag.slice(1) : n.tag
        ).replace(/!/g, "%21");
        n.tag[0] === "!" ? R = "!" + R : R.slice(0, 18) === "tag:yaml.org,2002:" ? R = "!!" + R.slice(18) : R = "!<" + R + ">", n.dump = R + " " + n.dump;
      }
    }
    return !0;
  }
  function _(n, u) {
    const x = [], y = [];
    f(n, x, y);
    const b = y.length;
    for (let $ = 0; $ < b; $ += 1)
      u.duplicates.push(x[y[$]]);
    u.usedDuplicates = new Array(b);
  }
  function f(n, u, x) {
    if (n !== null && typeof n == "object") {
      const y = u.indexOf(n);
      if (y !== -1)
        x.indexOf(y) === -1 && x.push(y);
      else if (u.push(n), Array.isArray(n))
        for (let b = 0, $ = n.length; b < $; b += 1)
          f(n[b], u, x);
      else {
        const b = Object.keys(n);
        for (let $ = 0, A = b.length; $ < A; $ += 1)
          f(n[b[$]], u, x);
      }
    }
  }
  function w(n, u) {
    u = u || {};
    const x = new oi(u);
    x.noRefs || _(n, x);
    let y = n;
    return x.replacer && (y = x.replacer.call({ "": y }, "", y)), m(x, 0, y, !0, !0) ? x.dump + `
` : "";
  }
  return Mi.dump = w, Mi;
}
var wn;
function St() {
  if (wn) return H;
  wn = 1;
  const t = $t(), i = wt();
  function r(l, o) {
    return function() {
      throw new Error("Function yaml." + l + " is removed in js-yaml 4. Use yaml." + o + " instead, which is now safe by default.");
    };
  }
  return H.Type = Y(), H.Schema = Mn(), H.FAILSAFE_SCHEMA = Pn(), H.JSON_SCHEMA = Hn(), H.CORE_SCHEMA = Yn(), H.DEFAULT_SCHEMA = Ui(), H.load = t.load, H.loadAll = t.loadAll, H.dump = i.dump, H.YAMLException = Me(), H.types = {
    binary: zn(),
    float: Un(),
    map: Rn(),
    null: Dn(),
    pairs: Jn(),
    set: Wn(),
    timestamp: Bn(),
    bool: qn(),
    int: Fn(),
    merge: jn(),
    omap: Kn(),
    seq: Ln(),
    str: Nn()
  }, H.safeLoad = r("safeLoad", "load"), H.safeLoadAll = r("safeLoadAll", "loadAll"), H.safeDump = r("safeDump", "dump"), H;
}
var kt = St();
const Et = /* @__PURE__ */ At(kt), {
  Type: Ut,
  Schema: Ht,
  FAILSAFE_SCHEMA: Yt,
  JSON_SCHEMA: Bt,
  CORE_SCHEMA: jt,
  DEFAULT_SCHEMA: zt,
  load: Sn,
  loadAll: Kt,
  dump: Je,
  YAMLException: Jt,
  types: Wt,
  safeLoad: Gt,
  safeLoadAll: Vt,
  safeDump: Qt
} = Et, ei = (t, i, r = {}) => t.callWS({ type: `deferred_actions/${i}`, data: r }), Ct = (t) => ei(t, "list", { limit: 1e3 }), Tt = (t, i) => ei(t, "create", i), Ot = (t, i) => ei(t, "update", i), It = (t, i, r, l = {}) => ei(t, i, { job_id: r, ...l }), Mt = (t, i) => t.connection.subscribeMessage(i, { type: "deferred_actions/subscribe" });
function Ni(t, i = Date.now()) {
  const r = Math.round((new Date(t).getTime() - i) / 1e3), l = Math.abs(r), [o, s] = l >= 86400 ? [Math.round(l / 86400), "day"] : l >= 3600 ? [Math.round(l / 3600), "hour"] : l >= 60 ? [Math.round(l / 60), "minute"] : [l, "second"];
  return `${r < 0 ? "overdue by" : "in"} ${o} ${s}${o === 1 ? "" : "s"}`;
}
const We = (t) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short"
}).format(new Date(t)), Nt = [5, 15, 30, 60], Lt = (t) => ["completed", "cancelled", "missed", "skipped", "expired"].includes(t), Rt = (t) => {
  const i = t.overdue_policy ? "job override" : "inherited";
  return t.effective_overdue_policy === "execute_within_grace" ? `Execute within ${t.effective_overdue_grace_minutes} minutes (${i})` : `${t.effective_overdue_policy} (${i})`;
};
var Pt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, B = (t, i, r, l) => {
  for (var o = l > 1 ? void 0 : l ? Dt(i, r) : i, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (o = (l ? c(i, r, o) : c(o)) || o);
  return l && o && Pt(i, r, o), o;
};
let F = class extends ke {
  constructor() {
    super(...arguments), this.jobs = [], this.summary = { pending: 0, paused: 0, failed: 0 }, this.tab = "Pending", this.scheduleMode = "delay", this.simpleAction = "light.turn_off", this.simpleEntity = "", this.advancedOpen = !1, this.busy = !1;
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
    await this.refresh(), this.unsubscribe = await Mt(this.hass, (t) => this.handlePush(t));
  }
  async refresh() {
    try {
      const t = await Ct(this.hass);
      this.jobs = t.jobs, this.recalculate();
    } catch (t) {
      this.error = String(t);
    }
  }
  handlePush(t) {
    if (t.event === "queue_summary" && t.summary && (this.summary = t.summary), t.event === "job_deleted" && t.job_id) this.jobs = this.jobs.filter((i) => i.id !== t.job_id);
    else if (t.job) {
      const i = this.jobs.findIndex((r) => r.id === t.job?.id);
      this.jobs = i < 0 ? [...this.jobs, t.job] : this.jobs.map((r) => r.id === t.job?.id ? t.job : r), this.selected?.id === t.job.id && (this.selected = t.job);
    }
    this.recalculate();
  }
  recalculate() {
    const t = this.jobs.filter((i) => i.status === "pending").sort((i, r) => i.execute_at.localeCompare(r.execute_at));
    this.summary = {
      pending: t.length,
      paused: this.jobs.filter((i) => i.status === "paused").length,
      failed: this.jobs.filter((i) => i.status === "failed").length,
      next_job_name: t[0]?.name,
      next_execution_local: t[0]?.execute_at_local
    };
  }
  visibleJobs() {
    return this.jobs.filter((t) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(t.status) || this.tab === "Paused" && t.status === "paused" || this.tab === "Failed" && t.status === "failed" || this.tab === "History" && Lt(t.status)).sort((t, i) => t.execute_at.localeCompare(i.execute_at));
  }
  async operate(t, i, r = {}) {
    if (this.menuJobId = void 0, !(["cancel", "delete", "execute_now"].includes(t) && !window.confirm(`${t.replace("_", " ")} “${i.name}”?`))) {
      this.busy = !0, this.error = void 0;
      try {
        await It(this.hass, t, i.id, r), t === "delete" && (this.selected = void 0);
      } catch (l) {
        this.error = String(l);
      } finally {
        this.busy = !1;
      }
    }
  }
  openEditor(t) {
    const i = t?.sequence[0], r = i?.target?.entity_id;
    this.simpleAction = typeof i?.action == "string" ? i.action : "light.turn_off", this.simpleEntity = typeof r == "string" ? r : "", this.scheduleMode = "delay", this.advancedOpen = !1, this.editor = { job: t, mode: t ? "advanced" : "simple" }, this.menuJobId = void 0;
  }
  primaryOperation(t) {
    if (t.status === "pending") return { label: "Pause", icon: "mdi:pause", operation: "pause" };
    if (t.status === "paused") return { label: "Resume", icon: "mdi:play", operation: "resume" };
    if (["failed", "missed"].includes(t.status)) return { label: "Run now", icon: "mdi:play", operation: "execute_now" };
    if (["completed", "cancelled", "skipped", "expired"].includes(t.status)) return { label: "Duplicate", icon: "mdi:content-copy", operation: "duplicate" };
  }
  renderMenu(t) {
    return this.menuJobId !== t.id ? I : L`<div class="menu" @click=${(i) => i.stopPropagation()}>
      <button @click=${() => {
      this.selected = t, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:information-outline"></ha-icon>View details</button>
      ${["pending", "paused"].includes(t.status) ? L`
        <button @click=${() => this.openEditor(t)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit</button>
        <button @click=${() => {
      this.quickDialog = { job: t, kind: "reschedule" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:calendar-clock"></ha-icon>Reschedule</button>
        ${t.status === "pending" ? L`<button @click=${() => {
      this.quickDialog = { job: t, kind: "snooze" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Snooze</button>` : L`<button @click=${() => {
      this.quickDialog = { job: t, kind: "extend" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Extend</button>`}` : I}
      ${["pending", "paused", "failed", "missed"].includes(t.status) ? L`<button @click=${() => this.operate("execute_now", t)}><ha-icon icon="mdi:play"></ha-icon>Run now</button>` : I}
      <button @click=${() => {
      this.quickDialog = { job: t, kind: "duplicate" }, this.menuJobId = void 0;
    }}><ha-icon icon="mdi:content-copy"></ha-icon>Duplicate</button>
      ${["pending", "paused"].includes(t.status) ? L`<button class="warning" @click=${() => this.operate("cancel", t)}><ha-icon icon="mdi:cancel"></ha-icon>Cancel</button>` : I}
      ${t.status !== "executing" ? L`<button class="danger" @click=${() => this.operate("delete", t)}><ha-icon icon="mdi:delete-outline"></ha-icon>Delete</button>` : I}
    </div>`;
  }
  renderJob(t) {
    const i = this.primaryOperation(t);
    return L`<article class="job" @click=${() => {
      this.selected = t;
    }}>
      <div class="job-icon"><ha-icon icon=${t.status === "failed" ? "mdi:alert-circle-outline" : "mdi:clock-outline"}></ha-icon></div>
      <div class="job-body">
        <div class="job-head"><h3>${t.name}</h3>${t.status !== "pending" ? L`<span class="status ${t.status}">${t.status}</span>` : I}</div>
        <div class="time">${We(t.execute_at_local)} · ${Ni(t.execute_at)}</div>
        <p>${t.action_summary}</p>
        ${t.last_error ? L`<div class="error compact">${t.last_error}</div>` : I}
      </div>
      <div class="row-actions" @click=${(r) => r.stopPropagation()}>
        ${i ? L`<button class="quiet" @click=${() => i.operation === "duplicate" ? this.quickDialog = { job: t, kind: "duplicate" } : this.operate(i.operation, t)}><ha-icon icon=${i.icon}></ha-icon>${i.label}</button>` : I}
        <div class="menu-wrap"><button class="icon" title="More actions" @click=${() => {
      this.menuJobId = this.menuJobId === t.id ? void 0 : t.id;
    }}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>${this.renderMenu(t)}</div>
      </div>
    </article>`;
  }
  renderDetails(t) {
    return L`<div class="overlay" @click=${() => {
      this.selected = void 0;
    }}><section class="dialog wide" @click=${(i) => i.stopPropagation()}>
      <header><div><h2>${t.name}</h2><span class="status ${t.status}">${t.status}</span></div><button class="icon" title="Close" @click=${() => {
      this.selected = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <section class="detail-summary"><div><span>Scheduled</span><strong>${We(t.execute_at_local)}</strong><small>${Ni(t.execute_at)}</small></div><div><span>Action</span><strong>${t.action_summary}</strong></div></section>
      ${t.description ? L`<p>${t.description}</p>` : I}
      <div class="detail-actions">
        ${["pending", "paused"].includes(t.status) ? L`<button class="primary" @click=${() => this.openEditor(t)}>Edit action</button><button @click=${() => {
      this.quickDialog = { job: t, kind: "reschedule" };
    }}>Change time</button>` : I}
      </div>
      ${t.status === "pending" ? L`<div class="snooze"><span>Snooze</span><div class="chips">${Nt.map((i) => L`<button @click=${() => this.operate("snooze", t, { duration: { minutes: i } })}>+${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => {
      this.quickDialog = { job: t, kind: "snooze" };
    }}>Custom</button></div>` : I}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
      "Job ID": t.id,
      Status: t.status,
      "Scheduled UTC": t.execute_at,
      "Valid until": t.valid_until_local ? `${We(t.valid_until_local)} (${t.valid_until})` : "—",
      Conditions: t.has_conditions ? `Yes — ${t.condition_failure} if false` : "None",
      "Overdue behavior": Rt(t),
      Created: t.created_at,
      Modified: t.modified_at,
      Completed: t.completed_at || "—",
      Source: t.source,
      "Job key": t.job_key || "—",
      Tags: t.tags.join(", ") || "—",
      "Target hints": t.target_entities.join(", ") || "—",
      Revision: String(t.revision),
      "Last error": t.last_error || "—"
    }).map(([i, r]) => L`<dt>${i}</dt><dd>${r}</dd>`)}
      </dl></details>
      <details><summary>Action sequence YAML</summary><pre>${Je(t.sequence, { noRefs: !0 })}</pre></details>
      ${t.has_conditions ? L`<details><summary>Execution conditions YAML</summary><pre>${Je(t.conditions, { noRefs: !0 })}</pre></details>` : I}
      <details><summary>Attribution and diagnostics</summary><pre>${JSON.stringify(t.attribution, null, 2)}</pre>${Object.keys(t.linkage).length ? L`<pre>${JSON.stringify(t.linkage, null, 2)}</pre>` : I}</details>
    </section></div>`;
  }
  renderEditor() {
    const t = this.editor?.job;
    return L`<div class="overlay"><form class="dialog" @submit=${(i) => this.saveEditor(i)}>
      <header><h2>${t ? "Edit deferred action" : "Add deferred action"}</h2><button type="button" class="icon" title="Close" @click=${() => {
      this.editor = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <label>Name<input name="name" required .value=${t?.name ?? ""} placeholder="Turn off office heater"></label>
      ${t ? I : L`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => {
      this.scheduleMode = "delay";
    }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => {
      this.scheduleMode = "absolute";
    }}>At a date and time</button></div>
        ${this.scheduleMode === "delay" ? L`<div class="delay-row"><input name="delay_value" type="number" min="1" value="20"><select name="delay_unit"><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5, 15, 30, 60].map((i) => L`<button type="button" @click=${(r) => {
      const l = r.currentTarget.closest("form");
      l.elements.namedItem("delay_value").value = String(i), l.elements.namedItem("delay_unit").value = "minutes";
    }}>${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div>` : L`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
      </fieldset>`}
      <section class="action-editor"><div class="section-head"><h3>Action</h3><button type="button" class="link" @click=${() => {
      this.editor = { ...this.editor, mode: this.editor?.mode === "simple" ? "advanced" : "simple" };
    }}>${this.editor?.mode === "simple" ? "Edit in YAML" : "Use simple editor"}</button></div>
      ${this.editor?.mode === "simple" ? L`
        <label>Service<ha-service-picker .hass=${this.hass} .value=${this.simpleAction} @value-changed=${(i) => {
      this.simpleAction = i.detail.value;
    }}></ha-service-picker></label>
        <label>Entity<ha-entity-picker .hass=${this.hass} .value=${this.simpleEntity} .allowCustomEntity=${!0} @value-changed=${(i) => {
      this.simpleEntity = i.detail.value;
    }}></ha-entity-picker></label>
      ` : L`<label>Action sequence YAML<textarea class="yaml" name="yaml" required>${Je(t?.sequence ?? [{ action: "light.turn_off", target: { entity_id: "light.porch" } }], { noRefs: !0 })}</textarea></label>`}
      </section>
      <details class="advanced" ?open=${this.advancedOpen} @toggle=${(i) => {
      this.advancedOpen = i.currentTarget.open;
    }}><summary>Advanced options</summary>
        <label>Description<textarea name="description">${t?.description ?? ""}</textarea></label>
        <label>Job key<input name="job_key" .value=${t?.job_key ?? ""}></label>
        <label>Tags (comma separated)<input name="tags" .value=${t?.tags.join(", ") ?? ""}></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${t?.target_entities[0] ?? ""} .allowCustomEntity=${!0} @value-changed=${(i) => {
      const r = i.currentTarget.parentElement?.querySelector("input[name=target_entities]");
      r && (r.value = i.detail.value);
    }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${t?.target_entities.join(", ") ?? ""}><small>Used to find this job later; it does not change the action target.</small></label>
        ${t ? I : L`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>`}
        <label>Execution conditions YAML<textarea class="yaml small-yaml" name="conditions_yaml">${t?.conditions.length ? Je(t.conditions, { noRefs: !0 }) : ""}</textarea><small>Normal Home Assistant conditions, evaluated immediately before the action.</small></label>
        <label>If conditions are false<select name="condition_failure"><option value="skip" ?selected=${!t || t.condition_failure === "skip"}>Skip</option><option value="cancel" ?selected=${t?.condition_failure === "cancel"}>Cancel</option><option value="fail" ?selected=${t?.condition_failure === "fail"}>Fail</option></select></label>
        <label>Valid until<input name="valid_until" type="datetime-local" .value=${t?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
        <label>Overdue recovery<select name="overdue_policy"><option value="" ?selected=${!t?.overdue_policy}>Use integration default</option><option value="execute" ?selected=${t?.overdue_policy === "execute"}>Execute</option><option value="skip" ?selected=${t?.overdue_policy === "skip"}>Skip as missed</option><option value="execute_within_grace" ?selected=${t?.overdue_policy === "execute_within_grace"}>Execute within grace</option></select></label>
        <label>Job-specific grace (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${t?.overdue_grace ? String(t.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"></label>
      </details>
      <footer><button type="button" @click=${() => {
      this.editor = void 0;
    }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${t ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }
  async saveEditor(t) {
    t.preventDefault();
    const i = t.currentTarget, r = new FormData(i);
    try {
      const l = this.editor?.mode === "simple" ? [{ action: this.simpleAction, target: { entity_id: this.simpleEntity } }] : Sn(String(r.get("yaml")));
      if (!Array.isArray(l)) throw new Error("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "simple" && (!this.simpleAction || !this.simpleEntity)) throw new Error("Choose both an action and entity");
      const o = {
        name: String(r.get("name")),
        description: String(r.get("description") ?? "") || void 0,
        job_key: String(r.get("job_key") ?? "") || void 0,
        tags: String(r.get("tags") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        target_entities: String(r.get("target_entities") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        sequence: l,
        conditions: String(r.get("conditions_yaml") ?? "").trim() ? Sn(String(r.get("conditions_yaml"))) : [],
        condition_failure: String(r.get("condition_failure") ?? "skip"),
        overdue_policy: String(r.get("overdue_policy") ?? "") || null,
        overdue_grace: String(r.get("overdue_grace_minutes") ?? "") ? { minutes: Number(r.get("overdue_grace_minutes")) } : null,
        valid_until: String(r.get("valid_until") ?? "") ? new Date(String(r.get("valid_until"))).toISOString() : null
      };
      if (!Array.isArray(o.conditions)) throw new Error("Conditions YAML must be a list");
      if (this.busy = !0, this.editor?.job) await Ot(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...o });
      else {
        let s;
        if (this.scheduleMode === "absolute") {
          const c = String(r.get("date")), p = String(r.get("time")), g = /* @__PURE__ */ new Date(`${c}T${p}`);
          if (Number.isNaN(g.getTime())) throw new Error("Choose a valid date and time");
          s = { execute_at: g.toISOString() };
        } else {
          const c = Number(r.get("delay_value")), p = String(r.get("delay_unit"));
          if (!Number.isFinite(c) || c <= 0) throw new Error("Delay must be greater than zero");
          s = { delay: { [p]: c } };
        }
        await Tt(this.hass, { ...o, ...s, conflict_mode: String(r.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = void 0;
    } catch (l) {
      this.error = String(l);
    } finally {
      this.busy = !1;
    }
  }
  renderQuickDialog() {
    const t = this.quickDialog;
    return t ? L`<div class="overlay"><form class="dialog small" @submit=${(r) => this.submitQuickDialog(r)}><header><h2>${{ reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: "Duplicate action" }[t.kind]}</h2><button type="button" class="icon" @click=${() => {
      this.quickDialog = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${t.kind === "reschedule" ? L`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : L`<label>${t.kind === "extend" ? "Minutes to add (negative reduces time)" : t.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${t.kind === "extend" ? I : "1"} .value=${t.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => {
      this.quickDialog = void 0;
    }}>Cancel</button><button class="primary">${t.kind === "duplicate" ? "Duplicate" : "Apply"}</button></footer></form></div>` : I;
  }
  async submitQuickDialog(t) {
    t.preventDefault();
    const i = this.quickDialog;
    if (!i) return;
    const r = new FormData(t.currentTarget);
    if (i.kind === "reschedule") {
      const l = /* @__PURE__ */ new Date(`${String(r.get("date"))}T${String(r.get("time"))}`);
      if (Number.isNaN(l.getTime())) {
        this.error = "Choose a valid date and time";
        return;
      }
      await this.operate("reschedule", i.job, { execute_at: l.toISOString() });
    } else {
      const l = Number(r.get("minutes"));
      if (!Number.isFinite(l) || (["duplicate", "snooze"].includes(i.kind) ? l <= 0 : l === 0)) {
        this.error = "Enter a valid number of minutes";
        return;
      }
      await this.operate(i.kind, i.job, ["extend", "snooze"].includes(i.kind) ? { duration: { minutes: l } } : { delay: { minutes: l } });
    }
    this.quickDialog = void 0;
  }
  render() {
    const t = this.visibleJobs();
    return L`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:plus"></ha-icon>Add action</button></header>
      ${this.error ? L`<div class="banner">${this.error}<button class="icon" @click=${() => {
      this.error = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : I}
      <nav>${["Pending", "Paused", "Failed", "History"].map((i) => L`<button class=${this.tab === i ? "active" : ""} @click=${() => {
      this.tab = i;
    }}>${i}<span>${i === "Pending" ? this.summary.pending : i === "Paused" ? this.summary.paused : i === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => {
      this.tab = "All";
    }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? L`<small>${We(this.summary.next_execution_local)} · ${Ni(this.summary.next_execution_local)}</small>` : I}</section>
      <main>${t.length ? t.map((i) => this.renderJob(i)) : L`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : I}${this.editor ? this.renderEditor() : I}${this.renderQuickDialog()}
    </ha-card>`;
  }
};
F.styles = Vn`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary{grid-template-columns:1fr}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
B([
  In({ attribute: !1 })
], F.prototype, "hass", 2);
B([
  W()
], F.prototype, "jobs", 2);
B([
  W()
], F.prototype, "summary", 2);
B([
  W()
], F.prototype, "tab", 2);
B([
  W()
], F.prototype, "selected", 2);
B([
  W()
], F.prototype, "editor", 2);
B([
  W()
], F.prototype, "scheduleMode", 2);
B([
  W()
], F.prototype, "simpleAction", 2);
B([
  W()
], F.prototype, "simpleEntity", 2);
B([
  W()
], F.prototype, "advancedOpen", 2);
B([
  W()
], F.prototype, "menuJobId", 2);
B([
  W()
], F.prototype, "quickDialog", 2);
B([
  W()
], F.prototype, "error", 2);
B([
  W()
], F.prototype, "busy", 2);
F = B([
  bt("deferred-actions-panel")
], F);
export {
  F as DeferredActionsPanel
};
