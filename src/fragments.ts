
 export const RESTAURANT_FRAGMENT = gql`
   fragment RestaurantParts on Restaurant {
     id
     name
     coverImg
     category {
       name
     }
     address
     isPromoted
   }
 `;