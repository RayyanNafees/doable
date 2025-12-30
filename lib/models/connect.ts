import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URI as string).then(e=> console.info(`Mongodb connected to host: ${e.connection.host}`)).catch(e=> console.error(`[ERROR] Mongodb connection error: ${e}`))