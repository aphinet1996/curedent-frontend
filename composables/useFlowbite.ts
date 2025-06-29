export function useFlowbite(callback: (flowbite: typeof import('flowbite')) => void) {
  if (import.meta.client) {
    import('flowbite').then((flowbite) => {
      callback(flowbite)
    })
  }
}