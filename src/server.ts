import { PrismaClient } from '@prisma/client';
import fastify from 'fastify'; 
import { z } from 'zod'; 

const app = fastify(); 

const primsa = new PrismaClient()

app.get('/users', async () => {   
    const users = await primsa.user.findMany(); 

    return { users }

}) 

app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email()
    })
    const { name, email } = createUserSchema.parse(request.body)
    
    await primsa.user.create({
        data: {
            name, 
            email
        }
    })

    return reply.status(201).send()
}) 

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333 
}).then(() => { 
    console.log("HTTP Server running")
})