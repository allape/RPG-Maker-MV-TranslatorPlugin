import axios, { AxiosInstance } from 'axios'
declare const Game_Message

interface Language {
    code: string
    name: string
}

interface IAutoTranslator {
    translatorServerBaseURL: string
    http: AxiosInstance,
    addSourceText: (text: string) => void
    languages: () => Promise<Language[]>
    translate: (source: string) => Promise<string>
}

interface IWindowExtend extends Window {
    autoTranslator: IAutoTranslator
}
const windowExtend: IWindowExtend = window as any

export class AutoTranslator implements IAutoTranslator {

    private readonly _cache: Record<string, string> = {}
    private _languages: Language[] = []

    public translatorServerBaseURL: string = 'https://libretranslate.de'

    public sourceLanguage: string = 'ja'
    public targetLanguage: string = 'en'

    public readonly http = axios.create({})

    private readonly div: HTMLDivElement
    private readonly retryButton: HTMLButtonElement
    private readonly translatorServerBaseURLInput: HTMLInputElement
    private readonly sourceLanguageSelect: HTMLSelectElement
    private readonly targetLanguageSelect: HTMLSelectElement
    private readonly sourceTextDiv: HTMLDivElement

    constructor () {
        this.div = document.createElement('div')
        this.div.style.position = 'fixed'
        this.div.style.bottom = '0'
        this.div.style.left = '0'
        this.div.style.width = '100%'
        this.div.style.maxHeight = '50%'
        this.div.style.backgroundColor = 'rgba(0, 0, 0, .3)'
        this.div.style.color = 'white'
        this.div.style.zIndex = `${Number.MAX_SAFE_INTEGER}`

        this.translatorServerBaseURLInput = document.createElement('input')
        this.translatorServerBaseURLInput.value = this.translatorServerBaseURL
        this.translatorServerBaseURLInput.addEventListener('blur', () => {
            if (this.translatorServerBaseURLInput.value) {
                this.translatorServerBaseURL = this.translatorServerBaseURLInput.value
            }
        })

        this.sourceLanguageSelect = document.createElement('select')
        this.sourceLanguageSelect.value = this.sourceLanguage
        this.targetLanguageSelect = document.createElement('select')
        this.targetLanguageSelect.value = this.targetLanguage

        this.sourceLanguageSelect.addEventListener('change', () => {
            if (this._languages.find(i => i.code === this.sourceLanguageSelect.value)) {
                this.sourceLanguage = this.sourceLanguageSelect.value
            }
        })
        this.targetLanguageSelect.addEventListener('change', () => {
            if (this._languages.find(i => i.code === this.targetLanguageSelect.value)) {
                this.targetLanguage = this.targetLanguageSelect.value
            }
        })

        this.retryButton = document.createElement('button')
        this.retryButton.innerText = 'Retry'
        this.retryButton.addEventListener('click', this.retry)

        this.sourceTextDiv = document.createElement('div')

        this.div.append(this.sourceLanguageSelect)
        this.div.append(this.targetLanguageSelect)
        this.div.append(this.retryButton)
        this.div.append(this.sourceTextDiv)

        this.setLanguageSelector()

        document.body.append(this.div)
    }

    private retry () {
        this.setLanguageSelector()
    }

    private async setLanguageSelector () {
        this._languages = await this.languages()
        for (const lang of this._languages) {
            const option = document.createElement('option')
            option.innerText = lang.name
            option.value = lang.code
        }
    }

    public addSourceText(text: string) {
        const span = document.createElement('div')
        span.innerText = text
        this.sourceTextDiv.append(span)
    }

    public async languages(): Promise<Language[]> {
        try {
            const res = await this.http.request({
                baseURL: this.translatorServerBaseURL,
                url: '/languages',
                method: 'get',
            })
            return res.data
        } catch (e) {
            alert('failed to load support language, please retry: ' + this.stringifyError(e))
        }
        return []
    }

    public async translate(source: string): Promise<string> {
        if (this._cache[source]) {
            return this._cache[source]
        }
        try {
            const formData = new FormData()
            formData.set('q', source)
            formData.set('source ', this.sourceLanguage)
            formData.set('target ', this.targetLanguage)
            formData.set('format ', 'text')
            const res = await this.http.request({
                baseURL: this.translatorServerBaseURL,
                url: '/translate',
                method: 'post',
                data: formData,
            })
            return res.data.translatedText
        } catch (e) {
            alert('failed to translate: ' + this.stringifyError(e))
        }
        return source
    }

    private stringifyError (e: any): string {
        return e ? ('message' in e ? e.message : e) : 'unknown error'
    }

}

windowExtend.autoTranslator = windowExtend.autoTranslator || new AutoTranslator()

// Rewrite Game_Message.add
if (!Game_Message.prototype.$add_ForAutoTranslatorPlugin) {
    Game_Message.prototype.$add_ForAutoTranslatorPlugin = Game_Message.prototype.add
    Game_Message.prototype.add = function (text) {
        windowExtend.autoTranslator.translate(text).then(translated => {
            this.$add_ForAutoTranslatorPlugin(translated)
        })
    }
}
