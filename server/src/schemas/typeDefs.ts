const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    input UserInput {
        username: String
        email: String
        password: String
        savedBooks: [BookInput]
    }
    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    input BookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(input: UserInput!): Auth
        saveBook(book: BookInput!): User
        removeBook(bookId: String!): User
    }
    type Auth {
        token: String
        user: User
    }
`;

export default typeDefs;