import express, { Express, Request } from "express";
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors'
import { ApolloServer } from "@apollo/server";
import { loadFiles } from '@graphql-tools/load-files'
import { resolvers } from "./resolvers/resolvers";
const app: Express = express()
const port = process.env.PORT || 3000;
app.use(cors(), express.json())
interface ApolloServerContext {
    token: string;
}
const getContext = async ({req}: {req: Request}) => {
    const context: {token: string} = {token: ''}
    const token = req.headers.authorization || '';
    if(token){
        context.token = token.replace('Bearer ', '')
    }
    return context;
}

async function startApolloServer() {
    const typeDefs = await loadFiles('./src/**/*.graphql');
    const apolloServer = new ApolloServer<ApolloServerContext>({ typeDefs, resolvers });
    await apolloServer.start();
    app.use('/graphql', expressMiddleware(apolloServer, { context: getContext}));
}
startApolloServer().then(() => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error starting server:', err);
});
