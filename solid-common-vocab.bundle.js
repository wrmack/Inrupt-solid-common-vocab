var SolidVocab = (function (exports) {
  'use strict';

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  /**
   * Returns a local store instance
   */
  function buildStore() {
      var storage = new Map();
      return {
          setItem: function (key, value) {
              storage.set(key, value);
          },
          getItem: function (key) {
              var result = storage.get(key);
              return result ? result : null;
          },
          removeItem: function (key) {
              storage.delete(key);
          },
          get length() {
              return storage.size;
          },
          clear: function () { return storage.clear(); },
          key: function (index) {
              var iterator = storage.entries();
              var item = iterator.next();
              for (var i = 0; i < index; i++) {
                  item = iterator.next();
              }
              return item && item.value ? item.value[0] : null;
          },
      };
  }
  /**
   * Returns localStore in a browser environment, and a local store instance otherwise
   */
  function getLocalStore() {
      if (typeof window !== "undefined" &&
          typeof window.localStorage !== "undefined") {
          return window.localStorage;
      }
      return buildStore();
  }

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  var CONTEXT_KEY_LOCALE = "i18nextLng";
  // Key that specifies a preferred fallback language - e.g. if the user selects
  // 'French' as the language for the current page, but there is no French, then
  // we'll check if the user has a preferred fallback language, e.g. maybe in
  // their profile they have selected 'Spanish' as their preferred fallback.
  var CONTEXT_KEY_PREFERRED_FALLBACK_LANGUAGE = "lang_preferred_fallback";
  /**
   * Simple class to hold 'context', which could include things like a chosen language, localization settings, process
   * details (like the credentials of the process, time the process started, the process ID, etc.).
   *
   * We can be configured with a storage instance on construction (e.g. to attempt to read values from 'localStorage' in
   * cases when we are deployed within a browser - e.g. a language drop-down might set the current language using a
   * simple key value of say 'i18nLanguage' in localStorage).
   */
  var VocabContext = /** @class */ (function () {
      function VocabContext(locale, storage) {
          if (!locale) {
              throw new Error("A new context *MUST* be provided a locale, but none was provided.");
          }
          if (!storage) {
              throw new Error("A new context *MUST* be provided storage (we expect 'localStorage').");
          }
          this._initialLocale = locale;
          this._storage = storage;
          this._storage.setItem(CONTEXT_KEY_LOCALE, locale);
          this._createdAt = Date.now();
      }
      VocabContext.prototype.getLocale = function () {
          var _a;
          return (_a = this._storage.getItem(CONTEXT_KEY_LOCALE)) !== null && _a !== void 0 ? _a : this._initialLocale;
      };
      VocabContext.prototype.setLocale = function (locale) {
          this._storage.setItem(CONTEXT_KEY_LOCALE, locale);
          return this;
      };
      VocabContext.prototype.getInitialLocale = function () {
          return this._initialLocale;
      };
      VocabContext.prototype.getCreatedAt = function () {
          return this._createdAt;
      };
      return VocabContext;
  }());

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  var VocabContextError = /** @class */ (function (_super) {
      __extends(VocabContextError, _super);
      function VocabContextError(context, message, wrappedException) {
          var _this = 
          // The ignore is required because of code coverage bug
          // https://github.com/gotwarlost/istanbul/issues/690
          _super.call(this, message) /* istanbul ignore next */ || this;
          if (wrappedException) {
              if (wrappedException instanceof VocabContextError) {
                  _this._wrappedException = wrappedException;
                  _this.message = _this.message + "\nContains context error: " + wrappedException.message;
              }
              else if (wrappedException instanceof Error) {
                  _this._wrappedException = wrappedException;
                  _this.message = _this.message + "\nContains error: " + wrappedException.message;
              }
              else {
                  throw new Error("Context error can only wrap ContextErrors or Errors, but got [" + wrappedException + "] (message was [" + message + "]).");
              }
          }
          _this._context = context;
          _this._createdAt = Date.now();
          // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
          Object.setPrototypeOf(_this, VocabContextError.prototype);
          return _this;
      }
      VocabContextError.prototype.report = function (level, totalLevels, exception) {
          var _a;
          var result = exception.message;
          var stack = exception.stack ? exception.stack.toString() : "";
          // Ignoring the next line is required for full code coverage, because when
          // testing in a Node environment, it is not possible to have `process`
          // undefined.
          // istanbul ignore next
          if (((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) !== "production") {
              result += "\n" + ("Level " + level + " of " + totalLevels + ":\n" + stack);
          }
          return result;
      };
      VocabContextError.prototype.countLevels = function () {
          var result = 1;
          var current = this;
          while (current && current._wrappedException) {
              if (!(current._wrappedException instanceof VocabContextError)) {
                  // If we have wrapped a standard exception, then the unwrapping stops,
                  //  because standard errors can't wrap other errors.
                  current = undefined;
                  result++;
              }
              else {
                  current = current._wrappedException;
                  result++;
              }
          }
          return result;
      };
      VocabContextError.prototype.unwrapException = function () {
          var totalLevels = this.countLevels();
          var level = 1;
          var result = "";
          var current = this;
          while (current !== undefined) {
              result += "\n\n" + this.report(level++, totalLevels, current);
              if (!(current._wrappedException instanceof VocabContextError) &&
                  current._wrappedException) {
                  result +=
                      "\n\n" + this.report(level++, totalLevels, current._wrappedException);
                  // When reaching a plain Error, the unwrapping stops
                  current = undefined;
              }
              else {
                  // Unwraps the exception until _wrappedException is undefined
                  current = current._wrappedException;
              }
          }
          return result;
      };
      VocabContextError.prototype.toString = function () {
          return this.unwrapException();
      };
      VocabContextError.prototype.contains = function (elements) {
          if (!elements) {
              return true;
          }
          var message = this.unwrapException();
          return elements
              .map(function (element) { return message.includes(element); })
              .reduce(function (acc, current) { return acc && current; }, true);
      };
      return VocabContextError;
  }(Error));

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  var NO_LANGUAGE_TAG = "<No Language>";
  // Typically, these would come from a LIT-generated artifact,
  // but since those generated artifacts depend on this current, it's
  // just much easier to define the constants we need manually here.
  var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
  var RDF_LANGSTRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
  function isLiteral(term) {
      return term.language !== undefined;
  }
  /**
   * Class that defines the concept of a multi-lingual literal (as in an RDF
   * String literal). We can add multiple values in different languages, and
   * look them up again.
   * Also supports parameterized string values (using {{0}} placeholders), for
   * which we can provide values when looking them up.
   */
  var VocabMultiLingualLiteral = /** @class */ (function () {
      /**
       *
       * @param rdfFactory Expected to provide RDF primitives (e.g. named nodes,
       * literals, etc.).
       * @param iri The IRI for this instance
       * @param values The values (if any) to initialise this instance
       * @param contextMessage Context information (helpful for debugging)
       * @returns {VocabMultiLingualLiteral|*}
       */
      function VocabMultiLingualLiteral(rdfFactory, iri, values, contextMessage) {
          // Implementing the RDFJS Literal interface
          this.termType = "Literal";
          this._rdfFactory = rdfFactory;
          this._iri = iri;
          this._values = values ? values : new Map();
          this._contextMessage = contextMessage ? contextMessage : "<None provided>";
          this._language = undefined;
          this._expandedMessage = undefined;
      }
      Object.defineProperty(VocabMultiLingualLiteral.prototype, "setToEnglish", {
          get: function () {
              this.asLanguage("en");
              return this;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabMultiLingualLiteral.prototype, "value", {
          get: function () {
              var _a, _b;
              return (_b = (_a = this.lookup(false)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabMultiLingualLiteral.prototype, "language", {
          get: function () {
              if (!this._language || this._language === NO_LANGUAGE_TAG) {
                  return "";
              }
              else {
                  return this._language;
              }
          },
          enumerable: false,
          configurable: true
      });
      VocabMultiLingualLiteral.prototype.equals = function (other) {
          if (isLiteral(other)) {
              return (this._values.get(other.language || NO_LANGUAGE_TAG) === other.value);
          }
          else {
              return false;
          }
      };
      Object.defineProperty(VocabMultiLingualLiteral.prototype, "datatype", {
          get: function () {
              if (!this.language || this.language == NO_LANGUAGE_TAG) {
                  return this._rdfFactory.namedNode(XSD_STRING);
              }
              else {
                  return this._rdfFactory.namedNode(RDF_LANGSTRING);
              }
          },
          enumerable: false,
          configurable: true
      });
      VocabMultiLingualLiteral.prototype.getIri = function () {
          return this._iri;
      };
      VocabMultiLingualLiteral.prototype.asLanguage = function (tag) {
          this._language = tag;
          return this;
      };
      VocabMultiLingualLiteral.prototype.addValue = function (value, locale) {
          if (!this._language) {
              this._language = locale;
          }
          this._values.set(locale, value);
          return this;
      };
      VocabMultiLingualLiteral.prototype.lookupEnglish = function (mandatory) {
          return this.asLanguage("en").lookup(mandatory);
      };
      /**
       * Looks up a message in the currently set language, but if none found we
       * use the English message (which code-generators can enforce, so they should
       * always ensure at least an English message for vocab terms).
       *
       * NOTE: If we do use the English default, then we also reset our language
       * tag so that if we are returning an RDF literal it will contain the correct
       * language tag (i.e. 'en'), and not the requested language that didn't exist!
       *
       * @param mandatory Flag - if true, we'll Throw an error if no value found.
       * @returns {*}
       */
      VocabMultiLingualLiteral.prototype.lookup = function (mandatory) {
          var message = this.lookupButDefaultToEnglishOrNoLanguage(mandatory);
          if (message === undefined) {
              return undefined;
          }
          this._expandedMessage = message;
          return this._rdfFactory.literal(message, this.handleNoLanguageTag());
      };
      /**
       * Private method that only looks up the string itself (i.e. will not attempt
       * to wrap in an RDF literal).
       *
       * @param mandatory Flag - if true, we'll Throw an error if no value found.
       * @returns {*}
       */
      VocabMultiLingualLiteral.prototype.lookupButDefaultToEnglishOrNoLanguage = function (mandatory) {
          if (!this._language) {
              if (mandatory) {
                  throw new Error("No value has been added to the literal");
              }
              else {
                  return undefined;
              }
          }
          var message = this._values.get(this._language);
          if (message) {
              return message;
          }
          else if (mandatory) {
              // NOTE: we explicitly throw here, regardless of our 'throw' parameter.
              throw new Error("MultiLingualLiteral message with IRI [" + this._iri.value + "] required value in language [" + this._language + "], but none found (Context: [" + this._contextMessage + "]).");
          }
          else {
              message = this._values.get("en");
              if (message) {
                  this._language = "en";
              }
              else {
                  message = this._values.get(NO_LANGUAGE_TAG);
                  this._language = NO_LANGUAGE_TAG;
              }
          }
          return message;
      };
      /**
       * TODO: Won't yet handle replacing multiple uses of say {{1}} in a single
       *  string, which I guess it should...!?
       *
       * @param mandatory Flag - if true, we'll Throw an error if no value found.
       * @param rest array of values to be used to replace placeholders in
       * the looked-up message.
       * @returns {*}
       */
      VocabMultiLingualLiteral.prototype.params = function (mandatory) {
          var rest = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              rest[_i - 1] = arguments[_i];
          }
          var message = this.lookupButDefaultToEnglishOrNoLanguage(mandatory);
          // If we failed to find a value at all (and didn't throw!), then return
          // 'undefined'.
          if (message === undefined) {
              return undefined;
          }
          var paramsRequired = message.split("{{").length - 1;
          if (paramsRequired !== rest.length) {
              throw new Error("Setting parameters on LitMultiLingualLiteral with IRI [" + this._iri.value + "] and value [" + message + "] in language [" + this._language + "], but it requires [" + paramsRequired + "] params and we received [" + rest.length + "] (Context: [" + this._contextMessage + "]).");
          }
          for (var i = 0; i < rest.length; i++) {
              var marker = "{{" + i + "}}";
              message = message.replace(marker, rest[i]);
          }
          this._expandedMessage = message;
          return this._rdfFactory.literal(message, this.handleNoLanguageTag());
      };
      /**
       * We use a marker for no-language literals, so this handles that marker
       * and returns the correct RDF tag for 'no-language'.
       *
       * @returns {string}
       */
      VocabMultiLingualLiteral.prototype.handleNoLanguageTag = function () {
          return this._language === NO_LANGUAGE_TAG ? "" : this._language;
      };
      return VocabMultiLingualLiteral;
  }());

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  /**
   * Simple registry of terms (and their associated meta-data (like labels,
   * comment, message)) in multiple languages.
   *
   * We use localStorage to store all term meta-data, which can only store
   * strings (so we need to expand out the meta-data for each term).
   */
  var VocabTermRegistry = /** @class */ (function () {
      function VocabTermRegistry(store) {
          this.store = store;
      }
      VocabTermRegistry.prototype.lookupLabel = function (termIri, language) {
          return this.lookupItem(termIri, language, "label");
      };
      VocabTermRegistry.prototype.updateLabel = function (termIri, language, label) {
          this.updateItem(termIri, language, label, "label");
      };
      VocabTermRegistry.prototype.lookupComment = function (termIri, language) {
          return this.lookupItem(termIri, language, "comment");
      };
      VocabTermRegistry.prototype.updateComment = function (termIri, language, label) {
          this.updateItem(termIri, language, label, "comment");
      };
      VocabTermRegistry.prototype.lookupMessage = function (termIri, language) {
          return this.lookupItem(termIri, language, "message");
      };
      VocabTermRegistry.prototype.updateMessage = function (termIri, language, label) {
          this.updateItem(termIri, language, label, "message");
      };
      VocabTermRegistry.prototype.updateItem = function (termIri, language, label, item) {
          this.store.setItem(termIri + "-" + item + "-" + language, label);
      };
      VocabTermRegistry.prototype.lookupItem = function (termIri, language, item) {
          return this.lookupFullTerm(termIri + "-" + item + "-", language);
      };
      /**
       * Looks up the specified vocabulary term in the specified language. If no
       * value found, will lookup again using the fallback language (as set in our
       * context). If not found again, will fallback to looking up the term in
       * English.
       *
       * @param term
       * @param language
       * @returns {string}
       */
      VocabTermRegistry.prototype.lookupFullTerm = function (term, language) {
          var _a;
          var fallbackLanguage = (_a = this.store.getItem(CONTEXT_KEY_PREFERRED_FALLBACK_LANGUAGE)) !== null && _a !== void 0 ? _a : "en";
          return this.lookupFullTermFallback(term, language, [
              fallbackLanguage,
              "en",
              NO_LANGUAGE_TAG,
          ]);
      };
      /**
       * Looks up the specified vocabulary term in the specified language. If no
       * value found, will lookup again using the provided fallback values one by
       * one until a value is found or there are no additional fallbacks.
       *
       * @param term {string}
       * @param language {string}
       * @param fallback {string[]}
       *
       * @returns {string | undefined}
       */
      VocabTermRegistry.prototype.lookupFullTermFallback = function (term, language, fallback) {
          var result = this.store.getItem("" + term + language);
          if (result) {
              return result;
          }
          else if (fallback.length > 0) {
              return this.lookupFullTermFallback(term, fallback[0], fallback.slice(1));
          }
          else {
              return undefined;
          }
      };
      return VocabTermRegistry;
  }());

  /**
   * Begin license text.
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   * End license text.Source Distributions
   */
  var DEFAULT_LOCALE = "en";
  /**
   * Class to represent vocabulary terms. We expect derived classes to extend
   * an IRI (e.g. a NamedNode in RDFJS), but we just provide effectively an
   * abstract base class providing meta-data associated with terms in a
   * vocabulary, like labels and comments (in multiple-languages).
   *
   * We can also take a reference to a context storage instance, which can
   * contain various contextual information, such as the current locale, or
   * language settings for an interaction that can be used to lookup context at
   * runtime (e.g. to look up the locale for a term's label at runtime if one is
   * not explicitly asked for).
   *
   * This Turtle snippet may help illustrate what this class supports:
   *
   *   prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
   *   prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
   *   prefix skos:     <http://www.w3.org/2004/02/skos/core#>
   *   prefix ex:   <http://example.com/>
   *
   *   ex:name a rdf:Property ;
   *     rdfs:label "Name" ;
   *     rdfs:label "First name"@en ;
   *     rdfs:label "Nombre"@es ;
   *     rdfs:comment "A person's first name"@en .
   *
   *   ex:errNameTooLong a rdfs:Literal ;
   *     skos:definition "Name must be less than {{0}}, but we got {{1}}"@en .
   *
   * NOTE: Since this class does NOT actually store the IRI value for the vocab
   * term (since we expect derived classes to provide that), testing this
   * class in isolation will result in strange looking (i.e. 'undefined-'
   * prefixed) key values in 'localStorage' since we create those keys based on
   * the term IRI (that we don't store!). Currently this doesn't cause any
   * problems, but it's just something to be aware of!
   */
  var VocabTerm = /** @class */ (function () {
      /**
       * Constructor.
       *
       * @param iri the IRI for this vocabulary term
       * @param rdfFactory an underlying RDF library that can create IRI's
       * @param contextStorage context for this term
       * @param strict flag if we should be strict. If not strict, we can use the
       * path component of the term's IRI as the English label if no explicit
       * English label (or no-language label) is provided, e.g. 'name' for the
       * term 'http://example.com/vocab#name'.
       */
      function VocabTerm(iri, rdfFactory, contextStorage, strict) {
          // Implementation of the NamedNode interface.
          this.termType = "NamedNode";
          if (typeof iri === "string") {
              this.iri = rdfFactory.namedNode(iri);
          }
          else {
              this.iri = iri;
          }
          this.rdfFactory = rdfFactory;
          if (strict !== undefined) {
              this.strict = strict;
          }
          else {
              this.strict = false;
          }
          this._litSessionContext = new VocabContext(DEFAULT_LOCALE, contextStorage);
          this._registry = new VocabTermRegistry(contextStorage);
          // Create holders for meta-data on this vocabulary term (we could probably
          // lazily create these only if values are actually provided!).
          this._label = new VocabMultiLingualLiteral(rdfFactory, this.iri, undefined, "rdfs:label");
          this._comment = new VocabMultiLingualLiteral(rdfFactory, this.iri, undefined, "rdfs:comment");
          this._message = new VocabMultiLingualLiteral(rdfFactory, this.iri, undefined, "message (should be defined in RDF vocab using: skos:definition)");
          if (!strict) {
              // This can be overwritten if we get an actual no-language label later,
              // which would be perfectly fine.
              this._label.addValue(VocabTerm.extractIriLocalName(iri), NO_LANGUAGE_TAG);
          }
          // Stateful variables defaults.
          this._mandatory = true;
          this._languageOverride = undefined;
          this._isDefinedBy = undefined;
          this._seeAlso = undefined;
          this.resetState();
      }
      Object.defineProperty(VocabTerm.prototype, "value", {
          get: function () {
              return this.iri.value;
          },
          enumerable: false,
          configurable: true
      });
      VocabTerm.prototype.equals = function (other) {
          return this.iri.equals(other);
      };
      Object.defineProperty(VocabTerm.prototype, "mandatory", {
          // Set our mandatory flag - i.e. throws if not as expected.
          get: function () {
              this._mandatory = true;
              return this;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "seeAlso", {
          get: function () {
              return this._seeAlso;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "isDefinedBy", {
          get: function () {
              return this._isDefinedBy;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "asEnglish", {
          // Simple convenience accessor for requesting English.
          get: function () {
              return this.asLanguage("en");
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "iriAsString", {
          // Explicitly named alias for getting the IRI of this term as a String.
          get: function () {
              return this.value;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "labelLiteral", {
          // Accessor for label that uses our LitSessionContext instance.
          get: function () {
              try {
                  var language = this.useLanguageOverrideOrGetFromContext();
                  return this._label.asLanguage(language).lookup(this._mandatory);
              }
              finally {
                  this.resetState();
              }
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "label", {
          get: function () {
              var label = this.labelLiteral;
              return label && label.value;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "commentLiteral", {
          // Accessor for comment that uses our LitSessionContext instance.
          get: function () {
              try {
                  var language = this.useLanguageOverrideOrGetFromContext();
                  return this._comment.asLanguage(language).lookup(this._mandatory);
              }
              finally {
                  this.resetState();
              }
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "comment", {
          get: function () {
              var comment = this.commentLiteral;
              return comment && comment.value;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "messageLiteral", {
          // Accessor for message that uses our LitSessionContext instance.
          get: function () {
              try {
                  var language = this.useLanguageOverrideOrGetFromContext();
                  return this._message.asLanguage(language).lookup(this._mandatory);
              }
              finally {
                  this.resetState();
              }
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(VocabTerm.prototype, "message", {
          get: function () {
              var message = this.messageLiteral;
              return message && message.value;
          },
          enumerable: false,
          configurable: true
      });
      // Get the IRI of this term as a String (means we can treat this object
      // instance as a string more easily).
      // NOTE: This is *NOT* an accessor, but deliberately overriding the
      // 'toString()' method on the base Object.
      VocabTerm.prototype.toString = function () {
          return this.value;
      };
      VocabTerm.prototype.messageParamsLiteral = function () {
          var _a;
          var rest = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              rest[_i] = arguments[_i];
          }
          var language = this.useLanguageOverrideOrGetFromContext();
          try {
              return (_a = this._message
                  .asLanguage(language))
                  .params.apply(_a, __spreadArrays([this._mandatory], rest));
          }
          finally {
              this.resetState();
          }
      };
      VocabTerm.prototype.messageParams = function () {
          var rest = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              rest[_i] = arguments[_i];
          }
          var messageParams = this.messageParamsLiteral.apply(this, rest);
          return messageParams && messageParams.value;
      };
      VocabTerm.prototype.resetState = function () {
          this._languageOverride = undefined;
          this._mandatory = false;
      };
      VocabTerm.prototype.addSeeAlso = function (value) {
          if (!this._seeAlso) {
              this._seeAlso = new Set();
          }
          this._seeAlso.add(value);
          return this;
      };
      VocabTerm.prototype.addIsDefinedBy = function (value) {
          this._isDefinedBy = value;
          return this;
      };
      VocabTerm.prototype.addLabelNoLanguage = function (value) {
          return this.addLabel(value, NO_LANGUAGE_TAG);
      };
      VocabTerm.prototype.addLabel = function (value, language) {
          this.validateAddParams(value, language, "label");
          this._label.addValue(value, language);
          this._registry.updateLabel(this.value, language, value);
          return this;
      };
      VocabTerm.prototype.addCommentNoLanguage = function (value) {
          return this.addComment(value, NO_LANGUAGE_TAG);
      };
      VocabTerm.prototype.addComment = function (value, language) {
          this.validateAddParams(value, language, "comment");
          this._comment.addValue(value, language);
          this._registry.updateComment(this.value, language, value);
          return this;
      };
      VocabTerm.prototype.addMessageNoLanguage = function (value) {
          return this.addMessage(value, NO_LANGUAGE_TAG);
      };
      VocabTerm.prototype.addMessage = function (value, language) {
          this.validateAddParams(value, language, "message");
          this._message.addValue(value, language);
          this._registry.updateMessage(this.value, language, value);
          return this;
      };
      /**
       * Ensure we always provide both a value and a lnaguage tag for that value.
       *
       * @param value the test of the value
       * @param language the language tag for the value
       * @param what what kind of value we are adding
       */
      VocabTerm.prototype.validateAddParams = function (value, language, what) {
          if (value === undefined || value === null) {
              throw new Error("Attempted to add a non-existent [" + what + "] value to vocab term");
          }
          if (!language) {
              throw new Error("Attempted to add the [" + what + "] value [" + value + "], but without specifying a language");
          }
          return this;
      };
      VocabTerm.prototype.useLanguageOverrideOrGetFromContext = function () {
          return this._languageOverride === undefined
              ? this._litSessionContext.getLocale()
              : this._languageOverride;
      };
      VocabTerm.prototype.asLanguage = function (language) {
          // An empty string is converted to the NO_LANGUAGE_TAG.
          this._languageOverride = language || NO_LANGUAGE_TAG;
          return this;
      };
      /**
       * Extract the local name from the specified IRI (can be a primitive string or
       * a NamedNode).
       *
       * @param stringOrNamedNode The IRI to extract from.
       * @returns {string}
       */
      VocabTerm.extractIriLocalName = function (stringOrNamedNode) {
          var iri = this.isString(stringOrNamedNode)
              ? stringOrNamedNode
              : stringOrNamedNode.value;
          var hashPos = iri.lastIndexOf("#");
          if (hashPos > -1) {
              return iri.substring(hashPos + 1);
          }
          var lastSlashPos = iri.lastIndexOf("/");
          if (lastSlashPos === -1 ||
              (iri.toLowerCase().startsWith("http") &&
                  lastSlashPos < (iri.toLowerCase().startsWith("https") ? 8 : 7))) {
              throw Error("Expected hash fragment ('#') or slash ('/') (other than 'https://...') in IRI [" + iri + "]");
          }
          else {
              return iri.substring(lastSlashPos + 1);
          }
      };
      /**
       * Simple method to determine if the specified value is a primitive String.
    
       * @param value The value to evaluate.
       * @returns {boolean} true if String, else false.
       */
      VocabTerm.isString = function (value) {
          return typeof value === "string" || value instanceof String;
      };
      /**
       * Simply treat the value as an IRI if it starts with 'http://' or 'https://'
       * (case-insensitive).
       *
       * @param value
       * @returns {boolean}
       */
      VocabTerm.isStringIri = function (value) {
          if (!this.isString(value)) {
              return false;
          }
          var valueLower = value.toLowerCase();
          return (valueLower.startsWith("http://") || valueLower.startsWith("https://"));
      };
      return VocabTerm;
  }());

  exports.CONTEXT_KEY_LOCALE = CONTEXT_KEY_LOCALE;
  exports.NO_LANGUAGE_TAG = NO_LANGUAGE_TAG;
  exports.VocabContext = VocabContext;
  exports.VocabContextError = VocabContextError;
  exports.VocabMultiLingualLiteral = VocabMultiLingualLiteral;
  exports.VocabTerm = VocabTerm;
  exports.VocabTermRegistry = VocabTermRegistry;
  exports.buildStore = buildStore;
  exports.getLocalStore = getLocalStore;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
