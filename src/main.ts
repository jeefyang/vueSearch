import { createSSRApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Popover, Button, Checkbox, CheckboxGroup, Field, Popup, ConfigProvider } from 'vant';
import "vant/lib/index.css"


export const createApp = () => {
    const app = createSSRApp(App)
    app.use(Popover)
    app.use(Button)
    app.use(Checkbox)
    app.use(CheckboxGroup)
    app.use(Field)
    app.use(Popup)
    app.use(ConfigProvider)
    return { app }
}

