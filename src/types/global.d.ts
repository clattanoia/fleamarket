declare namespace Global {

  interface Category {
    id: string,
    name: string,
    icon: string
  }

  interface User {
    nickname: string,
    avatarUrl: string
  }

  interface Goods {
    id: string,
    title: string,
    coverUrl: string,
    price: number,
    categoryName: string,
    owner: User,
    location: {
      province: string,
      city: string
    }
  }
}
