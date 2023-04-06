"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
exports.GoogleService = void 0;
var common_1 = require("@nestjs/common");
var google_auth_library_1 = require("google-auth-library");
var http_1 = require("http");
var url_1 = require("url");
var server_destroy_1 = require("server-destroy");
var GoogleService = /** @class */ (function () {
    function GoogleService(configService) {
        this.configService = configService;
    }
    GoogleService.prototype.getAuthenticatedClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
                        // which should be downloaded from the Google Developers Console.
                        var oAuth2Client = new google_auth_library_1.OAuth2Client(_this.configService.get("google.web.client_id"), _this.configService.get("google.web.client_secret"), _this.configService.get("google.web.redirect_uris[0]"));
                        // Generate the url that will be used for the consent dialog.
                        var authorizeUrl = oAuth2Client.generateAuthUrl({
                            access_type: 'offline',
                            scope: 'https://www.googleapis.com/auth/userinfo.profile'
                        });
                        // Open an http server to accept the oauth callback. In this simple example, the
                        // only request to our webserver is to /oauth2callback?code=<code>
                        var server = http_1["default"]
                            .createServer(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var qs_1, code, r, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        if (!(req.url.indexOf('/oauth2callback') > -1)) return [3 /*break*/, 2];
                                        qs_1 = new url_1["default"].URL(req.url, 'http://localhost:8080')
                                            .searchParams;
                                        code = qs_1.get('code');
                                        console.log("Code is ".concat(code));
                                        res.end('Authentication successful! Please return to the console.');
                                        server.destroy();
                                        return [4 /*yield*/, oAuth2Client.getToken(code)];
                                    case 1:
                                        r = _a.sent();
                                        // Make sure to set the credentials on the OAuth2 client.
                                        oAuth2Client.setCredentials(r.tokens);
                                        console.info('Tokens acquired.');
                                        resolve(oAuth2Client);
                                        _a.label = 2;
                                    case 2: return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _a.sent();
                                        reject(e_1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })
                            .listen(8080, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("open"); })];
                                    case 1:
                                        (_a.sent())["default"](authorizeUrl, { wait: false }).then(function (cp) { return cp.unref(); });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        (0, server_destroy_1["default"])(server);
                    })];
            });
        });
    };
    GoogleService = __decorate([
        (0, common_1.Injectable)()
    ], GoogleService);
    return GoogleService;
}());
exports.GoogleService = GoogleService;
