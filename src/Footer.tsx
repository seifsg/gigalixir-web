import React from 'react'

// just using inline styles here since it is so small and probably not reused
const style = {
  display: 'inline-block',
  listStyle: 'none',
  margin: 5,
  borderRight: '1px solid #323232',
  paddingRight: 10
}
export default () => (
  <div style={{ textAlign: 'center', marginTop: 40, fontSize: '0.85em' }}>
    <ul style={{ padding: 0 }}>
      <li style={style}>
        <a href="https://www.gigalixir.com/terms-of-service.html">
          Terms of Service
        </a>
      </li>
      <li style={style}>
        <a href="https://www.gigalixir.com/privacy-policy.html">
          Privacy Policy
        </a>
      </li>
      <li style={style}>
        <a href="mailto:help@gigalixir.com">Contact</a>
      </li>
      <li style={{ display: 'inline-block', margin: 5 }}>
        <a href="https://blog.gigalixir.com/">Blog</a>
      </li>
    </ul>
    Copyright &copy; 2020 Invisible Software
  </div>
)
