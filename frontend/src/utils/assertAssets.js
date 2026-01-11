// Verifies expected assets exist at build/runtime and logs clear diagnostics
export const assertAssetsPresent = () => {
  try {
    const assets = import.meta.glob('../assets/*', { eager: true })
    const required = ['e.png', 'g.png', 'c.png', 's4.jpg', 's6.avif']
    const has = Object.keys(assets)
    const missing = required.filter((name) => !has.some((p) => p.endsWith('/' + name)))
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.error('Missing assets in build:', missing)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Asset assertion skipped:', err?.message || err)
  }
}
