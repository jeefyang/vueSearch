import { createApp } from "./main";
import { renderToString } from "vue/server-renderer"

export const render = async (_url: string) => {
    const { app } = createApp()
    const renderCtx = {}
    let renderHtml = await renderToString(app, renderCtx)
    return { renderHtml }
}