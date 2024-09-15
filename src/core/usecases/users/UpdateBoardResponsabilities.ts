import { UserRepository } from "@/core/repositories/UserRepository";

type UpdateBoardResponsabilitiesProps = {
  id: number;
  boardResponsabilitiesToSet: number[];
};

export function UpdateBoardResponsabilitiesWrapper(
  userRepository: UserRepository
) {
  return async function UpdateBoardResponsabilities({
    id,
    boardResponsabilitiesToSet,
  }: UpdateBoardResponsabilitiesProps) {
    const userUpdatedBoardResps = await userRepository.setBoardResponsibilities(
      id,
      boardResponsabilitiesToSet
    );

    return userUpdatedBoardResps;
  };
}
