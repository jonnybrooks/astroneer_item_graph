var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseUrl = process.env.VUE_APP_BASE_API_URL;
export var Api;
(function (Api) {
    function get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(baseUrl + path);
            if (!res.ok)
                throw Error(res.statusText);
            return yield res.json();
        });
    }
    Api.get = get;
})(Api || (Api = {}));
//# sourceMappingURL=api_util.js.map