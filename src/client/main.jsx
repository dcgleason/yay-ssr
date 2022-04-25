
import App from './App'
import viteSSR from 'vite-ssr'

export function render(url, context) {

viteSSR(App, ({ url }) => {
  // Custom initialization hook
})


}