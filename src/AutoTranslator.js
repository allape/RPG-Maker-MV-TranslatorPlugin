"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTranslator = void 0;
var axios_1 = require("axios");
var windowExtend = window;
var AutoTranslator = /** @class */ (function () {
    function AutoTranslator() {
        var _this = this;
        this._cache = {};
        this._languages = [];
        this.translatorServerBaseURL = 'https://translate.mentality.rip';
        this.sourceLanguage = 'ja';
        this.targetLanguage = 'en';
        this.hidden = false;
        this.http = axios_1.default.create({});
        // region Game_Message
        this.gameMessages = {};
        this.lastGameMessageAppendedTime = Date.now();
        var space = document.createElement('span');
        space.innerHTML = ' ';
        var hDivider = document.createElement('div');
        hDivider.style.height = '1px';
        hDivider.style.margin = '5px 0';
        hDivider.style.backgroundColor = 'white';
        this.div = document.createElement('div');
        this.div.style.position = 'fixed';
        this.div.style.top = '0';
        this.div.style.left = '0';
        this.div.style.padding = '10px';
        this.div.style.borderBottomRightRadius = '10px';
        this.div.style.minWidth = '50%';
        this.div.style.maxWidth = '100%';
        this.div.style.maxHeight = '50%';
        this.div.style.backgroundColor = 'rgba(0, 0, 0, .3)';
        this.div.style.color = 'white';
        this.div.style.overflowY = 'auto';
        this.div.style.overflowX = 'hidden';
        this.div.style.whiteSpace = 'wrap';
        this.div.style.verticalAlign = 'center';
        this.div.style.zIndex = "" + Number.MAX_SAFE_INTEGER;
        this.translatorServerBaseURLInput = document.createElement('input');
        this.translatorServerBaseURLInput.value = this.translatorServerBaseURL;
        this.translatorServerBaseURLInput.style.marginLeft = '30px';
        this.translatorServerBaseURLInput.style.width = '300px';
        this.translatorServerBaseURLInput.addEventListener('blur', function () {
            if (_this.translatorServerBaseURLInput.value) {
                _this.translatorServerBaseURL = _this.translatorServerBaseURLInput.value;
            }
        });
        this.div.append(this.translatorServerBaseURLInput);
        this.div.append(space);
        this.sourceLanguageSelect = document.createElement('select');
        this.sourceLanguageSelect.style.width = '100px';
        this.targetLanguageSelect = document.createElement('select');
        this.targetLanguageSelect.style.width = '100px';
        this.sourceLanguageSelect.addEventListener('change', function () {
            if (_this._languages.find(function (i) { return i.code === _this.sourceLanguageSelect.value; })) {
                _this.sourceLanguage = _this.sourceLanguageSelect.value;
            }
        });
        this.targetLanguageSelect.addEventListener('change', function () {
            if (_this._languages.find(function (i) { return i.code === _this.targetLanguageSelect.value; })) {
                _this.targetLanguage = _this.targetLanguageSelect.value;
            }
        });
        var toRightArrow = document.createElement('span');
        toRightArrow.innerText = '>';
        this.div.append(this.sourceLanguageSelect);
        this.div.append(toRightArrow);
        this.div.append(this.targetLanguageSelect);
        this.retryButton = document.createElement('button');
        this.retryButton.innerText = 'Retry';
        this.retryButton.style.display = 'none';
        this.retryButton.addEventListener('click', function () {
            _this.retry();
        });
        this.div.append(this.retryButton);
        this.gameMessagesDiv = document.createElement('div');
        this.div.append(this.gameMessagesDiv);
        this.div.append(this.retryButton);
        this.choicesDiv = document.createElement('div');
        this.div.append(hDivider);
        this.div.append(this.choicesDiv);
        this.setLanguageSelector();
        this.toggleButton = document.createElement('button');
        this.toggleButton.style.position = 'fixed';
        this.toggleButton.style.top = '12px';
        this.toggleButton.style.left = '10px';
        this.toggleButton.style.zIndex = "" + Number.MAX_SAFE_INTEGER;
        this.toggleButton.addEventListener('click', function () {
            _this.toggle();
        });
        setTimeout(function () {
            document.body.append(_this.div);
            document.body.append(_this.toggleButton);
        }, 3000);
        this.toggle();
    }
    AutoTranslator.prototype.toggle = function () {
        this.hidden = !this.hidden;
        if (this.hidden) {
            this.div.style.display = 'none';
            this.toggleButton.innerText = '>';
        }
        else {
            this.div.style.display = 'block';
            this.toggleButton.innerText = '<';
        }
    };
    AutoTranslator.prototype.retry = function () {
        this.setLanguageSelector();
    };
    AutoTranslator.prototype.getCurrentLanguageCache = function () {
        var key = this.sourceLanguage + ">" + this.targetLanguage;
        this._cache[key] = this._cache[key] || {};
        return this._cache[key];
    };
    AutoTranslator.prototype.setLanguageSelector = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _i, _b, lang, option;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.languages()];
                    case 1:
                        _a._languages = _c.sent();
                        for (_i = 0, _b = this._languages; _i < _b.length; _i++) {
                            lang = _b[_i];
                            option = document.createElement('option');
                            option.innerText = lang.name;
                            option.value = lang.code;
                            this.sourceLanguageSelect.append(option);
                            this.targetLanguageSelect.append(option.cloneNode(true));
                        }
                        this.sourceLanguageSelect.value = this.sourceLanguage;
                        this.targetLanguageSelect.value = this.targetLanguage;
                        return [2 /*return*/];
                }
            });
        });
    };
    AutoTranslator.prototype.languages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.request({
                                baseURL: this.translatorServerBaseURL,
                                url: '/languages',
                                method: 'get',
                            })];
                    case 1:
                        res = _a.sent();
                        this.retryButton.style.display = 'none';
                        return [2 /*return*/, res.data];
                    case 2:
                        e_1 = _a.sent();
                        this.retryButton.style.display = 'block';
                        alert('failed to load support language, please retry: ' + this.stringifyError(e_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    AutoTranslator.prototype.translate = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, res, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!source || !source.trim())
                            return [2 /*return*/, source];
                        cache = this.getCurrentLanguageCache();
                        if (cache[source]) {
                            return [2 /*return*/, cache[source]];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.http.request({
                                baseURL: this.translatorServerBaseURL,
                                url: '/translate',
                                method: 'post',
                                data: (new URLSearchParams({
                                    q: source,
                                    source: this.sourceLanguage,
                                    target: this.targetLanguage,
                                    format: 'text',
                                })).toString(),
                            })];
                    case 2:
                        res = _a.sent();
                        result = res.data.translatedText;
                        cache[source] = result;
                        return [2 /*return*/, result];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, "<failed to translate: " + this.stringifyError(e_2) + ">"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AutoTranslator.prototype.stringifyError = function (e) {
        return e ? ('message' in e ? e.message : e) : 'unknown error';
    };
    AutoTranslator.prototype.translateGameMessage = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (Date.now() - this.lastGameMessageAppendedTime > 10) {
                            this.gameMessages = {};
                        }
                        this.gameMessages[source] = undefined;
                        this.lastGameMessageAppendedTime = Date.now();
                        this.buildTranslatedContent(this.gameMessages, this.gameMessagesDiv);
                        _a = this.gameMessages;
                        _b = source;
                        return [4 /*yield*/, this.translate(source)];
                    case 1:
                        _a[_b] = _c.sent();
                        this.buildTranslatedContent(this.gameMessages, this.gameMessagesDiv);
                        return [2 /*return*/];
                }
            });
        });
    };
    // endregion
    // region Choices
    AutoTranslator.prototype.translateChoices = function (choices) {
        return __awaiter(this, void 0, void 0, function () {
            var mapper, _i, choices_1, choice, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(choices.length === 0)) return [3 /*break*/, 1];
                        this.choicesDiv.innerHTML = '';
                        return [3 /*break*/, 5];
                    case 1:
                        mapper = choices.reduce(function (p, c) {
                            var _a;
                            return (__assign(__assign({}, p), (_a = {}, _a[c] = undefined, _a)));
                        }, {});
                        this.buildTranslatedContent(mapper, this.choicesDiv);
                        _i = 0, choices_1 = choices;
                        _c.label = 2;
                    case 2:
                        if (!(_i < choices_1.length)) return [3 /*break*/, 5];
                        choice = choices_1[_i];
                        _a = mapper;
                        _b = choice;
                        return [4 /*yield*/, this.translate(choice)];
                    case 3:
                        _a[_b] = _c.sent();
                        this.buildTranslatedContent(mapper, this.choicesDiv);
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // endregion
    AutoTranslator.prototype.buildTranslatedContent = function (mapper, container) {
        container.innerHTML = '';
        Object.keys(mapper).forEach(function (key) {
            var sourceTextDiv = document.createElement('div');
            sourceTextDiv.innerText = key;
            sourceTextDiv.style.fontSize = '12px';
            sourceTextDiv.style.userSelect = 'text';
            var targetTextDiv = document.createElement('div');
            targetTextDiv.style.fontSize = '14px';
            targetTextDiv.style.marginBottom = '10px';
            targetTextDiv.innerText = mapper[key] === undefined ? '...' : mapper[key];
            container.append(sourceTextDiv);
            container.append(targetTextDiv);
        });
    };
    return AutoTranslator;
}());
exports.AutoTranslator = AutoTranslator;
if (confirm('Auto translator requires network to operate, are you sure to use this function?')) {
    windowExtend.autoTranslator = windowExtend.autoTranslator || new AutoTranslator();
    // Rewrite Game_Message.add
    Game_Message.prototype.$add_ForAutoTranslatorPlugin = Game_Message.prototype.add;
    Game_Message.prototype.add = function (text) {
        this.$add_ForAutoTranslatorPlugin(text);
        windowExtend.autoTranslator.translateGameMessage(text);
    };
    Object.defineProperties(Game_Message.prototype, {
        _choices: {
            set: function (value) {
                value = value || [];
                if (value instanceof Array) {
                    windowExtend.autoTranslator.translateChoices(value);
                }
                this._wrappedChoices = value;
            },
            get: function () {
                return this._wrappedChoices || [];
            }
        }
    });
    // require('nw.gui').Window.get().showDevTools()
}
