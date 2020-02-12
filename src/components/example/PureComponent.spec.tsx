import Nerv from 'nervjs'
import { renderToString } from 'nerv-server'

import Index from '../../../.temp/components/example/PureComponent'

describe('canary test', () => {
  it('true must to equal true', () => {
    expect(true).toBe(true)
  })

  it('jsx render test', () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const component = renderToString(<Index />)
    expect(component).toEqual('<div class="">Hello world</div>')
  })
})
