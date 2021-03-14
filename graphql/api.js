import useFetch from "../lib/useFetch";

function getData(data) {
  if (!data || data.errors) return null;
  return data.data;
}

function getErrorMessage(error, data) {
  if (error) return error.message;
  if (data && data.errors) {
    return data.errors[0].message;
  }
  return null;
}

/**
|--------------------------------------------------
| This GraphQL query returns an array of tags
| entries complete with both the provided and implicit
| data attributes.
|
| Learn more about GraphQL: https://graphql.org/learn/
|--------------------------------------------------
*/
export const useTags = () => {
  const query = `query Tags($size: Int) {
    tags(_size: $size) {
      data {
        _id
        _ts
        identifier
        isInTour
        jsonData
        departureTime
        startPort
        destinationPort
      }
      after
    }
  }`;
  const size = 100;
  const { data, error } = useFetch(
    process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { size },
      }),
    }
  );

  return {
    data: getData(data),
    errorMessage: getErrorMessage(error, data),
    error,
  };
};

export const getTagById = async (id) => {
  const query = `query getTagById($id: ID!) {
    findTagByID(id: $id) {
      _id
      _ts
      identifier
      isInTour
      jsonData
      departureTime
      startPort
      destinationPort
    }
  }`;

  const res = await fetch(process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        id,
      },
    }),
  });
  const data = await res.json();

  return data;
};

/**
|--------------------------------------------------
| This GraphQL mutation creates a new Tag with the 
| necessary arguments.
|
| It returns the stored data and includes the unique
| identifier (_id) as well as _ts (time created).
|
| The guestbook uses the _id value as the unique key
| and the _ts value to sort and display the date of
| publication.
|
| Learn more about GraphQL mutations: https://graphql.org/learn/queries/#mutations
|--------------------------------------------------
*/
export const createTag = async (identifier) => {
  const query = `mutation createTag($identifier: String!, $isInTour: Boolean!, $jsonData: String!) {
    createTag(data: {
      identifier: $identifier,
      jsonData: $jsonData,
      isInTour: $isInTour,
    }) {
      _id
      _ts
      identifier
      isInTour
      jsonData
      departureTime
      startPort
      destinationPort
    }
  }`;

  const res = await fetch(process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        identifier,
        isInTour: false,
        jsonData: JSON.stringify([]),
      },
    }),
  });
  const data = await res.json();

  return data;
};
