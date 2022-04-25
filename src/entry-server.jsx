import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './client/App'

const { renderToString } = require('react-dom/server')

export function render(url, context) {
  return renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  )
}