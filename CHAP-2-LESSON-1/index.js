const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')
const {equipments} = require('./database')

// Team이라는 타입이 복수로 들어간다는 뜻!
const typeDefs = gql`
  type Query {
    teams: [Team]
    team(id: Int): Team
    equipments: [Equipments]
    supplies: [Supplies]
  }
  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
    supplies: [Supplies]
  }
  type Equipments {
    id: String
    used_by: String
    count: Int
    new_or_used: String
  }
  type Supplies {
    id: String
    team: Int
  }
`

//위에 쿼리에 실질적으로 행동이 이루어지는게 resolvers이다
//database에서 teams를 반환하는 함수가 teams
const resolvers = {
  Query: {
    teams: () => database.teams
      .map((team) => {
        team.supplies = database.supplies
        .filter((supply) => supply.team === team.id)
        return team
      }),
    team: (parent, args, context, info) => database.teams
      .filter((team) => {
        return team.id === args.id
      })[0],
    equipments: () => database.equipments,
    supplies: () => database.supplies,
  }
}
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
console.log(`🚀  Server ready at ${url}`)
})