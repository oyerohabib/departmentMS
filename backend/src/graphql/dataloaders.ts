import DataLoader from "dataloader";
import { User } from "../models/User";

export type GraphQLLoaders = {
  userLoader: DataLoader<string, any>;
};

export function createLoaders(): GraphQLLoaders {
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await User.find({ _id: { $in: ids as string[] } }).select(
      "-password"
    );
    const byId = new Map(users.map((u) => [u._id.toString(), u]));
    return ids.map((id) => byId.get(id) ?? null);
  });

  return { userLoader };
}
