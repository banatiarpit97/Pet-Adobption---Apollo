import { ApolloClient} from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

const cache = new InMemoryCache();

const link = new HttpLink({
    uri: 'https://funded-pet-library.moonhighway.com/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
})

const typeDefs = gql`
    extend type Query {
        toastOptions: ToastOptions!
    }

    type ToastOptions {
        color: String!
        message: String!
    }
`;

const resolvers = {
    Query: {
        ToastOptions: {
            color: () => {
                console.log(11);
            }
        },
    //     toastOptions: (_, __, {cache}) => {
    //         console.log(11);
    //         cache.readQuery({
    //             query: gql`
    //                 query Toast {
    //                     toastOptions @client {
    //                         color
    //                         message
    //                     }
    //                 }
    //             `
    //         })
    //     }
    },
    toastOptions: {
        color: () => {
            console.log(11);
        }
    },
    Mutation: {
        logout: (_, __, {cache, client}) => {
            client.clearStore();
            cache.writeData({data: {toastOptions: {__typename: 'ToastOptions', color: 'green', message: 'Logout Successfull!!'}}})
        }
    }
}

const client = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers
})

const initialStore = {
    data: {
        toastOptions: {
            color: '',
            message: '',
            __typename: 'Toast'
        }
    }
};

cache.writeData(initialStore);

client.onResetStore(() => cache.writeData(initialStore))
client.onClearStore(() => cache.writeData(initialStore))

export default client;