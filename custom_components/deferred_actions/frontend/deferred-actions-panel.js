const nt = globalThis, Jt = nt.ShadowRoot && (nt.ShadyCSS === void 0 || nt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Wt = /* @__PURE__ */ Symbol(), ti = /* @__PURE__ */ new WeakMap();
let Bi = class {
  constructor(i, n, o) {
    if (this._$cssResult$ = !0, o !== Wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = n;
  }
  get styleSheet() {
    let i = this.o;
    const n = this.t;
    if (Jt && i === void 0) {
      const o = n !== void 0 && n.length === 1;
      o && (i = ti.get(n)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), o && ti.set(n, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const mn = (e) => new Bi(typeof e == "string" ? e : e + "", void 0, Wt), gn = (e, ...i) => {
  const n = e.length === 1 ? e[0] : i.reduce((o, s, l) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[l + 1], e[0]);
  return new Bi(n, e, Wt);
}, yn = (e, i) => {
  if (Jt) e.adoptedStyleSheets = i.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of i) {
    const o = document.createElement("style"), s = nt.litNonce;
    s !== void 0 && o.setAttribute("nonce", s), o.textContent = n.cssText, e.appendChild(o);
  }
}, ii = Jt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((i) => {
  let n = "";
  for (const o of i.cssRules) n += o.cssText;
  return mn(n);
})(e) : e;
const { is: vn, defineProperty: bn, getOwnPropertyDescriptor: _n, getOwnPropertyNames: $n, getOwnPropertySymbols: An, getPrototypeOf: xn } = Object, st = globalThis, ni = st.trustedTypes, wn = ni ? ni.emptyScript : "", kn = st.reactiveElementPolyfillSupport, Ie = (e, i) => e, ot = { toAttribute(e, i) {
  switch (i) {
    case Boolean:
      e = e ? wn : null;
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
} }, Vt = (e, i) => !vn(e, i), ri = { attribute: !0, type: String, converter: ot, reflect: !1, useDefault: !1, hasChanged: Vt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), st.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let xe = class extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ??= []).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, n = ri) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(i) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(i, n), !n.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(i, o, n);
      s !== void 0 && bn(this.prototype, i, s);
    }
  }
  static getPropertyDescriptor(i, n, o) {
    const { get: s, set: l } = _n(this.prototype, i) ?? { get() {
      return this[n];
    }, set(a) {
      this[n] = a;
    } };
    return { get: s, set(a) {
      const c = s?.call(this);
      l?.call(this, a), this.requestUpdate(i, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? ri;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ie("elementProperties"))) return;
    const i = xn(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
      const n = this.properties, o = [...$n(n), ...An(n)];
      for (const s of o) this.createProperty(s, n[s]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const n = litPropertyMetadata.get(i);
      if (n !== void 0) for (const [o, s] of n) this.elementProperties.set(o, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, o] of this.elementProperties) {
      const s = this._$Eu(n, o);
      s !== void 0 && this._$Eh.set(s, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const n = [];
    if (Array.isArray(i)) {
      const o = new Set(i.flat(1 / 0).reverse());
      for (const s of o) n.unshift(ii(s));
    } else i !== void 0 && n.push(ii(i));
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
    return yn(i, this.constructor.elementStyles), i;
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
    const o = this.constructor.elementProperties.get(i), s = this.constructor._$Eu(i, o);
    if (s !== void 0 && o.reflect === !0) {
      const l = (o.converter?.toAttribute !== void 0 ? o.converter : ot).toAttribute(n, o.type);
      this._$Em = i, l == null ? this.removeAttribute(s) : this.setAttribute(s, l), this._$Em = null;
    }
  }
  _$AK(i, n) {
    const o = this.constructor, s = o._$Eh.get(i);
    if (s !== void 0 && this._$Em !== s) {
      const l = o.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : l.converter?.fromAttribute !== void 0 ? l.converter : ot;
      this._$Em = s;
      const c = a.fromAttribute(n, l.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(i, n, o, s = !1, l) {
    if (i !== void 0) {
      const a = this.constructor;
      if (s === !1 && (l = this[i]), o ??= a.getPropertyOptions(i), !((o.hasChanged ?? Vt)(l, n) || o.useDefault && o.reflect && l === this._$Ej?.get(i) && !this.hasAttribute(a._$Eu(i, o)))) return;
      this.C(i, n, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(i, n, { useDefault: o, reflect: s, wrapped: l }, a) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(i) && (this._$Ej.set(i, a ?? n ?? this[i]), l !== !0 || a !== void 0) || (this._$AL.has(i) || (this.hasUpdated || o || (n = void 0), this._$AL.set(i, n)), s === !0 && this._$Em !== i && (this._$Eq ??= /* @__PURE__ */ new Set()).add(i));
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
        for (const [s, l] of this._$Ep) this[s] = l;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [s, l] of o) {
        const { wrapped: a } = l, c = this[s];
        a !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, l, c);
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
xe.elementStyles = [], xe.shadowRootOptions = { mode: "open" }, xe[Ie("elementProperties")] = /* @__PURE__ */ new Map(), xe[Ie("finalized")] = /* @__PURE__ */ new Map(), kn?.({ ReactiveElement: xe }), (st.reactiveElementVersions ??= []).push("2.1.2");
const Gt = globalThis, oi = (e) => e, lt = Gt.trustedTypes, li = lt ? lt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, zi = "$lit$", de = `lit$${Math.random().toFixed(9).slice(2)}$`, Ki = "?" + de, Sn = `<${Ki}>`, ye = document, De = () => ye.createComment(""), Fe = (e) => e === null || typeof e != "object" && typeof e != "function", Zt = Array.isArray, Cn = (e) => Zt(e) || typeof e?.[Symbol.iterator] == "function", bt = `[ \t
\f\r]`, qe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, si = /-->/g, ai = />/g, fe = RegExp(`>|${bt}(?:([^\\s"'>=/]+)(${bt}*=${bt}*(?:[^ \t
\f\r"'\`<>=]|("|')|))|$)`, "g"), ci = /'/g, ui = /"/g, ji = /^(?:script|style|textarea|title)$/i, Tn = (e) => (i, ...n) => ({ _$litType$: e, strings: i, values: n }), k = Tn(1), we = /* @__PURE__ */ Symbol.for("lit-noChange"), O = /* @__PURE__ */ Symbol.for("lit-nothing"), di = /* @__PURE__ */ new WeakMap(), ge = ye.createTreeWalker(ye, 129);
function Ji(e, i) {
  if (!Zt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return li !== void 0 ? li.createHTML(i) : i;
}
const En = (e, i) => {
  const n = e.length - 1, o = [];
  let s, l = i === 2 ? "<svg>" : i === 3 ? "<math>" : "", a = qe;
  for (let c = 0; c < n; c++) {
    const f = e[c];
    let d, h, v = -1, E = 0;
    for (; E < f.length && (a.lastIndex = E, h = a.exec(f), h !== null); ) E = a.lastIndex, a === qe ? h[1] === "!--" ? a = si : h[1] !== void 0 ? a = ai : h[2] !== void 0 ? (ji.test(h[2]) && (s = RegExp("</" + h[2], "g")), a = fe) : h[3] !== void 0 && (a = fe) : a === fe ? h[0] === ">" ? (a = s ?? qe, v = -1) : h[1] === void 0 ? v = -2 : (v = a.lastIndex - h[2].length, d = h[1], a = h[3] === void 0 ? fe : h[3] === '"' ? ui : ci) : a === ui || a === ci ? a = fe : a === si || a === ai ? a = qe : (a = fe, s = void 0);
    const q = a === fe && e[c + 1].startsWith("/>") ? " " : "";
    l += a === qe ? f + Sn : v >= 0 ? (o.push(d), f.slice(0, v) + zi + f.slice(v) + de + q) : f + de + (v === -2 ? c : q);
  }
  return [Ji(e, l + (e[n] || "<?>") + (i === 2 ? "</svg>" : i === 3 ? "</math>" : "")), o];
};
class Pe {
  constructor({ strings: i, _$litType$: n }, o) {
    let s;
    this.parts = [];
    let l = 0, a = 0;
    const c = i.length - 1, f = this.parts, [d, h] = En(i, n);
    if (this.el = Pe.createElement(d, o), ge.currentNode = this.el.content, n === 2 || n === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (s = ge.nextNode()) !== null && f.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const v of s.getAttributeNames()) if (v.endsWith(zi)) {
          const E = h[a++], q = s.getAttribute(v).split(de), H = /([.?@])?(.*)/.exec(E);
          f.push({ type: 1, index: l, name: H[2], strings: q, ctor: H[1] === "." ? Mn : H[1] === "?" ? Rn : H[1] === "@" ? qn : at }), s.removeAttribute(v);
        } else v.startsWith(de) && (f.push({ type: 6, index: l }), s.removeAttribute(v));
        if (ji.test(s.tagName)) {
          const v = s.textContent.split(de), E = v.length - 1;
          if (E > 0) {
            s.textContent = lt ? lt.emptyScript : "";
            for (let q = 0; q < E; q++) s.append(v[q], De()), ge.nextNode(), f.push({ type: 2, index: ++l });
            s.append(v[E], De());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ki) f.push({ type: 2, index: l });
      else {
        let v = -1;
        for (; (v = s.data.indexOf(de, v + 1)) !== -1; ) f.push({ type: 7, index: l }), v += de.length - 1;
      }
      l++;
    }
  }
  static createElement(i, n) {
    const o = ye.createElement("template");
    return o.innerHTML = i, o;
  }
}
function ke(e, i, n = e, o) {
  if (i === we) return i;
  let s = o !== void 0 ? n._$Co?.[o] : n._$Cl;
  const l = Fe(i) ? void 0 : i._$litDirective$;
  return s?.constructor !== l && (s?._$AO?.(!1), l === void 0 ? s = void 0 : (s = new l(e), s._$AT(e, n, o)), o !== void 0 ? (n._$Co ??= [])[o] = s : n._$Cl = s), s !== void 0 && (i = ke(e, s._$AS(e, i.values), s, o)), i;
}
class On {
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
    const { el: { content: n }, parts: o } = this._$AD, s = (i?.creationScope ?? ye).importNode(n, !0);
    ge.currentNode = s;
    let l = ge.nextNode(), a = 0, c = 0, f = o[0];
    for (; f !== void 0; ) {
      if (a === f.index) {
        let d;
        f.type === 2 ? d = new Ue(l, l.nextSibling, this, i) : f.type === 1 ? d = new f.ctor(l, f.name, f.strings, this, i) : f.type === 6 && (d = new In(l, this, i)), this._$AV.push(d), f = o[++c];
      }
      a !== f?.index && (l = ge.nextNode(), a++);
    }
    return ge.currentNode = ye, s;
  }
  p(i) {
    let n = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(i, o, n), n += o.strings.length - 2) : o._$AI(i[n])), n++;
  }
}
class Ue {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(i, n, o, s) {
    this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = i, this._$AB = n, this._$AM = o, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    i = ke(this, i, n), Fe(i) ? i === O || i == null || i === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : i !== this._$AH && i !== we && this._(i) : i._$litType$ !== void 0 ? this.$(i) : i.nodeType !== void 0 ? this.T(i) : Cn(i) ? this.k(i) : this._(i);
  }
  O(i) {
    return this._$AA.parentNode.insertBefore(i, this._$AB);
  }
  T(i) {
    this._$AH !== i && (this._$AR(), this._$AH = this.O(i));
  }
  _(i) {
    this._$AH !== O && Fe(this._$AH) ? this._$AA.nextSibling.data = i : this.T(ye.createTextNode(i)), this._$AH = i;
  }
  $(i) {
    const { values: n, _$litType$: o } = i, s = typeof o == "number" ? this._$AC(i) : (o.el === void 0 && (o.el = Pe.createElement(Ji(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === s) this._$AH.p(n);
    else {
      const l = new On(s, this), a = l.u(this.options);
      l.p(n), this.T(a), this._$AH = l;
    }
  }
  _$AC(i) {
    let n = di.get(i.strings);
    return n === void 0 && di.set(i.strings, n = new Pe(i)), n;
  }
  k(i) {
    Zt(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let o, s = 0;
    for (const l of i) s === n.length ? n.push(o = new Ue(this.O(De()), this.O(De()), this, this.options)) : o = n[s], o._$AI(l), s++;
    s < n.length && (this._$AR(o && o._$AB.nextSibling, s), n.length = s);
  }
  _$AR(i = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); i !== this._$AB; ) {
      const o = oi(i).nextSibling;
      oi(i).remove(), i = o;
    }
  }
  setConnected(i) {
    this._$AM === void 0 && (this._$Cv = i, this._$AP?.(i));
  }
}
class at {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(i, n, o, s, l) {
    this.type = 1, this._$AH = O, this._$AN = void 0, this.element = i, this.name = n, this._$AM = s, this.options = l, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = O;
  }
  _$AI(i, n = this, o, s) {
    const l = this.strings;
    let a = !1;
    if (l === void 0) i = ke(this, i, n, 0), a = !Fe(i) || i !== this._$AH && i !== we, a && (this._$AH = i);
    else {
      const c = i;
      let f, d;
      for (i = l[0], f = 0; f < l.length - 1; f++) d = ke(this, c[o + f], n, f), d === we && (d = this._$AH[f]), a ||= !Fe(d) || d !== this._$AH[f], d === O ? i = O : i !== O && (i += (d ?? "") + l[f + 1]), this._$AH[f] = d;
    }
    a && !s && this.j(i);
  }
  j(i) {
    i === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, i ?? "");
  }
}
class Mn extends at {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(i) {
    this.element[this.name] = i === O ? void 0 : i;
  }
}
class Rn extends at {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(i) {
    this.element.toggleAttribute(this.name, !!i && i !== O);
  }
}
class qn extends at {
  constructor(i, n, o, s, l) {
    super(i, n, o, s, l), this.type = 5;
  }
  _$AI(i, n = this) {
    if ((i = ke(this, i, n, 0) ?? O) === we) return;
    const o = this._$AH, s = i === O && o !== O || i.capture !== o.capture || i.once !== o.once || i.passive !== o.passive, l = i !== O && (o === O || s);
    s && this.element.removeEventListener(this.name, this, o), l && this.element.addEventListener(this.name, this, i), this._$AH = i;
  }
  handleEvent(i) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, i) : this._$AH.handleEvent(i);
  }
}
class In {
  constructor(i, n, o) {
    this.element = i, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(i) {
    ke(this, i);
  }
}
const Ln = Gt.litHtmlPolyfillSupport;
Ln?.(Pe, Ue), (Gt.litHtmlVersions ??= []).push("3.3.3");
const Nn = (e, i, n) => {
  const o = n?.renderBefore ?? i;
  let s = o._$litPart$;
  if (s === void 0) {
    const l = n?.renderBefore ?? null;
    o._$litPart$ = s = new Ue(i.insertBefore(De(), l), l, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
const Qt = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(i), this._$Do = Nn(n, this.renderRoot, this.renderOptions);
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
Le._$litElement$ = !0, Le.finalized = !0, Qt.litElementHydrateSupport?.({ LitElement: Le });
const Dn = Qt.litElementPolyfillSupport;
Dn?.({ LitElement: Le });
(Qt.litElementVersions ??= []).push("4.2.2");
const Fn = (e) => (i, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(e, i);
  }) : customElements.define(e, i);
};
const Pn = { attribute: !0, type: String, converter: ot, reflect: !1, hasChanged: Vt }, Un = (e = Pn, i, n) => {
  const { kind: o, metadata: s } = n;
  let l = globalThis.litPropertyMetadata.get(s);
  if (l === void 0 && globalThis.litPropertyMetadata.set(s, l = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), l.set(n.name, e), o === "accessor") {
    const { name: a } = n;
    return { set(c) {
      const f = i.get.call(this);
      i.set.call(this, c), this.requestUpdate(a, f, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, e, c), c;
    } };
  }
  if (o === "setter") {
    const { name: a } = n;
    return function(c) {
      const f = this[a];
      i.call(this, c), this.requestUpdate(a, f, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Wi(e) {
  return (i, n) => typeof n == "object" ? Un(e, i, n) : ((o, s, l) => {
    const a = s.hasOwnProperty(l);
    return s.constructor.createProperty(l, o), a ? Object.getOwnPropertyDescriptor(s, l) : void 0;
  })(e, i, n);
}
function D(e) {
  return Wi({ ...e, state: !0, attribute: !1 });
}
function Yn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var z = {}, it = {}, se = {}, pi;
function Ye() {
  if (pi) return se;
  pi = 1;
  function e(a) {
    return typeof a > "u" || a === null;
  }
  function i(a) {
    return typeof a == "object" && a !== null;
  }
  function n(a) {
    return Array.isArray(a) ? a : e(a) ? [] : [a];
  }
  function o(a, c) {
    if (c) {
      const f = Object.keys(c);
      for (let d = 0, h = f.length; d < h; d += 1) {
        const v = f[d];
        a[v] = c[v];
      }
    }
    return a;
  }
  function s(a, c) {
    let f = "";
    for (let d = 0; d < c; d += 1)
      f += a;
    return f;
  }
  function l(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return se.isNothing = e, se.isObject = i, se.toArray = n, se.repeat = s, se.isNegativeZero = l, se.extend = o, se;
}
var _t, hi;
function He() {
  if (hi) return _t;
  hi = 1;
  function e(n, o) {
    let s = "";
    const l = n.reason || "(unknown reason)";
    return n.mark ? (n.mark.name && (s += 'in "' + n.mark.name + '" '), s += "(" + (n.mark.line + 1) + ":" + (n.mark.column + 1) + ")", !o && n.mark.snippet && (s += `

` + n.mark.snippet), l + " " + s) : l;
  }
  function i(n, o) {
    Error.call(this), this.name = "YAMLException", this.reason = n, this.mark = o, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return i.prototype = Object.create(Error.prototype), i.prototype.constructor = i, i.prototype.toString = function(o) {
    return this.name + ": " + e(this, o);
  }, _t = i, _t;
}
var $t, fi;
function Hn() {
  if (fi) return $t;
  fi = 1;
  const e = Ye();
  function i(s, l, a, c, f) {
    let d = "", h = "";
    const v = Math.floor(f / 2) - 1;
    return c - l > v && (d = " ... ", l = c - v + d.length), a - c > v && (h = " ...", a = c + v - h.length), {
      str: d + s.slice(l, a).replace(/\t/g, "→") + h,
      pos: c - l + d.length
      // relative position
    };
  }
  function n(s, l) {
    return e.repeat(" ", l - s.length) + s;
  }
  function o(s, l) {
    if (l = Object.create(l || null), !s.buffer) return null;
    l.maxLength || (l.maxLength = 79), typeof l.indent != "number" && (l.indent = 1), typeof l.linesBefore != "number" && (l.linesBefore = 3), typeof l.linesAfter != "number" && (l.linesAfter = 2);
    const a = /\r?\n|\r|\0/g, c = [0], f = [];
    let d, h = -1;
    for (; d = a.exec(s.buffer); )
      f.push(d.index), c.push(d.index + d[0].length), s.position <= d.index && h < 0 && (h = c.length - 2);
    h < 0 && (h = c.length - 1);
    let v = "";
    const E = Math.min(s.line + l.linesAfter, f.length).toString().length, q = l.maxLength - (l.indent + E + 3);
    for (let P = 1; P <= l.linesBefore && !(h - P < 0); P++) {
      const G = i(
        s.buffer,
        c[h - P],
        f[h - P],
        s.position - (c[h] - c[h - P]),
        q
      );
      v = e.repeat(" ", l.indent) + n((s.line - P + 1).toString(), E) + " | " + G.str + `
` + v;
    }
    const H = i(s.buffer, c[h], f[h], s.position, q);
    v += e.repeat(" ", l.indent) + n((s.line + 1).toString(), E) + " | " + H.str + `
`, v += e.repeat("-", l.indent + E + 3 + H.pos) + `^
`;
    for (let P = 1; P <= l.linesAfter && !(h + P >= f.length); P++) {
      const G = i(
        s.buffer,
        c[h + P],
        f[h + P],
        s.position - (c[h] - c[h + P]),
        q
      );
      v += e.repeat(" ", l.indent) + n((s.line + P + 1).toString(), E) + " | " + G.str + `
`;
    }
    return v.replace(/\n$/, "");
  }
  return $t = o, $t;
}
var At, mi;
function K() {
  if (mi) return At;
  mi = 1;
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
  function o(l) {
    const a = {};
    return l !== null && Object.keys(l).forEach(function(c) {
      l[c].forEach(function(f) {
        a[String(f)] = c;
      });
    }), a;
  }
  function s(l, a) {
    if (a = a || {}, Object.keys(a).forEach(function(c) {
      if (i.indexOf(c) === -1)
        throw new e('Unknown option "' + c + '" is met in definition of "' + l + '" YAML type.');
    }), this.options = a, this.tag = l, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(c) {
      return c;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = o(a.styleAliases || null), n.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + l + '" YAML type.');
  }
  return At = s, At;
}
var xt, gi;
function Vi() {
  if (gi) return xt;
  gi = 1;
  const e = He(), i = K();
  function n(l, a) {
    const c = [];
    return l[a].forEach(function(f) {
      let d = c.length;
      c.forEach(function(h, v) {
        h.tag === f.tag && h.kind === f.kind && h.multi === f.multi && (d = v);
      }), c[d] = f;
    }), c;
  }
  function o() {
    const l = {
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
      c.multi ? (l.multi[c.kind].push(c), l.multi.fallback.push(c)) : l[c.kind][c.tag] = l.fallback[c.tag] = c;
    }
    for (let c = 0, f = arguments.length; c < f; c += 1)
      arguments[c].forEach(a);
    return l;
  }
  function s(l) {
    return this.extend(l);
  }
  return s.prototype.extend = function(a) {
    let c = [], f = [];
    if (a instanceof i)
      f.push(a);
    else if (Array.isArray(a))
      f = f.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (c = c.concat(a.implicit)), a.explicit && (f = f.concat(a.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    c.forEach(function(h) {
      if (!(h instanceof i))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), f.forEach(function(h) {
      if (!(h instanceof i))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const d = Object.create(s.prototype);
    return d.implicit = (this.implicit || []).concat(c), d.explicit = (this.explicit || []).concat(f), d.compiledImplicit = n(d, "implicit"), d.compiledExplicit = n(d, "explicit"), d.compiledTypeMap = o(d.compiledImplicit, d.compiledExplicit), d;
  }, xt = s, xt;
}
var wt, yi;
function Gi() {
  if (yi) return wt;
  yi = 1;
  const e = K();
  return wt = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(i) {
      return i !== null ? i : "";
    }
  }), wt;
}
var kt, vi;
function Zi() {
  if (vi) return kt;
  vi = 1;
  const e = K();
  return kt = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(i) {
      return i !== null ? i : [];
    }
  }), kt;
}
var St, bi;
function Qi() {
  if (bi) return St;
  bi = 1;
  const e = K();
  return St = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(i) {
      return i !== null ? i : {};
    }
  }), St;
}
var Ct, _i;
function Xi() {
  if (_i) return Ct;
  _i = 1;
  const e = Vi();
  return Ct = new e({
    explicit: [
      Gi(),
      Zi(),
      Qi()
    ]
  }), Ct;
}
var Tt, $i;
function en() {
  if ($i) return Tt;
  $i = 1;
  const e = K();
  function i(s) {
    if (s === null) return !0;
    const l = s.length;
    return l === 1 && s === "~" || l === 4 && (s === "null" || s === "Null" || s === "NULL");
  }
  function n() {
    return null;
  }
  function o(s) {
    return s === null;
  }
  return Tt = new e("tag:yaml.org,2002:null", {
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
  }), Tt;
}
var Et, Ai;
function tn() {
  if (Ai) return Et;
  Ai = 1;
  const e = K();
  function i(s) {
    if (s === null) return !1;
    const l = s.length;
    return l === 4 && (s === "true" || s === "True" || s === "TRUE") || l === 5 && (s === "false" || s === "False" || s === "FALSE");
  }
  function n(s) {
    return s === "true" || s === "True" || s === "TRUE";
  }
  function o(s) {
    return Object.prototype.toString.call(s) === "[object Boolean]";
  }
  return Et = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: i,
    construct: n,
    predicate: o,
    represent: {
      lowercase: function(s) {
        return s ? "true" : "false";
      },
      uppercase: function(s) {
        return s ? "TRUE" : "FALSE";
      },
      camelcase: function(s) {
        return s ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Et;
}
var Ot, xi;
function nn() {
  if (xi) return Ot;
  xi = 1;
  const e = Ye(), i = K();
  function n(d) {
    return d >= 48 && d <= 57 || d >= 65 && d <= 70 || d >= 97 && d <= 102;
  }
  function o(d) {
    return d >= 48 && d <= 55;
  }
  function s(d) {
    return d >= 48 && d <= 57;
  }
  function l(d) {
    if (d === null) return !1;
    const h = d.length;
    let v = 0, E = !1;
    if (!h) return !1;
    let q = d[v];
    if ((q === "-" || q === "+") && (q = d[++v]), q === "0") {
      if (v + 1 === h) return !0;
      if (q = d[++v], q === "b") {
        for (v++; v < h; v++) {
          if (q = d[v], q !== "0" && q !== "1") return !1;
          E = !0;
        }
        return E && isFinite(a(d));
      }
      if (q === "x") {
        for (v++; v < h; v++) {
          if (!n(d.charCodeAt(v))) return !1;
          E = !0;
        }
        return E && isFinite(a(d));
      }
      if (q === "o") {
        for (v++; v < h; v++) {
          if (!o(d.charCodeAt(v))) return !1;
          E = !0;
        }
        return E && isFinite(a(d));
      }
    }
    for (; v < h; v++) {
      if (!s(d.charCodeAt(v)))
        return !1;
      E = !0;
    }
    return E ? isFinite(a(d)) : !1;
  }
  function a(d) {
    let h = d, v = 1, E = h[0];
    if ((E === "-" || E === "+") && (E === "-" && (v = -1), h = h.slice(1), E = h[0]), h === "0") return 0;
    if (E === "0") {
      if (h[1] === "b") return v * parseInt(h.slice(2), 2);
      if (h[1] === "x") return v * parseInt(h.slice(2), 16);
      if (h[1] === "o") return v * parseInt(h.slice(2), 8);
    }
    return v * parseInt(h, 10);
  }
  function c(d) {
    return a(d);
  }
  function f(d) {
    return Object.prototype.toString.call(d) === "[object Number]" && d % 1 === 0 && !e.isNegativeZero(d);
  }
  return Ot = new i("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: l,
    construct: c,
    predicate: f,
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
  }), Ot;
}
var Mt, wi;
function rn() {
  if (wi) return Mt;
  wi = 1;
  const e = Ye(), i = K(), n = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), o = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function s(d) {
    return d === null || !n.test(d) ? !1 : isFinite(parseFloat(d, 10)) ? !0 : o.test(d);
  }
  function l(d) {
    let h = d.toLowerCase();
    const v = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? v === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : v * parseFloat(h, 10);
  }
  const a = /^[-+]?[0-9]+e/;
  function c(d, h) {
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
    else if (e.isNegativeZero(d))
      return "-0.0";
    const v = d.toString(10);
    return a.test(v) ? v.replace("e", ".e") : v;
  }
  function f(d) {
    return Object.prototype.toString.call(d) === "[object Number]" && (d % 1 !== 0 || e.isNegativeZero(d));
  }
  return Mt = new i("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: s,
    construct: l,
    predicate: f,
    represent: c,
    defaultStyle: "lowercase"
  }), Mt;
}
var Rt, ki;
function on() {
  return ki || (ki = 1, Rt = Xi().extend({
    implicit: [
      en(),
      tn(),
      nn(),
      rn()
    ]
  })), Rt;
}
var qt, Si;
function ln() {
  return Si || (Si = 1, qt = on()), qt;
}
var It, Ci;
function sn() {
  if (Ci) return It;
  Ci = 1;
  const e = K(), i = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), n = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function o(a) {
    return a === null ? !1 : i.exec(a) !== null || n.exec(a) !== null;
  }
  function s(a) {
    let c = 0, f = null, d = i.exec(a);
    if (d === null && (d = n.exec(a)), d === null) throw new Error("Date resolve error");
    const h = +d[1], v = +d[2] - 1, E = +d[3];
    if (!d[4])
      return new Date(Date.UTC(h, v, E));
    const q = +d[4], H = +d[5], P = +d[6];
    if (d[7]) {
      for (c = d[7].slice(0, 3); c.length < 3; )
        c += "0";
      c = +c;
    }
    if (d[9]) {
      const pe = +d[10], j = +(d[11] || 0);
      f = (pe * 60 + j) * 6e4, d[9] === "-" && (f = -f);
    }
    const G = new Date(Date.UTC(h, v, E, q, H, P, c));
    return f && G.setTime(G.getTime() - f), G;
  }
  function l(a) {
    return a.toISOString();
  }
  return It = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: o,
    construct: s,
    instanceOf: Date,
    represent: l
  }), It;
}
var Lt, Ti;
function an() {
  if (Ti) return Lt;
  Ti = 1;
  const e = K();
  function i(n) {
    return n === "<<" || n === null;
  }
  return Lt = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: i
  }), Lt;
}
var Nt, Ei;
function cn() {
  if (Ei) return Nt;
  Ei = 1;
  const e = K(), i = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function n(a) {
    if (a === null) return !1;
    let c = 0;
    const f = a.length, d = i;
    for (let h = 0; h < f; h++) {
      const v = d.indexOf(a.charAt(h));
      if (!(v > 64)) {
        if (v < 0) return !1;
        c += 6;
      }
    }
    return c % 8 === 0;
  }
  function o(a) {
    const c = a.replace(/[\r\n=]/g, ""), f = c.length, d = i;
    let h = 0;
    const v = [];
    for (let q = 0; q < f; q++)
      q % 4 === 0 && q && (v.push(h >> 16 & 255), v.push(h >> 8 & 255), v.push(h & 255)), h = h << 6 | d.indexOf(c.charAt(q));
    const E = f % 4 * 6;
    return E === 0 ? (v.push(h >> 16 & 255), v.push(h >> 8 & 255), v.push(h & 255)) : E === 18 ? (v.push(h >> 10 & 255), v.push(h >> 2 & 255)) : E === 12 && v.push(h >> 4 & 255), new Uint8Array(v);
  }
  function s(a) {
    let c = "", f = 0;
    const d = a.length, h = i;
    for (let E = 0; E < d; E++)
      E % 3 === 0 && E && (c += h[f >> 18 & 63], c += h[f >> 12 & 63], c += h[f >> 6 & 63], c += h[f & 63]), f = (f << 8) + a[E];
    const v = d % 3;
    return v === 0 ? (c += h[f >> 18 & 63], c += h[f >> 12 & 63], c += h[f >> 6 & 63], c += h[f & 63]) : v === 2 ? (c += h[f >> 10 & 63], c += h[f >> 4 & 63], c += h[f << 2 & 63], c += h[64]) : v === 1 && (c += h[f >> 2 & 63], c += h[f << 4 & 63], c += h[64], c += h[64]), c;
  }
  function l(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return Nt = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: n,
    construct: o,
    predicate: l,
    represent: s
  }), Nt;
}
var Dt, Oi;
function un() {
  if (Oi) return Dt;
  Oi = 1;
  const e = K(), i = Object.prototype.hasOwnProperty, n = Object.prototype.toString;
  function o(l) {
    if (l === null) return !0;
    const a = {}, c = l;
    for (let f = 0, d = c.length; f < d; f += 1) {
      const h = c[f];
      let v = !1;
      if (n.call(h) !== "[object Object]") return !1;
      let E;
      for (E in h)
        if (i.call(h, E))
          if (!v) v = !0;
          else return !1;
      if (!v || i.call(a, E)) return !1;
      Object.defineProperty(a, E, { value: !0 });
    }
    return !0;
  }
  function s(l) {
    return l !== null ? l : [];
  }
  return Dt = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: o,
    construct: s
  }), Dt;
}
var Ft, Mi;
function dn() {
  if (Mi) return Ft;
  Mi = 1;
  const e = K(), i = Object.prototype.toString;
  function n(s) {
    if (s === null) return !0;
    const l = s, a = new Array(l.length);
    for (let c = 0, f = l.length; c < f; c += 1) {
      const d = l[c];
      if (i.call(d) !== "[object Object]") return !1;
      const h = Object.keys(d);
      if (h.length !== 1) return !1;
      a[c] = [h[0], d[h[0]]];
    }
    return !0;
  }
  function o(s) {
    if (s === null) return [];
    const l = s, a = new Array(l.length);
    for (let c = 0, f = l.length; c < f; c += 1) {
      const d = l[c], h = Object.keys(d);
      a[c] = [h[0], d[h[0]]];
    }
    return a;
  }
  return Ft = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: n,
    construct: o
  }), Ft;
}
var Pt, Ri;
function pn() {
  if (Ri) return Pt;
  Ri = 1;
  const e = K(), i = Object.prototype.hasOwnProperty;
  function n(s) {
    if (s === null) return !0;
    const l = s;
    for (const a in l)
      if (i.call(l, a) && l[a] !== null)
        return !1;
    return !0;
  }
  function o(s) {
    return s !== null ? s : {};
  }
  return Pt = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: n,
    construct: o
  }), Pt;
}
var Ut, qi;
function Xt() {
  return qi || (qi = 1, Ut = ln().extend({
    implicit: [
      sn(),
      an()
    ],
    explicit: [
      cn(),
      un(),
      dn(),
      pn()
    ]
  })), Ut;
}
var Ii;
function Bn() {
  if (Ii) return it;
  Ii = 1;
  const e = Ye(), i = He(), n = Hn(), o = Xt(), s = Object.prototype.hasOwnProperty, l = 1, a = 2, c = 3, f = 4, d = 1, h = 2, v = 3, E = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, q = /[\x85\u2028\u2029]/, H = /[,\[\]{}]/, P = /^(?:!|!!|![0-9A-Za-z-]+!)$/, G = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function pe(t) {
    return Object.prototype.toString.call(t);
  }
  function j(t) {
    return t === 10 || t === 13;
  }
  function J(t) {
    return t === 9 || t === 32;
  }
  function B(t) {
    return t === 9 || t === 32 || t === 10 || t === 13;
  }
  function oe(t) {
    return t === 44 || t === 91 || t === 93 || t === 123 || t === 125;
  }
  function ut(t) {
    if (t >= 48 && t <= 57)
      return t - 48;
    const u = t | 32;
    return u >= 97 && u <= 102 ? u - 97 + 10 : -1;
  }
  function dt(t) {
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
  function pt(t) {
    return t <= 65535 ? String.fromCharCode(t) : String.fromCharCode(
      (t - 65536 >> 10) + 55296,
      (t - 65536 & 1023) + 56320
    );
  }
  function Ce(t, u, g) {
    u === "__proto__" ? Object.defineProperty(t, u, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: g
    }) : t[u] = g;
  }
  const ze = new Array(256), Te = new Array(256);
  for (let t = 0; t < 256; t++)
    ze[t] = Se(t) ? 1 : 0, Te[t] = Se(t);
  function Y(t, u) {
    this.input = t, this.filename = u.filename || null, this.schema = u.schema || o, this.onWarning = u.onWarning || null, this.legacy = u.legacy || !1, this.json = u.json || !1, this.listener = u.listener || null, this.maxDepth = typeof u.maxDepth == "number" ? u.maxDepth : 100, this.maxTotalMergeKeys = typeof u.maxTotalMergeKeys == "number" ? u.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = t.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function Ke(t, u) {
    const g = {
      name: t.filename,
      buffer: t.input.slice(0, -1),
      // omit trailing \0
      position: t.position,
      line: t.line,
      column: t.position - t.lineStart
    };
    return g.snippet = n(g), new i(u, g);
  }
  function T(t, u) {
    throw Ke(t, u);
  }
  function ve(t, u) {
    t.onWarning && t.onWarning.call(null, Ke(t, u));
  }
  function X(t, u, g) {
    const _ = t.anchorMapTransactions;
    if (_.length !== 0) {
      const m = _[_.length - 1];
      s.call(m, u) || (m[u] = {
        existed: s.call(t.anchorMap, u),
        value: t.anchorMap[u]
      });
    }
    t.anchorMap[u] = g;
  }
  function ht(t) {
    t.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function he(t) {
    const u = t.anchorMapTransactions.pop(), g = t.anchorMapTransactions;
    if (g.length === 0) return;
    const _ = g[g.length - 1], m = Object.keys(u);
    for (let w = 0, r = m.length; w < r; w += 1) {
      const p = m[w];
      s.call(_, p) || (_[p] = u[p]);
    }
  }
  function ft(t) {
    const u = t.anchorMapTransactions.pop(), g = Object.keys(u);
    for (let _ = g.length - 1; _ >= 0; _ -= 1) {
      const m = u[g[_]];
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
  function be(t, u) {
    t.position = u.position, t.line = u.line, t.lineStart = u.lineStart, t.lineIndent = u.lineIndent, t.firstTabInLine = u.firstTabInLine, t.tag = u.tag, t.anchor = u.anchor, t.kind = u.kind, t.result = u.result;
  }
  const je = {
    YAML: function(u, g, _) {
      u.version !== null && T(u, "duplication of %YAML directive"), _.length !== 1 && T(u, "YAML directive accepts exactly one argument");
      const m = /^([0-9]+)\.([0-9]+)$/.exec(_[0]);
      m === null && T(u, "ill-formed argument of the YAML directive");
      const w = parseInt(m[1], 10), r = parseInt(m[2], 10);
      w !== 1 && T(u, "unacceptable YAML version of the document"), u.version = _[0], u.checkLineBreaks = r < 2, r !== 1 && r !== 2 && ve(u, "unsupported YAML version of the document");
    },
    TAG: function(u, g, _) {
      let m;
      _.length !== 2 && T(u, "TAG directive accepts exactly two arguments");
      const w = _[0];
      m = _[1], P.test(w) || T(u, "ill-formed tag handle (first argument) of the TAG directive"), s.call(u.tagMap, w) && T(u, 'there is a previously declared suffix for "' + w + '" tag handle'), G.test(m) || T(u, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        m = decodeURIComponent(m);
      } catch {
        T(u, "tag prefix is malformed: " + m);
      }
      u.tagMap[w] = m;
    }
  };
  function V(t, u, g, _) {
    if (u < g) {
      const m = t.input.slice(u, g);
      if (_)
        for (let w = 0, r = m.length; w < r; w += 1) {
          const p = m.charCodeAt(w);
          p === 9 || p >= 32 && p <= 1114111 || T(t, "expected valid JSON character");
        }
      else E.test(m) && T(t, "the stream contains non-printable characters");
      t.result += m;
    }
  }
  function le(t, u, g, _) {
    e.isObject(g) || T(t, "cannot merge mappings; the provided source object is unacceptable");
    const m = Object.keys(g);
    for (let w = 0, r = m.length; w < r; w += 1) {
      const p = m[w];
      t.maxTotalMergeKeys !== -1 && ++t.totalMergeKeys > t.maxTotalMergeKeys && T(t, "merge keys exceeded maxTotalMergeKeys (" + t.maxTotalMergeKeys + ")"), s.call(u, p) || (Ce(u, p, g[p]), _[p] = !0);
    }
  }
  function ee(t, u, g, _, m, w, r, p, A) {
    if (Array.isArray(m)) {
      m = Array.prototype.slice.call(m);
      for (let y = 0, b = m.length; y < b; y += 1)
        Array.isArray(m[y]) && T(t, "nested arrays are not supported inside keys"), typeof m == "object" && pe(m[y]) === "[object Object]" && (m[y] = "[object Object]");
    }
    if (typeof m == "object" && pe(m) === "[object Object]" && (m = "[object Object]"), m = String(m), u === null && (u = {}), _ === "tag:yaml.org,2002:merge")
      if (Array.isArray(w))
        for (let y = 0, b = w.length; y < b; y += 1)
          le(t, u, w[y], g);
      else
        le(t, u, w, g);
    else
      !t.json && !s.call(g, m) && s.call(u, m) && (t.line = r || t.line, t.lineStart = p || t.lineStart, t.position = A || t.position, T(t, "duplicated mapping key")), Ce(u, m, w), delete g[m];
    return u;
  }
  function _e(t) {
    const u = t.input.charCodeAt(t.position);
    u === 10 ? t.position++ : u === 13 ? (t.position++, t.input.charCodeAt(t.position) === 10 && t.position++) : T(t, "a line break is expected"), t.line += 1, t.lineStart = t.position, t.firstTabInLine = -1;
  }
  function U(t, u, g) {
    let _ = 0, m = t.input.charCodeAt(t.position);
    for (; m !== 0; ) {
      for (; J(m); )
        m === 9 && t.firstTabInLine === -1 && (t.firstTabInLine = t.position), m = t.input.charCodeAt(++t.position);
      if (u && m === 35)
        do
          m = t.input.charCodeAt(++t.position);
        while (m !== 10 && m !== 13 && m !== 0);
      if (j(m))
        for (_e(t), m = t.input.charCodeAt(t.position), _++, t.lineIndent = 0; m === 32; )
          t.lineIndent++, m = t.input.charCodeAt(++t.position);
      else
        break;
    }
    return g !== -1 && _ !== 0 && t.lineIndent < g && ve(t, "deficient indentation"), _;
  }
  function $e(t) {
    let u = t.position, g = t.input.charCodeAt(u);
    return !!((g === 45 || g === 46) && g === t.input.charCodeAt(u + 1) && g === t.input.charCodeAt(u + 2) && (u += 3, g = t.input.charCodeAt(u), g === 0 || B(g)));
  }
  function te(t, u) {
    u === 1 ? t.result += " " : u > 1 && (t.result += e.repeat(`
`, u - 1));
  }
  function Je(t, u, g) {
    let _, m, w, r, p, A;
    const y = t.kind, b = t.result;
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
        if (j(x))
          if (r = t.line, p = t.lineStart, A = t.lineIndent, U(t, !1, -1), t.lineIndent >= u) {
            w = !0, x = t.input.charCodeAt(t.position);
            continue;
          } else {
            t.position = m, t.line = r, t.lineStart = p, t.lineIndent = A;
            break;
          }
      }
      w && (V(t, _, m, !1), te(t, t.line - r), _ = m = t.position, w = !1), J(x) || (m = t.position + 1), x = t.input.charCodeAt(++t.position);
    }
    return V(t, _, m, !1), t.result ? !0 : (t.kind = y, t.result = b, !1);
  }
  function We(t, u) {
    let g, _, m = t.input.charCodeAt(t.position);
    if (m !== 39)
      return !1;
    for (t.kind = "scalar", t.result = "", t.position++, g = _ = t.position; (m = t.input.charCodeAt(t.position)) !== 0; )
      if (m === 39)
        if (V(t, g, t.position, !0), m = t.input.charCodeAt(++t.position), m === 39)
          g = t.position, t.position++, _ = t.position;
        else
          return !0;
      else j(m) ? (V(t, g, _, !0), te(t, U(t, !1, u)), g = _ = t.position) : t.position === t.lineStart && $e(t) ? T(t, "unexpected end of the document within a single quoted scalar") : (t.position++, J(m) || (_ = t.position));
    T(t, "unexpected end of the stream within a single quoted scalar");
  }
  function Oe(t, u) {
    let g, _, m, w = t.input.charCodeAt(t.position);
    if (w !== 34)
      return !1;
    for (t.kind = "scalar", t.result = "", t.position++, g = _ = t.position; (w = t.input.charCodeAt(t.position)) !== 0; ) {
      if (w === 34)
        return V(t, g, t.position, !0), t.position++, !0;
      if (w === 92) {
        if (V(t, g, t.position, !0), w = t.input.charCodeAt(++t.position), j(w))
          U(t, !1, u);
        else if (w < 256 && ze[w])
          t.result += Te[w], t.position++;
        else if ((m = dt(w)) > 0) {
          let r = m, p = 0;
          for (; r > 0; r--)
            w = t.input.charCodeAt(++t.position), (m = ut(w)) >= 0 ? p = (p << 4) + m : T(t, "expected hexadecimal character");
          t.result += pt(p), t.position++;
        } else
          T(t, "unknown escape sequence");
        g = _ = t.position;
      } else j(w) ? (V(t, g, _, !0), te(t, U(t, !1, u)), g = _ = t.position) : t.position === t.lineStart && $e(t) ? T(t, "unexpected end of the document within a double quoted scalar") : (t.position++, J(w) || (_ = t.position));
    }
    T(t, "unexpected end of the stream within a double quoted scalar");
  }
  function Ve(t, u) {
    let g = !0, _, m, w;
    const r = t.tag;
    let p;
    const A = t.anchor;
    let y, b, x, $;
    const C = /* @__PURE__ */ Object.create(null);
    let S, M, R, I = t.input.charCodeAt(t.position);
    if (I === 91)
      y = 93, $ = !1, p = [];
    else if (I === 123)
      y = 125, $ = !0, p = {};
    else
      return !1;
    for (t.anchor !== null && X(t, t.anchor, p), I = t.input.charCodeAt(++t.position); I !== 0; ) {
      if (U(t, !0, u), I = t.input.charCodeAt(t.position), I === y)
        return t.position++, t.tag = r, t.anchor = A, t.kind = $ ? "mapping" : "sequence", t.result = p, !0;
      if (g ? I === 44 && T(t, "expected the node content, but found ','") : T(t, "missed comma between flow collection entries"), M = S = R = null, b = x = !1, I === 63) {
        const F = t.input.charCodeAt(t.position + 1);
        B(F) && (b = x = !0, t.position++, U(t, !0, u));
      }
      _ = t.line, m = t.lineStart, w = t.position, ne(t, u, l, !1, !0), M = t.tag, S = t.result, U(t, !0, u), I = t.input.charCodeAt(t.position), (x || t.line === _) && I === 58 && (b = !0, I = t.input.charCodeAt(++t.position), U(t, !0, u), ne(t, u, l, !1, !0), R = t.result), $ ? ee(t, p, C, M, S, R, _, m, w) : b ? p.push(ee(t, null, C, M, S, R, _, m, w)) : p.push(S), U(t, !0, u), I = t.input.charCodeAt(t.position), I === 44 ? (g = !0, I = t.input.charCodeAt(++t.position)) : g = !1;
    }
    T(t, "unexpected end of the stream within a flow collection");
  }
  function Ge(t, u) {
    let g, _ = d, m = !1, w = !1, r = u, p = 0, A = !1, y, b = t.input.charCodeAt(t.position);
    if (b === 124)
      g = !1;
    else if (b === 62)
      g = !0;
    else
      return !1;
    for (t.kind = "scalar", t.result = ""; b !== 0; )
      if (b = t.input.charCodeAt(++t.position), b === 43 || b === 45)
        d === _ ? _ = b === 43 ? v : h : T(t, "repeat of a chomping mode identifier");
      else if ((y = Be(b)) >= 0)
        y === 0 ? T(t, "bad explicit indentation width of a block scalar; it cannot be less than one") : w ? T(t, "repeat of an indentation width identifier") : (r = u + y - 1, w = !0);
      else
        break;
    if (J(b)) {
      do
        b = t.input.charCodeAt(++t.position);
      while (J(b));
      if (b === 35)
        do
          b = t.input.charCodeAt(++t.position);
        while (!j(b) && b !== 0);
    }
    for (; b !== 0; ) {
      for (_e(t), t.lineIndent = 0, b = t.input.charCodeAt(t.position); (!w || t.lineIndent < r) && b === 32; )
        t.lineIndent++, b = t.input.charCodeAt(++t.position);
      if (!w && t.lineIndent > r && (r = t.lineIndent), j(b)) {
        p++;
        continue;
      }
      if (!w && r === 0 && T(t, "missing indentation for block scalar"), t.lineIndent < r) {
        _ === v ? t.result += e.repeat(`
`, m ? 1 + p : p) : _ === d && m && (t.result += `
`);
        break;
      }
      g ? J(b) ? (A = !0, t.result += e.repeat(`
`, m ? 1 + p : p)) : A ? (A = !1, t.result += e.repeat(`
`, p + 1)) : p === 0 ? m && (t.result += " ") : t.result += e.repeat(`
`, p) : t.result += e.repeat(`
`, m ? 1 + p : p), m = !0, w = !0, p = 0;
      const x = t.position;
      for (; !j(b) && b !== 0; )
        b = t.input.charCodeAt(++t.position);
      V(t, x, t.position, !1);
    }
    return !0;
  }
  function ie(t, u) {
    const g = t.tag, _ = t.anchor, m = [];
    let w = !1;
    if (t.firstTabInLine !== -1) return !1;
    t.anchor !== null && X(t, t.anchor, m);
    let r = t.input.charCodeAt(t.position);
    for (; r !== 0 && (t.firstTabInLine !== -1 && (t.position = t.firstTabInLine, T(t, "tab characters must not be used in indentation")), r === 45); ) {
      const p = t.input.charCodeAt(t.position + 1);
      if (!B(p))
        break;
      if (w = !0, t.position++, U(t, !0, -1) && t.lineIndent <= u) {
        m.push(null), r = t.input.charCodeAt(t.position);
        continue;
      }
      const A = t.line;
      if (ne(t, u, c, !1, !0), m.push(t.result), U(t, !0, -1), r = t.input.charCodeAt(t.position), (t.line === A || t.lineIndent > u) && r !== 0)
        T(t, "bad indentation of a sequence entry");
      else if (t.lineIndent < u)
        break;
    }
    return w ? (t.tag = g, t.anchor = _, t.kind = "sequence", t.result = m, !0) : !1;
  }
  function Ze(t, u, g) {
    let _, m, w, r;
    const p = t.tag, A = t.anchor, y = {}, b = /* @__PURE__ */ Object.create(null);
    let x = null, $ = null, C = null, S = !1, M = !1;
    if (t.firstTabInLine !== -1) return !1;
    t.anchor !== null && X(t, t.anchor, y);
    let R = t.input.charCodeAt(t.position);
    for (; R !== 0; ) {
      !S && t.firstTabInLine !== -1 && (t.position = t.firstTabInLine, T(t, "tab characters must not be used in indentation"));
      const I = t.input.charCodeAt(t.position + 1), F = t.line;
      if ((R === 63 || R === 58) && B(I))
        R === 63 ? (S && (ee(t, y, b, x, $, null, m, w, r), x = $ = C = null), M = !0, S = !0, _ = !0) : S ? (S = !1, _ = !0) : T(t, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), t.position += 1, R = I;
      else {
        if (m = t.line, w = t.lineStart, r = t.position, !ne(t, g, a, !1, !0))
          break;
        if (t.line === F) {
          for (R = t.input.charCodeAt(t.position); J(R); )
            R = t.input.charCodeAt(++t.position);
          if (R === 58)
            R = t.input.charCodeAt(++t.position), B(R) || T(t, "a whitespace character is expected after the key-value separator within a block mapping"), S && (ee(t, y, b, x, $, null, m, w, r), x = $ = C = null), M = !0, S = !1, _ = !1, x = t.tag, $ = t.result;
          else if (M)
            T(t, "can not read an implicit mapping pair; a colon is missed");
          else
            return t.tag = p, t.anchor = A, !0;
        } else if (M)
          T(t, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return t.tag = p, t.anchor = A, !0;
      }
      if ((t.line === F || t.lineIndent > u) && (S && (m = t.line, w = t.lineStart, r = t.position), ne(t, u, f, !0, _) && (S ? $ = t.result : C = t.result), S || (ee(t, y, b, x, $, C, m, w, r), x = $ = C = null), U(t, !0, -1), R = t.input.charCodeAt(t.position)), (t.line === F || t.lineIndent > u) && R !== 0)
        T(t, "bad indentation of a mapping entry");
      else if (t.lineIndent < u)
        break;
    }
    return S && ee(t, y, b, x, $, null, m, w, r), M && (t.tag = p, t.anchor = A, t.kind = "mapping", t.result = y), M;
  }
  function mt(t) {
    let u = !1, g = !1, _, m, w = t.input.charCodeAt(t.position);
    if (w !== 33) return !1;
    t.tag !== null && T(t, "duplication of a tag property"), w = t.input.charCodeAt(++t.position), w === 60 ? (u = !0, w = t.input.charCodeAt(++t.position)) : w === 33 ? (g = !0, _ = "!!", w = t.input.charCodeAt(++t.position)) : _ = "!";
    let r = t.position;
    if (u) {
      do
        w = t.input.charCodeAt(++t.position);
      while (w !== 0 && w !== 62);
      t.position < t.length ? (m = t.input.slice(r, t.position), w = t.input.charCodeAt(++t.position)) : T(t, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; w !== 0 && !B(w); )
        w === 33 && (g ? T(t, "tag suffix cannot contain exclamation marks") : (_ = t.input.slice(r - 1, t.position + 1), P.test(_) || T(t, "named tag handle cannot contain such characters"), g = !0, r = t.position + 1)), w = t.input.charCodeAt(++t.position);
      m = t.input.slice(r, t.position), H.test(m) && T(t, "tag suffix cannot contain flow indicator characters");
    }
    m && !G.test(m) && T(t, "tag name cannot contain such characters: " + m);
    try {
      m = decodeURIComponent(m);
    } catch {
      T(t, "tag name is malformed: " + m);
    }
    return u ? t.tag = m : s.call(t.tagMap, _) ? t.tag = t.tagMap[_] + m : _ === "!" ? t.tag = "!" + m : _ === "!!" ? t.tag = "tag:yaml.org,2002:" + m : T(t, 'undeclared tag handle "' + _ + '"'), !0;
  }
  function Qe(t) {
    let u = t.input.charCodeAt(t.position);
    if (u !== 38) return !1;
    t.anchor !== null && T(t, "duplication of an anchor property"), u = t.input.charCodeAt(++t.position);
    const g = t.position;
    for (; u !== 0 && !B(u) && !oe(u); )
      u = t.input.charCodeAt(++t.position);
    return t.position === g && T(t, "name of an anchor node must contain at least one character"), t.anchor = t.input.slice(g, t.position), !0;
  }
  function Xe(t) {
    let u = t.input.charCodeAt(t.position);
    if (u !== 42) return !1;
    u = t.input.charCodeAt(++t.position);
    const g = t.position;
    for (; u !== 0 && !B(u) && !oe(u); )
      u = t.input.charCodeAt(++t.position);
    t.position === g && T(t, "name of an alias node must contain at least one character");
    const _ = t.input.slice(g, t.position);
    return s.call(t.anchorMap, _) || T(t, 'unidentified alias "' + _ + '"'), t.result = t.anchorMap[_], U(t, !0, -1), !0;
  }
  function gt(t, u, g, _) {
    const m = Ee(t);
    return ht(t), be(t, u), t.tag = null, t.anchor = null, t.kind = null, t.result = null, Ze(t, g, _) && t.kind === "mapping" ? (he(t), !0) : (ft(t), be(t, m), !1);
  }
  function ne(t, u, g, _, m) {
    let w, r, p = 1, A = !1, y = !1, b = null, x, $, C;
    t.depth >= t.maxDepth && T(t, "nesting exceeded maxDepth (" + t.maxDepth + ")"), t.depth += 1, t.listener !== null && t.listener("open", t), t.tag = null, t.anchor = null, t.kind = null, t.result = null;
    const S = w = r = f === g || c === g;
    if (_ && U(t, !0, -1) && (A = !0, t.lineIndent > u ? p = 1 : t.lineIndent === u ? p = 0 : t.lineIndent < u && (p = -1)), p === 1)
      for (; ; ) {
        const M = t.input.charCodeAt(t.position), R = Ee(t);
        if (A && (M === 33 && t.tag !== null || M === 38 && t.anchor !== null) || !mt(t) && !Qe(t))
          break;
        b === null && (b = R), U(t, !0, -1) ? (A = !0, r = S, t.lineIndent > u ? p = 1 : t.lineIndent === u ? p = 0 : t.lineIndent < u && (p = -1)) : r = !1;
      }
    if (r && (r = A || m), p === 1 || f === g)
      if (l === g || a === g ? $ = u : $ = u + 1, C = t.position - t.lineStart, p === 1)
        if (r && (ie(t, C) || Ze(t, C, $)) || Ve(t, $))
          y = !0;
        else {
          const M = t.input.charCodeAt(t.position);
          b !== null && S && !r && M !== 124 && M !== 62 && gt(
            t,
            b,
            b.position - b.lineStart,
            $
          ) || w && Ge(t, $) || We(t, $) || Oe(t, $) ? y = !0 : Xe(t) ? (y = !0, (t.tag !== null || t.anchor !== null) && T(t, "alias node should not have any properties")) : Je(t, $, l === g) && (y = !0, t.tag === null && (t.tag = "?")), t.anchor !== null && X(t, t.anchor, t.result);
        }
      else p === 0 && (y = r && ie(t, C));
    if (t.tag === null)
      t.anchor !== null && X(t, t.anchor, t.result);
    else if (t.tag === "?") {
      t.result !== null && t.kind !== "scalar" && T(t, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + t.kind + '"');
      for (let M = 0, R = t.implicitTypes.length; M < R; M += 1)
        if (x = t.implicitTypes[M], x.resolve(t.result)) {
          t.result = x.construct(t.result), t.tag = x.tag, t.anchor !== null && X(t, t.anchor, t.result);
          break;
        }
    } else if (t.tag !== "!") {
      if (s.call(t.typeMap[t.kind || "fallback"], t.tag))
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
      x || T(t, "unknown tag !<" + t.tag + ">"), t.result !== null && x.kind !== t.kind && T(t, "unacceptable node kind for !<" + t.tag + '> tag; it should be "' + x.kind + '", not "' + t.kind + '"'), x.resolve(t.result, t.tag) ? (t.result = x.construct(t.result, t.tag), t.anchor !== null && X(t, t.anchor, t.result)) : T(t, "cannot resolve a node with !<" + t.tag + "> explicit tag");
    }
    return t.listener !== null && t.listener("close", t), t.depth -= 1, t.tag !== null || t.anchor !== null || y;
  }
  function yt(t) {
    const u = t.position;
    let g = !1, _;
    for (t.version = null, t.checkLineBreaks = t.legacy, t.tagMap = /* @__PURE__ */ Object.create(null), t.anchorMap = /* @__PURE__ */ Object.create(null); (_ = t.input.charCodeAt(t.position)) !== 0 && (U(t, !0, -1), _ = t.input.charCodeAt(t.position), !(t.lineIndent > 0 || _ !== 37)); ) {
      g = !0, _ = t.input.charCodeAt(++t.position);
      let m = t.position;
      for (; _ !== 0 && !B(_); )
        _ = t.input.charCodeAt(++t.position);
      const w = t.input.slice(m, t.position), r = [];
      for (w.length < 1 && T(t, "directive name must not be less than one character in length"); _ !== 0; ) {
        for (; J(_); )
          _ = t.input.charCodeAt(++t.position);
        if (_ === 35) {
          do
            _ = t.input.charCodeAt(++t.position);
          while (_ !== 0 && !j(_));
          break;
        }
        if (j(_)) break;
        for (m = t.position; _ !== 0 && !B(_); )
          _ = t.input.charCodeAt(++t.position);
        r.push(t.input.slice(m, t.position));
      }
      _ !== 0 && _e(t), s.call(je, w) ? je[w](t, w, r) : ve(t, 'unknown document directive "' + w + '"');
    }
    if (U(t, !0, -1), t.lineIndent === 0 && t.input.charCodeAt(t.position) === 45 && t.input.charCodeAt(t.position + 1) === 45 && t.input.charCodeAt(t.position + 2) === 45 ? (t.position += 3, U(t, !0, -1)) : g && T(t, "directives end mark is expected"), ne(t, t.lineIndent - 1, f, !1, !0), U(t, !0, -1), t.checkLineBreaks && q.test(t.input.slice(u, t.position)) && ve(t, "non-ASCII line breaks are interpreted as content"), t.documents.push(t.result), t.position === t.lineStart && $e(t)) {
      t.input.charCodeAt(t.position) === 46 && (t.position += 3, U(t, !0, -1));
      return;
    }
    t.position < t.length - 1 && T(t, "end of the stream or a document separator is expected");
  }
  function et(t, u) {
    t = String(t), u = u || {}, t.length !== 0 && (t.charCodeAt(t.length - 1) !== 10 && t.charCodeAt(t.length - 1) !== 13 && (t += `
`), t.charCodeAt(0) === 65279 && (t = t.slice(1)));
    const g = new Y(t, u), _ = t.indexOf("\0");
    for (_ !== -1 && (g.position = _, T(g, "null byte is not allowed in input")), g.input += "\0"; g.input.charCodeAt(g.position) === 32; )
      g.lineIndent += 1, g.position += 1;
    for (; g.position < g.length - 1; )
      yt(g);
    return g.documents;
  }
  function tt(t, u, g) {
    u !== null && typeof u == "object" && typeof g > "u" && (g = u, u = null);
    const _ = et(t, g);
    if (typeof u != "function")
      return _;
    for (let m = 0, w = _.length; m < w; m += 1)
      u(_[m]);
  }
  function vt(t, u) {
    const g = et(t, u);
    if (g.length !== 0) {
      if (g.length === 1)
        return g[0];
      throw new i("expected a single document in the stream, but found more");
    }
  }
  return it.loadAll = tt, it.load = vt, it;
}
var Yt = {}, Li;
function zn() {
  if (Li) return Yt;
  Li = 1;
  const e = Ye(), i = He(), n = Xt(), o = Object.prototype.toString, s = Object.prototype.hasOwnProperty, l = 65279, a = 9, c = 10, f = 13, d = 32, h = 33, v = 34, E = 35, q = 37, H = 38, P = 39, G = 42, pe = 44, j = 45, J = 58, B = 61, oe = 62, ut = 63, dt = 64, Be = 91, Se = 93, pt = 96, Ce = 123, ze = 124, Te = 125, Y = {};
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
  ], T = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function ve(r, p) {
    if (p === null) return {};
    const A = {}, y = Object.keys(p);
    for (let b = 0, x = y.length; b < x; b += 1) {
      let $ = y[b], C = String(p[$]);
      $.slice(0, 2) === "!!" && ($ = "tag:yaml.org,2002:" + $.slice(2));
      const S = r.compiledTypeMap.fallback[$];
      S && s.call(S.styleAliases, C) && (C = S.styleAliases[C]), A[$] = C;
    }
    return A;
  }
  function X(r) {
    let p, A;
    const y = r.toString(16).toUpperCase();
    if (r <= 255)
      p = "x", A = 2;
    else if (r <= 65535)
      p = "u", A = 4;
    else if (r <= 4294967295)
      p = "U", A = 8;
    else
      throw new i("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + p + e.repeat("0", A - y.length) + y;
  }
  const ht = 1, he = 2;
  function ft(r) {
    this.schema = r.schema || n, this.indent = Math.max(1, r.indent || 2), this.noArrayIndent = r.noArrayIndent || !1, this.skipInvalid = r.skipInvalid || !1, this.flowLevel = e.isNothing(r.flowLevel) ? -1 : r.flowLevel, this.styleMap = ve(this.schema, r.styles || null), this.sortKeys = r.sortKeys || !1, this.lineWidth = r.lineWidth || 80, this.noRefs = r.noRefs || !1, this.noCompatMode = r.noCompatMode || !1, this.condenseFlow = r.condenseFlow || !1, this.quotingType = r.quotingType === '"' ? he : ht, this.forceQuotes = r.forceQuotes || !1, this.replacer = typeof r.replacer == "function" ? r.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function Ee(r, p) {
    const A = e.repeat(" ", p);
    let y = 0, b = "";
    const x = r.length;
    for (; y < x; ) {
      let $;
      const C = r.indexOf(`
`, y);
      C === -1 ? ($ = r.slice(y), y = x) : ($ = r.slice(y, C + 1), y = C + 1), $.length && $ !== `
` && (b += A), b += $;
    }
    return b;
  }
  function be(r, p) {
    return `
` + e.repeat(" ", r.indent * p);
  }
  function je(r, p) {
    for (let A = 0, y = r.implicitTypes.length; A < y; A += 1)
      if (r.implicitTypes[A].resolve(p))
        return !0;
    return !1;
  }
  function V(r) {
    return r === d || r === a;
  }
  function le(r) {
    return r >= 32 && r <= 126 || r >= 161 && r <= 55295 && r !== 8232 && r !== 8233 || r >= 57344 && r <= 65533 && r !== l || r >= 65536 && r <= 1114111;
  }
  function ee(r) {
    return le(r) && r !== l && // - b-char
    r !== f && r !== c;
  }
  function _e(r, p, A) {
    const y = ee(r), b = y && !V(r);
    return (
      // ns-plain-safe
      (A ? y : y && // - c-flow-indicator
      r !== pe && r !== Be && r !== Se && r !== Ce && r !== Te) && // ns-plain-char
      r !== E && // false on '#'
      !(p === J && !b) || // false on ': '
      ee(p) && !V(p) && r === E || // change to true on '[^ ]#'
      p === J && b
    );
  }
  function U(r) {
    return le(r) && r !== l && !V(r) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    r !== j && r !== ut && r !== J && r !== pe && r !== Be && r !== Se && r !== Ce && r !== Te && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    r !== E && r !== H && r !== G && r !== h && r !== ze && r !== B && r !== oe && r !== P && r !== v && // | “%” | “@” | “`”)
    r !== q && r !== dt && r !== pt;
  }
  function $e(r) {
    return !V(r) && r !== J;
  }
  function te(r, p) {
    const A = r.charCodeAt(p);
    let y;
    return A >= 55296 && A <= 56319 && p + 1 < r.length && (y = r.charCodeAt(p + 1), y >= 56320 && y <= 57343) ? (A - 55296) * 1024 + y - 56320 + 65536 : A;
  }
  function Je(r) {
    return /^\n* /.test(r);
  }
  const We = 1, Oe = 2, Ve = 3, Ge = 4, ie = 5;
  function Ze(r, p, A, y, b, x, $, C) {
    let S, M = 0, R = null, I = !1, F = !1;
    const ei = y !== -1;
    let Me = -1, Re = U(te(r, 0)) && $e(te(r, r.length - 1));
    if (p || $)
      for (S = 0; S < r.length; M >= 65536 ? S += 2 : S++) {
        if (M = te(r, S), !le(M))
          return ie;
        Re = Re && _e(M, R, C), R = M;
      }
    else {
      for (S = 0; S < r.length; M >= 65536 ? S += 2 : S++) {
        if (M = te(r, S), M === c)
          I = !0, ei && (F = F || // Foldable line = too long, and not more-indented.
          S - Me - 1 > y && r[Me + 1] !== " ", Me = S);
        else if (!le(M))
          return ie;
        Re = Re && _e(M, R, C), R = M;
      }
      F = F || ei && S - Me - 1 > y && r[Me + 1] !== " ";
    }
    return !I && !F ? Re && !$ && !b(r) ? We : x === he ? ie : Oe : A > 9 && Je(r) ? ie : $ ? x === he ? ie : Oe : F ? Ge : Ve;
  }
  function mt(r, p, A, y, b) {
    r.dump = (function() {
      if (p.length === 0)
        return r.quotingType === he ? '""' : "''";
      if (!r.noCompatMode && (Ke.indexOf(p) !== -1 || T.test(p)))
        return r.quotingType === he ? '"' + p + '"' : "'" + p + "'";
      const x = r.indent * Math.max(1, A), $ = r.lineWidth === -1 ? -1 : Math.max(Math.min(r.lineWidth, 40), r.lineWidth - x), C = y || // No block styles in flow mode.
      r.flowLevel > -1 && A >= r.flowLevel;
      function S(M) {
        return je(r, M);
      }
      switch (Ze(
        p,
        C,
        r.indent,
        $,
        S,
        r.quotingType,
        r.forceQuotes && !y,
        b
      )) {
        case We:
          return p;
        case Oe:
          return "'" + p.replace(/'/g, "''") + "'";
        case Ve:
          return "|" + Qe(p, r.indent) + Xe(Ee(p, x));
        case Ge:
          return ">" + Qe(p, r.indent) + Xe(Ee(gt(p, $), x));
        case ie:
          return '"' + yt(p) + '"';
        default:
          throw new i("impossible error: invalid scalar style");
      }
    })();
  }
  function Qe(r, p) {
    const A = Je(r) ? String(p) : "", y = r[r.length - 1] === `
`, x = y && (r[r.length - 2] === `
` || r === `
`) ? "+" : y ? "" : "-";
    return A + x + `
`;
  }
  function Xe(r) {
    return r[r.length - 1] === `
` ? r.slice(0, -1) : r;
  }
  function gt(r, p) {
    const A = /(\n+)([^\n]*)/g;
    let y = (function() {
      let C = r.indexOf(`
`);
      return C = C !== -1 ? C : r.length, A.lastIndex = C, ne(r.slice(0, C), p);
    })(), b = r[0] === `
` || r[0] === " ", x, $;
    for (; $ = A.exec(r); ) {
      const C = $[1], S = $[2];
      x = S[0] === " ", y += C + (!b && !x && S !== "" ? `
` : "") + ne(S, p), b = x;
    }
    return y;
  }
  function ne(r, p) {
    if (r === "" || r[0] === " ") return r;
    const A = / [^ ]/g;
    let y, b = 0, x, $ = 0, C = 0, S = "";
    for (; y = A.exec(r); )
      C = y.index, C - b > p && (x = $ > b ? $ : C, S += `
` + r.slice(b, x), b = x + 1), $ = C;
    return S += `
`, r.length - b > p && $ > b ? S += r.slice(b, $) + `
` + r.slice($ + 1) : S += r.slice(b), S.slice(1);
  }
  function yt(r) {
    let p = "", A = 0;
    for (let y = 0; y < r.length; A >= 65536 ? y += 2 : y++) {
      A = te(r, y);
      const b = Y[A];
      !b && le(A) ? (p += r[y], A >= 65536 && (p += r[y + 1])) : p += b || X(A);
    }
    return p;
  }
  function et(r, p, A) {
    let y = "";
    const b = r.tag;
    for (let x = 0, $ = A.length; x < $; x += 1) {
      let C = A[x];
      r.replacer && (C = r.replacer.call(A, String(x), C)), (g(r, p, C, !1, !1) || typeof C > "u" && g(r, p, null, !1, !1)) && (y !== "" && (y += "," + (r.condenseFlow ? "" : " ")), y += r.dump);
    }
    r.tag = b, r.dump = "[" + y + "]";
  }
  function tt(r, p, A, y) {
    let b = "";
    const x = r.tag;
    for (let $ = 0, C = A.length; $ < C; $ += 1) {
      let S = A[$];
      r.replacer && (S = r.replacer.call(A, String($), S)), (g(r, p + 1, S, !0, !0, !1, !0) || typeof S > "u" && g(r, p + 1, null, !0, !0, !1, !0)) && ((!y || b !== "") && (b += be(r, p)), r.dump && c === r.dump.charCodeAt(0) ? b += "-" : b += "- ", b += r.dump);
    }
    r.tag = x, r.dump = b || "[]";
  }
  function vt(r, p, A) {
    let y = "";
    const b = r.tag, x = Object.keys(A);
    for (let $ = 0, C = x.length; $ < C; $ += 1) {
      let S = "";
      y !== "" && (S += ", "), r.condenseFlow && (S += '"');
      const M = x[$];
      let R = A[M];
      r.replacer && (R = r.replacer.call(A, M, R)), g(r, p, M, !1, !1) && (r.dump.length > 1024 && (S += "? "), S += r.dump + (r.condenseFlow ? '"' : "") + ":" + (r.condenseFlow ? "" : " "), g(r, p, R, !1, !1) && (S += r.dump, y += S));
    }
    r.tag = b, r.dump = "{" + y + "}";
  }
  function t(r, p, A, y) {
    let b = "";
    const x = r.tag, $ = Object.keys(A);
    if (r.sortKeys === !0)
      $.sort();
    else if (typeof r.sortKeys == "function")
      $.sort(r.sortKeys);
    else if (r.sortKeys)
      throw new i("sortKeys must be a boolean or a function");
    for (let C = 0, S = $.length; C < S; C += 1) {
      let M = "";
      (!y || b !== "") && (M += be(r, p));
      const R = $[C];
      let I = A[R];
      if (r.replacer && (I = r.replacer.call(A, R, I)), !g(r, p + 1, R, !0, !0, !0))
        continue;
      const F = r.tag !== null && r.tag !== "?" || r.dump && r.dump.length > 1024;
      F && (r.dump && c === r.dump.charCodeAt(0) ? M += "?" : M += "? "), M += r.dump, F && (M += be(r, p)), g(r, p + 1, I, !0, F) && (r.dump && c === r.dump.charCodeAt(0) ? M += ":" : M += ": ", M += r.dump, b += M);
    }
    r.tag = x, r.dump = b || "{}";
  }
  function u(r, p, A) {
    const y = A ? r.explicitTypes : r.implicitTypes;
    for (let b = 0, x = y.length; b < x; b += 1) {
      const $ = y[b];
      if (($.instanceOf || $.predicate) && (!$.instanceOf || typeof p == "object" && p instanceof $.instanceOf) && (!$.predicate || $.predicate(p))) {
        if (A ? $.multi && $.representName ? r.tag = $.representName(p) : r.tag = $.tag : r.tag = "?", $.represent) {
          const C = r.styleMap[$.tag] || $.defaultStyle;
          let S;
          if (o.call($.represent) === "[object Function]")
            S = $.represent(p, C);
          else if (s.call($.represent, C))
            S = $.represent[C](p, C);
          else
            throw new i("!<" + $.tag + '> tag resolver accepts not "' + C + '" style');
          r.dump = S;
        }
        return !0;
      }
    }
    return !1;
  }
  function g(r, p, A, y, b, x, $) {
    r.tag = null, r.dump = A, u(r, A, !1) || u(r, A, !0);
    const C = o.call(r.dump), S = y;
    y && (y = r.flowLevel < 0 || r.flowLevel > p);
    const M = C === "[object Object]" || C === "[object Array]";
    let R, I;
    if (M && (R = r.duplicates.indexOf(A), I = R !== -1), (r.tag !== null && r.tag !== "?" || I || r.indent !== 2 && p > 0) && (b = !1), I && r.usedDuplicates[R])
      r.dump = "*ref_" + R;
    else {
      if (M && I && !r.usedDuplicates[R] && (r.usedDuplicates[R] = !0), C === "[object Object]")
        y && Object.keys(r.dump).length !== 0 ? (t(r, p, r.dump, b), I && (r.dump = "&ref_" + R + r.dump)) : (vt(r, p, r.dump), I && (r.dump = "&ref_" + R + " " + r.dump));
      else if (C === "[object Array]")
        y && r.dump.length !== 0 ? (r.noArrayIndent && !$ && p > 0 ? tt(r, p - 1, r.dump, b) : tt(r, p, r.dump, b), I && (r.dump = "&ref_" + R + r.dump)) : (et(r, p, r.dump), I && (r.dump = "&ref_" + R + " " + r.dump));
      else if (C === "[object String]")
        r.tag !== "?" && mt(r, r.dump, p, x, S);
      else {
        if (C === "[object Undefined]")
          return !1;
        if (r.skipInvalid) return !1;
        throw new i("unacceptable kind of an object to dump " + C);
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
  function _(r, p) {
    const A = [], y = [];
    m(r, A, y);
    const b = y.length;
    for (let x = 0; x < b; x += 1)
      p.duplicates.push(A[y[x]]);
    p.usedDuplicates = new Array(b);
  }
  function m(r, p, A) {
    if (r !== null && typeof r == "object") {
      const y = p.indexOf(r);
      if (y !== -1)
        A.indexOf(y) === -1 && A.push(y);
      else if (p.push(r), Array.isArray(r))
        for (let b = 0, x = r.length; b < x; b += 1)
          m(r[b], p, A);
      else {
        const b = Object.keys(r);
        for (let x = 0, $ = b.length; x < $; x += 1)
          m(r[b[x]], p, A);
      }
    }
  }
  function w(r, p) {
    p = p || {};
    const A = new ft(p);
    A.noRefs || _(r, A);
    let y = r;
    return A.replacer && (y = A.replacer.call({ "": y }, "", y)), g(A, 0, y, !0, !0) ? A.dump + `
` : "";
  }
  return Yt.dump = w, Yt;
}
var Ni;
function Kn() {
  if (Ni) return z;
  Ni = 1;
  const e = Bn(), i = zn();
  function n(o, s) {
    return function() {
      throw new Error("Function yaml." + o + " is removed in js-yaml 4. Use yaml." + s + " instead, which is now safe by default.");
    };
  }
  return z.Type = K(), z.Schema = Vi(), z.FAILSAFE_SCHEMA = Xi(), z.JSON_SCHEMA = on(), z.CORE_SCHEMA = ln(), z.DEFAULT_SCHEMA = Xt(), z.load = e.load, z.loadAll = e.loadAll, z.dump = i.dump, z.YAMLException = He(), z.types = {
    binary: cn(),
    float: rn(),
    map: Qi(),
    null: en(),
    pairs: dn(),
    set: pn(),
    timestamp: sn(),
    bool: tn(),
    int: nn(),
    merge: an(),
    omap: un(),
    seq: Zi(),
    str: Gi()
  }, z.safeLoad = n("safeLoad", "load"), z.safeLoadAll = n("safeLoadAll", "loadAll"), z.safeDump = n("safeDump", "dump"), z;
}
var jn = Kn();
const Jn = /* @__PURE__ */ Yn(jn), {
  Type: gr,
  Schema: yr,
  FAILSAFE_SCHEMA: vr,
  JSON_SCHEMA: br,
  CORE_SCHEMA: _r,
  DEFAULT_SCHEMA: $r,
  load: Ae,
  loadAll: Ar,
  dump: re,
  YAMLException: xr,
  types: wr,
  safeLoad: kr,
  safeLoadAll: Sr,
  safeDump: Cr
} = Jn, ct = (e, i, n = {}) => e.callWS({ type: `deferred_actions/${i}`, data: n }), Wn = (e) => ct(e, "list", { limit: 1e3 }), Vn = (e, i) => ct(e, "create", i), Gn = (e, i) => e.callService("deferred_actions", "run_for", i, void 0, !0, !0), Zn = (e, i) => ct(e, "update", i), Qn = (e, i, n, o = {}) => ct(e, i, { job_id: n, ...o }), Xn = (e, i) => e.connection.subscribeMessage(i, { type: "deferred_actions/subscribe" }), ce = (e) => !!e && typeof e == "object" && !Array.isArray(e), hn = (e) => typeof e == "string" ? [e] : Array.isArray(e) && e.every((i) => typeof i == "string") ? [...e] : void 0, Z = (e, i, n = ["alias", "description", "enabled", "continue_on_error"]) => {
  const o = /* @__PURE__ */ new Set([...i, ...n]);
  return Object.keys(e).some((s) => !o.has(s)) ? void 0 : Object.fromEntries(Object.entries(e).filter(([s]) => n.includes(s)));
}, rt = (e) => Array.isArray(e) ? e.map((i) => ce(i) ? jt(i) : { type: "unsupported", raw: { value: i } }) : void 0, fn = (e) => {
  const i = typeof e.action == "string" ? e.action : typeof e.service == "string" ? e.service : void 0;
  if (i && !(e.action !== void 0 && e.service !== void 0)) {
    const n = Z(e, ["action", "service", "target", "data"]), o = e.target ?? {}, s = e.data ?? {};
    if (n && ce(o) && ce(s) && Object.keys(o).every((l) => ["entity_id", "device_id", "area_id", "floor_id", "label_id"].includes(l))) {
      const l = {};
      for (const c of ["entity_id", "device_id", "area_id", "floor_id", "label_id"]) {
        const f = hn(o[c]);
        if (o[c] !== void 0 && !f) return { kind: "unsupported", raw: e };
        f?.length && (l[c] = f);
      }
      const a = Object.entries(s);
      if (a.every(([, c]) => c === null || ["string", "number", "boolean"].includes(typeof c))) return { kind: "service", action: i, syntax: e.service !== void 0 ? "service" : "action", target: l, scalarTargets: ["entity_id", "device_id", "area_id", "floor_id", "label_id"].filter((c) => typeof o[c] == "string"), data: a.map(([c, f]) => ir(c, f)), metadata: n };
    }
  }
  if (Array.isArray(e.if) && Array.isArray(e.then)) {
    const n = Z(e, ["if", "then", "else"]), o = rt(e.if);
    if (n && o && (e.else === void 0 || Array.isArray(e.else))) return { kind: "if", conditions: o, then: ue(e.then), ...Array.isArray(e.else) ? { else: ue(e.else) } : {}, metadata: n };
  }
  if (Array.isArray(e.choose)) {
    const n = Z(e, ["choose", "default"]);
    if (n && (e.default === void 0 || Array.isArray(e.default))) {
      const o = [];
      for (const s of e.choose) {
        if (!ce(s) || !Array.isArray(s.conditions) || !Array.isArray(s.sequence)) return { kind: "unsupported", raw: e };
        const l = Z(s, ["conditions", "sequence"], ["alias"]), a = rt(s.conditions);
        if (!l || !a) return { kind: "unsupported", raw: e };
        o.push({ conditions: a, sequence: ue(s.sequence), metadata: l });
      }
      return { kind: "choose", choices: o, ...Array.isArray(e.default) ? { default: ue(e.default) } : {}, metadata: n };
    }
  }
  if (ce(e.repeat) && Array.isArray(e.repeat.sequence)) {
    const n = e.repeat, o = Z(e, ["repeat"]), s = Z(n, ["count", "while", "until", "for_each", "sequence"], []);
    if (o && s) {
      const l = ["count", "while", "until", "for_each"].filter((a) => n[a] !== void 0);
      if (l.length === 1) {
        const a = l[0], c = a === "while" || a === "until" ? rt(n[a]) : void 0;
        if (a !== "while" && a !== "until" || c) return { kind: "repeat", mode: a, ...c ? { conditions: c } : { value: n[a] }, sequence: ue(n.sequence), metadata: o };
      }
    }
  }
  if (Array.isArray(e.parallel)) {
    const n = Z(e, ["parallel"]);
    if (n) return { kind: "parallel", branches: e.parallel.map((o) => ce(o) && Array.isArray(o.sequence) && Z(o, ["sequence"], ["alias"]) ? { wrapped: !0, sequence: ue(o.sequence), metadata: Z(o, ["sequence"], ["alias"]) } : ce(o) ? { wrapped: !1, sequence: [fn(o)], metadata: {} } : { wrapped: !1, sequence: [{ kind: "unsupported", raw: { value: o } }], metadata: {} }), metadata: n };
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
}, ue = (e) => e.map((i) => ce(i) ? fn(i) : { kind: "unsupported", raw: { value: i } }), er = (e) => {
  if (e.kind === "unsupported") return e.raw;
  if (e.kind === "service") {
    const i = Object.fromEntries(Object.entries(e.target).filter(([, o]) => o?.length).map(([o, s]) => [o, e.scalarTargets?.includes(o) && Array.isArray(s) && s.length === 1 ? s[0] : s])), n = Object.fromEntries(e.data.filter((o) => o.key.trim()).map((o) => [o.key.trim(), nr(o)]));
    return { ...e.metadata, [e.syntax ?? "action"]: e.action, ...Object.keys(i).length ? { target: i } : {}, ...Object.keys(n).length ? { data: n } : {} };
  }
  return e.kind === "if" ? { ...e.metadata, if: e.conditions.map(Ne), then: Q(e.then), ...e.else ? { else: Q(e.else) } : {} } : e.kind === "choose" ? { ...e.metadata, choose: e.choices.map((i) => ({ ...i.metadata, conditions: i.conditions.map(Ne), sequence: Q(i.sequence) })), ...e.default ? { default: Q(e.default) } : {} } : e.kind === "repeat" ? { ...e.metadata, repeat: { [e.mode]: e.conditions ? e.conditions.map(Ne) : e.value, sequence: Q(e.sequence) } } : e.kind === "parallel" ? { ...e.metadata, parallel: e.branches.map((i) => i.wrapped ? { ...i.metadata, sequence: Q(i.sequence) } : Q(i.sequence)[0]) } : e.kind === "delay" ? { ...e.metadata, delay: e.value } : { ...e.metadata, wait_template: e.template, ...e.timeout !== void 0 ? { timeout: e.timeout } : {}, ...e.continueOnTimeout !== void 0 ? { continue_on_timeout: e.continueOnTimeout } : {} };
}, Q = (e) => e.map(er), jt = (e) => {
  const i = typeof e.alias == "string" ? e.alias : void 0, n = (o) => Z(e, o, ["alias", "enabled"]);
  if (e.condition === "state" && n(["condition", "entity_id", "state"]) && typeof e.entity_id == "string" && typeof e.state == "string") return { type: "state", entity_id: e.entity_id, state: e.state, alias: i, metadata: n(["condition", "entity_id", "state"]) };
  if (e.condition === "numeric_state" && n(["condition", "entity_id", "above", "below"]) && typeof e.entity_id == "string" && [e.above, e.below].every((o) => o === void 0 || typeof o == "number")) return { type: "numeric_state", entity_id: e.entity_id, above: e.above === void 0 ? "" : String(e.above), below: e.below === void 0 ? "" : String(e.below), alias: i, metadata: n(["condition", "entity_id", "above", "below"]) };
  if (e.condition === "time" && n(["condition", "after", "before", "weekday"]) && [e.after, e.before].every((o) => o === void 0 || typeof o == "string")) {
    const o = hn(e.weekday);
    if (e.weekday === void 0 || o) return { type: "time", after: String(e.after ?? ""), before: String(e.before ?? ""), weekdays: o ?? [], weekdayScalar: typeof e.weekday == "string", alias: i, metadata: n(["condition", "after", "before", "weekday"]) };
  }
  return e.condition === "zone" && n(["condition", "entity_id", "zone"]) && typeof e.entity_id == "string" && typeof e.zone == "string" ? { type: "zone", entity_id: e.entity_id, zone: e.zone, alias: i, metadata: n(["condition", "entity_id", "zone"]) } : e.condition === "sun" && n(["condition", "after", "before", "after_offset", "before_offset"]) && [e.after, e.before, e.after_offset, e.before_offset].every((o) => o === void 0 || typeof o == "string") ? { type: "sun", after: String(e.after ?? ""), before: String(e.before ?? ""), after_offset: String(e.after_offset ?? ""), before_offset: String(e.before_offset ?? ""), alias: i, metadata: n(["condition", "after", "before", "after_offset", "before_offset"]) } : ["and", "or", "not"].includes(String(e.condition)) && Array.isArray(e.conditions) && n(["condition", "conditions"]) ? { type: e.condition, conditions: rt(e.conditions), alias: i, metadata: n(["condition", "conditions"]) } : { type: "unsupported", raw: e };
}, Ne = (e) => {
  if (e.type === "unsupported") return e.raw;
  const i = e.metadata;
  return e.type === "state" ? { ...i, condition: "state", entity_id: e.entity_id, state: e.state } : e.type === "numeric_state" ? { ...i, condition: "numeric_state", entity_id: e.entity_id, ...e.above.trim() ? { above: Number(e.above) } : {}, ...e.below.trim() ? { below: Number(e.below) } : {} } : e.type === "time" ? { ...i, condition: "time", ...e.after ? { after: e.after } : {}, ...e.before ? { before: e.before } : {}, ...e.weekdays.length ? { weekday: e.weekdayScalar && e.weekdays.length === 1 ? e.weekdays[0] : e.weekdays } : {} } : e.type === "zone" ? { ...i, condition: "zone", entity_id: e.entity_id, zone: e.zone } : e.type === "sun" ? { ...i, condition: "sun", ...e.after ? { after: e.after } : {}, ...e.before ? { before: e.before } : {}, ...e.after_offset ? { after_offset: e.after_offset } : {}, ...e.before_offset ? { before_offset: e.before_offset } : {} } : { ...i, condition: e.type, conditions: e.conditions.map(Ne) };
}, Di = (e) => {
  if (e.length === 1 && ["and", "or"].includes(String(e[0]?.condition)) && Array.isArray(e[0]?.conditions)) {
    const i = jt(e[0]);
    if (i.type === "and" || i.type === "or") return { operator: i.type, items: i.conditions, grouped: !0, metadata: i.metadata };
  }
  return { operator: "and", items: e.map(jt) };
}, Fi = (e) => {
  const i = e.items.map(Ne);
  return (e.operator === "or" || e.grouped) && i.length ? [{ ...e.metadata ?? {}, condition: e.operator, conditions: i }] : i;
}, Pi = (e) => e === "service" ? { kind: e, action: "", target: {}, data: [], metadata: {} } : e === "if" ? { kind: e, conditions: [], then: [], metadata: {} } : e === "choose" ? { kind: e, choices: [{ conditions: [], sequence: [], metadata: {} }], metadata: {} } : e === "repeat" ? { kind: e, mode: "count", value: 1, sequence: [], metadata: {} } : e === "parallel" ? { kind: e, branches: [{ wrapped: !0, sequence: [], metadata: {} }, { wrapped: !0, sequence: [], metadata: {} }], metadata: {} } : e === "delay" ? { kind: e, value: { seconds: 1 }, metadata: {} } : e === "wait_template" ? { kind: e, template: "", metadata: {} } : { kind: "unsupported", raw: {} };
class W extends Error {
}
const tr = (e) => e === null ? "null" : typeof e == "number" ? "number" : typeof e == "boolean" ? "boolean" : "text", ir = (e, i) => ({ key: e, type: tr(i), value: i, ...typeof i == "string" || typeof i == "number" ? { raw: String(i) } : {} }), nr = (e) => {
  if (e.type === "null") return null;
  if (e.type === "boolean") return e.value === !0;
  if (e.type === "text") return e.raw ?? String(e.value ?? "");
  const i = Number(e.raw ?? e.value);
  if (!Number.isFinite(i)) throw new W(`Enter a finite number for “${e.key || "this data field"}”.`);
  return i;
}, rr = (e, i) => {
  const n = e.raw ?? String(e.value ?? "");
  return i === "text" ? { ...e, type: i, value: n, raw: n } : i === "number" ? { ...e, type: i, raw: n } : i === "boolean" ? { ...e, type: i, value: e.value === !0 || n === "true" } : { ...e, type: i, value: null, raw: void 0 };
}, or = (e) => {
  const i = e instanceof Error ? e.message : String(e), n = i.toLowerCase();
  return n.includes("expected_revision") || n.includes("revision") || n.includes("conflict") ? { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details: i } : n.includes("permission") || n.includes("unauthorized") || n.includes("admin") ? { message: "You need administrator access to manage deferred actions.", details: i } : n.includes("valid_until") ? { message: "‘Don’t run after’ must be later than the scheduled time.", details: i } : n.includes("condition") ? { message: "One or more conditions are incomplete or invalid.", details: i } : n.includes("sequence") || n.includes("action") ? { message: "The action sequence is incomplete or invalid.", details: i } : { message: "Home Assistant couldn’t save this deferred action.", details: i };
}, lr = (e) => {
  if (e instanceof W) return { message: e.message };
  const i = or(e);
  return { message: i.message, ...i.details === i.message ? {} : { details: i.details } };
};
function Ht(e, i = Date.now()) {
  const n = Math.round((new Date(e).getTime() - i) / 1e3), o = Math.abs(n), [s, l] = o >= 86400 ? [Math.round(o / 86400), "day"] : o >= 3600 ? [Math.round(o / 3600), "hour"] : o >= 60 ? [Math.round(o / 60), "minute"] : [o, "second"];
  return `${n < 0 ? "overdue by" : "in"} ${s} ${l}${s === 1 ? "" : "s"}`;
}
const ae = (e, i) => new Intl.DateTimeFormat(void 0, {
  dateStyle: "medium",
  timeStyle: "short",
  ...i ? { timeZone: i } : {}
}).format(new Date(e)), Ui = (e, i) => {
  const n = new Intl.DateTimeFormat("en-CA", { timeZone: i, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(e), o = (s) => n.find((l) => l.type === s)?.value ?? "";
  return `${o("year")}-${o("month")}-${o("day")}`;
}, sr = (e, i = /* @__PURE__ */ new Date(), n = "UTC") => {
  const o = [...e].sort((v, E) => v.execute_at.localeCompare(E.execute_at)), s = Ui(i, n), [l, a, c] = s.split("-").map(Number), f = new Date(Date.UTC(l, a - 1, c + 1)).toISOString().slice(0, 10);
  let d = !1;
  const h = /* @__PURE__ */ new Map();
  for (const v of o) {
    const E = new Date(v.execute_at);
    let q;
    if (E.getTime() < i.getTime()) q = "Overdue";
    else if (!d)
      q = "Next", d = !0;
    else {
      const H = Ui(E, n);
      q = H === s ? "Later today" : H === f ? "Tomorrow" : "Later";
    }
    h.set(q, [...h.get(q) ?? [], v]);
  }
  return ["Overdue", "Next", "Later today", "Tomorrow", "Later"].flatMap((v) => h.has(v) ? [{ label: v, jobs: h.get(v) }] : []);
}, ar = (e, i) => {
  const n = i.trim().toLocaleLowerCase();
  return n ? [e.name, e.description, e.job_key, ...e.tags, ...e.target_entities, ...e.explicit_target_entities].filter(Boolean).some((o) => String(o).toLocaleLowerCase().includes(n)) : !0;
}, Yi = (e) => e.status === "completed" ? "Completed successfully" : e.status === "cancelled" ? /replac/i.test(e.terminal_reason ?? "") ? "Replaced by another scheduled action" : "Cancelled before it ran" : e.status === "missed" ? "Missed while Home Assistant was unavailable" : e.status === "skipped" ? /condition/i.test(e.terminal_reason ?? "") ? "Skipped because conditions were not met" : "Skipped by its overdue policy" : e.status === "expired" ? "Expired after its ‘don’t run after’ time" : e.status === "failed" ? /interrupt|restart|shutdown/i.test(`${e.terminal_reason ?? ""} ${e.last_error ?? ""}`) ? "Interrupted while running" : "Failed while running" : e.status, Hi = (e) => typeof e.action == "string" || typeof e.service == "string" ? "service call" : e.if ? "If / Then" : e.choose ? "Choose" : e.repeat ? "Repeat" : e.parallel ? "Parallel" : e.delay !== void 0 ? "Delay" : e.wait_template ? "Wait for template" : "advanced action", cr = (e) => {
  if (!e.length) return "No actions configured";
  if (e.length === 1) {
    const n = e[0], o = n.action ?? n.service;
    return typeof o == "string" ? `Run ${o}` : `Run ${Hi(n)} block`;
  }
  const i = e.map(Hi);
  return `Run ${e.length} steps (${i.slice(0, 3).join(", ")}${i.length > 3 ? ", …" : ""}) in order`;
}, Bt = (e) => {
  const i = e.runFor ? `Run ${e.runFor.start}, then ${e.runFor.end} after ${e.runFor.duration}` : cr(e.sequence), n = e.hasConditions ? ` Conditions are checked at run time; if unmet, ${e.conditionFailure === "fail" ? "the job fails" : e.conditionFailure === "cancel" ? "the job is cancelled" : "this run is skipped"}.` : "", o = `${e.overdue ? ` ${e.overdue}.` : ""}${e.validUntil ? ` It will not run after ${e.validUntil}.` : ""}`;
  return `${e.when}: ${i}.${n}${o}`;
}, ur = [5, 15, 30, 60], zt = (e) => e?.explicit_target_entities ?? [], me = (e) => ["completed", "cancelled", "missed", "skipped", "expired"].includes(e), Kt = (e) => {
  const i = e.overdue_policy ? "job override" : "inherited";
  return e.effective_overdue_policy === "execute_within_grace" ? `Run only if less than ${e.effective_overdue_grace_minutes} minutes late (${i})` : `${e.effective_overdue_policy === "execute" ? "Run when Home Assistant comes back" : "Don’t run"} (${i})`;
};
var dr = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, N = (e, i, n, o) => {
  for (var s = o > 1 ? void 0 : o ? pr(i, n) : i, l = e.length - 1, a; l >= 0; l--)
    (a = e[l]) && (s = (o ? a(i, n, s) : a(s)) || s);
  return o && s && dr(i, n, s), s;
};
const hr = {
  "light.turn_on": "light.turn_off",
  "switch.turn_on": "switch.turn_off",
  "fan.turn_on": "fan.turn_off",
  "input_boolean.turn_on": "input_boolean.turn_off",
  "media_player.media_play": "media_player.media_pause"
};
let L = class extends Le {
  constructor() {
    super(...arguments), this.jobs = [], this.summary = { pending: 0, paused: 0, failed: 0 }, this.tab = "Pending", this.creationKind = "later", this.scheduleMode = "delay", this.visualActions = [], this.actionYaml = "", this.conditionMode = "visual", this.visualConditions = { operator: "and", items: [] }, this.conditionsYaml = "", this.runForTarget = {}, this.runForStart = "light.turn_on", this.runForEnd = "light.turn_off", this.jobKey = "", this.previewDelay = 20, this.previewUnit = "minutes", this.busy = !1, this.search = "", this.tagFilter = "";
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
    await this.refresh(), this.unsubscribe = await Xn(this.hass, (e) => this.handlePush(e));
  }
  async refresh() {
    try {
      const e = await Wn(this.hass);
      this.jobs = e.jobs, this.recalculate();
    } catch (e) {
      this.setError(e);
    }
  }
  handlePush(e) {
    if (e.event === "queue_summary" && e.summary && (this.summary = e.summary), e.event === "job_deleted" && e.job_id) this.jobs = this.jobs.filter((i) => i.id !== e.job_id);
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
    return this.jobs.filter((e) => this.tab === "All" || this.tab === "Pending" && ["pending", "executing"].includes(e.status) || this.tab === "Paused" && e.status === "paused" || this.tab === "Failed" && e.status === "failed" || this.tab === "History" && me(e.status)).filter((e) => ar(e, this.search)).filter((e) => !this.tagFilter || e.tags.includes(this.tagFilter)).sort((e, i) => e.execute_at.localeCompare(i.execute_at));
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
      await Qn(this.hass, e, i.id, n), e === "delete" && (this.selected = void 0);
    } catch (o) {
      this.setError(o);
    } finally {
      this.busy = !1;
    }
  }
  setError(e) {
    const i = lr(e);
    this.error = i.message, this.errorDetails = i.details;
  }
  openEditor(e) {
    const i = e?.sequence ?? [{ action: "light.turn_off", target: {} }], n = ue(i);
    this.visualActions = n, this.actionYaml = re(i, { noRefs: !0 });
    const o = Di(e?.conditions ?? []);
    this.visualConditions = o, this.conditionMode = "visual", this.conditionsYaml = e?.conditions.length ? re(e.conditions, { noRefs: !0 }) : "", this.scheduleMode = "delay", this.creationKind = "later", this.jobKey = e?.job_key ?? "", this.previewDelay = 20, this.previewUnit = "minutes", this.editor = { job: e, mode: "visual" }, this.menuJobId = void 0, this.error = void 0, this.errorDetails = void 0;
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
        <div class="time">${ae(e.execute_at, this.timeZone)} · ${Ht(e.execute_at)}</div>
        <p>${e.action_summary}</p>
        ${me(e.status) || e.status === "failed" ? k`<p class="compact outcome">${Yi(e)}</p>` : e.terminal_reason ? k`<p class="compact">${e.terminal_reason}</p>` : O}
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
      <section class="detail-summary"><div><span>Scheduled</span><strong>${ae(e.execute_at, this.timeZone)}</strong><small>${Ht(e.execute_at)}</small></div><div><span>Outcome / action</span><strong>${me(e.status) || e.status === "failed" ? Yi(e) : e.action_summary}</strong></div></section>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>What will happen</strong><span>${Bt({ sequence: e.sequence, when: `At ${ae(e.execute_at, this.timeZone)}`, hasConditions: e.has_conditions, conditionFailure: e.condition_failure, overdue: Kt(e), validUntil: e.valid_until ? ae(e.valid_until, this.timeZone) : void 0 })}</span></div></section>
      ${e.description ? k`<p>${e.description}</p>` : O}
      <div class="detail-actions">
        ${["pending", "paused"].includes(e.status) ? k`<button class="primary" @click=${() => this.openEditor(e)}>Edit action</button><button @click=${() => {
      this.quickDialog = { job: e, kind: "reschedule" };
    }}>Change time</button>` : O}
      </div>
      ${e.status === "pending" ? k`<div class="snooze"><span>Snooze</span><div class="chips">${ur.map((i) => k`<button @click=${() => this.operate("snooze", e, { duration: { minutes: i } })}>+${i < 60 ? `${i} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => {
      this.quickDialog = { job: e, kind: "snooze" };
    }}>Custom</button></div>` : O}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
      "Job ID": e.id,
      Status: e.status,
      "Scheduled UTC": e.execute_at,
      "Don’t run after": e.valid_until ? `${ae(e.valid_until, this.timeZone)} (${e.valid_until})` : "—",
      Conditions: e.has_conditions ? `Yes — ${e.condition_failure === "skip" ? "skip this run" : e.condition_failure === "cancel" ? "cancel the action" : "mark as failed"} if not met` : "None",
      "Overdue behavior": Kt(e),
      Created: e.created_at,
      Modified: e.modified_at,
      Completed: e.completed_at || "—",
      Source: e.source,
      "Job key": e.job_key || "—",
      Tags: e.tags.join(", ") || "—",
      "Resolved targets": e.target_entities.join(", ") || "—",
      "Resolution hints": zt(e).join(", ") || "—",
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
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${zt(e)[0] ?? ""} .allowCustomEntity=${!0} @value-changed=${(n) => {
      const o = n.currentTarget.parentElement?.querySelector("input[name=target_entities]");
      o && (o.value = n.detail.value);
    }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${zt(e).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
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
      this.runForStart = e.detail.value, this.runForEnd = hr[e.detail.value] ?? "";
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
    const o = (s, l) => i(e.map((a, c) => c === s ? l : a));
    return k`<div class="sequence depth-${Math.min(n, 3)}">${e.map((s, l) => k`<article class="visual-card block ${s.kind}">
      <div class="section-head"><select aria-label="Action type" .value=${s.kind} ?disabled=${s.kind === "unsupported"} @change=${(a) => o(l, Pi(a.currentTarget.value))}><option value="service">Call service</option><option value="if">If / Then / Else</option><option value="choose">Choose</option><option value="repeat">Repeat</option><option value="parallel">Parallel</option><option value="delay">Delay</option><option value="wait_template">Wait for template</option>${s.kind === "unsupported" ? k`<option value="unsupported">YAML required</option>` : O}</select><span><button type="button" class="icon" title="Move up" ?disabled=${l === 0} @click=${() => {
      const a = [...e];
      [a[l - 1], a[l]] = [a[l], a[l - 1]], i(a);
    }}><ha-icon icon="mdi:arrow-up"></ha-icon></button><button type="button" class="icon" title="Move down" ?disabled=${l === e.length - 1} @click=${() => {
      const a = [...e];
      [a[l], a[l + 1]] = [a[l + 1], a[l]], i(a);
    }}><ha-icon icon="mdi:arrow-down"></ha-icon></button><button type="button" class="link danger" @click=${() => i(e.filter((a, c) => c !== l))}>Remove</button></span></div>
      ${this.renderActionBlock(s, (a) => o(l, a), n)}
    </article>`)}<button type="button" @click=${() => i([...e, Pi("service")])}><ha-icon icon="mdi:plus"></ha-icon>Add action</button></div>`;
  }
  renderActionBlock(e, i, n) {
    return e.kind === "unsupported" ? k`<div class="yaml-required"><strong>YAML required</strong><p>This action cannot be edited visually without risking data loss. It will be kept exactly as-is.</p><pre>${re(e.raw, { noRefs: !0 })}</pre><button type="button" class="link" @click=${() => this.switchActionMode()}>Edit the full sequence in YAML</button></div>` : e.kind === "service" ? k`<label>Service<ha-service-picker .hass=${this.hass} .value=${e.action} @value-changed=${(o) => i({ ...e, action: o.detail.value })}></ha-service-picker></label><label>Target<ha-target-picker .hass=${this.hass} .value=${e.target} @value-changed=${(o) => i({ ...e, target: o.detail.value })}></ha-target-picker><small>Leave empty when the service needs no target.</small></label>${this.renderActionData(e, i)}` : e.kind === "if" ? k`<h4>If</h4>${this.renderConditionList(e.conditions, (o) => i({ ...e, conditions: o }), n + 1)}<h4>Then</h4>${this.renderSequence(e.then, (o) => i({ ...e, then: o }), n + 1)}<div class="section-head"><h4>Else</h4>${e.else ? k`<button type="button" class="link danger" @click=${() => {
      const { else: o, ...s } = e;
      i(s);
    }}>Remove Else</button>` : k`<button type="button" class="link" @click=${() => i({ ...e, else: [] })}>Add Else</button>`}</div>${e.else ? this.renderSequence(e.else, (o) => i({ ...e, else: o }), n + 1) : O}` : e.kind === "choose" ? k`${e.choices.map((o, s) => k`<section class="branch"><div class="section-head"><h4>Option ${s + 1}</h4><button type="button" class="link danger" @click=${() => i({ ...e, choices: e.choices.filter((l, a) => a !== s) })}>Remove option</button></div><strong>When</strong>${this.renderConditionList(o.conditions, (l) => i({ ...e, choices: e.choices.map((a, c) => c === s ? { ...a, conditions: l } : a) }), n + 1)}<strong>Do</strong>${this.renderSequence(o.sequence, (l) => i({ ...e, choices: e.choices.map((a, c) => c === s ? { ...a, sequence: l } : a) }), n + 1)}</section>`)}<button type="button" class="link" @click=${() => i({ ...e, choices: [...e.choices, { conditions: [], sequence: [], metadata: {} }] })}>Add option</button><div class="section-head"><h4>Otherwise</h4>${e.default ? k`<button type="button" class="link danger" @click=${() => {
      const { default: o, ...s } = e;
      i(s);
    }}>Remove</button>` : k`<button type="button" class="link" @click=${() => i({ ...e, default: [] })}>Add fallback</button>`}</div>${e.default ? this.renderSequence(e.default, (o) => i({ ...e, default: o }), n + 1) : O}` : e.kind === "repeat" ? k`<label>Repeat mode<select .value=${e.mode} @change=${(o) => {
      const s = o.currentTarget.value;
      i({ ...e, mode: s, ...s === "while" || s === "until" ? { conditions: [], value: void 0 } : { value: s === "count" ? 1 : [], conditions: void 0 } });
    }}><option value="count">Count</option><option value="while">While conditions pass</option><option value="until">Until conditions pass</option><option value="for_each">For each item</option></select></label>${e.mode === "while" || e.mode === "until" ? this.renderConditionList(e.conditions ?? [], (o) => i({ ...e, conditions: o }), n + 1) : this.renderYamlValue(e.mode === "count" ? "Count or template" : "Items or template", e.value, (o) => i({ ...e, value: o }))}<h4>Sequence</h4>${this.renderSequence(e.sequence, (o) => i({ ...e, sequence: o }), n + 1)}` : e.kind === "parallel" ? k`<p class="hint">Branches start together. Actions inside each branch still run in order.</p>${e.branches.map((o, s) => k`<section class="branch"><div class="section-head"><h4>Branch ${s + 1}</h4><button type="button" class="link danger" @click=${() => i({ ...e, branches: e.branches.filter((l, a) => a !== s) })}>Remove</button></div>${this.renderSequence(o.sequence, (l) => i({ ...e, branches: e.branches.map((a, c) => c === s ? { ...a, wrapped: !0, sequence: l } : a) }), n + 1)}</section>`)}<button type="button" class="link" @click=${() => i({ ...e, branches: [...e.branches, { wrapped: !0, sequence: [], metadata: {} }] })}>Add branch</button>` : e.kind === "delay" ? this.renderYamlValue("Duration (HA duration or template)", e.value, (o) => i({ ...e, value: o })) : k`<label>Wait template<textarea .value=${e.template} @input=${(o) => i({ ...e, template: o.currentTarget.value })}></textarea></label>${this.renderYamlValue("Timeout (optional)", e.timeout, (o) => i({ ...e, timeout: o }))}<label class="checkbox"><input type="checkbox" .checked=${e.continueOnTimeout !== !1} @change=${(o) => i({ ...e, continueOnTimeout: o.currentTarget.checked })}>Continue after timeout</label>`;
  }
  renderYamlValue(e, i, n) {
    return k`<label>${e}<textarea class="typed-yaml" .value=${i === void 0 ? "" : re(i, { noRefs: !0 }).trim()} @change=${(o) => {
      const s = o.currentTarget.value;
      try {
        n(s.trim() ? Ae(s) : void 0);
      } catch (l) {
        this.setError(l);
      }
    }}></textarea><small>Typed YAML value; strings, numbers, lists, mappings, and templates keep their type.</small></label>`;
  }
  renderActionData(e, i) {
    const n = (o, s) => i({ ...e, data: e.data.map((l, a) => a === o ? { ...l, ...s } : l) });
    return k`<div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => i({ ...e, data: [...e.data, { key: "", type: "text", value: "", raw: "" }] })}>Add field</button></div>${e.data.map((o, s) => k`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${o.key} @input=${(l) => n(s, { key: l.currentTarget.value })}><select aria-label="Data value type" .value=${o.type} @change=${(l) => n(s, rr(o, l.currentTarget.value))}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>${this.renderDataValue(o, (l) => n(s, l))}<button type="button" class="icon" title="Remove data field" @click=${() => i({ ...e, data: e.data.filter((l, a) => a !== s) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`)}`;
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
      <label>If the conditions aren’t met<select name="condition_failure"><option value="skip" ?selected=${!e || e.condition_failure === "skip"}>Skip this run and keep it in history</option><option value="cancel" ?selected=${e?.condition_failure === "cancel"}>Cancel the action</option><option value="fail" ?selected=${e?.condition_failure === "fail"}>Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${e?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy"><option value="" ?selected=${!e?.overdue_policy}>Use the integration default</option><option value="execute" ?selected=${e?.overdue_policy === "execute"}>Run it when Home Assistant comes back</option><option value="execute_within_grace" ?selected=${e?.overdue_policy === "execute_within_grace"}>Run it only if it is less than the grace period late</option><option value="skip" ?selected=${e?.overdue_policy === "skip"}>Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${e?.overdue_grace ? String(e.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
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
    const o = (l, a) => i(e.map((c, f) => f === l ? a : c)), s = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return k`<div class="conditions depth-${Math.min(n, 3)}">${e.map((l, a) => k`<article class="visual-card condition"><div class="section-head"><select aria-label="Condition type" .value=${l.type} ?disabled=${l.type === "unsupported"} @change=${(c) => o(a, this.newCondition(c.currentTarget.value))}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option><option value="zone">Zone</option><option value="sun">Sun</option><option value="and">AND group</option><option value="or">OR group</option><option value="not">NOT group</option>${l.type === "unsupported" ? k`<option value="unsupported">YAML required</option>` : O}</select><button type="button" class="link danger" @click=${() => i(e.filter((c, f) => f !== a))}>Remove</button></div>
      ${l.type === "unsupported" ? k`<div class="yaml-required"><strong>YAML required</strong><p>This condition is preserved exactly.</p><pre>${re(l.raw, { noRefs: !0 })}</pre></div>` : O}
      ${l.type !== "unsupported" ? k`<label>Alias (optional)<input .value=${l.alias ?? ""} @input=${(c) => o(a, { ...l, alias: c.currentTarget.value, metadata: { ...l.metadata, alias: c.currentTarget.value || void 0 } })}></label>` : O}
      ${l.type === "state" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${l.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => o(a, { ...l, entity_id: c.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${l.state} @input=${(c) => o(a, { ...l, state: c.currentTarget.value })}></label>` : O}
      ${l.type === "numeric_state" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${l.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => o(a, { ...l, entity_id: c.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${l.above} @input=${(c) => o(a, { ...l, above: c.currentTarget.value })}></label><label>Below<input type="number" step="any" .value=${l.below} @input=${(c) => o(a, { ...l, below: c.currentTarget.value })}></label></div>` : O}
      ${l.type === "time" ? k`<div class="two"><label>After<input type="time" step="1" .value=${l.after} @input=${(c) => o(a, { ...l, after: c.currentTarget.value })}></label><label>Before<input type="time" step="1" .value=${l.before} @input=${(c) => o(a, { ...l, before: c.currentTarget.value })}></label></div><div class="weekdays">${s.map(([c, f]) => k`<label><input type="checkbox" .checked=${l.weekdays.includes(c)} @change=${(d) => o(a, { ...l, weekdays: d.currentTarget.checked ? [...l.weekdays, c] : l.weekdays.filter((h) => h !== c) })}>${f}</label>`)}</div>` : O}
      ${l.type === "zone" ? k`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${l.entity_id} .allowCustomEntity=${!0} @value-changed=${(c) => o(a, { ...l, entity_id: c.detail.value })}></ha-entity-picker></label><label>Zone<ha-entity-picker .hass=${this.hass} .value=${l.zone} .includeDomains=${["zone"]} .allowCustomEntity=${!0} @value-changed=${(c) => o(a, { ...l, zone: c.detail.value })}></ha-entity-picker></label>` : O}
      ${l.type === "sun" ? k`<div class="two"><label>After<select .value=${l.after} @change=${(c) => o(a, { ...l, after: c.currentTarget.value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>Before<select .value=${l.before} @change=${(c) => o(a, { ...l, before: c.currentTarget.value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>After offset<input placeholder="-01:00:00" .value=${l.after_offset} @input=${(c) => o(a, { ...l, after_offset: c.currentTarget.value })}></label><label>Before offset<input placeholder="00:30:00" .value=${l.before_offset} @input=${(c) => o(a, { ...l, before_offset: c.currentTarget.value })}></label></div>` : O}
      ${l.type === "and" || l.type === "or" || l.type === "not" ? this.renderConditionList(l.conditions, (c) => o(a, { ...l, conditions: c }), n + 1) : O}
    </article>`)}<button type="button" @click=${() => i([...e, this.newCondition("state")])}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
  }
  async saveEditor(e) {
    e.preventDefault();
    const i = e.currentTarget, n = new FormData(i);
    try {
      if (!this.editor?.job && this.creationKind === "run_for") {
        const a = Number(n.get("delay_value")), c = String(n.get("delay_unit"));
        if (!Number.isFinite(a) || a <= 0) throw new W("Duration must be greater than zero");
        if (!this.runForStart || !this.runForEnd || !Object.values(this.runForTarget).some((f) => f?.length)) throw new W("Choose a target, start action, and end action");
        this.busy = !0, await Gn(this.hass, {
          name: String(n.get("name")),
          description: String(n.get("description") ?? "") || void 0,
          duration: { [c]: a },
          start_sequence: Q([{ kind: "service", action: this.runForStart, target: this.runForTarget, data: [], metadata: {} }]),
          end_sequence: Q([{ kind: "service", action: this.runForEnd, target: this.runForTarget, data: [], metadata: {} }]),
          job_key: String(n.get("job_key") ?? "") || void 0,
          tags: String(n.get("tags") ?? "").split(",").map((f) => f.trim()).filter(Boolean),
          conflict_mode: String(n.get("conflict_mode") ?? "keep_all")
        }), await this.refresh(), this.editor = void 0;
        return;
      }
      const o = this.editor?.mode === "visual" ? Q(this.visualActions) : Ae(this.actionYaml);
      if (!Array.isArray(o)) throw new W("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || !this.sequenceIsComplete(this.visualActions))) throw new W("Complete every visual action block");
      const s = this.conditionMode === "visual" ? Fi(this.visualConditions) : this.conditionsYaml.trim() ? Ae(this.conditionsYaml) : [];
      if (this.conditionMode === "visual" && !this.conditionsAreComplete(this.visualConditions.items)) throw new W("Complete or remove each condition");
      const l = {
        name: String(n.get("name")),
        description: String(n.get("description") ?? "") || void 0,
        job_key: String(n.get("job_key") ?? "") || void 0,
        tags: String(n.get("tags") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        target_entities: String(n.get("target_entities") ?? "").split(",").map((a) => a.trim()).filter(Boolean),
        sequence: o,
        conditions: s,
        condition_failure: String(n.get("condition_failure") ?? "skip"),
        overdue_policy: String(n.get("overdue_policy") ?? "") || null,
        overdue_grace: String(n.get("overdue_grace_minutes") ?? "") ? { minutes: Number(n.get("overdue_grace_minutes")) } : null,
        valid_until: String(n.get("valid_until") ?? "") ? new Date(String(n.get("valid_until"))).toISOString() : null
      };
      if (!Array.isArray(l.conditions)) throw new W("Conditions YAML must be a list");
      if (this.busy = !0, this.editor?.job) await Zn(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...l });
      else {
        let a;
        if (this.scheduleMode === "absolute") {
          const c = String(n.get("date")), f = String(n.get("time")), d = /* @__PURE__ */ new Date(`${c}T${f}`);
          if (Number.isNaN(d.getTime())) throw new W("Choose a valid date and time");
          a = { execute_at: d.toISOString() };
        } else {
          const c = Number(n.get("delay_value")), f = String(n.get("delay_unit"));
          if (!Number.isFinite(c) || c <= 0) throw new W("Delay must be greater than zero");
          a = { delay: { [f]: c } };
        }
        await Vn(this.hass, { ...l, ...a, conflict_mode: String(n.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = void 0;
    } catch (o) {
      this.setError(o);
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
      if (!Array.isArray(e)) throw new W("Action YAML must be a list");
      const i = ue(e);
      if (!i) throw new W("This sequence uses advanced features that the visual editor cannot represent safely.");
      this.visualActions = i, this.editor = { ...this.editor, mode: "visual" };
    } catch (e) {
      this.setError(e);
    }
  }
  switchConditionMode() {
    if (this.conditionMode === "visual") {
      this.conditionsYaml = re(Fi(this.visualConditions), { noRefs: !0 }), this.conditionMode = "yaml";
      return;
    }
    try {
      const e = this.conditionsYaml.trim() ? Ae(this.conditionsYaml) : [];
      if (!Array.isArray(e)) throw new W("Conditions YAML must be a list");
      const i = Di(e);
      if (!i) throw new W("These conditions use advanced options that the visual editor cannot represent safely.");
      this.visualConditions = i, this.conditionMode = "visual";
    } catch (e) {
      this.setError(e);
    }
  }
  actionLabel(e, i) {
    const n = e.split(".").pop()?.replaceAll("_", " ") ?? "Run action", o = i.entity_id ?? i.device_id ?? i.area_id ?? i.floor_id ?? i.label_id, l = (Array.isArray(o) ? o[0] : o)?.split(".").pop()?.replaceAll("_", " ");
    return `${n.charAt(0).toUpperCase()}${n.slice(1)}${l ? ` ${l}` : ""}`;
  }
  editorPreview(e) {
    const i = this.editor?.mode === "visual" ? Q(this.visualActions) : (() => {
      try {
        const n = Ae(this.actionYaml);
        return Array.isArray(n) ? n : [];
      } catch {
        return [];
      }
    })();
    return this.creationKind === "run_for" && !e ? Bt({ sequence: [], when: "Now", runFor: { start: this.runForStart, end: this.runForEnd, duration: `${this.previewDelay} ${this.previewUnit}` } }) : Bt({
      sequence: e?.sequence ?? i,
      when: e ? `Scheduled for ${ae(e.execute_at, this.timeZone)}` : this.scheduleMode === "delay" ? `In ${this.previewDelay} ${this.previewUnit}` : "At the selected date and time",
      hasConditions: e?.has_conditions ?? this.visualConditions.items.length > 0,
      conditionFailure: e?.condition_failure ?? "skip",
      overdue: e ? Kt(e) : "Offline handling follows the selected policy",
      validUntil: e?.valid_until ? ae(e.valid_until, this.timeZone) : void 0
    });
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
    const e = this.confirmAction;
    if (!e) return O;
    const i = e.operation === "delete", n = e.operation === "cancel", o = i ? "Delete this record permanently?" : n ? "Cancel this deferred action?" : "Run this action now?", s = i ? "This permanently removes the record and its history. This cannot be undone." : n ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay. Conditions are checked again at run time; Run now does not bypass them.";
    return k`<div class="overlay" @click=${() => {
      this.confirmAction = void 0;
    }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(l) => l.stopPropagation()}>
      <header><h2>${o}</h2><button class="icon" title="Close" @click=${() => {
      this.confirmAction = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${e.job.name}</strong></p><p>${s}</p>
      <footer><button @click=${() => {
      this.confirmAction = void 0;
    }}>Keep it</button><button class=${i ? "danger" : n ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => {
      const l = this.confirmAction;
      this.confirmAction = void 0, l && await this.performOperation(l.operation, l.job);
    }}>${i ? "Delete permanently" : n ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }
  render() {
    const e = this.visibleJobs(), i = e.filter((l) => ["pending", "paused", "executing"].includes(l.status)), n = e.filter((l) => !["pending", "paused", "executing"].includes(l.status)), o = sr(i, /* @__PURE__ */ new Date(), this.timeZone), s = [...new Set(this.jobs.flatMap((l) => l.tags))].sort();
    return k`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? k`<div class="banner"><div>${this.error}${this.errorDetails ? k`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : O}</div><button class="icon" @click=${() => {
      this.error = void 0, this.errorDetails = void 0;
    }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : O}
      <nav>${["Pending", "Paused", "Failed", "History"].map((l) => k`<button class=${this.tab === l ? "active" : ""} @click=${() => {
      this.tab = l;
    }}>${l}<span>${l === "Pending" ? this.summary.pending : l === "Paused" ? this.summary.paused : l === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => {
      this.tab = "All";
    }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? k`<small>${ae(this.summary.next_execution_local, this.timeZone)} · ${Ht(this.summary.next_execution_local)}</small>` : O}</section>
      <section class="queue-tools"><label><ha-icon icon="mdi:magnify"></ha-icon><input type="search" placeholder="Search name, key, tags, or targets" .value=${this.search} @input=${(l) => {
      this.search = l.currentTarget.value;
    }}></label><select aria-label="Filter by tag" .value=${this.tagFilter} @change=${(l) => {
      this.tagFilter = l.currentTarget.value;
    }}><option value="">All tags</option>${s.map((l) => k`<option value=${l}>${l}</option>`)}</select></section>
      <main>${e.length ? k`${o.map((l) => k`<section class="queue-group"><h2>${l.label}<span>${l.jobs.length}</span></h2>${l.jobs.map((a) => this.renderJob(a))}</section>`)}${n.length ? k`<section class="queue-group">${i.length ? k`<h2>${this.tab === "History" ? "History" : "Other"}<span>${n.length}</span></h2>` : O}${n.map((l) => this.renderJob(l))}</section>` : O}` : k`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No matching ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : O}${this.editor ? this.renderEditor() : O}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }
};
L.styles = gn`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.job p.outcome{color:var(--primary-text-color);font-weight:500}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.queue-tools{display:flex;gap:10px;margin:4px 0 12px}.queue-tools label{display:flex;align-items:center;gap:8px;flex:1;border:1px solid var(--divider-color);border-radius:10px;padding:0 10px}.queue-tools input,.queue-tools select{font:inherit;color:var(--primary-text-color);background:transparent;border:0;padding:10px;min-width:0}.queue-tools select{border:1px solid var(--divider-color);border-radius:10px}.queue-group>h2{display:flex;gap:8px;align-items:center;margin:18px 4px 4px;font-size:14px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.04em}.queue-group>h2 span{font-size:11px;border-radius:999px;padding:2px 6px;background:var(--secondary-background-color)}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog label.checkbox{flex-direction:row;align-items:center}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog textarea.typed-yaml{min-height:48px;font-family:monospace}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.sequence.depth-1,.conditions.depth-1,.sequence.depth-2,.conditions.depth-2,.sequence.depth-3,.conditions.depth-3{border-left:3px solid color-mix(in srgb,var(--primary-color) 35%,var(--divider-color));padding-left:10px}.branch{border:1px dashed var(--divider-color);border-radius:10px;padding:10px;margin:10px 0}.branch h4,.block h4{margin:8px 0}.yaml-required{border-radius:8px;padding:10px;background:color-mix(in srgb,var(--warning-color) 9%,transparent)}.yaml-required p,.hint{color:var(--secondary-text-color)}.yaml-required pre{max-height:180px}.data-row{display:grid;grid-template-columns:minmax(120px,1fr) 110px minmax(140px,1fr) auto;gap:8px;align-items:center;margin:8px 0}.null-value{padding:10px;color:var(--secondary-text-color);font-style:italic}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.queue-tools{flex-direction:column}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input,.data-row select,.data-row .null-value{grid-column:1}.data-row button{grid-column:2;grid-row:1/4}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
N([
  Wi({ attribute: !1 })
], L.prototype, "hass", 2);
N([
  D()
], L.prototype, "jobs", 2);
N([
  D()
], L.prototype, "summary", 2);
N([
  D()
], L.prototype, "tab", 2);
N([
  D()
], L.prototype, "selected", 2);
N([
  D()
], L.prototype, "editor", 2);
N([
  D()
], L.prototype, "creationKind", 2);
N([
  D()
], L.prototype, "scheduleMode", 2);
N([
  D()
], L.prototype, "visualActions", 2);
N([
  D()
], L.prototype, "actionYaml", 2);
N([
  D()
], L.prototype, "conditionMode", 2);
N([
  D()
], L.prototype, "visualConditions", 2);
N([
  D()
], L.prototype, "conditionsYaml", 2);
N([
  D()
], L.prototype, "runForTarget", 2);
N([
  D()
], L.prototype, "runForStart", 2);
N([
  D()
], L.prototype, "runForEnd", 2);
N([
  D()
], L.prototype, "jobKey", 2);
N([
  D()
], L.prototype, "previewDelay", 2);
N([
  D()
], L.prototype, "previewUnit", 2);
N([
  D()
], L.prototype, "confirmAction", 2);
N([
  D()
], L.prototype, "errorDetails", 2);
N([
  D()
], L.prototype, "menuJobId", 2);
N([
  D()
], L.prototype, "quickDialog", 2);
N([
  D()
], L.prototype, "error", 2);
N([
  D()
], L.prototype, "busy", 2);
N([
  D()
], L.prototype, "search", 2);
N([
  D()
], L.prototype, "tagFilter", 2);
L = N([
  Fn("deferred-actions-panel")
], L);
export {
  L as DeferredActionsPanel
};
