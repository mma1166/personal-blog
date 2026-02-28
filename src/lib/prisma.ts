import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // For Prisma 7, if the schema is empty, we must provide the URL.
    // We use a cast to bypass the current strict type issue in the constructor.
    return new (PrismaClient as any)({
        datasourceUrl: process.env.POSTGRES_PRISMA_URL,
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
