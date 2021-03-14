import { getTagById } from "../../../graphql/api";

export default async function tagsHandler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const gqlResponse = await getTagById(id);
  if (gqlResponse.errors) {
    return res.status(404).json(gqlResponse);
  }
  if (!gqlResponse.data.findTagByID) {
    return res.status(404).json({
      errors: [
        {
          message: "Not found",
        },
      ],
    });
  }

  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({
        ...gqlResponse.data.findTagByID,
        jsonData: JSON.parse(gqlResponse.data.findTagByID.jsonData),
      });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
