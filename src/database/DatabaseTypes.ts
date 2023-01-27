export interface Account {
    id: string
    gameworldId: string
    username: string
    password: string
}

export interface Gameworld {
    id: string
    uuid: string
    domain: string
    region: string
    name: string
    url: string
    registrationClosed: boolean
    hidden: boolean
    start: number
    end: number
    mainpageBackground: string
    subtitle: string
    speed: string
    mainpageGroups: string[]
}
