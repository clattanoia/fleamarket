declare namespace Global {

  interface Category {
    id: string,
    name: string,
    icon: string
  }

  type ToastStatus = 'error' | 'loading' | 'success'
}
