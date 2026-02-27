import { reactive, ref } from 'vue';

const translations = {
    en: {
        title: "Ask Me Anything",
        ask: "Tap the Tive to start a comunicate. I can discovery the web, find places, or save your Memo and Notebook.",
        askModel: "Ask Tive◎AI anything",
        discovery: "Discovery",
        map: "AI Map",
        memo: "Memo",
        notebook: "Notebook",
        thinking: "Thinking..",
        history: "History",
        settings: "Settings",
        language: "Language",
        appearance: "Appearance",
        modelChoice: "AI Model",
        cognitive: "Synchronizing Cognitive Assets",
        saveNotebook: "Save to Notebook",
        oke: "OKE"
    },
    ja: {
        title: "Ask Me Anything",
        ask: "Tiveをタップして会話を始めましょう。ウェブの探索、場所の検索、メモやノートブックの保存が可能です。",
        askModel: "Tive◎AIに質問してみましょう",
        discovery: "Discovery",
        map: "AIマップ",
        memo: "メモ",
        notebook: "ノートブック",
        thinking: "思考中..",
        history: "履歴",
        settings: "設定",
        language: "言語",
        appearance: "外観",
        modelChoice: "AIモデル",
        cognitive: "認知資産を同期中",
        saveNotebook: "ノートブックに保存",
        oke: "OKE"
    }
};

export const activeModel = ref(localStorage.getItem('tive_model') || 'Gemini');
export const setModel = (m) => {
    activeModel.value = m;
    localStorage.setItem('tive_model', m);
};

export const i18n = reactive({
    locale: localStorage.getItem('tive_locale') || 'en',
    setLocale(l) {
        this.locale = l;
        localStorage.setItem('tive_locale', l);
    },
    t(key) {
        return translations[this.locale]?.[key] || translations['en'][key] || key;
    }
});

export const theme = ref(localStorage.getItem('tive_theme') || 'dark');

// Apply theme on load
if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('light-mode', theme.value === 'light');
}

export const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tive_theme', theme.value);
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('light-mode', theme.value === 'light');
    }
};
