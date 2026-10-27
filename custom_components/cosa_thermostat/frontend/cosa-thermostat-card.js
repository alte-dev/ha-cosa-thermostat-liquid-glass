/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$1.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2?.call(this);
      r2?.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t2) => t2(this));
  }
  addController(t2) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && t2.hostConnected?.();
  }
  removeController(t2) {
    this._$EO?.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t2) => t2.hostConnected?.());
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t2) => t2.hostDisconnected?.());
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== i2.converter?.toAttribute ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== t3.converter?.fromAttribute ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? this._$Ej?.get(e2) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === this._$Ej?.get(t2) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), this._$EO?.forEach((t3) => t3.hostUpdate?.()), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    this._$EO?.forEach((t3) => t3.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = globalThis, i$1 = (t2) => t2, s$1 = t.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof t2?.[Symbol.iterator], f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i2) : i2;
}
const N = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i2, s2 = t2, e2) {
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? s2._$Co?.[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return h2?.constructor !== o2 && (h2?._$AO?.(false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = (t2?.creationScope ?? l).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== r2?.index && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = e2?.isConnected ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === t2?.nodeType && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (this._$AH?._$AD === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    for (this._$AP?.(false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    void 0 === this._$AM && (this._$Cv = t2, this._$AP?.(t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t.litHtmlPolyfillSupport;
B?.(S, k), (t.litHtmlVersions ?? (t.litHtmlVersions = [])).push("3.3.3");
const D = (t2, i2, s2) => {
  const e2 = s2?.renderBefore ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = s2?.renderBefore ?? null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a;
    const t2 = super.createRenderRoot();
    return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, s.litElementHydrateSupport?.({ LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1?.({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const cardStyles = i$3`
  :host {
    display: block;
    --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Outfit", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --card-radius: 28px;
    font-family: var(--font-family);
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;

    /* Theme Tokens - Dark Mode Defaults */
    --cosa-text-primary: #ffffff;
    --cosa-text-secondary: rgba(255, 255, 255, 0.7);
    --cosa-text-muted: rgba(255, 255, 255, 0.5);
    --cosa-track-bg: rgba(255, 255, 255, 0.08);
    --cosa-widget-bg: rgba(255, 255, 255, 0.07);
    --cosa-widget-border: rgba(255, 255, 255, 0.16);
    --cosa-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%);
    --cosa-glass-border: rgba(255, 255, 255, 0.22);
    --cosa-glass-shadow: 
      0 24px 48px -12px rgba(0, 0, 0, 0.45),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3);
    --cosa-center-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
    --cosa-center-glass-border: rgba(255, 255, 255, 0.2);
    --cosa-center-glass-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(0, 0, 0, 0.2);
    --cosa-thumb-border: rgba(255, 255, 255, 0.95);
    --cosa-thumb-shadow: 
      0 0 16px rgba(255, 255, 255, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.35);
    --cosa-glow-blend: screen;
    --cosa-glow-opacity: 0.65;
  }

  /* Light Theme Tokens */
  .card-container.theme-light {
    --cosa-text-primary: var(--primary-text-color, #1d1d1f);
    --cosa-text-secondary: var(--secondary-text-color, rgba(60, 60, 67, 0.75));
    --cosa-text-muted: rgba(60, 60, 67, 0.55);
    --cosa-track-bg: rgba(0, 0, 0, 0.08);
    --cosa-widget-bg: rgba(255, 255, 255, 0.85);
    --cosa-widget-border: rgba(0, 0, 0, 0.09);
    --cosa-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(245, 245, 247, 0.72) 100%);
    --cosa-glass-border: rgba(0, 0, 0, 0.08);
    --cosa-glass-shadow: 
      0 16px 36px -8px rgba(0, 0, 0, 0.08),
      0 2px 6px rgba(0, 0, 0, 0.04),
      inset 0 1px 1px 0 rgba(255, 255, 255, 1);
    --cosa-center-glass-bg: linear-gradient(135deg, #ffffff 0%, rgba(246, 246, 248, 0.92) 100%);
    --cosa-center-glass-border: rgba(0, 0, 0, 0.07);
    --cosa-center-glass-shadow: 
      0 10px 24px rgba(0, 0, 0, 0.06),
      inset 0 1px 2px rgba(255, 255, 255, 1);
    --cosa-thumb-border: #ffffff;
    --cosa-thumb-shadow: 
      0 2px 10px rgba(0, 0, 0, 0.22),
      0 0 0 2px rgba(255, 94, 58, 0.35);
    --cosa-glow-blend: normal;
    --cosa-glow-opacity: 0.45;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  .card-container {
    position: relative;
    border-radius: var(--card-radius);
    padding: 24px 20px 22px;
    overflow: hidden;
    background: var(--cosa-glass-bg);
    backdrop-filter: blur(36px) saturate(200%);
    -webkit-backdrop-filter: blur(36px) saturate(200%);
    border: 1px solid var(--cosa-glass-border);
    box-shadow: var(--cosa-glass-shadow);
    color: var(--cosa-text-primary);
    transition: background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease, color 0.3s ease;
  }

  /* Standard Home Assistant Card Mode (liquid_glass: false) */
  .card-container.standard-mode {
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.12)));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .card-container.standard-mode.theme-light {
    background: var(--ha-card-background, var(--card-background-color, #ffffff));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.05));
  }

  .card-container.standard-mode .ambient-glow {
    display: none !important;
  }

  .card-container.standard-mode .dial-center-glass {
    background: var(--ha-card-background, var(--card-background-color, #1a1a1c));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.1)));
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }

  .card-container.standard-mode.theme-light .dial-center-glass {
    background: var(--ha-card-background, var(--card-background-color, #f8f9fa));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.08)));
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .card-container.standard-mode .metric-capsule,
  .card-container.standard-mode .preset-btn,
  .card-container.standard-mode .step-btn,
  .card-container.standard-mode .power-btn,
  .card-container.standard-mode .brand-logo {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(255, 255, 255, 0.08)));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  .card-container.standard-mode.theme-light .metric-capsule,
  .card-container.standard-mode.theme-light .preset-btn,
  .card-container.standard-mode.theme-light .step-btn,
  .card-container.standard-mode.theme-light .power-btn,
  .card-container.standard-mode.theme-light .brand-logo {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.08)));
    box-shadow: none;
  }

  .card-container.standard-mode .preset-btn.active {
    background: var(--primary-color, rgba(255, 255, 255, 0.22));
    border-color: var(--primary-color, rgba(255, 255, 255, 0.35));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }

  .card-container.standard-mode .power-btn.active {
    background: var(--primary-color, rgba(255, 255, 255, 0.22));
    border-color: var(--primary-color, rgba(255, 255, 255, 0.4));
  }

  /* Ambient Dynamic Thermal Glow */
  .ambient-glow {
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    opacity: var(--cosa-glow-opacity);
    filter: blur(60px);
    transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
    mix-blend-mode: var(--cosa-glow-blend);
  }

  .card-container.state-heating .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(255, 94, 58, 0.48) 0%, rgba(255, 42, 109, 0.28) 45%, transparent 70%);
  }
  .card-container.state-cooling .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(0, 229, 255, 0.48) 0%, rgba(0, 114, 255, 0.28) 45%, transparent 70%);
  }
  .card-container.state-idle .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(130, 160, 200, 0.22) 0%, transparent 65%);
  }
  .card-container.state-off .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(50, 55, 65, 0.15) 0%, transparent 60%);
    opacity: 0.25;
  }

  /* Light Theme Glows */
  .card-container.theme-light.state-heating .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(255, 120, 80, 0.35) 0%, rgba(255, 70, 120, 0.18) 45%, transparent 70%);
  }
  .card-container.theme-light.state-cooling .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(0, 190, 255, 0.35) 0%, rgba(0, 114, 255, 0.18) 45%, transparent 70%);
  }
  .card-container.theme-light.state-idle .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(130, 160, 200, 0.18) 0%, transparent 65%);
  }
  .card-container.theme-light.state-off .ambient-glow {
    background: radial-gradient(circle at 50% 40%, rgba(180, 185, 195, 0.15) 0%, transparent 60%);
    opacity: 0.2;
  }

  .card-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }

  /* Header Bar */
  .header-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-logo {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .brand-logo svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--cosa-text-primary);
    stroke-width: 2;
    stroke-linecap: round;
  }

  .card-title {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: var(--cosa-text-primary);
  }

  .device-badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .power-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .power-btn:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
  }
  .power-btn:active {
    transform: scale(0.94);
  }

  .power-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.28), rgba(255, 94, 58, 0.12));
    border-color: rgba(255, 94, 58, 0.45);
    box-shadow: 0 0 14px rgba(255, 94, 58, 0.3);
  }

  .power-btn svg {
    width: 16px;
    height: 16px;
    stroke: var(--cosa-text-primary);
    stroke-width: 2.2;
    fill: none;
    stroke-linecap: round;
  }

  .power-btn.active svg {
    stroke: #ff5e3a;
  }

  /* System Switcher */
  .system-pill-switch {
    display: flex;
    position: relative;
    background: var(--cosa-widget-bg);
    border-radius: 20px;
    padding: 3px;
    border: 1px solid var(--cosa-widget-border);
    width: 100%;
    max-width: 280px;
  }

  .system-pill-option {
    flex: 1;
    text-align: center;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    border-radius: 17px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .system-pill-option.active {
    color: var(--cosa-text-primary);
    font-weight: 600;
    background: var(--cosa-center-glass-bg);
    border: 1px solid var(--cosa-widget-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  /* Circular Dial Area */
  .dial-container {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 6px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dial-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    overflow: visible;
  }

  .dial-track-bg {
    fill: none;
    stroke: var(--cosa-track-bg);
    stroke-width: 12;
    stroke-linecap: round;
  }

  .dial-track-active {
    fill: none;
    stroke-width: 12;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.1s linear, stroke 0.5s ease;
    filter: drop-shadow(0 0 8px rgba(255, 94, 58, 0.6));
  }

  .dial-thumb {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: var(--cosa-thumb-shadow);
    border: 3px solid var(--cosa-thumb-border);
    cursor: grab;
    transform: translate(-50%, -50%);
    z-index: 10;
    transition: transform 0.1s ease, box-shadow 0.2s ease;
  }

  .dial-thumb:active, .dial-thumb.dragging {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.15);
  }

  /* Central Glass Disc & Readout */
  .dial-center-glass {
    position: absolute;
    width: 176px;
    height: 176px;
    border-radius: 50%;
    background: var(--cosa-center-glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--cosa-center-glass-border);
    box-shadow: var(--cosa-center-glass-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    z-index: 2;
    pointer-events: none;
  }

  .state-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--cosa-text-secondary);
    margin-bottom: 2px;
  }

  .state-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #888888;
  }

  .card-container.state-heating .state-dot {
    background: #ff5e3a;
    box-shadow: 0 0 8px #ff5e3a;
    animation: pulse 1.8s infinite;
  }
  .card-container.state-cooling .state-dot {
    background: #00c6ff;
    box-shadow: 0 0 8px #00c6ff;
    animation: pulse 1.8s infinite;
  }
  .card-container.state-idle .state-dot {
    background: #4cd964;
    box-shadow: 0 0 6px #4cd964;
  }
  .card-container.state-off .state-dot {
    background: #888888;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  .target-temp-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .target-temp-number {
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -2px;
    line-height: 1;
    color: var(--cosa-text-primary);
  }

  .target-temp-degree {
    font-size: 24px;
    font-weight: 400;
    color: var(--cosa-text-secondary);
    margin-left: 2px;
  }

  .current-temp-badge {
    font-size: 12px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  .current-temp-val {
    color: var(--cosa-text-primary);
    font-weight: 600;
  }

  /* Micro step controls */
  .dial-step-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    width: 100%;
  }

  .step-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--cosa-text-primary);
    font-size: 20px;
    font-weight: 300;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .step-btn:hover {
    filter: brightness(1.1);
    transform: scale(1.08);
  }
  .step-btn:active {
    transform: scale(0.92);
  }

  /* Metrics Bar */
  .metrics-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
  }

  .metric-capsule {
    flex: 1;
    max-width: 140px;
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    border-radius: 16px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(16px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .metric-icon {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(125, 125, 125, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metric-icon svg {
    width: 14px;
    height: 14px;
    stroke: var(--cosa-text-primary);
    fill: none;
    stroke-width: 2;
  }

  .metric-info {
    display: flex;
    flex-direction: column;
  }

  .metric-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--cosa-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-val {
    font-size: 13px;
    font-weight: 600;
    color: var(--cosa-text-primary);
  }

  /* Presets Section */
  .presets-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--cosa-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding-left: 4px;
  }

  .presets-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    width: 100%;
  }

  .preset-btn {
    background: var(--cosa-widget-bg);
    border: 1px solid var(--cosa-widget-border);
    border-radius: 14px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--cosa-text-secondary);
  }

  .preset-btn:hover {
    filter: brightness(1.08);
    color: var(--cosa-text-primary);
    transform: translateY(-1px);
  }

  .preset-btn:active {
    transform: scale(0.95);
  }

  .preset-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.28), rgba(255, 42, 109, 0.12));
    border-color: rgba(255, 94, 58, 0.45);
    color: var(--cosa-text-primary);
    box-shadow: 0 4px 14px rgba(255, 94, 58, 0.25);
  }

  .card-container.theme-light .preset-btn.active {
    background: linear-gradient(135deg, rgba(255, 94, 58, 0.16), rgba(255, 42, 109, 0.1));
    border-color: rgba(255, 94, 58, 0.4);
    color: #d83a14;
  }

  .card-container.theme-light .preset-btn.active .preset-name {
    color: #d83a14;
    font-weight: 700;
  }

  .preset-icon {
    font-size: 15px;
    line-height: 1;
  }

  .preset-name {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: -0.2px;
    white-space: nowrap;
    color: var(--cosa-text-secondary);
  }

  /* AC Controls Section */
  .ac-controls {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 6px;
    border-top: 1px solid var(--cosa-widget-border);
    animation: fadeIn 0.35s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ac-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .fan-speed-pills, .ac-mode-pills {
    display: flex;
    background: var(--cosa-widget-bg);
    border-radius: 12px;
    padding: 2px;
    border: 1px solid var(--cosa-widget-border);
    flex: 1;
  }

  .sub-pill {
    flex: 1;
    text-align: center;
    padding: 6px 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--cosa-text-secondary);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sub-pill:hover {
    color: var(--cosa-text-primary);
  }

  .sub-pill.active {
    background: var(--cosa-center-glass-bg);
    color: var(--cosa-text-primary);
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
`;
var __defProp$1 = Object.defineProperty;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$1(target, key, result);
  return result;
};
const _CosaThermostatCardEditor = class _CosaThermostatCardEditor extends i {
  setConfig(config) {
    this._config = {
      show_ac: false,
      // Default false: pure combi heating!
      liquid_glass: true,
      ...config
    };
  }
  _valueChanged(key, value) {
    if (!this._config) return;
    this._config = {
      ...this._config,
      [key]: value
    };
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  render() {
    if (!this._config) return b``;
    return b`
      <div class="editor-container">
        <div class="form-row">
          <label>Kombi Termostat Varlığı (Entity ID):</label>
          <input
            type="text"
            .value=${this._config.entity || ""}
            placeholder="climate.cosa_thermostat"
            @change=${(e2) => this._valueChanged("entity", e2.target.value)}
          />
          <span class="desc">Doğalgaz kombisi için tanımlı iklim varlığı.</span>
        </div>

        <div class="form-row">
          <label>Kart Başlığı:</label>
          <input
            type="text"
            .value=${this._config.name || "Cosa Kombi Termostatı"}
            @change=${(e2) => this._valueChanged("name", e2.target.value)}
          />
        </div>

        <div class="form-row">
          <label>Sıcaklık Adımı (Step):</label>
          <select
            .value=${String(this._config.temp_step || 0.5)}
            @change=${(e2) => this._valueChanged("temp_step", parseFloat(e2.target.value))}
          >
            <option value="0.5">0.5 °C (Önerilen)</option>
            <option value="0.1">0.1 °C (Hassas)</option>
            <option value="1.0">1.0 °C</option>
          </select>
        </div>

        <div class="form-row">
          <label>Tema Modu:</label>
          <select
            .value=${this._config.theme_mode || "auto"}
            @change=${(e2) => this._valueChanged("theme_mode", e2.target.value)}
          >
            <option value="auto">Otomatik (Home Assistant Temasına Göre)</option>
            <option value="light">Açık Tema (Light Mode)</option>
            <option value="dark">Koyu Tema (Dark Mode)</option>
          </select>
          <span class="desc">Açık veya koyu arayüz tonlarına göre kart yazılarını ve kontrastı ayarlar.</span>
        </div>

        <!-- Liquid Glass Toggle -->
        <div class="toggle-row">
          <div>
            <label style="display:block;">Liquid Glass Efekti</label>
            <span class="desc">Açık olduğunda buzlu cam ve dinamik parıltı kullanılır. Kapalıyken standart Home Assistant kart stiline geçer.</span>
          </div>
          <input
            type="checkbox"
            .checked=${this._config.liquid_glass !== false}
            @change=${(e2) => this._valueChanged("liquid_glass", e2.target.checked)}
          />
        </div>

        <!-- AC Toggle: Default Kapalı! -->
        <div class="toggle-row">
          <div>
            <label style="display:block;">Klima (Soğutma) Desteğini Göster</label>
            <span class="desc">Sadece kliması olan Cosa modelleri için. Kapalıyken sadece kombi arayüzü gösterilir.</span>
          </div>
          <input
            type="checkbox"
            .checked=${this._config.show_ac === true}
            @change=${(e2) => this._valueChanged("show_ac", e2.target.checked)}
          />
        </div>

        ${this._config.show_ac ? b`
              <div class="form-row" style="padding-left: 8px; border-left: 2px solid #00c6ff;">
                <label>Klima Varlığı (AC Entity ID):</label>
                <input
                  type="text"
                  .value=${this._config.ac_entity || ""}
                  placeholder="climate.cosa_thermostat_ac"
                  @change=${(e2) => this._valueChanged("ac_entity", e2.target.value)}
                />
                <span class="desc">Klima IR kontrol varlığı.</span>
              </div>
            ` : ""}
      </div>
    `;
  }
};
_CosaThermostatCardEditor.styles = i$3`
    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 12px 0;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
      color: var(--primary-text-color, #ffffff);
    }
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ffffff);
    }
    .desc {
      font-size: 11px;
      color: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
    }
    input[type="text"], select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.2));
      background: var(--card-background-color, rgba(255, 255, 255, 0.08));
      color: var(--primary-text-color, #ffffff);
      box-sizing: border-box;
      outline: none;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  `;
let CosaThermostatCardEditor = _CosaThermostatCardEditor;
__decorateClass$1([
  n2({ attribute: false })
], CosaThermostatCardEditor.prototype, "hass");
__decorateClass$1([
  r()
], CosaThermostatCardEditor.prototype, "_config");
try {
  customElements.define("cosa-thermostat-card-editor", CosaThermostatCardEditor);
} catch (_2) {
}
var __defProp = Object.defineProperty;
var __decorateClass = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp(target, key, result);
  return result;
};
const CARD_VERSION = "1.0.8";
console.info(
  `%c COSA-THERMOSTAT-CARD %c v${CARD_VERSION} (Liquid Glass) `,
  "color: #ffffff; background: linear-gradient(135deg, #ff5e3a, #ff2a6d); font-weight: bold; border-radius: 4px 0 0 4px; padding: 3px 6px;",
  "color: #ffffff; background: #1c1c1e; font-weight: bold; border-radius: 0 4px 4px 0; padding: 3px 6px;"
);
const _CosaThermostatCard = class _CosaThermostatCard extends i {
  constructor() {
    super(...arguments);
    this._activeSystem = "combi";
    this._localTargetTemp = null;
    this._isDragging = false;
    this._radius = 96;
    this._circumference = 2 * Math.PI * 96;
    this._totalAngle = 240;
  }
  static getStubConfig(hass) {
    const climateEntity = hass && hass.states ? Object.keys(hass.states).find((id) => id.startsWith("climate.")) : "climate.cosa_thermostat";
    return {
      type: "custom:cosa-thermostat-card",
      entity: climateEntity || "climate.cosa_thermostat",
      name: "Cosa Kombi Termostatı",
      show_ac: false,
      // Default false: Combi only!
      temp_step: 0.5,
      show_ambient_glow: true,
      liquid_glass: true,
      theme_mode: "auto"
    };
  }
  static getConfigElement() {
    return document.createElement("cosa-thermostat-card-editor");
  }
  setConfig(config) {
    this._config = {
      name: "Cosa Kombi Termostatı",
      temp_step: 0.5,
      show_ambient_glow: true,
      glass_style: "liquid-glass",
      ...config,
      entity: config?.entity || "climate.cosa_thermostat",
      show_ac: config?.show_ac === true,
      // Default to FALSE: Combi only!
      liquid_glass: config?.liquid_glass !== false,
      // Default true: Liquid Glass
      theme_mode: config?.theme_mode || "auto"
    };
    if (!this._config.show_ac) {
      this._activeSystem = "combi";
    }
  }
  getCardSize() {
    return 6;
  }
  getLayoutOptions() {
    return {
      grid_rows: 6,
      grid_columns: 4,
      grid_min_rows: 5,
      grid_min_columns: 3
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._onMoveBind = (e2) => this._onDialMove(e2);
    this._onEndBind = (e2) => this._onDialEnd(e2);
    window.addEventListener("mousemove", this._onMoveBind);
    window.addEventListener("mouseup", this._onEndBind);
    window.addEventListener("touchmove", this._onMoveBind, { passive: false });
    window.addEventListener("touchend", this._onEndBind);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onMoveBind && this._onEndBind) {
      window.removeEventListener("mousemove", this._onMoveBind);
      window.removeEventListener("mouseup", this._onEndBind);
      window.removeEventListener("touchmove", this._onMoveBind);
      window.removeEventListener("touchend", this._onEndBind);
    }
  }
  _getEntity() {
    if (!this.hass?.states || !this._config) return null;
    if (this._config.show_ac && this._activeSystem === "ac" && this._config.ac_entity && this.hass.states[this._config.ac_entity]) {
      return this.hass.states[this._config.ac_entity];
    }
    return this.hass.states[this._config.entity] || null;
  }
  _getTempLimits() {
    if (this._config?.show_ac && this._activeSystem === "ac") {
      return { minTemp: 16, maxTemp: 30, step: 1 };
    }
    return {
      minTemp: this._config?.min_temp || 5,
      maxTemp: this._config?.max_temp || 35,
      step: this._config?.temp_step || 0.5
    };
  }
  _switchSystem(system) {
    if (this._activeSystem === system) return;
    this._activeSystem = system;
    this._localTargetTemp = null;
    this.requestUpdate();
  }
  _adjustTemp(delta) {
    const entity = this._getEntity();
    const currentTarget = this._localTargetTemp !== null ? this._localTargetTemp : entity?.attributes?.temperature ?? 21;
    const { minTemp, maxTemp, step } = this._getTempLimits();
    const newTemp = Math.min(Math.max(currentTarget + delta, minTemp), maxTemp);
    const stepped = parseFloat((Math.round(newTemp / step) * step).toFixed(1));
    this._localTargetTemp = stepped;
    this._commitTemperature(stepped);
    this.requestUpdate();
  }
  _commitTemperature(temperature) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;
    this.hass.callService("climate", "set_temperature", {
      entity_id: entity.entity_id,
      temperature
    });
  }
  _handlePowerToggle() {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;
    const isOff = entity.state === "off";
    const service = isOff ? "turn_on" : "turn_off";
    this.hass.callService("climate", service, {
      entity_id: entity.entity_id
    });
  }
  _handlePresetSelect(preset) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;
    this.hass.callService("climate", "set_preset_mode", {
      entity_id: entity.entity_id,
      preset_mode: preset
    });
  }
  _handleFanSelect(fanMode) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;
    this.hass.callService("climate", "set_fan_mode", {
      entity_id: entity.entity_id,
      fan_mode: fanMode
    });
  }
  _handleAcHvacSelect(hvacMode) {
    if (!this.hass) return;
    const entity = this._getEntity();
    if (!entity) return;
    this.hass.callService("climate", "set_hvac_mode", {
      entity_id: entity.entity_id,
      hvac_mode: hvacMode
    });
  }
  _onDialStart(e2) {
    e2.preventDefault();
    this._isDragging = true;
    this._updateDialFromPointer(e2);
  }
  _onDialMove(e2) {
    if (!this._isDragging) return;
    e2.preventDefault();
    this._updateDialFromPointer(e2);
  }
  _onDialEnd(_e) {
    if (!this._isDragging) return;
    this._isDragging = false;
    if (this._localTargetTemp !== null) {
      this._commitTemperature(this._localTargetTemp);
    }
    this.requestUpdate();
  }
  _updateDialFromPointer(e2) {
    const dialContainer = this.shadowRoot?.getElementById("dialContainer");
    if (!dialContainer) return;
    const rect = dialContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = "touches" in e2 && e2.touches.length > 0 ? e2.touches[0].clientX : e2.clientX;
    const clientY = "touches" in e2 && e2.touches.length > 0 ? e2.touches[0].clientY : e2.clientY;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    let relativeAngle = angle - 150;
    if (relativeAngle < 0) relativeAngle += 360;
    let progress = 0;
    if (relativeAngle <= 240) {
      progress = relativeAngle / 240;
    } else {
      const distToStart = 360 - relativeAngle;
      const distToEnd = relativeAngle - 240;
      progress = distToStart < distToEnd ? 0 : 1;
    }
    const { minTemp, maxTemp, step } = this._getTempLimits();
    const rawTemp = minTemp + progress * (maxTemp - minTemp);
    const steppedTemp = Math.round(rawTemp / step) * step;
    const clampedTemp = Math.min(Math.max(steppedTemp, minTemp), maxTemp);
    this._localTargetTemp = parseFloat(clampedTemp.toFixed(1));
    this.requestUpdate();
  }
  _isLightMode() {
    if (this._config?.theme_mode === "light") return true;
    if (this._config?.theme_mode === "dark") return false;
    if (this.hass?.themes?.darkMode !== void 0) {
      return this.hass.themes.darkMode === false;
    }
    try {
      const textColor = getComputedStyle(document.body).getPropertyValue("--primary-text-color").trim().toLowerCase();
      if (textColor) {
        if (textColor === "#212121" || textColor === "#000000" || textColor === "rgb(33, 33, 33)" || textColor.startsWith("#1") || textColor.startsWith("#2") || textColor.startsWith("#3")) {
          return true;
        }
      }
    } catch (_2) {
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  }
  render() {
    if (!this._config) return b``;
    try {
      const entity = this._getEntity();
      const isCombi = this._activeSystem === "combi";
      const isAc = !isCombi && this._config.show_ac;
      const isOn = (entity?.state || "heat") !== "off";
      const hvacAction = entity?.attributes?.hvac_action || (isAc ? "cooling" : "heating");
      const rawCurrent = entity?.attributes?.current_temperature;
      const currentTemp = rawCurrent !== void 0 && rawCurrent !== null && !isNaN(Number(rawCurrent)) ? Number(rawCurrent) : 22.4;
      const rawTarget = this._localTargetTemp !== null ? this._localTargetTemp : entity?.attributes?.temperature;
      const targetTemp = rawTarget !== void 0 && rawTarget !== null && !isNaN(Number(rawTarget)) ? Number(rawTarget) : isAc ? 24 : 23;
      const rawHumidity = entity?.attributes?.current_humidity;
      const humidity = rawHumidity !== void 0 && rawHumidity !== null && !isNaN(Number(rawHumidity)) ? Number(rawHumidity) : 48;
      const presetMode = entity?.attributes?.preset_mode || "home";
      const fanMode = entity?.attributes?.fan_mode || "auto";
      const hvacMode = entity?.state || "heat";
      let stateClass = "state-idle";
      let stateText = "BEKLEMEDE";
      if (!isOn) {
        stateClass = "state-off";
        stateText = "KAPALI";
      } else if (isAc) {
        if (hvacAction === "cooling") {
          stateClass = "state-cooling";
          stateText = "SOĞUTUYOR";
        }
      } else {
        if (hvacAction === "heating") {
          stateClass = "state-heating";
          stateText = "ISITIYOR";
        }
      }
      const { minTemp, maxTemp } = this._getTempLimits();
      const fraction = Math.min(Math.max((targetTemp - minTemp) / (maxTemp - minTemp), 0), 1);
      const arcLength = this._totalAngle / 360 * this._circumference;
      const fillLength = fraction * arcLength;
      const strokeDashoffset = arcLength - fillLength;
      const angleDeg = 150 + fraction * 240;
      const angleRad = angleDeg * Math.PI / 180;
      const thumbX = 125 + 96 * Math.cos(angleRad);
      const thumbY = 125 + 96 * Math.sin(angleRad);
      const activeStrokeGradient = isAc ? "url(#coolGradient)" : "url(#heatGradient)";
      const isLiquidGlass = this._config.liquid_glass !== false;
      const isLight = this._isLightMode();
      const themeClass = isLight ? "theme-light" : "theme-dark";
      return b`
      <div class="card-container ${stateClass} ${themeClass} ${!isLiquidGlass ? "standard-mode" : ""}">
        ${this._config.show_ambient_glow && isLiquidGlass ? b`<div class="ambient-glow"></div>` : ""}

        <div class="card-content">
          <!-- Header Bar -->
          <div class="header-bar">
            <div class="title-group">
              <div class="brand-logo">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2c1.5 3 4 5.5 4 8.5a4 4 0 0 1-8 0C8 7.5 10.5 5 12 2z"/>
                </svg>
              </div>
              <div>
                <div class="card-title">${this._config.name}</div>
                <div class="device-badge">
                  ${this._config.show_ac ? "Cosa Hibrit İklim" : "Cosa Kombi Termostatı"}
                </div>
              </div>
            </div>
            <button
              class="power-btn ${isOn ? "active" : ""}"
              @click=${this._handlePowerToggle}
              title="Aç / Kapat"
            >
              <svg viewBox="0 0 24 24">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                <line x1="12" y1="2" x2="12" y2="12"/>
              </svg>
            </button>
          </div>

          <!-- System Switcher: ONLY SHOWN IF SHOW_AC IS TRUE! -->
          ${this._config.show_ac ? b`
                <div class="system-pill-switch">
                  <div
                    class="system-pill-option ${isCombi ? "active" : ""}"
                    @click=${() => this._switchSystem("combi")}
                  >
                    <span>🔥</span> Kombi (Isıtma)
                  </div>
                  <div
                    class="system-pill-option ${isAc ? "active" : ""}"
                    @click=${() => this._switchSystem("ac")}
                  >
                    <span>❄️</span> Klima (Soğutma)
                  </div>
                </div>
              ` : ""}

          <!-- Circular Dial -->
          <div
            class="dial-container"
            id="dialContainer"
            @mousedown=${this._onDialStart}
            @touchstart=${this._onDialStart}
          >
            <svg class="dial-svg" viewBox="0 0 250 250">
              <defs>
                <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff7b54" />
                  <stop offset="50%" stop-color="#ff5e3a" />
                  <stop offset="100%" stop-color="#ff2a6d" />
                </linearGradient>
                <linearGradient id="coolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00f2fe" />
                  <stop offset="50%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0072ff" />
                </linearGradient>
              </defs>
              <circle
                class="dial-track-bg"
                cx="125"
                cy="125"
                r="96"
                style="stroke-dasharray: ${arcLength} ${this._circumference}; stroke-dashoffset: 0;"
              />
              <circle
                class="dial-track-active"
                cx="125"
                cy="125"
                r="96"
                style="stroke-dasharray: ${arcLength} ${this._circumference}; stroke-dashoffset: ${strokeDashoffset}; stroke: ${activeStrokeGradient};"
              />
            </svg>

            <div
              class="dial-thumb ${this._isDragging ? "dragging" : ""}"
              style="left: ${thumbX}px; top: ${thumbY}px;"
            ></div>

            <div class="dial-center-glass">
              <div class="state-indicator">
                <span class="state-dot"></span>
                <span>${stateText}</span>
              </div>
              <div class="target-temp-display">
                <span class="target-temp-number">${targetTemp.toFixed(1)}</span>
                <span class="target-temp-degree">°C</span>
              </div>
              <div class="current-temp-badge">
                <span>Oda:</span>
                <span class="current-temp-val">${currentTemp.toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          <!-- Micro adjustments -->
          <div class="dial-step-controls">
            <button class="step-btn" @click=${() => this._adjustTemp(-(this._config.temp_step || 0.5))} title="Düşür">−</button>
            <button class="step-btn" @click=${() => this._adjustTemp(this._config.temp_step || 0.5)} title="Yükselt">+</button>
          </div>

          <!-- Environmental Metrics -->
          <div class="metrics-bar">
            <div class="metric-capsule">
              <div class="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">Nem</span>
                <span class="metric-val">%${Math.round(humidity)}</span>
              </div>
            </div>

            <div class="metric-capsule">
              <div class="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2c1.5 3 4 5.5 4 8.5a4 4 0 0 1-8 0C8 7.5 10.5 5 12 2z"/>
                </svg>
              </div>
              <div class="metric-info">
                <span class="metric-label">${isAc ? "Klima" : "Kombi"}</span>
                <span class="metric-val">
                  ${isAc ? hvacAction === "cooling" ? "Üflüyor" : "Beklemede" : hvacAction === "heating" ? "Yanıyor" : "Beklemede"}
                </span>
              </div>
            </div>
          </div>

          <!-- Presets -->
          <div class="presets-section">
            <div class="section-label">Modlar & Önayarlar</div>
            <div class="presets-grid">
              <button
                class="preset-btn ${presetMode === "home" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("home")}
              >
                <span class="preset-icon">🏠</span>
                <span class="preset-name">Ev</span>
              </button>
              <button
                class="preset-btn ${presetMode === "away" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("away")}
              >
                <span class="preset-icon">🚶</span>
                <span class="preset-name">Dışarı</span>
              </button>
              <button
                class="preset-btn ${presetMode === "sleep" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("sleep")}
              >
                <span class="preset-icon">🌙</span>
                <span class="preset-name">Uyku</span>
              </button>
              <button
                class="preset-btn ${presetMode === "custom" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("custom")}
              >
                <span class="preset-icon">⚙️</span>
                <span class="preset-name">Özel</span>
              </button>
              <button
                class="preset-btn ${presetMode === "auto" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("auto")}
              >
                <span class="preset-icon">⚡</span>
                <span class="preset-name">Oto</span>
              </button>
              <button
                class="preset-btn ${presetMode === "schedule" ? "active" : ""}"
                @click=${() => this._handlePresetSelect("schedule")}
              >
                <span class="preset-icon">📅</span>
                <span class="preset-name">Plan</span>
              </button>
            </div>
          </div>

          <!-- AC Controls: ONLY SHOWN IF SHOW_AC IS TRUE AND KLIMA IS SELECTED! -->
          ${this._config.show_ac && isAc ? b`
                <div class="ac-controls">
                  <div class="ac-row">
                    <span class="section-label">Fan Hızı</span>
                    <div class="fan-speed-pills">
                      <div class="sub-pill ${fanMode === "auto" ? "active" : ""}" @click=${() => this._handleFanSelect("auto")}>Oto</div>
                      <div class="sub-pill ${fanMode === "low" ? "active" : ""}" @click=${() => this._handleFanSelect("low")}>Düşük</div>
                      <div class="sub-pill ${fanMode === "medium" ? "active" : ""}" @click=${() => this._handleFanSelect("medium")}>Orta</div>
                      <div class="sub-pill ${fanMode === "high" ? "active" : ""}" @click=${() => this._handleFanSelect("high")}>Yüksek</div>
                    </div>
                  </div>
                  <div class="ac-row">
                    <span class="section-label">Klima Modu</span>
                    <div class="ac-mode-pills">
                      <div class="sub-pill ${hvacMode === "cool" ? "active" : ""}" @click=${() => this._handleAcHvacSelect("cool")}>Soğut</div>
                      <div class="sub-pill ${hvacMode === "dry" ? "active" : ""}" @click=${() => this._handleAcHvacSelect("dry")}>Nem Al</div>
                      <div class="sub-pill ${hvacMode === "fan_only" ? "active" : ""}" @click=${() => this._handleAcHvacSelect("fan_only")}>Fan</div>
                      <div class="sub-pill ${hvacMode === "off" ? "active" : ""}" @click=${() => this._handleAcHvacSelect("off")}>Kapat</div>
                    </div>
                  </div>
                </div>
              ` : ""}
        </div>
      </div>
    `;
    } catch (err) {
      console.error("CosaThermostatCard render error:", err);
      return b`
        <div class="card-container state-idle theme-dark">
          <div class="card-content" style="padding: 24px; text-align: center;">
            <div class="card-title">${this._config?.name || "Cosa Termostat"}</div>
            <div style="margin-top: 12px; font-size: 13px; opacity: 0.7;">Yükleniyor...</div>
          </div>
        </div>
      `;
    }
  }
};
_CosaThermostatCard.styles = cardStyles;
let CosaThermostatCard = _CosaThermostatCard;
__decorateClass([
  n2({ attribute: false })
], CosaThermostatCard.prototype, "hass");
__decorateClass([
  r()
], CosaThermostatCard.prototype, "_config");
__decorateClass([
  r()
], CosaThermostatCard.prototype, "_activeSystem");
__decorateClass([
  r()
], CosaThermostatCard.prototype, "_localTargetTemp");
__decorateClass([
  r()
], CosaThermostatCard.prototype, "_isDragging");
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "cosa-thermostat-card")) {
  window.customCards.push({
    type: "cosa-thermostat-card",
    name: "Cosa Thermostat (Liquid Glass)",
    description: "Ultra-futuristic frosted liquid glass climate control card for Cosa smart combi boilers & air conditioners.",
    preview: true,
    documentationURL: "https://github.com/alte-dev/ha-cosa-thermostat-liquid-glass"
  });
}
try {
  customElements.define("cosa-thermostat-card", CosaThermostatCard);
} catch (_2) {
}
window.dispatchEvent(new CustomEvent("ll-rebuild", { composed: true, bubbles: true }));
setTimeout(() => {
  window.dispatchEvent(new CustomEvent("ll-rebuild", { composed: true, bubbles: true }));
}, 200);
export {
  CosaThermostatCard
};
