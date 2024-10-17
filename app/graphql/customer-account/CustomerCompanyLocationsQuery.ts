export const CUSTOMER_COMPANY_LOCATIONS = `#graphql
    query customer {
  customer {
    id
    companyContacts(first: 1) {
      edges {
        node {
          company {
            id
            name
            locations(first: 1) {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
` as const;