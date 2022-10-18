import { gql } from '@apollo/client';

const getProductsQuery = gql`
query getCategory ($category: String!) {
  category(input: { title: $category }) {
    products {
      id
      name
      gallery
      brand
      inStock
      attributes {
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          symbol
        }
        amount
      }
    }
  }
}
`
const getCategoryQuery = gql`
{
  categories {
    name
  }
}
`
const getCurrencyQuery = gql`
{
  currencies {
    label
    symbol
  }
}
`
const getproductById = gql`
query getProduct ($productId: String!){
  product(id: $productId) {
    id
    name
    inStock
    gallery
    description
    category
    attributes {
      name
      type
      items {
        displayValue
        value
        id
      }
    }
    prices {
        currency {
          symbol
        }
        amount
      }
    brand
  }
}
`
export {
  getProductsQuery, getCategoryQuery, getCurrencyQuery, getproductById
};