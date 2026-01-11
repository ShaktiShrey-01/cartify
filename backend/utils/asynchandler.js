
// Utility to wrap async route handlers and forward errors to Express
// Usage: app.get('/route', asynchnadler(async (req, res) => { ... }))
const asynchnadler = (requesthandler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch(next)
    }
}

export { asynchnadler }