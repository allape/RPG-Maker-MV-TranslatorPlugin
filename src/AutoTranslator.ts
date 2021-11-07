import axios, { AxiosInstance } from 'axios'

declare const Game_Message

interface Language {
    code: string
    name: string
}

interface IAutoTranslator {
    translatorServerBaseURL: string
    http: AxiosInstance,
    languages: () => Promise<Language[]>
    translate: (source: string) => Promise<string>
    translateGameMessage: (source: string) => Promise<void>
}

interface IWindowExtend extends Window {
    autoTranslator: IAutoTranslator
}
const windowExtend: IWindowExtend = window as any

export class AutoTranslator implements IAutoTranslator {

    private readonly _cache: Record<string, string> = {}
    private _languages: Language[] = []

    public translatorServerBaseURL: string = 'https://translate.mentality.rip'

    public sourceLanguage: string = 'ja'
    public targetLanguage: string = 'en'

    public readonly http = axios.create({})

    private readonly div: HTMLDivElement
    private readonly retryButton: HTMLButtonElement
    private readonly translatorServerBaseURLInput: HTMLInputElement
    private readonly sourceLanguageSelect: HTMLSelectElement
    private readonly targetLanguageSelect: HTMLSelectElement

    private readonly gameMessagesDiv: HTMLDivElement

    constructor () {
        const space = document.createElement('span')
        space.innerHTML = ' '

        this.div = document.createElement('div')
        this.div.style.position = 'fixed'
        this.div.style.top = '0'
        this.div.style.left = '0'
        this.div.style.width = '100%'
        this.div.style.maxHeight = '50%'
        this.div.style.backgroundColor = 'rgba(0, 0, 0, .3)'
        this.div.style.color = 'white'
        this.div.style.overflowY = 'auto'
        this.div.style.zIndex = `${Number.MAX_SAFE_INTEGER}`

        this.translatorServerBaseURLInput = document.createElement('input')
        this.translatorServerBaseURLInput.value = this.translatorServerBaseURL
        this.translatorServerBaseURLInput.addEventListener('blur', () => {
            if (this.translatorServerBaseURLInput.value) {
                this.translatorServerBaseURL = this.translatorServerBaseURLInput.value
            }
        })
        this.div.append(this.translatorServerBaseURLInput)
        this.div.append(space)

        this.sourceLanguageSelect = document.createElement('select')
        this.sourceLanguageSelect.style.width = '100px'
        this.targetLanguageSelect = document.createElement('select')
        this.targetLanguageSelect.style.width = '100px'

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

        const toRightArrow = document.createElement('span')
        toRightArrow.innerText = '→'

        this.div.append(this.sourceLanguageSelect)
        this.div.append(toRightArrow)
        this.div.append(this.targetLanguageSelect)

        this.retryButton = document.createElement('button')
        this.retryButton.innerText = 'Retry'
        this.retryButton.style.display = 'none'
        this.retryButton.addEventListener('click', () => {
            this.retry()
        })
        this.div.append(this.retryButton)

        this.gameMessagesDiv = document.createElement('div')
        this.div.append(this.gameMessagesDiv)

        this.setLanguageSelector()

        setTimeout(() => {
            document.body.append(this.div)
        }, 3000)
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
            this.sourceLanguageSelect.append(option)
            this.targetLanguageSelect.append(option.cloneNode(true))
        }
        this.sourceLanguageSelect.value = this.sourceLanguage
        this.targetLanguageSelect.value = this.targetLanguage
    }

    public async languages (): Promise<Language[]> {
        try {
            const res = await this.http.request({
                baseURL: this.translatorServerBaseURL,
                url: '/languages',
                method: 'get',
            })
            return res.data
        } catch (e) {
            this.retryButton.style.display = 'block'
            alert('failed to load support language, please retry: ' + this.stringifyError(e))
        }
        return []
    }

    public async translate (source: string): Promise<string> {
        if (this._cache[source]) {
            return this._cache[source]
        }
        try {
            const res = await this.http.request({
                baseURL: this.translatorServerBaseURL,
                url: '/translate',
                method: 'post',
                data: (new URLSearchParams({
                    q: source,
                    source: this.sourceLanguage,
                    target: this.targetLanguage,
                    format: 'text',
                })).toString(),
            })
            const result = res.data.translatedText
            this._cache[source] = result
            return result
        } catch (e) {
            return `<failed to translate: ${this.stringifyError(e)}>` 
        }
    }

    private stringifyError (e: any): string {
        return e ? ('message' in e ? e.message : e) : 'unknown error'
    }

    private gameMessages = {}

    private lastGameMessageAppendedTime = Date.now()

    public async translateGameMessage (source: string): Promise<void> {
        if (Date.now() - this.lastGameMessageAppendedTime > 10) {
            this.gameMessages = {}
        }
        this.gameMessages[source] = undefined
        this.lastGameMessageAppendedTime = Date.now()
        this.printGameMessage()
        this.gameMessages[source] = await this.translate(source)
        this.printGameMessage()
    }

    private clearGameMessage () {
        this.gameMessagesDiv.innerHTML = ''
    }

    private printGameMessage () {
        this.clearGameMessage()
        Object.keys(this.gameMessages).forEach(key => {
            const sourceTextDiv = document.createElement('div')
            sourceTextDiv.innerText = key
            const targetTextDiv = document.createElement('div')
            targetTextDiv.style.paddingLeft = '20px'
            targetTextDiv.innerText = this.gameMessages[key] === undefined ? '...' : this.gameMessages[key]
            this.gameMessagesDiv.append(sourceTextDiv)
            this.gameMessagesDiv.append(targetTextDiv)
        })
    }

}

windowExtend.autoTranslator = windowExtend.autoTranslator || new AutoTranslator()

// Rewrite Game_Message.add
Game_Message.prototype.$add_ForAutoTranslatorPlugin = Game_Message.prototype.add
Game_Message.prototype.add = function (text) {
    this.$add_ForAutoTranslatorPlugin(text)
    windowExtend.autoTranslator.translateGameMessage(text)
}

// require('nw.gui').Window.get().showDevTools()
