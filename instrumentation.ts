export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('@/lib/models/connect')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Edge specific monitoring or logging SDKs
  }
}
