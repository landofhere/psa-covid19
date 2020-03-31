import { render } from '@testing-library/svelte'
import Nav from '../Nav.svelte'
import theme from '../../theme/themeMain'
describe('Nav', () => {
  test('should render component correctly', () => {
    const { getByText } = render(Nav, { theme })

    expect(getByText('PSA: COVID-19')).toBeInTheDocument()
  })
})
